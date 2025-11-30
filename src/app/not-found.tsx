"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/GlassButton";
import { Home, FileQuestion, CloudOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      <div className="text-center space-y-8 relative z-10 px-4">
        {/* 404 标题区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* 巨大的数字背景 */}
          <h1 className="text-[10rem] md:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white/5 to-transparent select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 blur-sm">
            404
          </h1>
          
          {/* 前景图标与文字 */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
            >
              <CloudOff className="w-16 h-16 text-cyan-200/80" />
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60 drop-shadow-2xl">
              404
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
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            信号丢失
          </h2>
          <p className="text-slate-400 leading-relaxed">
            您正在寻找的页面似乎已经漂流到了数字海洋的深处，或者从未存在过。
          </p>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link href="/">
            <GlassButton size="lg" icon={<Home className="w-4 h-4" />}>
              返回基地
            </GlassButton>
          </Link>
          <Link href="/blog">
            <GlassButton variant="secondary" size="lg" icon={<FileQuestion className="w-4 h-4" />}>
              查看日志
            </GlassButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
