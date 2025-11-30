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

- 🪟 **玻璃风格 UI** - 灵感来自 Apple Liquid Glass 设计语言，增加毛玻璃效果
- 🎨 **动态渐变背景** - 流动的液态网格背景，配合噪点纹理层
- 🚀 **极致性能** - 基于 Next.js 16 App Router 构建，支持 SSG 静态生成
- ✍️ **MDX 支持** - 使用 MDX 编写博客，支持 GFM、数学公式 (KaTeX)
- 🎭 **丝滑动画** - Framer Motion 驱动的页面过渡与交互动画
- 📱 **响应式设计** - 完美适配移动端、平板与桌面设备
- 🌙 **深色主题** - 专为深色模式优化的视觉体验

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16, React 19 |
| **样式** | Tailwind CSS 4, CSS Variables |
| **动画** | Framer Motion |
| **内容** | MDX, gray-matter |
| **语法增强** | remark-gfm, remark-math, rehype-katex |
| **包管理** | pnpm |
| **语言** | TypeScript 5 |

## 📁 项目结构

```
yew-rings/
├── content/                # 内容目录
│   ├── meta.json          # 全局元数据
│   ├── pages/             # 页面文案配置 (JSON)
│   └── posts/             # 博客文章 (MDX)
├── public/                # 静态资源
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── about/        # 关于页面
│   │   ├── blog/         # 博客页面
│   │   └── [slug]/       # 动态文章路由
│   ├── components/       # React 组件
│   │   ├── ui/          # 通用 UI 组件 (GlassCard, Navbar...)
│   │   ├── blog/        # 博客相关组件
│   │   ├── home/        # 首页组件
│   │   └── about/       # 关于页组件
│   ├── contexts/        # React Context
│   └── lib/             # 工具函数 (MDX 处理, 内容加载)
└── scripts/             # 构建脚本
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 自定义网站
编辑 `content/pages/*.json` 文件，自由修改站点各个页面的名称、标题和描述：

## ✍️ 写作指南

### 默认元信息
在 `content/meta.json` 中配置默认的文章元信息：

示例：

```json
{
  "default": {
    "author": "YewFence"
  }
}
```

### 创建新文章

在 `content/posts/` 目录下创建 `.mdx` 文件：

```mdx
---
title: 文章标题
date: 2024-01-01
author: 作者名称(可选)
description: 文章描述
tags:
  - 标签1
  - 标签2
---

文章内容...
```

### 支持的 Markdown 特性

- ✅ GitHub Flavored Markdown (表格、任务列表、删除线等)
- ✅ 数学公式 (KaTeX): 行内 `$E=mc^2$` 或块级 `$$...$$`
- ✅ 代码高亮
- ✅ 自动生成目录 (TOC)

## 📜 脚本命令

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm tests:hide` | 隐藏测试文章 |
| `pnpm tests:show` | 显示测试文章 |

## 🐳 Docker 部署

本项目支持使用 Docker 和 Docker Compose 进行容器化部署。

### 快速启动

#### 1. 创建 override 配置文件

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
```

根据需要编辑 `docker-compose.override.yml`，配置端口映射或网络设置。

#### 2. 生产环境部署

```bash
# 构建并启动
docker compose up -d --build

# 查看日志
docker compose logs -f web

# 停止服务
docker compose down
```

#### 3. 开发环境（支持热重载）

```bash
docker compose --profile dev up dev
```

### 配置说明

| 文件 | 说明 |
|------|------|
| `Dockerfile` | 生产环境多阶段构建，使用 standalone 模式优化镜像 |
| `Dockerfile.dev` | 开发环境，支持热重载 |
| `docker-compose.yml` | 主配置文件 |
| `docker-compose.override.yml` | 本地配置覆盖（已被 git 忽略） |
| `.dockerignore` | Docker 构建时忽略的文件 |

### Override 配置示例

**直接暴露端口：**

```yaml
services:
  web:
    ports:
      - "3000:3000"
```

**使用 Nginx 反向代理：**

```yaml
services:
  web:
    networks:
      - nginx-proxy-network

networks:
  nginx-proxy-network:
    external: true
```

### 常用命令

```bash
# 仅构建镜像
docker compose build

# 重新构建并启动
docker compose up -d --build

# 查看容器状态
docker compose ps

# 进入容器
docker compose exec web sh

# 清理所有容器和镜像
docker compose down --rmi all
```

### 更新文章

由于 Next.js 生产模式使用 **静态生成 (SSG)**，页面在构建时已生成为 HTML 文件。

**开发环境：** 修改 `content/` 目录下的文章后，Next.js 会自动热重载，无需任何操作。

**生产环境：** 修改文章后需要重新构建镜像：

```bash
docker compose up -d --build web
```

> ⚠️ 仅重启容器 (`docker compose restart`) 不会更新文章内容，必须重新构建。

## 🎨 设计理念

**年轮 (Rings)** 象征着时间的沉淀与成长的痕迹。正如树木的年轮记录着每一年的故事，这个博客记录着学习路上的每一个脚印。

采用液态玻璃 (Liquid Glass) 设计语言，营造沉浸式的阅读体验——半透明的玻璃卡片、流动的渐变背景、细腻的动画过渡，让技术笔记也能赏心悦目。

## 📄 许可证

MIT License © [YewFence](https://yewyard.cn)
