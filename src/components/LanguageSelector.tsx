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
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass hover:bg-white/5 text-sm transition-colors"
      >
        <Globe size={14} className="text-brand-400" />
        <span className="text-white/70">
          {current.flag} {current.nativeName}
        </span>
        <ChevronDown
          size={12}
          className={`text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-2xl overflow-hidden z-50 shadow-2xl border border-white/10"
          >
            <div className="p-2 border-b border-white/5">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg">
                <Search size={12} className="text-white/30" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left ${
                    lang.code === value ? "bg-brand-600/20 text-brand-300" : "text-white/70"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <div className="font-medium text-xs">{lang.nativeName}</div>
                    <div className="text-white/30 text-xs">{lang.name}</div>
                  </div>
                  {lang.rtl && (
                    <span className="ml-auto text-xs text-white/20 bg-white/5 px-1.5 py-0.5 rounded">RTL</span>
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
