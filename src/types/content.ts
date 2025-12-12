/**
 * 页面内容类型定义
 * 对应 content/pages/*.json 文件结构
 */

// 通用 metadata 结构
export interface PageMetadata {
  title: string;
  description: string;
}

// About 页面内容 (about.json)
export interface AboutPageContent {
  metadata: PageMetadata;
  title: string;
  subtitle: string;
  description: string[];
  buttons: {
    personalWebsite: string;
  };
  links: {
    personalWebsite: string;
  };
  stats: {
    fullstack: string;
    network: string;
    creative: string;
  };
}

// Blog 页面内容 (blog.json)
export interface BlogPageContent {
  metadata: PageMetadata;
  header: {
    title: string;
    description: string[];
  };
  list: {
    searchPlaceholder: string;
    emptyState: string;
  };
  post: {
    backToList: string;
  };
}

// Post 页面内容 (post.json)
export interface PostPageContent {
  license: {
    title: string;
    text_prefix: string;
    link_text: string;
    link_url: string;
    text_suffix: string;
    reprint_text_prefix: string;
    reprint_text_link: string;
    reprint_text_middle: string;
    reprint_text_author: string;
    reprint_text_suffix: string;
    copy_button_text: string;
    copied_button_text: string;
    copy_error_text: string;
    copy_suffix: string;
  };
}

// Home 页面内容 (home.json)
export interface HomePageContent {
  metadata: PageMetadata;
  hero: {
    title: string;
    description: string;
    techStack: string;
    buttons: {
      startReading: string;
      github: string;
    };
    links: {
      github: string;
    };
  };
  latestPosts: {
    title: string;
    lastUpdateLabel: string;
    viewAll: string;
    noPosts: string;
    moreComing: {
      title: string;
      description: string;
    };
    readMore: string;
    postLabel: string;
  };
}

// Meta 配置 (meta.json)
export interface MetaContent {
  site: {
    name: string;
    title: string;
    description: string;
  };
  default: {
    author: string;
  };
}

// 分类配置 (categories.json)
export interface CategoryConfig {
  name: string;
  title: string;
  description: string[];
}

export type CategoriesConfig = Record<string, CategoryConfig>;

// NotFound 页面内容 (not-found.json)
export interface NotFoundPageContent {
  metadata: PageMetadata;
  title: string;
  subtitle: string;
  description: string;
  buttons: {
    home: string;
    blog: string;
  };
}
