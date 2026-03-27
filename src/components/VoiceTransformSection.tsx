"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

/* ── Long raw speech (messy, like the user actually speaks) ─── */
const RAW_LONG =
  "Umm so basically what I wanted to say is... the deadline thing is kinda ugh you know? I told the team it should be ready by Friday although it's probably gonna slip again. There's been so much back and forth and like nobody really knows what's going on. Can you check if Sarah sent out the notes from yesterday's meeting? I think she mentioned it but I'm kinda lost. Also the client invoice — uh I forgot to send it and now they're upset but like honestly the product is really good so...   ·   ";

/* ── Same content, AI-polished ──────────────────────────────── */
const CLEAN_LONG =
  "I wanted to flag that the Friday deadline may slip due to ongoing back-and-forth. Could you confirm whether Sarah distributed the meeting notes? The client invoice was inadvertently omitted — my apologies for the oversight. Despite these delays, I remain confident in our product quality and our team's ability to deliver.   ·   ";

/* Band path: gentle arc across 1200 units */
const BAND_PATH = "M0,45 C300,18 900,72 1200,45";

/* ── Section ────────────────────────────────────────────────── */
export function VoiceTransformSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#08080f", minHeight: 580 }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 55% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Spinning circle (raw speech) ── left, partially offscreen */}
      <div
        className="absolute pointer-events-none"
        style={{ top: -60, left: -170, width: 480, height: 480, zIndex: 1 }}
      >
        <svg width="480" height="480" viewBox="0 0 480 480">
          <defs>
            <path
              id="vf-circle-path"
              d="M240,28 A212,212 0 1,1 239.999,28 Z"
            />
          </defs>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "240px 240px" }}
          >
            <text
              fontSize="15"
              fontFamily="Inter, system-ui, sans-serif"
              fill="rgba(255,255,255,0.28)"
              letterSpacing="1"
            >
              <textPath href="#vf-circle-path">
                {RAW_LONG + RAW_LONG}
              </textPath>
            </text>
          </motion.g>
        </svg>
      </div>

      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center px-4 pt-20 sm:pt-28 pb-20 sm:pb-28"
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

      {/* ── Bottom band: clean polished text flows as ribbon ── */}
      <div className="relative z-10 w-full" style={{ marginBottom: -4 }}>
        <div className="overflow-hidden w-full">
          <div
            className="animate-marquee-reverse flex"
            style={{ width: "max-content" }}
          >
            {[0, 1].map((idx) => (
              <svg
                key={idx}
                viewBox="0 0 1200 90"
                style={{
                  width: "100vw",
                  minWidth: "100vw",
                  height: "90px",
                  display: "block",
                }}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <path id={`vf-band-${idx}`} d={BAND_PATH} />
                </defs>
                {/* Solid ribbon background */}
                <use
                  href={`#vf-band-${idx}`}
                  stroke="rgba(255,255,255,0.94)"
                  strokeWidth="72"
                  fill="none"
                  strokeLinecap="butt"
                />
                {/* Clean text on ribbon */}
                <text
                  fontSize="19"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontWeight="600"
                  fill="#08080f"
                  letterSpacing="0.3"
                >
                  <textPath href={`#vf-band-${idx}`} startOffset="4%">
                    {CLEAN_LONG}
                  </textPath>
                </text>
              </svg>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
