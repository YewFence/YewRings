"use client";

export function Footer({ siteName }: { siteName: string }) {
  // 直接使用当前年份，SSR 时使用固定值避免 hydration 不匹配
  const currentYear = new Date().getFullYear();

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
