"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import Link from "next/link";

/* ── App icons data ─────────────────────────────────────────── */
const APPS_A = [
  { name: "WhatsApp",    bg: "#25D366", fg: "#fff", letter: "W"  },
  { name: "Gmail",       bg: "#EA4335", fg: "#fff", letter: "M"  },
  { name: "ChatGPT",     bg: "#10A37F", fg: "#fff", letter: "AI" },
  { name: "LinkedIn",    bg: "#0A66C2", fg: "#fff", letter: "in" },
  { name: "Slack",       bg: "#4A154B", fg: "#fff", letter: "S"  },
  { name: "Notion",      bg: "#1a1a1a", fg: "#fff", letter: "N"  },
  { name: "Facebook",    bg: "#1877F2", fg: "#fff", letter: "f"  },
  { name: "Figma",       bg: "#F24E1E", fg: "#fff", letter: "F"  },
  { name: "VS Code",     bg: "#007ACC", fg: "#fff", letter: "</>" },
  { name: "Discord",     bg: "#5865F2", fg: "#fff", letter: "D"  },
  { name: "Canva",       bg: "#7D2AE8", fg: "#fff", letter: "C"  },
  { name: "YouTube",     bg: "#FF0000", fg: "#fff", letter: "▶"  },
];

const APPS_B = [
  { name: "Instagram",   bg: "#C13584", fg: "#fff", letter: "Ig" },
  { name: "Zoom",        bg: "#2D8CFF", fg: "#fff", letter: "Z"  },
  { name: "Teams",       bg: "#6264A7", fg: "#fff", letter: "T"  },
  { name: "Outlook",     bg: "#0078D4", fg: "#fff", letter: "✉"  },
  { name: "Docs",        bg: "#4285F4", fg: "#fff", letter: "G"  },
  { name: "X",           bg: "#111",    fg: "#fff", letter: "𝕏"  },
  { name: "Sheets",      bg: "#34A853", fg: "#fff", letter: "S"  },
  { name: "Word",        bg: "#2B579A", fg: "#fff", letter: "W"  },
  { name: "Trello",      bg: "#0052CC", fg: "#fff", letter: "Tr" },
  { name: "Asana",       bg: "#F06A6A", fg: "#fff", letter: "A"  },
  { name: "Grammarly",   bg: "#15C39A", fg: "#fff", letter: "G"  },
  { name: "Telegram",    bg: "#2CA5E0", fg: "#fff", letter: "T"  },
];

/* ── Chat messages for phone mockup ────────────────────────── */
const MESSAGES = [
  { id: 0, side: "left",  text: "Hey, are you free for a quick call?" },
  { id: 1, side: "right", text: "Yeah give me 5 mins, just wrapping up something." },
  { id: 2, side: "left",  text: "Sure no rush! Also did you see the proposal?" },
  { id: 3, side: "right", text: "Yep! Looks great, few small edits and we're good to send." },
  { id: 4, side: "left",  text: "Perfect. I'll book the call for 3pm then." },
  { id: 5, side: "right", text: "Sounds good, talk then 👍" },
];

/* ── App icon pill ──────────────────────────────────────────── */
function AppIcon({ app, yOffset }: { app: typeof APPS_A[0]; yOffset: number }) {
  return (
    <div
      className="flex-shrink-0 flex flex-col items-center gap-1.5 mx-2"
      style={{ transform: `translateY(${yOffset}px)` }}
    >
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg select-none"
        style={{ background: app.bg, color: app.fg, fontSize: app.letter.length > 2 ? "9px" : "13px" }}
      >
        {app.letter}
      </div>
      <span className="text-[10px] text-white/25 whitespace-nowrap">{app.name}</span>
    </div>
  );
}

/* ── Wave row ───────────────────────────────────────────────── */
function WaveRow({ apps, speed, phase }: { apps: typeof APPS_A; speed: string; phase: number }) {
  const doubled = [...apps, ...apps];
  const waveY = (i: number) => Math.sin((i / apps.length) * Math.PI * 2 + phase) * 22;

  return (
    <div className="overflow-hidden w-full">
      <div className={`flex ${speed} py-2`} style={{ width: "max-content" }}>
        {doubled.map((app, i) => (
          <AppIcon key={i} app={app} yOffset={waveY(i % apps.length)} />
        ))}
      </div>
    </div>
  );
}

