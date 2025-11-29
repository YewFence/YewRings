"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar, Sparkles } from "lucide-react";
import { useTransition } from "@/contexts/TransitionContext";

// 动画配置常量
const ANIMATION_DURATION = 500; // ms

export function PageTransitionOverlay() {
  const router = useRouter();
  const { isTransitioning, phase, sourceRect, postData, targetSlug, setPhase, endTransition } =
    useTransition();

  // 计算目标位置 - 精确模拟详情页文章内容卡片的位置
  const getTargetRect = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 详情页布局参数
    const navbarHeight = 96; // pt-24 = 6rem = 96px
    const containerMaxWidth = 1152; // max-w-6xl
    const containerPadding = viewportWidth >= 1024 ? 32 : 16; // lg:px-8 : px-4

    // 计算容器实际宽度
    const containerWidth = Math.min(containerMaxWidth, viewportWidth - containerPadding * 2);
    const containerX = (viewportWidth - containerWidth) / 2;

    // lg 屏幕下有 4 列布局，TOC 占 1 列，内容占 3 列
    const isLgScreen = viewportWidth >= 1024;
    const gridGap = isLgScreen ? 48 : 0; // lg:gap-12 = 3rem = 48px

    let contentX: number;
    let contentWidth: number;

    if (isLgScreen) {
      // lg 屏幕：内容区占 3/4，左边有 1/4 的 TOC
      const tocWidth = (containerWidth - gridGap) / 4;
      contentWidth = ((containerWidth - gridGap) * 3) / 4;
      contentX = containerX + tocWidth + gridGap;
    } else {
      // 小屏幕：内容区占满宽度
      contentWidth = containerWidth;
      contentX = containerX;
    }

    // 计算 Y 位置
    // py-8 (main) = 32px
    // mb-8 (返回按钮) = 32px
    // mb-10 (头部信息区域) ≈ 200px（标题+描述+日期）
    const mainPaddingTop = 32;
    const backButtonHeight = 40 + 32; // 按钮高度 + mb-8
    const headerHeight = 200; // 头部信息区域估算高度

    const targetY = navbarHeight + mainPaddingTop + backButtonHeight + headerHeight;

    // 目标高度：延伸到页面底部，留一点底部间距
    const targetHeight = viewportHeight - targetY + 100;

    return {
      x: contentX,
      y: targetY,
      width: contentWidth,
      height: targetHeight,
    };
  }, []);

  // 处理动画完成后的导航
  useEffect(() => {
    if (phase === "animating-out" && targetSlug) {
      // 预加载目标页面
      router.prefetch(`/blog/${targetSlug}`);

      // 动画结束后导航
      const timer = setTimeout(() => {
        setPhase("navigating");
        router.push(`/blog/${targetSlug}`);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [phase, targetSlug, router, setPhase]);

  // 监听路由变化，在新页面渲染后触发入场动画
  useEffect(() => {
    if (phase === "navigating") {
      // 给新页面一点时间渲染
      const timer = setTimeout(() => {
        setPhase("animating-in");
      }, 100);

      return () => clearTimeout(timer);
    }

    if (phase === "animating-in") {
      // 入场动画结束后清理状态
      const timer = setTimeout(() => {
        endTransition();
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [phase, setPhase, endTransition]);

  if (!isTransitioning || !sourceRect || !postData) {
    return null;
  }

  const targetRect = getTargetRect();

  // 初始位置（源卡片位置）
  const initialStyle = {
    x: sourceRect.x,
    y: sourceRect.y,
    width: sourceRect.width,
    height: sourceRect.height,
    opacity: 1,
  };

  // 目标位置（详情页文章内容卡片位置）
  const targetStyle = {
    x: targetRect.x,
    y: targetRect.y,
    width: targetRect.width,
    height: targetRect.height,
    opacity: 1,
  };

  const isAnimatingOut = phase === "animating-out";
  const isNavigating = phase === "navigating";
  const isAnimatingIn = phase === "animating-in";

  // 根据不同阶段确定动画目标
  let animateStyle;
  if (isAnimatingOut || isNavigating) {
    // 移动到目标位置并保持
    animateStyle = targetStyle;
  } else {
    animateStyle = initialStyle;
  }

  return (
    <AnimatePresence>
      {isTransitioning && !isAnimatingIn && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 克隆的卡片 */}
          <motion.div
            className="absolute rounded-3xl border border-glass-border bg-glass-100 backdrop-blur-xl shadow-lg ring-1 ring-white/10 overflow-hidden"
            initial={initialStyle}
            animate={animateStyle}
            transition={{
              duration: ANIMATION_DURATION / 1000,
              ease: [0.32, 0.72, 0, 1], // 自定义缓动曲线
            }}
          >
            {/* 卡片内容克隆 */}
            <motion.div
              className="p-8 h-full flex flex-col justify-between"
              initial={{ filter: "blur(0px)" }}
              animate={{
                filter: isAnimatingOut || isNavigating ? "blur(10px)" : "blur(0px)",
              }}
              transition={{
                duration: ANIMATION_DURATION / 1000,
                ease: "easeOut",
              }}
            >
              <div>
                {/* 顶部元数据 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/30 px-2 py-1 rounded-md border border-cyan-500/20">
                    <Calendar className="w-3 h-3" />
                    {postData.date}
                  </div>
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                </div>

                {/* 标题与描述 */}
                <h2 className="text-2xl font-bold text-slate-100 mb-3">{postData.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                  {postData.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
