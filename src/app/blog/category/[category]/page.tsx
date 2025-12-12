import { getSortedPostsData, getPostsWithContent } from "@/lib/mdx";
import BlogListClient from "@/components/blog/BlogListClient";
import { BlogPageHeader } from "@/components/blog/BlogPageHeader";
import { Metadata } from "next";
import { getPageContent, getPageMetadata, getCategoryConfig, getAllCategoryDisplayNames } from "@/lib/content-loader";
import { notFound } from "next/navigation";
import { EssayPageClient, EssayMeta } from "@/components/essay/EssayPageClient";
import BlogSubNavbar from "@/components/blog/BlogSubNavbar";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { MdxImage } from "@/components/mdx/MdxImage";
import { CATEGORY_ALL, CATEGORY_ESSAY } from "@/constants/categories";
import "katex/dist/katex.min.css";

// MDX 自定义组件映射
const mdxComponents = {
  img: MdxImage,
};

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// 为静态导出生成所有可能的分类参数
export async function generateStaticParams() {
  const allPosts = getSortedPostsData();
  
  // 获取所有唯一的分类
  const categories = Array.from(new Set(
    allPosts
      .map(post => post.category)
      .filter(Boolean) as string[]
  ));
  
  // 返回分类参数
  return categories.map(category => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const pageMetadata = getPageMetadata('blog');
  
  return {
    ...pageMetadata,
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} - ${pageMetadata.title}`,
    description: `Articles in ${category} category`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // 获取所有文章
  const allPosts = getSortedPostsData();

  // 过滤出指定分类的文章
  const filteredPosts = allPosts.filter(post =>
    post.category?.toLowerCase() === category.toLowerCase()
  );

  // 如果分类不存在或没有文章，显示404
  if (filteredPosts.length === 0) {
    notFound();
  }

  const content = getPageContent('blog');

  // 获取所有分类
  const categories = Array.from(new Set(
    allPosts
      .map(post => post.category)
      .filter(Boolean) as string[]
  ));

  // 获取分类配置
  const categoryConfig = getCategoryConfig(category);

  // 使用分类配置或回退到默认值
  const displayName = categoryConfig?.name || category.charAt(0).toUpperCase() + category.slice(1);
  const displayTitle = categoryConfig?.title || `${displayName} Articles`;
  const displayDescription = categoryConfig?.description || [`Browse all ${category} articles`, ""];
  const emptyStateText = `No ${category} articles found.`;

  // 获取所有分类的显示名称映射
  const categoryDisplayNames = getAllCategoryDisplayNames();

  // 修改页面标题和描述
  const modifiedContent = {
    ...content,
    header: {
      ...content.header,
      title: displayTitle,
      description: displayDescription,
    },
    list: {
      ...content.list,
      emptyState: emptyStateText,
    },
  };

  // 如果是 essay 分类，使用时间轴布局
  const isEssayCategory = category.toLowerCase() === CATEGORY_ESSAY;

  if (isEssayCategory) {
    // 获取包含完整内容的文章
    const essayPosts = getPostsWithContent(CATEGORY_ESSAY);

    // 提取元数据
    const essayMetas: EssayMeta[] = essayPosts.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      time: post.time,
    }));

    // 构建期断言：数据数量与内容必须一致，否则直接失败
    if (essayMetas.length !== essayPosts.length) {
      const metaCount = essayMetas.length;
      const postCount = essayPosts.length;
      const slugs = essayMetas.map((m) => m.slug);
      throw new Error(
        `构建失败：随笔元信息(${metaCount})与内容(${postCount})数量不一致。slugs=${JSON.stringify(slugs)}`
      );
    }
    // 额外校验：内容必须存在
    const invalid = essayPosts.filter((p) => !p.content || p.content.trim().length === 0).map((p) => p.slug);
    if (invalid.length > 0) {
      throw new Error(`构建失败：以下随笔内容为空或无效：${JSON.stringify(invalid)}`);
    }

    // 所有分类列表（用于子导航栏）
    const allCategories = [CATEGORY_ALL, ...categories];

    return (
      <div className="min-h-screen py-24 px-4 sm:px-8">
        {/* 页面头部 */}
        <BlogPageHeader
          title={modifiedContent.header.title}
          description={modifiedContent.header.description}
        />

        {/* 子导航栏 */}
        <div className="w-full max-w-5xl mx-auto">
          <BlogSubNavbar
            allCategories={allCategories}
            selectedCategory={category}
            isTransitioning={false}
            categoryDisplayNames={categoryDisplayNames}
          />
        </div>

        {/* 时间轴布局 - 使用 MDXRemote 渲染每篇随笔 */}
        <EssayPageClient
          essayMetas={essayMetas}
          emptyState={modifiedContent.list.emptyState}
        >
          {essayPosts.map((post) => (
            <MDXRemote
              key={post.slug}
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [rehypeKatex],
                },
              }}
            />
          ))}
        </EssayPageClient>
      </div>
    );
  }

  // 其他分类使用默认的博客列表布局
  return (
    <div className="min-h-screen py-24 px-4 sm:px-8">
      {/* 页面头部：大标题（客户端组件，支持过渡动画） */}
      <BlogPageHeader
        title={modifiedContent.header.title}
        description={modifiedContent.header.description}
      />

      {/* 2. 将数据传递给客户端组件进行渲染和交互 */}
      <BlogListClient
        posts={filteredPosts}
        allPosts={allPosts}
        searchPlaceholder={modifiedContent.list.searchPlaceholder}
        emptyState={modifiedContent.list.emptyState}
        currentCategory={category}
        categoryDisplayNames={categoryDisplayNames}
      />
    </div>
  );
}
