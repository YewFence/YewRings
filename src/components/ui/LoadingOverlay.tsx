'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function SpiralSpinner() {
  return (
    <div className="relative w-32 h-32">
      {/* 外圈紫色大弧 - 顺时针慢速，起始 0° */}
      <div className="absolute inset-0" style={{ transform: 'rotate(0deg)' }}>
        <svg
          className="w-full h-full animate-spin-slow"
          viewBox="0 0 512 512"
          fill="none"
        >
          <path
            d="M 100 400 A 200 200 0 1 1 420 300"
            stroke="#9333ea"
            strokeWidth="28"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 中外圈绿色弧 - 逆时针中速，起始 165° */}
      <div className="absolute inset-0" style={{ transform: 'rotate(165deg)' }}>
        <svg
          className="w-full h-full animate-spin-reverse-medium"
          viewBox="0 0 512 512"
          fill="none"
        >
          <path
            d="M 380 180 A 140 140 0 1 1 150 340"
            stroke="#4ade80"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 中圈紫色弧 - 顺时针中速，起始 15° */}
      <div className="absolute inset-0" style={{ transform: 'rotate(15deg)' }}>
        <svg
          className="w-full h-full animate-spin-medium"
          viewBox="0 0 512 512"
          fill="none"
        >
          <path
            d="M 300 140 A 100 100 0 1 1 200 360"
            stroke="#9333ea"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 内中圈绿色弧 - 逆时针快速，起始 195° */}
      <div className="absolute inset-0" style={{ transform: 'rotate(195deg)' }}>
        <svg
          className="w-full h-full animate-spin-reverse-fast"
          viewBox="0 0 512 512"
          fill="none"
        >
          <path
            d="M 310 200 A 70 70 0 1 1 220 320"
            stroke="#4ade80"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 内圈紫色小弧 - 顺时针快速，起始 30° */}
      <div className="absolute inset-0" style={{ transform: 'rotate(30deg)' }}>
        <svg
          className="w-full h-full animate-spin-fast"
          viewBox="0 0 512 512"
          fill="none"
        >
          <path
            d="M 290 220 A 40 40 0 1 1 240 300"
            stroke="#9333ea"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* 最内圈绿色点 - 逆时针最快，起始 210° */}
      <div className="absolute inset-0" style={{ transform: 'rotate(210deg)' }}>
        <svg
          className="w-full h-full animate-spin-reverse-fastest"
          viewBox="0 0 512 512"
          fill="none"
        >
          <path
            d="M 280 240 A 20 20 0 1 1 250 270"
            stroke="#4ade80"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

export function LoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const prevPathRef = useRef(pathname);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 监听路由开始变化（通过 link 点击事件）
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const url = new URL(link.href);
        // 如果是不同的路径，开始 loading
        if (url.pathname !== pathname) {
          setIsLoading(true);
          // 延迟 500ms 后才显示
          showTimerRef.current = setTimeout(() => {
            setShouldShow(true);
          }, 500);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  // 路由完成后隐藏 loading
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      // 清除显示计时器
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      // 开始渐出 - 这里的 setState 是响应外部系统(路由)变化的正确用法
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, [pathname, searchParams]);

  // 渐出动画结束后完全隐藏
  useEffect(() => {
    if (!isLoading && shouldShow) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, 500); // 等待渐出动画完成
      return () => clearTimeout(timer);
    }
  }, [isLoading, shouldShow]);

  // 如果不需要显示，直接返回 null
  if (!shouldShow) return null;

  return (
    <div
      className={`
        fixed inset-0 z-100 flex items-center justify-center
        transition-all duration-500 ease-out
        ${isLoading
          ? 'opacity-100 backdrop-blur-md bg-black/30'
          : 'opacity-0 backdrop-blur-0 bg-transparent pointer-events-none'
        }
      `}
    >
      <div
        className={`
          transition-all duration-500 ease-out
          ${isLoading ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
        `}
      >
        <SpiralSpinner />
      </div>
    </div>
  );
}
