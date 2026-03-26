"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import {
  Users,
  Code2,
  Sparkles,
  Headphones,
  BookOpen,
  Scale,
  Accessibility,
  TrendingUp,
} from "lucide-react";

const PERSONAS = [
  {
    icon: Users,
    role: "Leaders",
    headline: "Unblock teams,\nbuild faster with voice",
    description:
      "Capture decisions, delegate actions, and send clear directives — all without touching a keyboard. Your team moves at the speed of thought.",
    color: "from-brand-400 to-purple-500",
    glow: "rgba(99,102,241,0.3)",
    bg: "rgba(99,102,241,0.06)",
    stat: "3x faster",
    statLabel: "decision communication",
  },
  {
    icon: Code2,
    role: "Developers",
    headline: "Speak more context,\nget better results",
    description:
      "Dictate to Cursor, explain your codebase out loud, write commit messages and docs — in your natural language, including technical vocab.",
    color: "from-cyan-400 to-blue-500",
    glow: "rgba(6,182,212,0.3)",
    bg: "rgba(6,182,212,0.06)",
    stat: "2x better",
    statLabel: "AI prompt results",
  },
  {
    icon: Sparkles,
    role: "Creators",
    headline: "Capture content ideas\nanytime, anywhere",
    description:
      "Never lose a great idea again. Speak your scripts, captions, blog posts, and newsletters while cooking, walking, or commuting.",
    color: "from-pink-400 to-rose-500",
    glow: "rgba(244,63,94,0.3)",
    bg: "rgba(244,63,94,0.06)",
    stat: "10x more",
    statLabel: "content captured daily",
  },
  {
    icon: Headphones,
    role: "Customer Support",
    headline: "Resolve tickets\n4x faster",
    description:
      "Speak your replies, auto-format them for email or chat, and handle more customers without burning out your fingers or your team.",
    color: "from-amber-400 to-orange-500",
    glow: "rgba(245,158,11,0.3)",
    bg: "rgba(245,158,11,0.06)",
    stat: "4x faster",
    statLabel: "ticket resolution",
  },
  {
    icon: BookOpen,
    role: "Students",
    headline: "Write faster,\nstudy smarter",
    description:
      "Dictate notes, essays, and study summaries. Auto-format into outlines, flashcard content, or citation-ready paragraphs.",
    color: "from-emerald-400 to-teal-500",
    glow: "rgba(16,185,129,0.3)",
    bg: "rgba(16,185,129,0.06)",
    stat: "60%",
    statLabel: "less time writing notes",
  },
  {
    icon: Scale,
    role: "Lawyers",
    headline: "Dictate case notes\nand memos on the go",
    description:
      "Formal mode with legal vocabulary. Dictate briefs, client summaries, and correspondence from your phone or desktop — in transit or in court.",
    color: "from-violet-400 to-purple-500",
    glow: "rgba(139,92,246,0.3)",
    bg: "rgba(139,92,246,0.06)",
    stat: "50%",
    statLabel: "less admin time",
  },
  {
    icon: Accessibility,
    role: "Accessibility",
    headline: "Break free\nfrom the keyboard",
    description:
      "Full voice control of your computer. Dictate, navigate, and create — for users with RSI, mobility challenges, or anyone who thinks faster than they type.",
    color: "from-sky-400 to-indigo-500",
    glow: "rgba(56,189,248,0.3)",
    bg: "rgba(56,189,248,0.06)",
    stat: "100%",
    statLabel: "keyboard-free workflow",
  },
  {
    icon: TrendingUp,
    role: "Sales",
    headline: "Close more deals\nwith your voice",
    description:
      "Draft follow-ups, proposals, and objection responses at the speed of a conversation. CRM notes done in seconds, not minutes.",
    color: "from-green-400 to-emerald-500",
    glow: "rgba(34,197,94,0.3)",
    bg: "rgba(34,197,94,0.06)",
    stat: "30%",
    statLabel: "more deals closed",
  },
];

function PersonaCard({ persona, index }: { persona: (typeof PERSONAS)[0]; index: number }) {
  const Icon = persona.icon;
  return (
    <div
      className="flex-shrink-0 w-80 rounded-3xl p-6 mx-3 relative overflow-hidden border border-white/5"
      style={{ background: persona.bg }}
    >
      {/* Glow */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-30 blur-2xl"
        style={{ background: persona.glow }}
      />

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${persona.color} flex items-center justify-center mb-4`}
        style={{ boxShadow: `0 0 20px ${persona.glow}` }}
      >
        <Icon size={22} className="text-white" />
      </div>

      {/* Role badge */}
      <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
        {persona.role}
      </div>

      {/* Headline */}
      <h3 className="text-xl font-bold text-white leading-tight mb-3 whitespace-pre-line">
        {persona.headline}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/50 leading-relaxed mb-6">{persona.description}</p>

      {/* Stat */}
      <div className="flex items-end gap-2 mt-auto">
        <span
          className={`text-3xl font-black bg-gradient-to-r ${persona.color} bg-clip-text text-transparent`}
        >
          {persona.stat}
        </span>
        <span className="text-xs text-white/30 mb-1 leading-tight">{persona.statLabel}</span>
      </div>
    </div>
  );
}

export function FlowForSection() {
  const baseX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth] = useState(336); // 320px + 16px gap
  const totalWidth = PERSONAS.length * cardWidth;
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    if (paused) return;
    baseX.set(baseX.get() - delta * 0.04);
    if (Math.abs(baseX.get()) >= totalWidth) {
      baseX.set(0);
    }
  });

  const x = useTransform(baseX, (v) => `${v}px`);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center px-6 mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-white/50 mb-6 border border-white/8">
          <Sparkles size={12} className="text-brand-400" />
          Built for every workflow
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          VoiceFlow works for{" "}
          <span className="gradient-text">everyone</span>
        </h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          From courtrooms to classrooms. From code reviews to customer calls.
        </p>
      </motion.div>

      {/* Infinite scroll marquee */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0a0a0f, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0a0a0f, transparent)" }} />

        <div ref={containerRef} className="overflow-hidden">
          <motion.div
            className="flex"
            style={{ x, width: `${totalWidth * 2}px` }}
          >
            {/* Duplicate for seamless loop */}
            {[...PERSONAS, ...PERSONAS].map((persona, i) => (
              <PersonaCard key={`${persona.role}-${i}`} persona={persona} index={i} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom roles quick-scan */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3 mt-10 px-6"
      >
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.role}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 text-sm text-white/50 hover:text-white hover:border-white/10 transition-all cursor-default"
            >
              <Icon size={13} className="text-white/30" />
              {p.role}
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
