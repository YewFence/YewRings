"use client";

import { useEffect, useState } from "react";

export function Footer({ siteName }: { siteName: string }) {
  // 使用 useState 和 useEffect 来避免服务端渲染和客户端渲染的 Hydration 不匹配问题（特别是关于时间/年份）
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative z-10 mt-12 border-t border-white/10 bg-glass-100/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-300">
          <div className="text-center md:text-left">
            <p>© {currentYear} {siteName}. All rights reserved.</p>
            <p className="text-slate-500 mt-1 text-xs">
              using Next.js & Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
