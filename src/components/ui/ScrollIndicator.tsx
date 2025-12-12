"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ariaConfig from "@content/pages/aria.json";

interface ScrollIndicatorProps {
  targetId: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number; // 延迟显示时间（毫秒）
  ariaLabel?: string; // 显式指定无障碍标签
}

export const ScrollIndicator = ({ targetId, children, className, delay = 0, ariaLabel }: ScrollIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(delay === 0);

  // 处理延迟显示
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const scrollToContent = () => {
    setIsVisible(false);
    const content = document.getElementById(targetId);
    if (content) {
      content.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当目标元素进入视口（即屏幕底部接触到目标元素顶部）时，隐藏提示
        if (entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        root: null, // 视口
        threshold: 0, // 只要出现一点点
        rootMargin: "0px 0px -100px 0px" // 稍微提前一点触发（当目标进入视口底部 100px 时）
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, pointerEvents: "none" }}
          transition={{ duration: 0.5 }}
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-lg p-2 ${className || ""}`}
          onClick={scrollToContent}
          aria-label={ariaLabel || ariaConfig.buttons.scrollDown}
        >
          {children && (
            <span className="text-xs font-mono text-slate-400/60 tracking-widest uppercase group-hover:text-cyan-300 transition-colors" aria-hidden="true">
              {children}
            </span>
          )}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors"
            aria-hidden="true"
          >
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-cyan-300" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
