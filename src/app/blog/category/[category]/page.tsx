import { getSortedPostsData } from "@/lib/mdx";
import BlogListClient from "@/components/blog/BlogListClient";
import { BlogPageHeader } from "@/components/blog/BlogPageHeader";
import { Metadata } from "next";
import { getPageContent, getPageMetadata } from "@/lib/content-loader";
import { notFound } from "next/navigation";

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
  
  // 检查分类是否存在
  const categoryExists = categories.some(cat => 
    cat.toLowerCase() === category.toLowerCase()
  );
  
  if (!categoryExists) {
    notFound();
  }
  
  // 修改页面标题和描述
  const modifiedContent = {
    ...content,
    header: {
      ...content.header,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Articles`,
      description: `Browse all ${category} articles`,
    },
    list: {
      ...content.list,
      emptyState: `No ${category} articles found.`,
    },
  };

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
      />
    </div>
  );
}
