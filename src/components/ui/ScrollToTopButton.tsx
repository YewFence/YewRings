"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    // 整个页面的可滚动高度
    const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // 当前滚动位置
    const scrollTop = window.scrollY;
    
    // 计算滚动进度百分比
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
    setScrollProgress(progress);
    
    // 当滚动超过 200px 时显示按钮
    setIsVisible(scrollTop > 200);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // 组件卸载时移除监听器
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={scrollToTop}
          className={clsx(
            "fixed bottom-8 right-8 z-50",
            "w-12 h-12 rounded-full",
            "border border-white/10 bg-black/30 backdrop-blur-lg",
            "shadow-2xl shadow-black/50",
            "flex items-center justify-center",
            "overflow-hidden", // 隐藏内部溢出的填充元素
            "group" // 用于 hover 效果
          )}
          aria-label="回到顶部"
        >
          {/* 进度填充层 */}
          <div
            className="absolute bottom-0 left-0 w-full bg-linear-to-t from-cyan-500/50 to-pink-500/50"
            style={{ height: `${scrollProgress}%` }}
          />

          {/* 图标层 */}
          <ArrowUp className="relative z-10 w-6 h-6 text-slate-300 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
