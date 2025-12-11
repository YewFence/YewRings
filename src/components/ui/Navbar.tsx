"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, BookOpen, Command, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { name: "首页", href: "/", icon: Home },
  { name: "博客", href: "/blog", icon: BookOpen },
  { name: "关于", href: "/about", icon: User },
];

// 最小边距阈值（两侧各保留的最小空间）
const MIN_MARGIN = 70;
// 返回按钮及分隔符的预估宽度
const BACK_BUTTON_WIDTH = 50;
// 标题所需的最小舒适宽度
const MIN_TITLE_WIDTH = 140;
// 紧凑模式下比完整模式节省的宽度预估 (3个项目 * (文字宽度 + gap))
const COMPACT_SAVING = 120;

export const Navbar = () => {
  const pathname = usePathname();
  const [showBackButton, setShowBackButton] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [articleTitle, setArticleTitle] = useState<string | null>(null);
  const [titleMaxWidth, setTitleMaxWidth] = useState<number>(200);
  const [compactMode, setCompactMode] = useState(false); // 新增：紧凑模式状态
  const navRef = useRef<HTMLElement>(null);
  const navBaseWidthRef = useRef<number | null>(null); // 记录导航栏基础宽度（不含标题）

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

  // 计算标题最大宽度和是否启用紧凑模式
  useEffect(() => {
    const calculateLayout = () => {
      if (!navRef.current) return;

      const viewportWidth = window.innerWidth;

      // 只在标题未显示时测量并记录基础宽度，避免动画期间的循环依赖
      // 这个基础宽度必须是"完整模式"下的宽度
      if (!shouldShow && navBaseWidthRef.current === null) {
        navBaseWidthRef.current = navRef.current.getBoundingClientRect().width;
      }

      // 使用记录的基础宽度
      const baseWidth = navBaseWidthRef.current ?? navRef.current.getBoundingClientRect().width;

      // 计算完整模式下留给标题的空间
      const spaceForTitleFull = viewportWidth - baseWidth - BACK_BUTTON_WIDTH - MIN_MARGIN * 2;

      // 判定是否需要紧凑模式：如果完整模式下标题空间不足，则开启紧凑模式
      const isCompact = spaceForTitleFull < MIN_TITLE_WIDTH;
      setCompactMode(isCompact);

      // 计算实际可用于标题的宽度
      // 如果是紧凑模式，导航栏占用的宽度会减少 COMPACT_SAVING
      const effectiveNavWidth = isCompact ? (baseWidth - COMPACT_SAVING) : baseWidth;
      const availableWidth = viewportWidth - effectiveNavWidth - BACK_BUTTON_WIDTH - MIN_MARGIN * 2;

      // 限制最大宽度，最小为 0
      setTitleMaxWidth(Math.max(0, availableWidth));
    };

    calculateLayout();
    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, [shouldShow, articleTitle]);

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
    <motion.div
      layoutRoot 
      className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none"
    >
      {/* pointer-events-auto: 确保只有导航栏本身可以点击，
         不会遮挡两边的点击区域
      */}
      <motion.nav
        layout
        style={{originY: '0px'}} 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="pointer-events-auto relative flex items-center gap-1 p-2 rounded-full border border-white/10 bg-black/25 backdrop-blur-xl shadow-2xl shadow-black/40"
        ref={navRef}
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

          // 当标题展开时，博客 tab 的特效应该转移到标题上
          const showActiveBackground = isActive && !(item.href === "/blog" && shouldShow && articleTitle && !compactMode);

          return (
            <Link key={item.href} href={item.href} className="relative px-4 py-2 group">
              {showActiveBackground && (
                <motion.div
                  style={{originY: '0px'}}
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <span className={clsx(
                "relative z-10 flex items-center gap-2 text-sm font-medium transition-colors",
                isActive && showActiveBackground ? "text-white" : "text-slate-400 group-hover:text-slate-200"
              )}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {item.name}
                </span>
              </span>
            </Link>
          );
        })}

        {/* 文章标题 - 仅在文章页面显示 */}
        <motion.div
          initial={false}
          animate={
            showBackButton && articleTitle && !compactMode
              ? { width: "auto", opacity: 1 }
              : { width: 0, opacity: 0 }
          }
          transition={
              { type: "spring", stiffness: 300, damping: 25 }
          }
          className="flex items-center min-w-0"
        >
          <div className="w-px h-4 bg-white/10 mx-1 shrink-0" />
          <div className="relative px-4 py-2 flex items-center min-w-0">
            {/* 当标题展开时，activeTab 特效移动到这里 */}
            {shouldShow && articleTitle && !compactMode && (
              <motion.div
                style={{ originY: '0px' }}
                layoutId="activeTab"
                className="absolute inset-0 bg-white/10 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span
              className="relative z-10 inline-block text-sm text-white whitespace-nowrap truncate shrink-0"
              style={{
                // 使用 maxWidth 控制省略，避免固定 width 破坏省略效果
                maxWidth: titleMaxWidth,
              }}
            >
              {articleTitle}
            </span>
          </div>
        </motion.div>

        {/* 一个装饰性的分割线和功能按钮 */}
        <div className="w-px h-4 bg-white/10 mx-2" />
        
        <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <Command className="w-4 h-4" />
        </button>
      </motion.nav>
    </motion.div>
  );
};