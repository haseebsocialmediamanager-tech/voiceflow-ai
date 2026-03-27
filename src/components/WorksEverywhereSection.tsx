"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

/* ── Exact path from Wisprflow ──────────────────────────────── */
const SVG_PATH =
  "M0.629639 1.15771C82.9263 189.969 357.34 608.012 796.621 769.692C1235.9 931.372 1567.15 773.202 1711.79 678.175C1891.9 559.839 2155.65 289.609 2443.93 327.36C2732.2 365.111 3187.5 563.779 3568.82 1124.32";

/* ── App icons ───────────────────────────────────────────────── */
const APPS = [
  { name: "WhatsApp",  bg: "#25D366", letter: "W",   lsize: 58 },
  { name: "Gmail",     bg: "#EA4335", letter: "M",   lsize: 58 },
  { name: "ChatGPT",   bg: "#10A37F", letter: "AI",  lsize: 38 },
  { name: "LinkedIn",  bg: "#0A66C2", letter: "in",  lsize: 40 },
  { name: "Slack",     bg: "#4A154B", letter: "S",   lsize: 58 },
  { name: "Notion",    bg: "#1a1a1a", letter: "N",   lsize: 58 },
  { name: "Facebook",  bg: "#1877F2", letter: "f",   lsize: 64 },
  { name: "Figma",     bg: "#F24E1E", letter: "F",   lsize: 58 },
  { name: "VS Code",   bg: "#007ACC", letter: "</>", lsize: 32 },
  { name: "Discord",   bg: "#5865F2", letter: "D",   lsize: 58 },
  { name: "Instagram", bg: "#C13584", letter: "Ig",  lsize: 40 },
  { name: "Zoom",      bg: "#2D8CFF", letter: "Z",   lsize: 58 },
  { name: "Canva",     bg: "#7D2AE8", letter: "C",   lsize: 58 },
  { name: "YouTube",   bg: "#FF0000", letter: "▶",   lsize: 48 },
  { name: "X",         bg: "#111111", letter: "𝕏",   lsize: 58 },
  { name: "Grammarly", bg: "#15C39A", letter: "G",   lsize: 58 },
  { name: "Teams",     bg: "#6264A7", letter: "T",   lsize: 58 },
  { name: "Sheets",    bg: "#34A853", letter: "S",   lsize: 58 },
];
const N   = APPS.length;
const DUR = 42; // seconds per full traversal

/* ── Chat messages ──────────────────────────────────────────── */
const MESSAGES = [
  { id: 0, side: "left",  text: "Hey, are you free for a quick call?" },
  { id: 1, side: "right", text: "Yeah give me 5 mins, just wrapping up." },
  { id: 2, side: "left",  text: "No rush! Did you see the updated proposal?" },
  { id: 3, side: "right", text: "Yes! Looks great — few edits and we're good." },
  { id: 4, side: "left",  text: "Perfect. I'll book the call for 3 pm then." },
  { id: 5, side: "right", text: "Sounds good, talk then 👍" },
];

