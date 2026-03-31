"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

const ROTATING_WORDS = [
  "Faster",
  "Smarter",
  "Anywhere",
  "Privately",
  "In Urdu",
  "In Arabic",
  "In Hindi",
];

const LANGUAGES_TICKER = [
  { text: "Hello, world!", lang: "English", rtl: false },
  { text: "ہیلو، دنیا!", lang: "Urdu", rtl: true },
  { text: "مرحبا بالعالم!", lang: "Arabic", rtl: true },
  { text: "नमस्ते दुनिया!", lang: "Hindi", rtl: false },
  { text: "Hola, mundo!", lang: "Spanish", rtl: false },
  { text: "Bonjour le monde!", lang: "French", rtl: false },
  { text: "こんにちは世界！", lang: "Japanese", rtl: false },
  { text: "안녕하세요 세계!", lang: "Korean", rtl: false },
  { text: "Привет, мир!", lang: "Russian", rtl: false },
  { text: "فارسی سلام!", lang: "Persian", rtl: true },
];

// Country codes for flag-icons CSS (works on Windows — no emoji rendering issues)
const FLAGS = ["us","pk","sa","in","es","fr","de","cn","jp","kr","ru","ir","bd","br","tr","id"];

export function AnimatedHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setWordIndex((v) => (v + 1) % ROTATING_WORDS.length), 2000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setLangIndex((v) => (v + 1) % LANGUAGES_TICKER.length), 1800);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">

      {/* Background orbs */}
      <div className="orb-1 absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
      <div className="orb-2 absolute bottom-[-15%] right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* Content — full width with max-w, centered */}
      <div className="relative z-10 text-center w-full max-w-2xl mx-auto pb-6 sm:pb-16">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-white/50 mb-6 max-w-full">
          <motion.span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="truncate">25+ languages · Privacy-first · Windows, Mac & Android</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.92] mb-5"
        >
          <span className="text-white">Speak.</span><br />
          <span className="gradient-text">Enhance.</span><br />
          <span className="text-white">Done.</span>
        </motion.h1>

        {/* Write [word] — tight, no overflow */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex items-center justify-center mb-5 overflow-hidden" style={{ height: "2.5rem" }}>
          <span className="text-xl sm:text-2xl font-light text-white/40 mr-2 flex-shrink-0">Write</span>
          <div className="relative overflow-hidden flex-shrink-0" style={{ height: "2.5rem", minWidth: "120px", maxWidth: "200px" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ y: 36, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -36, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center text-xl sm:text-2xl font-bold gradient-text whitespace-nowrap"
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="text-sm sm:text-base md:text-lg text-white/45 mx-auto mb-8 leading-relaxed px-2"
          style={{ maxWidth: "480px" }}
        >
          The AI dictation tool that actually works on every platform.
          Privacy-first, fluent in 25+ languages including Urdu &amp; Arabic.
        </motion.p>

        {/* Language ticker */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mb-8 h-8 overflow-hidden">
          <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <Mic size={10} className="text-brand-400" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={langIndex}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 overflow-hidden">
              <span className="text-sm sm:text-base text-white/70 truncate max-w-[160px] sm:max-w-none"
                dir={LANGUAGES_TICKER[langIndex].rtl ? "rtl" : "ltr"}
                style={{ fontFamily: LANGUAGES_TICKER[langIndex].rtl ? "'Noto Naskh Arabic', sans-serif" : undefined }}>
                {LANGUAGES_TICKER[langIndex].text}
              </span>
              <span className="text-xs text-white/25 border border-white/10 px-2 py-0.5 rounded-full flex-shrink-0">
                {LANGUAGES_TICKER[langIndex].lang}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTAs — stacked on mobile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 px-2">
          <a href="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-brand-600 font-semibold text-base transition-all touch-manipulation"
            style={{ boxShadow: "0 0 30px rgba(99,102,241,0.4)", WebkitTapHighlightColor: "transparent" }}>
            <Mic size={18} />
            Start Dictating Free
          </a>
          <a href="#flow-for"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-medium text-base text-white/60 hover:text-white transition-all touch-manipulation"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              WebkitTapHighlightColor: "transparent",
            }}>
            Who is it for?
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-white/25 px-4 mb-8">
          <span className="flex items-center gap-1.5"><span className="text-amber-400">★★★★★</span> 4.9/5 rating</span>
          <span className="hidden sm:block w-px h-4 bg-white/10" />
          <span>No credit card required</span>
          <span className="hidden sm:block w-px h-4 bg-white/10" />
          <span>25+ languages supported</span>
        </motion.div>

        {/* Animated flag row — seamless right-to-left, no jerk */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="overflow-hidden w-full"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}>
          {/* Exactly 2 copies → translate -50% = perfect seamless loop */}
          <div
            className="flex w-max"
            style={{
              animation: "marquee 40s linear infinite",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            {[...FLAGS, ...FLAGS].map((cc, i) => (
              <span key={i}
                className={`fi fi-${cc} flex-shrink-0 rounded-xl mx-1.5`}
                style={{
                  width: "2.75rem",
                  height: "2.75rem",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "inline-block",
                  border: "1px solid rgba(255,255,255,0.1)",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator — hidden on mobile to prevent overlap */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 z-20">
        <span className="text-xs text-white/15">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-4 h-7 rounded-full border border-white/10 flex items-start justify-center pt-1">
          <div className="w-0.5 h-1.5 rounded-full bg-white/20" />
        </motion.div>
      </motion.div>
    </div>
  );
}
