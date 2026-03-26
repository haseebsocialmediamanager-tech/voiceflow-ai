"use client";

import { motion } from "framer-motion";
import { Briefcase, MessageSquare, FileText, Mail, Hash, Code2, Mic } from "lucide-react";
import type { EnhanceMode } from "@/lib/store";

interface Props {
  mode: EnhanceMode;
  onChange: (mode: EnhanceMode) => void;
}

const MODES: { id: EnhanceMode; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { id: "professional", label: "Professional", icon: Briefcase, color: "text-brand-400" },
  { id: "casual", label: "Casual", icon: MessageSquare, color: "text-emerald-400" },
  { id: "formal", label: "Formal", icon: FileText, color: "text-purple-400" },
  { id: "email", label: "Email", icon: Mail, color: "text-blue-400" },
  { id: "slack", label: "Slack", icon: Hash, color: "text-amber-400" },
  { id: "code", label: "Dev Mode", icon: Code2, color: "text-cyan-400" },
  { id: "raw", label: "Raw", icon: Mic, color: "text-white/40" },
];

export function ModeSelector({ mode, onChange }: Props) {
  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <motion.button
              key={m.id}
              onClick={() => onChange(m.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white border border-white/15"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <Icon size={13} className={isActive ? m.color : "text-current"} />
              {m.label}
              {isActive && (
                <motion.div
                  layoutId="mode-indicator"
                  className="w-1.5 h-1.5 rounded-full bg-brand-400"
                  transition={{ type: "spring", bounce: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
