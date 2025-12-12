"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ExternalLink, User, Sparkles, Globe, Cpu, Network } from "lucide-react";
import type { AboutPageContent } from "@/types/content";

export function AboutContent({ content }: { content: AboutPageContent }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20 px-4">
      {/* 动态背景装饰 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl relative z-10 mb-12"
      >
        <GlassCard className="p-8 md:p-12 flex flex-col items-center text-center gap-8 border-white/10 shadow-2xl bg-black/20">
          
          {/* 顶部装饰：全息头像占位符 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-tr from-cyan-500 to-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-center relative z-10 shadow-inner ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-500">
              <User className="w-12 h-12 text-slate-200" />
              
              {/* 环绕的轨道动画 */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-white/20 w-full h-full"
              />
            </div>
            
            {/* 悬浮的小图标 */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-0 p-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </motion.div>
          </div>

          {/* 文本内容 */}
          <div className="space-y-6 max-w-lg">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60 pb-2">
                {content.title}
              </h1>
              <p className="text-cyan-300/80 font-mono text-sm tracking-wider uppercase">
                {content.subtitle}
              </p>
            </div>
            
            <p className="text-lg text-slate-400 leading-relaxed">
              {content.description[0]}
              <br className="hidden md:block" />
              {content.description[1]}
            </p>
          </div>

          {/* 核心操作区 */}
          <div className="flex flex-col w-full gap-6 pt-4">
            <Link href={content.links.personalWebsite} target="_blank" className="w-full flex justify-center">
              <GlassButton size="lg" className="w-full sm:w-auto min-w-[200px] group" icon={<Globe className="w-4 h-4" />}>
                {content.buttons.personalWebsite}
                <ExternalLink className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </GlassButton>
            </Link>

            {/* 底部数据展示 (填充空间，增加科技感) */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5 w-full">
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{content.stats.fullstack}</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Network className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{content.stats.network}</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{content.stats.creative}</span>
              </div>
            </div>
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
}
