import { getSortedPostsData } from "@/lib/mdx";
import BlogListClient from "@/components/blog/BlogListClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "博客列表 | Liquid Space",
  description: "探索关于前端技术、设计与未来的思考。",
};

export default function BlogPage() {
  // 1. 在服务端获取数据 (Server Component)
  // 这里的 fetch 是直接读取文件系统，非常快
  const allPosts = getSortedPostsData();

  return (
    <div className="min-h-screen py-24 px-4 sm:px-8">
      {/* 页面头部：大标题 */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-br from-white via-white/80 to-white/40 tracking-tight pb-2">
          思维碎片
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          这里汇集了我对代码、设计与未来的液态思考。
          <br className="hidden md:block" />
          像水一样流动，像玻璃一样透明。
        </p>
      </div>

      {/* 2. 将数据传递给客户端组件进行渲染和交互 */}
      <BlogListClient posts={allPosts} />
    </div>
  );
}