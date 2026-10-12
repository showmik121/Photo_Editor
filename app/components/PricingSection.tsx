"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Check,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Language, translations } from "../data/locales";
import { PRICING_PLANS, PricingPlan } from "../data/mockData";

interface PricingSectionProps {
  lang: Language;
}

export function PricingSection({ lang }: PricingSectionProps) {
  const t = translations[lang];

  // Simulated modal for checkout
  const [activePlan, setActivePlan] = useState<PricingPlan | null>(null);
  const [selectedMFS, setSelectedMFS] = useState<"bkash" | "nagad">("bkash");
  const [phoneNumber, setPhoneNumber] = useState<string>("017XXXXXXXX");
  const [checkoutStep, setCheckoutStep] = useState<"method" | "processing" | "success">("method");

  const openCheckout = (plan: PricingPlan) => {
    setActivePlan(plan);
    setCheckoutStep("method");
  };

  const processPayment = () => {
    setCheckoutStep("processing");
    setTimeout(() => {
      setCheckoutStep("success");
    }, 1800);
  };

  return (
    <section id="pricing" className="py-20 md:py-28 relative bg-[#FBFBFA] border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === "bn" ? "ডলার ছাড়া লোকাল পেমেন্ট" : "Zero USD Friction Pricing"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-950 tracking-tight">
            {t.pricing.title}{" "}
            <span className="text-amber-600">
              {t.pricing.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-600">
            {t.pricing.subtitle}
          </p>

          {/* Supported MFS Badges Ribbon */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-xs font-medium text-stone-500">
              {lang === "bn" ? "সাপোর্টেড লোকাল পেমেন্ট গেটওয়ে:" : "Supported Local Gateways:"}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold">
              bKash বিকাশ
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
              Nagad নগদ
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
              Rocket রকেট
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              Upay উপায়
            </span>
          </div>
        </div>

        {/* 3-Column Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 bg-white ${
                  isPopular
                    ? "border-2 border-amber-400 shadow-xl shadow-amber-500/10 md:-translate-y-2"
                    : "border border-stone-200 shadow-2xs hover:border-stone-300 hover:shadow-md"
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                    <span className="px-4 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-xs">
                      {lang === "bn" ? plan.badgeBn : plan.badgeEn}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-stone-900">
                      {lang === "bn" ? plan.nameBn : plan.nameEn}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 font-mono text-stone-600">
                      {plan.credits} {lang === "bn" ? "ক্রেডিট" : "Credits"}
                    </span>
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-stone-950">
                      ৳{plan.priceBdt}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      / {lang === "bn" ? plan.billingPeriodBn : plan.billingPeriodEn}
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-semibold text-emerald-700 font-mono">
                    {plan.costPerImageBdt}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-8 space-y-3.5 text-sm text-stone-600">
                    {(lang === "bn" ? plan.featuresBn : plan.featuresEn).map(
                      (feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Card CTA Button */}
                <div className="mt-8 pt-6 border-t border-stone-100">
                  <button
                    onClick={() => openCheckout(plan)}
                    className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isPopular
                        ? "bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xs hover:shadow-md"
                        : "bg-stone-900 hover:bg-stone-800 text-white shadow-2xs"
                    }`}
                  >
                    <span>{lang === "bn" ? plan.ctaBn : plan.ctaEn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="mt-2.5 text-center text-[11px] text-stone-400">
                    ⚡ {t.pricing.instantActivation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* SIMULATED BKASH / NAGAD CHECKOUT MODAL                          */}
        {/* ============================================================== */}
        {activePlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setActivePlan(null)}
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                ✕
              </button>

              {checkoutStep === "method" && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-stone-900">
                        {lang === "bn" ? "বিকাশ / নগদ পেমেন্ট গেটওয়ে" : "bKash / Nagad Checkout"}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {lang === "bn" ? activePlan.nameBn : activePlan.nameEn} (৳{activePlan.priceBdt})
                      </p>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <label className="text-xs font-semibold text-stone-700 block mb-2">
                    {lang === "bn" ? "পেমেন্ট মাধ্যম বেছে নিন:" : "Select Payment Method:"}
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      onClick={() => setSelectedMFS("bkash")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMFS === "bkash"
                          ? "bg-pink-50 border-pink-400 text-pink-900 shadow-2xs ring-2 ring-pink-400/20"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <div className="text-xs font-bold text-pink-700">bKash বিকাশ</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">মার্চেন্ট পে</div>
                    </button>

                    <button
                      onClick={() => setSelectedMFS("nagad")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMFS === "nagad"
                          ? "bg-orange-50 border-orange-400 text-orange-900 shadow-2xs ring-2 ring-orange-400/20"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <div className="text-xs font-bold text-orange-700">Nagad নগদ</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">ডাইরেক্ট পে</div>
                    </button>
                  </div>

                  {/* Phone Input */}
                  <div className="mb-6">
                    <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                      {lang === "bn" ? "আপনার বিকাশ/নগদ একাউন্ট নম্বর:" : "Your Mobile Account Number:"}
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm font-mono text-stone-900 focus:outline-none focus:border-amber-400 focus:bg-white"
                      placeholder="017XXXXXXXX"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      {lang === "bn" ? "সিমুলেটেড সিকিউর পেমেন্ট টেস্ট" : "Simulated secure sandbox test"}
                    </span>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={processPayment}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all cursor-pointer"
                  >
                    {lang === "bn" ? `৳${activePlan.priceBdt} কনফার্ম করুন` : `Confirm ৳${activePlan.priceBdt}`}
                  </button>
                </div>
              )}

              {checkoutStep === "processing" && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-base font-bold text-stone-900">
                    {lang === "bn" ? "পেমেন্ট প্রসেস হচ্ছে..." : "Connecting to MFS Gateway..."}
                  </div>
                  <div className="text-xs text-stone-500">
                    {lang === "bn" ? "দয়া করে অপেক্ষা করুন, ক্রেডিট যুক্ত হচ্ছে" : "Allocating AI credits to your account"}
                  </div>
                </div>
              )}

              {checkoutStep === "success" && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-stone-900">
                    {lang === "bn" ? "পেমেন্ট সফল হয়েছে!" : "Payment Confirmed!"}
                  </h4>
                  <p className="text-sm text-stone-600">
                    {lang === "bn"
                      ? `অভিনন্দন! আপনার একাউন্টে ${activePlan.credits} ক্রেডিট যোগ হয়েছে।`
                      : `Success! ${activePlan.credits} credits have been added to your account.`}
                  </p>
                  <button
                    onClick={() => setActivePlan(null)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs shadow-xs"
                  >
                    {lang === "bn" ? "স্টুডিওতে ব্যানার তৈরি শুরু করুন" : "Start Creating Banners"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
