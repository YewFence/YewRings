"use client";

import { EssayTimeline } from "./EssayTimeline";
import { EssayTimelineCard } from "./EssayTimelineCard";
import { Children, type ReactNode } from "react";

// 随笔元数据类型（不包含内容）
export interface EssayMeta {
  slug: string;
  title: string;
  date: string;
  time?: string;
}

interface EssayPageClientProps {
  essayMetas: EssayMeta[];
  children: ReactNode[]; // 服务端渲染好的 MDX 内容数组
  emptyState?: string;
}

export function EssayPageClient({ essayMetas, children, emptyState = "暂无随笔" }: EssayPageClientProps) {
  if (essayMetas.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-lg">{emptyState}</p>
      </div>
    );
  }

  // 将 children 数组转换为可索引的数组
  const childrenArray = Children.toArray(children);
  if (childrenArray.length !== essayMetas.length) {
    const metaCount = essayMetas.length;
    const childCount = childrenArray.length;
    const slugs = essayMetas.map((m) => m.slug);
    console.error("EssayPageClient: 随笔元信息与渲染内容数量不匹配", {
      metaCount,
      childCount,
      slugs,
    });
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        `内容映射错误：随笔元信息(${metaCount})与渲染内容(${childCount})不匹配`
      );
    }
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">
          内容加载出现异常，请刷新或稍后再试
        </p>
        <p className="text-slate-500 mt-2 text-sm">若持续出现，请联系站点维护者。</p>
      </div>
    );
  }
  return (
    <EssayTimeline>
      {essayMetas.map((essay, index) => (
        <EssayTimelineCard
          key={essay.slug}
          title={essay.title || undefined}
          date={essay.date}
          time={essay.time}
          isLeft={index % 2 === 0}
        >
          {childrenArray[index]}
        </EssayTimelineCard>
      ))}
    </EssayTimeline>
  );
}
