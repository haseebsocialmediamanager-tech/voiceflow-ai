"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

export function VoiceTransformSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#08080f" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Heading + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center px-6 pt-20 sm:pt-28 pb-20 sm:pb-28"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-white/40 mb-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          AI Enhancement · Live
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          Don&apos;t type,{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg,#a5b8fc 0%,#6366f1 40%,#8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            just speak
          </span>
        </h2>

        <p className="text-white/40 text-lg sm:text-xl max-w-xl mx-auto mb-10">
          Your words go in messy. VoiceFlow sends them out polished.
        </p>

        <Link
          href="/app"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all hover:scale-[1.04]"
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            boxShadow: "0 0 40px rgba(99,102,241,0.4)",
          }}
        >
          <Mic size={18} />
          Start speaking free
        </Link>
        <p className="text-white/25 text-sm mt-4">
          No credit card · 25+ languages · Works in 30 seconds
        </p>
      </motion.div>
    </section>
  );
}
