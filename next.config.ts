import type { NextConfig } from "next";

const nextConfig: NextConfig = {
// 判断：只有当环境变量 BUILD_STANDALONE 为 'true' 时，才开启 standalone
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : 'export',
};

export default nextConfig;
