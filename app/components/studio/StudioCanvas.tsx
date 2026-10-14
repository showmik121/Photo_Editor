"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import {
  Download,
  Copy,
  Sparkles,
  Truck,
  ShieldCheck,
  Scissors,
} from "lucide-react";
import { Language } from "../../data/locales";
import {
  StudioPreset,
  CustomCardState,
  defaultCustomCardState,
} from "../../data/studioPresets";
import { BadgeState, PriceTagStyle } from "./BadgeEngine";
import { ProductTransformState } from "./ProductControls";
import { AspectRatio } from "./AspectSelector";
import { PhotoEnhanceState } from "./PhotoEnhanceControls";
import { useToast } from "../Toast";

interface StudioCanvasProps {
  productImage: string | null;
  selectedPreset: StudioPreset;
  customCard?: CustomCardState;
  badges: BadgeState;
  onBadgesChange?: (badges: BadgeState) => void;
  transform: ProductTransformState;
  onTransformChange: (transform: ProductTransformState) => void;
  aspect: AspectRatio;
  lightingIntensity: number;
  showPedestal: boolean;
  enhance: PhotoEnhanceState;
  onRemoveBg?: () => void;
  isRemovingBg?: boolean;
  hasOriginal?: boolean;
  showingOriginal?: boolean;
  onToggleOriginal?: (showOriginal: boolean) => void;
  lang: Language;
}

export type ExtendedCustomCardState = Omit<CustomCardState, "surfaceType"> & {
  surfaceType:
    | CustomCardState["surfaceType"]
    | "soft-gradient"
    | "linen-texture"
    | "geometric-minimal";
  useCustomBgColor?: boolean;
  customBgColor?: string;
  gradientEnabled?: boolean;
  gradientAngle?: number;
  gradientColor1?: string;
  gradientColor2?: string;
  canvasPadding?: number;
  borderStyle?: "none" | "thin" | "rounded" | "polaroid" | "vintage" | "shadow-frame" | string;
  borderWidth?: number;
  borderColor?: string;
};

