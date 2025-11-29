import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import Slugger from 'github-slugger';
import type { Node } from 'unist';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
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
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      ...data,
    } as PostMeta;
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content, data } = matter(fileContents);

  const headings = extractHeadings(content);
  
  return {
    content,
    meta: data as Omit<PostMeta, 'slug'>,
    headings,
  };
}