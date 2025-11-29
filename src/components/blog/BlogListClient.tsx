"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ClonedCard, BlogCardContent } from "@/components/blog/ClonedCard";
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

// 克隆卡片的信息类型
interface ClonedCardData {
  slug: string;
  post: PostMeta;
  rect: DOMRect;
}

export default function BlogListClient({ posts }: { posts: PostMeta[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clonedCard, setClonedCard] = useState<ClonedCardData | null>(null);
  const { isTransitioning, phase, targetSlug, startTransition, setPhase } = useTransition();
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const router = useRouter();

  // preparing 阶段完成后（200ms），切换到 navigating 并执行路由跳转
  useEffect(() => {
    if (phase === "preparing" && targetSlug) {
      // 预加载目标页面
      router.prefetch(`/blog/${targetSlug}`);

      const timer = setTimeout(() => {
        setPhase("navigating");
        router.push(`/blog/${targetSlug}`);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [phase, targetSlug, router, setPhase]);

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
      // 立即创建克隆卡片覆盖在原位置
      setClonedCard({ slug, post, rect });
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
      {/* 克隆卡片（脱离动画容器，不会被淡出） */}
      {clonedCard && (
        <ClonedCard
          post={clonedCard.post}
          rect={clonedCard.rect}
          isAnimating={phase === "preparing" || phase === "navigating"}
        />
      )}

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
            <motion.div
              key={post.slug}
              variants={itemVariants}
            >
              <div
                onClick={() => handleCardClick(post, post.slug)}
                className="cursor-pointer"
              >
                <BlogCardContent
                  ref={(el) => setCardRef(post.slug, el)}
                  post={post}
                />
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