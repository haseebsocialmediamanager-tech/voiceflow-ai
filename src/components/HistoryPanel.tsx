"use client";

import { motion } from "framer-motion";
import { X, Copy, Clock } from "lucide-react";
import toast from "react-hot-toast";
import type { HistoryItem } from "@/lib/store";
import { useVoiceStore } from "@/lib/store";

interface Props {
  history: HistoryItem[];
  onClose: () => void;
}

export function HistoryPanel({ history, onClose }: Props) {
  const removeFromHistory = useVoiceStore((s) => s.removeFromHistory);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.aside
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 250 }}
      className="w-80 border-l border-white/5 flex flex-col overflow-hidden glass"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock size={14} className="text-brand-400" />
          History
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20 text-sm py-12">
            <Clock size={32} className="mb-3 opacity-30" />
            No history yet
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="glass rounded-xl p-3 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/30">{formatTime(item.createdAt)}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(item.enhanced)}
                      className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                    >
                      <Copy size={11} />
                    </button>
                    <button
                      onClick={() => removeFromHistory(item.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                  {item.enhanced}
                </p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/30">
                  {item.mode}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
