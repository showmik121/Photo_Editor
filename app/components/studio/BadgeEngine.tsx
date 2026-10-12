"use client";

import React from "react";
import {
  Truck,
  ShieldCheck,
  Percent,
  Tag,
  Zap,
  Phone,
  Check,
  RotateCcw,
  Move,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Language } from "../../data/locales";

export type PriceTagStyle =
  | "dark-gold"
  | "luxury-gold"
  | "minimal-white"
  | "vibrant-red"
  | "glass-frost"
  | "emerald-green";

export type PricePositionPreset =
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "custom";

export interface BadgeState {
  showPrice: boolean;
  priceValue: string;
  priceNumSystem: "bn" | "en";
  priceLabel: string;
  priceCurrency: string;
  priceStyle: PriceTagStyle;
  priceScale: number;
  priceOffsetX: number;
  priceOffsetY: number;
  pricePreset: PricePositionPreset;
  showDiscount: boolean;
  discountValue: string;
  discountLabel: string;
  showDelivery: boolean;
  deliveryText: string;
  showCod: boolean;
  codText: string;
  showUrgency: boolean;
  urgencyText: string;
  showTrust: boolean;
  trustText: string;
  showContact: boolean;
  contactText: string;
}

interface BadgeEngineProps {
  badges: BadgeState;
  onChange: (badges: BadgeState) => void;
  lang: Language;
}