export function StudioCanvas({
  productImage,
  selectedPreset,
  customCard,
  badges,
  onBadgesChange,
  transform,
  onTransformChange,
  aspect,
  lightingIntensity,
  showPedestal,
  enhance,
  onRemoveBg,
  isRemovingBg,
  hasOriginal,
  showingOriginal,
  onToggleOriginal,
  lang,
}: StudioCanvasProps) {
  const { toast } = useToast();
  const exportNodeRef = useRef<HTMLDivElement>(null);

  // Guarantee customCard is always safely defined
  const card: ExtendedCustomCardState = (customCard || defaultCustomCardState) as ExtendedCustomCardState;

  const [isExporting, setIsExporting] = useState(false);
  const [isDraggingProduct, setIsDraggingProduct] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Movable Price Badge Drag State
  const [isDraggingPrice, setIsDraggingPrice] = useState(false);
  const [priceDragStart, setPriceDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drag interaction on canvas for direct product repositioning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingProduct(true);
    setDragStart({ x: e.clientX - transform.offsetX, y: e.clientY - transform.offsetY });
  };

  // Direct Drag interaction on Price Badge (Mouse)
  const handlePriceMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering product drag
    setIsDraggingPrice(true);
    setPriceDragStart({
      x: e.clientX - (badges.priceOffsetX || 0),
      y: e.clientY - (badges.priceOffsetY || 0),
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. Moving Price Badge
    if (isDraggingPrice) {
      const maxTopY = aspect === "9:16" ? -480 : -280;
      const maxBottomY = aspect === "9:16" ? 160 : 120;
      const newX = Math.round(Math.min(Math.max(e.clientX - priceDragStart.x, -220), 220));
      const newY = Math.round(Math.min(Math.max(e.clientY - priceDragStart.y, maxTopY), maxBottomY));
      onBadgesChange?.({
        ...badges,
        priceOffsetX: newX,
        priceOffsetY: newY,
        pricePreset: "custom",
      });
      return;
    }

    // 2. Moving Product Layer
    if (!isDraggingProduct) return;
    const newX = Math.min(Math.max(e.clientX - dragStart.x, -160), 160);
    const newY = Math.min(Math.max(e.clientY - dragStart.y, -160), 160);
    onTransformChange({ ...transform, offsetX: Math.round(newX), offsetY: Math.round(newY) });
  };

  const handleMouseUp = () => {
    setIsDraggingProduct(false);
    setIsDraggingPrice(false);
  };

  // Touch event handlers for mobile phone touchscreens
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDraggingProduct(true);
      setDragStart({ x: touch.clientX - transform.offsetX, y: touch.clientY - transform.offsetY });
    }
  };

  const handlePriceTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDraggingPrice(true);
      setPriceDragStart({
        x: touch.clientX - (badges.priceOffsetX || 0),
        y: touch.clientY - (badges.priceOffsetY || 0),
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    // 1. Moving Price Badge via touch
    if (isDraggingPrice) {
      const maxTopY = aspect === "9:16" ? -480 : -280;
      const maxBottomY = aspect === "9:16" ? 160 : 120;
      const newX = Math.round(Math.min(Math.max(touch.clientX - priceDragStart.x, -220), 220));
      const newY = Math.round(Math.min(Math.max(touch.clientY - priceDragStart.y, maxTopY), maxBottomY));
      onBadgesChange?.({
        ...badges,
        priceOffsetX: newX,
        priceOffsetY: newY,
        pricePreset: "custom",
      });
      return;
    }

    // 2. Moving Product Layer via touch
    if (!isDraggingProduct) return;
    const newX = Math.min(Math.max(touch.clientX - dragStart.x, -160), 160);
    const newY = Math.min(Math.max(touch.clientY - dragStart.y, -160), 160);
    onTransformChange({ ...transform, offsetX: Math.round(newX), offsetY: Math.round(newY) });
  };

  const handleTouchEnd = () => {
    setIsDraggingProduct(false);
    setIsDraggingPrice(false);
  };

  // Helper for Price Badge visual styles
  const getPriceTagStyleClasses = (style?: PriceTagStyle) => {
    switch (style) {
      case "luxury-gold":
        return "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-2xl shadow-amber-500/30 border border-amber-300";
      case "minimal-white":
        return "bg-white/95 text-stone-900 font-extrabold border-2 border-stone-300 shadow-2xl shadow-black/30 backdrop-blur-md";
      case "vibrant-red":
        return "bg-gradient-to-r from-rose-600 to-red-600 text-white font-black shadow-2xl shadow-rose-600/40 border-2 border-rose-300";
      case "glass-frost":
        return "bg-slate-900/60 backdrop-blur-xl border-2 border-white/40 text-white font-extrabold shadow-2xl";
      case "emerald-green":
        return "bg-emerald-950/95 border-2 border-emerald-400 text-emerald-200 font-extrabold shadow-2xl shadow-emerald-500/20";
      case "dark-gold":
      default:
        return "bg-slate-950/95 border-2 border-amber-400 text-amber-300 font-extrabold shadow-2xl shadow-amber-500/20";
    }
  };

  // High-Resolution PNG Download
  const handleDownloadPng = async () => {
    if (!exportNodeRef.current) return;
    setIsExporting(true);

    try {
      const targetWidth = 1080;
      const targetHeight = aspect === "1:1" ? 1080 : 1920;

      const dataUrl = await toPng(exportNodeRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        canvasWidth: targetWidth,
        canvasHeight: targetHeight,
        quality: 0.98,
      });

      const link = document.createElement("a");
      const filename = `chobi-studio-${selectedPreset.id}-${aspect === "1:1" ? "1080x1080" : "1080x1920"}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#f59e0b", "#10b981", "#ef4444", "#fbbf24"],
      });

      toast(
        lang === "bn" ? "ব্যানার ডাউনলোড সফল হয়েছে!" : "Banner Downloaded Successfully!",
        lang === "bn" ? `ফেসবুক সাইজ: ${targetWidth}x${targetHeight}px PNG` : `Format: ${targetWidth}x${targetHeight}px High-Res PNG`,
        "success"
      );
    } catch (err) {
      console.error("Export error:", err);
      toast(
        lang === "bn" ? "ডাউনলোডে ত্রুটি ঘটেছে" : "Export Failed",
        lang === "bn" ? "দয়া করে আবার চেষ্টা করুন।" : "Please try again.",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to Clipboard
  const handleCopyToClipboard = async () => {
    if (!exportNodeRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(exportNodeRef.current, {
        cacheBust: true,
        pixelRatio: 2.0,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);

        toast(
          lang === "bn" ? "ক্লিপবোর্ডে কপি হয়েছে!" : "Copied to Clipboard!",
          lang === "bn" ? "সরাসরি ফেসবুকে পেস্ট করতে পারবেন (Ctrl+V)" : "Ready to paste directly on Facebook (Ctrl+V)",
          "success"
        );
      } else {
        toast(
          lang === "bn" ? "ক্লিপবোর্ড সাপোর্ট পাওয়া যায়নি" : "Clipboard API Not Supported",
          lang === "bn" ? "দয়া করে ডাউনলোড বাটন ব্যবহার করুন।" : "Please use the download button instead.",
          "info"
        );
      }
    } catch (err) {
      console.error("Clipboard copy error:", err);
      toast(
        lang === "bn" ? "ক্লিপবোর্ডে কপি করা যায়নি" : "Clipboard Copy Failed",
        lang === "bn" ? "ব্রাউজার পারমিশন চেক করুন বা ডাউনলোড করুন।" : "Check browser permission or use Download button.",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Surface Tone Background Styling
  const getSurfaceBackground = () => {
    if (card.useCustomBgColor && card.customBgColor) {
      return "";
    }
    if (card.gradientEnabled && card.gradientColor1 && card.gradientColor2) {
      return "";
    }
    if (card.surfaceType === "concrete-grey") {
      return "bg-gradient-to-br from-[#F1F5F9] via-[#E2E8F0] to-[#CBD5E1]";
    }
    if (card.surfaceType === "warm-plaster") {
      return "bg-gradient-to-br from-[#FAF7F2] via-[#F3ECE1] to-[#E8DFC8]";
    }
    if (card.surfaceType === "offwhite-brush") {
      return "bg-gradient-to-br from-[#FCFBF9] via-[#F8F6F0] to-[#EFECE5]";
    }
    if (card.surfaceType === "soft-gradient") {
      return "bg-[#f5f7fa]";
    }
    if (card.surfaceType === "linen-texture") {
      return "bg-[#f8f6f0]";
    }
    if (card.surfaceType === "geometric-minimal") {
      return "bg-[#f8fafc]";
    }
    if (card.surfaceType === "desert-dunes") {
      return "bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#F5EBE1]";
    }
    if (card.surfaceType === "travertine-courtyard") {
      return "bg-[#E8DFC8]";
    }
    if (card.surfaceType === "stone-wall") {
      return "bg-[#EFE8DE]";
    }
    if (card.surfaceType === "terracotta") {
      return "bg-gradient-to-br from-[#9E381E] via-[#B8472B] to-[#78230D]";
    }

    switch (card.surfaceTone) {
      case "warm-sand":
        return "bg-gradient-to-br from-[#F5EBE1] via-[#EFE6DA] to-[#E3D7C7]";
      case "cool-grey":
        return "bg-gradient-to-br from-[#F1F5F9] via-[#E2E8F0] to-[#CBD5E1]";
      case "dark-charcoal":
        return "bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617]";
      case "rich-terracotta":
        return "bg-gradient-to-br from-[#450A0A] via-[#7F1D1D] to-[#2B0606]";
      case "emerald-luxury":
        return "bg-gradient-to-br from-[#064E3B] via-[#022C22] to-[#011B14]";
      case "pure-white":
        return "bg-white";
      default:
        return `bg-gradient-to-br ${selectedPreset.bgGradient}`;
    }
  };

  const isLightTone =
    card.surfaceTone === "warm-sand" ||
    card.surfaceTone === "cool-grey" ||
    card.surfaceTone === "pure-white" ||
    card.surfaceType === "soft-gradient" ||
    card.surfaceType === "linen-texture" ||
    card.surfaceType === "geometric-minimal" ||
    card.surfaceType === "desert-dunes" ||
    card.surfaceType === "travertine-courtyard" ||
    card.surfaceType === "stone-wall" ||
    card.surfaceType === "offwhite-brush" ||
    card.surfaceType === "warm-plaster" ||
    card.surfaceType === "concrete-grey";

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-4">
      {/* Dimension & Canvas Header Pill with Quick BG Removal Action */}
      <div className="w-full flex items-center justify-between px-2 text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {aspect === "1:1" ? "১০৮০ × ১০৮০ px" : "১০৮০ × ১৯২০ px"}
          </span>
        </div>

        {/* Quick Background Removal & Original Switcher */}
        <div className="flex items-center gap-2">
          {onRemoveBg && (
            <button
              onClick={onRemoveBg}
              disabled={isRemovingBg}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-70"
              title="Remove background from this product photo"
            >
              {isRemovingBg ? (
                <>
                  <div className="w-3 h-3 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>{lang === "bn" ? "কাটা হচ্ছে..." : "Removing..."}</span>
                </>
              ) : (
                <>
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "ব্যাকগ্রাউন্ড মুছুন" : "Remove BG"}</span>
                </>
              )}
            </button>
          )}

          {hasOriginal && (
            <div className="flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
              <button
                onClick={() => onToggleOriginal?.(true)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  showingOriginal
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {lang === "bn" ? "আসল" : "Original"}
              </button>
              <button
                onClick={() => onToggleOriginal?.(false)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  !showingOriginal
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {lang === "bn" ? "কাটআউট" : "Cutout"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* THE COMPOSITE EXPORT CONTAINER (HTML-TO-IMAGE TARGET)               */}
      {/* =================================================================== */}
      <div
        ref={exportNodeRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          aspectRatio: aspect === "1:1" ? "1 / 1" : "9 / 16",
          ...(card.useCustomBgColor && card.customBgColor ? { backgroundColor: card.customBgColor } : {}),
          ...(card.gradientEnabled && card.gradientColor1 && card.gradientColor2
            ? {
                background: `linear-gradient(${card.gradientAngle || 135}deg, ${card.gradientColor1}, ${card.gradientColor2})`,
              }
            : {}),
          ...(card.canvasPadding ? { padding: `${card.canvasPadding}px` } : {}),
          ...(card.borderStyle === "thin" ? { border: `${card.borderWidth || 1}px solid ${card.borderColor || '#E5E7EB'}` } : {}),
          ...(card.borderStyle === "rounded" ? { border: `${card.borderWidth || 2}px solid ${card.borderColor || '#E5E7EB'}`, borderRadius: '24px' } : {}),
          ...(card.borderStyle === "polaroid" ? { border: 'none', padding: `${Math.max(card.canvasPadding || 0, 12)}px ${Math.max(card.canvasPadding || 0, 12)}px ${Math.max(card.canvasPadding || 0, 48)}px`, backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } : {}),
          ...(card.borderStyle === "vintage" ? { border: `${card.borderWidth || 3}px double ${card.borderColor || '#D4A574'}`, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' } : {}),
          ...(card.borderStyle === "shadow-frame" ? { boxShadow: `0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)`, border: `${card.borderWidth || 1}px solid ${card.borderColor || 'rgba(0,0,0,0.06)'}` } : {}),
        }}
        className={`relative w-full rounded-3xl overflow-hidden border border-stone-200/90 shadow-xl shadow-stone-200/50 select-none cursor-move touch-none transition-all duration-300 ${
          getSurfaceBackground()
        } ${isDraggingProduct ? "ring-2 ring-amber-400" : ""}`}
      >
        {/* ================================================================= */}
        {/* 1. SURFACE TEXTURES & PATTERNS (TILES / ARCH / PODIUM)            */}
        {/* ================================================================= */}
        {/* A. Ceramic Tiles Grid Pattern (Exact match to Image 3: Raw Stitch Flatlay) */}
        {card.surfaceType === "tiles" && card.showTileGrid && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#F4EEE5]" />
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ceramicTilePattern" width="130" height="130" patternUnits="userSpaceOnUse">
                  <rect x="2" y="2" width="126" height="126" fill="#F7F2EB" rx="1.5" />
                  <line x1="2" y1="2" x2="128" y2="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                  <line x1="2" y1="2" x2="2" y2="128" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                  <line x1="2" y1="128" x2="128" y2="128" stroke="rgba(140,120,100,0.22)" strokeWidth="1.5" />
                  <line x1="128" y1="2" x2="128" y2="128" stroke="rgba(140,120,100,0.22)" strokeWidth="1.5" />
                </pattern>
                <filter id="tileSpeckle">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.18  0 0 0 0 0.15  0 0 0 0.08 0" />
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#ceramicTilePattern)" />
              <rect width="100%" height="100%" filter="url(#tileSpeckle)" />
            </svg>
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 48% 38%, rgba(255,255,255,0.65) 0%, rgba(244,238,229,0.2) 60%, rgba(220,208,192,0.35) 100%)",
              }}
            />
          </div>
        )}

        {/* B. Desert Dunes & Surreal Arch (Like Images 2 & 4) */}
        {card.surfaceType === "desert-arch" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB]/40 via-[#FDF6E2] to-[#E8C59C]" />

            {/* Distant Dunes SVG */}
            <svg viewBox="0 0 800 600" className="absolute bottom-16 inset-x-0 w-full h-auto opacity-75" preserveAspectRatio="none">
              <path d="M0 400 Q 200 340 450 380 T 800 350 L 800 600 L 0 600 Z" fill="#D8A977" />
              <path d="M0 430 Q 300 380 600 420 T 800 400 L 800 600 L 0 600 Z" fill="#C9935B" />
            </svg>

            {/* Architectural Sandstone Arch Foreground */}
            <div className="absolute inset-0 border-[40px] sm:border-[55px] border-[#D1A67B]/70 rounded-t-[180px] pointer-events-none drop-shadow-2xl" />
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#D1A67B]/60 to-transparent" />
          </div>
        )}

        {/* C. Marble Base Floor (Like Image 3/Luxury) */}
        {card.surfaceType === "podium-marble" && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <path d="M10 0 Q 35 45 70 80 T 95 100" stroke="white" strokeWidth="0.8" fill="none" />
              <path d="M0 40 Q 40 60 60 100" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        )}

        {/* D. Neutral Grey Concrete (ILYN / Apex / Sailor Commercial Studio) */}
        {card.surfaceType === "concrete-grey" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <filter id="concreteNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.2  0 0 0 0 0.25  0 0 0 0.18 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#concreteNoise)" />
            </svg>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 18%, rgba(255, 255, 255, 0.45) 0%, rgba(203, 213, 225, 0.1) 50%, transparent 80%)",
              }}
            />
          </div>
        )}

        {/* E. Soft Warm Plaster (High-End Fashion & Artisan Wear) */}
        {card.surfaceType === "warm-plaster" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 800 800" preserveAspectRatio="none">
              <defs>
                <linearGradient id="plasterWash" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#D6C7B2" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#B49D82" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path d="M0 140 Q 260 80 500 160 T 800 120 L 800 800 L 0 800 Z" fill="url(#plasterWash)" />
              <path d="M0 320 Q 340 240 620 330 T 800 280 L 800 800 L 0 800 Z" fill="#E8DFC8" opacity="0.25" />
            </svg>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 45% 20%, rgba(254, 243, 199, 0.35) 0%, rgba(245, 235, 224, 0.15) 55%, transparent 85%)",
              }}
            />
          </div>
        )}

        {/* F. Studio Off-White with Subtle Brush Texture (Apex Lookbook) */}
        {card.surfaceType === "offwhite-brush" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="brushHatch" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
                  <line x1="0" y1="10" x2="60" y2="10" stroke="#78716C" strokeWidth="0.8" strokeDasharray="18 12 8 22" />
                  <line x1="0" y1="25" x2="60" y2="25" stroke="#A8A29E" strokeWidth="0.6" strokeDasharray="25 8 15 12" />
                  <line x1="0" y1="40" x2="60" y2="40" stroke="#78716C" strokeWidth="0.9" strokeDasharray="12 18 20 10" />
                  <line x1="0" y1="55" x2="60" y2="55" stroke="#A8A29E" strokeWidth="0.5" strokeDasharray="30 10 10 10" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#brushHatch)" />
            </svg>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.75) 0%, rgba(248, 246, 240, 0.2) 60%, transparent 90%)",
              }}
            />
          </div>
        )}

        {/* G. Soft Gradient (Apple/Canva Style) */}
        {card.surfaceType === "soft-gradient" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 50%, #c3cfe2 100%)' }}
          />
        )}

        {/* H. Subtle Linen / Canvas Fabric */}
        {card.surfaceType === "linen-texture" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <filter id="linenNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0.12 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#linenNoise)" />
            </svg>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.5) 0%, transparent 70%)' }} />
          </div>
        )}

        {/* I. Subtle Geometric Minimal Shapes */}
        {card.surfaceType === "geometric-minimal" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-8" viewBox="0 0 400 400" preserveAspectRatio="none">
              <circle cx="320" cy="80" r="120" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
              <circle cx="80" cy="320" r="80" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="0.3" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#cbd5e1" strokeWidth="0.3" />
            </svg>
          </div>
        )}

        {/* J. Desert Sand Dunes Horizon with Studio Floor (Exact Match to Image 1: Illiyeen AW26 Platinum) */}
        {card.surfaceType === "desert-dunes" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Radiant glowing sky with sunburst caustics */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6E8] via-[#F8E7CD] to-[#E5C39E]" />
            <div
              className="absolute top-0 inset-x-0 h-3/4 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 18%, rgba(255, 255, 255, 0.98) 0%, rgba(254, 240, 138, 0.6) 30%, rgba(251, 191, 36, 0.2) 55%, transparent 80%)",
              }}
            />

            {/* Fine Desert Atmospheric Dust Shimmer */}
            <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
              <filter id="desertSandNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.45  0 0 0 0 0.25  0 0 0 0.15 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#desertSandNoise)" />
            </svg>

            {/* Distant & Foreground Sculpted Dunes with Directional Sun Shading */}
            <svg viewBox="0 0 1000 700" className="absolute bottom-16 sm:bottom-20 inset-x-0 w-full h-auto drop-shadow-md" preserveAspectRatio="none">
              <defs>
                <linearGradient id="duneDistGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F0D5BA" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#E2BD96" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#CDA073" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="duneMidGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#F5DFCA" />
                  <stop offset="35%" stopColor="#E8C39F" />
                  <stop offset="70%" stopColor="#CE9F72" />
                  <stop offset="100%" stopColor="#B37C4A" />
                </linearGradient>
                <linearGradient id="duneForeGrad" x1="0%" y1="0%" x2="100%" y2="80%">
                  <stop offset="0%" stopColor="#E2B78D" />
                  <stop offset="45%" stopColor="#D5A476" />
                  <stop offset="75%" stopColor="#BC8552" />
                  <stop offset="100%" stopColor="#9C6433" />
                </linearGradient>
              </defs>
              <path d="M0 260 Q 240 180 500 230 T 1000 190 L 1000 700 L 0 700 Z" fill="url(#duneDistGrad)" />
              <path d="M0 310 Q 320 220 640 280 T 1000 240 L 1000 700 L 0 700 Z" fill="url(#duneMidGrad)" />
              <path d="M0 310 Q 320 220 640 280 T 1000 240" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
              <path d="M0 370 Q 280 290 560 340 T 1000 300 L 1000 700 L 0 700 Z" fill="url(#duneForeGrad)" />
              <path d="M0 370 Q 280 290 560 340 T 1000 300" stroke="rgba(255,245,230,0.6)" strokeWidth="2" fill="none" />
              <path d="M0 430 Q 360 360 760 410 T 1000 370 L 1000 700 L 0 700 Z" fill="#935E32" opacity="0.45" />
            </svg>

            {/* Crisp High-Fashion Editorial Horizon Line & Polished Studio Floor */}
            <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-b from-[#FBF5ED] via-[#F3E7D5] to-[#EAD8BF] border-t-2 border-stone-800/70 shadow-[0_-6px_20px_rgba(0,0,0,0.12)] z-5">
              <div
                className="w-full h-full"
                style={{
                  background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.7) 0%, rgba(248,235,215,0.2) 60%, transparent 85%)",
                }}
              />
            </div>
          </div>
        )}

        {/* K. Travertine Courtyard Wall with Sunlight Beam (Exact match to Image 5: Illiyeen Luxury AW26) */}
        {card.surfaceType === "travertine-courtyard" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#E8DFC8]" />
            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <filter id="travertineGrain">
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0 0.16 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#travertineGrain)" />
              <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#C9BA9F" strokeWidth="0.8" opacity="0.6" />
              <line x1="0" y1="52%" x2="100%" y2="52%" stroke="#C9BA9F" strokeWidth="0.8" opacity="0.6" />
              <line x1="0" y1="78%" x2="100%" y2="78%" stroke="#C9BA9F" strokeWidth="0.8" opacity="0.6" />
            </svg>

            {/* Overhead Architectural Travertine Beam casting sharp 42° geometric shadow */}
            <div className="absolute top-0 right-0 w-48 sm:w-60 h-14 sm:h-18 bg-[#F4ECDC] shadow-2xl border-b border-l border-[#D6C5AA] z-5">
              <div className="w-full h-full bg-gradient-to-b from-white/30 to-transparent" />
            </div>

            {/* Sharp crisp diagonal shadow beam cast across the travertine wall */}
            <div
              className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-50"
              style={{
                background: "linear-gradient(132deg, transparent 0%, transparent 40%, rgba(55, 42, 28, 0.45) 41%, rgba(38, 28, 18, 0.58) 100%)",
              }}
            />

            {/* Warm sunlight wash on upper left */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.5) 0%, rgba(254, 243, 199, 0.25) 45%, transparent 75%)",
              }}
            />
          </div>
        )}

        {/* L. Limestone Plaster Wall (Exact match to Image 2: Raw Stitch Drop Shoulder) */}
        {card.surfaceType === "stone-wall" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#EFE8DE]" />
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <filter id="stuccoNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.18  0 0 0 0 0.15  0 0 0 0.18 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#stuccoNoise)" />
              <line x1="0" y1="33%" x2="100%" y2="33%" stroke="#D8CCBA" strokeWidth="0.8" opacity="0.6" />
              <line x1="0" y1="68%" x2="100%" y2="68%" stroke="#D8CCBA" strokeWidth="0.8" opacity="0.6" />
            </svg>
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 35% 20%, rgba(255, 255, 255, 0.75) 0%, rgba(239, 232, 222, 0.15) 55%, rgba(210, 195, 175, 0.35) 100%)",
              }}
            />
          </div>
        )}

        {/* N. Rich Warm Terracotta (Exact match to Image 4: Apex Sharodiya Celebration) */}
        {card.surfaceType === "terracotta" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9E381E] via-[#B8472B] to-[#78230D]" />
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <filter id="terracottaNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0.18 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#terracottaNoise)" />
            </svg>
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 40%, rgba(254, 215, 170, 0.4) 0%, rgba(234, 88, 12, 0.15) 50%, transparent 80%)",
              }}
            />
          </div>
        )}

        {/* M. Custom Gradient Background */}
        {card.gradientEnabled && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(${card.gradientAngle || 135}deg, ${card.gradientColor1 || '#F8FAFC'}, ${card.gradientColor2 || '#E2E8F0'})`,
            }}
          />
        )}

        {/* ================================================================= */}
        {/* 2. ATMOSPHERIC SHADOWS & LIGHTING PROPS (FROM USER PHOTOS)        */}
        {/* ================================================================= */}
        {/* A. Golden Hour Sunbeam / Lens Flare (Like Images 2 & 4) */}
        {card.showSunlightGlow && (
          <div
            className="absolute -top-16 -right-16 w-96 h-96 rounded-full pointer-events-none blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 70%)",
            }}
          />
        )}

        {/* B. Palm Leaf Tropical Overhang & Blurred Cast Shadow (Exact match to Image 1: Raw Stitch & Illiyeen Gobo Daylight) */}
        {card.showPalmShadow && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity"
            style={{ opacity: card.palmShadowOpacity / 100 }}
          >
            {/* Multi-Frond Organic Palm Leaf Gobo Shadow with Natural Feathery Blur */}
            <svg
              className="absolute -top-10 -right-10 w-[520px] h-[520px] text-stone-900/35 blur-[12px]"
              viewBox="0 0 500 500"
              fill="currentColor"
            >
              {/* Central curving rachis stem */}
              <path d="M500 0 Q 340 180 140 380 Q 200 280 500 0 Z" opacity="0.6" />
              {/* 16 Curved Organic Leaflets Radiating Diagonally */}
              <path d="M480 30 C 370 110 260 180 120 270 C 200 230 320 160 470 50 Z" />
              <path d="M490 60 C 390 145 280 215 150 310 C 230 260 340 190 480 85 Z" />
              <path d="M500 90 C 400 180 300 250 170 350 C 250 290 360 220 490 115 Z" />
              <path d="M460 10 C 350 85 240 150 90 230 C 180 195 290 130 450 30 Z" />
              <path d="M430 0 C 330 65 220 125 70 195 C 160 165 270 105 420 15 Z" />
              <path d="M500 130 C 410 220 310 300 200 390 C 275 330 380 250 495 155 Z" />
              <path d="M500 170 C 420 260 330 340 230 430 C 295 365 390 285 490 195 Z" />
              <path d="M500 210 C 430 300 350 380 260 465 C 320 400 410 320 495 235 Z" />
              <path d="M400 0 C 300 50 190 100 50 160 C 140 130 240 80 390 10 Z" />
              <path d="M360 0 C 270 35 160 75 30 130 C 120 100 220 55 350 5 Z" />
            </svg>

            {/* Subtle Dappled Sunlight Caustics between Palm Leaflets */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 75% 25%, rgba(254, 240, 138, 0.25) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)",
              }}
            />

            {/* High-Fashion Botanical Palm Frond Framing Corner */}
            <svg
              className="absolute -top-6 -right-6 w-52 sm:w-64 h-auto drop-shadow-xl"
              viewBox="0 0 240 240"
            >
              <defs>
                <linearGradient id="palmGreen1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B4332" />
                  <stop offset="50%" stopColor="#2D6A4F" />
                  <stop offset="100%" stopColor="#081C15" />
                </linearGradient>
                <linearGradient id="palmGreen2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D6A4F" />
                  <stop offset="60%" stopColor="#40916C" />
                  <stop offset="100%" stopColor="#1B4332" />
                </linearGradient>
              </defs>
              <path d="M240 0 Q 160 80 80 180 Q 120 120 240 0 Z" fill="#081C15" opacity="0.8" />
              <path d="M240 10 C 180 50 120 95 65 145 C 105 120 165 80 235 30 Z" fill="url(#palmGreen1)" />
              <path d="M240 25 C 190 70 135 120 85 175 C 120 145 180 100 235 45 Z" fill="url(#palmGreen2)" />
              <path d="M240 45 C 195 95 145 145 105 205 C 135 170 190 125 235 65 Z" fill="url(#palmGreen1)" />
              <path d="M240 0 C 195 30 145 65 95 110 C 135 90 185 55 235 15 Z" fill="url(#palmGreen2)" />
              <path d="M220 0 C 180 20 135 45 90 85 C 125 65 170 40 215 10 Z" fill="url(#palmGreen1)" />
            </svg>
          </div>
        )}

        {/* C. Window Blinds / Glass Pane Shadow (Exact match to Image 5) */}
        {card.showWindowShadow && (
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-30 blur-[4px]"
            style={{
              background:
                "repeating-linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0px, rgba(15, 23, 42, 0.4) 40px, transparent 40px, transparent 90px)",
            }}
          />
        )}

        {/* D. Kinfolk Lookbook Magazine Prop (Exact match to Image 3: Raw Stitch Ceramic Flatlay) */}
        {card.showKinfolkProp && (
          <div className="absolute bottom-7 right-6 z-25 pointer-events-none select-none rotate-3 transition-transform duration-300">
            {/* Multi-layered Soft Drop Shadow for Real Paper Thickness */}
            <div className="relative w-28 sm:w-32 h-38 sm:h-44 rounded-sm bg-[#FAF8F5] p-2.5 border border-stone-300/80 shadow-[0_16px_32px_rgba(0,0,0,0.18),0_4px_8px_rgba(0,0,0,0.1)] flex flex-col justify-between">
              {/* Paper Spine & Page Edges on Right */}
              <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-l from-stone-300/60 to-transparent rounded-r-xs" />

              {/* Magazine Header */}
              <div className="border-b border-stone-300/60 pb-1.5 text-center">
                <div className="text-[11px] sm:text-xs font-cinzel font-black tracking-[0.35em] text-stone-900 leading-none">
                  KINFOLK
                </div>
                <div className="text-[6px] tracking-[0.25em] uppercase text-stone-500 font-sans mt-0.5 font-semibold">
                  VOL. 42 • AUTUMN / WINTER
                </div>
              </div>

              {/* Minimalist Art Photography Thumbnail on Cover */}
              <div className="my-1.5 flex-1 rounded-xs bg-stone-200/80 overflow-hidden relative shadow-inner flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-300 to-stone-400 opacity-70" />
                {/* Ceramic vase silhouette on cover */}
                <svg viewBox="0 0 60 70" className="w-10 h-auto text-stone-600/60 drop-shadow-xs" fill="currentColor">
                  <path d="M22 10 Q 30 12 38 10 L 36 20 Q 48 35 44 55 Q 30 62 16 55 Q 12 35 24 20 Z" />
                </svg>
                <div className="absolute bottom-1 inset-x-0 text-center">
                  <span className="text-[6px] font-mono text-stone-600 tracking-wider uppercase font-semibold">
                    THE TOUCH ISSUE
                  </span>
                </div>
              </div>

              {/* Editorial Micro-Footer */}
              <div className="pt-1 border-t border-stone-300/60 flex items-center justify-between text-[6px] text-stone-400 font-mono">
                <span>ISSUE 42</span>
                <span>$24.00</span>
              </div>
            </div>
          </div>
        )}

        {/* E. Dried Pampas Grass Botanical Prop (Exact match to Image 2) */}
        {card.showPampasGrass && (
          <div className="absolute bottom-2 right-4 z-25 pointer-events-none opacity-85 drop-shadow-lg">
            <svg viewBox="0 0 100 140" className="w-24 sm:w-32 h-auto text-amber-200/90" fill="currentColor">
              <path d="M50 140 Q 55 90 70 30 Q 60 70 50 140 Z" fill="#b45309" opacity="0.6" />
              <ellipse cx="70" cy="35" rx="8" ry="25" transform="rotate(20 70 35)" fill="#fef3c7" opacity="0.8" />
              <ellipse cx="60" cy="50" rx="7" ry="22" transform="rotate(15 60 50)" fill="#fde68a" opacity="0.85" />
              <ellipse cx="80" cy="45" rx="6" ry="20" transform="rotate(30 80 45)" fill="#f59e0b" opacity="0.75" />
            </svg>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. REALISTIC WOODEN HANGER PROP (EXACT MATCH TO IMAGE 3)          */}
        {/* ================================================================= */}
        {card.showWoodenHanger && (
          <div className="absolute top-16 sm:top-20 inset-x-0 flex justify-center z-15 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
            <svg viewBox="0 0 280 80" className="w-56 sm:w-72 h-auto">
              <path
                d="M140 25 C 140 8 152 4 152 14 C 152 20 142 22 140 28"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="140" cy="27" r="3" fill="#64748b" />
              <path
                d="M140 28 L260 62 C265 64 263 68 258 68 L22 68 C17 68 15 64 20 62 Z"
                fill="url(#woodGrain)"
                stroke="#78350f"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="woodGrain" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#92400e" />
                  <stop offset="25%" stopColor="#b45309" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="75%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {/* F. Travertine Architectural Stone Blocks in Bottom-Left Corner (Exact match to Image 2: Raw Stitch) */}
        {card.showStoneBlocks && (
          <div className="absolute bottom-0 left-0 z-25 pointer-events-none select-none">
            {/* Ground Contact Shadow Underneath Blocks */}
            <div className="absolute bottom-0 left-2 w-32 h-6 bg-black/35 blur-md rounded-full pointer-events-none" />

            <div className="relative">
              {/* Back Taller Travertine Stone Pillar (3D Isometric Form) */}
              <div className="w-16 sm:w-20 h-36 sm:h-44 bg-[#E2D6C3] border-t border-r border-[#C9BAA3] relative shadow-lg overflow-hidden">
                {/* 3D Sunlit Top Plane */}
                <div className="absolute top-0 inset-x-0 h-3 bg-[#F2E8D7] border-b border-[#D8CABE]" />
                {/* Right side bevel shadow */}
                <div className="absolute top-0 right-0 w-2.5 h-full bg-gradient-to-l from-black/20 to-transparent" />
                {/* Authentic Travertine Micropores */}
                <div className="absolute top-8 left-3 w-3 h-1.5 rounded-full bg-[#9E8B73]/40 blur-[0.3px]" />
                <div className="absolute top-18 left-8 w-4 h-2 rounded-full bg-[#9E8B73]/35 blur-[0.3px]" />
                <div className="absolute top-26 left-4 w-2.5 h-1 rounded-full bg-[#9E8B73]/40 blur-[0.3px]" />
              </div>

              {/* Front Shorter Travertine Plinth (Overlapping with 3D Depth) */}
              <div className="absolute bottom-0 left-0 w-24 sm:w-30 h-20 sm:h-26 bg-[#D8C9B4] border-t-2 border-r border-[#BAA890] shadow-2xl overflow-hidden">
                {/* Sunlit Top Plane */}
                <div className="absolute top-0 inset-x-0 h-3.5 bg-[#EAE0CF] border-b border-[#C8B8A0]" />
                {/* Right side shadow */}
                <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-l from-black/25 to-transparent" />
                {/* Micropores */}
                <div className="absolute top-6 left-6 w-5 h-2 rounded-full bg-[#8E7B63]/40 blur-[0.3px]" />
                <div className="absolute top-12 left-14 w-3.5 h-1.5 rounded-full bg-[#8E7B63]/35 blur-[0.3px]" />
              </div>
            </div>
          </div>
        )}

        {/* G. Potted Tropical Monstera Plant in Ceramic Planter (Exact match to Image 5: Illiyeen Luxury) */}
        {card.showPottedPlant && (
          <div className="absolute bottom-3 sm:bottom-4 right-2 sm:right-3 z-25 pointer-events-none select-none drop-shadow-2xl">
            <svg viewBox="0 0 180 280" className="w-28 sm:w-36 h-auto">
              <defs>
                <linearGradient id="monsteraGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1B4332" />
                  <stop offset="60%" stopColor="#2D6A4F" />
                  <stop offset="100%" stopColor="#081C15" />
                </linearGradient>
                <linearGradient id="monsteraGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D6A4F" />
                  <stop offset="50%" stopColor="#40916C" />
                  <stop offset="100%" stopColor="#1B4332" />
                </linearGradient>
                <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FAF7F2" />
                  <stop offset="45%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#D8D2C4" />
                </linearGradient>
              </defs>

              {/* Monstera Leaf 1 (Left Split Leaf) */}
              <path
                d="M90 190 Q 60 130 35 70 C 25 90 20 120 40 145 C 55 165 75 180 90 190 Z"
                fill="url(#monsteraGrad1)"
              />
              <path d="M90 190 Q 60 130 35 70" stroke="#74C69D" strokeWidth="1.5" fill="none" opacity="0.6" />

              {/* Monstera Leaf 2 (Main Upright Fenestrated Leaf) */}
              <path
                d="M90 190 Q 95 110 110 30 C 130 55 145 90 135 130 C 125 160 105 180 90 190 Z"
                fill="url(#monsteraGrad2)"
              />
              {/* Natural Fenestration Holes */}
              <ellipse cx="115" cy="85" rx="3.5" ry="8" transform="rotate(20 115 85)" fill="#E8DFC8" opacity="0.9" />
              <ellipse cx="122" cy="115" rx="3" ry="7" transform="rotate(30 122 115)" fill="#E8DFC8" opacity="0.9" />
              <path d="M90 190 Q 95 110 110 30" stroke="#95D5B2" strokeWidth="2" fill="none" opacity="0.7" />

              {/* Monstera Leaf 3 (Right Arched Leaf) */}
              <path
                d="M90 190 Q 120 130 155 85 C 165 110 160 140 135 165 C 115 180 100 188 90 190 Z"
                fill="url(#monsteraGrad1)"
              />
              <ellipse cx="140" cy="125" rx="3" ry="7" transform="rotate(-25 140 125)" fill="#E8DFC8" opacity="0.9" />
              <path d="M90 190 Q 120 130 155 85" stroke="#74C69D" strokeWidth="1.5" fill="none" opacity="0.6" />

              {/* Stems */}
              <path d="M90 190 Q 75 140 45 80" stroke="#1B4332" strokeWidth="3" fill="none" />
              <path d="M90 190 Q 95 120 108 40" stroke="#1B4332" strokeWidth="3.5" fill="none" />
              <path d="M90 190 Q 115 140 145 95" stroke="#1B4332" strokeWidth="3" fill="none" />

              {/* Ceramic Planter Pot */}
              <path d="M55 190 L 125 190 L 115 260 L 65 260 Z" fill="url(#potGrad)" stroke="#C8C0B0" strokeWidth="1.5" />
              {/* Pot Rim Highlight */}
              <ellipse cx="90" cy="190" rx="35" ry="7" fill="#FFFFFF" stroke="#C8C0B0" strokeWidth="1" />
              {/* Pot Soil */}
              <ellipse cx="90" cy="190" rx="31" ry="5.5" fill="#3E2723" />
              {/* Pot Base Contact Shadow */}
              <ellipse cx="90" cy="260" rx="26" ry="4" fill="#A89F90" opacity="0.6" />
            </svg>
          </div>
        )}

        {/* H. Swimming Pool / Reflection Pool Edge at Bottom (Exact match to Image 5: Illiyeen Luxury) */}
        {card.showPoolEdge && (
          <div className="absolute bottom-0 inset-x-0 h-11 sm:h-13 z-25 pointer-events-none overflow-hidden shadow-2xl">
            {/* Polished Travertine Pool Coping Border */}
            <div className="h-2 w-full bg-gradient-to-r from-[#EDE4D3] via-[#FAF5EC] to-[#E2D5BF] border-b border-[#C8B89E] shadow-xs" />
            {/* Crystalline Turquoise Water with Wave Caustics */}
            <div className="w-full h-full bg-gradient-to-b from-[#2DD4BF]/90 via-[#14B8A6] to-[#0F766E] relative">
              <svg className="w-full h-full opacity-55" preserveAspectRatio="none" viewBox="0 0 400 35">
                <path d="M0 8 Q 50 16 100 8 T 200 10 T 300 7 T 400 9 L 400 35 L 0 35 Z" fill="rgba(255,255,255,0.45)" />
                <path d="M0 16 Q 70 24 140 17 T 280 19 T 400 15 L 400 35 L 0 35 Z" fill="rgba(255,255,255,0.25)" />
              </svg>
              {/* Sun sparkle reflections on water */}
              <div className="absolute top-1 left-1/4 w-1.5 h-1.5 rounded-full bg-white blur-[0.5px] animate-pulse" />
              <div className="absolute top-2 right-1/3 w-2 h-2 rounded-full bg-white/90 blur-[0.5px]" />
            </div>
          </div>
        )}

        {/* I. Traditional Ornate Festive Alpona Frame Border (Exact match to Image 4: Apex Sharodiya) */}
        {card.showAlponaBorder && (
          <div
            className="absolute inset-0 pointer-events-none z-30 m-3 sm:m-4 rounded-2xl overflow-hidden"
            style={{
              border: `9px solid ${card.alponaBorderColor || "#E11D48"}`,
              boxShadow: "inset 0 0 16px rgba(0,0,0,0.35)",
            }}
          >
            {/* Repeating Traditional Alpona White Dotted & Floral Filigree */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85" xmlns="http://www.w3.org/2000/svg">
              {/* Inner Dotted Dashed Line */}
              <rect
                x="4"
                y="4"
                width="calc(100% - 8px)"
                height="calc(100% - 8px)"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                rx="10"
              />
              {/* Four Corner Ornate Alpona Kalka / Lotus Rosettes */}
              <circle cx="16" cy="16" r="6" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="calc(100% - 16px)" cy="16" r="6" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="16" cy="calc(100% - 16px)" r="6" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="calc(100% - 16px)" cy="calc(100% - 16px)" r="6" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* J. 3D Sculpted Festive Celebration Emblem (Exact match to Image 4: Apex শারদীয় উৎসব No. 1 স্টাইলে) */}
        {card.showFestiveBadge && (
          <div className="absolute top-5 left-5 z-35 pointer-events-none drop-shadow-[0_14px_28px_rgba(225,29,72,0.45)] select-none animate-in fade-in zoom-in duration-300">
            <div className="relative px-3.5 py-2.5 rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE185D] to-[#881337] border-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center text-center max-w-[135px] sm:max-w-[155px]">
              {/* 3D Golden Lotus Emblem */}
              <div className="text-xl sm:text-2xl leading-none mb-0.5 filter drop-shadow">🪷</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-rose-100 tracking-wider font-bengali">
                {card.festiveBadgeText || "শারদীয় উৎসব"}
              </div>
              {/* Gold Embossed Banner */}
              <div className="px-2 py-0.5 mt-1 rounded bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-stone-950 text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
                NO. 1 স্টাইল
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. EDITORIAL BRAND HEADER (EXACT MATCH TO IMAGES 1, 3, 4)         */}
        {/* ================================================================= */}
        {card.showBrandHeader && (
          <div
            className={`absolute z-30 pointer-events-none select-none ${
              card.brandPosition === "top-left"
                ? "top-6 left-6 text-left"
                : card.brandPosition === "top-center"
                ? "top-6 inset-x-0 text-center"
                : "top-6 right-6 text-right"
            }`}
          >
            {card.brandStyle === "luxury-badge" ? (
              <div className="inline-block px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-b from-[#FBF7EE] to-[#EFE5D0] border-2 border-[#D4AF37] shadow-xl text-stone-900 drop-shadow-md">
                {/* Authentic Arabic Calligraphy for Illiyeen / Luxury Collections */}
                <div className="text-sm sm:text-base font-bold text-[#8C6D1F] tracking-wide leading-none mb-0.5">
                  {card.brandName.includes("ILLIYEEN") || card.brandName.includes("عليین") ? "عِلِّيِّين" : card.brandTagline}
                </div>
                <div className="text-xs sm:text-sm font-cinzel font-black tracking-[0.32em] text-stone-950 uppercase">
                  {card.brandName.replace("عليین", "").trim() || "ILLIYEEN"}
                </div>
              </div>
            ) : card.brandStyle === "korean-craft" ? (
              <div className="inline-block text-center border-b-2 border-stone-900/80 pb-1">
                <div className="text-[9px] font-inter font-bold tracking-[0.25em] uppercase text-stone-800">
                  {card.brandTagline}
                </div>
                <div className="text-base sm:text-lg font-cinzel font-black tracking-widest text-stone-950">
                  {card.brandName}
                </div>
              </div>
            ) : card.brandName === "RAW STITCH" ? (
              <div className="inline-block text-center">
                <div className="text-sm sm:text-base font-oswald font-black tracking-[0.22em] text-stone-900 uppercase">
                  ✦ RAW STITCH ✦
                </div>
                <div className="text-[8px] font-inter font-bold tracking-[0.25em] uppercase text-stone-600 mt-0.5">
                  {card.brandTagline || "EVERY STITCH HAS A STORY"}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-stone-900 flex items-center justify-center text-white text-[10px] font-black">
                  ▲
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-cinzel font-black tracking-wider ${isLightTone ? "text-stone-950" : "text-white"}`}>
                    {card.brandName}
                  </div>
                  <div className={`text-[8px] font-inter font-bold tracking-[0.2em] uppercase ${isLightTone ? "text-stone-500" : "text-slate-400"}`}>
                    {card.brandTagline}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 4B. COMMERCIAL BRAND FRAME OVERLAYS (ILYN / SAILOR / APEX CORNERS) */}
        {/* ================================================================= */}
        {card.showBrandFrame && (
          <>
            {/* Top-Left: Clean Brand Tag Frame */}
            <div className="absolute top-5 left-5 z-30 pointer-events-none select-none animate-in fade-in duration-300">
              {card.brandFrameStyle === "corner-bracket" ? (
                <div className="relative pl-3 pt-1 border-l-2 border-t-2 border-stone-900/80 pr-2 pb-1 bg-white/70 backdrop-blur-xs rounded-tl-sm">
                  <div className="text-[11px] sm:text-xs font-oswald font-bold tracking-[0.28em] text-stone-950 uppercase">
                    {card.brandFrameTopText || "SAILOR"}
                  </div>
                  {card.brandFrameTopSub && (
                    <div className="text-[8px] sm:text-[9px] font-inter font-semibold tracking-[0.2em] text-stone-500 uppercase mt-0.5">
                      {card.brandFrameTopSub}
                    </div>
                  )}
                </div>
              ) : card.brandFrameStyle === "clean-monochrome" ? (
                <div className="px-3 py-1.5 rounded-lg bg-stone-950 text-white shadow-md flex flex-col items-start border border-stone-800">
                  <div className="text-[10px] sm:text-[11px] font-oswald font-bold tracking-[0.25em] uppercase">
                    {card.brandFrameTopText || "APEX"}
                  </div>
                  {card.brandFrameTopSub && (
                    <div className="text-[7px] sm:text-[8px] font-inter font-semibold tracking-[0.2em] text-stone-300 uppercase">
                      {card.brandFrameTopSub}
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/90 backdrop-blur-md border border-stone-300/90 shadow-sm text-stone-900 flex flex-col items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-xs sm:text-sm font-cinzel font-black tracking-[0.25em] text-stone-950 uppercase">
                      {card.brandFrameTopText || "ILYN"}
                    </span>
                  </div>
                  {card.brandFrameTopSub && (
                    <div className="text-[8px] sm:text-[9px] font-inter font-bold tracking-[0.2em] text-stone-500 uppercase mt-0.5 pl-3">
                      {card.brandFrameTopSub}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom-Right: Category Tag (e.g. "KIDS", "SUMMER 26") */}
            <div className="absolute bottom-5 right-5 z-30 pointer-events-none select-none animate-in fade-in duration-300">
              <div className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-stone-900/90 text-white backdrop-blur-md border border-stone-800 shadow-md flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-inter font-black tracking-[0.22em] uppercase">
                  {card.brandFrameBottomText || "SUMMER 26"}
                </span>
              </div>
            </div>
          </>
        )}

        {/* ================================================================= */}
        {/* 5. BIG HERO COLLECTION TYPOGRAPHY (AW26 / NEW ARRIVALS)           */}
        {/* ================================================================= */}
        {card.showCollectionText && (
          <div
            className={`absolute z-30 pointer-events-none select-none ${
              card.collectionPosition === "bottom-right"
                ? "bottom-7 right-6 text-right"
                : card.collectionPosition === "bottom-left"
                ? "bottom-7 left-6 text-left"
                : card.collectionPosition === "top-right"
                ? "top-7 right-6 text-right"
                : "top-7 left-6 text-left"
            }`}
          >
            {card.collectionStyle === "glowing-outline" ? (
              <div className="leading-none">
                <div
                  className="text-5xl sm:text-6xl font-cinzel font-black tracking-wider text-transparent select-none drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)]"
                  style={{
                    WebkitTextStroke: isLightTone ? "2.5px #FFFFFF" : "2.5px #FDE68A",
                  }}
                >
                  {card.collectionSeason}
                </div>
                <div
                  className={`text-xs sm:text-sm font-cinzel font-bold tracking-[0.38em] uppercase mt-1 ${
                    isLightTone ? "text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" : "text-amber-300 drop-shadow-md"
                  }`}
                >
                  {card.collectionSub}
                </div>
              </div>
            ) : card.collectionStyle === "solid-bold" ? (
              <div className="leading-none">
                <div className={`text-4xl sm:text-5xl font-cinzel font-black tracking-tight ${isLightTone ? "text-stone-900" : "text-white"}`}>
                  {card.collectionSeason}
                </div>
                <div className={`text-xs font-inter font-bold tracking-[0.25em] uppercase mt-1.5 ${isLightTone ? "text-stone-600" : "text-slate-300"}`}>
                  {card.collectionSub}
                </div>
              </div>
            ) : (
              <div className="leading-none">
                <div className={`text-3xl sm:text-4xl font-playfair italic font-medium ${isLightTone ? "text-stone-800" : "text-amber-200"}`}>
                  {card.collectionSeason}
                </div>
                <div className={`text-[10px] font-cinzel tracking-[0.3em] uppercase mt-1 ${isLightTone ? "text-stone-500" : "text-amber-300/80"}`}>
                  {card.collectionSub}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 6. EDITORIAL MICRO-COPY & DETAILS (EXACT MATCH TO IMAGE 1)        */}
        {/* ================================================================= */}
        {card.showEditorialCopy && (
          <div
            className={`absolute z-30 pointer-events-none max-w-[200px] sm:max-w-[240px] ${
              card.editorialPosition === "bottom-left"
                ? "bottom-7 left-6 text-left"
                : "top-7 right-6 text-right"
            }`}
          >
            <div className={`text-[11px] sm:text-xs font-cinzel font-black tracking-wider uppercase leading-tight ${isLightTone ? "text-stone-900" : "text-white"}`}>
              {card.editorialHeading}
            </div>
            <div className={`w-6 h-0.5 my-1.5 ${isLightTone ? "bg-stone-900/40" : "bg-white/40"}`} />
            <div className={`text-[9px] sm:text-[10px] whitespace-pre-line leading-relaxed font-inter font-medium ${isLightTone ? "text-stone-600" : "text-slate-300"}`}>
              {card.editorialBullets}
            </div>
          </div>
        )}

        {/* 6B. HERO PRODUCT HEADLINE (EXACT MATCH TO IMAGE 2: STRIPED DROP SHOULDER) */}
        {card.showProductHeadline && (
          <div className="absolute top-16 sm:top-18 inset-x-0 z-30 pointer-events-none text-center px-4 select-none animate-in fade-in duration-300">
            <div
              className="text-3xl sm:text-4xl md:text-5xl font-oswald font-black tracking-tight leading-none uppercase drop-shadow-2xs"
              style={{ color: card.headlineColor || "#1B4332" }}
            >
              {card.headlineMain || "STRIPED"}
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-oswald font-black tracking-tight leading-none uppercase text-stone-950 mt-0.5 drop-shadow-2xs">
              {card.headlineSecondary || "DROP SHOULDER"}
            </div>
            {card.headlineSub && (
              <div className="text-[9px] sm:text-[10px] font-inter font-semibold tracking-widest text-stone-600 mt-2 uppercase">
                {card.headlineSub}
              </div>
            )}
          </div>
        )}

        {/* 6C. MINIMALIST SPACED FOOTER CTA (EXACT MATCH TO IMAGE 2: SHOP NOW | RAWSTITCH.COM.BD) */}
        {card.showFooterCta && (
          <div className="absolute bottom-5 inset-x-0 z-30 pointer-events-none text-center select-none animate-in fade-in duration-300">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-xs text-[9px] sm:text-[10px] font-inter font-bold tracking-[0.28em] text-stone-900 uppercase border border-stone-300/80 shadow-xs">
              {card.footerCtaText || "SHOP NOW | RAWSTITCH.COM.BD"}
            </div>
          </div>
        )}

        {/* 6D. SUB-BRAND / LUXURY CATEGORY BADGE (EXACT MATCH TO IMAGE 1 PLATINUM / IMAGE 5 LUXURY) */}
        {card.showSubBrandBadge && (
          <div
            className={`absolute z-30 pointer-events-none select-none ${
              card.subBrandBadgePosition === "top-right"
                ? "top-6 right-6 text-right"
                : card.subBrandBadgePosition === "bottom-right"
                ? "bottom-7 right-6 text-right"
                : "bottom-7 left-6 text-left"
            }`}
          >
            <div className={`text-xs sm:text-sm font-cinzel font-bold tracking-[0.45em] uppercase drop-shadow-xs ${
              isLightTone ? "text-stone-900/90" : "text-amber-100"
            }`}>
              {card.subBrandBadgeText || "PLATINUM"}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. ARCHITECTURAL 3D PEDESTAL STAND                                */}
        {/* ================================================================= */}
        {showPedestal && selectedPreset.pedestalType !== "none" && card.surfaceType !== "desert-arch" && (
          <div className="absolute bottom-14 sm:bottom-18 inset-x-0 flex justify-center pointer-events-none z-10">
            {selectedPreset.pedestalType === "round-gold" && (
              <svg viewBox="0 0 340 80" className="w-64 sm:w-80 h-auto">
                <ellipse cx="170" cy="40" rx="140" ry="24" fill="#042f2e" opacity="0.6" />
                <ellipse cx="170" cy="34" rx="130" ry="20" fill="url(#pGoldGrad)" />
                <path d="M40 34 H300 V46 H40 Z" fill="#0d9488" opacity="0.4" />
                <defs>
                  <linearGradient id="pGoldGrad" x1="40" y1="34" x2="300" y2="34">
                    <stop offset="0%" stopColor="#115e59" />
                    <stop offset="50%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {selectedPreset.pedestalType === "terracotta" && (
              <svg viewBox="0 0 340 80" className="w-64 sm:w-80 h-auto">
                <ellipse cx="170" cy="40" rx="135" ry="22" fill="#450a0a" opacity="0.6" />
                <ellipse cx="170" cy="34" rx="125" ry="18" fill="#991b1b" />
                <path d="M45 34 H295 V44 H45 Z" fill="#b91c1c" opacity="0.5" />
              </svg>
            )}

            {selectedPreset.pedestalType === "marble-slab" && (
              <svg viewBox="0 0 340 80" className="w-64 sm:w-80 h-auto">
                <ellipse cx="170" cy="42" rx="140" ry="22" fill="#020617" opacity="0.7" />
                <rect x="50" y="24" width="240" height="20" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <rect x="54" y="26" width="232" height="16" rx="4" fill="#0f172a" />
              </svg>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 8. 3D REALISTIC CONTACT GROUND SHADOW                             */}
        {/* ================================================================= */}
        {transform.shadowEnabled && !card.floatingShadowEnabled && (
          <div
            className="absolute bottom-16 sm:bottom-20 inset-x-0 flex justify-center pointer-events-none z-15 transition-transform duration-75"
            style={{
              transform: `translateX(${transform.offsetX}px) translateY(${transform.offsetY * 0.3}px)`,
            }}
          >
            <div
              className="w-48 sm:w-64 h-8 rounded-full bg-black/80 blur-md transition-all"
              style={{
                opacity: transform.shadowOpacity,
                transform: `scale(${transform.scale})`,
              }}
            />
          </div>
        )}

        {/* ================================================================= */}
        {/* 8B. REALISTIC "FLOATING GROUND SHADOW" ENGINE (ILYN / APEX / SAILOR)*/}
        {/* ================================================================= */}
        {card.floatingShadowEnabled && (
          <div
            className="absolute inset-x-0 flex justify-center pointer-events-none z-15 transition-transform duration-75"
            style={{
              bottom: `${Math.max(12, Math.min(130, 24 - (transform.offsetY * 0.35) + (card.floatingShadowDistance || 10)))}px`,
              transform: `translateX(${transform.offsetX}px)`,
            }}
          >
            {/* Horizontally stretched radial gradient ellipse underneath the bottom hem */}
            <div
              style={{
                width: `${Math.min(92, Math.max(30, Math.round((card.floatingShadowWidth || 65) * (transform.scale || 1))))}%`,
                height: `${card.floatingShadowHeight || 26}px`,
                opacity: card.floatingShadowOpacity || 0.40,
                filter: `blur(${card.floatingShadowBlur || 24}px)`,
                background:
                  "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.55) 40%, rgba(71, 85, 105, 0.2) 65%, transparent 80%)",
                borderRadius: "50%",
              }}
              className="transform-gpu transition-all"
            />
          </div>
        )}

        {/* ================================================================= */}
        {/* 8C. REALISTIC MANNEQUIN STAND (EXACT MATCH TO IMAGES 1 & 5)       */}
        {/* ================================================================= */}
        {card.mannequinStand && card.mannequinStand !== "none" && (
          <div
            className="absolute inset-x-0 bottom-3 sm:bottom-4 flex justify-center pointer-events-none z-15"
            style={{
              transform: `translateX(${transform.offsetX}px)`,
            }}
          >
            {card.mannequinStand === "metallic-tripod" ? (
              <svg viewBox="0 0 160 120" className="w-28 sm:w-36 h-auto drop-shadow-lg">
                <ellipse cx="80" cy="108" rx="45" ry="8" fill="rgba(0,0,0,0.3)" filter="blur(2px)" />
                <rect x="78" y="0" width="4" height="96" fill="url(#chromePole)" />
                <rect x="76" y="86" width="8" height="6" rx="1.5" fill="#94A3B8" stroke="#64748B" strokeWidth="0.5" />
                <path d="M80 94 L 40 106 L 44 110 L 80 98 Z" fill="url(#chromeLeg)" />
                <path d="M80 94 L 120 106 L 116 110 L 80 98 Z" fill="url(#chromeLeg)" />
                <path d="M80 94 L 62 108 L 66 111 L 80 98 Z" fill="#94A3B8" />
                <path d="M80 94 L 98 108 L 94 111 L 80 98 Z" fill="#94A3B8" />
                <circle cx="80" cy="95" r="4.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="0.5" />
                <defs>
                  <linearGradient id="chromePole" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#64748B" />
                  </linearGradient>
                  <linearGradient id="chromeLeg" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#CBD5E1" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#64748B" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <svg viewBox="0 0 160 120" className="w-28 sm:w-36 h-auto drop-shadow-xl">
                <ellipse cx="80" cy="108" rx="45" ry="8" fill="rgba(60,30,0,0.35)" filter="blur(2px)" />
                <rect x="78" y="0" width="4" height="96" fill="url(#goldPole)" />
                <rect x="76" y="86" width="8" height="6" rx="1.5" fill="#D97706" stroke="#92400E" strokeWidth="0.5" />
                <path d="M80 94 L 40 106 L 44 110 L 80 98 Z" fill="url(#goldLeg)" />
                <path d="M80 94 L 120 106 L 116 110 L 80 98 Z" fill="url(#goldLeg)" />
                <path d="M80 94 L 62 108 L 66 111 L 80 98 Z" fill="#B45309" />
                <path d="M80 94 L 98 108 L 94 111 L 80 98 Z" fill="#B45309" />
                <circle cx="80" cy="95" r="4.5" fill="#FDE68A" stroke="#B45309" strokeWidth="0.5" />
                <defs>
                  <linearGradient id="goldPole" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#B45309" />
                    <stop offset="45%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                  <linearGradient id="goldLeg" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D97706" />
                    <stop offset="40%" stopColor="#FEF08A" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 9. ISOLATED PRODUCT LAYER (DRAGGABLE & SCALABLE)                  */}
        {/* ================================================================= */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-20 pointer-events-none"
          style={{
            transform: `translate(${transform.offsetX}px, ${transform.offsetY}px)`,
          }}
        >
          {productImage ? (
            <div
              className="relative max-h-full max-w-full flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `scale(${transform.scale}) ${transform.flipped ? "scaleX(-1)" : ""}`,
              }}
            >
              <img
                src={productImage}
                alt="Product Layer"
                style={{
                  filter: enhance?.enabled
                    ? `brightness(${enhance.brightness}) contrast(${enhance.contrast}) saturate(${enhance.saturation}) drop-shadow(0 15px 25px rgba(0,0,0,0.45))`
                    : "drop-shadow(0 15px 25px rgba(0,0,0,0.45))",
                }}
                className="max-h-[300px] sm:max-h-[420px] max-w-[85%] sm:max-w-[88%] w-auto h-auto object-contain transition-all select-none"
                draggable={false}
              />
            </div>
          ) : (
            <div className="text-center p-8 rounded-2xl glass-card border-dashed border-slate-700 text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-amber-400 opacity-60" />
              <p className="text-sm font-semibold text-white">
                {lang === "bn" ? "কোনো প্রোডাক্ট সিলেক্ট করা নেই" : "No Product Layer Active"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === "bn" ? "বামপাশ থেকে ছবি আপলোড বা স্যাম্পল সিলেক্ট করুন" : "Upload or pick a sample product from left"}
              </p>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 10. MARKETING BADGES (OPTIONAL OVERLAYS)                          */}
        {/* ================================================================= */}
        {/* Top-Right: Flat % Off Sticker */}
        {badges.showDiscount && (
          <div className="absolute top-5 right-5 z-35 pointer-events-none animate-in fade-in zoom-in duration-300">
            <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white font-black text-sm shadow-xl shadow-red-600/40 border-2 border-white/30 flex items-center gap-1.5">
              <span>🔥</span>
              <span>
                {badges.discountValue} {badges.discountLabel}
              </span>
            </div>
          </div>
        )}

        {/* Cash on Delivery Badge (positioned at top-16 right-5 to prevent overlap with discount) */}
        {badges.showCod && (
          <div className="absolute top-16 right-5 z-35 pointer-events-none animate-in fade-in slide-in-from-right duration-300">
            <div className="px-3 py-1 rounded-lg bg-sky-950/85 text-sky-200 border border-sky-400/40 text-[11px] font-bold shadow-md backdrop-blur-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              <span>{badges.codText}</span>
            </div>
          </div>
        )}

        {/* Bottom-Left: Free Delivery Ribbon */}
        {badges.showDelivery && !(card.showEditorialCopy && card.editorialPosition === "bottom-left") && (
          <div className="absolute bottom-5 left-5 z-35 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-600/95 text-white font-bold text-xs shadow-xl border border-emerald-400/50 flex items-center gap-1.5 backdrop-blur-md">
              <Truck className="w-3.5 h-3.5 text-white shrink-0" />
              <span>{badges.deliveryText}</span>
            </div>
          </div>
        )}

        {/* Urgency Badge (positioned at bottom-5 right-5) */}
        {badges.showUrgency && !(card.showCollectionText && card.collectionPosition === "bottom-right") && (
          <div className="absolute bottom-5 right-5 z-35 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/95 text-slate-950 font-extrabold text-[11px] shadow-lg border border-amber-300 flex items-center gap-1">
              <span>⚡</span>
              <span>{badges.urgencyText}</span>
            </div>
          </div>
        )}

        {/* Movable & Customizable Price Tag Pill */}
        {badges.showPrice && (
          <div
            className="absolute bottom-16 sm:bottom-18 inset-x-0 flex justify-center z-40 pointer-events-auto select-none transition-transform duration-75"
            style={{
              transform: `translate(${badges.priceOffsetX || 0}px, ${badges.priceOffsetY || 0}px) scale(${badges.priceScale || 1.0})`,
            }}
          >
            <div
              onMouseDown={handlePriceMouseDown}
              onTouchStart={handlePriceTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              title={lang === "bn" ? "প্রাইস বাটন ড্র্যাগ করে সরান (Drag to move)" : "Drag to move price badge"}
              className={`group px-5 py-2 rounded-full cursor-grab active:cursor-grabbing touch-none flex items-center gap-2 select-none transition-all ${getPriceTagStyleClasses(
                badges.priceStyle
              )} ${
                isDraggingPrice
                  ? "ring-4 ring-amber-400/80 scale-105 shadow-2xl"
                  : "hover:scale-105 hover:ring-2 hover:ring-amber-400/50"
              }`}
            >
              {/* Subtle Drag Handle Indicator */}
              <span className="opacity-40 group-hover:opacity-100 transition-opacity text-[10px] tracking-tighter select-none">
                ⠿
              </span>

              {/* Optional Custom Label Prefix */}
              {badges.priceLabel ? (
                <span
                  className={`text-xs uppercase font-semibold tracking-wider ${
                    badges.priceStyle === "luxury-gold"
                      ? "text-slate-900/80"
                      : badges.priceStyle === "minimal-white"
                      ? "text-stone-600"
                      : badges.priceStyle === "vibrant-red"
                      ? "text-rose-100"
                      : "text-white"
                  }`}
                >
                  {badges.priceLabel}
                </span>
              ) : null}

              {/* Currency + Price Value */}
              <span className="text-base sm:text-lg tracking-tight">
                {badges.priceCurrency ? `${badges.priceCurrency} ` : ""}
                {badges.priceValue}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* EXPORT ACTIONS BAR (DOWNLOAD & COPY)                                */}
      {/* =================================================================== */}
      <div className="w-full grid grid-cols-2 gap-3 pt-2">
        {/* Download PNG Button */}
        <button
          onClick={handleDownloadPng}
          disabled={isExporting}
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {isExporting ? (
            <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4 text-stone-950" />
          )}
          <span>{lang === "bn" ? "ডাউনলোড করুন (PNG)" : "Download Banner"}</span>
        </button>

        {/* Copy to Clipboard Button */}
        <button
          onClick={handleCopyToClipboard}
          disabled={isExporting}
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs hover:border-stone-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          <Copy className="w-4 h-4 text-stone-700" />
          <span>{lang === "bn" ? "কপি করুন" : "Copy to Clipboard"}</span>
        </button>
      </div>
    </div>
  );
}
