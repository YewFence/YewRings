import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CATEGORY_ESSAY } from '@/constants/categories';
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

// 模块级缓存，避免重复扫描目录
let postFilesCache: PostFile[] | null = null;

/**
 * 递归扫描目录获取所有 MDX 文章文件
 * 结果会被缓存，同一进程内后续调用直接返回缓存
 * @returns 所有文章文件信息数组
 */
function getAllPostFiles(): PostFile[] {
  if (postFilesCache !== null) {
    return postFilesCache;
  }

  const results: PostFile[] = [];

  function scanDirectory(dirPath: string, category?: string) {
    if (!fs.existsSync(dirPath)) return;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // 递归扫描子目录，子目录名作为分类（统一转小写）
        scanDirectory(fullPath, entry.name.toLowerCase());
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        results.push({
          filePath: fullPath,
          slug: entry.name.replace(/\.mdx?$/, ''),
          category,  // 来自文件夹名，根目录文章为 undefined
        });
      }
    }
  }

  scanDirectory(postsDirectory);

  // 生产环境过滤测试文章：test 分类 或 文件名以 test 开头
  // 可以通过设置环境变量 INCLUDE_TEST_POSTS=true 来包含测试文章
  if (process.env.NODE_ENV === 'production' && process.env.INCLUDE_TEST_POSTS !== 'true') {
    postFilesCache = results.filter((post) =>
      post.category !== 'test' && !post.slug.startsWith('test')
    );
    return postFilesCache;
  }

  postFilesCache = results;
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

// 时段常量
const TIME_PERIODS = ['深夜', '早上', '中午', '下午', '夜晚'] as const;
type TimePeriod = (typeof TIME_PERIODS)[number];

/**
 * 将小时转换为时段名称
 * - 早上：6:00 - 11:59
 * - 中午：12:00 - 13:59
 * - 下午：14:00 - 17:59
 * - 夜晚：18:00 - 21:59
 * - 深夜：22:00 - 5:59
 */
function hourToTimePeriod(hour: number): TimePeriod {
  if (hour >= 6 && hour < 12) return '早上';
  if (hour >= 12 && hour < 14) return '中午';
  if (hour >= 14 && hour < 18) return '下午';
  if (hour >= 18 && hour < 22) return '夜晚';
  return '深夜';
}

/**
 * 判断字符串是否为有效的时段名称
 */
function isTimePeriod(value: string): value is TimePeriod {
  return (TIME_PERIODS as readonly string[]).includes(value);
}

/**
 * 标准化日期格式
 * 支持 Date 对象（YAML 不带引号的日期）和字符串（带引号的日期）
 * @param date 日期值，可能是 Date 对象或字符串
 * @returns 标准化后的日期字符串 (YYYY-MM-DD)
 */
function normalizeDate(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date;
}

/**
 * 解析文章日期，支持 fallback 到文件创建时间
 * @param date frontmatter 中的 date 值
 * @param filePath 文件路径（用于获取文件创建时间作为 fallback）
 * @returns 标准化后的日期字符串 (YYYY-MM-DD)
 */
function resolveDate(date: string | Date | undefined, filePath: string): string {
  if (date !== undefined) {
    return normalizeDate(date);
  }
  // fallback: 使用文件创建时间（birthtime）
  const stats = fs.statSync(filePath);
  return stats.birthtime.toISOString().split('T')[0];
}

/**
 * 处理文章的时间字段
 * @param dataTime frontmatter 中的 time 值
 * @param filePath 文件路径（用于获取文件修改时间）
 * @param isEssay 是否为随笔分类（随笔自动获取时间并显示时段）
 * @returns 格式化后的时间字符串，或 undefined
 */
function resolveTime(
  dataTime: string | undefined,
  filePath: string,
  isEssay: boolean
): string | undefined {
  // 随笔：没有 time 字段时自动获取
  if (isEssay && !dataTime) {
    const stats = fs.statSync(filePath);
    return hourToTimePeriod(stats.mtime.getHours());
  }

  if (!dataTime) return undefined;

  // 如果已经是时段名称，直接返回
  if (isTimePeriod(dataTime)) return dataTime;

  // auto: 从文件修改时间获取
  if (dataTime === 'auto') {
    const stats = fs.statSync(filePath);
    const hour = stats.mtime.getHours();
    if (isEssay) {
      return hourToTimePeriod(hour);
    }
    const minutes = stats.mtime.getMinutes();
    return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  // 解析 HH:mm 格式并转换为时段（仅随笔）
  const match = dataTime.match(/^(\d{1,2}):(\d{2})$/);
  if (match && isEssay) {
    const hour = parseInt(match[1], 10);
    return hourToTimePeriod(hour);
  }

  return dataTime;
}

/**
 * 处理文章的更新日期字段
 * @param dataUpdated frontmatter 中的 updated 值
 * @param filePath 文件路径（用于获取文件修改时间）
 * @param date 文章创建日期（用于比较是否需要显示更新日期）
 * @param isEssay 是否为随笔分类（随笔自动获取更新日期）
 * @returns 更新日期字符串，如果与创建日期相同则返回 undefined
 */
function resolveUpdatedAt(
  dataUpdated: string | undefined,
  filePath: string,
  date: string,
  isEssay: boolean
): string | undefined {
  // 随笔：没有 updated 字段时自动获取
  if (isEssay && !dataUpdated) {
    const updatedAt = fs.statSync(filePath).mtime.toISOString().split('T')[0];
    return updatedAt !== date ? updatedAt : undefined;
  }

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
    const date = resolveDate(data.date, filePath);
    const category = folderCategory || data.category;
    const isEssay = category?.toLowerCase() === CATEGORY_ESSAY;

    const postData: PostMeta = {
      slug,
      date,
      title: data.title,
      description: data.description,
      author: data.author,
      // 优先使用文件夹名作为分类，fallback 到 frontmatter
      category,
      time: resolveTime(data.time, filePath, isEssay),
      updatedAt: resolveUpdatedAt(data.updated, filePath, date, isEssay),
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
  const date = resolveDate(data.date, filePath);
  const category = folderCategory || data.category;
  const isEssay = category?.toLowerCase() === CATEGORY_ESSAY;

  const headings = extractHeadings(content);

  // 如果文章没有指定 author，则使用默认配置
  const author = data.author || defaultMeta.author || '';

  const meta: Omit<PostMeta, 'slug'> = {
    date,
    title: data.title,
    description: data.description,
    // 优先使用文件夹名作为分类，fallback 到 frontmatter
    category,
    author,
    time: resolveTime(data.time, filePath, isEssay),
    updatedAt: resolveUpdatedAt(data.updated, filePath, date, isEssay),
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
    const date = resolveDate(data.date, filePath);
    const postCategory = folderCategory || data.category;
    const isEssay = postCategory?.toLowerCase() === CATEGORY_ESSAY;

    const post: PostWithContent = {
      slug,
      date,
      title: data.title || '', // 标题可为空
      description: data.description || '',
      author: data.author,
      // 优先使用文件夹名作为分类，fallback 到 frontmatter
      category: postCategory,
      content,
      time: resolveTime(data.time, filePath, isEssay),
      updatedAt: resolveUpdatedAt(data.updated, filePath, date, isEssay),
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
