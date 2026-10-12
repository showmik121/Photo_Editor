"use client";

import React from "react";
import {
  Layers,
  Sparkles,
  Sun,
  Grid,
  Trees,
  Sliders,
  Type,
  BookOpen,
  Wheat,
  RotateCcw,
  Tag,
  Check,
} from "lucide-react";
import { Language } from "../../data/locales";
import {
  CustomCardState,
  SurfaceType,
  SurfaceColorTone,
} from "../../data/studioPresets";

interface CardCustomizerProps {
  cardState: CustomCardState;
  onChange: (state: CustomCardState) => void;
  onReset: () => void;
  lang: Language;
}

export function CardCustomizer({
  cardState,
  onChange,
  onReset,
  lang,
}: CardCustomizerProps) {
  const update = (patch: Partial<CustomCardState>) => {
    onChange({ ...cardState, ...patch });
  };

  const surfaces: { id: SurfaceType; nameBn: string; nameEn: string; icon: string }[] = [
    { id: "concrete-grey", nameBn: "আইলিন নিউট্রাল কংক্রিট", nameEn: "Neutral Grey Concrete", icon: "🏢" },
    { id: "warm-plaster", nameBn: "সেইলর সফট প্লাস্টার", nameEn: "Soft Warm Plaster", icon: "🏛️" },
    { id: "offwhite-brush", nameBn: "এপেক্স অফ-হোয়াইট ব্রাশ", nameEn: "Studio Off-White Brush", icon: "🖌️" },
    { id: "tiles", nameBn: "ক্যালিফোর্নিয়া টাইলস", nameEn: "Ceramic Tiles", icon: "🧱" },
    { id: "desert-arch", nameBn: "ইলিয়িন ডেজার্ট আর্চ", nameEn: "Desert Arch", icon: "🏜️" },
    { id: "wall-minimal", nameBn: "মিনিমাল প্লাস্টার ওয়াল", nameEn: "Studio Wall", icon: "🏢" },
    { id: "podium-marble", nameBn: "মার্বেল পোডিয়াম", nameEn: "Marble Podium", icon: "🏛️" },
    { id: "terracotta", nameBn: "দেশি পোড়ামাটি", nameEn: "Terracotta Clay", icon: "🏺" },
    { id: "studio-gradient", nameBn: "লাক্সারি গ্রেডিয়েন্ট", nameEn: "Studio Gradient", icon: "🎨" },
    { id: "clean-white", nameBn: "দারাজ হোয়াইট", nameEn: "Pure White", icon: "⚪" },
  ];

  const tones: { id: SurfaceColorTone; nameBn: string; nameEn: string; colorHex: string }[] = [
    { id: "warm-sand", nameBn: "ওয়ার্ম স্যান্ড (Beige)", nameEn: "Warm Sand", colorHex: "#EFE8DE" },
    { id: "cool-grey", nameBn: "কুল কংক্রিট গ্রে", nameEn: "Cool Grey", colorHex: "#CBD5E1" },
    { id: "dark-charcoal", nameBn: "ডার্ক চারকোল", nameEn: "Dark Charcoal", colorHex: "#1E293B" },
    { id: "rich-terracotta", nameBn: "টেরাকোটা ক্লে", nameEn: "Terracotta", colorHex: "#881337" },
    { id: "emerald-luxury", nameBn: "রয়্যাল এমারেল্ড", nameEn: "Royal Emerald", colorHex: "#064E3B" },
    { id: "pure-white", nameBn: "পিওর হোয়াইট", nameEn: "Pure White", colorHex: "#FFFFFF" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>{lang === "bn" ? "ব্যাকগ্রাউন্ড কার্ড কাস্টমাইজেশন" : "Background Card Studio"}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {lang === "bn"
              ? "টাইলস ফ্লোর, পাম শ্যাডো, উডেন হ্যাঙ্গার ও ব্র‍্যান্ডিং নিজের মতো সাজান"
              : "Customize surfaces, natural shadows, wooden hanger & brand typography"}
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] font-semibold text-stone-700 border border-stone-200 transition-colors cursor-pointer"
          title="Reset Card"
        >
          <RotateCcw className="w-3 h-3 text-amber-600" />
          <span>{lang === "bn" ? "রিসেট" : "Reset"}</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 1. SURFACE BACKDROP & FLOOR                                         */}
      {/* =================================================================== */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Grid className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === "bn" ? "১. ফ্লোর ও সারফেস টাইপ (Surface & Floor)" : "1. Surface & Floor Backdrop"}</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {surfaces.map((s) => (
            <button
              key={s.id}
              onClick={() => update({ surfaceType: s.id })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                cardState.surfaceType === s.id
                  ? "bg-amber-50/80 border-amber-400 text-stone-900 shadow-2xs ring-2 ring-amber-400/20"
                  : "bg-white border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-300 shadow-2xs"
              }`}
            >
              <span className="text-lg">{s.icon}</span>
              <div className="text-[11px] font-bold leading-tight">
                {lang === "bn" ? s.nameBn : s.nameEn}
              </div>
            </button>
          ))}
        </div>

        {/* Tone Selector */}
        <div className="pt-2 space-y-2">
          <div className="text-[11px] font-semibold text-stone-600">
            {lang === "bn" ? "সারফেস কালার টোন:" : "Surface Color Tone:"}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => update({ surfaceTone: t.id })}
                className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  cardState.surfaceTone === t.id
                    ? "border-amber-400 bg-amber-50/80 shadow-2xs ring-2 ring-amber-400/20"
                    : "border-stone-200 bg-white hover:border-stone-300 shadow-2xs"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-stone-300 shadow-inner"
                  style={{ backgroundColor: t.colorHex }}
                />
                <span className="text-[9px] font-medium text-stone-700 text-center truncate w-full">
                  {lang === "bn" ? t.nameBn.split(" ")[0] : t.nameEn}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tile Grout Grid Switch */}
        {cardState.surfaceType === "tiles" && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-xs text-stone-700 font-medium">
              {lang === "bn" ? "টাইলস গ্রিড ও গ্রাউট লাইন (Tile Grout Lines)" : "Tile Grout Grid Lines"}
            </span>
            <input
              type="checkbox"
              checked={cardState.showTileGrid}
              onChange={(e) => update({ showTileGrid: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 2. ATMOSPHERIC SHADOWS & STUDIO PROPS                               */}
      {/* =================================================================== */}
      <div className="space-y-3 pt-2 border-t border-stone-200">
        <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Trees className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === "bn" ? "২. প্রাকৃতিক শ্যাডো ও লাইফস্টাইল প্রপস" : "2. Atmospheric Shadows & Props"}</span>
        </label>

        <div className="space-y-2">
          {/* Palm Leaf Shadow */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-2">
                <span>🌿</span>
                <span>{lang === "bn" ? "পাম ট্রির ছায়া ও ট্রপিক্যাল পাতা (Palm Leaf Shadow)" : "Palm Leaf Shadow & Foliage"}</span>
              </span>
              <input
                type="checkbox"
                checked={cardState.showPalmShadow}
                onChange={(e) => update({ showPalmShadow: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
            {cardState.showPalmShadow && (
              <div className="pt-1 flex items-center gap-3">
                <span className="text-[10px] text-stone-500 shrink-0">
                  {lang === "bn" ? "ছায়ার গাঢ়তা:" : "Shadow Opacity:"} {cardState.palmShadowOpacity}%
                </span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={cardState.palmShadowOpacity}
                  onChange={(e) => update({ palmShadowOpacity: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Window Blinds Shadow */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-2">
              <span>🪟</span>
              <span>{lang === "bn" ? "উইন্ডো ফ্রেম ও ব্লাইন্ডস শ্যাডো (Window Blinds)" : "Window Blinds Shadow"}</span>
            </span>
            <input
              type="checkbox"
              checked={cardState.showWindowShadow}
              onChange={(e) => update({ showWindowShadow: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Wooden Hanger Prop */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-2">
              <span>🪵</span>
              <span>{lang === "bn" ? "উডেন হ্যাঙ্গার প্রপ (Realistic Wooden Hanger)" : "Wooden Hanger Prop"}</span>
            </span>
            <input
              type="checkbox"
              checked={cardState.showWoodenHanger}
              onChange={(e) => update({ showWoodenHanger: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Kinfolk Magazine Lookbook Prop */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-2">
              <span>📖</span>
              <span>{lang === "bn" ? "কিনফোক লুকবুক ম্যাগাজিন প্রপ (Kinfolk Prop)" : "Kinfolk Lookbook Magazine Prop"}</span>
            </span>
            <input
              type="checkbox"
              checked={cardState.showKinfolkProp}
              onChange={(e) => update({ showKinfolkProp: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Pampas Grass Prop */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-2">
              <span>🌾</span>
              <span>{lang === "bn" ? "পাম্পাস ঘাস ও বোটানিক্যাল প্রপ (Pampas Grass)" : "Dried Pampas Grass Botanical"}</span>
            </span>
            <input
              type="checkbox"
              checked={cardState.showPampasGrass}
              onChange={(e) => update({ showPampasGrass: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Sunlight Glow */}
          <div className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-2">
              <span>☀️</span>
              <span>{lang === "bn" ? "সানলাইট ব্লুম ও লেন্স গ্লো (Golden Hour Flare)" : "Golden Hour Sunlight Glow"}</span>
            </span>
            <input
              type="checkbox"
              checked={cardState.showSunlightGlow}
              onChange={(e) => update({ showSunlightGlow: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2B. REALISTIC FLOATING GROUND SHADOW ENGINE                         */}
      {/* =================================================================== */}
      <div className="space-y-3 pt-2 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {lang === "bn"
                ? "ফ্লোটিং গ্রাউন্ড শ্যাডো ইঞ্জিন (Floating Drop Shadow)"
                : "Floating Ground Shadow Engine"}
            </span>
          </label>
          <input
            type="checkbox"
            checked={cardState.floatingShadowEnabled}
            onChange={(e) => update({ floatingShadowEnabled: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>
        <p className="text-[11px] text-stone-500">
          {lang === "bn"
            ? "পোশাকের নিচে প্রফেশনাল কমার্শিয়াল সফট ইলিপ্স শ্যাডো (ILYN / Sailor / Apex লুক)"
            : "Authentic commercial floating drop shadow under the garment hem"}
        </p>

        {cardState.floatingShadowEnabled && (
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            {/* Opacity slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                <span>{lang === "bn" ? "শ্যাডোর অপাসিটি (Opacity):" : "Shadow Opacity:"}</span>
                <span className="text-amber-600 font-mono">{Math.round((cardState.floatingShadowOpacity || 0.40) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.80"
                step="0.05"
                value={cardState.floatingShadowOpacity ?? 0.40}
                onChange={(e) => update({ floatingShadowOpacity: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Blur slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                <span>{lang === "bn" ? "গউসিয়ান ব্লার (Gaussian Blur):" : "Gaussian Blur:"}</span>
                <span className="text-amber-600 font-mono">{cardState.floatingShadowBlur ?? 26}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="45"
                step="1"
                value={cardState.floatingShadowBlur ?? 26}
                onChange={(e) => update({ floatingShadowBlur: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Width slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                <span>{lang === "bn" ? "শ্যাডোর প্রশস্ততা (Width Stretch):" : "Shadow Width:"}</span>
                <span className="text-amber-600 font-mono">{cardState.floatingShadowWidth ?? 65}%</span>
              </div>
              <input
                type="range"
                min="35"
                max="95"
                step="5"
                value={cardState.floatingShadowWidth ?? 65}
                onChange={(e) => update({ floatingShadowWidth: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Vertical Distance slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                <span>{lang === "bn" ? "গ্রাউন্ড ডিসট্যান্স (Ground Distance):" : "Ground Distance:"}</span>
                <span className="text-amber-600 font-mono">{cardState.floatingShadowDistance ?? 10}px</span>
              </div>
              <input
                type="range"
                min="-10"
                max="40"
                step="2"
                value={cardState.floatingShadowDistance ?? 10}
                onChange={(e) => update({ floatingShadowDistance: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 3. EDITORIAL BRAND HEADER / SIGNATURE                               */}
      {/* =================================================================== */}
      <div className="space-y-3 pt-2 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "৩. ব্র্যান্ড লোগো ও হেডার (Brand Header)" : "3. Brand Header & Logo"}</span>
          </label>
          <input
            type="checkbox"
            checked={cardState.showBrandHeader}
            onChange={(e) => update({ showBrandHeader: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {cardState.showBrandHeader && (
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-600">
                {lang === "bn" ? "ব্র্যান্ডের নাম:" : "Brand Name:"}
              </label>
              <input
                type="text"
                value={cardState.brandName}
                onChange={(e) => update({ brandName: e.target.value })}
                placeholder="RAW STITCH / ILLIYEEN / আপনার শপ"
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600">
                {lang === "bn" ? "ট্যাগলাইন / সাব-হেডার:" : "Tagline / Sub-header:"}
              </label>
              <input
                type="text"
                value={cardState.brandTagline}
                onChange={(e) => update({ brandTagline: e.target.value })}
                placeholder="PREMIUM STREETWEAR / EXCLUSIVE WEAR"
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-stone-600">
                  {lang === "bn" ? "পজিশন:" : "Position:"}
                </label>
                <select
                  value={cardState.brandPosition}
                  onChange={(e) => update({ brandPosition: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
                >
                  <option value="top-left">{lang === "bn" ? "উপরে বামে" : "Top Left"}</option>
                  <option value="top-center">{lang === "bn" ? "উপরে মাঝে" : "Top Center"}</option>
                  <option value="top-right">{lang === "bn" ? "উপরে ডানে" : "Top Right"}</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-stone-600">
                  {lang === "bn" ? "স্টাইল:" : "Badge Style:"}
                </label>
                <select
                  value={cardState.brandStyle}
                  onChange={(e) => update({ brandStyle: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
                >
                  <option value="minimal">{lang === "bn" ? "মিনিমাল স্ট্রিটওয়্যার" : "Minimal Modern"}</option>
                  <option value="luxury-badge">{lang === "bn" ? "লাক্সারি গোল্ড বক্স" : "Luxury Gold Box"}</option>
                  <option value="korean-craft">{lang === "bn" ? "কোরিয়ান ক্রাফট" : "Korean Craft"}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 3B. COMMERCIAL BRAND FRAME OVERLAYS (CORNER BADGES)                 */}
      {/* =================================================================== */}
      <div className="space-y-3 pt-2 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {lang === "bn"
                ? "কমার্শিয়াল ব্র্যান্ড ফ্রেম ও কর্নার ব্যাজ (Brand Frame Overlays)"
                : "Commercial Brand Frame Overlays"}
            </span>
          </label>
          <input
            type="checkbox"
            checked={cardState.showBrandFrame}
            onChange={(e) => update({ showBrandFrame: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>
        <p className="text-[11px] text-stone-500">
          {lang === "bn"
            ? "উপরে-বামে ব্র্যান্ড ট্যাগ ফ্রেম ও নিচে-ডানে ক্যাটাগরি ব্যাজ (ILYN / Sailor স্টাইল)"
            : "Top-left brand tag frame & bottom-right category badge"}
        </p>

        {cardState.showBrandFrame && (
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-stone-600">
                  {lang === "bn" ? "টপ ব্র্যান্ড নাম:" : "Top Brand Tag:"}
                </label>
                <input
                  type="text"
                  value={cardState.brandFrameTopText ?? "ILYN"}
                  onChange={(e) => update({ brandFrameTopText: e.target.value })}
                  placeholder="ILYN / SAILOR / APEX"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 font-bold focus:bg-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600">
                  {lang === "bn" ? "টপ সাব-ট্যাগ:" : "Top Sub-tag:"}
                </label>
                <input
                  type="text"
                  value={cardState.brandFrameTopSub ?? "EST. 2014"}
                  onChange={(e) => update({ brandFrameTopSub: e.target.value })}
                  placeholder="EST. 2014 / STUDIO"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600">
                {lang === "bn" ? "নিচের ক্যাটাগরি ব্যাজ:" : "Bottom Category Badge:"}
              </label>
              <input
                type="text"
                value={cardState.brandFrameBottomText ?? "SUMMER 26"}
                onChange={(e) => update({ brandFrameBottomText: e.target.value })}
                placeholder="KIDS / SUMMER 26 / PANJABI"
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-stone-600">
                {lang === "bn" ? "ফ্রেম ও ব্যাজ স্টাইল:" : "Badge Style:"}
              </label>
              <select
                value={cardState.brandFrameStyle ?? "minimal-frame"}
                onChange={(e) => update({ brandFrameStyle: e.target.value as any })}
                className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
              >
                <option value="minimal-frame">
                  {lang === "bn" ? "মিনিমাল বর্ডার ফ্রেম (Minimal Frame)" : "Minimal Border Frame"}
                </option>
                <option value="corner-bracket">
                  {lang === "bn" ? "কর্নার ব্র্যাকেট ব্যাজ (Corner Bracket)" : "Corner Bracket"}
                </option>
                <option value="clean-monochrome">
                  {lang === "bn" ? "মনোক্রম ক্লিন ট্যাগ (Clean Monochrome)" : "Clean Monochrome"}
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 4. BIG COLLECTION TYPOGRAPHY (AW26 / NEW ARRIVALS)                   */}
      {/* =================================================================== */}
      <div className="space-y-3 pt-2 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "৪. কালেকশন টাইটেল (AW26 / New Arrivals)" : "4. Collection Typography"}</span>
          </label>
          <input
            type="checkbox"
            checked={cardState.showCollectionText}
            onChange={(e) => update({ showCollectionText: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {cardState.showCollectionText && (
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-stone-600">
                  {lang === "bn" ? "বড় হেডলাইন:" : "Hero Headline:"}
                </label>
                <input
                  type="text"
                  value={cardState.collectionSeason}
                  onChange={(e) => update({ collectionSeason: e.target.value })}
                  placeholder="AW26 / EID '26"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600">
                  {lang === "bn" ? "সাব-টাইটেল:" : "Sub-headline:"}
                </label>
                <input
                  type="text"
                  value={cardState.collectionSub}
                  onChange={(e) => update({ collectionSub: e.target.value })}
                  placeholder="NEW ARRIVALS"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400 uppercase tracking-widest text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-stone-600">
                  {lang === "bn" ? "টাইপোগ্রাফি স্টাইল:" : "Typography Style:"}
                </label>
                <select
                  value={cardState.collectionStyle}
                  onChange={(e) => update({ collectionStyle: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
                >
                  <option value="glowing-outline">{lang === "bn" ? "⚡ নিয়ন আউটলাইন গ্লো" : "Glowing Outline"}</option>
                  <option value="solid-bold">{lang === "bn" ? "🔲 সলিড বোল্ড" : "Solid Bold"}</option>
                  <option value="minimal-clean">{lang === "bn" ? "ক্লিন মিনিমাল" : "Clean Minimal"}</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-stone-600">
                  {lang === "bn" ? "পজিশন:" : "Position:"}
                </label>
                <select
                  value={cardState.collectionPosition}
                  onChange={(e) => update({ collectionPosition: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
                >
                  <option value="bottom-right">{lang === "bn" ? "নিচে ডানে" : "Bottom Right"}</option>
                  <option value="bottom-left">{lang === "bn" ? "নিচে বামে" : "Bottom Left"}</option>
                  <option value="top-right">{lang === "bn" ? "উপরে ডানে" : "Top Right"}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 5. EDITORIAL MICRO-COPY (DETAILS / SPECIFICATIONS)                   */}
      {/* =================================================================== */}
      <div className="space-y-3 pt-2 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "৫. এডিটোরিয়াল টেক্সট ও বিবরণী" : "5. Editorial Micro-Copy"}</span>
          </label>
          <input
            type="checkbox"
            checked={cardState.showEditorialCopy}
            onChange={(e) => update({ showEditorialCopy: e.target.checked })}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {cardState.showEditorialCopy && (
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-600">
                {lang === "bn" ? "এডিটোরিয়াল হেডলাইন:" : "Editorial Heading:"}
              </label>
              <input
                type="text"
                value={cardState.editorialHeading}
                onChange={(e) => update({ editorialHeading: e.target.value })}
                placeholder="TIMELESS STRIPES. BUILT TO LAST."
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400 uppercase tracking-wider text-[11px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600">
                {lang === "bn" ? "ফিচার বুলেটস (প্রতি লাইনে একটি):" : "Feature Bullets (1 per line):"}
              </label>
              <textarea
                rows={3}
                value={cardState.editorialBullets}
                onChange={(e) => update({ editorialBullets: e.target.value })}
                placeholder="Clean design.&#10;Premium fabric.&#10;Everyday comfort."
                className="w-full mt-1 p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
