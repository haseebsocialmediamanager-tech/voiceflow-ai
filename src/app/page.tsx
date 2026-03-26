"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Mic, Shield, Zap, Brain, Code2, Globe, Check, ArrowRight,
  Sliders, History, WifiOff, Languages, Pause, ShoppingCart,
  Star, MessageSquare, Twitter,
} from "lucide-react";
import { AnimatedHero } from "@/components/AnimatedHero";
import { FlowForSection } from "@/components/FlowForSection";

/* ─── Data ──────────────────────────────────────────────────── */

const features = [
  {
    icon: Shield,
    title: "100% Private by Default",
    description:
      "Local processing option — your voice never leaves your device. No screenshots, no background uploads, no silent telemetry. Ever.",
    color: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.25)",
    tag: "Privacy-first",
  },
  {
    icon: Brain,
    title: "Smart Enhancement Slider",
    description:
      "Dial AI from light touch to full rewrite. Learns your writing style over 20+ uses. Sounds like you — not a generic AI.",
    color: "from-brand-400 to-purple-500",
    glow: "rgba(99,102,241,0.25)",
    tag: "Most requested",
  },
  {
    icon: Zap,
    title: "Per-App Context Switching",
    description:
      "Auto-detects Slack, Gmail, VS Code, Docs and switches tone automatically. One voice, every app, perfect output every time.",
    color: "from-amber-400 to-orange-500",
    glow: "rgba(245,158,11,0.25)",
    tag: "Unique",
  },
  {
    icon: Code2,
    title: "Developer Mode",
    description:
      "Outputs == => {} [] correctly. Knows React, Python, SQL vocabulary. Integrates with Cursor and VS Code natively.",
    color: "from-cyan-400 to-blue-500",
    glow: "rgba(6,182,212,0.25)",
    tag: "Devs love this",
  },
  {
    icon: Languages,
    title: "25+ Languages",
    description:
      "English, Urdu, Arabic, Hindi, Spanish, French, Chinese, Japanese and 17 more. Full RTL support for Arabic, Urdu, Persian.",
    color: "from-pink-400 to-rose-500",
    glow: "rgba(244,63,94,0.25)",
    tag: "Global",
  },
  {
    icon: Globe,
    title: "Windows, Mac & Android",
    description:
      "Full feature parity across every platform. The only voice tool that doesn't abandon Windows and Android users.",
    color: "from-violet-400 to-brand-500",
    glow: "rgba(139,92,246,0.25)",
    tag: "Platform parity",
  },
  {
    icon: WifiOff,
    title: "Offline / Local Mode",
    description:
      "Process everything on-device with local Whisper models. No internet, no cloud, no monthly bill — perfect for sensitive work.",
    color: "from-slate-400 to-gray-500",
    glow: "rgba(148,163,184,0.2)",
    tag: "Privacy",
  },
  {
    icon: History,
    title: "Searchable History",
    description:
      "Every dictation saved, searchable, and re-processable with any mode. Never lose a great idea or important note again.",
    color: "from-teal-400 to-cyan-500",
    glow: "rgba(20,184,166,0.25)",
    tag: "Productivity",
  },
  {
    icon: Pause,
    title: "Pause & Resume",
    description:
      "Long dictation? Pause mid-sentence, think, and continue. No time limits, no 30-second hard stops like Apple Dictation.",
    color: "from-indigo-400 to-brand-500",
    glow: "rgba(99,102,241,0.2)",
    tag: "Power users",
  },
];

