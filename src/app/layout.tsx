import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Liquid Space",
  description: "A futuristic liquid glass blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen relative selection:bg-pink-500/30 selection:text-pink-200">
        {/* 1. 静态液态背景层 */}
        <div className="fixed inset-0 bg-slate-900 bg-liquid-mesh -z-20" />
        
        {/* 2. 噪点层 (覆盖在背景之上，但内容之下) */}
        <div className="noise-overlay" />
        
        {/* 3. 主要内容 */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}