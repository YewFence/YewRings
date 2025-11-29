"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { PostMeta } from "@/lib/mdx";

// 过渡状态类型
interface TransitionState {
  isTransitioning: boolean;
  phase: "idle" | "animating-out" | "navigating" | "animating-in";
  sourceRect: DOMRect | null;
  postData: PostMeta | null;
  targetSlug: string | null;
}

// Context 值类型
interface TransitionContextValue extends TransitionState {
  startTransition: (rect: DOMRect, post: PostMeta, slug: string) => void;
  setPhase: (phase: TransitionState["phase"]) => void;
  endTransition: () => void;
}

const initialState: TransitionState = {
  isTransitioning: false,
  phase: "idle",
  sourceRect: null,
  postData: null,
  targetSlug: null,
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TransitionState>(initialState);

  const startTransition = useCallback((rect: DOMRect, post: PostMeta, slug: string) => {
    setState({
      isTransitioning: true,
      phase: "animating-out",
      sourceRect: rect,
      postData: post,
      targetSlug: slug,
    });
  }, []);

  const setPhase = useCallback((phase: TransitionState["phase"]) => {
    setState((prev) => ({ ...prev, phase }));
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
