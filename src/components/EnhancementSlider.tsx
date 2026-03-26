"use client";

import { Sliders } from "lucide-react";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function EnhancementSlider({ value, onChange }: Props) {
  const label =
    value === 0
      ? "No enhancement"
      : value < 30
      ? "Light touch"
      : value < 60
      ? "Balanced"
      : value < 85
      ? "Strong polish"
      : "Full rewrite";

  const color =
    value === 0
      ? "text-white/30"
      : value < 60
      ? "text-emerald-400"
      : value < 85
      ? "text-brand-400"
      : "text-purple-400";

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <Sliders size={14} className="text-white/30" />
        <span className="text-xs text-white/30 w-24 shrink-0">AI Enhancement</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 appearance-none bg-white/10 rounded-full outline-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${value}%, rgba(255,255,255,0.1) ${value}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
      <span className={`text-xs font-medium w-24 text-right shrink-0 ${color}`}>
        {label}
      </span>
    </div>
  );
}
