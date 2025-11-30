import fs from 'fs';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'content/pages');

export function getPageContent<T = any>(pageName: string): T {
  const fullPath = path.join(contentDirectory, `${pageName}.json`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}
