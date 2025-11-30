"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Palette, 
  Code2, 
  Cpu, 
  Layers, 
  Zap, 
  LayoutTemplate,
  FileType,
  Wind
} from "lucide-react";

const techStack = [
  {
    icon: <Code2 className="w-6 h-6 text-blue-400" />,
    title: "Next.js 15",
    description: "采用最新的 App Router 架构与 React Server Components，提供良好的性能与开发体验。",
    color: "bg-blue-500/10 border-blue-500/20"
  },
  {
    icon: <Wind className="w-6 h-6 text-cyan-400" />,
    title: "Tailwind CSS",
    description: "原子化 CSS 引擎，配合自定义配置构建独特的玻璃拟态设计系统。",
    color: "bg-cyan-500/10 border-cyan-500/20"
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Framer Motion",
    description: "声明式动画库，实现流畅的交互反馈与页面过渡效果。",
    color: "bg-yellow-500/10 border-yellow-500/20"
  },
  {
    icon: <FileType className="w-6 h-6 text-pink-400" />,
    title: "MDX Content",
    description: "将 Markdown 与 React 组件结合，支持丰富、可交互的文章内容。",
    color: "bg-pink-500/10 border-pink-500/20"
  }
];

const designFeatures = [
  {
    icon: <Palette className="w-5 h-5" />,
    text: "Liquid Glass 视觉语言"
  },
  {
    icon: <LayoutTemplate className="w-5 h-5" />,
    text: "现代流体玻璃风格"
  },
  {
    icon: <Layers className="w-5 h-5" />,
    text: "多层级背景模糊"
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    text: "响应式交互体验"
  }
];

export const TechStackSection = () => {
  return (
    <section id="tech-stack" className="min-h-screen w-full flex flex-col items-center justify-center py-24 px-4 relative overflow-hidden bg-linear-to-b from-black/20 to-transparent">
      {/* 背景装饰 */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-6xl space-y-16">
        
        {/* 头部介绍 */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-slate-200 to-slate-400 pb-2">
              设计与技术
            </h2>
            <p className="text-lg text-slate-400 mt-4 leading-relaxed">
              本博客基于现代 Web 技术栈构建，尝试探索流体玻璃质感在界面设计中的应用，提供舒适的阅读体验。
            </p>
          </motion.div>

          {/* 设计特性标签 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {designFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 技术栈网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard 
                className="h-full p-6 flex flex-col gap-4 hover:bg-white/10 transition-colors duration-300 group"
                disableInitialAnimation
                transition={{ duration: 0.4 }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                    {tech.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
