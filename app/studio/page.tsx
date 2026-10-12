"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Globe,
  Upload,
  Palette,
  Tag,
  Maximize2,
  Sliders,
  Layers,
  RotateCcw,
  Scissors,
} from "lucide-react";
import { Language, translations } from "../data/locales";
import { SAMPLE_PRODUCTS, SampleProduct, svgToDataUrl } from "../data/sampleProducts";
import {
  STUDIO_PRESETS,
  StudioPreset,
  CustomCardState,
  defaultCustomCardState,
} from "../data/studioPresets";
import { AspectSelector, AspectRatio } from "../components/studio/AspectSelector";
import { UploadDropzone } from "../components/studio/UploadDropzone";
import { PresetSelector } from "../components/studio/PresetSelector";
import { CardCustomizer } from "../components/studio/CardCustomizer";
import { BadgeEngine, BadgeState } from "../components/studio/BadgeEngine";
import { ProductControls, ProductTransformState } from "../components/studio/ProductControls";
import { PhotoEnhanceControls, PhotoEnhanceState } from "../components/studio/PhotoEnhanceControls";
import { StudioCanvas } from "../components/studio/StudioCanvas";
import { ToastProvider, useToast } from "../components/Toast";
import { removeBackgroundAI, preprocessImage } from "../utils/imageProcessing";

type ActiveTab = "upload" | "presets" | "card" | "enhance" | "badges" | "transform";

