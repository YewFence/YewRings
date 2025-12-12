"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
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
  // 默认折叠所有顶级标题
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    return new Set(headings.filter(h => h.level === 2).map(h => h.slug));
  });
  const isScrollingRef = useRef(false);
  const tocRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [showTopMask, setShowTopMask] = useState(false);
  const [showBottomMask, setShowBottomMask] = useState(false);

  // 更新折叠状态的函数
  const updateCollapsed = useCallback((slug: string) => {
    const activeParents = getParentHeadings(headings, slug);
    const currentTopLevel = getTopLevelParent(headings, slug);

    const allTopLevelSlugs = headings
      .filter((h) => h.level === 2)
      .map((h) => h.slug);

    setCollapsed(() => {
      const newSet = new Set<string>();
      allTopLevelSlugs.forEach((s) => {
        if (s !== currentTopLevel) {
          newSet.add(s);
        }
      });
      activeParents.forEach((s) => newSet.delete(s));
      return newSet;
    });
  }, [headings]);

  // 滚动 TOC 容器使活动项可见
  const scrollTocToActiveItem = (slug: string) => {
    const tocContainer = tocRef.current;
    const activeItem = itemRefs.current.get(slug);
    if (!tocContainer || !activeItem) return;

    const containerRect = tocContainer.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    // 计算项目相对于容器的位置
    const itemTop = itemRect.top - containerRect.top + tocContainer.scrollTop;
    const itemBottom = itemTop + itemRect.height;

    // 检查项目是否在可视区域内（留一点边距）
    const padding = 40;
    const visibleTop = tocContainer.scrollTop + padding;
    const visibleBottom = tocContainer.scrollTop + tocContainer.clientHeight - padding;

    if (itemTop < visibleTop) {
      // 项目在上方，滚动到使其可见
      tocContainer.scrollTo({
        top: itemTop - padding,
        behavior: 'smooth',
      });
    } else if (itemBottom > visibleBottom) {
      // 项目在下方，滚动到使其可见
      tocContainer.scrollTo({
        top: itemBottom - tocContainer.clientHeight + padding,
        behavior: 'smooth',
      });
    }
  };

  // 监听 TOC 容器滚动，更新遮罩显示状态
  const updateScrollMasks = useCallback(() => {
    const el = tocRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const isScrollable = scrollHeight > clientHeight;

    setShowTopMask(isScrollable && scrollTop > 10);
    setShowBottomMask(isScrollable && scrollTop < scrollHeight - clientHeight - 10);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateScrollMasks();
    const el = tocRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollMasks, { passive: true });
      return () => el.removeEventListener('scroll', updateScrollMasks);
    }
  }, [collapsed, updateScrollMasks]); // 折叠状态变化时重新计算

  // 当活动标题变化时，滚动 TOC 使其可见
  useEffect(() => {
    if (activeSlug) {
      // 延迟一点执行，确保折叠动画完成后再滚动
      const timer = setTimeout(() => {
        scrollTocToActiveItem(activeSlug);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeSlug]);

  useEffect(() => {
    const updateActiveHeading = () => {
      const viewportMiddle = window.scrollY + window.innerHeight / 2;

      let closestHeading: string | null = null;
      let closestDistance = Infinity;

      for (const heading of headings) {
        const el = document.getElementById(heading.slug);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const distance = Math.abs(elementTop - viewportMiddle);

        if (elementTop <= viewportMiddle && distance < closestDistance) {
          closestDistance = distance;
          closestHeading = heading.slug;
        }
      }

      if (closestHeading && closestHeading !== activeSlug) {
        setActiveSlug(closestHeading);
        // 只有在非滚动状态下才更新折叠
        if (!isScrollingRef.current) {
          updateCollapsed(closestHeading);
        }
      }
    };

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      updateActiveHeading();
    };

    const handlePauseScroll = () => {
      isScrollingRef.current = true;
    };

    const handleResumeScroll = () => {
      isScrollingRef.current = false;
      // 恢复后更新当前位置并触发折叠
      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      let closestHeading: string | null = null;
      let closestDistance = Infinity;

      for (const heading of headings) {
        const el = document.getElementById(heading.slug);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const distance = Math.abs(elementTop - viewportMiddle);
        if (elementTop <= viewportMiddle && distance < closestDistance) {
          closestDistance = distance;
          closestHeading = heading.slug;
        }
      }

      if (closestHeading) {
        setActiveSlug(closestHeading);
        updateCollapsed(closestHeading);
      }
    };

    updateActiveHeading();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('toc-pause-scroll', handlePauseScroll);
    window.addEventListener('toc-resume-scroll', handleResumeScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('toc-pause-scroll', handlePauseScroll);
      window.removeEventListener('toc-resume-scroll', handleResumeScroll);
    };
  }, [headings, activeSlug, updateCollapsed]);

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
        <div
          ref={(el) => {
            if (el) {
              itemRefs.current.set(heading.slug, el);
            }
          }}
          className="flex items-center group"
        >
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
    <nav className="sticky top-24">
      {/* 外层容器：圆角边框和背景 */}
      <div className="rounded-2xl bg-black/20 border border-white/10 backdrop-blur-lg shadow-lg shadow-black/20 overflow-hidden">
        {/* 顶部高光 */}
        <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent z-10" />

        {/* 顶部渐变遮罩 */}
        <div
          className={clsx(
            'absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-white/20 to-transparent pointer-events-none z-10 transition-opacity duration-300 rounded-t-2xl',
            showTopMask ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* 可滚动内容区域 */}
        <div
          ref={tocRef}
          className="max-h-[calc(100vh-8rem)] overflow-y-auto p-3"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <ul className="space-y-1">
            {topLevelHeadings.map((heading) =>
              renderHeadingItem(heading, headings.findIndex(h => h.slug === heading.slug))
            )}
          </ul>
        </div>

        {/* 底部渐变遮罩 */}
        <div
          className={clsx(
            'absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white/20 to-transparent pointer-events-none z-10 transition-opacity duration-300 rounded-b-2xl',
            showBottomMask ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
    </nav>
  );
};