/* ── Phone chat mockup ──────────────────────────────────────── */
function PhoneMockup() {
  const [visible, setVisible] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const [micActive, setMicActive] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    function showNext(idx: number) {
      if (idx >= MESSAGES.length) {
        t = setTimeout(() => {
          setVisible([]);
          setTyping(false);
          setMicActive(false);
          t = setTimeout(() => showNext(0), 600);
        }, 3500);
        return;
      }
      const msg = MESSAGES[idx];
      setTyping(true);
      if (msg.side === "right") setMicActive(true);
      t = setTimeout(() => {
        setTyping(false);
        setMicActive(false);
        setVisible((v) => [...v, msg.id]);
        t = setTimeout(() => showNext(idx + 1), 900 + msg.text.length * 18);
      }, 1000 + (msg.side === "right" ? 400 : 200));
    }

    showNext(0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative mx-auto"
      style={{
        width: 248,
        height: 500,
        background: "#0e0e1a",
        borderRadius: 36,
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-10" />

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-7 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">J</div>
        <div>
          <div className="text-[13px] font-semibold text-white leading-none">Jordan</div>
          <div className="text-[10px] text-green-400 mt-0.5">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="px-3 py-3 space-y-2 overflow-hidden" style={{ height: 340 }}>
        <AnimatePresence>
          {MESSAGES.filter((m) => visible.includes(m.id)).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[78%] px-3 py-2 text-[11px] leading-relaxed"
                style={{
                  background: msg.side === "right" ? "rgba(99,102,241,0.85)" : "rgba(255,255,255,0.07)",
                  color: msg.side === "right" ? "#fff" : "rgba(255,255,255,0.82)",
                  borderRadius: msg.side === "right" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-end"
            >
              <div className="flex gap-1 items-center px-3 py-2.5 rounded-2xl rounded-br-sm" style={{ background: "rgba(99,102,241,0.35)" }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/70"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice input bar */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-3 border-t border-white/5" style={{ background: "#0e0e1a" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Waveform */}
          <div className="flex-1 flex items-center gap-0.5 h-7 overflow-hidden">
            {[...Array(22)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 rounded-full"
                style={{ width: 2, background: micActive ? "#6366f1" : "rgba(255,255,255,0.12)" }}
                animate={micActive ? {
                  height: [3, 6 + Math.sin(i * 0.7) * 12, 3],
                } : { height: 3 }}
                transition={micActive ? {
                  duration: 0.35 + (i % 5) * 0.07,
                  repeat: Infinity,
                  delay: i * 0.04,
                } : {}}
              />
            ))}
          </div>

          {/* Mic button */}
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            animate={micActive
              ? { background: ["#6366f1", "#4f46e5", "#6366f1"], scale: [1, 1.08, 1] }
              : { background: "#6366f1", scale: 1 }
            }
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic size={13} className="text-white" />
          </motion.div>
        </div>

        {/* Language globe */}
        <div className="flex items-center gap-1 mt-1.5 px-1">
          <span className="text-[10px]">🌐</span>
          <span className="text-[9px] text-white/20">English</span>
        </div>
      </div>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────── */
export function WorksEverywhereSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "#06060f" }}>
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Purple ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />

      {/* Platform badges */}
      <div className="relative z-10 flex justify-center gap-2 sm:gap-3 mb-14 flex-wrap px-4">
        {[
          { emoji: "🍎", label: "iPhone" },
          { emoji: "🍎", label: "Mac" },
          { emoji: "⊞",  label: "Windows" },
          { emoji: "🤖", label: "Android" },
        ].map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm text-white/55"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Main two-col layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6">
              Write faster in{" "}
              <span className="text-white">all your apps,</span>{" "}
              <span style={{ color: "rgba(255,255,255,0.38)" }}>on any device</span>
            </h2>
            <p className="text-white/45 text-lg leading-relaxed mb-10 max-w-lg">
              Speak in any app — LinkedIn, Facebook, Gmail, WhatsApp, ChatGPT, Google Docs.
              VoiceFlow types directly at your cursor. No switching tabs. No copy-paste.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/app"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}
              >
                <Mic size={15} /> Try it free
              </Link>
              <Link
                href="/install"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm text-white/60 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                Install extension ↗
              </Link>
            </div>
          </motion.div>

          {/* Right: phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>

      {/* ── App icon wave strips ── */}
      <div className="relative mt-16 space-y-3 z-10">
        {/* Row 1 — left to right */}
        <WaveRow apps={APPS_A} speed="animate-wave-slow" phase={0} />
        {/* Row 2 — slightly faster, inverted wave phase */}
        <WaveRow apps={APPS_B} speed="animate-wave-fast" phase={Math.PI} />
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-20"
        style={{ background: "linear-gradient(to right, #06060f, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-20"
        style={{ background: "linear-gradient(to left, #06060f, transparent)" }} />
    </section>
  );
}
