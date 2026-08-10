"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const pageTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function DashboardTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.main
      initial={{
        opacity: 0,
        filter: "blur(6px)",
        scale: 0.992,
      }}
      animate={{
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
      }}
      transition={pageTransition}
      style={{
        transformOrigin: "center top",
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </motion.main>
  );
}