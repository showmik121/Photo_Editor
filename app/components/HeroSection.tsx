"use client";

import React, { useState, useRef, useCallback } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw } from "lucide-react";
import { Language, translations } from "../data/locales";

interface HeroSectionProps {
  lang: Language;
}

export function HeroSection({ lang }: HeroSectionProps) {
  const t = translations[lang];
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#FBFBFA]">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-200/30 via-orange-100/20 to-emerald-100/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-amber-100/30 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm font-semibold shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <span>{t.hero.tag}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 leading-[1.2] sm:leading-[1.18]">
            {t.hero.titleStart}{" "}
            <span className="relative inline-block text-amber-600 underline decoration-amber-400 decoration-wavy decoration-from-font">
              {t.hero.titleHighlight}
            </span>{" "}
            {t.hero.titleEnd}
          </h1>

          <p className="mt-5 text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Action CTAs (Minimalist Pills) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="/studio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-base text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-stone-950" />
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-5 h-5 text-stone-950" />
            </a>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-base text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs hover:border-stone-300 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{t.hero.ctaSecondary}</span>
            </a>
          </div>

          {/* Trust Highlights Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-stone-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === "bn" ? "কোনো ক্রেডিট কার্ড ছাড়াই বিকাশ পেমেন্ট" : "bKash & Nagad instant checkout"}</span>
            </div>
            <div className="hidden sm:inline text-stone-300">•</div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{lang === "bn" ? "প্রতিদিন ৫টি ব্যানার একদম ফ্রি" : "5 free banners every day"}</span>
            </div>
            <div className="hidden sm:inline text-stone-300">•</div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>{lang === "bn" ? "১০০% বাংলা ইউনিকোড ফন্ট সাপোর্ট" : "Flawless Bengali Unicode typography"}</span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SHOWCASE PRODUCT GALLERY ROW (INSPIRATION FROM USER REFERENCE)   */}
        {/* ================================================================ */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="text-center mb-5">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
              {lang === "bn" ? "স্টুডিও ব্যাকগ্রাউন্ড গ্যালারি" : "Studio Style Showcase"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
            {/* 1. Lemon / Citrus on Natural Wood */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] to-[#F5ECE1] border border-stone-200/90 p-3 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-between text-center aspect-[4/5]">
              <div className="w-full flex justify-between items-center text-[10px] text-stone-400 font-mono">
                <span>01</span>
                <span className="text-amber-600">🍋 Fresh</span>
              </div>
              <div className="relative my-auto flex items-center justify-center">
                <div className="w-16 h-20 rounded-xl bg-amber-100/60 border border-amber-200/80 flex items-center justify-center shadow-inner">
                  <span className="text-2xl">🍋</span>
                </div>
              </div>
              <div className="text-[11px] font-bold text-stone-800">
                {lang === "bn" ? "ন্যাচারাল উড" : "Natural Wood"}
              </div>
            </div>

            {/* 2. Dropper Serum on Stone */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-b from-[#F9F8F6] to-[#E9E4DC] border border-stone-200/90 p-3 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-between text-center aspect-[4/5]">
              <div className="w-full flex justify-between items-center text-[10px] text-stone-400 font-mono">
                <span>02</span>
                <span className="text-amber-600">✨ Serum</span>
              </div>
              <div className="relative my-auto flex items-center justify-center">
                <div className="w-16 h-20 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shadow-inner">
                  <span className="text-2xl">🧴</span>
                </div>
              </div>
              <div className="text-[11px] font-bold text-stone-800">
                {lang === "bn" ? "স্টোন পেডেস্টাল" : "Stone Podium"}
              </div>
            </div>

            {/* 3. Green Bottle on Column with Monstera Foliage */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-b from-[#F2F7F4] to-[#DEEBE3] border border-stone-200/90 p-3 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-between text-center aspect-[4/5]">
              <div className="w-full flex justify-between items-center text-[10px] text-stone-400 font-mono">
                <span>03</span>
                <span className="text-emerald-700">🌿 Organic</span>
              </div>
              <div className="relative my-auto flex items-center justify-center">
                <div className="w-16 h-20 rounded-xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center shadow-inner">
                  <span className="text-2xl">🌿</span>
                </div>
              </div>
              <div className="text-[11px] font-bold text-stone-800">
                {lang === "bn" ? "মনস্টেরা লিফ" : "Tropical Leaf"}
              </div>
            </div>

            {/* 4. Ocean Clear Water Block */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-b from-[#F0F8FF] to-[#D9ECFA] border border-stone-200/90 p-3 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-between text-center aspect-[4/5]">
              <div className="w-full flex justify-between items-center text-[10px] text-stone-400 font-mono">
                <span>04</span>
                <span className="text-sky-600">🌊 Aqua</span>
              </div>
              <div className="relative my-auto flex items-center justify-center">
                <div className="w-16 h-20 rounded-xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center shadow-inner">
                  <span className="text-2xl">🧊</span>
                </div>
              </div>
              <div className="text-[11px] font-bold text-stone-800">
                {lang === "bn" ? "আইস ওয়াটার" : "Ice & Water"}
              </div>
            </div>

            {/* 5. Terracotta Desert Arch */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF5ED] to-[#EBD5C5] border border-stone-200/90 p-3 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-between text-center aspect-[4/5]">
              <div className="w-full flex justify-between items-center text-[10px] text-stone-400 font-mono">
                <span>05</span>
                <span className="text-orange-700">🏜️ Dunes</span>
              </div>
              <div className="relative my-auto flex items-center justify-center">
                <div className="w-16 h-20 rounded-xl bg-orange-500/15 border border-orange-400/40 flex items-center justify-center shadow-inner">
                  <span className="text-2xl">🏺</span>
                </div>
              </div>
              <div className="text-[11px] font-bold text-stone-800">
                {lang === "bn" ? "ডেজার্ট আর্চ" : "Desert Arch"}
              </div>
            </div>

            {/* 6. Luxury Silk Velvet Fabric */}
            <div className="group rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF5FF] to-[#EBD9FA] border border-stone-200/90 p-3 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-between text-center aspect-[4/5]">
              <div className="w-full flex justify-between items-center text-[10px] text-stone-400 font-mono">
                <span>06</span>
                <span className="text-purple-600">👑 Silk</span>
              </div>
              <div className="relative my-auto flex items-center justify-center">
                <div className="w-16 h-20 rounded-xl bg-purple-500/15 border border-purple-400/40 flex items-center justify-center shadow-inner">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <div className="text-[11px] font-bold text-stone-800">
                {lang === "bn" ? "লাক্সারি সিল্ক" : "Royal Silk"}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* INTERACTIVE BEFORE/AFTER SLIDER                                  */}
        {/* ================================================================ */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="text-center mb-3">
            <span className="text-xs font-semibold text-stone-700 tracking-wider uppercase inline-flex items-center gap-1.5 bg-stone-100 px-3.5 py-1.5 rounded-full border border-stone-200">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
              {t.hero.sliderDragHint}
            </span>
          </div>

          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden border border-stone-200/90 shadow-xl shadow-stone-200/50 cursor-ew-resize select-none bg-white"
          >
            {/* ------------------------------------------------------------- */}
            {/* RIGHT SIDE (FULL WIDTH BACKGROUND): "AFTER" (STUDIO BANNER)   */}
            {/* ------------------------------------------------------------- */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 flex items-center justify-center overflow-hidden">
              {/* Studio Backdrop Aesthetic elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.25),transparent_70%)]" />
              <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

              {/* Decorative Geometric Alpona / Crescent subtle overlay */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <span>🌙</span>
                  <span>{lang === "bn" ? "ঈদ স্পেশাল ২০২৬" : "Eid Special 2026"}</span>
                </span>
              </div>

              {/* Top Right Promotional Badges in Studio */}
              <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-sm shadow-xl shadow-red-600/40 border border-red-400/40">
                  {lang === "bn" ? "🔥 ৫০% ছাড়" : "🔥 50% OFF"}
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-xs font-bold shadow-md backdrop-blur-md">
                  {lang === "bn" ? "🚚 ফ্রি হোম ডেলিভারি" : "🚚 Free Delivery"}
                </div>
              </div>

              {/* Studio Product Rendering: High-end Panjabi on Podium */}
              <div className="relative flex flex-col items-center justify-center transform -translate-y-2">
                {/* Simulated Studio Glow & Shadow */}
                <div className="relative z-10 w-48 sm:w-64 md:w-72">
                  <svg
                    viewBox="0 0 300 360"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]"
                  >
                    {/* Architectural Gold Stand Podium */}
                    <ellipse cx="150" cy="330" rx="110" ry="22" fill="#042f2e" opacity="0.6" />
                    <ellipse cx="150" cy="326" rx="90" ry="16" fill="url(#podiumGradient)" />
                    <path d="M60 326 H240 V338 H60 Z" fill="#0d9488" opacity="0.3" />

                    {/* Premium Panjabi Silhouette with Embroidery */}
                    <path
                      d="M110 50 C125 70 175 70 190 50 L230 110 L195 130 L185 300 H115 L105 130 L70 110 Z"
                      fill="url(#panjabiFabric)"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                    {/* Royal Gold Chest Placket / Collar */}
                    <path d="M144 58 H156 V160 H144 Z" fill="url(#goldPlacket)" />
                    {/* Buttons */}
                    <circle cx="150" cy="75" r="2.5" fill="#fef08a" />
                    <circle cx="150" cy="95" r="2.5" fill="#fef08a" />
                    <circle cx="150" cy="115" r="2.5" fill="#fef08a" />
                    <circle cx="150" cy="135" r="2.5" fill="#fef08a" />

                    {/* Royal Sheen and Shading */}
                    <path
                      d="M115 52 L144 58 V300 H115 Z"
                      fill="#ffffff"
                      opacity="0.08"
                    />

                    <defs>
                      <linearGradient id="podiumGradient" x1="60" y1="326" x2="240" y2="326">
                        <stop offset="0%" stopColor="#134e4a" />
                        <stop offset="50%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#0f766e" />
                      </linearGradient>
                      <linearGradient id="panjabiFabric" x1="150" y1="50" x2="150" y2="300">
                        <stop offset="0%" stopColor="#0f766e" />
                        <stop offset="40%" stopColor="#115e59" />
                        <stop offset="100%" stopColor="#042f2e" />
                      </linearGradient>
                      <linearGradient id="goldPlacket" x1="144" y1="58" x2="156" y2="160">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Studio Bottom Price Pill */}
                <div className="absolute -bottom-4 z-20 px-5 py-2 rounded-full bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-black text-base sm:text-lg shadow-2xl flex items-center gap-2">
                  <span className="text-white text-xs font-medium uppercase tracking-wide">
                    {lang === "bn" ? "অফার মূল্য:" : "Special Price:"}
                  </span>
                  <span>৳ ১,৪৯০</span>
                  <span className="text-xs line-through text-slate-500 font-normal">৳ ২,৯৯০</span>
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-lg backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "প্রোডাক্ট দেখে পেমেন্ট করুন" : "Inspect before payment"}</span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* LEFT SIDE (CLIPPED): "BEFORE" (RAW PHONE PHOTO ON BEDSHEET)   */}
            {/* ------------------------------------------------------------- */}
            <div
              className="absolute inset-0 overflow-hidden bg-stone-800"
              style={{ width: `${sliderPosition}%` }}
            >
              <div
                className="absolute inset-0 bg-[#2d2926] flex items-center justify-center"
                style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%" }}
              >
                {/* Raw, unflattering background simulation: crumpled bedsheet texture, yellow light bulb */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,#574735_0%,#26211c_80%)] opacity-90" />

                {/* Crumpled bedsheet wrinkle lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 100 Q 200 150 400 80 T 800 120" stroke="#000" strokeWidth="4" fill="none" />
                  <path d="M50 250 Q 250 200 450 300 T 900 220" stroke="#000" strokeWidth="6" fill="none" />
                  <path d="M-50 400 Q 300 350 650 420" stroke="#000" strokeWidth="5" fill="none" />
                </svg>

                {/* Distracting messy background details */}
                <div className="absolute top-4 left-4 bg-black/60 border border-white/10 px-2 py-1 rounded text-[10px] text-amber-200 font-mono">
                  ⚠️ 20W CFL Bulb Lighting (Harsh Yellow Cast)
                </div>
                <div className="absolute bottom-6 left-6 text-stone-500 text-xs italic">
                  [বিছানার চাদরে তোলা সাধারণ ছবি]
                </div>

                {/* Flat, poorly-lit Panjabi without background removal */}
                <div className="relative w-48 sm:w-64 md:w-72 transform -translate-y-2 opacity-85 filter contrast-90 brightness-90 hue-rotate-15">
                  <svg
                    viewBox="0 0 300 360"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-[5px_10px_2px_rgba(0,0,0,0.4)]"
                  >
                    <path
                      d="M110 50 C125 70 175 70 190 50 L230 110 L195 130 L185 300 H115 L105 130 L70 110 Z"
                      fill="#28534f"
                      stroke="#4d7c77"
                      strokeWidth="1"
                    />
                    <path d="M144 58 H156 V160 H144 Z" fill="#a16207" />
                    <circle cx="150" cy="75" r="2" fill="#78350f" />
                    <circle cx="150" cy="95" r="2" fill="#78350f" />
                    <circle cx="150" cy="115" r="2" fill="#78350f" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* DRAGGABLE SLIDER DIVIDER LINE & HANDLE                         */}
            {/* ------------------------------------------------------------- */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 z-30 shadow-md cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-stone-900 shadow-md flex items-center justify-center text-stone-900 font-bold text-xs hover:scale-110 active:scale-95 transition-transform">
                <span className="flex items-center gap-0.5">
                  ◀▶
                </span>
              </div>
            </div>

            {/* Labels on opposite sides */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-sm text-white text-xs font-semibold shadow-xs">
                {t.hero.sliderRawLabel}
              </span>
            </div>
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-emerald-900/80 backdrop-blur-sm text-emerald-200 text-xs font-bold shadow-xs">
                {t.hero.sliderStudioLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 text-center border border-stone-200 shadow-2xs">
            <div className="text-3xl sm:text-4xl font-extrabold text-stone-950">
              {t.hero.stat1Value}
            </div>
            <div className="text-sm font-medium text-stone-500 mt-1">
              {t.hero.stat1Label}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center border border-stone-200 shadow-2xs">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">
              {t.hero.stat2Value}
            </div>
            <div className="text-sm font-medium text-stone-500 mt-1">
              {t.hero.stat2Label}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center border border-stone-200 shadow-2xs">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
              {t.hero.stat3Value}
            </div>
            <div className="text-sm font-medium text-stone-500 mt-1">
              {t.hero.stat3Label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
