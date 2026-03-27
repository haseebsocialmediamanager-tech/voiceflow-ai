"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

/* ── Raw speech snippets (short, messy) ─────────────────────── */
const RAW_TEXTS = [
  "um...", "like you know", "basically", "kinda done", "uh...",
  "sort of", "I mean", "right?", "honestly", "so...",
  "like literally", "you know?", "kinda", "whatever", "ugh",
];

/* ── Polished AI versions (short, clean) ───────────────────── */
const CLEAN_TEXTS = [
  "Understood", "Certainly", "I'd suggest", "To clarify",
  "Please note", "Confirmed", "I recommend", "Noted",
  "In summary", "As requested", "Proceeding", "Thank you",
  "Acknowledged", "With pleasure", "On it",
];

const SEP = "     ·     ";
const RAW_STRIP   = RAW_TEXTS.join(SEP);
const CLEAN_STRIP = CLEAN_TEXTS.join(SEP);

/* ── Wave SVG paths over 1200 units (6 cycles × 200u) ──────── */
/* viewBox: 0 0 1200 120  — center y=60, amplitude ±38          */
const WAVE_DOWN = (() => {
  const pts = ["M0,60"];
  for (let i = 0; i < 6; i++) {
    const x = i * 200;
    pts.push(`C${x + 50},14 ${x + 150},106 ${x + 200},60`);
  }
  return pts.join(" ");
})();

const WAVE_UP = (() => {
  const pts = ["M0,60"];
  for (let i = 0; i < 6; i++) {
    const x = i * 200;
    pts.push(`C${x + 50},106 ${x + 150},14 ${x + 200},60`);
  }
  return pts.join(" ");
})();

/* ── Desktop: text follows SVG wave path ───────────────────── */
function WaveTextStrip({
  text,
  pathD,
  pathId,
  scrollClass,
  dim,
  bold,
}: {
  text: string;
  pathD: string;
  pathId: string;
  scrollClass: string;
  dim: boolean;
  bold: boolean;
}) {
  return (
    <div className="overflow-hidden w-full">
      <div className={`${scrollClass} flex`} style={{ width: "max-content" }}>
        {[0, 1].map((idx) => (
          <svg
            key={idx}
            viewBox="0 0 1200 120"
            style={{ width: "100vw", minWidth: "100vw", height: "62px", display: "block" }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <path id={`${pathId}-${idx}`} d={pathD} />
            </defs>
            <text
              fontSize="21"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={bold ? 600 : 400}
              fill={dim ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.88)"}
              letterSpacing="1.5"
            >
              <textPath href={`#${pathId}-${idx}`}>{text}</textPath>
            </text>
          </svg>
        ))}
      </div>
    </div>
  );
}

/* ── Mobile: flat scrolling text ───────────────────────────── */
function FlatTextStrip({
  text,
  direction,
  dim,
  bold,
}: {
  text: string;
  direction: "left" | "right";
  dim: boolean;
  bold: boolean;
}) {
  const doubled = text + "     " + text;
  const cls = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";
  return (
    <div className="overflow-hidden w-full">
      <div className={`${cls} whitespace-nowrap inline-block`}>
        <span
          className={`text-sm leading-none tracking-wide ${bold ? "font-semibold" : "font-normal"}`}
          style={{ color: dim ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.88)" }}
        >
          {doubled}
        </span>
      </div>
    </div>
  );
}

/* ── Pulsing mic processor ──────────────────────────────────── */
function MicProcessor() {
  return (
    <div className="relative flex-shrink-0 flex items-center justify-center mx-6 sm:mx-10">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-brand-500/20"
          animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
          style={{ width: 56, height: 56 }}
        />
      ))}
      <motion.div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
        animate={{
          boxShadow: [
            "0 0 20px rgba(99,102,241,0.4)",
            "0 0 50px rgba(99,102,241,0.7)",
            "0 0 20px rgba(99,102,241,0.4)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
      >
        <Mic size={22} className="text-white" />
      </motion.div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────── */
export function VoiceTransformSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "#08080f" }}>
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
      />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center px-4 mb-16 sm:mb-20"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-white/40 mb-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          AI Enhancement · Live
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          Don&apos;t type,{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#a5b8fc 0%,#6366f1 40%,#8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            just speak
          </span>
        </h2>

        <p className="text-white/40 text-lg sm:text-xl max-w-xl mx-auto">
          Your words go in messy. VoiceFlow sends them out polished.
        </p>
      </motion.div>

      {/* ── Transform strip ── */}
      <div className="relative z-10 w-full">

        {/* RAW input strip */}
        <div className="mb-4 flex items-center">
          <div className="flex-shrink-0 text-[10px] uppercase tracking-widest text-white/18 w-16 sm:w-24 text-right pr-3 sm:pr-5 select-none">
            Raw
          </div>
          <div className="flex-1 overflow-hidden py-1">
            {/* Mobile flat */}
            <div className="sm:hidden">
              <FlatTextStrip text={RAW_STRIP} direction="left" dim={true} bold={false} />
            </div>
            {/* Desktop wave */}
            <div className="hidden sm:block">
              <WaveTextStrip
                text={RAW_STRIP}
                pathD={WAVE_DOWN}
                pathId="vf-raw-wave"
                scrollClass="animate-marquee"
                dim={true}
                bold={false}
              />
            </div>
          </div>
        </div>

        {/* Center processor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 sm:gap-8 my-8"
        >
          {/* Left arrow decoration */}
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-6 h-px"
                style={{ background: `rgba(99,102,241,${0.08 + i * 0.1})` }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
            <span className="text-brand-500/60 text-xs">▶</span>
          </div>

          <MicProcessor />

          {/* Right arrow decoration */}
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-brand-500/60 text-xs">▶</span>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-6 h-px"
                style={{ background: `rgba(99,102,241,${0.8 - i * 0.1})` }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: (7 - i) * 0.1 }}
              />
            ))}
          </div>
        </motion.div>

        {/* CLEAN output strip */}
        <div className="mt-4 flex items-center">
          <div className="flex-shrink-0 text-[10px] uppercase tracking-widest text-brand-400/50 w-16 sm:w-24 text-right pr-3 sm:pr-5 select-none">
            AI
          </div>
          <div className="flex-1 overflow-hidden py-1">
            {/* Mobile flat */}
            <div className="sm:hidden">
              <FlatTextStrip text={CLEAN_STRIP} direction="right" dim={false} bold={true} />
            </div>
            {/* Desktop wave (opposite curve) */}
            <div className="hidden sm:block">
              <WaveTextStrip
                text={CLEAN_STRIP}
                pathD={WAVE_UP}
                pathId="vf-clean-wave"
                scrollClass="animate-marquee-reverse"
                dim={false}
                bold={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center mt-16 sm:mt-20 px-4"
      >
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
        <p className="text-white/25 text-sm mt-4">No credit card · 25+ languages · Works in 30 seconds</p>
      </motion.div>

      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 w-16 sm:w-24 pointer-events-none z-20"
        style={{ background: "linear-gradient(to right, #08080f, transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 sm:w-24 pointer-events-none z-20"
        style={{ background: "linear-gradient(to left, #08080f, transparent)" }}
      />
    </section>
  );
}
