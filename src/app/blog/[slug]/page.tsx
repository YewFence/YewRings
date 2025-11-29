import { getPostData, getSortedPostsData } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { GlassButton } from "@/components/ui/GlassButton";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { TableOfContents } from "@/components/blog/TableOfContents";
import {
  BlogPostContent,
  BlogPostHeader,
  BlogPostSidebar,
  BlogPostBackButton,
} from "@/components/blog/BlogPostContent";
import { BlogPostGlassCard } from "@/components/blog/BlogPostGlassCard";
import { ArrowLeft } from "lucide-react";
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
        <BlogPostSidebar>
          <TableOfContents headings={headings} />
        </BlogPostSidebar>

        {/* 右侧主内容区 */}
        <main className="lg:col-span-3 py-8">
          {/* 返回按钮 */}
          <BlogPostBackButton>
            <Link href="/blog">
              <GlassButton variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4" />
                返回列表
              </GlassButton>
            </Link>
          </BlogPostBackButton>

          {/* 头部信息 */}
          <BlogPostHeader title={meta.title} description={meta.description} date={meta.date} />

          {/* 文章正文容器 */}
          <BlogPostGlassCard className="p-8 md:p-12">
            <BlogPostContent>
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
            </BlogPostContent>
          </BlogPostGlassCard>
        </main>
      </div>

      {/* 回到顶部按钮 */}
      <ScrollToTopButton />
    </div>
  );
}