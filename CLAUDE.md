# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

YewRings 是一个基于 Next.js 16 App Router 的现代博客系统，采用"液态玻璃"(Liquid Glass) 设计风格。使用 MDX 作为内容源，支持静态生成 (SSG)。

## 常用命令

```bash
pnpm dev          # 启动开发服务器 (http://localhost:3000)
pnpm build        # 构建生产版本 (静态生成所有页面)
pnpm start        # 启动生产服务器
pnpm lint         # ESLint 代码检查
pnpm tests:hide   # 隐藏测试文章
pnpm tests:show   # 显示测试文章
```

## 架构设计

### 内容系统

- **文章存储**: `content/posts/{category}/{slug}.mdx` - 文章按文件夹分类，文件夹名即分类名
- **页面配置**: `content/pages/*.json` - 各页面的文案配置（标题、描述、按钮文字等）
- **全局元数据**: `content/meta.json` - 站点信息和默认作者配置
- **分类配置**: `content/pages/categories.json` - 分类显示名称和描述

### MDX 处理流程

核心逻辑在 `src/lib/mdx.ts`:
- `getAllPostFiles()` - 递归扫描 posts 目录，结果会被模块级缓存
- `getSortedPostsData()` - 获取所有文章元数据，按日期降序
- `getPostData(slug)` - 获取单篇文章内容和标题列表
- `getPostsWithContent(category)` - 获取指定分类文章（含完整内容），用于随笔时间轴

文章 frontmatter 支持:
- `time: "auto"` - 从文件修改时间自动获取
- `updated: "auto"` - 自动获取更新日期
- 生产环境自动过滤 `test` 分类和 `test` 前缀文章

### 特殊分类

定义在 `src/constants/categories.ts`:
- `CATEGORY_ALL = "all"` - 虚拟分类，路由为 `/blog` 而非 `/blog/category/all`
- `CATEGORY_ESSAY = "essay"` - 随笔，使用时间轴布局，在首页最新文章中排除

### 路由结构

```
/                         - 首页 (src/app/page.tsx)
/blog                     - 博客列表 (src/app/blog/page.tsx)
/blog/[slug]              - 文章详情 (src/app/blog/[slug]/page.tsx)
/blog/category/[category] - 分类页面 (src/app/blog/category/[category]/page.tsx)
/about                    - 关于页面 (src/app/about/page.tsx)
```

### 状态管理

`src/contexts/` 目录包含 React Context:
- `SearchContext` - 搜索弹窗状态管理

### UI 组件

- `src/components/ui/` - 通用组件 (GlassCard, GlassButton, Navbar, Footer)
- `src/components/blog/` - 博客组件 (BlogListClient, TableOfContents, BlogPostContent)
- `src/components/home/` - 首页组件 (TechStackSection)
- `src/components/essay/` - 随笔组件 (EssayTimeline, EssayTimelineCard)

### 样式系统

- Tailwind CSS 4 + PostCSS
- `@tailwindcss/typography` 插件处理 MDX 渲染样式
- 全局样式在 `src/app/globals.css`，包含液态背景和噪点层
- Glass 颜色变量: `--color-glass-100/200/300`, `--color-glass-border`

## Docker 部署

```bash
docker compose up -d --build          # 生产部署
docker compose --profile dev up dev   # 开发环境
```

配置文件:
- `Dockerfile` - 生产环境多阶段构建
- `docker-compose.yml` - 主配置
- `docker-compose.override.yml` - 本地覆盖配置 (git ignored)

由于使用 SSG，更新文章后需要重新构建镜像。

## 写作指南

创建新文章:
```mdx
---
title: 文章标题
date: 2024-01-01
description: 文章描述
time: "auto"      # 可选，自动获取时间
updated: "auto"   # 可选，自动获取更新日期
author: 作者名称   # 可选，默认使用 meta.json 中的配置
---

文章内容...
```

支持: GFM (表格、任务列表)、KaTeX 数学公式、自动生成 TOC
