import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

type MdxImageProps = ComponentPropsWithoutRef<"img">;

/**
 * MDX 自定义图片组件
 * 包装 next/image 以提供懒加载和响应式支持
 */
export function MdxImage({ src, alt, ...props }: MdxImageProps) {
  // src 可能是 string 或其他类型，只处理 string
  if (!src || typeof src !== "string") return null;

  // 外部图片或 data URI 直接使用原生 img
  const isExternal = src.startsWith("http") || src.startsWith("data:");

  // 本地文章图片：不以 http/data:// 开头的相对路径
  // 例如 "hello-world.cover.png" -> "/images/posts/hello-world.cover.png"
  const isPostImage = !isExternal && !src.startsWith("/");
  const resolvedSrc = isPostImage ? `/images/posts/${src}` : src;

  if (isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className="rounded-lg"
        {...props}
      />
    );
  }

  // 本地图片使用 next/image（包括文章图片和其他本地图片）
  return (
    <Image
      src={resolvedSrc}
      alt={alt || ""}
      width={800}
      height={450}
      className="rounded-lg"
      style={{ width: "100%", height: "auto" }}
    />
  );
}
