"use client";

import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { PostMeta } from "@/lib/mdx";

interface ClonedCardProps {
  post: PostMeta;
  rect: DOMRect;
  isAnimating: boolean;
}

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
      <GlassCard
        className="h-full p-8 flex flex-col justify-between"
        disableInitialAnimation
        hoverEffect={false}
      >
        {/* 只有文字内容模糊消失，卡片外框保持 */}
        <motion.div
          initial={{ filter: "blur(0px)", opacity: 1 }}
          animate={{
            filter: isAnimating ? "blur(8px)" : "blur(0px)",
            opacity: isAnimating ? 0 : 1,
          }}
          transition={{ duration: 0.25 }}
          className="flex flex-col justify-between h-full"
        >
          <div>
            {/* 顶部元数据 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/30 px-2 py-1 rounded-md border border-cyan-500/20">
                <Calendar className="w-3 h-3" />
                {post.date}
              </div>
              <Sparkles className="w-4 h-4 text-slate-600" />
            </div>

            {/* 标题与描述 */}
            <h2 className="text-2xl font-bold text-slate-100 mb-3">
              {post.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
              {post.description}
            </p>
          </div>

          {/* 底部链接 */}
          <div className="mt-8 flex items-center text-sm font-medium text-cyan-400">
            阅读文章
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </motion.div>
      </GlassCard>
    </div>,
    document.body
  );
}
