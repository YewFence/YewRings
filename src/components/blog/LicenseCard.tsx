"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, Copy, Check, X, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LicenseConfig {
  title: string;
  text_prefix: string;
  link_text: string;
  link_url: string;
  text_suffix: string;
  reprint_text_prefix: string;
  reprint_text_link: string;
  reprint_text_middle: string;
  reprint_text_author: string;
  reprint_text_suffix: string;
  copy_button_text: string;
  copied_button_text: string;
  copy_suffix: string;
}

interface LicenseCardProps {
  title: string;
  slug: string;
  config: LicenseConfig;
}

export function LicenseCard({ title, slug, config }: LicenseCardProps) {
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");
  const [url, setUrl] = useState("");

  useEffect(() => {
    // 在客户端获取完整的 URL
    setUrl(window.location.origin + `/blog/${slug}`);
  }, [slug]);

  const copyToClipboard = async () => {
    try {
      const textToCopy = `${title}\n${url}\n${config.copy_suffix}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopyState("success");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  return (
    <div className="mt-12 not-prose">
      <GlassCard
        className="p-6 border-l-4 border-l-pink-400/50 bg-pink-900/10"
        hoverEffect={false}
        disableInitialAnimation={true}
      >
        <div className="flex flex-col gap-4">
          {/* 头部：图标和许可名称 */}
          <div className="flex items-center gap-3 text-pink-200">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="font-bold text-lg">{config.title}</h3>
          </div>

          {/* 内容说明 */}
          <div className="text-slate-300 text-sm space-y-2">
            <p>
              {config.text_prefix}{" "}
              <a
                href={config.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-pink-400/30 underline-offset-2 transition-colors"
              >
                {config.link_text}
              </a>
              {config.text_suffix}
            </p>
            <p>
              {config.reprint_text_prefix}
              <span className="text-white font-medium">{config.reprint_text_link}</span>
              {config.reprint_text_middle}
              <span className="text-white font-medium">{config.reprint_text_author}</span>
              {config.reprint_text_suffix}
            </p>
          </div>

          {/* 链接复制区域 */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/5 mt-2">
             <LinkIcon className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
            <code className="flex-1 text-xs text-slate-300 truncate font-mono select-all">
              {url || `.../blog/${slug}`}
            </code>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
              title="复制文章链接及版权信息"
            >
              <AnimatePresence mode="wait">
                {copyState === "success" ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 text-green-300"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {config.copied_button_text}
                  </motion.span>
                ) : copyState === "error" ? (
                  <motion.span
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                    复制失败
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {config.copy_button_text}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}