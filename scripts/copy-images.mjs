/**
 * 图片复制脚本
 * 将 content/posts/images/ 下的图片复制到 public/images/posts/
 * 在 dev 和 build 前自动执行
 */
import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const sourceDir = join(rootDir, "content", "posts", "images");
const targetDir = join(rootDir, "public", "images", "posts");

// 支持的图片扩展名
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico", ".avif"];

function copyImages() {
  // 如果源目录不存在，直接返回
  if (!existsSync(sourceDir)) {
    console.log("📁 图片源目录不存在，跳过复制");
    return;
  }

  // 确保目标目录存在
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // 读取源目录下的所有文件
  const files = readdirSync(sourceDir);
  let copiedCount = 0;

  for (const file of files) {
    const sourcePath = join(sourceDir, file);
    const targetPath = join(targetDir, file);

    // 跳过目录和非图片文件
    try {
      if (statSync(sourcePath).isDirectory()) continue;
    } catch (err) {
      console.warn(`无法访问文件 ${file}：`, err.message);
      continue;
    }
    const ext = extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;

    // 复制文件
    try {
      copyFileSync(sourcePath, targetPath);
      copiedCount++;
    } catch (err) {
      console.warn(`复制文件 ${file} 失败：`, err.message);
    }
  }

  if (copiedCount > 0) {
    console.log(`✅ 已复制 ${copiedCount} 张图片到 public/images/posts/`);
  } else {
    console.log("📷 没有图片需要复制");
  }
}

copyImages();
