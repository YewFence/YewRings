import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

const contentDirectory = path.join(process.cwd(), 'content/pages');
const metaPath = path.join(process.cwd(), 'content/meta.json');
const categoriesPath = path.join(process.cwd(), 'content/pages/categories.json');

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

/**
 * 获取分类配置
 * @param category 分类名称（不区分大小写）
 * @returns 分类配置，如果不存在则返回null
 */
export function getCategoryConfig(category: string): { name: string; title: string; description: string[] } | null {
  try {
    if (!fs.existsSync(categoriesPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(fileContents);
    
    // 首先尝试精确匹配
    if (categories[category]) {
      return categories[category];
    }
    
    // 尝试小写匹配
    const lowerCategory = category.toLowerCase();
    if (categories[lowerCategory]) {
      return categories[lowerCategory];
    }
    
    // 尝试处理单复数（如果分类是单数，但配置中是复数）
    if (category.endsWith('y')) {
      const pluralCategory = category.slice(0, -1) + 'ies';
      if (categories[pluralCategory]) {
        return categories[pluralCategory];
      }
    } else if (!category.endsWith('s')) {
      const pluralCategory = category + 's';
      if (categories[pluralCategory]) {
        return categories[pluralCategory];
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * 获取所有分类的显示名称映射
 * @returns 对象，键为分类ID，值为显示名称
 */
export function getAllCategoryDisplayNames(): Record<string, string> {
  try {
    if (!fs.existsSync(categoriesPath)) {
      return {};
    }
    
    const fileContents = fs.readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(fileContents);
    
    const result: Record<string, string> = {};
    for (const [key, config] of Object.entries(categories)) {
      const categoryConfig = config as { name: string; title: string; description: string[] };
      result[key] = categoryConfig.name;
    }
    
    return result;
  } catch {
    return {};
  }
}
