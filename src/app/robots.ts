import type { MetadataRoute } from 'next';

const BASE_URL = 'https://blog.yewyard.cn';

// 静态导出需要此配置
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
