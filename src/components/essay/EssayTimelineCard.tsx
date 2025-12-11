"use client";

import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

interface EssayTimelineCardProps {
  title?: string;
  date: string;
  time?: string;
  htmlContent: string; // 服务端渲染好的 HTML
  isLeft?: boolean; // 是否在时间轴左侧（桌面端）
}

export function EssayTimelineCard({
  title,
  date,
  time,
  htmlContent,
  isLeft = false,
}: EssayTimelineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-md
        p-5
        cursor-default
        transition-shadow duration-300
        hover:shadow-lg hover:shadow-black/20
      "
    >
      {/* 日期和时间 */}
      <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {date}
        </span>
        {time && (
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {time}
          </span>
        )}
      </div>

      {/* 标题（可选）+ 分割线 */}
      {title && (
        <>
          <h1 className="text-2xl font-bold text-slate-50 mb-3">{title}</h1>
          {/* 分割线：左侧卡片靠右，右侧卡片靠左 */}
          <div className={`flex ${isLeft ? "justify-end" : "justify-start"} mb-4`}>
            <div className="w-3/4 h-px bg-linear-to-r from-white/20 via-white/10 to-transparent" />
          </div>
        </>
      )}

      {/* MDX 正文内容 - 使用 dangerouslySetInnerHTML 渲染服务端生成的 HTML */}
      <div
        className="prose prose-sm prose-invert max-w-none text-sm text-slate-300 prose-headings:text-slate-200 prose-headings:font-medium prose-a:text-cyan-300 hover:prose-a:text-cyan-200 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </motion.div>
  );
}
