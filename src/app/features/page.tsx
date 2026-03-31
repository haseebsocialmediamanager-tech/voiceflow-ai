import type { Metadata } from "next";
import Link from "next/link";
import { Mic, Shield, Brain, Zap, Code2, Languages, Globe, WifiOff, History, Pause, Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Features — VoiceFlow AI | AI Voice Dictation for 25+ Languages",
  description:
    "VoiceFlow AI features: Smart Enhancement Slider, Developer Mode, 25+ language support with Urdu & Arabic RTL, privacy-first design, offline mode, searchable history, per-app context switching and more.",
  keywords: [
    "voice dictation features", "ai speech to text", "urdu voice typing", "arabic voice dictation",
    "developer mode voice", "offline voice recognition", "smart ai enhancement", "multilingual dictation",
    "privacy voice ai", "searchable dictation history",
  ],
  alternates: { canonical: "https://www.linkedwin.io/features" },
  openGraph: {
    title: "VoiceFlow AI Features — Every feature you wished voice tools had",
    description: "Smart AI enhancement, 25+ languages, developer mode, offline processing, RTL support for Arabic & Urdu. Privacy-first. Works on Windows, Mac & Android.",
    url: "https://www.linkedwin.io/features",
    siteName: "VoiceFlow AI",
    type: "website",
  },
};

const features = [
  {
    icon: Shield,
    tag: "Privacy-first",
    title: "100% Private by Default",
    description: "Local processing option — your voice never leaves your device. No screenshots, no background uploads, no silent telemetry. Ever.",
    detail: "Unlike Wisprflow which takes screenshots of your screen, VoiceFlow AI processes everything locally when you enable privacy mode. Your voice recordings are never stored on our servers without your explicit consent.",
    color: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.2)",
    slug: "privacy",
  },
  {
    icon: Brain,
    tag: "Most requested",
    title: "Smart Enhancement Slider",
    description: "Dial AI from light touch to full rewrite. Learns your writing style over 20+ uses. Sounds like you — not a generic AI.",
    detail: "Set the slider to 'Light' for minimal corrections (punctuation + filler words), 'Medium' for clean professional text, or 'Full' for a complete AI rewrite that still sounds like you — not a robot.",
    color: "from-brand-400 to-purple-500",
    glow: "rgba(99,102,241,0.2)",
    slug: "enhancement",
  },
  {
    icon: Zap,
    tag: "Unique",
    title: "Per-App Context Switching",
    description: "Auto-detects Slack, Gmail, VS Code, Docs and switches tone automatically. One voice, every app, perfect output every time.",
    detail: "VoiceFlow detects which app is focused and adjusts the output tone automatically — casual for Slack DMs, formal for Gmail, code syntax for VS Code, structured for Docs.",
    color: "from-amber-400 to-orange-500",
    glow: "rgba(245,158,11,0.2)",
    slug: "context",
  },
  {
    icon: Code2,
    tag: "Devs love this",
    title: "Developer Mode",
    description: "Outputs == => {} [] correctly. Knows React, Python, SQL vocabulary. Integrates with Cursor and VS Code natively.",
    detail: "Say 'const arrow function name equals arrow' and get `const name = () =>`. Dictate code comments, variable names, SQL queries, React hooks — VoiceFlow understands developer vocabulary and outputs correct syntax.",
    color: "from-cyan-400 to-blue-500",
    glow: "rgba(6,182,212,0.2)",
    slug: "developer-mode",
  },
  {
    icon: Languages,
    tag: "Global",
    title: "25+ Languages",
    description: "English, Urdu, Arabic, Hindi, Spanish, French, Chinese, Japanese and 17 more. Full RTL support for Arabic, Urdu, Persian.",
    detail: "The only voice dictation tool built for truly global users. Full right-to-left (RTL) rendering for Arabic, Urdu, and Persian. Native-quality recognition for South Asian and Middle Eastern languages that other tools ignore.",
    color: "from-pink-400 to-rose-500",
    glow: "rgba(244,63,94,0.2)",
    slug: "languages",
  },
  {
    icon: Globe,
    tag: "Platform parity",
    title: "Windows, Mac & Android",
    description: "Full feature parity across every platform. The only voice tool that doesn't abandon Windows and Android users.",
    detail: "Superwhisper is Mac only. Dragon costs $700 on Windows. VoiceFlow AI gives you identical features on Windows, Mac, Android, and iOS — no second-class platform treatment.",
    color: "from-violet-400 to-brand-500",
    glow: "rgba(139,92,246,0.2)",
    slug: "platforms",
  },
  {
    icon: WifiOff,
    tag: "Privacy",
    title: "Offline / Local Mode",
    description: "Process everything on-device with local Whisper models. No internet, no cloud, no monthly bill — perfect for sensitive work.",
    detail: "Download a local Whisper model and everything runs 100% on your device. Perfect for lawyers, doctors, journalists, or anyone handling sensitive information who cannot risk cloud processing.",
    color: "from-slate-400 to-gray-500",
    glow: "rgba(148,163,184,0.15)",
    slug: "offline",
  },
  {
    icon: History,
    tag: "Productivity",
    title: "Searchable History",
    description: "Every dictation saved, searchable, and re-processable with any mode. Never lose a great idea or important note again.",
    detail: "Every recording is saved with a timestamp and full text. Search by keyword, date, or language. Re-process any old recording with a different enhancement level without re-recording.",
    color: "from-teal-400 to-cyan-500",
    glow: "rgba(20,184,166,0.2)",
    slug: "history",
  },
  {
    icon: Pause,
    tag: "Power users",
    title: "Pause & Resume",
    description: "Long dictation? Pause mid-sentence, think, and continue. No time limits, no 30-second hard stops like Apple Dictation.",
    detail: "Apple Dictation cuts you off after 30 seconds. VoiceFlow has no time limit. Pause to think, cough, check a reference — then continue exactly where you left off. Perfect for long-form content creators.",
    color: "from-indigo-400 to-brand-500",
    glow: "rgba(99,102,241,0.15)",
    slug: "pause-resume",
  },
];

