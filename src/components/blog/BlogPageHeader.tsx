"use client";

import { motion } from "framer-motion";
import { useTransition } from "@/contexts/TransitionContext";

export function BlogPageHeader() {
  const { isTransitioning } = useTransition();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isTransitioning ? 0 : 1,
        y: isTransitioning ? -30 : 0,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto text-center mb-16 space-y-4"
    >
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-br from-white via-white/80 to-white/40 tracking-tight pb-2">
        思维碎片
      </h1>
      <p className="text-lg text-slate-400 max-w-2xl mx-auto">
        这里汇集了我对代码、设计与未来的液态思考。
        <br className="hidden md:block" />
        像水一样流动，像玻璃一样透明。
      </p>
    </motion.div>
  );
}
