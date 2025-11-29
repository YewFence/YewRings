"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, User, BookOpen, Command, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { name: "首页", href: "/", icon: Home },
  { name: "博客", href: "/blog", icon: BookOpen },
  { name: "关于", href: "/about", icon: User },
];

// 最小边距阈值（两侧各保留的最小空间）
const MIN_MARGIN = 70;

export const Navbar = () => {
  const pathname = usePathname();
  const [showBackButton, setShowBackButton] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [articleTitle, setArticleTitle] = useState<string | null>(null);
  const [titleMaxWidth, setTitleMaxWidth] = useState<number>(200);
  const navRef = useRef<HTMLElement>(null);
  const navBaseWidthRef = useRef<number | null>(null); // 记录导航栏基础宽度（不含标题）
  const titleRef = useRef<HTMLSpanElement>(null);
  const [titleWidth, setTitleWidth] = useState<number | null>(null); // 标题实际渲染宽度

  // 判断是否在文章详情页
  const isArticlePage = pathname.startsWith("/blog/") && pathname !== "/blog";
  const shouldShow = isArticlePage && showBackButton;

  // 从 DOM 获取文章标题
  useEffect(() => {
    if (!isArticlePage) {
      setArticleTitle(null);
      return;
    }

    // 尝试立即获取
    const h1 = document.querySelector("h1");
    if (h1) {
      setArticleTitle(h1.textContent);
      return;
    }

    // 如果还没有 h1，用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
      const h1 = document.querySelector("h1");
      if (h1) {
        setArticleTitle(h1.textContent);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isArticlePage, pathname]);

  // 计算标题最大宽度
  useEffect(() => {
    const calculateMaxWidth = () => {
      if (!navRef.current) return;

      const viewportWidth = window.innerWidth;

      // 只在标题未显示时测量并记录基础宽度，避免动画期间的循环依赖
      if (!shouldShow && navBaseWidthRef.current === null) {
        navBaseWidthRef.current = navRef.current.getBoundingClientRect().width;
      }

      // 使用记录的基础宽度，如果没有则用当前宽度
      const baseWidth = navBaseWidthRef.current ?? navRef.current.getBoundingClientRect().width;

      // 可用空间 = 视窗宽度 - 导航栏基础宽度 - 两侧最小边距
      const availableWidth = viewportWidth - baseWidth - MIN_MARGIN * 2;

      // 限制最大宽度，最小为 0
      setTitleMaxWidth(Math.max(0, availableWidth));
    };

    calculateMaxWidth();
    window.addEventListener("resize", calculateMaxWidth);
    return () => window.removeEventListener("resize", calculateMaxWidth);
  }, [shouldShow, articleTitle]);

  // 测量标题渲染后的实际宽度并锁定，防止 spring 回弹时被压缩
  useEffect(() => {
    if (!titleRef.current || !articleTitle || titleWidth !== null) return;

    // 等待一帧让 DOM 渲染完成
    const id = requestAnimationFrame(() => {
      if (titleRef.current) {
        // 取 scrollWidth（完整内容宽度）和 clientWidth（受 maxWidth 限制后的宽度）中的较小值
        const actualWidth = Math.min(
          titleRef.current.scrollWidth,
          titleMaxWidth
        );
        setTitleWidth(actualWidth);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [articleTitle, titleMaxWidth, titleWidth]);

  // 当标题或路由变化时，重置宽度让它重新测量
  useEffect(() => {
    setTitleWidth(null);
  }, [articleTitle, pathname]);

  // 检测路由变化，跳过动画
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setSkipAnimation(true);
      prevPathnameRef.current = pathname;
      // 下一帧恢复动画
      requestAnimationFrame(() => {
        setSkipAnimation(false);
      });
    }
  }, [pathname]);

  // 监听滚动
  useEffect(() => {
    if (!isArticlePage) {
      setShowBackButton(false);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackButton(scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初始检查

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isArticlePage]);

  return (
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      {/* pointer-events-auto: 确保只有导航栏本身可以点击，
         不会遮挡两边的点击区域
      */}
      <motion.nav
        layout
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="pointer-events-auto relative flex items-center gap-1 p-2 rounded-full border border-white/10 bg-black/25 backdrop-blur-xl shadow-2xl shadow-black/40"
      >
        {/* 新增：顶部高光元素 */}
        <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent" />

        {/* 返回按钮 - 滚动时融入导航栏 */}
        {isArticlePage && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={
              showBackButton
                ? { width: "auto", opacity: 1 }
                : { width: 0, opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center overflow-hidden"
          >
            <Link
              href="/blog"
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-4 bg-white/10 mx-1" />
          </motion.div>
        )}

        {navItems.map((item) => {
          // 博客页面特殊处理：/blog 和 /blog/* 都视为激活状态
          const isActive = item.href === "/blog"
            ? pathname === "/blog" || pathname.startsWith("/blog/")
            : pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative px-4 py-2 group">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <span className={clsx(
                "relative z-10 flex items-center gap-2 text-sm font-medium transition-colors",
                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
              )}>
                <Icon className="w-4 h-4" />
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* 文章标题 - 仅在文章页面显示 */}
        <motion.div
          initial={false}
          animate={
            showBackButton && articleTitle
              ? { width: "auto", opacity: 1 }
              : { width: 0, opacity: 0 }
          }
          transition={
            skipAnimation
              ? { duration: 0 }
              : { type: "spring", stiffness: 300, damping: 25 }
          }
          className="flex items-center overflow-hidden"
        >
          <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
          <span
            ref={titleRef}
            className="text-sm text-slate-300 whitespace-nowrap px-2 truncate shrink-0"
            style={{
              // 使用固定宽度而非 maxWidth，防止 spring 回弹时被压缩
              width: titleWidth ?? undefined,
              maxWidth: titleWidth === null ? titleMaxWidth : undefined,
            }}
          >
            {articleTitle}
          </span>
        </motion.div>

        {/* 一个装饰性的分割线和功能按钮 */}
        <div className="w-px h-4 bg-white/10 mx-2" />
        
        <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <Command className="w-4 h-4" />
        </button>
      </motion.nav>
    </div>
  );
};