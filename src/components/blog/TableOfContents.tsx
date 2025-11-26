"use client";

import { useState, useEffect, useRef } from 'react';
import type { Heading } from '@/lib/mdx';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface TOCProps {
  headings: Heading[];
}

// 查找当前活动标题所属的顶级标题（level 2）
const getTopLevelParent = (
  headings: Heading[],
  activeSlug: string
): string | null => {
  const activeIndex = headings.findIndex((h) => h.slug === activeSlug);
  if (activeIndex === -1) return null;

  const activeHeading = headings[activeIndex];
  // 如果自己就是 level 2，返回自己
  if (activeHeading.level === 2) return activeSlug;

  // 往前找最近的 level 2
  for (let i = activeIndex - 1; i >= 0; i--) {
    if (headings[i].level === 2) {
      return headings[i].slug;
    }
  }
  return null;
};

// 查找当前活动标题的所有父标题
const getParentHeadings = (
  headings: Heading[],
  activeSlug: string
): Set<string> => {
  const parents = new Set<string>();
  const activeIndex = headings.findIndex((h) => h.slug === activeSlug);
  if (activeIndex === -1) return parents;

  const activeHeading = headings[activeIndex];
  let currentLevel = activeHeading.level;

  // 从当前标题往前找，找到每一级更高层级的父标题
  for (let i = activeIndex - 1; i >= 0; i--) {
    const heading = headings[i];
    if (heading.level < currentLevel) {
      parents.add(heading.slug);
      currentLevel = heading.level;
      // 如果已经找到 level 2，就不用再往上找了
      if (currentLevel <= 2) break;
    }
  }

  return parents;
};

export const TableOfContents = ({ headings }: TOCProps) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const isScrollingRef = useRef(false);

  useEffect(() => {
    // 当activeSlug变化时，自动展开当前分支，收缩其他分支
    if (activeSlug) {
      const activeParents = getParentHeadings(headings, activeSlug);
      const currentTopLevel = getTopLevelParent(headings, activeSlug);

      // 获取所有 level 2 标题
      const allTopLevelSlugs = headings
        .filter((h) => h.level === 2)
        .map((h) => h.slug);

      setCollapsed(() => {
        const newSet = new Set<string>();
        // 收缩所有不是当前分支的顶级标题
        allTopLevelSlugs.forEach((slug) => {
          if (slug !== currentTopLevel) {
            newSet.add(slug);
          }
        });
        // 确保当前分支的父标题都展开
        activeParents.forEach((slug) => newSet.delete(slug));
        return newSet;
      });
    }
  }, [activeSlug, headings]);

  useEffect(() => {
    const handleScroll = () => {
      // 点击导航滚动期间不更新
      if (isScrollingRef.current) return;

      const viewportMiddle = window.scrollY + window.innerHeight / 2;

      let closestHeading: string | null = null;
      let closestDistance = Infinity;

      for (const heading of headings) {
        const el = document.getElementById(heading.slug);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const distance = Math.abs(elementTop - viewportMiddle);

        // 只考虑在视口中线上方或刚好在中线的标题
        if (elementTop <= viewportMiddle && distance < closestDistance) {
          closestDistance = distance;
          closestHeading = heading.slug;
        }
      }

      if (closestHeading) {
        setActiveSlug(closestHeading);
      }
    };

    // 初始化时执行一次
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // 点击导航项时滚动到目标位置
  const scrollToHeading = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;

    // 暂停滚动监听
    isScrollingRef.current = true;

    // 计算目标位置（考虑顶部固定导航栏的高度）
    const targetPosition = el.getBoundingClientRect().top + window.scrollY - 96;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    // 滚动完成后再更新状态并恢复监听
    // 根据滚动距离动态计算等待时间
    const scrollDistance = Math.abs(targetPosition - window.scrollY);
    const waitTime = Math.max(800, Math.min(scrollDistance * 0.5, 1500));

    setTimeout(() => {
      setActiveSlug(slug);
      isScrollingRef.current = false;
    }, waitTime);
  };

  const toggleCollapse = (slug: string) => {
    setCollapsed((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };
  
  // 获取某个标题的直接子标题
  const getChildHeadings = (parentIndex: number, parentLevel: number): Heading[] => {
    const children: Heading[] = [];
    for (let i = parentIndex + 1; i < headings.length; i++) {
      const h = headings[i];
      // 遇到同级或更高级标题，停止
      if (h.level <= parentLevel) break;
      // 只收集直接子级（parentLevel + 1）
      if (h.level === parentLevel + 1) {
        children.push(h);
      }
    }
    return children;
  };

  // 渲染标题项
  const renderHeadingItem = (heading: Heading, headingIndex: number) => {
    const isCollapsed = collapsed.has(heading.slug);
    const isActive = activeSlug === heading.slug;
    const childHeadings = getChildHeadings(headingIndex, heading.level);

    return (
      <li key={heading.slug}>
        <div className="flex items-center group">
          {/* 折叠按钮 */}
          {childHeadings.length > 0 && (
            <button
              onClick={() => toggleCollapse(heading.slug)}
              className="p-1 rounded-md hover:bg-white/10 text-slate-500 hover:text-slate-300"
            >
              <ChevronDown
                className={clsx(
                  'w-4 h-4 transition-transform',
                  !isCollapsed && '-rotate-90'
                )}
              />
            </button>
          )}
          <a
            href={`#${heading.slug}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(heading.slug);
            }}
            className={clsx(
              'relative flex-1 py-1 px-2 text-sm transition-colors rounded-r-md',
              isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200',
              { 'ml-5': childHeadings.length === 0 } // 对没有子项的进行缩进
            )}
          >
            {isActive && (
              <motion.div
                layoutId="toc-highlight"
                className="absolute inset-0 bg-cyan-500/10 rounded-md"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{heading.text}</span>
          </a>
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && childHeadings.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-4"
            >
              <ul className="space-y-1">
                {childHeadings.map((child) =>
                  renderHeadingItem(child, headings.findIndex(h => h.slug === child.slug))
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  };

  // 获取顶级标题（level 2）
  const topLevelHeadings = headings.filter((h) => h.level === 2);
  
  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-lg shadow-lg shadow-black/20">
      {/* 顶部高光 */}
      <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent" />

      <ul className="space-y-1">
        {topLevelHeadings.map((heading) =>
          renderHeadingItem(heading, headings.findIndex(h => h.slug === heading.slug))
        )}
      </ul>
    </nav>
  );
};
