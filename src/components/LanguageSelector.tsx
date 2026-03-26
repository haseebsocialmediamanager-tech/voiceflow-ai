"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Search } from "lucide-react";
import { LANGUAGES, getLang } from "@/lib/languages";

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export function LanguageSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const current = getLang(value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl glass hover:bg-white/5 text-sm transition-colors touch-manipulation"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <Globe size={13} className="text-brand-400 flex-shrink-0" />
        <span className="text-white/70 text-xs sm:text-sm">{current.flag}</span>
        <span className="hidden sm:inline text-white/70 text-xs">{current.nativeName}</span>
        <ChevronDown size={11} className={`text-white/30 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 shadow-2xl"
            style={{
              width: "min(260px, calc(100vw - 32px))",
              background: "rgba(18,18,28,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              backdropFilter: "blur(40px)",
            }}
          >
            <div className="p-2 border-b border-white/5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
                <Search size={12} className="text-white/30 flex-shrink-0" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none min-w-0"
                />
              </div>
            </div>
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { onChange(lang.code); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left touch-manipulation ${
                    lang.code === value ? "bg-brand-600/20 text-brand-300" : "text-white/70 hover:bg-white/5 active:bg-white/5"
                  }`}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <span className="text-base flex-shrink-0">{lang.flag}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-xs truncate">{lang.nativeName}</div>
                    <div className="text-white/30 text-xs truncate">{lang.name}</div>
                  </div>
                  {lang.rtl && (
                    <span className="ml-auto text-xs text-white/20 bg-white/5 px-1.5 py-0.5 rounded flex-shrink-0">RTL</span>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-4 text-xs text-white/30">No languages found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
