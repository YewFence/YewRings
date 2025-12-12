'use client';

import { useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以在这里记录错误到错误追踪服务
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard className="p-8 md:p-12 max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">出错了</h1>
          <p className="text-slate-400">
            抱歉，页面加载时发生了错误。
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
            <p className="text-red-400 text-sm font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <GlassButton onClick={reset} icon={<RefreshCw className="w-4 h-4" />}>
            重试
          </GlassButton>
          <Link href="/">
            <GlassButton variant="secondary" icon={<Home className="w-4 h-4" />}>
              返回首页
            </GlassButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
