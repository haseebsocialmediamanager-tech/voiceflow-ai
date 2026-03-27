"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

/* ── Raw speech (long sentence, spins on circle) ─────────────── */
const RAW_LONG =
  "Umm so basically what I wanted to say is... the deadline thing is kinda ugh you know? I told the team it should be ready by Friday although it's probably gonna slip again. There's been so much back and forth and like nobody really knows what's going on. Can you check if Sarah sent out the notes from yesterday's meeting? I think she mentioned it but I'm kinda lost. Also the client invoice — uh I forgot to send it and now they're upset but like honestly the product is really good so...   ·   ";

/* ── Short clean phrases flow along the diagonal ribbon ────────── */
const RIBBON_TEXT =
  "Confirmed  ·  Understood  ·  On it  ·  Certainly  ·  I'll proceed  ·  Noted  ·  Thank you  ·  Acknowledged  ·  I recommend  ·  With pleasure  ·  As requested  ·  Absolutely  ·  Great point  ·  Proceeding  ·  My pleasure  ·  ";

/* ── Diagonal path: sweeps from bottom-left to upper-right ────── */
/* viewBox: 0 0 1200 140  — path starts low-left, ends high-right  */
const DIAG_PATH = "M-30,128 C280,90 720,38 1230,10";

/* ── Section ─────────────────────────────────────────────────── */
export function VoiceTransformSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#08080f", minHeight: 560 }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 58% 46%, rgba(99,102,241,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Spinning circle — raw messy speech, left side ── */}
      <div
        className="absolute pointer-events-none"
        style={{ top: -55, left: -175, width: 490, height: 490, zIndex: 1 }}
      >
        <svg width="490" height="490" viewBox="0 0 490 490">
          <defs>
            <path id="vf-circle-path" d="M245,28 A217,217 0 1,1 244.999,28 Z" />
          </defs>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "245px 245px" }}
          >
            <text
              fontSize="15.5"
              fontFamily="Inter, system-ui, sans-serif"
              fill="rgba(255,255,255,0.28)"
              letterSpacing="0.8"
            >
              <textPath href="#vf-circle-path">
                {RAW_LONG + RAW_LONG}
              </textPath>
            </text>
          </motion.g>
        </svg>
      </div>

      {/* ── Heading + CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center px-4 pt-20 sm:pt-28 pb-24 sm:pb-32"
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

      {/* ── Diagonal ribbon — short clean phrases ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ bottom: 0, zIndex: 10 }}
      >
        <div className="overflow-hidden w-full">
          {/* Two SVGs side-by-side, animate-marquee-reverse scrolls them */}
          <div
            className="animate-marquee-reverse flex"
            style={{ width: "max-content" }}
          >
            {[0, 1].map((idx) => (
              <svg
                key={idx}
                viewBox="0 0 1200 140"
                style={{
                  width: "100vw",
                  minWidth: "100vw",
                  height: "140px",
                  display: "block",
                }}
                preserveAspectRatio="none"
              >
                <defs>
                  <path id={`vf-diag-${idx}`} d={DIAG_PATH} />
                </defs>
                {/* Thick ribbon stroke */}
                <use
                  href={`#vf-diag-${idx}`}
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="68"
                  fill="none"
                  strokeLinecap="butt"
                />
                {/* Short phrases on ribbon */}
                <text
                  fontSize="20"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontWeight="700"
                  fill="#0a0a14"
                  letterSpacing="0.5"
                >
                  <textPath href={`#vf-diag-${idx}`} startOffset="2%">
                    {RIBBON_TEXT}
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
