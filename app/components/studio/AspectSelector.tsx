"use client";

import React from "react";
import { Square, Smartphone } from "lucide-react";
import { Language } from "../../data/locales";

export type AspectRatio = "1:1" | "9:16";

interface AspectSelectorProps {
  aspect: AspectRatio;
  onChange: (aspect: AspectRatio) => void;
  lang: Language;
}

export function AspectSelector({ aspect, onChange, lang }: AspectSelectorProps) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl bg-stone-100 border border-stone-200">
      <button
        onClick={() => onChange("1:1")}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
          aspect === "1:1"
            ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
            : "text-stone-600 hover:text-stone-950 hover:bg-stone-200/50"
        }`}
        title="Facebook & Instagram Feed Square (1080x1080)"
      >
        <Square className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>1:1</span>
        <span className="hidden sm:inline">{lang === "bn" ? "ফিড স্কয়ার" : "Feed Square"}</span>
        <span className="hidden md:inline text-[10px] text-stone-400 font-mono">1080p</span>
      </button>

      <button
        onClick={() => onChange("9:16")}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
          aspect === "9:16"
            ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
            : "text-stone-600 hover:text-stone-950 hover:bg-stone-200/50"
        }`}
        title="Facebook & Instagram Story/Reel (1080x1920)"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>9:16</span>
        <span className="hidden sm:inline">{lang === "bn" ? "স্টোরি/রিল" : "Story/Reel"}</span>
        <span className="hidden md:inline text-[10px] text-stone-400 font-mono">1080p</span>
      </button>
    </div>
  );
}
