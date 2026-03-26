"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

const ROTATING_WORDS = [
  "Faster",
  "Smarter",
  "Clearer",
  "Anywhere",
  "In Any Language",
  "Privately",
];

const LANGUAGES_TICKER = [
  { text: "Hello, world!", lang: "English" },
  { text: "ہیلو، دنیا!", lang: "Urdu" },
  { text: "مرحبا بالعالم!", lang: "Arabic" },
  { text: "नमस्ते दुनिया!", lang: "Hindi" },
  { text: "Hola, mundo!", lang: "Spanish" },
  { text: "Bonjour le monde!", lang: "French" },
  { text: "こんにちは世界！", lang: "Japanese" },
  { text: "안녕하세요 세계!", lang: "Korean" },
  { text: "Привет, мир!", lang: "Russian" },
  { text: "مرحبا بالعالم!", lang: "Persian" },
];

function FloatingParticle({ x, y, size, delay, duration }: any) {
  return (
    <motion.div
      className="absolute rounded-full opacity-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function AnimatedHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((i) => (i + 1) % LANGUAGES_TICKER.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 12,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 6,
  }));

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      {/* Big background orbs */}
      <div
        className="orb-1 absolute top-[-10%] left-[10%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="orb-2 absolute bottom-[-15%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-xs text-white/50 mb-8"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          25+ languages · Privacy-first · Works on Windows & Mac
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-2">
            <span className="text-white">Speak.</span>
            <br />
            <span className="gradient-text">Enhance.</span>
            <br />
            <span className="text-white">Done.</span>
          </h1>
        </motion.div>

        {/* Rotating word */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="text-2xl md:text-3xl font-light text-white/40">Write</span>
          <div className="relative h-10 w-52 overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
                className="absolute text-2xl md:text-3xl font-bold gradient-text"
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The AI dictation tool that actually works — on Windows, Mac & Android.
          Privacy-first, developer-ready, and fluent in 25+ languages.
        </motion.p>

        {/* Language ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-3 mb-10 h-8"
        >
          <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center">
            <Mic size={10} className="text-brand-400" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={langIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span
                className="text-base text-white/70"
                dir={["Urdu", "Arabic", "Persian"].includes(LANGUAGES_TICKER[langIndex].lang) ? "rtl" : "ltr"}
              >
                {LANGUAGES_TICKER[langIndex].text}
              </span>
              <span className="text-xs text-white/25 border border-white/10 px-2 py-0.5 rounded-full">
                {LANGUAGES_TICKER[langIndex].lang}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="/app"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 font-semibold text-base overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-brand-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative flex items-center gap-2">
              <Mic size={18} />
              Start Dictating Free
            </span>
          </motion.a>

          <motion.a
            href="#flow-for"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl glass hover:bg-white/5 font-medium text-base text-white/60 hover:text-white transition-all"
          >
            Who is it for?
          </motion.a>
        </motion.div>

        {/* Animated flag row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 overflow-hidden w-full max-w-lg mx-auto"
        >
          <motion.div
            className="flex gap-3"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {["🇺🇸","🇵🇰","🇸🇦","🇮🇳","🇪🇸","🇫🇷","🇩🇪","🇨🇳","🇯🇵","🇰🇷","🇷🇺","🇮🇷","🇧🇩","🇧🇷","🇹🇷","🇮🇩",
              "🇺🇸","🇵🇰","🇸🇦","🇮🇳","🇪🇸","🇫🇷","🇩🇪","🇨🇳","🇯🇵","🇰🇷","🇷🇺","🇮🇷","🇧🇩","🇧🇷","🇹🇷","🇮🇩",
            ].map((flag, i) => (
              <span
                key={i}
                className="text-2xl shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                {flag}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-6 mt-12 text-sm text-white/25"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">★★★★★</span>
            <span>4.9/5</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span>No credit card required</span>
          <div className="w-px h-4 bg-white/10" />
          <span>25+ languages</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/20">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/20" />
        </motion.div>
      </motion.div>
    </div>
  );
}