const painPoints = [
  { competitor: "Wisprflow", them: "Takes screenshots of your screen", us: "Zero screen access, ever" },
  { competitor: "Wisprflow", them: "Works 40–60% of the time", us: "99.9% reliability guarantee" },
  { competitor: "Superwhisper", them: "Mac only, no Windows", us: "Windows, Mac & Android" },
  { competitor: "Wisprflow", them: "Over-edits your voice away", us: "Enhancement slider you control" },
  { competitor: "Wisprflow", them: "2,000 word/week free cap", us: "Generous free tier — no gotchas" },
  { competitor: "Dragon", them: "$700 one-time + bad updates", us: "$12/mo or $149 lifetime" },
  { competitor: "All tools", them: "No language support for Urdu/Arabic", us: "25+ languages with RTL" },
  { competitor: "All tools", them: "Weeks with no support response", us: "Real humans, fast responses" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect to try it out",
    features: ["30 mins/day dictation", "3 enhancement modes", "7-day history", "Web app", "5 languages"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For daily power users",
    features: [
      "Unlimited dictation",
      "All 7 enhancement modes",
      "Lifetime history & search",
      "Per-app auto-switching",
      "Custom vocabulary",
      "Desktop app (Win + Mac)",
      "Developer mode",
      "25+ languages",
      "Re-process without re-recording",
    ],
    cta: "Start 7-Day Trial",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Lifetime",
    price: "$149",
    period: "one-time",
    description: "Pay once, own forever",
    features: [
      "Everything in Pro",
      "Pay once — no subscription",
      "All future features included",
      "Android app early access",
      "Local/offline mode",
      "Priority support",
      "Custom wake word",
    ],
    cta: "Buy Lifetime Access",
    highlight: false,
    badge: "Best Value",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Engineer @ Stripe",
    avatar: "SC",
    color: "from-cyan-500 to-blue-600",
    text: "Dev mode is a game changer. It actually outputs syntax correctly — I dictate to Cursor all day and it understands React hooks, SQL, everything.",
    stars: 5,
  },
  {
    name: "Usman Tariq",
    role: "Lawyer, Karachi",
    avatar: "UT",
    color: "from-violet-500 to-purple-600",
    text: "Finally a tool with proper Urdu support and RTL handling. I dictate case notes in Urdu and English — the formal mode is perfect for legal memos.",
    stars: 5,
  },
  {
    name: "Maya Rodriguez",
    role: "Content Creator, 280K subs",
    avatar: "MR",
    color: "from-pink-500 to-rose-600",
    text: "I capture video scripts while walking now. The privacy thing matters too — I was sketched out by the screenshot thing the other apps do.",
    stars: 5,
  },
];

/* ─── Component ─────────────────────────────────────────────── */

export default function LandingPage() {
  const featuresRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-surface-900 overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
        style={{
          background: "rgba(10,10,15,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center glow-brand-sm"
          >
            <Mic size={16} className="text-white" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight">VoiceFlow AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#flow-for" className="hover:text-white transition-colors">Use Cases</a>
          <a href="#compare" className="hover:text-white transition-colors">Compare</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/app" className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block">
            Sign in
          </Link>
          <Link
            href="/app"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-sm font-semibold transition-all duration-200 glow-brand-sm hover:glow-brand"
          >
            Try Free
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <div className="pt-16">
        <AnimatedHero />
      </div>

      {/* "Flow For" personas loop */}
      <div id="flow-for">
        <FlowForSection />
      </div>

      {/* Features */}
      <section id="features" ref={featuresRef} className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-white/50 mb-6 border border-white/8">
            <Zap size={12} className="text-brand-400" />
            Every feature exists because users demanded it
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built to fix every{" "}
            <span className="gradient-text">broken thing</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            We read every Wisprflow, Dragon, and Superwhisper complaint on Reddit and Trustpilot.
            Then we built all of it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="glass rounded-2xl p-6 group cursor-default relative overflow-hidden"
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${feat.glow}, transparent 70%)` }}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 0 20px ${feat.glow}` }}
                  >
                    <feat.icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-white/25 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-2">{feat.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Languages showcase */}
      <section className="relative z-10 py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center px-6 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Speak in your{" "}
            <span className="gradient-text">language</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            25+ languages with full RTL support for Arabic, Urdu, and Persian.
            The first voice tool built for truly global users.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 px-6 max-w-4xl mx-auto">
          {[
            { flag: "🇺🇸", lang: "English" },
            { flag: "🇵🇰", lang: "اردو (Urdu)" },
            { flag: "🇸🇦", lang: "العربية (Arabic)" },
            { flag: "🇮🇳", lang: "हिन्दी (Hindi)" },
            { flag: "🇪🇸", lang: "Español" },
            { flag: "🇫🇷", lang: "Français" },
            { flag: "🇩🇪", lang: "Deutsch" },
            { flag: "🇨🇳", lang: "中文" },
            { flag: "🇯🇵", lang: "日本語" },
            { flag: "🇰🇷", lang: "한국어" },
            { flag: "🇷🇺", lang: "Русский" },
            { flag: "🇮🇷", lang: "فارسی (Persian)" },
            { flag: "🇧🇩", lang: "বাংলা (Bengali)" },
            { flag: "🇧🇷", lang: "Português" },
            { flag: "🇹🇷", lang: "Türkçe" },
            { flag: "🇮🇩", lang: "Bahasa Indonesia" },
          ].map(({ flag, lang }, i) => (
            <motion.div
              key={lang}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.06, y: -2 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass border border-white/6 cursor-default"
            >
              <span className="text-xl">{flag}</span>
              <span className="text-sm text-white/60">{lang}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-brand-500/30 bg-brand-500/10 cursor-default"
          >
            <span className="text-sm text-brand-300">+9 more languages</span>
          </motion.div>
        </div>
      </section>

      {/* Compare */}
      <section id="compare" className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Them vs. <span className="gradient-text">Us</span>
          </h2>
          <p className="text-white/50 text-lg">
            Real complaints copied directly from Trustpilot and Reddit.
          </p>
        </motion.div>

        <div className="space-y-3">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="glass rounded-2xl p-4 flex items-center gap-3 border border-red-500/8">
                <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <span className="text-red-400 text-xs">✕</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-white/25 mb-0.5">{point.competitor}</div>
                  <span className="text-sm text-white/45 leading-tight">{point.them}</span>
                </div>
              </div>
              <div
                className="glass rounded-2xl p-4 flex items-center gap-3"
                style={{ border: "1px solid rgba(99,102,241,0.15)" }}
              >
                <div className="w-5 h-5 rounded-full bg-brand-500/15 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-brand-400" />
                </div>
                <span className="text-sm text-white/75">{point.us}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            People who switched{" "}
            <span className="gradient-text">love it</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-white/65 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-white/35">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-white/50 text-lg">
            No tricks. One-time purchase available. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative rounded-2xl p-6 ${
                plan.highlight
                  ? "border border-brand-500/40"
                  : "glass"
              }`}
              style={
                plan.highlight
                  ? {
                      background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(79,70,229,0.08) 100%)",
                      boxShadow: "0 0 60px rgba(99,102,241,0.15)",
                    }
                  : {}
              }
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${
                    plan.highlight ? "bg-brand-500" : "bg-amber-500"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="text-white/45 text-sm mb-1">{plan.name}</div>
                <div className="text-white/30 text-xs mb-3">{plan.description}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-white/35 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/65">
                    <Check size={13} className="text-brand-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/app"
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "bg-brand-500 hover:bg-brand-400 text-white"
                    : "glass hover:bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-white/25 mt-8"
        >
          All plans include a 7-day free trial. No credit card required to start.
        </motion.p>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-24 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-12 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
            boxShadow: "0 0 100px rgba(99,102,241,0.1)",
          }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 70%)",
            }}
          />
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-6"
              style={{ boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
            >
              <Mic size={28} className="text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to speak freely?</h2>
            <p className="text-white/50 mb-8 text-lg">
              No card required. 25+ languages. Works in 30 seconds.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 font-bold text-base transition-all duration-300 hover:scale-105"
              style={{ boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
            >
              Start Dictating Free <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Mic size={14} className="text-white" />
            </div>
            <span className="font-bold text-white/70">VoiceFlow AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
          </div>
          <p className="text-sm text-white/25">Privacy-first voice AI. © 2026</p>
        </div>
      </footer>
    </div>
  );
}
