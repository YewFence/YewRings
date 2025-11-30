import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

const contentDirectory = path.join(process.cwd(), 'content/pages');
const metaPath = path.join(process.cwd(), 'content/meta.json');

export function getPageContent<T = any>(pageName: string): T {
  const fullPath = path.join(contentDirectory, `${pageName}.json`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

export function getMetaContent<T = any>(): T {
  const fileContents = fs.readFileSync(metaPath, 'utf8');
  return JSON.parse(fileContents);
}

/**
 * 从页面 JSON 配置中提取 metadata
 */
export function getPageMetadata(pageName: string): Metadata {
  const content = getPageContent(pageName);
  return {
    title: content.metadata?.title,
    description: content.metadata?.description,
  };
}
