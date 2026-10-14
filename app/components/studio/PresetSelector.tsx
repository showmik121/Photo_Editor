"use client";

import React, { useState } from "react";
import { Palette, Sliders, Sparkles, Layers, ChevronRight, Check } from "lucide-react";
import { Language } from "../../data/locales";
import { STUDIO_PRESETS, StudioPreset } from "../../data/studioPresets";

export type PresetCategoryKey = "all" | "modern" | "fashion" | "festive" | "catalog";

export interface PresetCategoryConfig {
  key: PresetCategoryKey;
  labelBn: string;
  labelEn: string;
}

export const CATEGORIES: PresetCategoryConfig[] = [
  { key: "all", labelBn: "সব", labelEn: "All" },
  { key: "modern", labelBn: "মডার্ন", labelEn: "Modern" },
  { key: "fashion", labelBn: "ফ্যাশন", labelEn: "Fashion" },
  { key: "festive", labelBn: "উৎসব", labelEn: "Festive" },
  { key: "catalog", labelBn: "ক্যাটালগ", labelEn: "Catalog" },
];

export const PRESET_CATEGORIES: Record<string, PresetCategoryKey> = {
  // New Commercial Campaigns (Reference Styles)
  "illiyeen-desert-aw26": "fashion",
  "rawstitch-drop-shoulder": "fashion",
  "rawstitch-ceramic-flatlay": "fashion",
  "apex-festive-alpona": "festive",
  "illiyeen-luxury-courtyard": "fashion",
  // Modern
  "modern-gradient": "modern",
  "clean-ecommerce": "modern",
  "linen-minimal": "modern",
  "fashion-editorial": "modern",
  "social-media-bold": "modern",
  // Fashion
  "ilyn-concrete": "fashion",
  "sailor-plaster": "fashion",
  "apex-brush": "fashion",
  "streetwear-flatlay": "fashion",
  "wooden-hanger": "fashion",
  "window-shadow": "fashion",
  // Festive
  "eid-festive": "festive",
  "deshi-boutique": "festive",
  "desert-arch": "festive",
  // Catalog
  "daraz-white": "catalog",
  "luxury-minimalist": "catalog",
};

interface PresetSelectorProps {
  selectedPreset: StudioPreset;
  onSelect: (preset: StudioPreset) => void;
  lightingIntensity: number;
  onLightingChange: (intensity: number) => void;
  showPedestal: boolean;
  onPedestalToggle: (show: boolean) => void;
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
  const [activeCategory, setActiveCategory] = useState<PresetCategoryKey>("all");

  const getPresetIcon = (id: string) => {
    switch (id) {
      case "illiyeen-desert-aw26":
        return "🏜️";
      case "rawstitch-drop-shoulder":
        return "👕";
      case "rawstitch-ceramic-flatlay":
        return "🧱";
      case "apex-festive-alpona":
        return "🪷";
      case "illiyeen-luxury-courtyard":
        return "🏛️";
      case "modern-gradient":
        return "🎨";
      case "clean-ecommerce":
        return "🛒";
      case "linen-minimal":
        return "🌿";
      case "fashion-editorial":
        return "📸";
      case "social-media-bold":
        return "🔥";
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
      case "ilyn-concrete":
        return "🏢";
      case "sailor-plaster":
        return "🏛️";
      case "apex-brush":
        return "🖌️";
      default:
        return "✨";
    }
  };

  const getCategoryBadgeLabel = (id: string) => {
    const cat = PRESET_CATEGORIES[id] || "modern";
    switch (cat) {
      case "modern":
        return lang === "bn" ? "মডার্ন" : "Modern";
      case "fashion":
        return lang === "bn" ? "ফ্যাশন" : "Fashion";
      case "festive":
        return lang === "bn" ? "উৎসব" : "Festive";
      case "catalog":
        return lang === "bn" ? "ক্যাটালগ" : "Catalog";
      default:
        return lang === "bn" ? "স্টুডিও" : "Studio";
    }
  };

  const filteredPresets = STUDIO_PRESETS.filter((preset) => {
    if (activeCategory === "all") return true;
    return PRESET_CATEGORIES[preset.id] === activeCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header with Title and Preset Count */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === "bn" ? "মডার্ন থিম প্রিসেট (১-ক্লিকে সেট করুন)" : "Modern Studio Themes"}</span>
        </label>
        <span className="text-[10px] text-amber-700 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          {filteredPresets.length} {lang === "bn" ? "টি থিম" : "Themes"}
        </span>
      </div>

      {/* 1. Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-amber-400 text-stone-950 font-bold shadow-xs border border-amber-400 ring-2 ring-amber-400/20"
                  : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              {lang === "bn" ? cat.labelBn : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* 2. Presets 2-Column Grid on Desktop, 1-Column on Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredPresets.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          const categoryBadge = getCategoryBadgeLabel(preset.id);

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset)}
              className={`w-full text-left rounded-xl border overflow-hidden transition-all duration-200 card-hover cursor-pointer group flex flex-col ${
                isSelected
                  ? "bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/40 shadow-xs"
                  : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/40 shadow-2xs"
              }`}
            >
              {/* Mini-Preview Swatch (h-16 rounded-t-xl) */}
              <div
                className={`h-16 w-full rounded-t-xl bg-gradient-to-br ${preset.bgGradient} relative flex items-center justify-center overflow-hidden border-b border-stone-100/90`}
              >
                {/* Center Icon */}
                <span className="text-xl drop-shadow-sm select-none transform group-hover:scale-110 transition-transform duration-200">
                  {getPresetIcon(preset.id)}
                </span>

                {/* Category Tag Badge */}
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/90 text-stone-800 backdrop-blur-xs border border-white/60 shadow-2xs">
                    {categoryBadge}
                  </span>
                </div>

                {/* Active Checkmark Icon */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-xs ring-2 ring-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Preset Details */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs font-bold leading-tight truncate ${
                        isSelected ? "text-amber-950" : "text-stone-900"
                      }`}
                    >
                      {lang === "bn" ? preset.nameBn : preset.nameEn}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 shrink-0">
                        {lang === "bn" ? "অ্যাক্টিভ" : "Active"}
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-stone-500 line-clamp-1 leading-snug">
                    {lang === "bn" ? preset.taglineBn : preset.taglineEn}
                  </p>
                </div>

                {preset.badgeTagBn && (
                  <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[9px] text-stone-500">
                    <span className="font-medium text-stone-600 truncate">{preset.badgeTagBn}</span>
                    <span className="font-mono text-stone-400 text-[8px] uppercase">
                      {preset.lightingTone.replace("-", " ")}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Shortcut to Deep Card Studio */}
      {onOpenCardCustomizer && (
        <button
          type="button"
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
                {lang === "bn"
                  ? "ব্যাকগ্রাউন্ড কালার, গ্রেডিয়েন্ট, বর্ডার, টাইলস ও শ্যাডো এডিট করুন"
                  : "Tweak colors, gradients, borders, shadows & brand logo"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* 4. Lighting & Pedestal Fine-Tuning */}
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
