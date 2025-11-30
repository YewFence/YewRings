import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { Sparkles, ArrowRight, Github, BookOpen, Terminal } from "lucide-react";
import { getSortedPostsData } from "@/lib/mdx";

export default function Home() {
  // 获取最新的文章
  const allPosts = getSortedPostsData();
  const recentPosts = allPosts.slice(0, 2);
  
  // 计算最后更新时间（取最新文章日期，如果没有则显示初始日期）
  const lastUpdate = allPosts.length > 0 ? allPosts[0].date : "2025.11.30";

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero 区域 - 占据全屏 (减去导航栏高度 pt-24 = 6rem) */}
      <div className="h-[calc(100vh-6rem)] flex flex-col items-center justify-center relative px-4">
        <div className="text-center space-y-8 max-w-4xl relative z-10 -mt-20">
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60 pb-2 leading-tight drop-shadow-2xl">
            Liquid Blog
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300/80 max-w-2xl mx-auto leading-relaxed font-light">
            探索数字世界的边界 · iOS 26 概念设计
            <br />
            <span className="text-sm text-slate-400 mt-4 flex items-center justify-center gap-3">
              <Terminal className="w-4 h-4 text-cyan-200/80" /> Next.js 15 · Tailwind CSS · Framer Motion
            </span>
          </p>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link href="/blog">
              <GlassButton size="lg" icon={<BookOpen className="w-4 h-4" />}>
                开始阅读
              </GlassButton>
            </Link>
            <Link href="https://github.com" target="_blank">
              <GlassButton variant="secondary" size="lg" icon={<Github className="w-4 h-4" />}>
                GitHub
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* 滚动提示 */}
        <ScrollIndicator />
      </div>

      {/* 最新文章区域 - 下一页 */}
      <div id="latest-posts" className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-b from-transparent to-black/20 py-24 px-4">
        <div className="w-full max-w-5xl space-y-8">
          <div className="flex items-center justify-between px-2 border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-semibold text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                最新发布
              </h2>
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-cyan-300 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="tracking-wider font-mono">LAST UPDATE: {lastUpdate}</span>
              </div>
            </div>
            <Link href="/blog" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group">
              全部文章 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
                  <GlassCard className="p-8 group cursor-pointer h-full flex flex-col hover:bg-white/10 transition-colors border-white/5 hover:border-cyan-500/30">
                    <div className="flex items-center justify-between mb-6">
                      <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                        Post
                      </div>
                      <span className="text-xs font-mono text-slate-400">{post.date}</span>
                    </div>
                    <h3 className="text-3xl font-semibold mb-4 text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 mb-6 line-clamp-3 grow text-base leading-relaxed">
                      {post.description}
                    </p>
                    <div className="flex items-center text-sm text-cyan-300 font-medium mt-auto pt-6 border-t border-white/5">
                      阅读全文 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </GlassCard>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-slate-500">
                暂无文章
              </div>
            )}

            {/* 补充卡片：如果文章少于2篇，显示一个占位符保持布局平衡 */}
            {recentPosts.length === 1 && (
               <GlassCard className="p-8 flex flex-col items-center justify-center text-center h-full min-h-80 border-dashed border-white/10 bg-transparent">
                  <div className="p-4 rounded-full bg-white/5 mb-4">
                    <Sparkles className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl text-slate-300 mb-2">更多内容筹备中</h3>
                  <p className="text-slate-500 text-sm">敬请期待后续更新...</p>
               </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}