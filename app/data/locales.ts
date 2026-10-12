export type Language = "bn" | "en";

export interface Translation {
  nav: {
    features: string;
    demo: string;
    badges: string;
    pricing: string;
    faq: string;
    launchEditor: string;
    login: string;
  };
  hero: {
    tag: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
    sliderRawLabel: string;
    sliderStudioLabel: string;
    sliderDragHint: string;
  };
  demo: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    selectPresetPrompt: string;
    customiseBadgesPrompt: string;
    toggleDiscount: string;
    toggleDelivery: string;
    togglePrice: string;
    downloadMockup: string;
    resolutionNote: string;
  };
  badgesSection: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    trustNote: string;
  };
  pricing: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    monthlyToggle: string;
    creditToggle: string;
    payWithBkash: string;
    instantActivation: string;
    noCardRequired: string;
  };
  faq: {
    title: string;
    subtitle: string;
  };
  footer: {
    rights: string;
    tagline: string;
  };
}

export const translations: Record<Language, Translation> = {
  bn: {
    nav: {
      features: "ফিচারসমূহ",
      demo: "লাইভ ডেমো",
      badges: "ব্যাজ লাইব্রেরি",
      pricing: "প্যাকেজ ও মূল্য",
      faq: "সাধারণ জিজ্ঞাসা",
      launchEditor: "স্টুডিও শুরু করুন",
      login: "লগইন",
    },
    hero: {
      tag: "🇧🇩 বাংলাদেশি এফ-কমার্স ও অনলাইন উদ্যোক্তাদের জন্য স্পেশাল এআই টুল",
      titleStart: "স্মার্টফোনের সাধারণ ছবিকে বানান",
      titleHighlight: "প্রিমিয়াম স্টুডিও শট",
      titleEnd: "মাত্র ৩ ক্লিকে",
      subtitle:
        "বিছানার চাদর বা ডিম লাইটে তোলা ছবিকে রূপান্তর করুন আকর্ষণীয় ফেসবুক ও ইনস্টাগ্রাম প্রোডাক্ট ব্যানারে। দেশীয় উৎসবের ব্যাকগ্রাউন্ড, ৳ মূল্য ট্যাগ এবং ফ্রি ডেলিভারি ব্যাজ যুক্ত করুন নিমিষেই।",
      ctaPrimary: "বিনামূল্যে ব্যানার বানান",
      ctaSecondary: "লাইভ ডেমো দেখুন",
      stat1Label: "সন্তুষ্ট এফ-কমার্স মার্চেন্ট",
      stat1Value: "৪,২০০+",
      stat2Label: "তৈরি করা সেলস ব্যানার",
      stat2Value: "১,২৫,০০০+",
      stat3Label: "অর্ডার কনভার্সন বৃদ্ধি",
      stat3Value: "৩.৮ গুণ",
      sliderRawLabel: "📷 ফোনের র' ছবি (খারাপ লাইটিং)",
      sliderStudioLabel: "✨ ছবি Studio প্রিমিয়াম ব্যানার",
      sliderDragHint: "মাঝের দাগটি ডানে-বামে টেনে ম্যাজিক দেখুন",
    },
    demo: {
      title: "লাইভ স্টুডিও",
      titleHighlight: "ইন্টারঅ্যাক্টিভ প্রিভিউ",
      subtitle: "নিচের স্টাইল ও দেশীয় ব্যাজগুলো পরিবর্তন করে এখনই পরখ করুন আপনার প্রোডাক্ট কেমন দেখাবে।",
      selectPresetPrompt: "১. ব্যাকগ্রাউন্ড থিম বেছে নিন:",
      customiseBadgesPrompt: "২. দেশীয় মার্কেটিং ব্যাজ যুক্ত করুন:",
      toggleDiscount: "অফার স্ট্যাম্প",
      toggleDelivery: "ফ্রি ডেলিভারি স্ট্রিপ",
      togglePrice: "৳ মূল্য ট্যাগ",
      downloadMockup: "ফেসবুক সাইজে ডাউনলোড (১০৮০ x ১০৮০)",
      resolutionNote: "হাই-রেজোলিউশন স্টুডিও গ্রেড এক্সপোর্ট রেডি",
    },
    badgesSection: {
      title: "দেশীয় মার্কেটের সেরা কনভার্টিং",
      titleHighlight: "মার্কেটিং ব্যাজ শোকেস",
      subtitle:
        "বাংলাদেশি কাস্টমারদের আস্থা অর্জনে পরীক্ষিত ব্যাজসমূহ—যা আপনার ফেসবুক পোস্টের ইনবক্স রেট দ্বিগুণ করবে।",
      trustNote: "সব ব্যাজ সম্পূর্ণ বাংলা ইউনিকোড ফন্টে কাস্টমাইজেবল",
    },
    pricing: {
      title: "সহজ ও সাশ্রয়ী",
      titleHighlight: "দেশীয় প্যাকেজ",
      subtitle: "কোনো ডলার বা ডুয়াল কারেন্সি কার্ড লাগবে না। বিকাশ বা নগদে পেমেন্ট করে সেকেন্ডেই শুরু করুন।",
      monthlyToggle: "আনলিমিটেড সাবস্ক্রিপশন",
      creditToggle: "পে-অ্যাজ-ইউ-গো ক্রেডিট",
      payWithBkash: "বিকাশ / নগদ দিয়ে কিনুন",
      instantActivation: "⚡ ইনস্ট্যান্ট অ্যাক্টিভেশন",
      noCardRequired: "ক্রেডিট কার্ড ছাড়াই পেমেন্ট করুন",
    },
    faq: {
      title: "সচরাচর জিজ্ঞাসিত",
      subtitle: "আপনার সব প্রশ্নের দ্রুত ও স্পষ্ট উত্তর",
    },
    footer: {
      rights: "সর্বস্বত্ব সংরক্ষিত। মেড ফর বাংলাদেশি এন্ট্রাপ্রেনিউরস।",
      tagline: "সাধারণ স্মার্টফোনের ছবি দিয়ে কোটি টাকার ব্র্যান্ডিং তৈরি করুন।",
    },
  },
  en: {
    nav: {
      features: "Features",
      demo: "Live Demo",
      badges: "Badge Library",
      pricing: "Pricing",
      faq: "FAQ",
      launchEditor: "Launch Studio",
      login: "Login",
    },
    hero: {
      tag: "🇧🇩 Tailored AI Studio for Bangladeshi F-Commerce & Social Sellers",
      titleStart: "Turn Raw Phone Photos Into",
      titleHighlight: "Studio-Grade Banners",
      titleEnd: "in Just 3 Clicks",
      subtitle:
        "Transform dim bedroom shots into high-converting Facebook & Instagram ads with authentic Bangladeshi festive themes, ৳ price tags, and cash-on-delivery guarantee badges.",
      ctaPrimary: "Create Free Banner",
      ctaSecondary: "Watch Live Demo",
      stat1Label: "F-Commerce Merchants",
      stat1Value: "4,200+",
      stat2Label: "Banners Generated",
      stat2Value: "125,000+",
      stat3Label: "Sales Conversion Lift",
      stat3Value: "3.8x",
      sliderRawLabel: "📷 Raw Phone Photo (Dim Lighting)",
      sliderStudioLabel: "✨ Chobi Studio Premium Banner",
      sliderDragHint: "Drag slider left & right to see the magic",
    },
    demo: {
      title: "Interactive",
      titleHighlight: "Live Studio Preview",
      subtitle: "Select festive presets and promotional badges to see how your product transforms instantly.",
      selectPresetPrompt: "1. Select Studio Background Theme:",
      customiseBadgesPrompt: "2. Toggle Promotional Badges:",
      toggleDiscount: "Discount Sticker",
      toggleDelivery: "Free Delivery Strip",
      togglePrice: "৳ Price Tag",
      downloadMockup: "Export Facebook Square (1080 x 1080)",
      resolutionNote: "Crystal clear studio export ready in seconds",
    },
    badgesSection: {
      title: "High-Converting Local",
      titleHighlight: "Promotional Badges",
      subtitle: "Battle-tested badges proven to build customer trust and skyrocket Messenger inquiry rates in Bangladesh.",
      trustNote: "Fully customizable with native Bengali typography",
    },
    pricing: {
      title: "Transparent & Affordable",
      titleHighlight: "Local Pricing",
      subtitle: "No USD credit card or passport endorsement needed. Pay smoothly via bKash or Nagad.",
      monthlyToggle: "Monthly Subscriptions",
      creditToggle: "Pay-As-You-Go Credits",
      payWithBkash: "Pay with bKash / Nagad",
      instantActivation: "⚡ Instant Automatic Activation",
      noCardRequired: "Zero foreign currency barrier",
    },
    faq: {
      title: "Frequently Asked",
      subtitle: "Everything you need to know to get started",
    },
    footer: {
      rights: "All rights reserved. Built with love for Bangladeshi online entrepreneurs.",
      tagline: "Empowering everyday smartphone sellers with million-dollar visual branding.",
    },
  },
};
