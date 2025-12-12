# 项目改进计划

## 高优先级 🔴

- [x] **添加 sitemap.xml** - 创建 `src/app/sitemap.ts`，对 SEO 至关重要
- [x] **添加 robots.txt** - 创建 `src/app/robots.ts`
- [x] **添加 Error Boundary** - 创建 `src/app/error.tsx` 处理运行时错误
- [x] **添加结构化数据 (JSON-LD)** - 在 `src/app/blog/[slug]/page.tsx` 添加 Article schema
- [x] **修复 `any` 类型** - 为 `src/lib/content-loader.ts` 和 `src/components/about/AboutContent.tsx` 定义明确的 TypeScript 接口

## 中优先级 🟡

- [x] **添加搜索功能** - 实现客户端搜索（FlexSearch 或简单匹配）
- [ ] **添加 RSS Feed** - 创建 `src/app/feed.xml/route.ts`
- [x] **改善可访问性** - 添加 ARIA 属性、改善焦点样式
- [x] **添加 Loading 状态** - 创建 `src/app/loading.tsx` 骨架屏
- [x] **清理控制台日志** - 移除 `src/components/blog/LicenseCard.tsx:48` 的 `console.error`

## 低优先级 🟢

- [ ] **标签系统** - frontmatter 已支持 tags，需要在前端实现标签页和筛选
- [ ] **阅读时间估算** - 根据文章字数计算预估阅读时间
- [ ] **相关文章推荐** - 在文章底部显示相关文章
- [ ] **深浅主题切换** - 目前只有深色模式，可添加主题切换
- [x] **字体优化** - 使用 `next/font` 优化字体加载
- [x] **图片优化** - 使用 `next/image` 组件（如果有配图）
- [x] **安全头配置** - 在 `next.config.ts` 添加 CSP 等安全头

## 评估得分

| 维度 | 得分 | 备注 |
|------|------|------|
| 代码质量 | ⭐⭐⭐⭐⭐ | any 类型已修复 |
| 性能优化 | ⭐⭐⭐⭐ | SSG + 模块级缓存表现良好 |
| SEO | ⭐⭐⭐⭐⭐ | sitemap、robots、JSON-LD 已添加 |
| 可访问性 | ⭐⭐⭐⭐⭐ | ARIA 属性和焦点样式已完善 |
| 用户体验 | ⭐⭐⭐⭐⭐ | 动画流畅，交互优秀 |
| 功能完整性 | ⭐⭐⭐ | 缺少搜索、RSS 等常见功能 |

**总体评分：⭐⭐⭐⭐（4/5）**