const languages = [
  { flag: "🇺🇸", name: "English", native: "English" },
  { flag: "🇵🇰", name: "Urdu", native: "اردو" },
  { flag: "🇸🇦", name: "Arabic", native: "العربية" },
  { flag: "🇮🇳", name: "Hindi", native: "हिन्दी" },
  { flag: "🇪🇸", name: "Spanish", native: "Español" },
  { flag: "🇫🇷", name: "French", native: "Français" },
  { flag: "🇩🇪", name: "German", native: "Deutsch" },
  { flag: "🇨🇳", name: "Chinese", native: "中文" },
  { flag: "🇯🇵", name: "Japanese", native: "日本語" },
  { flag: "🇰🇷", name: "Korean", native: "한국어" },
  { flag: "🇷🇺", name: "Russian", native: "Русский" },
  { flag: "🇮🇷", name: "Persian", native: "فارسی" },
  { flag: "🇧🇩", name: "Bengali", native: "বাংলা" },
  { flag: "🇹🇷", name: "Turkish", native: "Türkçe" },
  { flag: "🇵🇹", name: "Portuguese", native: "Português" },
  { flag: "🇮🇩", name: "Indonesian", native: "Bahasa" },
  { flag: "🇮🇹", name: "Italian", native: "Italiano" },
  { flag: "🇳🇱", name: "Dutch", native: "Nederlands" },
  { flag: "🇵🇱", name: "Polish", native: "Polski" },
  { flag: "🇺🇦", name: "Ukrainian", native: "Українська" },
  { flag: "🇸🇪", name: "Swedish", native: "Svenska" },
  { flag: "🇳🇴", name: "Norwegian", native: "Norsk" },
  { flag: "🇬🇷", name: "Greek", native: "Ελληνικά" },
  { flag: "🇻🇳", name: "Vietnamese", native: "Tiếng Việt" },
  { flag: "🇹🇭", name: "Thai", native: "ภาษาไทย" },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="px-4 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <Mic size={15} className="text-white" />
          </div>
          <span className="font-bold text-base">VoiceFlow AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block">Sign in</Link>
          <Link href="/signup" className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-sm font-semibold transition-colors">
            Try Free
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-brand-300 mb-5 border border-brand-500/20"
            style={{ background: "rgba(99,102,241,0.08)" }}>
            <Zap size={11} />
            Every feature exists because users demanded it
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Everything you need.<br />
            <span style={{ background: "linear-gradient(135deg, #a5b8fc 0%, #6366f1 40%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Nothing you don&apos;t.
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            VoiceFlow AI is built by listening to every complaint about Wisprflow, Dragon, Superwhisper, and Apple Dictation — then fixing all of it.
          </p>
        </div>

        {/* Feature cards */}
        <div className="space-y-6 mb-20">
          {features.map((feat) => (
            <div
              key={feat.slug}
              id={feat.slug}
              className="rounded-3xl p-6 sm:p-8 border border-white/6"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex flex-col sm:flex-row gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center flex-shrink-0`}
                  style={{ boxShadow: `0 0 20px ${feat.glow}` }}>
                  <feat.icon size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h2 className="font-bold text-xl">{feat.title}</h2>
                    <span className="text-xs text-white/35 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/8">{feat.tag}</span>
                  </div>
                  <p className="text-white/70 text-base mb-3">{feat.description}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{feat.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Languages section */}
        <div id="languages" className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              25+ Languages supported
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              Full RTL (right-to-left) support for Arabic, Urdu, and Persian. Native-quality recognition, not just Google Translate.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {languages.map((lang) => (
              <div key={lang.name}
                className="flex items-center gap-2.5 px-3 py-3 rounded-2xl border border-white/6"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="text-xl flex-shrink-0">{lang.flag}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white/80 truncate">{lang.native}</div>
                  <div className="text-xs text-white/30 truncate">{lang.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center rounded-3xl p-10 border border-brand-500/20"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)" }}>
          <h2 className="text-3xl font-bold mb-3">Ready to try it?</h2>
          <p className="text-white/50 mb-7">Free forever. No credit card. 30 seconds to start.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
              Start Free <ArrowRight size={16} />
            </Link>
            <Link href="/install"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm border border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-colors">
              Install Extension
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-7 flex-wrap">
            {["30 mins/day free", "25+ languages", "No card required", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-white/35">
                <Check size={11} className="text-brand-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 sm:px-6 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <Mic size={12} className="text-white" />
          </div>
          <span className="font-bold text-white/60 text-sm">VoiceFlow AI</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-white/30">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/install" className="hover:text-white transition-colors">Install</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </div>
        <p className="text-xs text-white/20">© 2026 VoiceFlow AI</p>
      </footer>
    </div>
  );
}
