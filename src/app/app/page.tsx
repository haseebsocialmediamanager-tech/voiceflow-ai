"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Copy, Trash2, Settings, Clock, RotateCcw,
  Check, Loader2, ArrowLeft, ChevronDown, Keyboard, Clipboard,
  Sparkles, X,
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
import { getLang } from "@/lib/languages";
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
  const [liveText, setLiveText] = useState(""); // interim live text
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [compact, setCompact] = useState(false);
  const [injectionMode, setInjectionMode] = useState<"clipboard" | "inject">("clipboard");
  const [showShortcutHint, setShowShortcutHint] = useState(true);

  const recognitionRef = useRef<any>(null);
  const accumulatedRef = useRef<string>("");
  const streamRef = useRef<MediaStream | null>(null);
  const isLang = getLang(language);

  // Init speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (final) accumulatedRef.current += final + " ";
      setLiveText(accumulatedRef.current + interim);
      setTranscript(accumulatedRef.current + interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone.");
      } else if (event.error !== "no-speech") {
        toast.error(`Error: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;
  }, [language, setTranscript]);

  const startRecording = useCallback(async () => {
    if (!recognitionRef.current) {
      toast.error("Use Chrome or Edge — speech recognition not supported here.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setAudioStream(stream);
    } catch {
      toast.error("Microphone access denied.");
      return;
    }
    accumulatedRef.current = "";
    setLiveText("");
    setTranscript("");
    setEnhanced("");
    recognitionRef.current.start();
    setRecording(true);
    setShowShortcutHint(false);
  }, [setRecording, setTranscript, setEnhanced]);

  const stopRecording = useCallback(async () => {
    recognitionRef.current?.stop();
    setRecording(false);

    // Stop microphone stream
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setAudioStream(null);

    const text = accumulatedRef.current.trim();
    if (!text) return;

    setTranscript(text);
    setLiveText("");

    // Auto-enhance
    if (enhanceLevel > 0 && enhanceMode !== "raw") {
      setIsEnhancing(true);
      try {
        const result = await enhanceText(text, enhanceMode, enhanceLevel, language);
        setEnhanced(result);
        setActiveTab("enhanced");

        // Inject or copy
        const mode = injectTextAtCursor(result);
        if (mode === "injected") {
          toast.success("Text injected at cursor!", { icon: "✍️" });
        } else {
          await navigator.clipboard.writeText(result).catch(() => {});
          toast.success(
            "Enhanced & copied! Press Ctrl+V to paste anywhere",
            { icon: "📋", duration: 4000 }
          );
        }
        addToHistory({
          id: crypto.randomUUID(), transcript: text, enhanced: result,
          mode: enhanceMode, language, createdAt: new Date().toISOString(),
        });
      } catch {
        setEnhanced(text);
        await navigator.clipboard.writeText(text).catch(() => {});
        toast.success("Copied! Press Ctrl+V to paste", { duration: 3000 });
      } finally {
        setIsEnhancing(false);
      }
    } else {
      setEnhanced(text);
      const mode = injectTextAtCursor(text);
      if (mode === "clipboard") {
        await navigator.clipboard.writeText(text).catch(() => {});
        toast.success("Copied! Press Ctrl+V to paste anywhere", { icon: "📋", duration: 4000 });
      } else {
        toast.success("Text injected!", { icon: "✍️" });
      }
    }
  }, [setRecording, setTranscript, setEnhanced, enhanceMode, enhanceLevel, language, addToHistory]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  // "ss" shortcut
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
      toast.success("Re-enhanced!");
    } catch {
      toast.error("Enhancement failed");
    } finally {
      setIsEnhancing(false);
    }
  };

  const activeText = activeTab === "enhanced" ? enhanced : transcript;
  const displayText = isRecording ? liveText : activeText;

  // ─── Compact floating widget ────────────────────────────────────
  if (compact) {
    return (
      <div className="fixed inset-0 bg-transparent pointer-events-none z-50 flex items-end justify-end p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="pointer-events-auto"
        >
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
              <div className="flex items-center gap-0.5 px-2">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 rounded-full bg-brand-400"
                    animate={{ height: [4, 8 + Math.random() * 16, 4] }}
                    transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => setCompact(false)}
              className="text-white/30 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-center text-xs text-white/30 mt-2">Press SS to toggle</p>
        </motion.div>
      </div>
    );
  }

  // ─── Full UI ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: isRecording ? 0.15 : 0.06 }}
          transition={{ duration: 1 }}
          className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }}
        />
        <motion.div
          animate={{ opacity: isRecording ? 0.1 : 0.04 }}
          transition={{ duration: 1 }}
          className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
        />
      </div>

      {/* ── Top bar ── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]"
        style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/30 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Mic size={12} />
            </div>
            <span className="text-sm font-semibold tracking-tight">VoiceFlow</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSelector value={language} onChange={setLanguage} />

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
              showHistory ? "bg-brand-600/30 text-brand-300" : "text-white/35 hover:text-white hover:bg-white/5"
            }`}
          >
            <Clock size={13} />
            <span className="hidden sm:inline">History</span>
            {history.length > 0 && (
              <span className="text-[10px] bg-brand-500/30 text-brand-300 px-1.5 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${showSettings ? "bg-white/10 text-white" : "text-white/35 hover:text-white hover:bg-white/5"}`}
          >
            <Settings size={14} />
          </button>

          <button
            onClick={() => setCompact(true)}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors"
            title="Minimize to floating widget"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      {/* ── Settings drawer ── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-10 overflow-hidden border-b border-white/[0.05]"
            style={{ background: "rgba(16,16,25,0.95)" }}
          >
            <div className="px-5 py-4 max-w-2xl mx-auto space-y-4">
              <ModeSelector mode={enhanceMode} onChange={setEnhanceMode} />
              <EnhancementSlider value={enhanceLevel} onChange={setEnhanceLevel} />
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1.5">
                  <Keyboard size={11} />
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono text-[10px]">S S</kbd> anywhere to toggle
                </span>
                <span className="flex items-center gap-1.5">
                  <Clipboard size={11} />
                  Auto-copies on stop · paste with Ctrl+V
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden relative z-10">

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-0">

          {/* "ss" hint */}
          <AnimatePresence>
            {showShortcutHint && !isRecording && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-xs text-white/25 mb-8"
              >
                <Keyboard size={12} />
                Press <kbd className="px-1.5 py-0.5 mx-0.5 rounded bg-white/8 text-white/40 font-mono">S</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/40 font-mono">S</kbd>
                to start · works on any tab
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Center: Mic button ── */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Pulse rings when recording */}
            {isRecording && (
              <>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-brand-500/30"
                    animate={{ scale: [1, 1.8 + i * 0.3], opacity: [0.4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                    style={{ width: 96, height: 96 }}
                  />
                ))}
              </>
            )}

            <motion.button
              onClick={toggleRecording}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              animate={
                isRecording
                  ? { boxShadow: ["0 0 40px rgba(239,68,68,0.4)", "0 0 70px rgba(239,68,68,0.7)", "0 0 40px rgba(239,68,68,0.4)"] }
                  : { boxShadow: ["0 0 30px rgba(99,102,241,0.3)", "0 0 50px rgba(99,102,241,0.5)", "0 0 30px rgba(99,102,241,0.3)"] }
              }
              transition={{ duration: 2, repeat: Infinity }}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isRecording ? "bg-red-500" : "bg-brand-600 hover:bg-brand-500"
              }`}
            >
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div key="stop"
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <MicOff size={32} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="start"
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    <Mic size={32} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Status */}
          <motion.div
            className="text-sm mb-6 flex items-center gap-2 h-6"
            animate={{ opacity: 1 }}
          >
            {isRecording ? (
              <motion.span
                className="flex items-center gap-2 text-white/60"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Listening in {isLang.nativeName}... press SS or click to stop
              </motion.span>
            ) : isEnhancing ? (
              <span className="flex items-center gap-2 text-brand-400">
                <Loader2 size={13} className="animate-spin" />
                Enhancing with AI...
              </span>
            ) : (
              <span className="text-white/25">
                Click mic or press <span className="text-white/40 font-mono">SS</span> to start
              </span>
            )}
          </motion.div>

          {/* Real waveform */}
          <div className="mb-8 w-full max-w-sm h-14 flex items-center justify-center">
            <RealWaveform stream={audioStream} isActive={isRecording} bars={44} />
          </div>

          {/* ── Live / result text panel ── */}
          <AnimatePresence mode="wait">
            {(isRecording && liveText) || (!isRecording && (transcript || enhanced)) ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                className="w-full max-w-xl"
              >
                {/* Tabs — only when not recording */}
                {!isRecording && enhanced && (
                  <div className="flex items-center gap-1 mb-3 p-1 rounded-xl w-fit"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <button
                      onClick={() => setActiveTab("enhanced")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === "enhanced" ? "bg-brand-600 text-white" : "text-white/35 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={11} /> Enhanced
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("raw")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === "raw" ? "bg-white/10 text-white" : "text-white/35 hover:text-white"
                      }`}
                    >
                      Raw
                    </button>
                  </div>
                )}

                {/* Text box */}
                <div
                  className="rounded-2xl p-5 relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: isRecording ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isRecording ? "0 0 30px rgba(99,102,241,0.08)" : "none",
                  }}
                >
                  {isEnhancing ? (
                    <div className="flex items-center gap-3 text-white/35 py-3">
                      <Loader2 size={16} className="animate-spin text-brand-400" />
                      <span className="text-sm">AI is polishing your text...</span>
                    </div>
                  ) : (
                    <>
                      <p
                        className="text-white/80 text-sm leading-relaxed min-h-[60px] whitespace-pre-wrap"
                        dir={isLang.rtl ? "rtl" : "ltr"}
                      >
                        {isRecording ? (
                          <>
                            {liveText}
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="inline-block w-0.5 h-4 bg-brand-400 ml-0.5 align-middle"
                            />
                          </>
                        ) : (
                          displayText || <span className="text-white/20 italic">Your text will appear here...</span>
                        )}
                      </p>
                      {/* Mode badge */}
                      {!isRecording && activeText && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                          <span className="text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full capitalize">
                            {enhanceMode} mode
                          </span>
                          <span className="text-[10px] text-white/20">{isLang.flag} {isLang.nativeName}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Action row */}
                {!isRecording && activeText && !isEnhancing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mt-3"
                  >
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-medium transition-colors"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>

                    <button
                      onClick={handleReEnhance}
                      disabled={!transcript}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-white/45 hover:text-white transition-colors disabled:opacity-30"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <RotateCcw size={12} />
                      Re-enhance
                    </button>

                    <button
                      onClick={clearCurrent}
                      className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-white/30 hover:text-red-400 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <Trash2 size={12} />
                      Clear
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center max-w-xs"
              >
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[
                    { emoji: "📧", label: "Email drafts" },
                    { emoji: "💬", label: "Slack messages" },
                    { emoji: "📝", label: "Docs & notes" },
                    { emoji: "💻", label: "Code comments" },
                  ].map((tip) => (
                    <div key={tip.label}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-white/30"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span>{tip.emoji}</span>
                      {tip.label}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/20 leading-relaxed">
                  Speak your text · AI enhances it · auto-copies to clipboard<br />
                  Paste anywhere with <kbd className="text-white/35 font-mono">Ctrl+V</kbd>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
