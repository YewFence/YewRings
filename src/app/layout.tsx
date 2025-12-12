import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { PageTransitionOverlay } from "@/components/ui/PageTransitionOverlay";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { Footer } from "@/components/ui/Footer";
import { getMetaContent } from "@/lib/content-loader";

const meta = getMetaContent();

export const metadata: Metadata = {
  title: {
    default: meta.site.title,
    template: `%s | ${meta.site.name}`,
  },
  description: meta.site.description,
  icons: {
    // 桌面浏览器常用（路径统一至 /icon）
    icon: [
      { url: "/icon/favicon.ico" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/logo.svg", type: "image/svg+xml" },
    ],
    // iOS 设备主屏幕图标（必须 PNG，建议 180x180）
    apple: [
      { url: "/icon/apple-touch-icon.png", sizes: "180x180" },
    ],
    // 旧版浏览器或快捷方式图标
    shortcut: [
      { url: "/icon/favicon.ico" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: meta.site.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen relative selection:bg-pink-500/30 selection:text-pink-200">
        <SearchProvider>
          <TransitionProvider>
            {/* 1. 静态液态背景层 */}
            <div className="fixed inset-0 bg-slate-900 bg-liquid-mesh -z-20" />

            {/* 2. 噪点层 (覆盖在背景之上，但内容之下) */}
            <div className="noise-overlay" />

            {/* 导航栏 */}
            <Navbar />

            {/* 3. 主要内容 */}
            <main className="relative z-10 pt-24 px-4 min-h-[calc(100vh-200px)]">{children}</main>

            {/* 页脚 */}
            <Footer siteName={meta.site.name} />

            {/* 4. 页面过渡动画覆盖层 */}
            <PageTransitionOverlay />

            {/* 5. 路由切换 Loading 覆盖层 */}
            <Suspense fallback={null}>
              <LoadingOverlay />
            </Suspense>
          </TransitionProvider>
        </SearchProvider>
      </body>
    </html>
  );
}