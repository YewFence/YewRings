"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTransition } from "@/contexts/TransitionContext";
import type { PostMeta } from "@/lib/mdx";

// 动画变体配置：容器控制子元素的交错播放
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 每个子元素间隔 0.1秒出现，形成流水感
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
} as const;

// 动画变体配置：单个卡片的浮现动画
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
} as const;

export default function BlogListClient({ posts }: { posts: PostMeta[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clickedSlug, setClickedSlug] = useState<string | null>(null);
  const { isTransitioning, startTransition } = useTransition();
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 前端过滤逻辑
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 处理卡片点击
  const handleCardClick = useCallback(
    (post: PostMeta, slug: string) => {
      if (isTransitioning) return;

      const cardElement = cardRefs.current.get(slug);
      if (!cardElement) return;

      const rect = cardElement.getBoundingClientRect();
      setClickedSlug(slug);
      startTransition(rect, post, slug);
    },
    [isTransitioning, startTransition]
  );

  // 保存卡片 ref
  const setCardRef = useCallback((slug: string, element: HTMLDivElement | null) => {
    if (element) {
      cardRefs.current.set(slug, element);
    } else {
      cardRefs.current.delete(slug);
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 搜索栏区域 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -20 : 0 }}
        transition={{ duration: 0.3 }}
        className="relative mb-12 max-w-xl mx-auto"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="搜索灵感..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all shadow-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* 装饰性光晕 */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-cyan-500/20 blur-xl opacity-0 focus-within:opacity-100 transition-opacity duration-500" />
      </motion.div>

      {/* 文章网格 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isTransitioning ? "exit" : "show"}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <div
                onClick={() => handleCardClick(post, post.slug)}
                className="cursor-pointer"
              >
                <GlassCard
                  ref={(el) => setCardRef(post.slug, el)}
                  className="h-full p-8 group flex flex-col justify-between hover:shadow-cyan-900/20"
                  disableInitialAnimation
                  style={{
                    // 被点击的卡片保持可见，克隆卡片会覆盖在上面
                    visibility: clickedSlug === post.slug ? "hidden" : "visible",
                  }}
                >
                  <div>
                    {/* 顶部元数据 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/30 px-2 py-1 rounded-md border border-cyan-500/20">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                      <Sparkles className="w-4 h-4 text-slate-600 group-hover:text-yellow-200 transition-colors opacity-0 group-hover:opacity-100" />
                    </div>

                    {/* 标题与描述 */}
                    <h2 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-white transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  {/* 底部链接 */}
                  <div className="mt-8 flex items-center text-sm font-medium text-cyan-400 group-hover:text-cyan-300">
                    阅读文章
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          ))
        ) : (
          /* 空状态 */
          <motion.div variants={itemVariants} className="col-span-full text-center py-20">
            <p className="text-slate-500 text-lg">没有找到相关的液态想法...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}