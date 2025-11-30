"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const ScrollIndicator = () => {
  const scrollToContent = () => {
    const content = document.getElementById("latest-posts");
    if (content) {
      content.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
      onClick={scrollToContent}
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="p-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors"
      >
        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-cyan-300" />
      </motion.div>
    </motion.div>
  );
};
