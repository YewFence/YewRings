"use client";

import { EssayTimeline } from "./EssayTimeline";
import { EssayTimelineCard } from "./EssayTimelineCard";
import type { ReactNode } from "react";

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
  const childrenArray = Array.isArray(children) ? children : [children];

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
