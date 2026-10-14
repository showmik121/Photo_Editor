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
    card.surfaceType === "stone-wall";

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
        {/* A. Ceramic Tiles Grid Pattern (Like Image 1) */}
        {card.surfaceType === "tiles" && card.showTileGrid && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tileGrid" width="160" height="160" patternUnits="userSpaceOnUse">
                <path
                  d="M 160 0 L 0 0 0 160"
                  fill="none"
                  stroke={isLightTone ? "rgba(120,100,80,0.18)" : "rgba(255,255,255,0.08)"}
                  strokeWidth="1.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tileGrid)" />
          </svg>
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
            {/* Subtle Marble Vein SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <path d="M10 0 Q 35 45 70 80 T 95 100" stroke="white" strokeWidth="0.8" fill="none" />
              <path d="M0 40 Q 40 60 60 100" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        )}

        {/* D. Neutral Grey Concrete (ILYN / Apex / Sailor Commercial Studio) */}
        {card.surfaceType === "concrete-grey" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Fine Architectural Concrete Speckled Grain */}
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              <filter id="concreteNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.15  0 0 0 0 0.2  0 0 0 0 0.25  0 0 0 0.18 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#concreteNoise)" />
            </svg>
            {/* Soft overhead studio directional key light */}
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
            {/* Organic Venetian Plaster Stucco Wash */}
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
            {/* Warm daylight beam */}
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
            {/* Delicate Fine Diagonal Brush Stroke Texture */}
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
            {/* High-fashion pure studio fill light */}
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
            {/* Soft glowing desert sky with radiant sun glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDF8EE] via-[#F8ECD8] to-[#E8D2B5]" />
            <div
              className="absolute top-0 inset-x-0 h-2/3 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 15%, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.5) 45%, transparent 75%)",
              }}
            />

            {/* Distant Rolling Dunes Layers */}
            <svg viewBox="0 0 1000 650" className="absolute bottom-20 inset-x-0 w-full h-auto" preserveAspectRatio="none">
              <path d="M0 290 Q 220 220 480 260 T 1000 230 L 1000 650 L 0 650 Z" fill="#E6C8A6" opacity="0.6" />
              <path d="M0 320 Q 320 250 640 300 T 1000 270 L 1000 650 L 0 650 Z" fill="#DCB68E" opacity="0.85" />
              <path d="M0 360 Q 260 300 520 340 T 1000 310 L 1000 650 L 0 650 Z" fill="#CE9F70" />
              <path d="M0 400 Q 380 340 760 380 T 1000 350 L 1000 650 L 0 650 Z" fill="#BA8857" opacity="0.5" />
            </svg>

            {/* Modern Studio Horizon Line & Polished Floor */}
            <div className="absolute bottom-0 inset-x-0 h-20 sm:h-24 bg-gradient-to-b from-[#FAF4EC] to-[#EFE2D2] border-t border-stone-800/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]" />
          </div>
        )}

        {/* K. Travertine Courtyard Wall with Sunlight Beam (Exact match to Image 5: Illiyeen Luxury AW26) */}
        {card.surfaceType === "travertine-courtyard" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Warm Mediterranean Travertine Plaster Tone */}
            <div className="absolute inset-0 bg-[#E8DFC8]" />
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <filter id="travertineGrain">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.12 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#travertineGrain)" />
            </svg>

            {/* Overhead Architectural Travertine Beam casting sharp geometric shadow */}
            <div className="absolute top-0 right-0 w-44 sm:w-56 h-14 sm:h-18 bg-[#F4ECDC] shadow-xl border-b border-l border-[#D6C5AA] z-5" />
            {/* Sharp diagonal shadow cast across the wall */}
            <div
              className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-45"
              style={{
                background: "linear-gradient(125deg, transparent 0%, transparent 42%, rgba(55, 45, 30, 0.45) 43%, rgba(40, 30, 20, 0.5) 100%)",
              }}
            />
            {/* Soft dappled foliage shadow on the wall */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                background: "radial-gradient(circle at 15% 45%, rgba(0,0,0,0.4) 0%, transparent 60%)",
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
            </svg>
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(239, 232, 222, 0.1) 60%, rgba(214, 199, 178, 0.3) 100%)",
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

        {/* B. Palm Leaf Tropical Overhang & Blurred Cast Shadow (Exact match to Image 1) */}
        {card.showPalmShadow && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity"
            style={{ opacity: card.palmShadowOpacity / 100 }}
          >
            {/* Soft Blurred Palm Shadow Falling Diagonally Across Product */}
            <svg
              className="absolute top-0 right-0 w-[420px] h-[420px] text-stone-900/35 blur-[14px]"
              viewBox="0 0 400 400"
              fill="currentColor"
            >
              <path d="M400 0 C 320 80 240 140 160 210 C 220 170 300 130 380 90 Z" />
              <path d="M400 30 C 300 120 200 190 120 280 C 180 230 270 180 370 120 Z" />
              <path d="M400 70 C 310 160 220 230 150 330 C 210 270 290 220 380 170 Z" />
              <path d="M400 0 C 350 120 280 220 200 320 C 260 250 330 180 390 100 Z" />
            </svg>

            {/* Crisp Tropical Palm Leaf Foliage in Top Right Corner */}
            <svg
              className="absolute -top-4 -right-4 w-48 sm:w-60 h-auto text-emerald-800 drop-shadow-md"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <path d="M200 0 C 160 30 110 60 70 100 C 100 80 140 60 190 40 Z" fill="#1b4332" />
              <path d="M200 15 C 150 50 95 85 50 130 C 85 105 130 80 185 50 Z" fill="#2d6a4f" />
              <path d="M200 35 C 155 70 105 110 70 160 C 100 130 140 100 190 70 Z" fill="#40916c" />
              <path d="M200 0 C 175 60 140 110 95 160 C 125 125 165 85 195 45 Z" fill="#1b4332" />
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

        {/* D. Kinfolk Lookbook Magazine Prop (Exact match to Image 1) */}
        {card.showKinfolkProp && (
          <div className="absolute bottom-8 right-6 z-25 pointer-events-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)] rotate-3">
            <div className="w-24 sm:w-28 h-32 sm:h-36 rounded-md bg-[#FAF7F2] p-2 border border-stone-300 shadow-md flex flex-col justify-between">
              <div className="text-[10px] font-serif font-black tracking-widest text-stone-900 text-center border-b border-stone-200 pb-1">
                KINFOLK
              </div>
              <div className="h-16 sm:h-20 bg-stone-300/60 rounded overflow-hidden flex items-center justify-center">
                <span className="text-[8px] font-mono text-stone-500 uppercase tracking-wider">ISSUE 26</span>
              </div>
              <div className="text-[6px] text-stone-400 font-sans text-center">
                A GUIDE FOR SMALL GATHERINGS
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

        {/* F. Travertine Architectural Stone Blocks in Bottom-Left Corner (Exact match to Image 2) */}
        {card.showStoneBlocks && (
          <div className="absolute bottom-0 left-0 z-25 pointer-events-none drop-shadow-xl select-none">
            <div className="relative">
              {/* Back taller stone pillar */}
              <div className="w-16 sm:w-20 h-32 sm:h-40 rounded-t-sm bg-gradient-to-r from-[#D8C9B4] to-[#EAE0D2] border-t border-r border-[#C8B7A0] shadow-md relative overflow-hidden">
                <div className="absolute top-6 left-3 w-3 h-2 rounded-full bg-[#A89680]/30 blur-[0.5px]" />
                <div className="absolute top-16 left-8 w-4 h-2 rounded-full bg-[#A89680]/25 blur-[0.5px]" />
                <div className="absolute top-28 left-4 w-2 h-3 rounded-full bg-[#A89680]/30 blur-[0.5px]" />
              </div>
              {/* Front shorter stone block */}
              <div className="absolute bottom-0 left-0 w-22 sm:w-28 h-18 sm:h-24 rounded-t-sm bg-gradient-to-r from-[#CBB9A0] via-[#DFD3C0] to-[#EAE0D2] border-t border-r border-[#B8A68F] shadow-lg overflow-hidden">
                <div className="absolute top-3 left-6 w-5 h-2 rounded-full bg-[#A89680]/35 blur-[0.5px]" />
                <div className="absolute top-10 left-12 w-3 h-2 rounded-full bg-[#A89680]/30 blur-[0.5px]" />
              </div>
            </div>
          </div>
        )}

        {/* G. Potted Tropical Plant in Minimalist Ceramic Planter (Exact match to Image 5) */}
        {card.showPottedPlant && (
          <div className="absolute bottom-4 sm:bottom-6 right-2 sm:right-4 z-25 pointer-events-none drop-shadow-2xl select-none">
            <svg viewBox="0 0 160 260" className="w-24 sm:w-32 h-auto">
              <path d="M80 180 Q 95 120 120 70 Q 140 100 110 160 Z" fill="#14532D" />
              <path d="M80 180 Q 50 110 30 60 Q 60 80 75 150 Z" fill="#166534" />
              <path d="M80 180 Q 110 100 145 110 Q 130 145 90 175 Z" fill="#15803D" />
              <path d="M80 180 Q 60 90 85 30 Q 105 70 85 160 Z" fill="#14532D" />
              <path d="M80 180 Q 40 130 20 140 Q 35 170 75 180 Z" fill="#166534" />
              <path d="M80 180 Q 82 120 85 30" stroke="#14532D" strokeWidth="2.5" fill="none" />
              <path d="M80 180 Q 60 120 30 60" stroke="#14532D" strokeWidth="2" fill="none" />
              <path d="M80 180 Q 105 130 120 70" stroke="#14532D" strokeWidth="2" fill="none" />
              <path d="M50 180 L 110 180 L 102 245 L 58 245 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
              <ellipse cx="80" cy="180" rx="30" ry="6" fill="#D6D3D1" />
              <ellipse cx="80" cy="180" rx="27" ry="5" fill="#57534E" />
              <ellipse cx="80" cy="245" rx="22" ry="4" fill="#CBD5E1" opacity="0.6" />
            </svg>
          </div>
        )}

        {/* H. Swimming Pool / Reflection Pool Edge at Bottom (Image 5) */}
        {card.showPoolEdge && (
          <div className="absolute bottom-0 inset-x-0 h-10 sm:h-12 z-25 pointer-events-none overflow-hidden border-t-2 border-[#D6C7B2] shadow-inner">
            <div className="w-full h-full bg-gradient-to-b from-[#2DD4BF]/60 via-[#14B8A6]/70 to-[#0F766E]/80 backdrop-blur-xs relative">
              <svg className="w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 400 40">
                <path d="M0 10 Q 50 18 100 10 T 200 12 T 300 8 T 400 10 L 400 40 L 0 40 Z" fill="rgba(255,255,255,0.4)" />
                <path d="M0 20 Q 70 26 140 20 T 280 22 T 400 18 L 400 40 L 0 40 Z" fill="rgba(255,255,255,0.2)" />
              </svg>
            </div>
          </div>
        )}

        {/* I. Traditional Ornate Festive Alpona Frame Border (Exact match to Image 4: Apex Sharodiya) */}
        {card.showAlponaBorder && (
          <div
            className="absolute inset-0 pointer-events-none z-30 m-3 sm:m-4 rounded-2xl"
            style={{
              border: `10px solid ${card.alponaBorderColor || "#E11D48"}`,
              boxShadow: "inset 0 0 12px rgba(0,0,0,0.15)",
            }}
          >
            <div
              className="absolute inset-0 m-0.5 rounded-xl border border-white/50"
              style={{
                outline: `2px dashed rgba(255,255,255,0.7)`,
                outlineOffset: "-4px",
              }}
            />
          </div>
        )}

        {/* J. 3D Sculpted Festive Celebration Emblem (Exact match to Image 4: Apex শারদীয় উৎসব No. 1 স্টাইলে) */}
        {card.showFestiveBadge && (
          <div className="absolute top-5 left-5 z-35 pointer-events-none drop-shadow-[0_12px_24px_rgba(225,29,72,0.4)] animate-in fade-in zoom-in duration-300">
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE185D] to-[#9D174D] border-2 border-pink-200/60 shadow-xl flex flex-col items-center justify-center text-center max-w-[130px] sm:max-w-[150px]">
              <div className="text-xl sm:text-2xl leading-none mb-0.5 filter drop-shadow">🪷</div>
              <div className="text-[10px] font-bold text-pink-100 tracking-wider">
                {card.festiveBadgeText || "শারদীয় উৎসব"}
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-300 tracking-wide uppercase leading-tight drop-shadow-sm mt-0.5">
                NO. 1 স্টাইল
              </div>
              <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent mt-1" />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. EDITORIAL BRAND HEADER (EXACT MATCH TO IMAGES 1, 3, 4)         */}
        {/* ================================================================= */}
        {card.showBrandHeader && (
          <div
            className={`absolute z-30 pointer-events-none ${
              card.brandPosition === "top-left"
                ? "top-6 left-6 text-left"
                : card.brandPosition === "top-center"
                ? "top-6 inset-x-0 text-center"
                : "top-6 right-6 text-right"
            }`}
          >
            {card.brandStyle === "luxury-badge" ? (
              <div className="inline-block p-2.5 sm:p-3 rounded-xl bg-gradient-to-b from-[#FBF7EE] to-[#EFE5D0] border-2 border-[#D4AF37] shadow-xl text-stone-900">
                <div className="text-[10px] font-serif tracking-widest text-[#B48811] uppercase font-bold">
                  {card.brandTagline}
                </div>
                <div className="text-sm sm:text-base font-serif font-black tracking-wider text-stone-900">
                  {card.brandName}
                </div>
              </div>
            ) : card.brandStyle === "korean-craft" ? (
              <div className="inline-block text-center border-b-2 border-stone-900/80 pb-1">
                <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-stone-800">
                  {card.brandTagline}
                </div>
                <div className="text-base sm:text-lg font-black tracking-widest text-stone-950">
                  {card.brandName}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-stone-900 flex items-center justify-center text-white text-[10px] font-black">
                  ▲
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-black tracking-wider ${isLightTone ? "text-stone-950" : "text-white"}`}>
                    {card.brandName}
                  </div>
                  <div className={`text-[8px] font-bold tracking-[0.2em] uppercase ${isLightTone ? "text-stone-500" : "text-slate-400"}`}>
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
                  <div className="text-[11px] sm:text-xs font-black tracking-[0.28em] text-stone-950 uppercase font-sans">
                    {card.brandFrameTopText || "SAILOR"}
                  </div>
                  {card.brandFrameTopSub && (
                    <div className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-stone-500 uppercase mt-0.5">
                      {card.brandFrameTopSub}
                    </div>
                  )}
                </div>
              ) : card.brandFrameStyle === "clean-monochrome" ? (
                <div className="px-3 py-1.5 rounded-lg bg-stone-950 text-white shadow-md flex flex-col items-start border border-stone-800">
                  <div className="text-[10px] sm:text-[11px] font-black tracking-[0.25em] uppercase font-sans">
                    {card.brandFrameTopText || "APEX"}
                  </div>
                  {card.brandFrameTopSub && (
                    <div className="text-[7px] sm:text-[8px] font-semibold tracking-[0.2em] text-stone-300 uppercase">
                      {card.brandFrameTopSub}
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/90 backdrop-blur-md border border-stone-300/90 shadow-sm text-stone-900 flex flex-col items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-xs sm:text-sm font-black tracking-[0.25em] text-stone-950 uppercase font-sans">
                      {card.brandFrameTopText || "ILYN"}
                    </span>
                  </div>
                  {card.brandFrameTopSub && (
                    <div className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-stone-500 uppercase mt-0.5 pl-3">
                      {card.brandFrameTopSub}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom-Right: Category Tag (e.g. "KIDS", "SUMMER 26") */}
            <div className="absolute bottom-5 right-5 z-30 pointer-events-none select-none animate-in fade-in duration-300">
              <div className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-stone-900/90 text-white backdrop-blur-md border border-stone-800 shadow-md flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-black tracking-[0.22em] uppercase font-sans">
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
                  className="text-5xl sm:text-6xl font-black tracking-tighter text-transparent select-none drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)]"
                  style={{
                    WebkitTextStroke: isLightTone ? "2px #FFFFFF" : "2px #FDE68A",
                  }}
                >
                  {card.collectionSeason}
                </div>
                <div
                  className={`text-xs sm:text-sm font-black tracking-[0.3em] uppercase mt-0.5 ${
                    isLightTone ? "text-white drop-shadow-md" : "text-amber-300 drop-shadow-md"
                  }`}
                >
                  {card.collectionSub}
                </div>
              </div>
            ) : card.collectionStyle === "solid-bold" ? (
              <div className="leading-none">
                <div className={`text-4xl sm:text-5xl font-black tracking-tighter ${isLightTone ? "text-stone-900" : "text-white"}`}>
                  {card.collectionSeason}
                </div>
                <div className={`text-xs font-bold tracking-widest uppercase mt-1 ${isLightTone ? "text-stone-600" : "text-slate-300"}`}>
                  {card.collectionSub}
                </div>
              </div>
            ) : (
              <div className="leading-none font-serif">
                <div className={`text-3xl sm:text-4xl italic font-normal ${isLightTone ? "text-stone-800" : "text-amber-200"}`}>
                  {card.collectionSeason}
                </div>
                <div className={`text-[10px] tracking-widest uppercase mt-1 ${isLightTone ? "text-stone-500" : "text-amber-300/80"}`}>
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
            <div className={`text-[11px] sm:text-xs font-extrabold tracking-wider uppercase leading-tight ${isLightTone ? "text-stone-900" : "text-white"}`}>
              {card.editorialHeading}
            </div>
            <div className={`w-6 h-0.5 my-1.5 ${isLightTone ? "bg-stone-900/40" : "bg-white/40"}`} />
            <div className={`text-[9px] sm:text-[10px] whitespace-pre-line leading-relaxed font-sans ${isLightTone ? "text-stone-600" : "text-slate-300"}`}>
              {card.editorialBullets}
            </div>
          </div>
        )}

        {/* 6B. HERO PRODUCT HEADLINE (EXACT MATCH TO IMAGE 2: STRIPED DROP SHOULDER) */}
        {card.showProductHeadline && (
          <div className="absolute top-16 sm:top-18 inset-x-0 z-30 pointer-events-none text-center px-4 select-none animate-in fade-in duration-300">
            <div
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none uppercase"
              style={{ color: card.headlineColor || "#1B4332" }}
            >
              {card.headlineMain || "STRIPED"}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none uppercase text-stone-900 mt-0.5">
              {card.headlineSecondary || "DROP SHOULDER"}
            </div>
            {card.headlineSub && (
              <div className="text-[9px] sm:text-[10px] font-semibold tracking-widest text-stone-600 mt-2 font-mono">
                {card.headlineSub}
              </div>
            )}
          </div>
        )}

        {/* 6C. MINIMALIST SPACED FOOTER CTA (EXACT MATCH TO IMAGE 2: SHOP NOW | RAWSTITCH.COM.BD) */}
        {card.showFooterCta && (
          <div className="absolute bottom-5 inset-x-0 z-30 pointer-events-none text-center select-none animate-in fade-in duration-300">
            <div className="inline-block px-4 py-1 rounded-full bg-white/75 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-stone-800 uppercase border border-stone-300/70 shadow-2xs">
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
            <div className={`text-xs sm:text-sm font-black tracking-[0.35em] uppercase font-serif drop-shadow-xs ${
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
