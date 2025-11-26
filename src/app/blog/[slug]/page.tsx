import { getPostData, getSortedPostsData } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

// 预生成静态路径 (SSG) - 对SEO非常重要
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content, meta, headings } = getPostData(slug);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 pb-20">
      <div className="lg:grid lg:grid-cols-4 lg:gap-12">
        {/* 左侧 TOC (仅在 lg 及以上屏幕显示) */}
        <aside className="hidden lg:block col-span-1 py-8">
          <TableOfContents headings={headings} />
        </aside>

        {/* 右侧主内容区 */}
        <main className="lg:col-span-3 py-8">
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

          {/* 文章正文容器 */}
          <GlassCard className="p-8 md:p-12" hoverEffect={false}>
            <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-cyan-300 hover:prose-a:text-cyan-200">
              <MDXRemote
                source={content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm, remarkMath],
                    rehypePlugins: [rehypeSlug, rehypeKatex],
                  },
                }}
              />
            </article>
          </GlassCard>
        </main>
      </div>

      {/* 回到顶部按钮 */}
      <ScrollToTopButton />
    </div>
  );
}