import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      
      {/* 标题区域 */}
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-br from-white to-white/60 tracking-tight">
          Liquid Blog
        </h1>
        <p className="text-lg text-slate-300/80">
          探索数字世界的边界 · iOS 26 概念设计
        </p>
      </div>

      {/* 卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        
        {/* 卡片 1 */}
        <GlassCard className="p-8 group cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-white/10 w-fit">
              <Sparkles className="w-6 h-6 text-cyan-300" />
            </div>
            <span className="text-xs font-mono text-slate-400">2025.10.24</span>
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-white group-hover:text-cyan-200 transition-colors">
            构建未来的界面
          </h3>
          <p className="text-slate-400 mb-6 line-clamp-2">
            如何利用 React 和 Tailwind CSS 实现高性能的玻璃拟态效果？深度解析 Backdrop filter 的性能优化。
          </p>
          <div className="flex items-center text-sm text-cyan-300 font-medium">
            阅读全文 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </GlassCard>

        {/* 卡片 2 */}
        <GlassCard className="p-8 group cursor-pointer" hoverEffect={true}>
             <div className="h-full flex flex-col justify-center">
                <h3 className="text-xl text-slate-200">更多内容即将到来...</h3>
             </div>
        </GlassCard>

      </div>
    </div>
  );
}