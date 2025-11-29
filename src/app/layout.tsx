import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { PageTransitionOverlay } from "@/components/ui/PageTransitionOverlay";

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
        <TransitionProvider>
          {/* 1. 静态液态背景层 */}
          <div className="fixed inset-0 bg-slate-900 bg-liquid-mesh -z-20" />

          {/* 2. 噪点层 (覆盖在背景之上，但内容之下) */}
          <div className="noise-overlay" />

          {/* 导航栏 */}
          <Navbar />

          {/* 3. 主要内容 */}
          <main className="relative z-10 pt-24 px-4">{children}</main>

          {/* 4. 页面过渡动画覆盖层 */}
          <PageTransitionOverlay />
        </TransitionProvider>
      </body>
    </html>
  );
}