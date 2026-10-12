"use client";

import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { LiveStudioDemo } from "./components/LiveStudioDemo";
import { BadgesSection } from "./components/BadgesSection";
import { PricingSection } from "./components/PricingSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import { Language } from "./data/locales";

export default function Home() {
  const [lang, setLang] = useState<Language>("bn");

  const toggleLang = () => {
    setLang((prev) => (prev === "bn" ? "en" : "bn"));
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-stone-900 flex flex-col selection:bg-amber-400 selection:text-stone-950">
      {/* Top Fixed Header with Language Switcher */}
      <Navbar lang={lang} onToggleLang={toggleLang} />

      {/* Main Page Content Flow */}
      <main className="flex-1">
        {/* 1. Hero with Interactive Before/After Slider */}
        <HeroSection lang={lang} />

        {/* 2. Interactive Live Studio Generator Demo */}
        <LiveStudioDemo lang={lang} />

        {/* 3. Bangladeshi Trust Badges Showcase */}
        <BadgesSection lang={lang} />

        {/* 4. Pricing with BDT Rates & bKash/Nagad Checkout */}
        <PricingSection lang={lang} />

        {/* 5. Frequently Asked Questions */}
        <FaqSection lang={lang} />
      </main>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
