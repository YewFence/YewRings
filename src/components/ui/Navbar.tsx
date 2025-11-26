"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, User, BookOpen, Command } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { name: "首页", href: "/", icon: Home },
  { name: "博客", href: "/blog", icon: BookOpen },
  { name: "关于", href: "/about", icon: User },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      {/* pointer-events-auto: 确保只有导航栏本身可以点击，
         不会遮挡两边的点击区域
      */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="pointer-events-auto relative flex items-center gap-1 p-2 rounded-full border border-white/10 bg-black/25 backdrop-blur-xl shadow-2xl shadow-black/40"
      >
        {/* 新增：顶部高光元素 */}
        <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent" />

        {navItems.map((item) => {
          const isActive = pathname === item.href;
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

        {/* 一个装饰性的分割线和功能按钮 */}
        <div className="w-px h-4 bg-white/10 mx-2" />
        
        <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <Command className="w-4 h-4" />
        </button>
      </motion.nav>
    </div>
  );
};