export function BadgeEngine({ badges, onChange, lang }: BadgeEngineProps) {
  const update = (patch: Partial<BadgeState>) => {
    onChange({ ...badges, ...patch });
  };

  const convertToBnNumerals = (str: string) => {
    const bnNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return str.replace(/[0-9]/g, (d) => bnNums[parseInt(d, 10)]);
  };

  const convertToEnNumerals = (str: string) => {
    const enNums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const bnMap: Record<string, string> = {
      "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
      "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
    };
    return str.replace(/[০-৯]/g, (d) => bnMap[d]);
  };

  const handlePriceNumToggle = () => {
    if (badges.priceNumSystem === "bn") {
      update({
        priceNumSystem: "en",
        priceValue: convertToEnNumerals(badges.priceValue),
      });
    } else {
      update({
        priceNumSystem: "bn",
        priceValue: convertToBnNumerals(badges.priceValue),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Price Tag Customizer (Movable & Highly Customizable) */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={badges.showPrice}
              onChange={(e) => update({ showPrice: e.target.checked })}
              className="rounded accent-amber-500 w-3.5 h-3.5"
            />
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "৳ মূল্য বাটন (Movable Price Tag)" : "৳ Movable Price Badge"}</span>
          </label>

          <button
            onClick={handlePriceNumToggle}
            className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-colors font-bold"
          >
            {badges.priceNumSystem === "bn" ? "বাংলা সংখ্যা (১২৩৪)" : "English Num (1234)"}
          </button>
        </div>

        {badges.showPrice && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Price Value & Currency & Label */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-600">
                {lang === "bn" ? "মূল্য ও লেবেল টেক্সট:" : "Price Amount & Custom Label:"}
              </label>
              <div className="grid grid-cols-12 gap-1.5">
                {/* Prefix Label */}
                <input
                  type="text"
                  value={badges.priceLabel ?? "PRICE:"}
                  onChange={(e) => update({ priceLabel: e.target.value })}
                  placeholder="PRICE:"
                  className="col-span-4 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:border-amber-400"
                  title="Label before price"
                />

                {/* Currency Symbol */}
                <select
                  value={badges.priceCurrency ?? "৳"}
                  onChange={(e) => update({ priceCurrency: e.target.value })}
                  className="col-span-3 px-1.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-bold text-amber-600 focus:bg-white focus:outline-none focus:border-amber-400"
                >
                  <option value="৳">৳ (BDT)</option>
                  <option value="BDT">BDT</option>
                  <option value="$">$ (USD)</option>
                  <option value="TK">TK</option>
                  <option value="">(None)</option>
                </select>

                {/* Price Amount */}
                <input
                  type="text"
                  value={badges.priceValue}
                  onChange={(e) => update({ priceValue: e.target.value })}
                  className="col-span-5 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-sm font-bold text-amber-600 focus:bg-white focus:outline-none focus:border-amber-400"
                  placeholder="১,৪৯০"
                />
              </div>

              {/* Quick Label Shortcuts */}
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                <span className="text-[10px] text-stone-500">
                  {lang === "bn" ? "লেবেল বাছাই:" : "Quick label:"}
                </span>
                {["PRICE:", "দাম:", "স্পেশাল অফার:", "মাত্র", ""].map((lbl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => update({ priceLabel: lbl })}
                    className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors ${
                      (badges.priceLabel ?? "PRICE:") === lbl
                        ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    {lbl === "" ? (lang === "bn" ? "কোনোটি না" : "None") : lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Style Theme Picker */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === "bn" ? "বাটনের ডিজাইন থিম:" : "Price Badge Style Theme:"}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  {
                    id: "dark-gold" as PriceTagStyle,
                    name: lang === "bn" ? "ডার্ক ও গোল্ড" : "Dark Gold",
                    preview: "bg-slate-950 text-amber-300 border border-amber-400",
                  },
                  {
                    id: "luxury-gold" as PriceTagStyle,
                    name: lang === "bn" ? "লাক্সারি মেটালিক" : "Luxury Solid",
                    preview: "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold",
                  },
                  {
                    id: "minimal-white" as PriceTagStyle,
                    name: lang === "bn" ? "মিনিমাল হোয়াইট" : "Monochrome",
                    preview: "bg-white text-stone-900 border border-stone-300 font-bold",
                  },
                  {
                    id: "vibrant-red" as PriceTagStyle,
                    name: lang === "bn" ? "অফার রেড" : "Urgent Red",
                    preview: "bg-rose-600 text-white font-bold",
                  },
                  {
                    id: "glass-frost" as PriceTagStyle,
                    name: lang === "bn" ? "ফ্রস্টেড গ্লাস" : "Frosted Glass",
                    preview: "bg-stone-800/80 backdrop-blur text-white border border-white/40",
                  },
                  {
                    id: "emerald-green" as PriceTagStyle,
                    name: lang === "bn" ? "রয়্যাল এমারেল্ড" : "Royal Emerald",
                    preview: "bg-emerald-950 text-emerald-300 border border-emerald-500",
                  },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => update({ priceStyle: st.id })}
                    className={`px-2 py-1.5 rounded-xl text-[10px] text-center border transition-all flex flex-col items-center gap-1 ${
                      (badges.priceStyle ?? "dark-gold") === st.id
                        ? "border-amber-400 bg-amber-50/80 text-stone-900 shadow-2xs ring-2 ring-amber-400/20"
                        : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:text-stone-900"
                    }`}
                  >
                    <span className={`w-full py-0.5 px-1 rounded-md text-[9px] shadow-2xs ${st.preview}`}>
                      ৳ {badges.priceValue}
                    </span>
                    <span className="font-semibold truncate w-full">{st.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Position Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === "bn" ? "বাটনের অবস্থান (Movable Position):" : "Badge Placement (Moveable):"}</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    update({
                      priceOffsetX: 0,
                      priceOffsetY: 0,
                      priceScale: 1.0,
                      pricePreset: "bottom-center",
                    })
                  }
                  className="text-[10px] text-stone-500 hover:text-amber-700 flex items-center gap-1 transition-colors font-semibold"
                  title="Reset position"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === "bn" ? "রিসেট" : "Reset"}</span>
                </button>
              </div>

              {/* Position Preset Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  {
                    id: "bottom-center" as PricePositionPreset,
                    label: lang === "bn" ? "নিচে মাঝে" : "Bottom Center",
                    x: 0,
                    y: 0,
                  },
                  {
                    id: "top-right" as PricePositionPreset,
                    label: lang === "bn" ? "উপরে ডানে" : "Top Right",
                    x: 120,
                    y: -220,
                  },
                  {
                    id: "top-left" as PricePositionPreset,
                    label: lang === "bn" ? "উপরে বামে" : "Top Left",
                    x: -120,
                    y: -220,
                  },
                  {
                    id: "top-center" as PricePositionPreset,
                    label: lang === "bn" ? "উপরে মাঝে" : "Top Center",
                    x: 0,
                    y: -230,
                  },
                  {
                    id: "bottom-left" as PricePositionPreset,
                    label: lang === "bn" ? "নিচে বামে" : "Bottom Left",
                    x: -110,
                    y: 15,
                  },
                  {
                    id: "bottom-right" as PricePositionPreset,
                    label: lang === "bn" ? "নিচে ডানে" : "Bottom Right",
                    x: 110,
                    y: 15,
                  },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() =>
                      update({
                        priceOffsetX: pos.x,
                        priceOffsetY: pos.y,
                        pricePreset: pos.id,
                      })
                    }
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                      badges.pricePreset === pos.id &&
                      badges.priceOffsetX === pos.x &&
                      badges.priceOffsetY === pos.y
                        ? "bg-amber-400 text-stone-950 border-amber-400 shadow-2xs font-bold"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>

              {/* Direct Canvas Drag Hint */}
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-900 flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 shrink-0 text-amber-600 animate-pulse" />
                <span>
                  {lang === "bn"
                    ? "টিপস: ক্যানভাসে মাউস দিয়ে সরাসরি ড্র্যাগ করেও (Drag & Drop) প্রাইস বাটন ইচ্ছামতো যেখানে খুশি বসানো যাবে!"
                    : "Tip: Drag & drop the price badge directly on the canvas to place it anywhere!"}
                </span>
              </div>
            </div>

            {/* Position Sliders & Scale Slider */}
            <div className="space-y-2 pt-1 border-t border-stone-200">
              {/* X Offset */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-stone-600">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-stone-400" />
                    {lang === "bn" ? "অনুভূমিক অবস্থান (X Offset):" : "Horizontal X Position:"}
                  </span>
                  <span className="font-mono text-amber-700 font-bold">
                    {badges.priceOffsetX ?? 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-220"
                  max="220"
                  step="2"
                  value={badges.priceOffsetX ?? 0}
                  onChange={(e) =>
                    update({
                      priceOffsetX: Number(e.target.value),
                      pricePreset: "custom",
                    })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Y Offset */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-stone-600">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-stone-400" />
                    {lang === "bn" ? "উল্লম্ব অবস্থান (Y Offset):" : "Vertical Y Position:"}
                  </span>
                  <span className="font-mono text-amber-700 font-bold">
                    {badges.priceOffsetY ?? 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-360"
                  max="160"
                  step="2"
                  value={badges.priceOffsetY ?? 0}
                  onChange={(e) =>
                    update({
                      priceOffsetY: Number(e.target.value),
                      pricePreset: "custom",
                    })
                  }
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Badge Scale Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-stone-600">
                  <span>{lang === "bn" ? "বাটনের সাইজ (Size Scale):" : "Badge Scale / Size:"}</span>
                  <span className="font-mono text-amber-700 font-bold">
                    {Math.round((badges.priceScale ?? 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={badges.priceScale ?? 1.0}
                  onChange={(e) => update({ priceScale: Number(e.target.value) })}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Discount Badge */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-rose-700 flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={badges.showDiscount}
              onChange={(e) => update({ showDiscount: e.target.checked })}
              className="rounded accent-rose-500 w-3.5 h-3.5"
            />
            <Percent className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "ডিসকাউন্ট স্টিকার" : "Discount Badge"}</span>
          </label>
        </div>

        {badges.showDiscount && (
          <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-200">
            <input
              type="text"
              value={badges.discountValue}
              onChange={(e) => update({ discountValue: e.target.value })}
              className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-bold text-rose-600 focus:bg-white focus:outline-none focus:border-rose-400"
              placeholder="৫০%"
            />
            <input
              type="text"
              value={badges.discountLabel}
              onChange={(e) => update({ discountLabel: e.target.value })}
              className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:border-rose-400"
              placeholder={lang === "bn" ? "ছাড়" : "OFF"}
            />
          </div>
        )}
      </div>

      {/* 3. Fast Toggle Badges */}
      <div className="space-y-2">
        {/* Free Delivery */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-emerald-800">
            <input
              type="checkbox"
              checked={badges.showDelivery}
              onChange={(e) => update({ showDelivery: e.target.checked })}
              className="rounded accent-emerald-500 w-3.5 h-3.5"
            />
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{badges.deliveryText}</span>
          </label>
        </div>

        {/* Cash on Delivery */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-sky-800">
            <input
              type="checkbox"
              checked={badges.showCod}
              onChange={(e) => update({ showCod: e.target.checked })}
              className="rounded accent-sky-500 w-3.5 h-3.5"
            />
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>{badges.codText}</span>
          </label>
        </div>

        {/* Limited Stock */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-800">
            <input
              type="checkbox"
              checked={badges.showUrgency}
              onChange={(e) => update({ showUrgency: e.target.checked })}
              className="rounded accent-amber-500 w-3.5 h-3.5"
            />
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{badges.urgencyText}</span>
          </label>
        </div>

        {/* Inspect Before Pay */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-indigo-800">
            <input
              type="checkbox"
              checked={badges.showTrust}
              onChange={(e) => update({ showTrust: e.target.checked })}
              className="rounded accent-indigo-500 w-3.5 h-3.5"
            />
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>{badges.trustText}</span>
          </label>
        </div>

        {/* Contact/Shop Watermark */}
        <div className="p-2.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-purple-800">
            <input
              type="checkbox"
              checked={badges.showContact}
              onChange={(e) => update({ showContact: e.target.checked })}
              className="rounded accent-purple-500 w-3.5 h-3.5"
            />
            <Phone className="w-3.5 h-3.5 text-purple-600" />
            <span>{lang === "bn" ? "যোগাযোগ / পেজের নাম ওয়াটারমার্ক" : "Contact / Shop Name Watermark"}</span>
          </label>
          {badges.showContact && (
            <input
              type="text"
              value={badges.contactText}
              onChange={(e) => update({ contactText: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-purple-400"
              placeholder="017XXXXXXXX বা পেজ নাম"
            />
          )}
        </div>
      </div>
    </div>
  );
}
