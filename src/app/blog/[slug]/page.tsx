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
import { LicenseCard } from "@/components/blog/LicenseCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { getPageContent } from "@/lib/content-loader";

// 预生成静态路径 (SSG) - 对SEO非常重要
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 动态生成页面元数据（标题、描述等）
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getPostData(slug);

  return {
    title: meta.title,
    description: meta.description,
    authors: meta.author ? [{ name: meta.author }] : undefined,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
      authors: meta.author ? [meta.author] : undefined,
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content, meta, headings } = getPostData(slug);
  const pageContent = getPageContent('blog');
  const postPageContent = getPageContent('post'); // Load post.json content

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 pb-20">
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
                {pageContent.post.backToList}
              </GlassButton>
            </Link>
          </BlogPostBackButton>

          {/* 头部信息 */}
          <BlogPostHeader title={meta.title} description={meta.description} date={meta.date} author={meta.author} />

          {/* 文章正文容器 */}
          <BlogPostGlassCard className="p-4 sm:p-8 md:p-12">
            <BlogPostContent>
              <article className="prose prose-invert md:prose-lg max-w-none prose-headings:font-bold prose-a:text-cyan-300 hover:prose-a:text-cyan-200">
                <MDXRemote
                  source={content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm, remarkMath],
                      rehypePlugins: [rehypeSlug, rehypeKatex],
                    },
                  }}
                />
                
                {/* 版权声明组件 */}
                <LicenseCard title={meta.title} slug={slug} config={postPageContent.license} />
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