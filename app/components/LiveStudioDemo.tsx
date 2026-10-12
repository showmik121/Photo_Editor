"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Download,
  Check,
  Tag,
  Truck,
  Percent,
  Layers,
  Palette,
  Eye,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { Language, translations } from "../data/locales";
import { PRESET_THEMES, PresetTheme } from "../data/mockData";

interface LiveStudioDemoProps {
  lang: Language;
}

export function LiveStudioDemo({ lang }: LiveStudioDemoProps) {
  const t = translations[lang];

  // Selected Preset
  const [selectedPreset, setSelectedPreset] = useState<PresetTheme>(PRESET_THEMES[0]);

  // Active Badges Toggles
  const [showDiscountBadge, setShowDiscountBadge] = useState<boolean>(true);
  const [showDeliveryBadge, setShowDeliveryBadge] = useState<boolean>(true);
  const [showPriceTag, setShowPriceTag] = useState<boolean>(true);
  const [showUrgencyBadge, setShowUrgencyBadge] = useState<boolean>(true);

  // Custom Price Input
  const [priceAmount, setPriceAmount] = useState<string>("১,২৯০");
  const [discountAmount, setDiscountAmount] = useState<string>("৪০%");

  // Simulated download state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  const handleDownload = () => {
    setIsExporting(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 1200);
  };

  return (
    <section id="demo" className="py-20 md:py-28 relative bg-[#FBFBFA] border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === "bn" ? "লাইভ জেনারেটর ডেমো" : "Live Generation Sandbox"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-950 tracking-tight">
            {t.demo.title}{" "}
            <span className="text-amber-600">
              {t.demo.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600">
            {t.demo.subtitle}
          </p>
        </div>

        {/* 2-Column Studio Sandbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================== */}
          {/* LEFT: CONTROLS & PRESET PICKER (5 COLS)                         */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Theme Presets */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span>{t.demo.selectPresetPrompt}</span>
                </label>
                <span className="text-xs text-stone-500 font-mono">
                  {PRESET_THEMES.length} {lang === "bn" ? "টি দেশীয় থিম" : "themes"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {PRESET_THEMES.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-amber-50/80 border-amber-400 ring-1 ring-amber-400/20 shadow-2xs"
                          : "bg-stone-50/70 border-stone-200 hover:border-stone-300 hover:bg-stone-100/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-amber-500 bg-amber-400 ring-2 ring-amber-400/20"
                              : "border-stone-400 bg-white"
                          }`}
                        />
                        <div>
                          <div
                            className={`text-sm font-bold ${
                              isSelected ? "text-stone-950" : "text-stone-800"
                            }`}
                          >
                            {lang === "bn" ? preset.nameBn : preset.nameEn}
                          </div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">
                            {lang === "bn" ? preset.taglineBn : preset.taglineEn}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-300">
                          {lang === "bn" ? "সক্রিয়" : "Active"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Badge Toggles & Price Inputs */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>{t.demo.customiseBadgesPrompt}</span>
              </label>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDiscountBadge(!showDiscountBadge)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    showDiscountBadge
                      ? "bg-rose-50 border-rose-300 text-rose-800"
                      : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" />
                    <span>{t.demo.toggleDiscount}</span>
                  </span>
                  {showDiscountBadge ? <Check className="w-3.5 h-3.5 text-rose-600" /> : null}
                </button>

                <button
                  onClick={() => setShowDeliveryBadge(!showDeliveryBadge)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    showDeliveryBadge
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{t.demo.toggleDelivery}</span>
                  </span>
                  {showDeliveryBadge ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                </button>

                <button
                  onClick={() => setShowPriceTag(!showPriceTag)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    showPriceTag
                      ? "bg-amber-50 border-amber-300 text-amber-900"
                      : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{t.demo.togglePrice}</span>
                  </span>
                  {showPriceTag ? <Check className="w-3.5 h-3.5 text-amber-600" /> : null}
                </button>

                <button
                  onClick={() => setShowUrgencyBadge(!showUrgencyBadge)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    showUrgencyBadge
                      ? "bg-blue-50 border-blue-300 text-blue-800"
                      : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "সীমিত স্টক ট্যাগ" : "Urgency Tag"}</span>
                  </span>
                  {showUrgencyBadge ? <Check className="w-3.5 h-3.5 text-blue-600" /> : null}
                </button>
              </div>

              {/* Price & Discount Customizer Fields */}
              <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {lang === "bn" ? "৳ মূল্য এডিট করুন:" : "Edit ৳ Price:"}
                  </label>
                  <input
                    type="text"
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-sm font-bold text-stone-900 focus:outline-none focus:border-amber-400 focus:bg-white"
                    placeholder="১,৪৯০"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    {lang === "bn" ? "ছাড় পার্সেন্টেজ:" : "Discount %:"}
                  </label>
                  <input
                    type="text"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-sm font-bold text-rose-600 focus:outline-none focus:border-rose-400 focus:bg-white"
                    placeholder="৫০%"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT: LIVE CANVAS MOCKUP DISPLAY (7 COLS)                      */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* The 1080x1080 Square Facebook Banner Container */}
            <div className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden border border-stone-200/90 shadow-xl shadow-stone-200/50 transition-all duration-500">
              {/* Dynamic Preset Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${selectedPreset.bgColor} transition-colors duration-700`}
              >
                {/* Specific Decorative Backdrop by Preset Theme */}
                {selectedPreset.id === "eid-dhamaka" && (
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(45,212,191,0.2),transparent_70%)]" />
                    {/* Crescent & Stars SVG Watermark */}
                    <svg
                      className="absolute top-6 left-6 w-20 h-20 text-amber-400/30"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                    >
                      <path d="M50 10 A40 40 0 1 0 90 50 A30 30 0 1 1 50 10 Z" />
                      <circle cx="70" cy="25" r="3" />
                      <circle cx="85" cy="40" r="2.5" />
                    </svg>
                  </div>
                )}

                {selectedPreset.id === "minimal-studio" && (
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff,#f1f5f9)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(15,23,42,0.06),transparent_60%)]" />
                    {/* Studio Grid Floor Horizon */}
                    <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-slate-200/80 to-transparent" />
                  </div>
                )}

                {selectedPreset.id === "boishakh-alpona" && (
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(239,68,68,0.25),transparent_70%)]" />
                    {/* Alpona Folk Pattern Frame */}
                    <div className="absolute inset-3 border-2 border-dashed border-amber-400/30 rounded-2xl pointer-events-none" />
                    <div className="absolute top-6 left-6 text-xs font-bold text-amber-300 tracking-widest uppercase">
                      🌸 শুভ নববর্ষ ১৪৩৩
                    </div>
                  </div>
                )}

                {selectedPreset.id === "urban-lifestyle" && (
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(234,88,12,0.2),transparent_60%)]" />
                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-stone-950 via-stone-900/90 to-transparent" />
                  </div>
                )}

                {selectedPreset.id === "muslin-heritage" && (
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(217,70,239,0.18),transparent_70%)]" />
                    <div className="absolute -bottom-10 inset-x-0 h-48 bg-gradient-to-t from-purple-950/60 to-transparent" />
                  </div>
                )}
              </div>

              {/* Dynamic Product Visual Based on Preset Category */}
              <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                {selectedPreset.id === "eid-dhamaka" && (
                  <div className="relative w-64 md:w-72 drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]">
                    <svg viewBox="0 0 300 360" fill="none" className="w-full h-auto">
                      <ellipse cx="150" cy="330" rx="100" ry="18" fill="#042f2e" opacity="0.7" />
                      <ellipse cx="150" cy="326" rx="80" ry="14" fill="#0d9488" />
                      <path
                        d="M110 50 C125 70 175 70 190 50 L230 110 L195 130 L185 300 H115 L105 130 L70 110 Z"
                        fill="#0f766e"
                        stroke="#fbbf24"
                        strokeWidth="2"
                      />
                      <path d="M144 58 H156 V160 H144 Z" fill="#f59e0b" />
                      <circle cx="150" cy="75" r="2.5" fill="#fef08a" />
                      <circle cx="150" cy="95" r="2.5" fill="#fef08a" />
                      <circle cx="150" cy="115" r="2.5" fill="#fef08a" />
                    </svg>
                  </div>
                )}

                {selectedPreset.id === "minimal-studio" && (
                  <div className="relative w-44 md:w-52 drop-shadow-[0_25px_30px_rgba(15,23,42,0.35)]">
                    {/* High-end Cosmetic Serum Bottle */}
                    <svg viewBox="0 0 200 320" fill="none" className="w-full h-auto">
                      {/* Pedestal */}
                      <ellipse cx="100" cy="300" rx="80" ry="14" fill="#cbd5e1" />
                      <rect x="30" y="285" width="140" height="15" rx="4" fill="#e2e8f0" />
                      {/* Dropper */}
                      <rect x="92" y="10" width="16" height="30" rx="3" fill="#0f172a" />
                      <rect x="85" y="40" width="30" height="18" rx="2" fill="#d97706" />
                      {/* Glass Bottle Body */}
                      <rect x="55" y="60" width="90" height="210" rx="16" fill="#1e293b" />
                      <rect x="60" y="65" width="80" height="200" rx="12" fill="#0f172a" />
                      <rect x="68" y="110" width="64" height="100" rx="4" fill="#ffffff" />
                      <rect x="76" y="125" width="48" height="6" rx="2" fill="#0f172a" />
                      <rect x="80" y="137" width="40" height="4" rx="2" fill="#64748b" />
                      <rect x="84" y="146" width="32" height="3" rx="1" fill="#94a3b8" />
                      {/* Glass Specular Reflection Highlight */}
                      <path d="M64 75 Q 64 250 68 255" stroke="#ffffff" strokeWidth="3" opacity="0.4" />
                    </svg>
                  </div>
                )}

                {selectedPreset.id === "boishakh-alpona" && (
                  <div className="relative w-64 md:w-72 drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
                    {/* Traditional Red-White Saree Display */}
                    <svg viewBox="0 0 300 360" fill="none" className="w-full h-auto">
                      <ellipse cx="150" cy="335" rx="90" ry="16" fill="#450a0a" opacity="0.6" />
                      <path
                        d="M110 50 C125 70 175 70 190 50 L235 110 L200 130 L190 310 H110 L100 130 L65 110 Z"
                        fill="#fafafa"
                        stroke="#dc2626"
                        strokeWidth="3"
                      />
                      {/* Red Saree Border & Pallu */}
                      <path d="M110 50 L190 50 L160 310 H110 Z" fill="#b91c1c" />
                      <path d="M100 130 L65 110 L80 160 Z" fill="#dc2626" />
                      <circle cx="150" cy="180" r="14" fill="#fef08a" opacity="0.8" />
                    </svg>
                  </div>
                )}

                {selectedPreset.id === "urban-lifestyle" && (
                  <div className="relative w-64 md:w-72 drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]">
                    {/* Modern Streetwear Sneaker Vector */}
                    <svg viewBox="0 0 320 220" fill="none" className="w-full h-auto">
                      <ellipse cx="160" cy="205" rx="120" ry="12" fill="#0c0a09" opacity="0.8" />
                      <path
                        d="M50 160 C50 140 80 120 120 100 L180 90 L220 120 L270 130 C280 140 285 160 270 175 L60 175 Z"
                        fill="#ea580c"
                      />
                      <path
                        d="M60 175 L270 175 C275 190 260 195 240 195 H60 C45 195 45 175 60 175 Z"
                        fill="#ffffff"
                      />
                      <path d="M120 100 L180 90 L160 140 L100 140 Z" fill="#18181b" />
                      {/* Swoosh accent */}
                      <path
                        d="M90 145 Q 160 120 240 135"
                        stroke="#fbbf24"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}

                {selectedPreset.id === "muslin-heritage" && (
                  <div className="relative w-52 md:w-60 drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)]">
                    {/* Luxury Gold Chronograph Watch */}
                    <svg viewBox="0 0 240 300" fill="none" className="w-full h-auto">
                      <ellipse cx="120" cy="285" rx="70" ry="10" fill="#020617" opacity="0.8" />
                      {/* Leather Strap */}
                      <rect x="95" y="20" width="50" height="260" rx="6" fill="#3b0764" />
                      {/* Gold Bezel */}
                      <circle cx="120" cy="150" r="55" fill="#f59e0b" stroke="#fef08a" strokeWidth="4" />
                      <circle cx="120" cy="150" r="46" fill="#09090b" />
                      {/* Dial Hands */}
                      <line x1="120" y1="150" x2="120" y2="120" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
                      <line x1="120" y1="150" x2="142" y2="150" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="120" cy="150" r="4" fill="#fbbf24" />
                    </svg>
                  </div>
                )}
              </div>

              {/* ========================================================== */}
              {/* INTERACTIVE OVERLAY BADGES ON CANVAS                      */}
              {/* ========================================================== */}
              {/* Top-Right: Flat % Off Sticker */}
              {showDiscountBadge && (
                <div className="absolute top-5 right-5 z-20 animate-in fade-in zoom-in duration-300">
                  <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white font-black text-sm shadow-xl shadow-red-600/40 border-2 border-white/30 flex items-center gap-1.5">
                    <span>🔥</span>
                    <span>{discountAmount} {lang === "bn" ? "ছাড়" : "OFF"}</span>
                  </div>
                </div>
              )}

              {/* Top-Left: Festive Collection Ribbon */}
              <div className="absolute top-5 left-5 z-20">
                <div className="px-3 py-1 rounded-xl glass-panel border border-white/20 text-white font-bold text-xs backdrop-blur-md shadow-lg flex items-center gap-1.5">
                  <span>{selectedPreset.id === "eid-dhamaka" ? "🌙" : "✨"}</span>
                  <span>{lang === "bn" ? selectedPreset.nameBn : selectedPreset.nameEn}</span>
                </div>
              </div>

              {/* Bottom-Left: Free Delivery Ribbon */}
              {showDeliveryBadge && (
                <div className="absolute bottom-5 left-5 z-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-600/90 text-white font-bold text-xs shadow-xl border border-emerald-400/50 flex items-center gap-1.5 backdrop-blur-md">
                    <Truck className="w-3.5 h-3.5 text-white" />
                    <span>{lang === "bn" ? "সারা দেশে ফ্রি ডেলিভারি" : "Free Delivery All Over BD"}</span>
                  </div>
                </div>
              )}

              {/* Bottom-Right: Limited Stock Tag */}
              {showUrgencyBadge && (
                <div className="absolute bottom-5 right-5 z-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="px-3 py-1 rounded-xl bg-amber-500/90 text-slate-950 font-extrabold text-[11px] shadow-lg border border-amber-300 flex items-center gap-1">
                    <span>⚡</span>
                    <span>{lang === "bn" ? "স্টক সীমিত" : "Limited Stock"}</span>
                  </div>
                </div>
              )}

              {/* Center-Bottom: BDT Price Tag Pill */}
              {showPriceTag && (
                <div className="absolute bottom-16 inset-x-0 flex justify-center z-20 animate-in fade-in zoom-in duration-300">
                  <div className="px-5 py-2 rounded-full bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-extrabold text-base sm:text-lg shadow-2xl flex items-center gap-2">
                    <span className="text-white text-xs font-semibold uppercase">
                      {lang === "bn" ? "দাম:" : "Price:"}
                    </span>
                    <span>৳ {priceAmount}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Export & Resolution Bar */}
            <div className="w-full max-w-[500px] mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-base text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>{lang === "bn" ? "ব্যানার প্রস্তুত হচ্ছে..." : "Preparing Banner..."}</span>
                  </>
                ) : exportComplete ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                    <span>{lang === "bn" ? "ডাউনলোড সফল!" : "Downloaded Successfully!"}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 text-stone-950" />
                    <span>{t.demo.downloadMockup}</span>
                  </>
                )}
              </button>

              <a
                href="/studio"
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs hover:border-stone-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {lang === "bn"
                    ? "নিজের ছবি দিয়ে স্টুডিও খুলুন →"
                    : "Launch Full Studio with Your Photos →"}
                </span>
              </a>
            </div>

            <p className="mt-3 text-xs text-stone-500 text-center">
              ✓ {t.demo.resolutionNote} • Facebook Feed 1:1 Optimized
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
