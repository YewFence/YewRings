"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  ...props
}) => {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative group flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300",
        // 基础玻璃质感
        "backdrop-blur-xl border shadow-lg",
        // 尺寸变体
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-base",
        size === "lg" && "px-8 py-4 text-lg",
        // 颜色变体：Primary (带青色光晕) vs Secondary (纯净白)
        isPrimary 
          ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-50 hover:bg-cyan-400/20 hover:border-cyan-400/50 hover:shadow-cyan-500/20"
          : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/30 hover:text-white",
        className
      )}
      {...props}
    >
      {/* 内部高光层 (只在 Primary 模式下增强显示) */}
      <div className={cn(
        "absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        isPrimary 
          ? "bg-llinear-to-r from-cyan-400/20 to-blue-500/20 blur-md"
          : "bg-linear-to-r from-white/10 to-transparent"
      )} />

      {/* 图标渲染 */}
      {icon}
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};