function StudioWorkspace() {
  const { toast } = useToast();
  const [lang, setLang] = useState<Language>("bn");
  const [aspect, setAspect] = useState<AspectRatio>("1:1");
  const [activeTab, setActiveTab] = useState<ActiveTab>("presets");

  // Photo Enhancement State (Brightness, Contrast, Saturation, Sharpness)
  const [enhance, setEnhance] = useState<PhotoEnhanceState>({
    enabled: true,
    brightness: 1.12,
    contrast: 1.18,
    saturation: 1.25,
    sharpness: 45,
  });

  // Initial Product State (Loaded with first sample product by default)
  const defaultSample = SAMPLE_PRODUCTS[0];
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [cutoutImage, setCutoutImage] = useState<string | null>(
    svgToDataUrl(defaultSample.cutoutSvg)
  );
  const [showingOriginal, setShowingOriginal] = useState<boolean>(false);
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);

  // Preset Theme State
  const [selectedPreset, setSelectedPreset] = useState<StudioPreset>(STUDIO_PRESETS[0]);
  const [lightingIntensity, setLightingIntensity] = useState<number>(100);
  const [showPedestal, setShowPedestal] = useState<boolean>(true);

  // Custom Background Card State (Surfaces, Shadows, Wooden Hangers, Editorial Brand Typography)
  const [customCard, setCustomCard] = useState<CustomCardState>(() => ({
    ...defaultCustomCardState,
    ...(STUDIO_PRESETS[0].cardConfig || {}),
  }));

  const handleSelectPreset = (preset: StudioPreset) => {
    setSelectedPreset(preset);
    if (preset.cardConfig) {
      setCustomCard((prev) => ({
        ...prev,
        ...preset.cardConfig,
      }));
    }
    toast(
      lang === "bn" ? `থিম পরিবর্তন: ${preset.nameBn}` : `Theme Applied: ${preset.nameEn}`,
      lang === "bn" ? "কার্ডের ব্যাকগ্রাউন্ড ও প্রপস আপডেট হয়েছে।" : "Backdrop and studio props updated.",
      "info"
    );
  };

  const handleResetCard = () => {
    if (selectedPreset.cardConfig) {
      setCustomCard({
        ...defaultCustomCardState,
        ...selectedPreset.cardConfig,
      });
    } else {
      setCustomCard(defaultCustomCardState);
    }
    toast(
      lang === "bn" ? "কার্ড রিসেট সম্পন্ন" : "Card Reset Complete",
      lang === "bn" ? "ডিফল্ট ব্যাকগ্রাউন্ড ও প্রপস ফেরত আনা হয়েছে।" : "Default backdrop props restored.",
      "info"
    );
  };

  // Badges State
  const [badges, setBadges] = useState<BadgeState>({
    showPrice: true,
    priceValue: defaultSample.defaultPrice,
    priceNumSystem: "bn",
    priceLabel: "PRICE:",
    priceCurrency: "৳",
    priceStyle: "dark-gold",
    priceScale: 1.0,
    priceOffsetX: 0,
    priceOffsetY: 0,
    pricePreset: "bottom-center",
    showDiscount: true,
    discountValue: defaultSample.defaultDiscount,
    discountLabel: "ছাড়",
    showDelivery: true,
    deliveryText: "সারা দেশে ফ্রি হোম ডেলিভারি",
    showCod: true,
    codText: "ক্যাশ অন ডেলিভারি সারা দেশে",
    showUrgency: true,
    urgencyText: "স্টক সীমিত",
    showTrust: false,
    trustText: "প্রোডাক্ট দেখে পেমেন্ট করুন",
    showContact: false,
    contactText: "017XXXXXXXX",
  });

  // Product Transform State
  const defaultTransform: ProductTransformState = {
    scale: 0.95,
    offsetX: 0,
    offsetY: -10,
    flipped: false,
    shadowEnabled: true,
    shadowOpacity: 0.65,
    shadowSpread: 30,
  };
  const [transform, setTransform] = useState<ProductTransformState>(defaultTransform);

  const toggleLang = () => {
    setLang((prev) => (prev === "bn" ? "en" : "bn"));
  };

  const handleProductReady = (
    dataUrl: string,
    sampleInfo?: SampleProduct,
    rawOriginal?: string
  ) => {
    if (rawOriginal) {
      setRawImage(rawOriginal);
    } else {
      setRawImage(null);
    }
    setCutoutImage(dataUrl);
    setShowingOriginal(false);

    if (sampleInfo) {
      setBadges((prev) => ({
        ...prev,
        priceValue: sampleInfo.defaultPrice,
        discountValue: sampleInfo.defaultDiscount,
      }));
    }
    setActiveTab("presets");
  };

  const handleResetTransform = () => {
    setTransform(defaultTransform);
  };

  // Immediate Background Removal Action (Can be triggered anywhere)
  const handleRemoveBgNow = async () => {
    const sourceToCut = rawImage || cutoutImage;
    if (!sourceToCut) return;

    setIsRemovingBg(true);
    toast(
      lang === "bn" ? "AI ব্যাকগ্রাউন্ড প্রসেসিং শুরু হয়েছে..." : "AI Background Removal Started...",
      lang === "bn" ? "মডেল দিয়ে ব্যাকগ্রাউন্ড আলাদা করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।" : "Segmenting edges, please wait...",
      "info"
    );

    try {
      const optimizedSource = await preprocessImage(sourceToCut, 1024);
      const cutoutResult = await removeBackgroundAI(optimizedSource, (msg) => {
        console.log("BG removal progress:", msg);
      });

      setCutoutImage(cutoutResult);
      setShowingOriginal(false);

      toast(
        lang === "bn" ? "ব্যাকগ্রাউন্ড সফলভাবে রিমুভ করা হয়েছে!" : "Background Removed Successfully!",
        lang === "bn" ? "ট্রান্সপারেন্ট স্টুডিও কাটআউট প্রস্তুত।" : "Transparent studio cutout ready.",
        "success"
      );
    } catch (err: any) {
      console.error("Cutout error:", err);
      toast(
        lang === "bn" ? "প্রসেসিংয়ে সমস্যা হয়েছে, অনুগ্রহ করে ছোট সাইজের ছবি দিন" : "Processing failed, please upload a smaller image file.",
        lang === "bn" ? "দয়া করে আবার চেষ্টা করুন।" : "Please try again.",
        "error"
      );
    } finally {
      setIsRemovingBg(false);
    }
  };

  const activeProductImage = showingOriginal ? rawImage : cutoutImage;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Studio Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 px-2 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{lang === "bn" ? "হোমে ফিরুন" : "Back to Home"}</span>
            </Link>
            <div className="h-4 w-px bg-stone-200 hidden sm:block" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400 flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-950" />
              </div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-stone-900">
                ছবি <span className="text-amber-500">Studio</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Aspect Ratio Selector (Square vs Vertical) */}
            <AspectSelector aspect={aspect} onChange={setAspect} lang={lang} />

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-700 hover:text-stone-900 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{lang === "bn" ? "EN" : "বাং"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio 2-Column Split Workspace (Mobile: Canvas first, Controls below) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* ----------------------------------------------------------------- */}
        {/* CONTROLS COLUMN (Mobile: order-2, Desktop: order-1, 5 COLS)        */}
        {/* ----------------------------------------------------------------- */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-4 w-full">
          {/* Navigation Tab Bar */}
          <div className="grid grid-cols-6 p-1 rounded-2xl bg-stone-100 border border-stone-200/80 gap-0.5 sm:gap-1">
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-2 px-0.5 sm:px-1 text-[10px] sm:text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all cursor-pointer ${
                activeTab === "upload"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "আপলোড" : "Upload"}</span>
            </button>

            <button
              onClick={() => setActiveTab("presets")}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === "presets"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "থিম" : "Themes"}</span>
            </button>

            <button
              onClick={() => setActiveTab("card")}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === "card"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "কার্ড" : "Card"}</span>
            </button>

            <button
              onClick={() => setActiveTab("enhance")}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === "enhance"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "এনহ্যান্স" : "Enhance"}</span>
            </button>

            <button
              onClick={() => setActiveTab("badges")}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === "badges"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "ব্যাজ" : "Badges"}</span>
            </button>

            <button
              onClick={() => setActiveTab("transform")}
              className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === "transform"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "পজিশন" : "Adjust"}</span>
            </button>
          </div>

          {/* Active Tab Content Card */}
          <div className="rounded-2xl p-5 bg-white border border-stone-200 shadow-2xs">
            {activeTab === "upload" && (
              <UploadDropzone onProductReady={handleProductReady} lang={lang} />
            )}

            {activeTab === "presets" && (
              <PresetSelector
                selectedPreset={selectedPreset}
                onSelect={handleSelectPreset}
                lightingIntensity={lightingIntensity}
                onLightingChange={setLightingIntensity}
                showPedestal={showPedestal}
                onPedestalToggle={setShowPedestal}
                onOpenCardCustomizer={() => setActiveTab("card")}
                lang={lang}
              />
            )}

            {activeTab === "card" && (
              <CardCustomizer
                cardState={customCard}
                onChange={setCustomCard}
                onReset={handleResetCard}
                lang={lang}
              />
            )}

            {activeTab === "enhance" && (
              <PhotoEnhanceControls
                enhance={enhance}
                onChange={setEnhance}
                lang={lang}
              />
            )}

            {activeTab === "badges" && (
              <BadgeEngine badges={badges} onChange={setBadges} lang={lang} />
            )}

            {activeTab === "transform" && (
              <ProductControls
                transform={transform}
                onChange={setTransform}
                onReset={handleResetTransform}
                onRemoveBg={handleRemoveBgNow}
                isRemovingBg={isRemovingBg}
                hasOriginal={Boolean(rawImage)}
                showingOriginal={showingOriginal}
                onToggleOriginal={setShowingOriginal}
                lang={lang}
              />
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* RIGHT COLUMN: INTERACTIVE CANVAS & EXPORT (Mobile: order-1, 7 COLS) */}
        {/* ----------------------------------------------------------------- */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center w-full">
          <StudioCanvas
            productImage={activeProductImage}
            selectedPreset={selectedPreset}
            customCard={customCard}
            badges={badges}
            onBadgesChange={setBadges}
            transform={transform}
            onTransformChange={setTransform}
            aspect={aspect}
            lightingIntensity={lightingIntensity}
            showPedestal={showPedestal}
            enhance={enhance}
            onRemoveBg={handleRemoveBgNow}
            isRemovingBg={isRemovingBg}
            hasOriginal={Boolean(rawImage)}
            showingOriginal={showingOriginal}
            onToggleOriginal={setShowingOriginal}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <ToastProvider>
      <StudioWorkspace />
    </ToastProvider>
  );
}
