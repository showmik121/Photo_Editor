"use client";

import React, { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  Paintbrush,
  Frame,
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

interface AccordionSectionProps {
  id: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}

function AccordionSection({
  isOpen,
  onToggle,
  icon,
  title,
  subtitle,
  badge,
  children,
}: AccordionSectionProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50/80 transition-colors cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-stone-800 flex items-center gap-2 truncate">
              <span>{title}</span>
              {badge && (
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-100/80 text-amber-800 border border-amber-200/60">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        <div className="text-stone-400 p-1 shrink-0">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-amber-600 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400 transition-transform duration-200" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 pt-1 border-t border-stone-100 space-y-3 animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
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

  // Accordion state: default to collapsed except Section 1 (Surface & Floor)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    surface: true,
    customBg: false,
    gradient: false,
    border: false,
    shadows: false,
    floatingShadow: false,
    brandFrame: false,
    brandHeader: false,
    collection: false,
    editorial: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  const borderStyles: { id: NonNullable<CustomCardState["borderStyle"]>; nameBn: string; nameEn: string; icon: string }[] = [
    { id: "none", nameBn: "নান", nameEn: "None", icon: "⊘" },
    { id: "thin", nameBn: "থিন বর্ডার", nameEn: "Thin", icon: "▢" },
    { id: "rounded", nameBn: "রাউন্ডেড", nameEn: "Rounded", icon: "▢" },
    { id: "polaroid", nameBn: "পোলারয়েড", nameEn: "Polaroid", icon: "📷" },
    { id: "vintage", nameBn: "ভিন্টেজ", nameEn: "Vintage", icon: "⧉" },
    { id: "shadow-frame", nameBn: "শ্যাডো ফ্রেম", nameEn: "Shadow", icon: "❏" },
  ];

  return (
    <div className="space-y-4">
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
          type="button"
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
      <AccordionSection
        id="surface"
        isOpen={openSections.surface}
        onToggle={() => toggleSection("surface")}
        icon={<Grid className="w-4 h-4" />}
        title={lang === "bn" ? "১. ফ্লোর ও সারফেস টাইপ (Surface & Floor)" : "1. Surface & Floor Backdrop"}
        subtitle={lang === "bn" ? "কংক্রিট, প্লাস্টার, ব্রাশ, টাইলস ও প্যাডিং" : "Concrete, plaster, tiles & canvas padding"}
      >
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {surfaces.map((s) => (
              <button
                key={s.id}
                type="button"
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
          <div className="pt-2 space-y-2 border-t border-stone-100">
            <div className="text-[11px] font-semibold text-stone-600">
              {lang === "bn" ? "সারফেস কালার টোন:" : "Surface Color Tone:"}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  type="button"
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
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 shadow-2xs">
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

          {/* Canvas Padding Slider */}
          <div className="pt-2 border-t border-stone-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700">
              <span>{lang === "bn" ? "ক্যানভাস প্যাডিং" : "Canvas Padding"}</span>
              <span className="font-mono text-amber-700 font-bold">{cardState.canvasPadding ?? 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={cardState.canvasPadding ?? 0}
              onChange={(e) => update({ canvasPadding: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-stone-400">
              <span>0px (Edge-to-Edge)</span>
              <span>30px</span>
              <span>60px</span>
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* =================================================================== */}
      {/* 2. CUSTOM BACKGROUND COLOR                                          */}
      {/* =================================================================== */}
      <AccordionSection
        id="customBg"
        isOpen={openSections.customBg}
        onToggle={() => toggleSection("customBg")}
        icon={<Paintbrush className="w-4 h-4" />}
        title={lang === "bn" ? "২. কাস্টম ব্যাকগ্রাউন্ড কালার" : "2. Custom Background Color"}
        subtitle={lang === "bn" ? "নির্দিষ্ট হেক্স কালার কোড বা পিকার ব্যবহার করুন" : "Pick exact HEX color code for backdrop"}
        badge={cardState.useCustomBgColor ? (lang === "bn" ? "সক্রিয়" : "Active") : undefined}
      >
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-semibold text-stone-800">
              {lang === "bn" ? "কাস্টম ব্যাকগ্রাউন্ড কালার" : "Custom Background Color"}
            </span>
            <input
              type="checkbox"
              checked={cardState.useCustomBgColor || false}
              onChange={(e) => update({ useCustomBgColor: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {cardState.useCustomBgColor && (
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={cardState.customBgColor || "#F5EBE1"}
                  onChange={(e) => update({ customBgColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white shrink-0 shadow-2xs"
                  title="Pick Color"
                />
                <div className="flex-1">
                  <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                    {lang === "bn" ? "হেক্স কালার কোড (HEX):" : "HEX Color Code:"}
                  </label>
                  <input
                    type="text"
                    value={cardState.customBgColor || "#F5EBE1"}
                    onChange={(e) => update({ customBgColor: e.target.value })}
                    placeholder="#F5EBE1"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-mono font-bold text-stone-900 uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Quick Preset Color Swatches */}
              <div className="space-y-1.5 pt-1 border-t border-stone-200/60">
                <span className="text-[10px] font-medium text-stone-500">
                  {lang === "bn" ? "জনপ্রিয় স্টুডিও শেডস:" : "Popular Studio Shades:"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Warm Beige", hex: "#F5EBE1" },
                    { label: "Cool Grey", hex: "#E2E8F0" },
                    { label: "Dark Slate", hex: "#1E293B" },
                    { label: "Pure White", hex: "#FFFFFF" },
                    { label: "Soft Amber", hex: "#FEF3C7" },
                    { label: "Rose Petal", hex: "#FCE7F3" },
                    { label: "Sage Green", hex: "#E2ECE9" },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => update({ customBgColor: swatch.hex })}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-[10px] text-stone-700 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-stone-300"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="font-mono text-[9px]">{swatch.hex}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* =================================================================== */}
      {/* 3. GRADIENT CONTROLS                                                */}
      {/* =================================================================== */}
      <AccordionSection
        id="gradient"
        isOpen={openSections.gradient}
        onToggle={() => toggleSection("gradient")}
        icon={<Sparkles className="w-4 h-4" />}
        title={lang === "bn" ? "৩. গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড" : "3. Gradient Background"}
        subtitle={lang === "bn" ? "ডুয়াল কালার গ্রেডিয়েন্ট ও কাস্টম ডিরেকশন অ্যাঙ্গেল" : "Two-tone gradient with customizable angle"}
        badge={cardState.gradientEnabled ? (lang === "bn" ? "সক্রিয়" : "Active") : undefined}
      >
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-semibold text-stone-800">
              {lang === "bn" ? "গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড" : "Gradient Background"}
            </span>
            <input
              type="checkbox"
              checked={cardState.gradientEnabled || false}
              onChange={(e) => update({ gradientEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {cardState.gradientEnabled && (
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
              {/* Gradient Preview Strip */}
              <div
                className="h-9 w-full rounded-xl border border-stone-300 shadow-2xs flex items-center justify-center text-[10px] font-mono font-bold text-stone-800 drop-shadow-xs"
                style={{
                  background: `linear-gradient(${cardState.gradientAngle || 135}deg, ${cardState.gradientColor1 || "#F5EBE1"}, ${cardState.gradientColor2 || "#E2E8F0"})`,
                }}
              >
                {cardState.gradientAngle || 135}° Preview
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Color 1 Picker + HEX */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "কালার ১ (শুরু):" : "Color 1 (Start):"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cardState.gradientColor1 || "#F5EBE1"}
                      onChange={(e) => update({ gradientColor1: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0.5 bg-white shrink-0 shadow-2xs"
                    />
                    <input
                      type="text"
                      value={cardState.gradientColor1 || "#F5EBE1"}
                      onChange={(e) => update({ gradientColor1: e.target.value })}
                      placeholder="#F5EBE1"
                      className="w-full px-2 py-1 rounded bg-white border border-stone-200 text-[11px] font-mono text-stone-900 uppercase focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>
                </div>

                {/* Color 2 Picker + HEX */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "কালার ২ (শেষ):" : "Color 2 (End):"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cardState.gradientColor2 || "#E2E8F0"}
                      onChange={(e) => update({ gradientColor2: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0.5 bg-white shrink-0 shadow-2xs"
                    />
                    <input
                      type="text"
                      value={cardState.gradientColor2 || "#E2E8F0"}
                      onChange={(e) => update({ gradientColor2: e.target.value })}
                      placeholder="#E2E8F0"
                      className="w-full px-2 py-1 rounded bg-white border border-stone-200 text-[11px] font-mono text-stone-900 uppercase focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Angle Slider */}
              <div className="space-y-1 pt-1 border-t border-stone-200/60">
                <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                  <span>{lang === "bn" ? "গ্রেডিয়েন্ট ডিরেকশন (Angle):" : "Gradient Angle:"}</span>
                  <span className="font-mono text-amber-700 font-bold">{cardState.gradientAngle || 135}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={cardState.gradientAngle || 135}
                  onChange={(e) => update({ gradientAngle: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* =================================================================== */}
      {/* 4. BORDER & FRAME STYLE CONTROL                                     */}
      {/* =================================================================== */}
      <AccordionSection
        id="border"
        isOpen={openSections.border}
        onToggle={() => toggleSection("border")}
        icon={<Frame className="w-4 h-4" />}
        title={lang === "bn" ? "৪. বর্ডার ও ফ্রেম স্টাইল" : "4. Border & Frame Style"}
        subtitle={lang === "bn" ? "পোলারয়েড, থিন, রাউন্ডেড বা শ্যাডো ফ্রেম লুক" : "Polaroid, thin, rounded, vintage or shadow frame"}
        badge={cardState.borderStyle && cardState.borderStyle !== "none" ? (lang === "bn" ? "সক্রিয়" : "Active") : undefined}
      >
        <div className="space-y-3 pt-1">
          <div className="text-[11px] font-semibold text-stone-600">
            {lang === "bn" ? "ফ্রেমের ধরণ পছন্দ করুন:" : "Choose Frame Style:"}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {borderStyles.map((b) => {
              const isSelected = (cardState.borderStyle || "none") === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => update({ borderStyle: b.id })}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-amber-50/80 border-amber-400 text-stone-900 shadow-2xs ring-2 ring-amber-400/20 font-bold"
                      : "bg-white border-stone-200 text-stone-700 hover:border-stone-300 shadow-2xs"
                  }`}
                >
                  <span className="text-base select-none">{b.icon}</span>
                  <span className="text-[10px] leading-tight truncate w-full">
                    {lang === "bn" ? b.nameBn : b.nameEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Border Color & Width when style != "none" */}
          {cardState.borderStyle && cardState.borderStyle !== "none" && (
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3 pt-2">
              {/* Color Picker paired with HEX text */}
              <div>
                <label className="text-[10px] font-semibold text-stone-600 block mb-1">
                  {lang === "bn" ? "বর্ডারের রঙ (Border Color):" : "Border Color:"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={cardState.borderColor || "#E5E7EB"}
                    onChange={(e) => update({ borderColor: e.target.value })}
                    className="w-9 h-9 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white shrink-0 shadow-2xs"
                  />
                  <input
                    type="text"
                    value={cardState.borderColor || "#E5E7EB"}
                    onChange={(e) => update({ borderColor: e.target.value })}
                    placeholder="#E5E7EB"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-mono font-bold text-stone-900 uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Border Width Slider */}
              <div className="space-y-1 pt-1 border-t border-stone-200/60">
                <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                  <span>{lang === "bn" ? "বর্ডার প্রশস্ততা (Width):" : "Border Width:"}</span>
                  <span className="font-mono text-amber-700 font-bold">{cardState.borderWidth || 2}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={cardState.borderWidth || 2}
                  onChange={(e) => update({ borderWidth: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>1px</span>
                  <span>12px</span>
                  <span>24px</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* =================================================================== */}
      {/* 5. ATMOSPHERIC SHADOWS & STUDIO PROPS                               */}
      {/* =================================================================== */}
      <AccordionSection
        id="shadows"
        isOpen={openSections.shadows}
        onToggle={() => toggleSection("shadows")}
        icon={<Trees className="w-4 h-4 text-emerald-600" />}
        title={lang === "bn" ? "৫. প্রাকৃতিক শ্যাডো ও লাইফস্টাইল প্রপস" : "5. Atmospheric Shadows & Props"}
        subtitle={lang === "bn" ? "পাম ট্রির ছায়া, জানালার ব্লাইন্ডস, উডেন হ্যাঙ্গার ও ম্যাগাজিন" : "Palm leaves, window blinds, hanger & lookbook props"}
      >
        <div className="space-y-2 pt-1">
          {/* Palm Leaf Shadow */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 shadow-2xs space-y-2">
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
                <span className="text-[10px] text-stone-500 shrink-0 font-medium">
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
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 shadow-2xs flex items-center justify-between">
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
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 shadow-2xs flex items-center justify-between">
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
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 shadow-2xs flex items-center justify-between">
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
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 shadow-2xs flex items-center justify-between">
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
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 shadow-2xs flex items-center justify-between">
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
      </AccordionSection>

      {/* =================================================================== */}
      {/* 6. REALISTIC FLOATING GROUND SHADOW ENGINE                         */}
      {/* =================================================================== */}
      <AccordionSection
        id="floatingShadow"
        isOpen={openSections.floatingShadow}
        onToggle={() => toggleSection("floatingShadow")}
        icon={<Sparkles className="w-4 h-4" />}
        title={lang === "bn" ? "৬. ফ্লোটিং গ্রাউন্ড শ্যাডো ইঞ্জিন" : "6. Floating Ground Shadow Engine"}
        subtitle={lang === "bn" ? "পোশাকের নিচে কমার্শিয়াল সফট ইলিপ্স শ্যাডো (ILYN / Sailor / Apex)" : "Commercial drop shadow under garment hem"}
        badge={cardState.floatingShadowEnabled ? (lang === "bn" ? "সক্রিয়" : "Active") : undefined}
      >
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-xs font-semibold text-stone-800 block">
                {lang === "bn" ? "ফ্লোটিং গ্রাউন্ড শ্যাডো সক্রিয় করুন" : "Enable Floating Ground Shadow"}
              </span>
              <span className="text-[10px] text-stone-500">
                {lang === "bn" ? "প্রোডাক্টের নিচে ন্যাচারাল গ্রাউন্ড ড্রপ শ্যাডো" : "Natural ground contact drop shadow"}
              </span>
            </div>
            <input
              type="checkbox"
              checked={cardState.floatingShadowEnabled}
              onChange={(e) => update({ floatingShadowEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {cardState.floatingShadowEnabled && (
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
              {/* Opacity slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-stone-700">
                  <span>{lang === "bn" ? "শ্যাডোর অপাসিটি (Opacity):" : "Shadow Opacity:"}</span>
                  <span className="text-amber-600 font-mono font-bold">{Math.round((cardState.floatingShadowOpacity || 0.40) * 100)}%</span>
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
                  <span className="text-amber-600 font-mono font-bold">{cardState.floatingShadowBlur ?? 26}px</span>
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
                  <span className="text-amber-600 font-mono font-bold">{cardState.floatingShadowWidth ?? 65}%</span>
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
                  <span className="text-amber-600 font-mono font-bold">{cardState.floatingShadowDistance ?? 10}px</span>
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
      </AccordionSection>

      {/* =================================================================== */}
      {/* 7. COMMERCIAL BRAND FRAME OVERLAYS (CORNER BADGES)                 */}
      {/* =================================================================== */}
      <AccordionSection
        id="brandFrame"
        isOpen={openSections.brandFrame}
        onToggle={() => toggleSection("brandFrame")}
        icon={<Tag className="w-4 h-4" />}
        title={lang === "bn" ? "৭. কমার্শিয়াল ব্র্যান্ড ফ্রেম ও কর্নার ব্যাজ" : "7. Commercial Brand Frame Overlays"}
        subtitle={lang === "bn" ? "উপরে-বামে ব্র্যান্ড ট্যাগ ও নিচে ক্যাটাগরি ব্যাজ" : "Top brand tag & bottom category badges"}
        badge={cardState.showBrandFrame ? (lang === "bn" ? "সক্রিয়" : "Active") : undefined}
      >
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-xs font-semibold text-stone-800 block">
                {lang === "bn" ? "ব্র্যান্ড ফ্রেম ও কর্নার ব্যাজ শো করুন" : "Show Brand Frame Overlays"}
              </span>
              <span className="text-[10px] text-stone-500">
                {lang === "bn" ? "ILYN / Sailor / Apex ফ্যাশন ব্যাজ লুক" : "ILYN / Sailor / Apex studio layout"}
              </span>
            </div>
            <input
              type="checkbox"
              checked={cardState.showBrandFrame}
              onChange={(e) => update({ showBrandFrame: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {cardState.showBrandFrame && (
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "টপ ব্র্যান্ড নাম:" : "Top Brand Tag:"}
                  </label>
                  <input
                    type="text"
                    value={cardState.brandFrameTopText ?? "ILYN"}
                    onChange={(e) => update({ brandFrameTopText: e.target.value })}
                    placeholder="ILYN / SAILOR / APEX"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "টপ সাব-ট্যাগ:" : "Top Sub-tag:"}
                  </label>
                  <input
                    type="text"
                    value={cardState.brandFrameTopSub ?? "EST. 2014"}
                    onChange={(e) => update({ brandFrameTopSub: e.target.value })}
                    placeholder="EST. 2014 / STUDIO"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 block">
                  {lang === "bn" ? "নিচের ক্যাটাগরি ব্যাজ:" : "Bottom Category Badge:"}
                </label>
                <input
                  type="text"
                  value={cardState.brandFrameBottomText ?? "SUMMER 26"}
                  onChange={(e) => update({ brandFrameBottomText: e.target.value })}
                  placeholder="KIDS / SUMMER 26 / PANJABI"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-stone-600 block">
                  {lang === "bn" ? "ফ্রেম ও ব্যাজ স্টাইল:" : "Badge Style:"}
                </label>
                <select
                  value={cardState.brandFrameStyle ?? "minimal-frame"}
                  onChange={(e) => update({ brandFrameStyle: e.target.value as any })}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400"
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
      </AccordionSection>

      {/* =================================================================== */}
      {/* 8. EDITORIAL BRAND HEADER / SIGNATURE                               */}
      {/* =================================================================== */}
      <AccordionSection
        id="brandHeader"
        isOpen={openSections.brandHeader}
        onToggle={() => toggleSection("brandHeader")}
        icon={<Tag className="w-4 h-4" />}
        title={lang === "bn" ? "৮. ব্র্যান্ড লোগো ও হেডার (Brand Header)" : "8. Brand Header & Logo"}
        subtitle={lang === "bn" ? "RAW STITCH, ILLIYEEN বা আপনার নিজস্ব স্টোর নাম" : "Store brand name, tagline & positioning"}
        badge={cardState.showBrandHeader ? (lang === "bn" ? "সক্রিয়" : "Active") : undefined}
      >
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-semibold text-stone-800">
              {lang === "bn" ? "ব্র্যান্ড হেডার সক্রিয় করুন" : "Enable Brand Header"}
            </span>
            <input
              type="checkbox"
              checked={cardState.showBrandHeader}
              onChange={(e) => update({ showBrandHeader: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {cardState.showBrandHeader && (
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block">
                  {lang === "bn" ? "ব্র্যান্ডের নাম:" : "Brand Name:"}
                </label>
                <input
                  type="text"
                  value={cardState.brandName}
                  onChange={(e) => update({ brandName: e.target.value })}
                  placeholder="RAW STITCH / ILLIYEEN / আপনার শপ"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 block">
                  {lang === "bn" ? "ট্যাগলাইন / সাব-হেডার:" : "Tagline / Sub-header:"}
                </label>
                <input
                  type="text"
                  value={cardState.brandTagline}
                  onChange={(e) => update({ brandTagline: e.target.value })}
                  placeholder="PREMIUM STREETWEAR / EXCLUSIVE WEAR"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "পজিশন:" : "Position:"}
                  </label>
                  <select
                    value={cardState.brandPosition}
                    onChange={(e) => update({ brandPosition: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400"
                  >
                    <option value="top-left">{lang === "bn" ? "উপরে বামে" : "Top Left"}</option>
                    <option value="top-center">{lang === "bn" ? "উপরে মাঝে" : "Top Center"}</option>
                    <option value="top-right">{lang === "bn" ? "উপরে ডানে" : "Top Right"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "স্টাইল:" : "Badge Style:"}
                  </label>
                  <select
                    value={cardState.brandStyle}
                    onChange={(e) => update({ brandStyle: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400"
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
      </AccordionSection>

      {/* =================================================================== */}
      {/* 9. BIG COLLECTION TYPOGRAPHY (AW26 / NEW ARRIVALS)                   */}
      {/* =================================================================== */}
      <AccordionSection
        id="collection"
        isOpen={openSections.collection}
        onToggle={() => toggleSection("collection")}
        icon={<Type className="w-4 h-4" />}
        title={lang === "bn" ? "৯. কালেকশন টাইটেল (AW26 / New Arrivals)" : "9. Collection Typography"}
        subtitle={lang === "bn" ? "বড় ব্যাকগ্রাউন্ড সিজন ও ড্রপ টাইটেল" : "Big seasonal hero headline & sub-headline"}
        badge={cardState.showCollectionText ? (lang === "bn" ? "সক্রিয়" : "Active") : undefined}
      >
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-semibold text-stone-800">
              {lang === "bn" ? "কালেকশন টেক্সট সক্রিয় করুন" : "Enable Collection Typography"}
            </span>
            <input
              type="checkbox"
              checked={cardState.showCollectionText}
              onChange={(e) => update({ showCollectionText: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {cardState.showCollectionText && (
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "বড় হেডলাইন:" : "Hero Headline:"}
                  </label>
                  <input
                    type="text"
                    value={cardState.collectionSeason}
                    onChange={(e) => update({ collectionSeason: e.target.value })}
                    placeholder="AW26 / EID '26"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "সাব-টাইটেল:" : "Sub-headline:"}
                  </label>
                  <input
                    type="text"
                    value={cardState.collectionSub}
                    onChange={(e) => update({ collectionSub: e.target.value })}
                    placeholder="NEW ARRIVALS"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400 uppercase tracking-widest text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "টাইপোগ্রাফি স্টাইল:" : "Typography Style:"}
                  </label>
                  <select
                    value={cardState.collectionStyle}
                    onChange={(e) => update({ collectionStyle: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400"
                  >
                    <option value="glowing-outline">{lang === "bn" ? "⚡ নিয়ন আউটলাইন গ্লো" : "Glowing Outline"}</option>
                    <option value="solid-bold">{lang === "bn" ? "🔲 সলিড বোল্ড" : "Solid Bold"}</option>
                    <option value="minimal-clean">{lang === "bn" ? "ক্লিন মিনিমাল" : "Clean Minimal"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-stone-600 block">
                    {lang === "bn" ? "পজিশন:" : "Position:"}
                  </label>
                  <select
                    value={cardState.collectionPosition}
                    onChange={(e) => update({ collectionPosition: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400"
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
      </AccordionSection>

      {/* =================================================================== */}
      {/* 10. EDITORIAL MICRO-COPY (DETAILS / SPECIFICATIONS)                  */}
      {/* =================================================================== */}
      <AccordionSection
        id="editorial"
        isOpen={openSections.editorial}
        onToggle={() => toggleSection("editorial")}
        icon={<BookOpen className="w-4 h-4" />}
        title={lang === "bn" ? "১০. এডিটোরিয়াল টেক্সট ও বিবরণী" : "10. Editorial Micro-Copy"}
        subtitle={lang === "bn" ? "ম্যাগাজিন স্টাইল হেডলাইন ও প্রোডাক্ট বুলেট পয়েন্ট" : "Editorial heading & feature specifications"}
        badge={cardState.showEditorialCopy ? (lang === "bn" ? "সক্রিয়" : "Active") : undefined}
      >
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-semibold text-stone-800">
              {lang === "bn" ? "এডিটোরিয়াল টেক্সট সক্রিয় করুন" : "Enable Editorial Micro-Copy"}
            </span>
            <input
              type="checkbox"
              checked={cardState.showEditorialCopy}
              onChange={(e) => update({ showEditorialCopy: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {cardState.showEditorialCopy && (
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 block">
                  {lang === "bn" ? "এডিটোরিয়াল হেডলাইন:" : "Editorial Heading:"}
                </label>
                <input
                  type="text"
                  value={cardState.editorialHeading}
                  onChange={(e) => update({ editorialHeading: e.target.value })}
                  placeholder="TIMELESS STRIPES. BUILT TO LAST."
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400 uppercase tracking-wider text-[11px] font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 block">
                  {lang === "bn" ? "ফিচার বুলেটস (প্রতি লাইনে একটি):" : "Feature Bullets (1 per line):"}
                </label>
                <textarea
                  rows={3}
                  value={cardState.editorialBullets}
                  onChange={(e) => update({ editorialBullets: e.target.value })}
                  placeholder="Clean design.&#10;Premium fabric.&#10;Everyday comfort."
                  className="w-full mt-1 p-2 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </AccordionSection>
    </div>
  );
}
