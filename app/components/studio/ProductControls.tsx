"use client";

import React from "react";
import {
  Maximize2,
  Move,
  FlipHorizontal,
  RotateCcw,
  Sparkles,
  Layers,
  Scissors,
} from "lucide-react";
import { Language } from "../../data/locales";

export interface ProductTransformState {
  scale: number; // 0.4 to 1.6
  offsetX: number; // -150 to 150
  offsetY: number; // -150 to 150
  flipped: boolean;
  shadowEnabled: boolean;
  shadowOpacity: number; // 0.1 to 1.0
  shadowSpread: number; // 10 to 60
}

interface ProductControlsProps {
  transform: ProductTransformState;
  onChange: (transform: ProductTransformState) => void;
  onReset: () => void;
  onRemoveBg?: () => void;
  isRemovingBg?: boolean;
  hasOriginal?: boolean;
  showingOriginal?: boolean;
  onToggleOriginal?: (showOriginal: boolean) => void;
  lang: Language;
}

export function ProductControls({
  transform,
  onChange,
  onReset,
  onRemoveBg,
  isRemovingBg,
  hasOriginal,
  showingOriginal,
  onToggleOriginal,
  lang,
}: ProductControlsProps) {
  const update = (patch: Partial<ProductTransformState>) => {
    onChange({ ...transform, ...patch });
  };

  return (
    <div className="space-y-4">
      {/* 0. Background Removal Action Card */}
      {onRemoveBg && (
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-300 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-stone-900">
            <span className="flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {lang === "bn"
                  ? "ব্যাকগ্রাউন্ড রিমুভাল (Background Cutout)"
                  : "Background Removal"}
              </span>
            </span>
          </div>

          <button
            onClick={onRemoveBg}
            disabled={isRemovingBg}
            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-70 transition-all"
          >
            {isRemovingBg ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>{lang === "bn" ? "AI ব্যাকগ্রাউন্ড কাটছে..." : "AI Removing Background..."}</span>
              </>
            ) : (
              <>
                <Scissors className="w-3.5 h-3.5 text-stone-950" />
                <span>{lang === "bn" ? "AI দিয়ে ব্যাকগ্রাউন্ড মুছুন" : "Remove Background Now"}</span>
              </>
            )}
          </button>

          {hasOriginal && (
            <div className="flex items-center justify-between pt-2 border-t border-amber-200/80 text-xs">
              <span className="text-stone-600 text-[11px]">
                {lang === "bn" ? "আসল ব্যাকগ্রাউন্ড প্রদর্শন:" : "Show Original BG:"}
              </span>
              <div className="flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
                <button
                  onClick={() => onToggleOriginal?.(true)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    showingOriginal ? "bg-amber-400 text-stone-950 shadow-2xs" : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  {lang === "bn" ? "আসল" : "Original"}
                </button>
                <button
                  onClick={() => onToggleOriginal?.(false)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    !showingOriginal ? "bg-amber-400 text-stone-950 shadow-2xs" : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  {lang === "bn" ? "কাটআউট" : "Cutout"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. Scale & Size */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "প্রোডাক্ট সাইজ (স্কেল)" : "Product Scale"}</span>
          </span>
          <span className="font-mono text-amber-700 font-bold">
            {Math.round(transform.scale * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="40"
          max="160"
          value={Math.round(transform.scale * 100)}
          onChange={(e) => update({ scale: parseInt(e.target.value, 10) / 100 })}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      {/* 2. Position X & Y */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-sky-600" />
            <span>{lang === "bn" ? "পজিশন অ্যাডজাস্ট (ডানে/বামে/উপরে/নিচে)" : "Position Alignment"}</span>
          </span>
        </div>

        {/* X Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-stone-600">
            <span>{lang === "bn" ? "হরিজন্টাল (X)" : "Horizontal (X)"}</span>
            <span className="font-mono font-bold text-stone-800">{transform.offsetX}px</span>
          </div>
          <input
            type="range"
            min="-120"
            max="120"
            value={transform.offsetX}
            onChange={(e) => update({ offsetX: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>

        {/* Y Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-stone-600">
            <span>{lang === "bn" ? "ভার্টিক্যাল (Y)" : "Vertical (Y)"}</span>
            <span className="font-mono font-bold text-stone-800">{transform.offsetY}px</span>
          </div>
          <input
            type="range"
            min="-120"
            max="120"
            value={transform.offsetY}
            onChange={(e) => update({ offsetY: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>
      </div>

      {/* 3. 3D Realistic Contact Drop Shadow */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={transform.shadowEnabled}
              onChange={(e) => update({ shadowEnabled: e.target.checked })}
              className="rounded accent-emerald-500 w-3.5 h-3.5"
            />
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === "bn" ? "3D গ্রাউন্ড কন্টাক্ট শ্যাডো" : "3D Contact Ground Shadow"}</span>
          </label>
          <span className="text-[10px] text-emerald-700 font-mono font-semibold">
            {transform.shadowEnabled ? "Enabled" : "Off"}
          </span>
        </div>

        {transform.shadowEnabled && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-200">
            <div className="flex justify-between text-[11px] text-stone-600">
              <span>{lang === "bn" ? "শ্যাডোর তীব্রতা (Opacity)" : "Shadow Opacity"}</span>
              <span className="font-mono font-bold text-stone-800">{Math.round(transform.shadowOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={Math.round(transform.shadowOpacity * 100)}
              onChange={(e) => update({ shadowOpacity: parseInt(e.target.value, 10) / 100 })}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        )}
      </div>

      {/* 4. Action Row: Flip & Reset */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => update({ flipped: !transform.flipped })}
          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            transform.flipped
              ? "bg-amber-400 text-stone-950 border-amber-400 shadow-xs"
              : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50 shadow-2xs"
          }`}
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          <span>{lang === "bn" ? "হরিজন্টাল ফ্লিপ" : "Flip Horizontal"}</span>
        </button>

        <button
          onClick={onReset}
          className="py-2 px-3 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === "bn" ? "রিসেট পজিশন" : "Reset Layout"}</span>
        </button>
      </div>
    </div>
  );
}
