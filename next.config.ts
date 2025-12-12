import type { NextConfig } from "next";

// 安全头配置
const securityHeaders = [
  {
    // 防止点击劫持
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // 阻止 MIME 类型嗅探
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // 控制 Referer 信息泄露
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // 禁用不需要的浏览器功能
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // 内容安全策略 - 根据博客需求配置
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // MDX 需要 unsafe-inline
      "style-src 'self' 'unsafe-inline'", // Tailwind/KaTeX 需要
      "img-src 'self' data: https:", // 允许 HTTPS 图片
      "font-src 'self' data:", // next/font 自托管
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // 判断：只有当环境变量 BUILD_STANDALONE 为 'true' 时，才开启 standalone
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : "export",
  // 仅开发环境下允许通过 VPN 域名访问（CORS 简化）
  allowedDevOrigins: ["*.chaco-anaconda.ts.net"],
  // 图片优化配置
  images: {
    // 静态导出时使用未优化模式（必须）
    unoptimized: process.env.BUILD_STANDALONE !== "true",
  },
  // 安全头配置（仅 standalone 模式生效，静态导出需在服务器配置）
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
export default nextConfig;
