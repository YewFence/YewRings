"use client";

import { ReactNode } from "react";

interface EssayTimelineProps {
  children: ReactNode[];
}

export function EssayTimeline({ children }: EssayTimelineProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* 时间轴线条 - 桌面端居中，移动端靠左 */}
      <div className="timeline-line absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5" />

      {/* 时间轴项目 */}
      <div className="relative">
        {children.map((child, index) => (
          <div
            key={index}
            className={`
              relative flex items-start gap-6 mb-8 last:mb-0
              ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}
            `}
          >
            {/* 时间轴节点 */}
            <div
              className={`
                absolute left-4 md:left-1/2 -translate-x-1/2
                w-3 h-3 rounded-full
                bg-cyan-400 shadow-[0_0_10px_#22d3ee,0_0_20px_rgba(34,211,238,0.5)]
                z-10
                mt-6
              `}
            />

            {/* 连接线到卡片 - 移动端 */}
            <div
              className={`
                absolute left-[22px] top-[30px] w-4 h-0.5
                bg-gradient-to-r from-cyan-400/50 to-transparent
                md:hidden
              `}
            />

            {/* 连接线到卡片 - 桌面端 */}
            <div
              className={`
                hidden md:block absolute top-[30px] w-8 h-0.5
                ${
                  index % 2 === 0
                    ? "left-1/2 bg-gradient-to-r from-cyan-400/50 to-transparent"
                    : "right-1/2 bg-gradient-to-l from-cyan-400/50 to-transparent"
                }
              `}
            />

            {/* 卡片内容 */}
            {/* 移动端：卡片在右侧 */}
            {/* 桌面端：卡片左右交替 */}
            <div
              className={`
                w-full pl-10
                md:w-[calc(50%-2rem)] md:pl-0
                ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}
              `}
            >
              {child}
            </div>

            {/* 占位空间 - 仅桌面端 */}
            <div className="hidden md:block md:w-[calc(50%-2rem)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