/* ── Phone mockup ───────────────────────────────────────────── */
function PhoneMockup() {
  const [visible, setVisible] = useState<number[]>([]);
  const [typing,  setTyping]  = useState(false);
  const [micOn,   setMicOn]   = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    function next(i: number) {
      if (i >= MESSAGES.length) {
        t = setTimeout(() => { setVisible([]); setTyping(false); setMicOn(false); setTimeout(() => next(0), 500); }, 3500);
        return;
      }
      const msg = MESSAGES[i];
      setTyping(true);
      if (msg.side === "right") setMicOn(true);
      t = setTimeout(() => {
        setTyping(false); setMicOn(false);
        setVisible(v => [...v, msg.id]);
        t = setTimeout(() => next(i + 1), 800 + msg.text.length * 20);
      }, 900 + (msg.side === "right" ? 400 : 0));
    }
    next(0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative mx-auto lg:mx-0 lg:ml-auto"
      style={{ width: 240, height: 490, background: "#0d0d1c", borderRadius: 34,
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)", overflow: "hidden" }}>

      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl z-10" style={{ background: "#0d0d1c" }} />

      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-6 pb-2.5 border-b border-white/5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">J</div>
        <div>
          <div className="text-[12px] font-semibold text-white leading-none">Jordan</div>
          <div className="text-[9px] text-green-400 mt-0.5">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="px-3 py-2 space-y-2 overflow-hidden" style={{ height: 328 }}>
        <AnimatePresence>
          {MESSAGES.filter(m => visible.includes(m.id)).map(msg => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22 }}
              className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[80%] px-2.5 py-1.5 text-[10.5px] leading-relaxed"
                style={{
                  background: msg.side === "right" ? "rgba(99,102,241,0.88)" : "rgba(255,255,255,0.07)",
                  color: msg.side === "right" ? "#fff" : "rgba(255,255,255,0.8)",
                  borderRadius: msg.side === "right" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                }}>
                {msg.text}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div key="typing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex justify-end">
              <div className="flex gap-1 items-center px-3 py-2 rounded-2xl rounded-br-sm" style={{ background: "rgba(99,102,241,0.3)" }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/70"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice bar */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 border-t border-white/5" style={{ background: "#0d0d1c" }}>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex-1 flex items-center gap-px h-6 overflow-hidden">
            {[...Array(24)].map((_, i) => (
              <motion.div key={i} className="flex-shrink-0 rounded-full"
                style={{ width: 1.5, background: micOn ? "#6366f1" : "rgba(255,255,255,0.1)" }}
                animate={micOn ? { height: [2, 4 + Math.sin(i * 0.8) * 10, 2] } : { height: 2 }}
                transition={micOn ? { duration: 0.3 + (i % 5) * 0.08, repeat: Infinity, delay: i * 0.03 } : {}} />
            ))}
          </div>
          <motion.div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            animate={micOn
              ? { background: ["#6366f1", "#4f46e5", "#6366f1"], scale: [1, 1.1, 1] }
              : { background: "#6366f1", scale: 1 }}
            transition={{ duration: 1, repeat: Infinity }}>
            <Mic size={12} className="text-white" />
          </motion.div>
        </div>
        <div className="flex items-center gap-1 mt-1 px-0.5">
          <span className="text-[9px]">🌐</span>
          <span className="text-[8px] text-white/20">English</span>
        </div>
      </div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────── */
export function WorksEverywhereSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#06060f" }}>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />

      {/* ── Top content: badges + heading + phone ── */}
      <div className="relative z-10 pt-20 sm:pt-28 pb-10 px-4 sm:px-6">

        {/* Platform badges */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-12 sm:mb-16">
          {[
            { icon: "🍎", label: "iPhone" },
            { icon: "🍎", label: "Mac" },
            { icon: "⊞",  label: "Windows" },
            { icon: "🤖", label: "Android" },
          ].map(p => (
            <div key={p.label}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm text-white/55"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <span>{p.icon}</span><span>{p.label}</span>
            </div>
          ))}
        </div>

        {/* Two-col: text + phone */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6">
              Write faster in{" "}
              <span className="text-white">all your apps,</span>{" "}
              <span style={{ color: "rgba(255,255,255,0.35)" }}>on any device</span>
            </h2>
            <p className="text-white/45 text-lg leading-relaxed mb-10 max-w-lg">
              Speak in any app — LinkedIn, Facebook, Gmail, WhatsApp, ChatGPT, Google Docs.
              VoiceFlow types directly at your cursor. No switching tabs. No copy-paste.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/app"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
                <Mic size={15} /> Try it free
              </Link>
              <Link href="/install"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm text-white/55 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                Install extension ↗
              </Link>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </motion.div>
        </div>
      </div>

      {/* ── SVG wave with floating app icons ── */}
      {/* paddingBottom = 1125/3570 = 31.5% preserves exact Wisprflow aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom: "28%", minHeight: 220 }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 3570 1125"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path id="vf-motion-path" d={SVG_PATH} />
          </defs>

          {/* Decorative path line */}
          <use href="#vf-motion-path" stroke="rgba(99,102,241,0.18)" strokeWidth="5" fill="none" />

          {/* ── Floating icons along the path ── */}
          {APPS.map((app, i) => {
            const begin = `${-((i / N) * DUR).toFixed(2)}s`;
            return (
              <g key={app.name}>
                {/* Shadow */}
                <rect x="-61" y="-57" width="130" height="130" rx="30" fill="rgba(0,0,0,0.25)" />
                {/* Icon card */}
                <rect x="-65" y="-65" width="130" height="130" rx="30" fill={app.bg} />
                {/* Letter */}
                <text
                  x="0" y={app.lsize > 50 ? "18" : "20"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={app.lsize}
                  fontWeight="700"
                  fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
                >
                  {app.letter}
                </text>
                {/* Name label below icon */}
                <text
                  x="0" y="90"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.32)"
                  fontSize="26"
                  fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
                >
                  {app.name}
                </text>

                <animateMotion
                  dur={`${DUR}s`}
                  repeatCount="indefinite"
                  begin={begin}
                  calcMode="paced"
                  rotate="0"
                >
                  <mpath href="#vf-motion-path" />
                </animateMotion>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fade left + right edges */}
      <div className="absolute inset-y-0 left-0 w-16 pointer-events-none z-20"
        style={{ background: "linear-gradient(to right,#06060f,transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-16 pointer-events-none z-20"
        style={{ background: "linear-gradient(to left,#06060f,transparent)" }} />
    </section>
  );
}
