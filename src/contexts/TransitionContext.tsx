"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { PostMeta } from "@/lib/mdx";

// 过渡阶段类型
type TransitionPhase = "idle" | "preparing" | "navigating" | "animating-in" | "settling";

// 过渡状态类型
interface TransitionState {
  isTransitioning: boolean;
  phase: TransitionPhase;
  sourceRect: DOMRect | null;
  postData: PostMeta | null;
  targetSlug: string | null;
  targetRect: DOMRect | null; // 详情页卡片的目标位置
}

// Context 值类型
interface TransitionContextValue extends TransitionState {
  startTransition: (rect: DOMRect, post: PostMeta, slug: string) => void;
  setPhase: (phase: TransitionState["phase"]) => void;
  setTargetRect: (rect: DOMRect) => void;
  endTransition: () => void;
}

const initialState: TransitionState = {
  isTransitioning: false,
  phase: "idle",
  sourceRect: null,
  postData: null,
  targetSlug: null,
  targetRect: null,
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TransitionState>(initialState);

  const startTransition = useCallback((rect: DOMRect, post: PostMeta, slug: string) => {
    setState({
      isTransitioning: true,
      phase: "preparing",
      sourceRect: rect,
      postData: post,
      targetSlug: slug,
      targetRect: null,
    });
  }, []);

  const setPhase = useCallback((phase: TransitionState["phase"]) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const setTargetRect = useCallback((rect: DOMRect) => {
    setState((prev) => ({ ...prev, targetRect: rect }));
  }, []);

  const endTransition = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        ...state,
        startTransition,
        setPhase,
        setTargetRect,
        endTransition,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}

// 可选：用于在非 Provider 环境下安全使用
export function useTransitionSafe() {
  return useContext(TransitionContext);
}
