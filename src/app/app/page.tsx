"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Copy, Trash2, Settings, Clock,
  Check, Loader2, ArrowLeft, ChevronDown, Keyboard, Sparkles, X, Wand2,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useVoiceStore } from "@/lib/store";
import { enhanceText } from "@/lib/enhance";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ModeSelector } from "@/components/ModeSelector";
import { EnhancementSlider } from "@/components/EnhancementSlider";
import { RealWaveform } from "@/components/RealWaveform";
import { getLang, LANGUAGES } from "@/lib/languages";
import { injectTextAtCursor } from "@/hooks/useTextInjector";

export default function AppPage() {
  const {
    isRecording, transcript, enhanced, enhanceMode, enhanceLevel,
    language, history,
    setRecording, setTranscript, setEnhanced, setEnhanceMode,
    setEnhanceLevel, setLanguage, addToHistory, clearCurrent,
  } = useVoiceStore();

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"enhanced" | "raw">("enhanced");
  const [liveText, setLiveText] = useState("");
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [compact, setCompact] = useState(false);
  const [showShortcutHint, setShowShortcutHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [translateTo, setTranslateTo] = useState("none");
  const [translatedResult, setTranslatedResult] = useState("");

  const recognitionRef = useRef<any>(null);
  const accumulatedRef = useRef<string>("");
  const streamRef = useRef<MediaStream | null>(null);
  const languageRef = useRef(language);
  const translateToRef = useRef(translateTo);
  const isLang = getLang(language);

  useEffect(() => { translateToRef.current = translateTo; }, [translateTo]);

  // Free Google Translate (no API key needed)
  const translateText = useCallback(async (text: string, fromLang: string, toLang: string): Promise<string> => {
    if (!toLang || toLang === "none") return text;
    // Map speech recognition codes to Google Translate codes
    const gtrans: Record<string, string> = {
      "en-US": "en", "en-GB": "en", "ur-PK": "ur", "ar-SA": "ar", "ar-AE": "ar",
      "hi-IN": "hi", "es-ES": "es", "es-MX": "es", "fr-FR": "fr", "de-DE": "de",
      "zh-CN": "zh-CN", "zh-TW": "zh-TW", "ja-JP": "ja", "ko-KR": "ko",
      "ru-RU": "ru", "pt-BR": "pt", "it-IT": "it", "tr-TR": "tr", "fa-IR": "fa",
      "bn-BD": "bn", "pa-IN": "pa", "ms-MY": "ms", "id-ID": "id", "nl-NL": "nl",
    };
    const from = gtrans[fromLang] || "auto";
    if (from === toLang) return text;
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      return data[0].map((c: any) => c[0]).join("");
    } catch {
      return text;
    }
  }, []);

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
      } else if (event.error === "service-not-allowed") {
        // iOS Safari: language not enabled for dictation on this device
        const lang = getLang(languageRef.current);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS) {
          toast.error(
            `${lang.flag} ${lang.nativeName} not enabled on this iPhone.\n\nGo to: Settings → General → Keyboard → Enable Dictation, then add ${lang.nativeName} as a keyboard language.`,
            { duration: 8000, style: { fontSize: "12px", maxWidth: "320px", whiteSpace: "pre-line" } }
          );
        } else {
          toast.error(`${lang.flag} ${lang.nativeName} not available. Try Chrome on Android or desktop.`, { duration: 5000 });
        }
        setRecording(false);
        if (recognitionRef.current) recognitionRef.current._shouldRestart = false;
      } else if (event.error === "language-not-supported") {
        toast.error(`${getLang(languageRef.current).nativeName} not supported. Try Chrome on desktop.`, { duration: 5000 });
        setRecording(false);
        if (recognitionRef.current) recognitionRef.current._shouldRestart = false;
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        toast.error(`Recording error: ${event.error}`);
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
  }, [setTranscript, setRecording]);

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

    // Translate first if a target language is selected
    const toLang = translateToRef.current;
    const baseText = toLang !== "none"
      ? await translateText(text, languageRef.current, toLang)
      : text;
    setTranslatedResult(toLang !== "none" ? baseText : "");

    if (enhanceLevel > 0 && enhanceMode !== "raw") {
      setIsEnhancing(true);
      try {
        const result = await enhanceText(baseText, enhanceMode, enhanceLevel, language);
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
        setEnhanced(baseText);
        await navigator.clipboard.writeText(baseText).catch(() => {});
        toast.success("Copied! Paste with Ctrl+V", { duration: 3000 });
      } finally {
        setIsEnhancing(false);
      }
    } else {
      setEnhanced(baseText);
      const mode = injectTextAtCursor(baseText);
      if (mode === "clipboard") {
        await navigator.clipboard.writeText(baseText).catch(() => {});
        toast.success("Copied! Paste anywhere with Ctrl+V", { icon: "📋", duration: 4000 });
      } else {
        toast.success("Text injected!", { icon: "✍️" });
      }
    }
  }, [setRecording, setTranscript, setEnhanced, enhanceMode, enhanceLevel, language, addToHistory, translateText]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  // F2 shortcut (desktop only)
  useEffect(() => {
    function handleF2(e: KeyboardEvent) {
      if (e.key !== "F2") return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
      e.preventDefault();
      toggleRecording();
    }
    window.addEventListener("keydown", handleF2);
    return () => window.removeEventListener("keydown", handleF2);
  }, [toggleRecording]);

  const copyLeft = async () => {
    if (!transcript) return;
    await navigator.clipboard.writeText(transcript).catch(() => {});
    setCopiedLeft(true);
    toast.success("Copied!");
    setTimeout(() => setCopiedLeft(false), 2000);
  };

  const copyRight = async () => {
    const text = translatedResult || enhanced;
    if (!text) return;
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopiedRight(true);
    toast.success("Copied!");
    setTimeout(() => setCopiedRight(false), 2000);
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

  // Build unique translate-to language list (deduplicated by gtrans code)
  const GTRANS: Record<string, string> = {
    "en-US": "en", "en-GB": "en", "ur-PK": "ur", "ar-SA": "ar", "ar-AE": "ar",
    "hi-IN": "hi", "es-ES": "es", "es-MX": "es", "fr-FR": "fr", "de-DE": "de",
    "zh-CN": "zh-CN", "zh-TW": "zh-TW", "ja-JP": "ja", "ko-KR": "ko",
    "ru-RU": "ru", "pt-BR": "pt", "it-IT": "it", "tr-TR": "tr", "fa-IR": "fa",
    "bn-BD": "bn", "pa-IN": "pa", "ms-MY": "ms", "id-ID": "id", "nl-NL": "nl",
  };
  const seenGt = new Set<string>();
  const translateLangs = LANGUAGES.filter((lang) => {
    const gt = GTRANS[lang.code];
    if (!gt || seenGt.has(gt)) return false;
    seenGt.add(gt);
    return true;
  });

  const rightPanelLang = translateTo !== "none"
    ? translateLangs.find((l) => GTRANS[l.code] === translateTo)
    : undefined;
  const rightPanelText = translateTo !== "none" ? translatedResult : (enhanced || transcript);

  // ── Compact floating widget ──────────────────────────────────
  if (compact) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="rounded-3xl p-4 flex items-center gap-3 shadow-xl"
          style={{ background: "#f5f6e4", border: "1.5px solid rgba(0,0,0,0.12)" }}>
          <motion.button onClick={toggleRecording} whileTap={{ scale: 0.9 }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isRecording ? "bg-red-500" : "bg-[#7c6fcd]"
            }`}>
            {isRecording ? <MicOff size={22} className="text-white" /> : <Mic size={22} className="text-white" />}
          </motion.button>
          <button onClick={() => setCompact(false)} className="text-black/30 hover:text-black p-1">
            <X size={16} />
          </button>
        </div>
        {!isMobile && <p className="text-center text-xs text-black/30 mt-1.5">F2 to toggle</p>}
      </div>
    );
  }

  // ── Full UI — creamy light theme ─────────────────────────────
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col overflow-hidden" style={{ background: "#f5f6e4" }}>

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-3.5 flex-shrink-0"
        style={{ background: "rgba(245,246,228,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="transition-opacity hover:opacity-60 p-1 -ml-1">
            <ArrowLeft size={16} className="text-black/50" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#7c6fcd] flex items-center justify-center flex-shrink-0">
              <Mic size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-black/80 tracking-tight hidden xs:block">VoiceFlow</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              showHistory ? "bg-[#7c6fcd]/15 text-[#7c6fcd]" : "text-black/40 hover:text-black hover:bg-black/5"
            }`}
            style={{ border: "1.5px solid", borderColor: showHistory ? "rgba(124,111,205,0.3)" : "rgba(0,0,0,0.1)" }}>
            <Clock size={12} />
            {history.length > 0 && <span className="text-[10px]">{history.length}</span>}
          </button>
          <button onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${showSettings ? "bg-black/8 text-black" : "text-black/40 hover:text-black hover:bg-black/5"}`}>
            <Settings size={14} />
          </button>
          {!isMobile && (
            <button onClick={() => setCompact(true)}
              className="p-2 rounded-full text-black/30 hover:text-black hover:bg-black/5 transition-colors">
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
            className="relative z-10 overflow-hidden flex-shrink-0"
            style={{ background: "#eeefd8", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="px-5 py-4 space-y-4">
              <ModeSelector mode={enhanceMode} onChange={setEnhanceMode} />
              <EnhancementSlider value={enhanceLevel} onChange={setEnhanceLevel} />
              {!isMobile && (
                <p className="text-xs text-black/35 flex items-center gap-1.5">
                  <Keyboard size={11} />
                  Press <kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.12)" }}>F2</kbd> to toggle recording
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden relative z-10 min-h-0">
        <main className="flex-1 flex flex-col items-center px-4 py-5 overflow-y-auto">

          {/* ── Two-column language selectors — equal width ── */}
          <div className="w-full max-w-3xl grid grid-cols-2 gap-4 mb-6" style={{ gridTemplateColumns: "1fr 1fr" }}>

            {/* Left — Speak In */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <p className="text-[11px] font-bold text-black/40 uppercase tracking-widest">Speak In</p>
                <span className="text-[10px] font-medium text-[#7c6fcd]">{isLang.flag} {isLang.nativeName}</span>
              </div>
              <div className="flex-1 rounded-2xl p-2.5 grid grid-cols-3 sm:grid-cols-4 gap-1.5"
                style={{ background: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(0,0,0,0.09)" }}>
                {LANGUAGES.map((lang) => (
                  <button key={lang.code}
                    onPointerDown={() => {
                      setLanguage(lang.code);
                      if (isRecording) stopRecording();
                      toast.success(`${lang.flag} ${lang.nativeName}`, { duration: 900 });
                    }}
                    disabled={isRecording}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 touch-manipulation"
                    style={{
                      background: language === lang.code ? "rgba(124,111,205,0.12)" : "transparent",
                      border: language === lang.code ? "1.5px solid rgba(124,111,205,0.45)" : "1.5px solid transparent",
                      WebkitTapHighlightColor: "transparent",
                    }}>
                    <span className="text-lg sm:text-xl leading-none">{lang.flag}</span>
                    <span
                      className="text-[8px] sm:text-[9px] leading-tight text-center w-full truncate font-medium"
                      style={{ color: language === lang.code ? "#7c6fcd" : "rgba(0,0,0,0.4)" }}
                      dir={lang.rtl ? "rtl" : "ltr"}>
                      {lang.nativeName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Translate To */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <p className="text-[11px] font-bold text-black/40 uppercase tracking-widest">Translate To</p>
                <span className="text-[10px] font-medium text-emerald-600">
                  {translateTo === "none" ? "Off" : `${rightPanelLang?.flag ?? ""} ${rightPanelLang?.nativeName ?? ""}`}
                </span>
              </div>
              <div className="flex-1 rounded-2xl p-2.5 grid grid-cols-3 sm:grid-cols-4 gap-1.5"
                style={{ background: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(0,0,0,0.09)" }}>
                {/* None */}
                <button
                  onPointerDown={() => setTranslateTo("none")}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 touch-manipulation"
                  style={{
                    background: translateTo === "none" ? "rgba(0,0,0,0.06)" : "transparent",
                    border: translateTo === "none" ? "1.5px solid rgba(0,0,0,0.18)" : "1.5px solid transparent",
                    WebkitTapHighlightColor: "transparent",
                  }}>
                  <span className="text-lg sm:text-xl leading-none">🚫</span>
                  <span className="text-[8px] sm:text-[9px] font-medium"
                    style={{ color: translateTo === "none" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)" }}>None</span>
                </button>
                {translateLangs.map((lang) => {
                  const gt = GTRANS[lang.code];
                  const sel = translateTo === gt;
                  return (
                    <button key={lang.code}
                      onPointerDown={() => setTranslateTo(gt)}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 touch-manipulation"
                      style={{
                        background: sel ? "rgba(5,150,105,0.1)" : "transparent",
                        border: sel ? "1.5px solid rgba(5,150,105,0.35)" : "1.5px solid transparent",
                        WebkitTapHighlightColor: "transparent",
                      }}>
                      <span className="text-lg sm:text-xl leading-none">{lang.flag}</span>
                      <span
                        className="text-[8px] sm:text-[9px] leading-tight text-center w-full truncate font-medium"
                        style={{ color: sel ? "#059669" : "rgba(0,0,0,0.4)" }}
                        dir={lang.rtl ? "rtl" : "ltr"}>
                        {lang.nativeName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Mic button + status ── */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative flex items-center justify-center mb-3">
              {isRecording && [1, 2, 3].map((i) => (
                <motion.div key={i} className="absolute rounded-full"
                  animate={{ scale: [1, 1.9 + i * 0.3], opacity: [0.25, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                  style={{ width: 76, height: 76, border: "1.5px solid rgba(239,68,68,0.4)" }} />
              ))}
              <motion.button onClick={toggleRecording}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                animate={isRecording
                  ? { boxShadow: ["0 4px 24px rgba(239,68,68,0.25)", "0 4px 40px rgba(239,68,68,0.45)", "0 4px 24px rgba(239,68,68,0.25)"] }
                  : { boxShadow: ["0 4px 24px rgba(124,111,205,0.2)", "0 4px 40px rgba(124,111,205,0.38)", "0 4px 24px rgba(124,111,205,0.2)"] }
                }
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-20 h-20 rounded-full flex items-center justify-center touch-manipulation transition-colors duration-300"
                style={{
                  background: isRecording ? "#ef4444" : "#7c6fcd",
                  WebkitTapHighlightColor: "transparent",
                }}>
                <AnimatePresence mode="wait">
                  {isRecording
                    ? <motion.div key="stop" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}><MicOff size={28} className="text-white" /></motion.div>
                    : <motion.div key="start" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}><Mic size={28} className="text-white" /></motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </div>

            <div className="flex items-center gap-2 h-5">
              {isRecording ? (
                <motion.span className="flex items-center gap-2"
                  animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-black/50">Listening · tap to stop</span>
                </motion.span>
              ) : isEnhancing ? (
                <span className="flex items-center gap-2 text-xs font-medium" style={{ color: "#7c6fcd" }}>
                  <Loader2 size={12} className="animate-spin flex-shrink-0" />
                  Enhancing with AI...
                </span>
              ) : (
                <span className="text-xs text-black/30 font-medium">
                  {isMobile ? "Tap mic to start" : "Click mic or press F2"}
                </span>
              )}
            </div>

            {isRecording && (
              <div className="mt-2 w-40 h-7">
                <RealWaveform stream={audioStream} isActive={isRecording} bars={24} />
              </div>
            )}
          </div>

          {/* ── Two output text panels — equal width ── */}
          <div className="w-full max-w-3xl grid grid-cols-2 gap-4 mb-4" style={{ gridTemplateColumns: "1fr 1fr" }}>

            {/* Left — Original */}
            <div className="flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: isRecording ? "1.5px solid rgba(124,111,205,0.4)" : "1.5px solid rgba(0,0,0,0.09)",
              }}>
              <div className="flex items-center justify-between px-4 pt-3 pb-2.5"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-base">{isLang.flag}</span>
                  <span className="text-[11px] font-bold text-black/50 uppercase tracking-wide truncate max-w-[80px]">{isLang.nativeName}</span>
                </div>
                <span className="text-[10px] text-black/25 font-medium">Original</span>
              </div>
              <div className="flex-1 px-4 py-3 min-h-[110px]">
                {isRecording ? (
                  <p className="text-sm leading-relaxed text-black/70"
                    dir={isLang.rtl ? "rtl" : "ltr"}
                    style={{ fontFamily: isLang.rtl ? "'Noto Naskh Arabic', sans-serif" : undefined }}>
                    {liveText}
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-0.5 h-3.5 ml-0.5 align-middle rounded-full"
                      style={{ background: "#7c6fcd" }} />
                  </p>
                ) : transcript ? (
                  <p className="text-sm leading-relaxed text-black/75"
                    dir={isLang.rtl ? "rtl" : "ltr"}
                    style={{ fontFamily: isLang.rtl ? "'Noto Naskh Arabic', sans-serif" : undefined }}>
                    {transcript}
                  </p>
                ) : (
                  <p className="text-xs text-black/25 italic">Your speech appears here...</p>
                )}
              </div>
              {transcript && !isRecording && (
                <div className="px-4 pb-3.5 pt-2 flex items-center gap-2"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <button onClick={copyLeft}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 touch-manipulation"
                    style={{
                      background: copiedLeft ? "rgba(5,150,105,0.1)" : "rgba(124,111,205,0.12)",
                      border: copiedLeft ? "1.5px solid rgba(5,150,105,0.3)" : "1.5px solid rgba(124,111,205,0.3)",
                      color: copiedLeft ? "#059669" : "#7c6fcd",
                    }}>
                    {copiedLeft ? <Check size={11} /> : <Copy size={11} />}
                    {copiedLeft ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={clearCurrent}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors touch-manipulation text-black/30 hover:text-red-500"
                    style={{ background: "rgba(0,0,0,0.04)", border: "1.5px solid rgba(0,0,0,0.09)" }}>
                    <Trash2 size={11} /> Clear
                  </button>
                </div>
              )}
            </div>

            {/* Right — Translation / Enhanced */}
            <div className="flex flex-col rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(0,0,0,0.09)" }}>
              <div className="flex items-center justify-between px-4 pt-3 pb-2.5"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <div className="flex items-center gap-2">
                  {translateTo !== "none" && rightPanelLang ? (
                    <>
                      <span className="text-base">{rightPanelLang.flag}</span>
                      <span className="text-[11px] font-bold uppercase tracking-wide truncate max-w-[80px]" style={{ color: "#059669" }}>{rightPanelLang.nativeName}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} style={{ color: "#7c6fcd" }} />
                      <span className="text-[11px] font-bold text-black/50 uppercase tracking-wide">Enhanced</span>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-black/25 font-medium">
                  {translateTo !== "none" ? "Translation" : "AI Output"}
                </span>
              </div>
              <div className="flex-1 px-4 py-3 min-h-[110px]">
                {isEnhancing ? (
                  <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "#7c6fcd" }}>
                    <Loader2 size={12} className="animate-spin" /> Processing...
                  </div>
                ) : rightPanelText ? (
                  <p className="text-sm leading-relaxed text-black/75"
                    dir={rightPanelLang?.rtl ? "rtl" : "ltr"}
                    style={{ fontFamily: rightPanelLang?.rtl ? "'Noto Naskh Arabic', sans-serif" : undefined }}>
                    {rightPanelText}
                  </p>
                ) : (
                  <p className="text-xs text-black/25 italic">
                    {translateTo !== "none" ? "Translation appears here..." : "Enhanced text appears here..."}
                  </p>
                )}
              </div>
              {rightPanelText && !isRecording && !isEnhancing && (
                <div className="px-4 pb-3.5 pt-2 flex items-center gap-2"
                  style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <button onClick={copyRight}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 touch-manipulation"
                    style={{
                      background: copiedRight ? "rgba(5,150,105,0.15)" : "rgba(5,150,105,0.1)",
                      border: copiedRight ? "1.5px solid rgba(5,150,105,0.4)" : "1.5px solid rgba(5,150,105,0.25)",
                      color: "#059669",
                    }}>
                    {copiedRight ? <Check size={11} /> : <Copy size={11} />}
                    {copiedRight ? "Copied!" : "Copy"}
                  </button>
                  {transcript && (
                    <button onClick={handleReEnhance} disabled={isEnhancing}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-40 touch-manipulation text-black/35 hover:text-black/60"
                      style={{ background: "rgba(0,0,0,0.04)", border: "1.5px solid rgba(0,0,0,0.09)" }}>
                      <Wand2 size={11} /> Enhance
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="h-16 flex-shrink-0" />
        </main>

        <AnimatePresence>
          {showHistory && (
            <HistoryPanel history={history} onClose={() => setShowHistory(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* Floating F2 badge — desktop only */}
      {!isMobile && (
        <motion.button onClick={toggleRecording}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full select-none"
          style={{
            background: isRecording ? "rgba(239,68,68,0.1)" : "rgba(124,111,205,0.12)",
            border: isRecording ? "1.5px solid rgba(239,68,68,0.3)" : "1.5px solid rgba(124,111,205,0.3)",
            backdropFilter: "blur(12px)",
          }}>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isRecording ? "bg-red-500 animate-pulse" : ""}`}
            style={{ background: isRecording ? undefined : "#7c6fcd" }} />
          <span className="text-xs font-semibold" style={{ color: isRecording ? "#ef4444" : "#7c6fcd" }}>
            {isRecording ? "Recording..." : "Press"}
          </span>
          {!isRecording && (
            <kbd className="text-xs font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(124,111,205,0.15)", color: "#7c6fcd", border: "1px solid rgba(124,111,205,0.25)" }}>
              F2
            </kbd>
          )}
        </motion.button>
      )}
    </div>
  );
}
