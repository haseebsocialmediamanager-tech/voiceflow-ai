"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

/* ── Raw speech snippets (messy, unpolished) ────────────────── */
const RAW_TEXTS = [
  "um so basically i wanted to say that the project is like kinda done but not really",
  "yeah so i was thinking maybe we could like you know push the deadline a bit",
  "hey so the meeting was really good i think we uh covered most of the stuff",
  "so i need you to uh write me an email to the client about the you know the invoice",
  "honestly the product is really good i just think the price is a little bit too high",
  "so basically what happened was um i forgot to send the report and now they're upset",
  "i think we should just go ahead and launch it like why are we waiting so long",
  "can you help me write a linkedin post about my new job i start on monday",
];

/* ── Polished AI-enhanced versions ─────────────────────────── */
const CLEAN_TEXTS = [
  "The project is nearing completion with a few remaining items to finalize.",
  "I'd like to propose adjusting the project deadline to allow for thorough review.",
  "The meeting was highly productive — we addressed the key agenda points effectively.",
  "Please draft a professional email to the client regarding the outstanding invoice.",
  "The product quality is excellent. I believe the pricing could be more competitive.",
  "I inadvertently omitted the report from yesterday's submission — apologies for any inconvenience.",
  "I recommend proceeding with the launch. Further delays may impact our momentum.",
  "Excited to share that I'm starting a new role this Monday — a new chapter begins!",
];

/* Build one long string for each strip by joining all items */
const RAW_STRIP   = RAW_TEXTS.join("   ·   ");
const CLEAN_STRIP = CLEAN_TEXTS.join("   ·   ");

/* ── Pulsing mic processor ──────────────────────────────────── */
function MicProcessor() {
  return (
    <div className="relative flex-shrink-0 flex items-center justify-center mx-6 sm:mx-10">
      {/* Pulse rings */}
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

/* ── One scrolling text strip ───────────────────────────────── */
function TextStrip({
  text,
  direction,
  dim,
  bold,
  speed,
}: {
  text: string;
  direction: "left" | "right";
  dim: boolean;
  bold: boolean;
  speed: string;
}) {
  const doubled = text + "     " + text;
  const cls = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div className="overflow-hidden w-full">
      <div className={`${cls} ${speed} whitespace-nowrap inline-block`}>
        <span
          className={`text-sm sm:text-base lg:text-lg leading-none tracking-wide ${
            bold ? "font-semibold text-white" : "font-normal"
          }`}
          style={{ color: dim ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.88)" }}
        >
          {doubled}
        </span>
      </div>
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
        <div className="mb-6 flex items-center">
          <div
            className="flex-shrink-0 text-[10px] uppercase tracking-widest text-white/18 w-16 sm:w-24 text-right pr-3 sm:pr-5 select-none"
          >
            Raw
          </div>
          <div className="flex-1 overflow-hidden py-2">
            <TextStrip
              text={RAW_STRIP}
              direction="left"
              dim={true}
              bold={false}
              speed=""
            />
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
        <div className="mt-6 flex items-center">
          <div
            className="flex-shrink-0 text-[10px] uppercase tracking-widest text-brand-400/50 w-16 sm:w-24 text-right pr-3 sm:pr-5 select-none"
          >
            AI
          </div>
          <div className="flex-1 overflow-hidden py-2">
            <TextStrip
              text={CLEAN_STRIP}
              direction="right"
              dim={false}
              bold={true}
              speed=""
            />
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

      {/* Fade edges on strips */}
      <div
        className="absolute inset-y-0 left-0 w-24 pointer-events-none z-20"
        style={{ background: "linear-gradient(to right, #08080f, transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 pointer-events-none z-20"
        style={{ background: "linear-gradient(to left, #08080f, transparent)" }}
      />
    </section>
  );
}
