"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface BlogSubNavbarProps {
  allCategories: string[];
  selectedCategory: string;
  onCategoryChange?: (category: string) => void;
  isTransitioning: boolean;
  currentCategory?: string;
}

export default function BlogSubNavbar({
  allCategories,
  selectedCategory,
  onCategoryChange,
  isTransitioning,
  currentCategory
}: BlogSubNavbarProps) {
  const router = useRouter();

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // 更新本地状态（如果提供了回调）
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    
    // 执行路由跳转
    const href = category === "All" ? "/blog" : `/blog/category/${category.toLowerCase()}`;
    router.push(href);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -20 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center gap-4 mb-12"
    >
      {allCategories.map(category => {
        const isActive = selectedCategory === category;
        const href = category === "All" ? "/blog" : `/blog/category/${category.toLowerCase()}`;
        
        return (
          <a
            key={category}
            href={href}
            onClick={(e) => handleCategoryClick(category, e)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer
              ${isActive
                ? 'bg-white/10 text-white shadow-md'
                : 'bg-transparent text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
          >
            {category === "All" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
          </a>
        );
      })}
    </motion.div>
  );
}
