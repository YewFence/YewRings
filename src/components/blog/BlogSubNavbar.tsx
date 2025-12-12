"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CATEGORY_ALL } from "@/constants/categories";

interface BlogSubNavbarProps {
  allCategories: string[];
  selectedCategory: string;
  isTransitioning: boolean;
  categoryDisplayNames?: Record<string, string>;
}

export default function BlogSubNavbar({
  allCategories,
  selectedCategory,
  isTransitioning,
  categoryDisplayNames = {}
}: BlogSubNavbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      layoutId="blog-sub-navbar"
      className="flex justify-center gap-4 mb-12"
    >
      {allCategories.map(category => {
        const isActive = selectedCategory === category;
        // category 已经是规范化后的小写值
        const href = category === CATEGORY_ALL ? "/blog" : `/blog/category/${category}`;

        // 获取显示名称：优先使用categoryDisplayNames，否则使用默认格式化
        const displayName = categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
        
        return (
          <Link
            key={category}
            href={href}
            className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer
              ${isActive
                ? 'bg-white/10 text-white shadow-md'
                : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            {displayName}
          </Link>
        );
      })}
    </motion.div>
  );
}
