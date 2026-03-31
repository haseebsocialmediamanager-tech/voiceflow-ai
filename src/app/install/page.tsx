"use client";

import { motion } from "framer-motion";
import { Mic, Smartphone, Monitor, Check, Download, FolderOpen, ToggleLeft, Puzzle, Globe } from "lucide-react";
import Link from "next/link";

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
            Install VoiceFlow{" "}
            <span className="gradient-text">everywhere</span>
          </h1>
          <p className="text-white/50 text-lg mb-10">
            Use voice dictation in any text box on any website — Gmail, WhatsApp, Facebook, LinkedIn and more.
          </p>

          {/* Shortcut Overview */}
          <div className="glass rounded-2xl p-5 mb-6 border border-white/8">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Keyboard Shortcuts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <kbd className="text-brand-300 font-bold px-2.5 py-1 rounded-lg text-sm flex-shrink-0" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)" }}>F2</kbd>
                <div>
                  <div className="text-sm font-semibold text-white/80">Extension Sidebar</div>
                  <div className="text-xs text-white/40 mt-0.5">Toggle the Chrome extension on any website — Gmail, WhatsApp, LinkedIn, etc.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <kbd className="text-emerald-300 font-bold px-2.5 py-1 rounded-lg text-sm flex-shrink-0 whitespace-nowrap" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>Ctrl+9</kbd>
                <div>
                  <div className="text-sm font-semibold text-white/80">Web App Mic</div>
                  <div className="text-xs text-white/40 mt-0.5">Start / stop recording directly on <strong className="text-white/60">linkedwin.io/app</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Chrome Extension — Primary */}
          <div className="rounded-2xl p-6 mb-4 border border-brand-500/30" style={{ background: "rgba(99,102,241,0.08)" }}>
            <div className="flex items-center gap-3 mb-2">
              <Download size={22} className="text-brand-400" />
              <h2 className="font-bold text-xl">Chrome Extension</h2>
              <span className="ml-auto text-xs text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-full">Recommended</span>
            </div>
            <p className="text-white/50 text-sm mb-5">
              Works on Chrome, Brave, Edge, Opera. Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 text-xs font-bold">F2</kbd> anywhere to open the sidebar and dictate into any text box.
            </p>

            {/* Download button */}
            <a
              href="/voiceflow-extension.zip"
              download="voiceflow-extension.zip"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white mb-6"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 20px rgba(99,102,241,0.4)",
              }}
            >
              <Download size={16} />
              Download Extension (.zip)
            </a>

            {/* Install steps */}
            <h3 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">How to install (Developer Mode)</h3>
            <ol className="space-y-4">
              {[
                {
                  icon: Download,
                  title: "Download & unzip",
                  desc: 'Click the button above to download. Then right-click the zip file → "Extract All" → choose a folder you\'ll remember (e.g. Desktop).',
                },
                {
                  icon: Monitor,
                  title: "Open Chrome extensions",
                  desc: (
                    <>
                      In Chrome, go to <kbd className="px-1 py-0.5 rounded bg-white/10 text-xs">chrome://extensions</kbd> — paste that in your address bar and press Enter.
                    </>
                  ),
                },
                {
                  icon: ToggleLeft,
                  title: "Enable Developer Mode",
                  desc: 'Toggle "Developer mode" ON — it\'s in the top-right corner of the extensions page.',
                },
                {
                  icon: FolderOpen,
                  title: 'Click "Load unpacked"',
                  desc: 'A button will appear on the top-left. Click "Load unpacked" and select the unzipped folder (the one containing manifest.json).',
                },
                {
                  icon: Puzzle,
                  title: "Pin the extension",
                  desc: 'Click the puzzle icon 🧩 in your Chrome toolbar → find VoiceFlow AI → click the pin icon to keep it visible.',
                },
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-brand-600/40 flex items-center justify-center text-sm font-bold text-brand-300 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white/90">{step.title}</div>
                    <div className="text-xs text-white/45 mt-0.5 leading-relaxed">{step.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* How to use — Extension */}
          <div className="glass rounded-2xl p-6 mb-4 border border-white/6">
            <div className="flex items-center gap-3 mb-3">
              <Monitor size={20} className="text-brand-400" />
              <h2 className="font-semibold">Using the Extension (F2)</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <kbd className="text-white/80 text-sm font-bold px-2 py-1 rounded bg-white/10 flex-shrink-0 mt-0.5">F2</kbd>
                <div className="text-sm text-white/60">
                  Press <strong className="text-white/80">F2</strong> anywhere on the page to open the extension sidebar and start recording. Press <strong className="text-white/80">F2</strong> again to stop — text is automatically inserted into the focused field.
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { site: "Gmail", action: "Open compose → click email body → press F2 to dictate" },
                  { site: "WhatsApp Web", action: "Click message box → press F2 → speak" },
                  { site: "Facebook", action: "Click comment/post box → press F2 → speak" },
                  { site: "LinkedIn", action: "Click post/comment → press F2 → speak" },
                  { site: "Twitter / X", action: "Click tweet box → press F2 → speak your tweet" },
                  { site: "Any website", action: "Click any text field → press F2 → speak" },
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
          </div>

          {/* Web App shortcut */}
          <div className="glass rounded-2xl p-6 mb-4 border border-white/6">
            <div className="flex items-center gap-3 mb-3">
              <Globe size={20} className="text-emerald-400" />
              <h2 className="font-semibold">Using the Web App (Ctrl+9)</h2>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl mb-3" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
              <kbd className="text-emerald-300 font-bold px-2 py-1 rounded text-sm flex-shrink-0 mt-0.5 whitespace-nowrap" style={{ background: "rgba(16,185,129,0.15)" }}>Ctrl+9</kbd>
              <div className="text-sm text-white/60">
                On <strong className="text-white/80">linkedwin.io/app</strong> press <strong className="text-emerald-300">Ctrl+9</strong> to start or stop recording. Speak in any language, optionally translate to another, then copy or inject the text.
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Start recording", key: "Ctrl+9" },
                { label: "Stop recording", key: "Ctrl+9" },
                { label: "Pause mid-speech", key: "Pause button" },
                { label: "Resume paused", key: "Ctrl+9 or Resume" },
                { label: "Translate output", key: "Pick language → record" },
                { label: "Copy result", key: "Copy button" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <span className="text-sm text-white/55">{item.label}</span>
                  <kbd className="text-xs px-2 py-0.5 rounded font-medium text-white/70" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>{item.key}</kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="glass rounded-2xl p-6 mb-8 border border-white/6">
            <div className="flex items-center gap-3 mb-3">
              <Smartphone size={20} className="text-brand-400" />
              <h2 className="font-semibold">Mobile (Android / iPhone)</h2>
            </div>
            <ol className="space-y-2 text-sm text-white/50">
              <li className="flex gap-2"><span className="text-brand-400 font-bold">1.</span> Open <strong className="text-white/70">linkedwin.io/app</strong> in your browser</li>
              <li className="flex gap-2"><span className="text-brand-400 font-bold">2.</span> Tap menu → <strong className="text-white/70">"Add to Home Screen"</strong></li>
              <li className="flex gap-2"><span className="text-brand-400 font-bold">3.</span> Opens like a native app from your home screen</li>
              <li className="flex gap-2"><span className="text-brand-400 font-bold">4.</span> Tap the mic button to record — enhanced text auto-copies → switch to any app → paste</li>
              <li className="flex gap-2"><span className="text-brand-400 font-bold">5.</span> <strong className="text-white/70">Android:</strong> Use Kiwi Browser to install the extension on mobile too</li>
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
