"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Search, X, Check } from "lucide-react";
import { LANGUAGES, getLang } from "@/lib/languages";

interface Props {
  value: string;
  onChange: (code: string) => void;
}

export function LanguageSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = getLang(value);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Close dropdown on outside click (desktop only)
  useEffect(() => {
    if (isMobile) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobile]);

  // Prevent body scroll when mobile sheet is open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, open]);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setSearch("");
  };

  const handleClose = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      {/* Trigger button */}
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

        {/* Desktop dropdown */}
        {!isMobile && (
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 shadow-2xl"
                style={{
                  width: "260px",
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
                      onPointerDown={(e) => { e.preventDefault(); handleSelect(lang.code); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left ${
                        lang.code === value ? "bg-brand-600/20 text-brand-300" : "text-white/70 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <div className="font-medium text-xs truncate">{lang.nativeName}</div>
                        <div className="text-white/30 text-xs truncate">{lang.name}</div>
                      </div>
                      {lang.code === value && <Check size={12} className="ml-auto text-brand-400 flex-shrink-0" />}
                      {lang.rtl && lang.code !== value && (
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
        )}
      </div>

      {/* Mobile: full-screen bottom sheet — completely separate from header, no overlap */}
      {isMobile && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] flex flex-col justify-end"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
              onClick={handleClose}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="relative flex flex-col"
                style={{
                  background: "#12121c",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "24px 24px 0 0",
                  maxHeight: "80vh",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-white/15" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                  <div>
                    <h3 className="font-bold text-base text-white">Choose Your Language</h3>
                    <p className="text-xs text-white/35 mt-0.5">Tap a language to start speaking in it</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <X size={15} className="text-white/60" />
                  </button>
                </div>

                {/* Search */}
                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Search size={14} className="text-white/30 flex-shrink-0" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search languages..."
                      className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-white/30">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Language list */}
                <div className="overflow-y-auto flex-1 px-3 pb-6">
                  {filtered.map((lang) => (
                    <button
                      key={lang.code}
                      onPointerDown={(e) => { e.stopPropagation(); handleSelect(lang.code); }}
                      className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl mb-1 text-left touch-manipulation active:scale-[0.98] transition-all ${
                        lang.code === value
                          ? "bg-brand-600/20 border border-brand-500/30"
                          : "border border-transparent active:bg-white/5"
                      }`}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold text-sm ${lang.code === value ? "text-brand-300" : "text-white/80"}`}
                          dir={lang.rtl ? "rtl" : "ltr"}
                          style={{ fontFamily: lang.rtl ? "'Noto Naskh Arabic', sans-serif" : undefined }}
                        >
                          {lang.nativeName}
                        </div>
                        <div className="text-xs text-white/35">{lang.name}</div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {lang.rtl && (
                          <span className="text-[10px] text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded-full">RTL</span>
                        )}
                        {lang.code === value && (
                          <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                            <Check size={11} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-center py-8 text-sm text-white/30">No languages found</div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
