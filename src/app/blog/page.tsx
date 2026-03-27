"use client";

import { motion } from "framer-motion";
import { Mic, Clock, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

const POSTS = [
  {
    slug: "voice-dictation-productivity",
    tag: "Productivity",
    tagColor: "text-brand-400 bg-brand-400/10",
    title: "How Voice Dictation Can Triple Your Writing Output",
    excerpt:
      "Most people type at 40–60 WPM. The average speaking rate is 130 WPM. That's a 3× gap sitting untapped every time you write an email, note, or message. Here's how to close it.",
    date: "March 20, 2026",
    readTime: "5 min read",
    emoji: "🎤",
  },
  {
    slug: "urdu-arabic-voice-typing",
    tag: "Languages",
    tagColor: "text-emerald-400 bg-emerald-400/10",
    title: "Finally: Urdu and Arabic Voice Typing That Actually Works",
    excerpt:
      "RTL languages have been second-class citizens in voice AI — until now. VoiceFlow AI supports full right-to-left dictation with proper script rendering for Urdu, Arabic, and Persian.",
    date: "March 14, 2026",
    readTime: "4 min read",
    emoji: "🇵🇰",
  },
  {
    slug: "voice-coding-developer-mode",
    tag: "Developers",
    tagColor: "text-cyan-400 bg-cyan-400/10",
    title: "Dictate Code: A Developer's Guide to VoiceFlow's Dev Mode",
    excerpt:
      "Developer Mode preserves code syntax exactly — arrow functions, destructuring, SQL keywords, React hooks. Here's how to use it with Cursor, VS Code, and GitHub Copilot for maximum leverage.",
    date: "March 7, 2026",
    readTime: "6 min read",
    emoji: "💻",
  },
  {
    slug: "privacy-voice-ai",
    tag: "Privacy",
    tagColor: "text-amber-400 bg-amber-400/10",
    title: "Why We Don't Take Screenshots (And What Your Voice App Might Be Doing)",
    excerpt:
      "Several popular voice tools capture screenshots of your screen to 'provide context'. We think that's a serious privacy problem. Here's how VoiceFlow AI handles your data — and why we built it differently.",
    date: "February 28, 2026",
    readTime: "7 min read",
    emoji: "🔒",
  },
  {
    slug: "ai-enhancement-modes-explained",
    tag: "Features",
    tagColor: "text-purple-400 bg-purple-400/10",
    title: "Enhancement Modes Explained: Which One Should You Use?",
    excerpt:
      "Professional, Casual, Formal, Email, Slack, Code — each mode transforms your dictation differently. This guide shows you exactly what each mode does and when to use it.",
    date: "February 20, 2026",
    readTime: "4 min read",
    emoji: "✨",
  },
  {
    slug: "voice-bookmarklet-guide",
    tag: "Tutorial",
    tagColor: "text-rose-400 bg-rose-400/10",
    title: "The VoiceFlow Bookmarklet: Dictate in Any Web App",
    excerpt:
      "One click. The VoiceFlow widget appears in Gmail, Notion, Slack, Google Docs — anywhere. Your enhanced text gets injected right at the cursor. No copy-paste needed. Here's how to set it up.",
    date: "February 12, 2026",
    readTime: "3 min read",
    emoji: "🔖",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 sm:px-6 py-12">
      <div className="fixed top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto">
        {/* Nav */}
        <div className="flex items-center gap-2 mb-10">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Mic size={13} />
            </div>
            <span className="text-sm font-semibold">VoiceFlow AI</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Blog & <span className="gradient-text">Resources</span>
          </h1>
          <p className="text-white/40 text-base max-w-xl">
            Tips, guides, and ideas for getting the most out of voice AI — from productivity hacks to language support deep-dives.
          </p>
        </motion.div>

        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden cursor-pointer group"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.1), transparent 70%)" }} />
          <div className="relative">
            <div className="text-4xl mb-4">{POSTS[0].emoji}</div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${POSTS[0].tagColor}`}>
                {POSTS[0].tag}
              </span>
              <span className="text-xs text-white/25 flex items-center gap-1">
                <Clock size={11} /> {POSTS[0].readTime}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-brand-300 transition-colors">
              {POSTS[0].title}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{POSTS[0].excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25">{POSTS[0].date}</span>
              <span className="flex items-center gap-1 text-xs text-brand-400 font-medium">
                Read article <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Article grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {POSTS.slice(1).map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-5 cursor-pointer group transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="text-2xl mb-3">{post.emoji}</div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${post.tagColor}`}>
                  <span className="flex items-center gap-1"><Tag size={9} />{post.tag}</span>
                </span>
                <span className="text-[11px] text-white/25 flex items-center gap-1">
                  <Clock size={9} /> {post.readTime}
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white/85 leading-snug mb-2 group-hover:text-brand-300 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/20">{post.date}</span>
                <span className="flex items-center gap-1 text-[11px] text-brand-400 font-medium">
                  Read <ArrowRight size={10} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 rounded-3xl p-6 sm:p-8 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-3xl mb-3">📬</div>
          <h3 className="text-xl font-bold mb-2">Stay in the loop</h3>
          <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
            New features, language additions, and voice productivity tips — straight to your inbox. No spam.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email" placeholder="you@example.com" required
              className="flex-1 px-4 py-3 rounded-2xl text-sm text-white placeholder-white/25 outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <button type="submit"
              className="px-5 py-3 rounded-2xl text-sm font-semibold transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              Subscribe
            </button>
          </form>
        </motion.div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <Link href="/" className="text-sm text-white/30 hover:text-white transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
