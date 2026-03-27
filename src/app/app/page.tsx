"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Copy, Trash2, Settings, Clock, RotateCcw,
  Check, Loader2, ArrowLeft, ChevronDown, Keyboard, Sparkles, X, Wand2, SpellCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useVoiceStore } from "@/lib/store";
import { enhanceText } from "@/lib/enhance";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ModeSelector } from "@/components/ModeSelector";
import { EnhancementSlider } from "@/components/EnhancementSlider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { RealWaveform } from "@/components/RealWaveform";
import { getLang, LANGUAGES } from "@/lib/languages";
import { useDoubleKey } from "@/hooks/useDoubleKey";
import { injectTextAtCursor } from "@/hooks/useTextInjector";

export default function AppPage() {
  const {
    isRecording, transcript, enhanced, enhanceMode, enhanceLevel,
    language, history,
    setRecording, setTranscript, setEnhanced, setEnhanceMode,
    setEnhanceLevel, setLanguage, addToHistory, clearCurrent,
  } = useVoiceStore();

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"enhanced" | "raw">("enhanced");
  const [liveText, setLiveText] = useState("");
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [compact, setCompact] = useState(false);
  const [showShortcutHint, setShowShortcutHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const recognitionRef = useRef<any>(null);
  const accumulatedRef = useRef<string>("");
  const streamRef = useRef<MediaStream | null>(null);
  const languageRef = useRef(language);
  const isLang = getLang(language);

  // Keep languageRef in sync so callbacks always have the latest language
  useEffect(() => { languageRef.current = language; }, [language]);

  // Detect mobile
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Read ?lang= from URL on mount and apply it
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (lang) setLanguage(lang);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Build a fresh recognition instance ──────────────────────
  const buildRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;

    // Cleanup previous instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = languageRef.current;
    r.maxAlternatives = 1;

    r.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      if (final) accumulatedRef.current += final + " ";
      const full = accumulatedRef.current + interim;
      setLiveText(full);
      setTranscript(full);
    };

    r.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        toast.error("Microphone blocked. Allow it in browser settings.");
      } else if (event.error === "language-not-supported") {
        toast.error(`${isLang.nativeName} not supported in this browser. Try Chrome.`);
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        toast.error(`Error: ${event.error}`);
      }
    };

    r.onend = () => {
      // Auto-restart if still recording (mobile often stops recognition)
      if (recognitionRef.current?._shouldRestart) {
        try { recognitionRef.current.start(); } catch {}
      }
    };

    return r;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTranscript]);

  // Rebuild recognition whenever language changes
  useEffect(() => {
    const r = buildRecognition();
    if (r) recognitionRef.current = r;
  }, [buildRecognition, language]);

  const startRecording = useCallback(async () => {
    if (!recognitionRef.current) {
      toast.error("Use Chrome or Edge for voice recording.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setAudioStream(stream);
    } catch {
      toast.error("Microphone access denied. Tap Allow when prompted.");
      return;
    }

    // Rebuild with current language to ensure fresh instance
    const r = buildRecognition();
    if (!r) return;
    // Force language assignment right before start — prevents Android Chrome stale-lang bug
    r.lang = languageRef.current;
    r._shouldRestart = true;
    recognitionRef.current = r;

    accumulatedRef.current = "";
    setLiveText("");
    setTranscript("");
    setEnhanced("");
    setActiveTab("enhanced");

    try {
      r.start();
      setRecording(true);
      setShowShortcutHint(false);
    } catch (e) {
      toast.error("Could not start recording. Try again.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildRecognition, setRecording, setTranscript, setEnhanced, languageRef]);

  const stopRecording = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current._shouldRestart = false;
      try { recognitionRef.current.stop(); } catch {}
    }
    setRecording(false);

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setAudioStream(null);

    const text = accumulatedRef.current.trim();
    if (!text) { setLiveText(""); return; }

    setTranscript(text);
    setLiveText("");

    if (enhanceLevel > 0 && enhanceMode !== "raw") {
      setIsEnhancing(true);
      try {
        const result = await enhanceText(text, enhanceMode, enhanceLevel, language);
        setEnhanced(result);
        setActiveTab("enhanced");

        const mode = injectTextAtCursor(result);
        if (mode === "injected") {
          toast.success("Injected at cursor!", { icon: "✍️" });
        } else {
          await navigator.clipboard.writeText(result).catch(() => {});
          toast.success("Enhanced & copied! Paste with Ctrl+V", { icon: "📋", duration: 4000 });
        }
        addToHistory({
          id: crypto.randomUUID(), transcript: text, enhanced: result,
          mode: enhanceMode, language, createdAt: new Date().toISOString(),
        });
      } catch {
        setEnhanced(text);
        await navigator.clipboard.writeText(text).catch(() => {});
        toast.success("Copied! Paste with Ctrl+V", { duration: 3000 });
      } finally {
        setIsEnhancing(false);
      }
    } else {
      setEnhanced(text);
      const mode = injectTextAtCursor(text);
      if (mode === "clipboard") {
        await navigator.clipboard.writeText(text).catch(() => {});
        toast.success("Copied! Paste anywhere with Ctrl+V", { icon: "📋", duration: 4000 });
      } else {
        toast.success("Text injected!", { icon: "✍️" });
      }
    }
  }, [setRecording, setTranscript, setEnhanced, enhanceMode, enhanceLevel, language, addToHistory]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  // SS shortcut (desktop only)
  useDoubleKey("s", 400, toggleRecording);

  const handleCopy = async () => {
    const text = activeTab === "enhanced" ? enhanced : transcript;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReEnhance = async () => {
    if (!transcript) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceText(transcript, enhanceMode, enhanceLevel, language);
      setEnhanced(result);
      setActiveTab("enhanced");
      toast.success("Re-enhanced!");
    } catch {
      toast.error("Enhancement failed");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFix = async () => {
    const text = activeTab === "enhanced" ? enhanced : transcript;
    if (!text) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceText(text, "fix" as any, 100, language);
      setEnhanced(result);
      setActiveTab("enhanced");
      toast.success("Spelling & grammar fixed!");
    } catch {
      toast.error("Fix failed");
    } finally {
      setIsEnhancing(false);
    }
  };

  const activeText = activeTab === "enhanced" ? enhanced : transcript;
  const displayText = isRecording ? liveText : activeText;

  // ── Compact floating widget ──────────────────────────────────
  if (compact) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="glass-strong rounded-3xl p-4 flex items-center gap-3 border border-white/10 shadow-2xl">
          <motion.button
            onClick={toggleRecording}
            whileTap={{ scale: 0.9 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isRecording
                ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                : "bg-brand-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            }`}
          >
            {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
          </motion.button>
          {isRecording && (
            <div className="flex items-center gap-0.5 px-1">
              {[...Array(6)].map((_, i) => (
                <motion.div key={i} className="w-0.5 rounded-full bg-brand-400"
                  animate={{ height: [4, 8 + Math.random() * 14, 4] }}
                  transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.06 }} />
              ))}
            </div>
          )}
          <button onClick={() => setCompact(false)} className="text-white/30 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>
        {!isMobile && <p className="text-center text-xs text-white/25 mt-1.5">SS to toggle</p>}
      </div>
    );
  }

  // ── Full UI ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0a0a0f] flex flex-col overflow-hidden">

      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ opacity: isRecording ? 0.15 : 0.06 }} transition={{ duration: 1 }}
          className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <motion.div animate={{ opacity: isRecording ? 0.1 : 0.04 }} transition={{ duration: 1 }}
          className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/[0.05] flex-shrink-0"
        style={{ background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="text-white/30 hover:text-white transition-colors p-1 -ml-1">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
              <Mic size={12} />
            </div>
            <span className="text-sm font-semibold tracking-tight hidden xs:block">VoiceFlow</span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <LanguageSelector
            value={language}
            onChange={(code) => {
              setLanguage(code);
              const selected = getLang(code);
              toast.success(`${selected.flag} ${selected.nativeName}`, { duration: 1500, icon: undefined });
              // If currently recording, stop so user can restart in new language
              if (isRecording) {
                stopRecording();
                toast("Tap mic to record in new language", { icon: "🎙️", duration: 2500 });
              }
            }}
          />
          <button onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${
              showHistory ? "bg-brand-600/30 text-brand-300" : "text-white/35 hover:text-white hover:bg-white/5"
            }`}>
            <Clock size={13} />
            {history.length > 0 && (
              <span className="text-[10px] bg-brand-500/30 text-brand-300 px-1 py-0.5 rounded-full">{history.length}</span>
            )}
          </button>
          <button onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg text-xs transition-colors ${showSettings ? "bg-white/10 text-white" : "text-white/35 hover:text-white hover:bg-white/5"}`}>
            <Settings size={14} />
          </button>
          {!isMobile && (
            <button onClick={() => setCompact(true)}
              className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors">
              <ChevronDown size={14} />
            </button>
          )}
        </div>
      </header>

      {/* ── Settings drawer ── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-10 overflow-hidden border-b border-white/[0.05] flex-shrink-0"
            style={{ background: "rgba(16,16,25,0.97)" }}>
            <div className="px-4 py-4 space-y-4">
              <ModeSelector mode={enhanceMode} onChange={setEnhanceMode} />
              <EnhancementSlider value={enhanceLevel} onChange={setEnhanceLevel} />
              {!isMobile && (
                <p className="text-xs text-white/25 flex items-center gap-1.5">
                  <Keyboard size={11} />
                  Press <kbd>S S</kbd> to toggle recording from anywhere on this page
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden relative z-10 min-h-0">

        {/* ── Main ── */}
        <main className="flex-1 flex flex-col items-center justify-start sm:justify-center px-4 py-6 overflow-y-auto gap-0">

          {/* Shortcut hint — desktop only */}
          <AnimatePresence>
            {showShortcutHint && !isRecording && !isMobile && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-xs text-white/20 mb-6">
                <Keyboard size={11} />
                Press <kbd>S</kbd> <kbd>S</kbd> to start
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Mic button ── */}
          <div className="relative flex items-center justify-center mb-6">
            {isRecording && [1, 2, 3].map((i) => (
              <motion.div key={i} className="absolute rounded-full border border-brand-500/25"
                animate={{ scale: [1, 1.8 + i * 0.3], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                style={{ width: 96, height: 96 }} />
            ))}

            <motion.button onClick={toggleRecording}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
              animate={isRecording
                ? { boxShadow: ["0 0 40px rgba(239,68,68,0.4)", "0 0 70px rgba(239,68,68,0.7)", "0 0 40px rgba(239,68,68,0.4)"] }
                : { boxShadow: ["0 0 30px rgba(99,102,241,0.3)", "0 0 50px rgba(99,102,241,0.5)", "0 0 30px rgba(99,102,241,0.3)"] }
              }
              transition={{ duration: 2, repeat: Infinity }}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-colors duration-300 touch-manipulation ${
                isRecording ? "bg-red-500" : "bg-brand-600 active:bg-brand-500"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <AnimatePresence mode="wait">
                {isRecording
                  ? <motion.div key="stop" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}><MicOff size={34} className="text-white" /></motion.div>
                  : <motion.div key="start" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}><Mic size={34} className="text-white" /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Status */}
          <div className="text-sm mb-5 flex items-center gap-2 h-6 px-2 text-center">
            {isRecording ? (
              <motion.span className="flex items-center gap-2 text-white/60"
                animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  {isMobile ? `Listening in ${isLang.nativeName}...` : `Listening in ${isLang.nativeName} · tap to stop`}
                </span>
              </motion.span>
            ) : isEnhancing ? (
              <span className="flex items-center gap-2 text-brand-400 text-xs sm:text-sm">
                <Loader2 size={13} className="animate-spin flex-shrink-0" />
                Enhancing with AI...
              </span>
            ) : (
              <span className="text-white/25 text-xs sm:text-sm">
                {isMobile ? "Tap mic to start" : "Click mic or press SS"}
              </span>
            )}
          </div>

          {/* Waveform */}
          <div className="mb-6 w-full max-w-xs sm:max-w-sm h-12 flex items-center justify-center">
            <RealWaveform stream={audioStream} isActive={isRecording} bars={36} />
          </div>

          {/* ── Mobile Language Grid — always visible, no dropdown ── */}
          {isMobile && (
            <div className="w-full max-w-sm mb-3">
              <p className="text-[11px] text-white/30 text-center mb-2.5">
                {isRecording ? `🔴 Listening in ${isLang.flag} ${isLang.nativeName}` : "Tap your language, then tap the mic"}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onPointerDown={() => {
                      setLanguage(lang.code);
                      toast.success(`${lang.flag} ${lang.nativeName}`, { duration: 1200 });
                      if (isRecording) stopRecording();
                    }}
                    disabled={isRecording}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-2xl border transition-all active:scale-95 touch-manipulation ${
                      language === lang.code
                        ? "border-brand-500/60 bg-brand-600/25"
                        : "border-white/6 bg-white/[0.02] active:bg-white/5"
                    }`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <span className="text-xl leading-none">{lang.flag}</span>
                    <span
                      className={`text-[9px] leading-tight text-center w-full truncate px-0.5 ${
                        language === lang.code ? "text-brand-300 font-semibold" : "text-white/40"
                      }`}
                      dir={lang.rtl ? "rtl" : "ltr"}
                      style={{ fontFamily: lang.rtl ? "'Noto Naskh Arabic', sans-serif" : undefined }}
                    >
                      {lang.nativeName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode + settings shortcut on mobile */}
          {isMobile && (
            <div className="w-full max-w-sm mb-3">
              <button onClick={() => setShowSettings(!showSettings)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm text-white/40 transition-colors active:bg-white/5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="flex items-center gap-2">
                  <Settings size={14} />
                  {enhanceMode.charAt(0).toUpperCase() + enhanceMode.slice(1)} mode · {
                    enhanceLevel === 0 ? "No AI" : enhanceLevel < 40 ? "Light" : enhanceLevel < 75 ? "Balanced" : "Full"
                  }
                </span>
                <ChevronDown size={14} className={showSettings ? "rotate-180" : ""} />
              </button>
            </div>
          )}

          {/* ── Text panel ── */}
          <AnimatePresence mode="wait">
            {(isRecording && liveText) || (!isRecording && (transcript || enhanced)) ? (
              <motion.div key="result"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16 }}
                className="w-full max-w-sm sm:max-w-xl">

                {/* Tabs */}
                {!isRecording && enhanced && (
                  <div className="flex items-center gap-1 mb-3 p-1 rounded-xl w-fit"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <button onClick={() => setActiveTab("enhanced")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === "enhanced" ? "bg-brand-600 text-white" : "text-white/35 hover:text-white"
                      }`}>
                      <span className="flex items-center gap-1"><Sparkles size={10} /> Enhanced</span>
                    </button>
                    <button onClick={() => setActiveTab("raw")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === "raw" ? "bg-white/10 text-white" : "text-white/35 hover:text-white"
                      }`}>Raw</button>
                  </div>
                )}

                {/* Text box */}
                <div className="rounded-2xl p-4 sm:p-5 relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: isRecording ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  }}>
                  {isEnhancing ? (
                    <div className="flex items-center gap-3 text-white/35 py-3">
                      <Loader2 size={16} className="animate-spin text-brand-400 flex-shrink-0" />
                      <span className="text-sm">AI is polishing your text...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-white/80 text-sm leading-relaxed min-h-[60px] whitespace-pre-wrap break-words"
                        dir={isLang.rtl ? "rtl" : "ltr"}
                        style={{ fontFamily: isLang.rtl ? "'Noto Naskh Arabic', 'Noto Sans Arabic', sans-serif" : undefined }}>
                        {isRecording ? (
                          <>{liveText}
                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                              className="inline-block w-0.5 h-4 bg-brand-400 ml-0.5 align-middle" />
                          </>
                        ) : (
                          displayText || <span className="text-white/20 italic">Your text will appear here...</span>
                        )}
                      </p>
                      {!isRecording && activeText && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 flex-wrap">
                          <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full capitalize">{enhanceMode}</span>
                          <span className="text-[10px] text-white/20">{isLang.flag} {isLang.nativeName}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Actions */}
                {!isRecording && activeText && !isEnhancing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mt-3 flex-wrap">
                    <button onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 active:bg-brand-500 text-xs font-medium transition-colors touch-manipulation"
                      style={{ WebkitTapHighlightColor: "transparent" }}>
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button onClick={handleFix} disabled={!activeText || isEnhancing}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs text-white/45 active:text-white transition-colors disabled:opacity-30 touch-manipulation"
                      style={{ background: "rgba(255,255,255,0.04)", WebkitTapHighlightColor: "transparent" }}>
                      <SpellCheck size={12} /> Fix
                    </button>
                    <button onClick={handleReEnhance} disabled={!transcript || isEnhancing}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs text-white/45 active:text-white transition-colors disabled:opacity-30 touch-manipulation"
                      style={{ background: "rgba(255,255,255,0.04)", WebkitTapHighlightColor: "transparent" }}>
                      <Wand2 size={12} /> Enhance
                    </button>
                    <button onClick={clearCurrent}
                      className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs text-white/30 active:text-red-400 transition-colors touch-manipulation"
                      style={{ background: "rgba(255,255,255,0.04)", WebkitTapHighlightColor: "transparent" }}>
                      <Trash2 size={12} /> Clear
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center w-full max-w-xs sm:max-w-sm px-2">
                {!isMobile && (
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {[
                      { emoji: "📧", label: "Email drafts" },
                      { emoji: "💬", label: "Slack messages" },
                      { emoji: "📝", label: "Notes & docs" },
                      { emoji: "💻", label: "Code comments" },
                    ].map((tip) => (
                      <div key={tip.label}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-white/30"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span>{tip.emoji}</span>{tip.label}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-white/20 leading-relaxed">
                  {isMobile
                    ? `Select a language above · tap mic · AI enhances · auto-copies`
                    : "Speak · AI enhances · auto-copies · paste with Ctrl+V"
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom padding for mobile safe area */}
          <div className="h-6 flex-shrink-0" />
        </main>

        {/* History panel */}
        <AnimatePresence>
          {showHistory && (
            <HistoryPanel history={history} onClose={() => setShowHistory(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
