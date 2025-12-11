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
  // 如果目录不存在，防止报错
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  
  // 过滤文件：
  // 1. 必须是 .mdx 结尾
  // 2. 在生产环境中，过滤掉以 'test' 开头的文件
  const filteredFileNames = fileNames.filter((fileName) => {
    if (!fileName.endsWith('.mdx')) return false;
    
    if (process.env.NODE_ENV === 'production' && fileName.startsWith('test')) {
      return false;
    }
    
    return true;
  });

  const allPostsData = filteredFileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    const postData: PostMeta = {
      slug,
      date: data.date,
      title: data.title,
      description: data.description,
      author: data.author,
      category: data.category,
    };

    // 处理 time 字段
    if (data.time) {
      if (data.time === 'auto') {
        const stats = fs.statSync(fullPath);
        const mtime = stats.mtime;
        postData.time = `${String(mtime.getHours()).padStart(2, '0')}:${String(mtime.getMinutes()).padStart(2, '0')}`;
      } else {
        postData.time = data.time;
      }
    }

    let updatedAt: string | undefined;

    if (data.updated) {
      if (data.updated === 'auto') {
        const stats = fs.statSync(fullPath);
        updatedAt = stats.mtime.toISOString().split('T')[0];
      } else {
        updatedAt = data.updated;
      }
      
      // 如果修改日期和创建日期不同，则添加 updatedAt
      if (updatedAt && postData.date !== updatedAt) {
        postData.updatedAt = updatedAt;
      }
    }

    return postData;
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content, data } = matter(fileContents);
  const defaultMeta = getDefaultMeta();

  const headings = extractHeadings(content);

  // 如果文章没有指定 author，则使用默认配置
  const author = data.author || defaultMeta.author || '';

  const meta: Omit<PostMeta, 'slug'> = {
    date: data.date,
    title: data.title,
    description: data.description,
    category: data.category,
    author,
  };

  // 处理 time 字段
  if (data.time) {
    if (data.time === 'auto') {
      const stats = fs.statSync(fullPath);
      const mtime = stats.mtime;
      meta.time = `${String(mtime.getHours()).padStart(2, '0')}:${String(mtime.getMinutes()).padStart(2, '0')}`;
    } else {
      meta.time = data.time;
    }
  }

  let updatedAt: string | undefined;

  if (data.updated) {
    if (data.updated === 'auto') {
      const stats = fs.statSync(fullPath);
      updatedAt = stats.mtime.toISOString().split('T')[0];
    } else {
      updatedAt = data.updated;
    }

    // 如果修改日期和创建日期不同，则添加 updatedAt
    if (updatedAt && meta.date !== updatedAt) {
      meta.updatedAt = updatedAt;
    }
  }

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
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const filteredFileNames = fileNames.filter((fileName) => {
    if (!fileName.endsWith('.mdx')) return false;
    if (process.env.NODE_ENV === 'production' && fileName.startsWith('test')) {
      return false;
    }
    return true;
  });

  const posts = filteredFileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { content, data } = matter(fileContents);

    const post: PostWithContent = {
      slug,
      date: data.date,
      title: data.title || '', // 标题可为空
      description: data.description || '',
      author: data.author,
      category: data.category,
      content,
    };

    // 处理 time 字段
    if (data.time) {
      if (data.time === 'auto') {
        const stats = fs.statSync(fullPath);
        const mtime = stats.mtime;
        post.time = `${String(mtime.getHours()).padStart(2, '0')}:${String(mtime.getMinutes()).padStart(2, '0')}`;
      } else {
        post.time = data.time;
      }
    }

    // 处理 updatedAt 字段
    if (data.updated) {
      let updatedAt: string;
      if (data.updated === 'auto') {
        const stats = fs.statSync(fullPath);
        updatedAt = stats.mtime.toISOString().split('T')[0];
      } else {
        updatedAt = data.updated;
      }
      if (updatedAt && post.date !== updatedAt) {
        post.updatedAt = updatedAt;
      }
    }

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