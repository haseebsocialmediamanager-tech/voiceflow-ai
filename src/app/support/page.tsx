"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ChevronDown, MessageCircle, Mail, Phone, CheckCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "How do I start recording?",
    a: "Open the app at /app, click the microphone button (or press S S on desktop), and start speaking. Your browser will ask for microphone permission once — allow it and you're done.",
  },
  {
    q: "Why isn't my microphone working?",
    a: "VoiceFlow AI requires Chrome or Edge for voice recording (these browsers support the Web Speech API). Firefox and Safari have limited support. Also check that your browser has microphone permission — look for the lock icon in the address bar → Site Settings → Microphone → Allow.",
  },
  {
    q: "Which languages are supported?",
    a: "25+ languages including English, Urdu, Arabic, Hindi, Spanish, French, German, Chinese, Japanese, Korean, Russian, Portuguese, Turkish, Italian, Dutch, Polish, Swedish, Indonesian, Malay, Thai, Vietnamese, Persian, Bengali, and Tamil. Full RTL support for Arabic, Urdu, and Persian.",
  },
  {
    q: "Is my voice data stored on your servers?",
    a: "No. Audio is processed entirely inside your browser using the Web Speech API and never sent to our servers. Text transcripts are stored locally in your browser. Only when you use AI Enhancement is the text sent to our API — and we do not store it. Use Raw mode (level 0) for fully offline, zero-API usage.",
  },
  {
    q: "What is the enhancement slider?",
    a: "The slider controls how much AI rewrites your dictation. At 0 it only removes filler words ('um', 'uh'). At 50 it improves flow and fixes grammar. At 100 it fully polishes your text to match the selected mode (professional, email, code, etc.).",
  },
  {
    q: "How do I use VoiceFlow in other apps (Gmail, Slack, Notion)?",
    a: "Go to /install and follow the Bookmarklet setup — drag the button to your bookmarks bar. When you're in any web app, click the bookmark to launch the floating VoiceFlow widget. Speak, and your enhanced text is injected directly at your cursor position.",
  },
  {
    q: "What is Developer Mode?",
    a: "Developer mode tells the AI to preserve code syntax exactly — variable names, operators (==, =>, {}), framework terms (useState, async/await, SQL, etc). Use it when dictating code comments, commit messages, or prompts for Cursor/Copilot.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel at any time from your account settings. Your Pro access continues until the end of the billing period. No refunds for partial months, but you're never locked in.",
  },
  {
    q: "What is the Lifetime plan?",
    a: "A one-time payment of $149 gives you permanent access to all current Pro features with no monthly bill. Contact us on WhatsApp to get the payment link and activate your lifetime account.",
  },
  {
    q: "The SS shortcut isn't working. Why?",
    a: "The SS double-key shortcut only works on desktop (not mobile). Make sure the VoiceFlow app tab is focused in your browser. Press S twice quickly (within 400ms). If it still doesn't work, try clicking the mic button directly.",
  },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm sm:text-base font-medium text-white/80">{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 sm:px-6 py-12">
      {/* Background */}
      <div className="fixed top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

      <div className="max-w-3xl mx-auto">
        {/* Nav */}
        <div className="flex items-center gap-2 mb-10">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Mic size={13} />
            </div>
            <span className="text-sm font-semibold">VoiceFlow AI</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Support Center</h1>
          <p className="text-white/40 text-base mb-12">
            Real humans, fast responses. We typically reply within a few hours.
          </p>
        </motion.div>

        {/* Quick contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
          {[
            {
              icon: MessageCircle,
              label: "WhatsApp",
              detail: "Fastest — usually reply in minutes",
              action: "Chat Now",
              color: "from-emerald-500 to-teal-500",
              href: "https://wa.me/923001234567?text=Hi!%20I%20need%20help%20with%20VoiceFlow%20AI.",
            },
            {
              icon: Mail,
              label: "Email",
              detail: "support@linkedwin.io",
              action: "Send Email",
              color: "from-brand-400 to-purple-500",
              href: "mailto:support@linkedwin.io",
            },
            {
              icon: Phone,
              label: "Phone / WhatsApp",
              detail: "+92 300 123 4567",
              action: "Call Now",
              color: "from-amber-400 to-orange-500",
              href: "tel:+923001234567",
            },
          ].map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                <c.icon size={18} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm text-white/80 mb-0.5">{c.label}</div>
                <div className="text-xs text-white/35">{c.detail}</div>
              </div>
              <span className="text-xs text-brand-400 font-medium mt-auto">{c.action} →</span>
            </motion.a>
          ))}
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-white/40 text-sm mb-8">Quick answers to the most common questions.</p>
          <div className="space-y-2">
            {FAQS.map((faq, i) => <FAQItem key={faq.q} faq={faq} index={i} />)}
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl p-6 sm:p-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-xl font-bold mb-1">Send us a message</h2>
          <p className="text-white/35 text-sm mb-6">Can't find your answer above? We'll get back to you within 24 hours.</p>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-8 gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center"
                style={{ border: "1px solid rgba(16,185,129,0.3)" }}>
                <CheckCircle size={26} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Message sent!</h3>
                <p className="text-white/40 text-sm">We'll reply to {form.email} within 24 hours.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Your Name</label>
                  <input
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Muhammad Ali" required
                    className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Email Address</label>
                  <input
                    type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com" required
                    className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 ml-1">Subject</label>
                <input
                  value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Microphone not working on Android" required
                  className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 ml-1">Message</label>
                <textarea
                  rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your issue or question in detail..." required
                  className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
              <button type="submit"
                className="px-6 py-3 rounded-2xl font-semibold text-sm transition-all"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 25px rgba(99,102,241,0.3)" }}>
                Send Message
              </button>
            </form>
          )}
        </motion.div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <Link href="/" className="text-sm text-white/30 hover:text-white transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
