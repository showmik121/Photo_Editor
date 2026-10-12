"use client";

import React from "react";
import { Palette, Sliders, Sparkles, Layers, ChevronRight } from "lucide-react";
import { Language } from "../../data/locales";
import { STUDIO_PRESETS, StudioPreset } from "../../data/studioPresets";

interface PresetSelectorProps {
  selectedPreset: StudioPreset;
  onSelect: (preset: StudioPreset) => void;
  lightingIntensity: number;
  onLightingChange: (val: number) => void;
  showPedestal: boolean;
  onPedestalToggle: (val: boolean) => void;
  onOpenCardCustomizer?: () => void;
  lang: Language;
}

export function PresetSelector({
  selectedPreset,
  onSelect,
  lightingIntensity,
  onLightingChange,
  showPedestal,
  onPedestalToggle,
  onOpenCardCustomizer,
  lang,
}: PresetSelectorProps) {
  const getPresetIcon = (id: string) => {
    switch (id) {
      case "streetwear-flatlay":
        return "🧱";
      case "desert-arch":
        return "🏜️";
      case "wooden-hanger":
        return "🪵";
      case "window-shadow":
        return "🪟";
      case "eid-festive":
        return "🌙";
      case "deshi-boutique":
        return "🌸";
      case "luxury-minimalist":
        return "🏛️";
      case "daraz-white":
        return "⚪";
      default:
        return "✨";
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "মডার্ন থিম প্রিসেট (১-ক্লিকে সেট করুন)" : "Modern Studio Themes"}</span>
          </label>
          <span className="text-[10px] text-amber-700 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {STUDIO_PRESETS.length} {lang === "bn" ? "টি ট্রেন্ডিং থিম" : "Themes"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {STUDIO_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;

            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset)}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-amber-50/80 border-amber-400 shadow-xs ring-2 ring-amber-400/20"
                    : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail Pill */}
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${preset.bgGradient} border border-white/60 shrink-0 shadow-xs flex items-center justify-center text-sm`}
                  >
                    {getPresetIcon(preset.id)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold truncate ${
                          isSelected ? "text-amber-900" : "text-stone-800"
                        }`}
                      >
                        {lang === "bn" ? preset.nameBn : preset.nameEn}
                      </span>
                      {preset.badgeTagBn && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                          {preset.badgeTagBn}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                      {lang === "bn" ? preset.taglineBn : preset.taglineEn}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 shrink-0 ml-2">
                    Active
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shortcut to Card Studio */}
      {onOpenCardCustomizer && (
        <button
          onClick={onOpenCardCustomizer}
          className="w-full p-3 rounded-2xl bg-amber-50/60 border border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-stone-800 flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/30 text-amber-900 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                {lang === "bn" ? "কার্ড উপাদান কাস্টমাইজ করুন" : "Deep Card Customizer"}
              </div>
              <div className="text-[10px] text-stone-500">
                {lang === "bn" ? "টাইলস, পাম শ্যাডো, হ্যাঙ্গার ও ব্র‍্যান্ড নাম এডিট করুন" : "Tweak tiles, shadows, props & brand logo"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Lighting & Pedestal Fine-Tuning */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "স্টুডিও লাইটিং তীব্রতা" : "Studio Key Lighting"}</span>
          </span>
          <span className="font-mono text-amber-700">{lightingIntensity}%</span>
        </div>

        <input
          type="range"
          min="20"
          max="150"
          value={lightingIntensity}
          onChange={(e) => onLightingChange(Number(e.target.value))}
          className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
        />

        {selectedPreset.pedestalType !== "none" && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-700 font-medium">
              {lang === "bn" ? "3D প্যাডেস্টাল স্ট্যান্ড শো করুন" : "Show 3D Podium Stand"}
            </span>
            <input
              type="checkbox"
              checked={showPedestal}
              onChange={(e) => onPedestalToggle(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
