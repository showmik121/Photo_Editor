"use client";

import React, { useState } from "react";
import {
  Truck,
  ShieldCheck,
  BadgePercent,
  CreditCard,
  Flame,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { Language, translations } from "../data/locales";
import { TRUST_BADGES, TrustBadgeItem } from "../data/mockData";

interface BadgesSectionProps {
  lang: Language;
}

export function BadgesSection({ lang }: BadgesSectionProps) {
  const t = translations[lang];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (name: TrustBadgeItem["iconName"]) => {
    switch (name) {
      case "Truck":
        return <Truck className="w-5 h-5" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5" />;
      case "BadgePercent":
        return <BadgePercent className="w-5 h-5" />;
      case "CreditCard":
        return <CreditCard className="w-5 h-5" />;
      case "Flame":
        return <Flame className="w-5 h-5" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getColorClasses = (scheme: TrustBadgeItem["colorScheme"]) => {
    switch (scheme) {
      case "green":
        return "bg-emerald-50 border-emerald-300 text-emerald-800";
      case "blue":
        return "bg-sky-50 border-sky-300 text-sky-800";
      case "red":
        return "bg-rose-50 border-rose-300 text-rose-800";
      case "amber":
        return "bg-amber-50 border-amber-300 text-amber-800";
      case "purple":
        return "bg-purple-50 border-purple-300 text-purple-800";
      default:
        return "bg-stone-100 border-stone-200 text-stone-700";
    }
  };

  return (
    <section id="badges" className="py-20 md:py-28 relative bg-[#FBFBFA] border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === "bn" ? "দেশীয় ট্রাস্ট বুস্টার লাইব্রেরি" : "Local Trust Booster Library"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-950 tracking-tight">
            {t.badgesSection.title}{" "}
            <span className="text-amber-600">
              {t.badgesSection.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600">
            {t.badgesSection.subtitle}
          </p>
        </div>

        {/* 6-Grid Badges Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_BADGES.map((badge) => {
            const isCopied = copiedId === badge.id;
            const badgeColor = getColorClasses(badge.colorScheme);

            return (
              <div
                key={badge.id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge Preview Pill */}
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-xs shadow-2xs ${badgeColor}`}
                    >
                      {getIcon(badge.iconName)}
                      <span>
                        {lang === "bn" ? badge.previewTextBn : badge.previewTextEn}
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-500">
                      1-Click Overlay
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                    {lang === "bn" ? badge.titleBn : badge.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                    {lang === "bn" ? badge.subBn : badge.subEn}
                  </p>
                </div>

                {/* Footer with Quick Action */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-600">
                    <Check className="w-3.5 h-3.5" />
                    {lang === "bn" ? "ভেরিফাইড ইউনিকোড" : "Verified Unicode"}
                  </span>

                  <button
                    onClick={() => handleCopy(badge.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">
                          {lang === "bn" ? "যুক্ত হয়েছে!" : "Added!"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {lang === "bn" ? "কপি ব্যাজ" : "Copy Badge"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">
                {t.badgesSection.trustNote}
              </div>
              <div className="text-xs text-stone-500">
                {lang === "bn"
                  ? "হিন্দশিলিগুড়ি ও সোলাইমানলিপি ফন্টে অটো-রেন্ডার হয়"
                  : "Auto-renders using verified Bengali typefaces"}
              </div>
            </div>
          </div>

          <a
            href="/studio"
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs font-semibold text-white transition-all shrink-0 cursor-pointer shadow-2xs"
          >
            {lang === "bn" ? "লাইভ স্টুডিওতে ট্রাই করুন" : "Try in Studio"}
          </a>
        </div>
      </div>
    </section>
  );
}
