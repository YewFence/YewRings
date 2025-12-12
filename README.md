<div align="center">
  <h1>🌲 YewRings</h1>
  <p><strong>记录成长的年轮 · 学习笔记 · 技术分享</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## ✨ 特性

- 🪟 **玻璃风格 UI** - 灵感来自 Apple Liquid Glass 设计语言，增加毛玻璃效果与流光边框
- 🎨 **动态视差背景** - 流动的液态网格背景，配合噪点纹理层，随滚动产生视差
- 🚀 **极致性能** - 基于 Next.js 16 App Router 构建，支持 SSG 静态生成与 Docker 独立部署
- ✍️ **MDX 深度集成** - 支持 GFM、数学公式 (KaTeX)、自定义组件，自动化图片管理
- 🎭 **丝滑交互** - Framer Motion 驱动的页面过渡、滚动视差与手势交互
- 📱 **全端适配** - 完美适配移动端、平板与桌面设备，支持 PWA 基础配置
- 🌙 **深色模式** - 专为深色模式优化的视觉体验，霓虹配色点缀

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **框架** | Next.js | 16 (App Router) |
| **核心** | React | 19 |
| **样式** | Tailwind CSS | 4 |
| **动画** | Framer Motion | 12 |
| **内容** | MDX | v2 |
| **部署** | Docker | Multi-stage Build |
| **包管理** | pnpm | 10+ |

## 📁 项目结构

```
yew-rings/
├── content/                # 内容源 (Git 追踪)
│   ├── images/            # 原始图片资源 (会被自动复制到 public)
│   ├── meta.json          # 全局元数据 (默认作者等)
│   ├── pages/             # 页面文案配置 (JSON)
│   │   ├── categories.json # 分类配置
│   │   └── *.json         # 各页面文案
│   └── posts/             # 博客文章 (MDX)
│       └── {category}/    # 按文件夹分类
├── public/                # 静态资源 (自动生成/手动放置)
├── scripts/               # 构建工具脚本
│   └── copy-images.mjs    # 图片自动同步脚本
├── src/
│   ├── app/              # Next.js App Router 路由
│   ├── components/       # React 组件库
│   │   ├── ui/          # 通用玻璃拟态组件
│   │   ├── blog/        # 博客业务组件
│   │   └── mdx/         # MDX 自定义组件
│   ├── lib/             # 核心逻辑 (MDX 解析, 内容加载)
│   └── styles/          # 全局样式
└── docker-compose.yml   # 容器编排配置
```

## 🚀 快速开始

### 环境要求

- Node.js 20+
- pnpm 9+

### 安装依赖

```bash
pnpm install
```

### 开发命令

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动本地开发服务器 (`http://localhost:3000`) |
| `pnpm build` | 构建生产版本 (默认静态导出至 `out/` 或 Standalone) |
| `pnpm build:test` | **构建包含测试文章的版本** (设置 `INCLUDE_TEST_POSTS=true`) |
| `pnpm lint` | 代码质量检查 |

> **注意**: `pnpm build` 默认会忽略 `content/posts/test` 目录及以 `test` 开头的文章。如需预览测试文章，请使用 `pnpm build:test`。

## ✍️ 写作与内容管理

### 1. 创建文章

在 `content/posts/{category}/` 目录下创建 `.mdx` 文件。文件夹名自动作为**分类**。

```mdx
---
title: "文章标题"
date: "2024-03-20"
description: "简短的描述，用于列表页展示"
time: "auto"        # 自动获取文件创建时间
updated: "auto"     # 自动获取文件修改时间
author: "YewFence"  # 可选，覆盖默认作者
---

这里是正文内容...
```

### 2. 图片管理

将文章图片放入 `content/images/` 目录。
运行 `pnpm dev` 或 `pnpm build` 时，脚本会自动将其复制到 `public/images/posts/`。

在 MDX 中引用：

```markdown
![图片描述](/images/posts/my-image.png)
```

### 3. 测试文章

- 将文章放在 `content/posts/test/` 目录下，或文件名以 `test-` 开头。
- 这些文章在默认生产构建中会被**自动隐藏**。
- 使用 `pnpm build:test` 可强制包含它们以便预览。

## 🐳 Docker 部署

项目完全支持 Docker 化部署，提供开发与生产两套配置。

### 开发环境 (支持热重载)

使用 `dev` profile 启动容器，挂载本地目录实现代码与内容的热更新。

```bash
docker compose --profile dev up dev
```

### 生产环境

生产环境使用多阶段构建 (Multi-stage build) 产出最小化的 Standalone 镜像。

```bash
# 1. 创建本地配置覆盖 (可选)
cp docker-compose.override.yml.example docker-compose.override.yml

# 2. 构建并启动
docker compose up -d --build blog

# 3. 查看日志
docker compose logs -f blog
```

**关于内容更新：**
生产环境容器挂载了 `content` 目录。
- **添加/修改文章**: 虽然目录已挂载，但由于 Next.js SSG 机制，通常需要**重启或重新构建容器**才能让静态页面生效。
- **新增动态路由**: 如果启用了 ISR 或动态参数，新页面可能即时生效。

建议每次更新内容后执行：
```bash
docker compose up -d --build blog
```

## 🎨 设计系统

**年轮 (Rings)** 象征着时间的沉淀与成长的痕迹。正如树木的年轮记录着每一年的故事，这个博客记录着学习路上的每一个脚印。

采用 **"Liquid Glass"** 设计语言：
- **色彩**: 深邃的蓝紫色调，搭配青色/粉色霓虹点缀。
- **材质**: 高度依赖 `backdrop-filter: blur()` 实现毛玻璃质感，配合半透明边框。
- **动效**: 强调流体感，页面切换如水流般自然，卡片悬停伴随光效流动。

## 📄 许可证

MIT License © [YewFence](https://yewyard.cn)