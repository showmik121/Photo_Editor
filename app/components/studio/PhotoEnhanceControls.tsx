"use client";

import React from "react";
import { Sparkles, Sun, Contrast, Palette, Focus, RotateCcw } from "lucide-react";
import { Language } from "../../data/locales";

export interface PhotoEnhanceState {
  enabled: boolean;
  brightness: number; // 0.7 to 1.5 (default 1.0)
  contrast: number; // 0.7 to 1.5 (default 1.0)
  saturation: number; // 0.5 to 1.8 (default 1.0)
  sharpness: number; // 0 to 100 (default 0)
}

interface PhotoEnhanceControlsProps {
  enhance: PhotoEnhanceState;
  onChange: (enhance: PhotoEnhanceState) => void;
  lang: Language;
}

export function PhotoEnhanceControls({
  enhance,
  onChange,
  lang,
}: PhotoEnhanceControlsProps) {
  const update = (patch: Partial<PhotoEnhanceState>) => {
    onChange({ ...enhance, ...patch });
  };

  const handleMagicAutoEnhance = () => {
    // Studio-grade preset: +15% brightness, +20% contrast, +25% saturation, +50% sharpness
    onChange({
      enabled: true,
      brightness: 1.15,
      contrast: 1.2,
      saturation: 1.25,
      sharpness: 50,
    });
  };

  const handleReset = () => {
    onChange({
      enabled: false,
      brightness: 1.0,
      contrast: 1.0,
      saturation: 1.0,
      sharpness: 0,
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Magic Auto-Enhance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border border-amber-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">
                {lang === "bn" ? "ম্যাজিক অটো-এনহ্যান্স" : "Magic Auto-Enhance"}
              </div>
              <div className="text-[10px] text-stone-600">
                {lang === "bn"
                  ? "১-ক্লিকে ফোনের ডিম লাইটের ছবি স্পষ্ট ও ব্রাইট করুন"
                  : "1-Click instant clarity & lighting fix"}
              </div>
            </div>
          </div>

          <button
            onClick={handleMagicAutoEnhance}
            className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            {lang === "bn" ? "অটো ফিক্স" : "Auto Fix"}
          </button>
        </div>
      </div>

      {/* 2. Fine-Tuning Sliders */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5">
        {/* Brightness */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === "bn" ? "উজ্জ্বলতা (Brightness)" : "Brightness"}</span>
            </span>
            <span className="font-mono text-amber-600 font-semibold">
              {Math.round((enhance.brightness - 1.0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="70"
            max="150"
            value={Math.round(enhance.brightness * 100)}
            onChange={(e) =>
              update({
                enabled: true,
                brightness: parseInt(e.target.value, 10) / 100,
              })
            }
            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5 text-sky-600" />
              <span>{lang === "bn" ? "কনট্রাস্ট ও গভীরতা (Contrast)" : "Contrast"}</span>
            </span>
            <span className="font-mono text-sky-600 font-semibold">
              {Math.round((enhance.contrast - 1.0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="70"
            max="150"
            value={Math.round(enhance.contrast * 100)}
            onChange={(e) =>
              update({
                enabled: true,
                contrast: parseInt(e.target.value, 10) / 100,
              })
            }
            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
        </div>

        {/* Saturation / Vibrancy */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>{lang === "bn" ? "রঙের প্রাণবন্ততা (Vibrancy)" : "Color Vibrancy"}</span>
            </span>
            <span className="font-mono text-rose-600 font-semibold">
              {Math.round((enhance.saturation - 1.0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="180"
            value={Math.round(enhance.saturation * 100)}
            onChange={(e) =>
              update({
                enabled: true,
                saturation: parseInt(e.target.value, 10) / 100,
              })
            }
            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* Sharpness / Clarity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Focus className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === "bn" ? "শার্পনেস ও টেক্সচার (Sharpness)" : "Sharpness / Texture"}</span>
            </span>
            <span className="font-mono text-emerald-600 font-semibold">
              {enhance.sharpness}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={enhance.sharpness}
            onChange={(e) =>
              update({
                enabled: true,
                sharpness: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        {/* Reset button */}
        <div className="pt-2 border-t border-stone-100 flex justify-end">
          <button
            onClick={handleReset}
            className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === "bn" ? "আসল ছবিতে ফিরুন" : "Reset Enhancement"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
