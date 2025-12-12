/**
 * 特殊分类常量
 * 只定义有特殊逻辑的分类，普通分类从 categories.json 自动读取
 */

// "全部" - 虚拟分类，不对应真实文章，有特殊路由逻辑（/blog 而非 /blog/category/all）
export const CATEGORY_ALL = "all";

// "随笔" - 有特殊布局（时间轴）和过滤逻辑（主页排除）
export const CATEGORY_ESSAY = "essay";
