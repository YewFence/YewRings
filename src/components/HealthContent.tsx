"use client";

import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";
import type { HealthPageContent } from "@/types/content";

export function HealthContent({ content }: { content: HealthPageContent }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      <div className="text-center space-y-8 relative z-10 px-4">
        {/* 状态图标 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="p-6 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md shadow-2xl shadow-emerald-500/20"
            >
              <CircleCheck className="w-16 h-16 text-emerald-400" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60 drop-shadow-2xl">
              {content.title}
            </h1>
          </div>
        </motion.div>

        {/* 描述文字 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4 max-w-md mx-auto"
        >
          <h2 className="text-xl md:text-2xl font-medium text-slate-300">
            {content.subtitle}
          </h2>
        </motion.div>

        {/* 状态徽章 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 text-sm font-medium">
              {content.badge}
            </span>
          </div>
        </motion.div>

        {/* 状态信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="pt-8"
        >
          <div className="inline-block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-8">
                <span className="text-slate-400">{content.info.statusLabel}</span>
                <span className="text-slate-200 font-mono">{content.info.statusValue}</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-slate-400">{content.info.timeLabel}</span>
                <span className="text-slate-200 font-mono">
                  <ClientTime />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ClientTime() {
  return (
    <time suppressHydrationWarning>
      {new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </time>
  );
}
