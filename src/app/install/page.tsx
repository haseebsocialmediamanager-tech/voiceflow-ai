"use client";

import { motion } from "framer-motion";
import { Mic, BookmarkIcon, Chrome, Smartphone, Monitor, Check } from "lucide-react";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.linkedwin.io";

// The bookmarklet code — loads the widget script from our server
const BOOKMARKLET = `javascript:(function(){var s=document.createElement('script');s.src='${APP_URL}/voiceflow-widget.js?v='+Date.now();document.head.appendChild(s);})();`;

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-2 mb-10">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Mic size={13} />
            </div>
            <span className="text-sm font-semibold">VoiceFlow AI</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Use VoiceFlow{" "}
            <span className="gradient-text">everywhere</span>
          </h1>
          <p className="text-white/50 text-lg mb-10">
            One click to activate on Facebook, Gmail, Twitter, WhatsApp Web — any website.
          </p>

          {/* Step 1 — Bookmarklet */}
          <div className="glass rounded-2xl p-6 mb-4 border border-white/6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold">1</div>
              <h2 className="font-semibold text-lg">Drag this button to your bookmarks bar</h2>
            </div>

            <p className="text-white/40 text-sm mb-5">
              Drag the purple button below to your browser's bookmarks/favorites bar.
              If you don't see the bar: press <kbd>Ctrl+Shift+B</kbd> (Windows) or <kbd>Cmd+Shift+B</kbd> (Mac).
            </p>

            {/* The draggable bookmarklet */}
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href={BOOKMARKLET}
                onClick={(e) => { e.preventDefault(); alert('Drag this button to your bookmarks bar — don\'t click it here!'); }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white cursor-grab active:cursor-grabbing select-none"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
                draggable="true"
              >
                🎙️ VoiceFlow AI
              </a>
              <span className="text-white/30 text-sm">← Drag me to bookmarks bar</span>
            </div>
          </div>

          {/* Step 2 — Use it */}
          <div className="glass rounded-2xl p-6 mb-4 border border-white/6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="font-semibold text-lg">Click it on any website</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { site: "Facebook", action: "Go to Facebook → click in comment box → click VoiceFlow in bookmarks" },
                { site: "Gmail", action: "Open a compose window → click in email body → click VoiceFlow" },
                { site: "Twitter/X", action: "Click in tweet box → click VoiceFlow → speak your tweet" },
                { site: "WhatsApp Web", action: "Click in message box → click VoiceFlow → speak" },
                { site: "LinkedIn", action: "Click in post/comment → click VoiceFlow → speak" },
                { site: "Any website", action: "Click any text field → click VoiceFlow → speak" },
              ].map((item) => (
                <div key={item.site} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <Check size={13} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{item.site}</div>
                    <div className="text-xs text-white/40 mt-0.5">{item.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SS shortcut */}
          <div className="glass rounded-2xl p-6 mb-4 border border-white/6">
            <div className="flex items-center gap-3 mb-3">
              <Monitor size={20} className="text-brand-400" />
              <h2 className="font-semibold">Desktop shortcut</h2>
            </div>
            <p className="text-white/50 text-sm">
              Once the widget is loaded on a page, press{" "}
              <kbd className="text-white/70">S</kbd>{" "}
              <kbd className="text-white/70">S</kbd>{" "}
              (double S) anywhere on that page to start/stop recording — even if you're not in a text field.
            </p>
          </div>

          {/* Mobile */}
          <div className="glass rounded-2xl p-6 mb-8 border border-white/6">
            <div className="flex items-center gap-3 mb-3">
              <Smartphone size={20} className="text-brand-400" />
              <h2 className="font-semibold">Mobile (Android / iPhone)</h2>
            </div>
            <ol className="space-y-2 text-sm text-white/50">
              <li className="flex gap-2"><span className="text-brand-400 font-bold">1.</span> Open <strong className="text-white/70">linkedwin.io/app</strong> in Chrome</li>
              <li className="flex gap-2"><span className="text-brand-400 font-bold">2.</span> Tap menu → <strong className="text-white/70">"Add to Home Screen"</strong></li>
              <li className="flex gap-2"><span className="text-brand-400 font-bold">3.</span> Now it opens like a native app from your home screen</li>
              <li className="flex gap-2"><span className="text-brand-400 font-bold">4.</span> Record → Enhanced text auto-copies → switch to any app → paste</li>
            </ol>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/app"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-semibold text-sm transition-colors">
              <Mic size={15} /> Open App
            </Link>
            <Link href="/"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/5 text-sm text-white/60 hover:text-white transition-colors">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
