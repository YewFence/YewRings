'use client';

import { motion } from "framer-motion";
import { useTransitionSafe } from "@/contexts/TransitionContext";
import { Calendar, User, History } from "lucide-react";

interface BlogPostContentProps {
  children: React.ReactNode;
}

export function BlogPostContent({ children }: BlogPostContentProps) {
  const transition = useTransitionSafe();
  // 在过渡期间（navigating/animating-in）隐藏内容，settling 阶段开始显示
  const isHidden =
    transition?.phase === "navigating" || transition?.phase === "animating-in";
  const isSettling = transition?.phase === "settling";

  return (
    <motion.div
      initial={{
        opacity: isHidden ? 0 : 1,
      }}
      animate={{
        opacity: isHidden ? 0 : 1,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: isSettling ? 0.1 : 0,
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
  updatedAt?: string;
  author?: string;
}

export function BlogPostHeader({ title, description, date, updatedAt, author }: BlogPostHeaderProps) {
  const transition = useTransitionSafe();
  const isHidden =
    transition?.phase === "navigating" || transition?.phase === "animating-in";
  const isSettling = transition?.phase === "settling";

  return (
    <motion.div
      initial={{
        opacity: isHidden ? 0 : 1,
      }}
      animate={{
        opacity: isHidden ? 0 : 1,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: isSettling ? 0.15 : 0,
      }}
      className="mb-10 text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{title}</h1>
      <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4">{description}</p>
      <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-sm font-mono">
        {author && (
          <span className="flex items-center gap-1.5 text-cyan-300">
            <User className="w-4 h-4" />
            {author}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-cyan-300">
          <Calendar className="w-4 h-4" />
          {date}
        </span>
        {updatedAt && (
          <span className="flex items-center gap-1.5 text-amber-300">
            <History className="w-4 h-4" />
            {updatedAt}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// 侧边栏组件（淡入动画，无位移）
interface BlogPostSidebarProps {
  children: React.ReactNode;
}

export function BlogPostSidebar({ children }: BlogPostSidebarProps) {
  const transition = useTransitionSafe();
  const isHidden =
    transition?.phase === "navigating" || transition?.phase === "animating-in";
  const isSettling = transition?.phase === "settling";

  return (
    <motion.aside
      initial={{
        opacity: isHidden ? 0 : 1,
      }}
      animate={{
        opacity: isHidden ? 0 : 1,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: isSettling ? 0.2 : 0,
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
  const isHidden =
    transition?.phase === "navigating" || transition?.phase === "animating-in";
  const isSettling = transition?.phase === "settling";

  return (
    <motion.div
      initial={{
        opacity: isHidden ? 0 : 1,
      }}
      animate={{
        opacity: isHidden ? 0 : 1,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: isSettling ? 0.1 : 0,
      }}
      className="inline-block mb-8"
    >
      {children}
    </motion.div>
  );
}
