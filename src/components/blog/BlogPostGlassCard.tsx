"use client";

import { useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTransitionSafe } from "@/contexts/TransitionContext";

interface BlogPostGlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BlogPostGlassCard({ children, className }: BlogPostGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const transition = useTransitionSafe();

  // 注册目标位置
  useEffect(() => {
    if (cardRef.current && transition?.phase === "navigating") {
            const rect = cardRef.current.getBoundingClientRect();
            transition.setTargetRect(rect);
          }
  }, [transition?.phase, transition?.setTargetRect]);

  // 在过渡期间隐藏 GlassCard，让占位卡片显示
  const isHidden =
    transition?.phase === "navigating" || transition?.phase === "animating-in";

  return (
    <GlassCard
      ref={cardRef}
      className={className}
      hoverEffect={false}
      disableInitialAnimation
      style={{
        opacity: isHidden ? 0 : 1,
        transition: "opacity 0.3s ease-out",
      }}
    >
      {children}
    </GlassCard>
  );
}
