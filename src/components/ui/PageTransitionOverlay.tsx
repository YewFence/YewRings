"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTransition } from "@/contexts/TransitionContext";

// 动画配置常量
const ANIMATION_DURATION = 500; // ms
const SETTLING_DURATION = 400; // ms

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const { isTransitioning, phase, sourceRect, targetRect, setPhase, endTransition } =
    useTransition();

  // 判断是否在详情页
  const isDetailPage = pathname.startsWith("/blog/") && pathname !== "/blog";

  // 监听阶段变化，控制动画流程
  useEffect(() => {
    // 详情页挂载后，从 navigating 切换到 animating-in
    if (phase === "navigating" && isDetailPage && targetRect) {
      const timer = setTimeout(() => {
        setPhase("animating-in");
      }, 50); // 给一点时间让详情页注册 targetRect

      return () => clearTimeout(timer);
    }

    // animating-in 完成后，进入 settling
    if (phase === "animating-in") {
      const timer = setTimeout(() => {
        setPhase("settling");
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }

    // settling 完成后，结束过渡
    if (phase === "settling") {
      const timer = setTimeout(() => {
        endTransition();
      }, SETTLING_DURATION);

      return () => clearTimeout(timer);
    }
  }, [phase, isDetailPage, targetRect, setPhase, endTransition]);

  // 只在详情页 + 特定阶段显示占位卡片
  const shouldShowOverlay =
    isDetailPage &&
    isTransitioning &&
    sourceRect &&
    (phase === "navigating" || phase === "animating-in" || phase === "settling");

  if (!shouldShowOverlay) {
    return null;
  }

  // 初始位置（源卡片位置）
  const initialStyle = {
    x: sourceRect.x,
    y: sourceRect.y,
    width: sourceRect.width,
    height: sourceRect.height,
  };

  // 目标位置（详情页 GlassCard 的实际位置）
  // 如果 targetRect 还没准备好，使用 sourceRect
  const targetStyle = targetRect
    ? {
        x: targetRect.x,
        y: targetRect.y,
        width: targetRect.width,
        height: targetRect.height,
      }
    : initialStyle;

  const isSettling = phase === "settling";
  const shouldAnimate = phase === "animating-in" || phase === "settling";

  return (
    <AnimatePresence>
      {shouldShowOverlay && (
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: isSettling ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: SETTLING_DURATION / 1000 }}
        >
          {/* 空白占位卡片 */}
          <motion.div
            className="fixed rounded-3xl border border-glass-border bg-glass-100 backdrop-blur-xl shadow-lg ring-1 ring-white/10"
            initial={initialStyle}
            animate={shouldAnimate ? targetStyle : initialStyle}
            transition={{
              duration: ANIMATION_DURATION / 1000,
              ease: [0.32, 0.72, 0, 1], // 自定义缓动曲线
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
