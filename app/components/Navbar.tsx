"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Menu, X, Globe, ShieldCheck } from "lucide-react";
import { Language, translations } from "../data/locales";

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
}

export function Navbar({ lang, onToggleLang }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 p-0.5 shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <span className="text-xl font-black text-amber-500">
                ছবি
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                ছবি Studio
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                AI Pro
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">
              {lang === "bn" ? "বাংলাদেশি এফ-কমার্স ফটো স্যুট" : "F-Commerce Photo Suite"}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#demo"
            className="text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors"
          >
            {t.nav.demo}
          </a>
          <a
            href="#badges"
            className="text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors"
          >
            {t.nav.badges}
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors"
          >
            {t.nav.pricing}
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors"
          >
            {t.nav.faq}
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Dual Language Switcher Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 border border-stone-200 transition-all cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span className="tracking-wide">
              {lang === "bn" ? "English" : "বাংলা"}
            </span>
            <span className="text-[10px] bg-amber-400/30 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">
              {lang.toUpperCase()}
            </span>
          </button>

          {/* Launch Studio CTA (Warm yellow pill matching user's image) */}
          <a
            href="/studio"
            className="relative group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-stone-950 group-hover:rotate-12 transition-transform" />
            <span>{t.nav.launchEditor}</span>
            <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleLang}
            className="p-2 rounded-lg bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold"
          >
            {lang === "bn" ? "EN" : "বাং"}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:text-stone-950 border border-stone-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-6 space-y-4 shadow-lg">
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-stone-700 hover:text-stone-950"
          >
            {t.nav.demo}
          </a>
          <a
            href="#badges"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-stone-700 hover:text-stone-950"
          >
            {t.nav.badges}
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-stone-700 hover:text-stone-950"
          >
            {t.nav.pricing}
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-stone-700 hover:text-stone-950"
          >
            {t.nav.faq}
          </a>
          <div className="pt-4 border-t border-stone-200 flex flex-col gap-3">
            <a
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full font-bold text-sm text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-sm"
            >
              {t.nav.launchEditor}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
