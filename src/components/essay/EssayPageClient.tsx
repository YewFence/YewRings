"use client";

import { EssayTimeline } from "./EssayTimeline";
import { EssayTimelineCard } from "./EssayTimelineCard";

// 序列化后的随笔数据类型
export interface SerializedEssay {
  slug: string;
  title: string;
  date: string;
  time?: string;
  htmlContent: string; // 服务端渲染好的 HTML
}

interface EssayPageClientProps {
  essays: SerializedEssay[];
  emptyState?: string;
}

export function EssayPageClient({ essays, emptyState = "暂无随笔" }: EssayPageClientProps) {
  if (essays.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-lg">{emptyState}</p>
      </div>
    );
  }

  return (
    <EssayTimeline>
      {essays.map((essay) => (
        <EssayTimelineCard
          key={essay.slug}
          title={essay.title || undefined}
          date={essay.date}
          time={essay.time}
          htmlContent={essay.htmlContent}
        />
      ))}
    </EssayTimeline>
  );
}
