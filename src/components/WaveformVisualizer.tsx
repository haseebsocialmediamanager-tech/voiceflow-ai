"use client";

import { motion } from "framer-motion";

interface Props {
  isActive: boolean;
}

export function WaveformVisualizer({ isActive }: Props) {
  const bars = 24;

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: "3px",
            background: isActive
              ? "linear-gradient(to top, #4f46e5, #a5b8fc)"
              : "rgba(255,255,255,0.1)",
          }}
          animate={
            isActive
              ? {
                  height: [
                    "6px",
                    `${12 + Math.random() * 28}px`,
                    `${8 + Math.random() * 20}px`,
                    "6px",
                  ],
                  opacity: [0.6, 1, 0.8, 0.6],
                }
              : { height: "4px", opacity: 0.2 }
          }
          transition={
            isActive
              ? {
                  duration: 0.6 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: i * 0.04,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
