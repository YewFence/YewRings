import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import Slugger from 'github-slugger';
import type { Node } from 'unist';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const metaFilePath = path.join(process.cwd(), 'content/meta.json');

// 文章文件信息
interface PostFile {
  filePath: string;              // 完整文件路径
  slug: string;                  // 文件名（不含扩展名）
  category: string | undefined;  // 从文件夹名推导的分类
}

/**
 * 递归扫描目录获取所有 MDX 文章文件
 * @returns 所有文章文件信息数组
 */
function getAllPostFiles(): PostFile[] {
  const results: PostFile[] = [];

  function scanDirectory(dirPath: string, category?: string) {
    if (!fs.existsSync(dirPath)) return;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // 递归扫描子目录，子目录名作为分类
        scanDirectory(fullPath, entry.name);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        results.push({
          filePath: fullPath,
          slug: entry.name.replace(/\.mdx$/, ''),
          category,  // 来自文件夹名，根目录文章为 undefined
        });
      }
    }
  }

  scanDirectory(postsDirectory);

  // 生产环境过滤测试文章：test 分类 或 文件名以 test 开头
  if (process.env.NODE_ENV === 'production') {
    return results.filter((post) =>
      post.category !== 'test' && !post.slug.startsWith('test')
    );
  }

  return results;
}

/**
 * 根据 slug 查找文章文件路径
 * @param slug 文章 slug
 * @returns 文章文件信息，未找到返回 null
 */
function findPostFile(slug: string): PostFile | null {
  const postFiles = getAllPostFiles();
  return postFiles.find((pf) => pf.slug === slug) || null;
}

type DefaultMeta = {
  author?: string;
};

type MetaConfig = {
  default?: DefaultMeta;
};

function getDefaultMeta(): DefaultMeta {
  try {
    if (fs.existsSync(metaFilePath)) {
      const content = fs.readFileSync(metaFilePath, 'utf8');
      const config: MetaConfig = JSON.parse(content);
      return config.default || {};
    }
  } catch {
    // 忽略读取错误
  }
  return {};
}

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  time?: string; // 文章时间 (HH:mm 格式)
  updatedAt?: string; // 文章更新日期
  description: string;
  author?: string;
  category?: string;
};

export type Heading = {
  level: number;
  text: string;
  slug: string;
};

// 扩展Node类型以包含value属性
interface TextNode extends Node {
  value: string;
}

// 扩展Node类型以包含depth和children属性
interface HeadingNode extends Node {
  depth: number;
  children: TextNode[];
}

/**
 * 处理文章的时间字段
 * @param dataTime frontmatter 中的 time 值
 * @param filePath 文件路径（用于获取文件修改时间）
 * @returns 格式化后的时间字符串，或 undefined
 */
function resolveTime(dataTime: string | undefined, filePath: string): string | undefined {
  if (!dataTime) return undefined;

  if (dataTime === 'auto') {
    const stats = fs.statSync(filePath);
    const mtime = stats.mtime;
    return `${String(mtime.getHours()).padStart(2, '0')}:${String(mtime.getMinutes()).padStart(2, '0')}`;
  }

  return dataTime;
}

/**
 * 处理文章的更新日期字段
 * @param dataUpdated frontmatter 中的 updated 值
 * @param filePath 文件路径（用于获取文件修改时间）
 * @param date 文章创建日期（用于比较是否需要显示更新日期）
 * @returns 更新日期字符串，如果与创建日期相同则返回 undefined
 */
function resolveUpdatedAt(
  dataUpdated: string | undefined,
  filePath: string,
  date: string
): string | undefined {
  if (!dataUpdated) return undefined;

  const updatedAt =
    dataUpdated === 'auto'
      ? fs.statSync(filePath).mtime.toISOString().split('T')[0]
      : dataUpdated;

  // 如果修改日期和创建日期相同，则不返回 updatedAt
  return updatedAt !== date ? updatedAt : undefined;
}

/**
 * 从 MDX 内容中提取标题
 * @param content MDX 文件内容
 * @returns 标题数组
 */
function extractHeadings(content: string): Heading[] {
  const slugger = new Slugger();
  const tree = unified().use(remarkParse).parse(content);
  const headings: Heading[] = [];

  visit(tree, 'heading', (node) => {
    const headingNode = node as HeadingNode;
    // 我们只关心 h2, h3, h4
    if (headingNode.depth > 1 && headingNode.depth < 5) {
      // 从子节点中提取纯文本
      const text = headingNode.children
        .filter((child): child is TextNode => 'value' in child)
        .map((child) => child.value)
        .join('');
      headings.push({
        level: headingNode.depth,
        text,
        slug: slugger.slug(text),
      });
    }
  });

  return headings;
}


export function getSortedPostsData(): PostMeta[] {
  const postFiles = getAllPostFiles();

  const allPostsData = postFiles.map(({ filePath, slug, category: folderCategory }) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    const postData: PostMeta = {
      slug,
      date: data.date,
      title: data.title,
      description: data.description,
      author: data.author,
      // 优先使用文件夹名作为分类，fallback 到 frontmatter
      category: folderCategory || data.category,
      time: resolveTime(data.time, filePath),
      updatedAt: resolveUpdatedAt(data.updated, filePath, data.date),
    };

    return postData;
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string) {
  const postFile = findPostFile(slug);
  if (!postFile) {
    throw new Error(`Post not found: ${slug}`);
  }

  const { filePath, category: folderCategory } = postFile;
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContents);
  const defaultMeta = getDefaultMeta();

  const headings = extractHeadings(content);

  // 如果文章没有指定 author，则使用默认配置
  const author = data.author || defaultMeta.author || '';

  const meta: Omit<PostMeta, 'slug'> = {
    date: data.date,
    title: data.title,
    description: data.description,
    // 优先使用文件夹名作为分类，fallback 到 frontmatter
    category: folderCategory || data.category,
    author,
    time: resolveTime(data.time, filePath),
    updatedAt: resolveUpdatedAt(data.updated, filePath, data.date),
  };

  return {
    content,
    meta,
    headings,
  };
}

// 包含完整内容的文章类型
export type PostWithContent = PostMeta & {
  content: string;
};

/**
 * 获取指定分类的文章列表（包含完整 MDX 内容）
 * 用于随笔页面等需要直接展示内容的场景
 * @param category 文章分类
 * @returns 包含完整内容的文章数组，按日期+时间降序排列
 */
export function getPostsWithContent(category?: string): PostWithContent[] {
  const postFiles = getAllPostFiles();

  const posts = postFiles.map(({ filePath, slug, category: folderCategory }) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContents);

    const post: PostWithContent = {
      slug,
      date: data.date,
      title: data.title || '', // 标题可为空
      description: data.description || '',
      author: data.author,
      // 优先使用文件夹名作为分类，fallback 到 frontmatter
      category: folderCategory || data.category,
      content,
      time: resolveTime(data.time, filePath),
      updatedAt: resolveUpdatedAt(data.updated, filePath, data.date),
    };

    return post;
  });

  // 按分类过滤
  const filteredPosts = category
    ? posts.filter((post) => post.category?.toLowerCase() === category.toLowerCase())
    : posts;

  // 按日期+时间降序排列
  return filteredPosts.sort((a, b) => {
    const dateA = `${a.date} ${a.time || '00:00'}`;
    const dateB = `${b.date} ${b.time || '00:00'}`;
    return dateB.localeCompare(dateA);
  });
}