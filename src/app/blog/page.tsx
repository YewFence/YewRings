import { getSortedPostsData } from "@/lib/mdx";
import BlogListClient from "@/components/blog/BlogListClient";
import { BlogPageHeader } from "@/components/blog/BlogPageHeader";
import { Metadata } from "next";
import { getPageContent, getPageMetadata } from "@/lib/content-loader";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('blog');
}

export default function BlogPage() {
  // 1. 在服务端获取数据 (Server Component)
  // 这里的 fetch 是直接读取文件系统，非常快
  const allPosts = getSortedPostsData();
  const content = getPageContent('blog');

  return (
    <div className="min-h-screen py-24 px-4 sm:px-8">
      {/* 页面头部：大标题（客户端组件，支持过渡动画） */}
      <BlogPageHeader title={content.header.title} description={content.header.description} />

      {/* 2. 将数据传递给客户端组件进行渲染和交互 */}
      <BlogListClient 
        posts={allPosts} 
        searchPlaceholder={content.list.searchPlaceholder} 
        emptyState={content.list.emptyState} 
      />
    </div>
  );
}
