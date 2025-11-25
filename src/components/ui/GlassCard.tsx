"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 工具函数：合并类名
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean; // 是否开启悬停浮动效果
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={
        hoverEffect
          ? {
              y: -5,
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              borderColor: "rgba(255,255,255,0.4)",
            }
          : {}
      }
      className={cn(
        // 核心玻璃样式：
        // 1. 背景：极低透明度的白色/灰色
        // 2. 模糊：backdrop-blur-xl (iOS 风格的关键)
        // 3. 边框：极细的半透明白线
        "relative overflow-hidden rounded-3xl border border-glass-border",
        "bg-glass-100 backdrop-blur-xl",
        "shadow-lg ring-1 ring-white/10", 
        "text-slate-100 transition-colors",
        className
      )}
      {...props}
    >
      {/* 内部的高光渐变层，增加立体感 */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {children}
    </motion.div>
  );
};