"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  Sparkles,
  Scissors,
  CheckCircle2,
  AlertCircle,
  FileImage,
  RefreshCw,
} from "lucide-react";
import { Language } from "../../data/locales";
import { SAMPLE_PRODUCTS, SampleProduct, svgToDataUrl } from "../../data/sampleProducts";
import { validateImageFile, CUTOUT_STEPS, removeBackgroundAI } from "../../utils/imageProcessing";

interface UploadDropzoneProps {
  onProductReady: (dataUrl: string, sampleInfo?: SampleProduct, rawOriginal?: string) => void;
  lang: Language;
}

export function UploadDropzone({ onProductReady, lang }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageUpload = async (
    rawImageDataUrl: string,
    sampleInfo?: SampleProduct
  ) => {
    setIsProcessing(true);
    setPreviewThumbnail(rawImageDataUrl);
    setErrorMessage(null);
    setProcessingProgress(20);

    // If it's a sample product, use the SVG cutout immediately
    if (sampleInfo) {
      setStatusMessage(lang === "bn" ? "স্যাম্পল প্রোডাক্ট লোড হচ্ছে..." : "Loading sample product...");
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step < CUTOUT_STEPS.length) {
          setProcessingProgress(CUTOUT_STEPS[step].percent);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            const finalCutout = svgToDataUrl(sampleInfo.cutoutSvg);
            onProductReady(finalCutout, sampleInfo, rawImageDataUrl);
          }, 300);
        }
      }, 300);
      return;
    }

    // If user uploaded a real image
    if (!autoRemoveBg) {
      // User opted to keep original background
      setIsProcessing(false);
      onProductReady(rawImageDataUrl, undefined, rawImageDataUrl);
      return;
    }

    // Auto Remove Background is ON: Run AI background removal
    try {
      setStatusMessage(lang === "bn" ? "AI ব্যাকগ্রাউন্ড আলাদা করছে..." : "AI segmenting background...");
      setProcessingProgress(45);

      const cutoutDataUrl = await removeBackgroundAI(rawImageDataUrl, (msg, pct) => {
        setStatusMessage(msg);
        setProcessingProgress(pct);
      });

      setProcessingProgress(100);
      setStatusMessage(lang === "bn" ? "কাটআউট সম্পন্ন!" : "Cutout complete!");

      setTimeout(() => {
        setIsProcessing(false);
        onProductReady(cutoutDataUrl, undefined, rawImageDataUrl);
      }, 250);
    } catch (err: any) {
      console.warn("Background removal error:", err);
      setIsProcessing(false);
      setErrorMessage(
        lang === "bn"
          ? "ব্যাকগ্রাউন্ড কাটতে সমস্যা হয়েছে, তবে আসল ছবিটি যুক্ত করা হয়েছে।"
          : "Cutout failed, loaded original photo instead."
      );
      onProductReady(rawImageDataUrl, undefined, rawImageDataUrl);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  const handleFile = (file: File) => {
    const val = validateImageFile(file);
    if (!val.valid) {
      setErrorMessage(lang === "bn" ? val.errorBn! : val.errorEn!);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        processImageUpload(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sample: SampleProduct) => {
    const sampleDataUrl = svgToDataUrl(sample.cutoutSvg);
    processImageUpload(sampleDataUrl, sample);
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* =================================================================== */}
      {/* 1. EXPLICIT BACKGROUND REMOVAL OPTION SELECTOR (TOP)                 */}
      {/* =================================================================== */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-900 flex items-center gap-2 cursor-pointer">
            <Scissors className="w-4 h-4 text-amber-500" />
            <span>
              {lang === "bn"
                ? "আপলোডের সময় ব্যাকগ্রাউন্ড রিমুভ (Background Removal)"
                : "Remove Background on Upload"}
            </span>
          </label>

          <button
            onClick={() => setAutoRemoveBg(!autoRemoveBg)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              autoRemoveBg
                ? "bg-amber-400 text-stone-950 shadow-xs"
                : "bg-stone-100 text-stone-600 border border-stone-200 hover:text-stone-900"
            }`}
          >
            {autoRemoveBg ? (lang === "bn" ? "চালু (ON)" : "ENABLED") : (lang === "bn" ? "বন্ধ (OFF)" : "DISABLED")}
          </button>
        </div>

        <p className="text-[11px] text-stone-500">
          {autoRemoveBg
            ? (lang === "bn"
                ? "✓ বিছানার চাদর, মেঝে বা ঘরের ব্যাকগ্রাউন্ড স্বয়ংক্রিয়ভাবে মুছে ট্রান্সপারেন্ট কাটআউট তৈরি করবে।"
                : "✓ Automatically cuts out bedsheets, floors, and room backgrounds into transparent PNG.")
            : (lang === "bn"
                ? "আসল ছবির ব্যাকগ্রাউন্ড অক্ষুণ্ণ রেখে ক্যানভাসে বসানো হবে।"
                : "Keeps original photo with background intact.")}
        </p>
      </div>

      {/* =================================================================== */}
      {/* 2. MAIN DRAG & DROP UPLOAD ZONE                                     */}
      {/* =================================================================== */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-amber-400 bg-amber-50/60 shadow-lg shadow-amber-500/10"
            : "border-stone-300 bg-stone-50/80 hover:border-amber-400 hover:bg-amber-50/30"
        } ${isProcessing ? "pointer-events-none" : ""}`}
      >
        {/* Background Laser Scan Line Simulation */}
        {isProcessing && (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#f59e0b] animate-bounce duration-1000" />
            <div className="absolute inset-0 bg-amber-500/5 backdrop-blur-[1px]" />
          </div>
        )}

        {isProcessing ? (
          /* Multi-Step AI Processing View */
          <div className="py-4 space-y-4 relative z-30">
            <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-white border border-amber-400/50 flex items-center justify-center shadow-md">
              {previewThumbnail ? (
                <img
                  src={previewThumbnail}
                  alt="Processing"
                  className="w-full h-full object-contain p-2 animate-pulse"
                />
              ) : (
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm font-bold text-stone-900 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>
                  {statusMessage ||
                    (lang === "bn"
                      ? "AI ব্যাকগ্রাউন্ড প্রসেস করছে..."
                      : "AI processing background...")}
                </span>
              </div>
              <div className="text-xs font-mono text-amber-600 font-bold">
                {processingProgress}%
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs mx-auto h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${processingProgress}%` }}
              />
            </div>

            {/* Skip / Direct Continue button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProcessing(false);
                  if (previewThumbnail) {
                    onProductReady(previewThumbnail, undefined, previewThumbnail);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[11px] text-stone-700 font-semibold transition-colors cursor-pointer"
              >
                <span>{lang === "bn" ? "অপেক্ষা না করে আসল ছবি দিয়ে এডিট করুন ➔" : "Skip & edit with original ➔"}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Idle Upload View */
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100/70 border border-amber-300/80 flex items-center justify-center text-amber-600 shadow-2xs">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <div className="text-sm font-bold text-stone-900">
                {lang === "bn" ? "প্রোডাক্টের ছবি এখানে ড্র্যাগ করুন বা ক্লিক করে আপলোড করুন" : "Drag product photo here or click to upload"}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {lang === "bn"
                  ? "ফোনে তোলা সাধারণ যেকোনো ছবি (JPG, PNG, WebP — সর্বোচ্চ ২০ MB)"
                  : "Raw phone photos supported (JPG, PNG, WebP — Max 20MB)"}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-xs font-semibold text-stone-700 border border-stone-200 shadow-2xs transition-colors">
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === "bn" ? "মোবাইল ক্যামেরা বা গ্যালারি থেকে ছবি নিন" : "Camera or Photo Library"}</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 3. "TRY WITH SAMPLE PRODUCT" QUICK SELECTOR                          */}
      {/* =================================================================== */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "স্যাম্পল প্রোডাক্ট দিয়ে ট্রাই করুন:" : "Try with Sample Products:"}</span>
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {lang === "bn" ? "ইনস্ট্যান্ট টেস্টিং" : "Instant"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SAMPLE_PRODUCTS.map((sp) => (
            <button
              key={sp.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSampleSelect(sp);
              }}
              className="p-2 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 group-hover:border-amber-400/50 flex items-center justify-center p-1 overflow-hidden transition-colors shadow-2xs">
                <img
                  src={svgToDataUrl(sp.cutoutSvg)}
                  alt={sp.nameBn}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div className="text-[10px] font-bold text-stone-700 group-hover:text-amber-700 truncate w-full">
                {lang === "bn" ? sp.nameBn : sp.nameEn}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
