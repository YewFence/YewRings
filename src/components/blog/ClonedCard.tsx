"use client";

import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Sparkles, History } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PostMeta } from "@/lib/mdx";
import { forwardRef } from "react";

interface BlogCardContentProps {
  post: PostMeta;
  fadeOut?: boolean;
  showHoverEffects?: boolean;
}

/** 博客卡片内容组件 */
export const BlogCardContent = forwardRef<HTMLDivElement, BlogCardContentProps>(
  ({ post, fadeOut = false, showHoverEffects = true }, ref) => {
    return (
      <GlassCard
        ref={ref}
        className="h-full p-8 group flex flex-col justify-between hover:shadow-cyan-900/20"
        disableInitialAnimation
        hoverEffect={showHoverEffects}
      >
        <motion.div
          animate={{
            filter: fadeOut ? "blur(8px)" : "blur(0px)",
            opacity: fadeOut ? 0 : 1,
          }}
          transition={{ duration: 0.25 }}
          className="flex flex-col justify-between h-full"
        >
          <div>
            {/* 顶部元数据 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
                {/* 创建日期 */}
                <div className="flex items-center gap-2 text-cyan-300 bg-cyan-950/30 px-2 py-1 rounded-md border border-cyan-500/20">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </div>
                {/* 更新日期（如果存在） */}
                {post.updatedAt && (
                  <div className="flex items-center gap-2 text-amber-300 bg-amber-950/30 px-2 py-1 rounded-md border border-amber-500/20">
                    <History className="w-3 h-3" />
                    {post.updatedAt}
                  </div>
                )}
              </div>
              <Sparkles
                className={`w-4 h-4 text-slate-600 ${showHoverEffects ? "group-hover:text-yellow-200 transition-colors opacity-0 group-hover:opacity-100" : ""}`}
              />
            </div>

            {/* 标题与描述 */}
            <h2
              className={`text-2xl font-bold text-slate-100 mb-3 ${showHoverEffects ? "group-hover:text-white transition-colors" : ""}`}
            >
              {post.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
              {post.description}
            </p>
          </div>

          {/* 底部链接 */}
          <div
            className={`mt-8 flex items-center text-sm font-medium text-cyan-400 ${showHoverEffects ? "group-hover:text-cyan-300" : ""}`}
          >
            阅读文章
            <ArrowRight
              className={`w-4 h-4 ml-2 ${showHoverEffects ? "transform group-hover:translate-x-1 transition-transform" : ""}`}
            />
          </div>
        </motion.div>
      </GlassCard>
    );
  }
);

BlogCardContent.displayName = "BlogCardContent";

interface ClonedCardProps {
  post: PostMeta;
  rect: DOMRect;
  isAnimating: boolean;
}

/** 克隆卡片（通过 Portal 渲染，脱离动画容器） */
export function ClonedCard({ post, rect, isAnimating }: ClonedCardProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <BlogCardContent post={post} fadeOut={isAnimating} showHoverEffects={false} />
    </div>,
    document.body
  );
}
