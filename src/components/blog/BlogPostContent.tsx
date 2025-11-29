"use client";

import { motion } from "framer-motion";
import { useTransitionSafe } from "@/contexts/TransitionContext";

interface BlogPostContentProps {
  children: React.ReactNode;
}

export function BlogPostContent({ children }: BlogPostContentProps) {
  const transition = useTransitionSafe();
  const isFromTransition = transition?.phase === "animating-in" || transition?.phase === "navigating";

  return (
    <motion.div
      initial={{
        filter: isFromTransition ? "blur(12px)" : "blur(0px)",
        opacity: isFromTransition ? 0.6 : 1,
      }}
      animate={{
        filter: "blur(0px)",
        opacity: 1,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: isFromTransition ? 0.25 : 0,
      }}
    >
      {children}
    </motion.div>
  );
}

// 详情页头部组件（淡入动画，无位移）
interface BlogPostHeaderProps {
  title: string;
  description: string;
  date: string;
}

export function BlogPostHeader({ title, description, date }: BlogPostHeaderProps) {
  const transition = useTransitionSafe();
  const isFromTransition = transition?.phase === "animating-in" || transition?.phase === "navigating";

  return (
    <motion.div
      initial={{
        opacity: isFromTransition ? 0 : 1,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: isFromTransition ? 0.2 : 0,
      }}
      className="mb-10 text-center"
    >
      <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm mb-4 font-mono">
        <span>{date}</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{title}</h1>
      <p className="text-xl text-slate-400 max-w-2xl mx-auto">{description}</p>
    </motion.div>
  );
}

// 侧边栏组件（淡入动画，无位移）
interface BlogPostSidebarProps {
  children: React.ReactNode;
}

export function BlogPostSidebar({ children }: BlogPostSidebarProps) {
  const transition = useTransitionSafe();
  const isFromTransition = transition?.phase === "animating-in" || transition?.phase === "navigating";

  return (
    <motion.aside
      initial={{
        opacity: isFromTransition ? 0 : 1,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: isFromTransition ? 0.3 : 0,
      }}
      className="hidden lg:block col-span-1 py-8"
    >
      {children}
    </motion.aside>
  );
}

// 返回按钮容器（淡入动画，无位移）
interface BlogPostBackButtonProps {
  children: React.ReactNode;
}

export function BlogPostBackButton({ children }: BlogPostBackButtonProps) {
  const transition = useTransitionSafe();
  const isFromTransition = transition?.phase === "animating-in" || transition?.phase === "navigating";

  return (
    <motion.div
      initial={{
        opacity: isFromTransition ? 0 : 1,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: isFromTransition ? 0.15 : 0,
      }}
      className="inline-block mb-8"
    >
      {children}
    </motion.div>
  );
}
