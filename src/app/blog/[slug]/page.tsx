import { getPostData, getSortedPostsData } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

// 预生成静态路径 (SSG) - 对SEO非常重要
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content, meta } = getPostData(slug);

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* 返回按钮 */}
      <Link href="/blog" className="inline-block mb-8">
        <GlassButton variant="secondary" size="sm">
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </GlassButton>
      </Link>

      {/* 头部信息 */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm mb-4 font-mono">
          <Calendar className="w-4 h-4" />
          <span>{meta.date}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          {meta.title}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          {meta.description}
        </p>
      </div>

      {/* 文章正文容器：玻璃卡片 + Typography 插件 */}
      <GlassCard className="p-8 md:p-12" hoverEffect={false}>
        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-cyan-300 hover:prose-a:text-cyan-200">
          {/* MDX 渲染器 */}
          <MDXRemote source={content} />
        </article>
      </GlassCard>
    </div>
  );
}