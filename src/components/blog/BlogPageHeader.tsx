"use client";

import { motion } from "framer-motion";
import { useTransition } from "@/contexts/TransitionContext";

export function BlogPageHeader({ title, description }: { title: string, description: string[] }) {
  const { phase } = useTransition();
  const shouldFadeOut = phase === "preparing" || phase === "navigating";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: shouldFadeOut ? 0 : 1,
        y: shouldFadeOut ? -30 : 0,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="max-w-4xl mx-auto text-center mb-16 space-y-4"
    >
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-br from-white via-white/80 to-white/40 tracking-tight pb-2">
        {title}
      </h1>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        {description[0]}
        <br className="hidden md:block" />
        {description[1]}
      </p>
    </motion.div>
  );
}
