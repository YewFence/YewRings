"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Search } from "lucide-react";
import { ClonedCard, BlogCardContent } from "@/components/blog/ClonedCard";
import BlogSubNavbar from "@/components/blog/BlogSubNavbar";
import { useTransition } from "@/contexts/TransitionContext";
import { useSearch } from "@/contexts/SearchContext";
import type { PostMeta } from "@/lib/mdx";
import { CATEGORY_ALL, CATEGORY_ESSAY } from "@/constants/categories";

// 动画变体配置：容器控制子元素的交错播放
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 每个子元素间隔 0.1秒出现，形成流水感
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
} as const;

// 动画变体配置：单个卡片的浮现动画
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
} as const;

interface LazyBlogCardProps {
  post: PostMeta;
  onCardClick: (post: PostMeta, slug: string) => void;
  setCardRef: (slug: string, element: HTMLDivElement | null) => void;
  isTransitioning: boolean;
  index: number;
}

function LazyBlogCard({ post, onCardClick, setCardRef, isTransitioning, index }: LazyBlogCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
    rootMargin: "50px 0px",
  });

  return (
    <motion.div
      key={post.slug}
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isTransitioning ? "exit" : (inView ? "show" : "hidden")}
      transition={{ 
        type: "spring", 
        stiffness: 50
      }}
    >
      <div
        onClick={() => onCardClick(post, post.slug)}
        className="cursor-pointer"
      >
        <BlogCardContent
          ref={(el) => setCardRef(post.slug, el)}
          post={post}
        />
      </div>
    </motion.div>
  );
}

// 克隆卡片的信息类型
interface ClonedCardData {
  slug: string;
  post: PostMeta;
  rect: DOMRect;
}

interface BlogListClientProps {
  posts: PostMeta[];
  allPosts?: PostMeta[];
  searchPlaceholder: string;
  emptyState: string;
  currentCategory?: string;
  categoryDisplayNames?: Record<string, string>;
}

export default function BlogListClient({
  posts,
  allPosts: providedAllPosts,
  searchPlaceholder,
  emptyState,
  currentCategory,
  categoryDisplayNames = {}
}: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clonedCard, setClonedCard] = useState<ClonedCardData | null>(null);
  const { isTransitioning, phase, targetSlug, startTransition, setPhase } = useTransition();
  const { isSearchOpen } = useSearch();
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const router = useRouter();

  // 规范化分类值：统一转为小写
  const normalizeCategory = useCallback((category: string | undefined): string => {
    if (!category) return "";
    return category.trim().toLowerCase();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(
    normalizeCategory(currentCategory) || CATEGORY_ALL
  );

  // preparing 阶段完成后（200ms），切换到 navigating 并执行路由跳转
  useEffect(() => {
    if (phase === "preparing" && targetSlug) {
      // 预加载目标页面
      router.prefetch(`/blog/${targetSlug}`);

      const timer = setTimeout(() => {
        setPhase("navigating");
        router.push(`/blog/${targetSlug}`);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [phase, targetSlug, router, setPhase]);

  // 分类过滤逻辑 - 基于完整文章列表进行过滤
  const filteredPosts = useMemo(() => {
    const basePosts = providedAllPosts || posts;

    let result: PostMeta[];
    if (selectedCategory === CATEGORY_ALL) {
      // 在主页的"全部"分类下，排除随笔文章
      if (!currentCategory) {
        result = basePosts.filter(post => normalizeCategory(post.category) !== CATEGORY_ESSAY);
      } else {
        result = basePosts;
      }
    } else {
      result = basePosts.filter(post =>
        normalizeCategory(post.category) === selectedCategory
      );
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [providedAllPosts, posts, selectedCategory, currentCategory, normalizeCategory, searchQuery]);

  // 如果提供了currentCategory，则自动选中该分类
  useEffect(() => {
    if (currentCategory) {
      setSelectedCategory(normalizeCategory(currentCategory));
    }
  }, [currentCategory, normalizeCategory]);

  // 处理卡片点击
  const handleCardClick = useCallback(
    (post: PostMeta, slug: string) => {
      if (isTransitioning) return;

      const cardElement = cardRefs.current.get(slug);
      if (!cardElement) return;

      const rect = cardElement.getBoundingClientRect();
      // 立即创建克隆卡片覆盖在原位置
      setClonedCard({ slug, post, rect });
      startTransition(rect, post, slug);
    },
    [isTransitioning, startTransition]
  );

  // 保存卡片 ref
  const setCardRef = useCallback((slug: string, element: HTMLDivElement | null) => {
    if (element) {
      cardRefs.current.set(slug, element);
    } else {
      cardRefs.current.delete(slug);
    }
  }, []);

  // 获取所有存在的分类（规范化后去重）
  const allCategories = useMemo(() => {
    const categoriesSet = new Set<string>([CATEGORY_ALL]);
    const allPostsForCategories = providedAllPosts || posts;
    allPostsForCategories.forEach((post: PostMeta) => {
      const normalized = normalizeCategory(post.category);
      if (normalized) {
        categoriesSet.add(normalized);
      }
    });
    return Array.from(categoriesSet);
  }, [posts, providedAllPosts, normalizeCategory]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 克隆卡片（脱离动画容器，不会被淡出） */}
      {clonedCard && (
        <ClonedCard
          post={clonedCard.post}
          rect={clonedCard.rect}
          isAnimating={phase === "preparing" || phase === "navigating"}
        />
      )}

      {/* 子导航栏组件 */}
      <BlogSubNavbar
        allCategories={allCategories}
        selectedCategory={selectedCategory}
        isTransitioning={isTransitioning}
        currentCategory={currentCategory}
        categoryDisplayNames={categoryDisplayNames}
      />

      {/* 搜索栏区域 - 平滑展开/收起 */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="relative mb-12 max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {/* 装饰性光晕 */}
              <div className="absolute inset-0 -z-10 rounded-2xl bg-cyan-500/20 blur-xl opacity-0 focus-within:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 文章网格 - 使用瀑布流布局 */}
      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div key={post.slug} className="break-inside-avoid">
              <LazyBlogCard
                post={post}
                onCardClick={handleCardClick}
                setCardRef={setCardRef}
                isTransitioning={isTransitioning}
                index={index}
              />
            </div>
          ))
        ) : (
          /* 空状态 */
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate={isTransitioning ? "exit" : "show"}
            className="col-span-full text-center py-20"
          >
            <p className="text-slate-500 text-lg">{emptyState}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
