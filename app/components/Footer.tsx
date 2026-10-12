"use client";

import React from "react";
import { Sparkles, Heart } from "lucide-react";
import { Language, translations } from "../data/locales";

interface FooterProps {
  lang: Language;
}

export function Footer({ lang }: FooterProps) {
  const t = translations[lang];

  return (
    <footer className="border-t border-stone-200/80 bg-white py-12 relative text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center font-bold text-stone-950 text-sm shadow-2xs">
            ছবি
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-stone-900">ছবি Studio</span>
            <span className="text-xs text-stone-500">
              {lang === "bn" ? "মেড ফর বাংলাদেশ" : "Made for Bangladesh"} 🇧🇩
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-xs sm:text-sm text-stone-500 text-center max-w-md">
          {t.footer.tagline}
        </div>

        {/* Copyright */}
        <div className="text-xs text-stone-400 flex items-center gap-1">
          <span>© 2026 ছবি Studio.</span>
          <span>{t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
