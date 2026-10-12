export interface PresetTheme {
  id: string;
  nameBn: string;
  nameEn: string;
  taglineBn: string;
  taglineEn: string;
  category: "festive" | "studio" | "lifestyle" | "heritage";
  badgeTheme: string;
  bgColor: string;
  accentColor: string;
  lightingStyle: string;
  bgImageUrl: string;
  productMockUrl: string;
  rawPhonePhotoUrl: string;
  descriptionBn: string;
  descriptionEn: string;
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: "eid-dhamaka",
    nameBn: "ঈদ ধামাকা অফার",
    nameEn: "Eid Dhamaka Special",
    taglineBn: "রাজকীয় সবুজ, সোনালী চাঁদ ও স্নিগ্ধ আলো",
    taglineEn: "Emerald green, gold crescent & warm bokeh",
    category: "festive",
    badgeTheme: "gold-crescent",
    bgColor: "from-emerald-950 via-teal-900 to-slate-950",
    accentColor: "#f59e0b",
    lightingStyle: "Royal Golden Accent Lighting",
    bgImageUrl: "eid-green",
    productMockUrl: "panjabi-eid",
    rawPhonePhotoUrl: "raw-panjabi",
    descriptionBn: "ঈদ কালেকশনের পাঞ্জাবি, থ্রি-পিস ও জুয়েলারি বিক্রির জন্য সর্বোচ্চ কনভার্টিং থিম।",
    descriptionEn: "Top converting festive theme for Eid Punjabi, 3-pieces, and luxury festive jewelry.",
  },
  {
    id: "minimal-studio",
    nameBn: "মিনিমালিস্ট ঢাকা স্টুডিও",
    nameEn: "Minimalist Studio",
    taglineBn: "চকচকে প্যাডেস্টাল, সফট শ্যাডো ও ক্লাসি মার্বেল",
    taglineEn: "Clean architectural podium & soft drop shadow",
    category: "studio",
    badgeTheme: "clean-black",
    bgColor: "from-stone-100 via-neutral-100 to-stone-200",
    accentColor: "#0f172a",
    lightingStyle: "Soft Diffusion Studio Key Light",
    bgImageUrl: "clean-studio",
    productMockUrl: "cosmetic-bottle",
    rawPhonePhotoUrl: "raw-cosmetic",
    descriptionBn: "কসমেটিকস, পারফিউম, ব্যাগ ও গ্যাজেটসের জন্য ক্ল্যাসিক ও প্রিমিয়াম এক্সপোর্ট লুক।",
    descriptionEn: "Clean, ultra-high-end studio aesthetic perfect for cosmetics, perfumes, and electronics.",
  },
  {
    id: "boishakh-alpona",
    nameBn: "বৈশাখী আলপনা ও মেলা",
    nameEn: "Boishakh Festive Folk",
    taglineBn: "ঐতিহ্যবাহী লাল-সাদা, মাটির পট ও আলপনা আর্ট",
    taglineEn: "Vibrant red & white with folk Alpona patterns",
    category: "festive",
    badgeTheme: "boishakh-red",
    bgColor: "from-rose-950 via-red-900 to-amber-950",
    accentColor: "#ef4444",
    lightingStyle: "Sunlit Vibrant Morning Tone",
    bgImageUrl: "boishakh-red",
    productMockUrl: "saree-boishakh",
    rawPhonePhotoUrl: "raw-saree",
    descriptionBn: "বৈশাখী তাঁতের শাড়ি, হস্তশিল্প ও দেশীয় শাড়ি কালেকশনে ঐতিহ্যবাহী ভাইব এনে দেয়।",
    descriptionEn: "Authentic Bengali New Year vibe tailored for handloom sarees, handicrafts, and kurtis.",
  },
  {
    id: "urban-lifestyle",
    nameBn: "ক্যাজুয়াল লাইফস্টাইল (গুলশান ক্যাফে)",
    nameEn: "Urban Lifestyle Aesthetic",
    taglineBn: "উষ্ণ কফি শপ, উডেন টেক্সচার ও আর্বান ব্যাকগ্রাউন্ড",
    taglineEn: "Warm rustic wood, ambient coffee shop sunlight",
    category: "lifestyle",
    badgeTheme: "modern-minimal",
    bgColor: "from-amber-950 via-stone-900 to-neutral-900",
    accentColor: "#ea580c",
    lightingStyle: "Natural Window Light with Amber Warmth",
    bgImageUrl: "cafe-wood",
    productMockUrl: "sneakers-urban",
    rawPhonePhotoUrl: "raw-sneaker",
    descriptionBn: "স্নিকার্স, ঘড়ি, ডেনিম ও ফ্যাশন এক্সেসরিজকে সাধারণ থেকে ট্রেন্ডি লাইফস্টাইল বানিয়ে দেয়।",
    descriptionEn: "Turns casual footwear, watches, and streetwear into authentic lifestyle editorial ads.",
  },
  {
    id: "muslin-heritage",
    nameBn: "মসলিন ও জামদানি রয়্যালটি",
    nameEn: "Muslin & Jamdani Heritage",
    taglineBn: "কোমল সিল্কি ড্রেপস, সফট প্যাস্টেল ও লাক্সারি ভাইব",
    taglineEn: "Luxurious draped fabric with soft pearl highlights",
    category: "heritage",
    badgeTheme: "pearl-luxury",
    bgColor: "from-slate-900 via-purple-950 to-neutral-950",
    accentColor: "#d946ef",
    lightingStyle: "High-Key Rim Lighting with Specular Sheen",
    bgImageUrl: "muslin-silk",
    productMockUrl: "luxury-watch",
    rawPhonePhotoUrl: "raw-watch",
    descriptionBn: "প্রিমিয়াম জুয়েলারি, অর্গানিক স্কিনকেয়ার ও অভিজাত উপহার সামগ্রীর জন্য।",
    descriptionEn: "High-ticket jewelry, gold accents, and luxury gift collections.",
  },
];

export interface TrustBadgeItem {
  id: string;
  titleBn: string;
  titleEn: string;
  subBn: string;
  subEn: string;
  colorScheme: "green" | "red" | "blue" | "amber" | "purple";
  iconName: "Truck" | "ShieldCheck" | "BadgePercent" | "CreditCard" | "Flame" | "Sparkles";
  previewTextBn: string;
  previewTextEn: string;
}

export const TRUST_BADGES: TrustBadgeItem[] = [
  {
    id: "cod-nationwide",
    titleBn: "ক্যাশ অন ডেলিভারি সারা বাংলাদেশ",
    titleEn: "Cash on Delivery Nationwide",
    subBn: "পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা",
    subEn: "Zero risk - pay only after receiving product",
    colorScheme: "green",
    iconName: "Truck",
    previewTextBn: "🚚 ক্যাশ অন ডেলিভারি সারা দেশে",
    previewTextEn: "🚚 Cash on Delivery Nationwide",
  },
  {
    id: "free-delivery",
    titleBn: "ফ্রি ডেলিভারি স্ট্রিপ",
    titleEn: "Free Delivery Ribbon",
    subBn: "নির্দিষ্ট মূল্যে সারা দেশে বিনামূল্যে হোম ডেলিভারি",
    subEn: "Free doorstep delivery across all 64 districts",
    colorScheme: "blue",
    iconName: "ShieldCheck",
    previewTextBn: "✨ সারা দেশে ফ্রি হোম ডেলিভারি",
    previewTextEn: "✨ Free Delivery Across Bangladesh",
  },
  {
    id: "inspect-before-pay",
    titleBn: "দেখে পেমেন্ট করার নিশ্চয়তা",
    titleEn: "Inspect Before Paying",
    subBn: "ডেলিভারি ম্যানের সামনে চেক করে নেওয়ার গ্যারান্টি",
    subEn: "Inspect parcel in front of rider guarantee",
    colorScheme: "amber",
    iconName: "ShieldCheck",
    previewTextBn: "🛡️ প্রোডাক্ট চেক করে পেমেন্ট করুন",
    previewTextEn: "🛡️ Check Quality Before You Pay",
  },
  {
    id: "discount-dhamaka",
    titleBn: "ধামাকা ডিসকাউন্ট স্ট্যাম্প",
    titleEn: "Dhamaka Discount Stamp",
    subBn: "৫০% পর্যন্ত আকর্ষণীয় ছাড়ের বোল্ড ব্যাজ",
    subEn: "High-contrast clearance & flash sale sticker",
    colorScheme: "red",
    iconName: "BadgePercent",
    previewTextBn: "🔥 ধামাকা ৫০% ছাড়!",
    previewTextEn: "🔥 Flat 50% Off Flash Sale",
  },
  {
    id: "bengali-price-tag",
    titleBn: "৳ স্পেশাল মূল্য ট্যাগ",
    titleEn: "BDT Currency Price Tag",
    subBn: "বাংলা সংখ্যায় স্পষ্ট বোল্ড প্রাইসিং",
    subEn: "Eye-catching bold price pill in Bengali numerals",
    colorScheme: "purple",
    iconName: "CreditCard",
    previewTextBn: "৳ ১,৪৯০ (সীমিত স্টক)",
    previewTextEn: "৳ 1,490 (Limited Stock)",
  },
  {
    id: "eid-special",
    titleBn: "ঈদ স্পেশাল ২০২৬",
    titleEn: "Eid Mubarak Special 2026",
    subBn: "উৎসবের মৌসুমের প্রিমিয়াম সিল মোহর",
    subEn: "Festive season certified collection badge",
    colorScheme: "amber",
    iconName: "Sparkles",
    previewTextBn: "🌙 ঈদ এক্সক্লুসিভ কালেকশন",
    previewTextEn: "🌙 Eid Exclusive Collection",
  },
];

export interface PricingPlan {
  id: string;
  nameBn: string;
  nameEn: string;
  badgeBn?: string;
  badgeEn?: string;
  priceBdt: number;
  credits: number;
  costPerImageBdt: string;
  billingPeriodBn: string;
  billingPeriodEn: string;
  featuresBn: string[];
  featuresEn: string[];
  popular?: boolean;
  ctaBn: string;
  ctaEn: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter-pack",
    nameBn: "স্টার্টার প্যাক",
    nameEn: "Starter Pack",
    priceBdt: 199,
    credits: 30,
    costPerImageBdt: "৬.৬৳ / ব্যানার",
    billingPeriodBn: "এককালীন ক্রেডিট",
    billingPeriodEn: "One-time credits (No expiry)",
    featuresBn: [
      "৩০টি হাই-রেজোলিউশন স্টুডিও ব্যানার",
      "সবগুলো দেশীয় উৎসবের থিম (ঈদ, বৈশাখ)",
      "সব দেশীয় ব্যাজ ও ৳ প্রাইস ট্যাগ আনলক",
      "ফেসবুক ও ইনস্টাগ্রাম রেডি ফরম্যাট",
      "ক্রেডিটের কোনো মেয়াদ নেই",
    ],
    featuresEn: [
      "30 High-Resolution Studio Banners",
      "All cultural presets unlocked (Eid, Boishakh)",
      "All local badges & BDT price tags",
      "Facebook & Instagram ready aspect ratios",
      "No credit expiration date",
    ],
    ctaBn: "বিকাশ/নগদে ১৯৯৳ পে করুন",
    ctaEn: "Pay 199 BDT via bKash/Nagad",
  },
  {
    id: "growth-merchant",
    nameBn: "গ্রোথ মার্চেন্ট",
    nameEn: "Growth Merchant",
    badgeBn: "সর্বাধিক জনপ্রিয়",
    badgeEn: "Most Popular",
    priceBdt: 499,
    credits: 100,
    costPerImageBdt: "৪.৯৳ / ব্যানার",
    billingPeriodBn: "এককালীন ক্রেডিট",
    billingPeriodEn: "One-time credits (Save 30%)",
    popular: true,
    featuresBn: [
      "১০০টি আল্ট্রা-এইচডি স্টুডিও ব্যানার",
      "লাইটিং ও শ্যাডো কাস্টমাইজেশন টুল",
      "ব্যাচ এডিটিং (একসাথে ১০টি ছবি প্রসেস)",
      "দারাজ হোয়াইট ব্যাকগ্রাউন্ড মোড",
      "লোগো ও নিজস্ব ব্র্যান্ড কালার ওয়াটারমার্ক",
      "অগ্রাধিকার সাপোর্ট ও দ্রুত জেনারেশন",
    ],
    featuresEn: [
      "100 Ultra-HD Studio Banners",
      "Lighting & shadow intensity sliders",
      "Batch mode (process 10 photos simultaneously)",
      "Daraz compliant pure white background mode",
      "Custom brand logo & watermark overlays",
      "Priority GPU queue & WhatsApp support",
    ],
    ctaBn: "বিকাশ/নগদে ৪৯৯৳ পে করুন",
    ctaEn: "Pay 499 BDT via bKash/Nagad",
  },
  {
    id: "fcommerce-pro-monthly",
    nameBn: "এফ-কমার্স আনলিমিটেড",
    nameEn: "F-Commerce Unlimited",
    badgeBn: "সেরা ভ্যালু",
    badgeEn: "Best Value",
    priceBdt: 999,
    credits: 300,
    costPerImageBdt: "৩.৩৳ / ব্যানার",
    billingPeriodBn: "প্রতি মাসে রিনিউয়াল",
    billingPeriodEn: "Monthly subscription (Cancel anytime)",
    featuresBn: [
      "৩০০টি আল্ট্রা-প্রিমিয়াম স্টুডিও ব্যানার",
      "অফিসিয়াল এআই মডেল ট্রাই-অন (শাড়ি/পাঞ্জাবি)",
      "ফেসবুক কভার ও স্টোরি আল্ট্রা এক্সপোর্ট",
      "বাংলা ইউনিকোড ফন্ট লাইব্রেরি প্রফেশনাল",
      "প্রোডাক্ট বিবরণী লেখার এআই রাইটার (বাংলা)",
      "ডেডিকেটেড ভিআইপি সাপোর্ট",
    ],
    featuresEn: [
      "300 Ultra-Premium Studio Banners / month",
      "AI apparel fit preview (Saree/Panjabi)",
      "Facebook Page cover & multi-story export pack",
      "Full Bengali Unicode professional typography suite",
      "AI Bengali marketing copy & hashtag generator",
      "Dedicated WhatsApp account manager",
    ],
    ctaBn: "বিকাশ/নগদে ৯৯৯৳ সাবস্ক্রাইব করুন",
    ctaEn: "Subscribe 999 BDT via bKash/Nagad",
  },
];

export const FAQS = [
  {
    questionBn: "আমার ফোনের ক্যামেরার ছবি কি সত্যিই স্টুডিওর মতো দেখতে হবে?",
    questionEn: "Will my normal phone photos genuinely look studio-grade?",
    answerBn:
      "হ্যাঁ, একদম! আমাদের এআই ইঞ্জিন ব্যাকগ্রাউন্ড সম্পূর্ণ মুছে ফেলে নিখুঁত থ্রিডি শ্যাডো ও লাইটিং সমন্বয় করে। বিছানার চাদর বা ডিম লাইটে তোলা ছবিও পরিণত হয় পেশাদার ফটোশুটের মতো ব্যানারে।",
    answerEn:
      "Yes, absolutely! Our AI removes distracting backgrounds and reconstructs realistic contact shadows and directional studio lighting, turning ordinary bedroom photos into luxury brand campaigns.",
  },
  {
    questionBn: "পেমেন্ট করতে কি কোনো ভিসা বা মাস্টারকার্ড লাগবে?",
    questionEn: "Do I need a foreign dual-currency credit card?",
    answerBn:
      "না, কোনো আন্তর্জাতিক কার্ড বা পাসপোর্ট এন্ডোর্সমেন্ট দরকার নেই। আপনার ব্যক্তিগত বিকাশ বা নগদ অ্যাপ থেকেই এক ক্লিকে পেমেন্ট সম্পন্ন করতে পারবেন।",
    answerEn:
      "No! Zero international credit card or passport requirements. Pay directly in BDT using your everyday bKash or Nagad mobile account with instant activation.",
  },
  {
    questionBn: "বাংলা লেখা কি যুক্তাক্ষর সহ সুন্দরভাবে প্রিন্ট হবে?",
    questionEn: "Does Bengali typography render correctly without broken conjuncts?",
    answerBn:
      "অবশ্যই! আমাদের সিস্টেমে ১০০% সঠিক ইউনিকোড রেন্ডারিং যুক্তাক্ষর ইঞ্জিন রয়েছে (যেমন হিন্দশিলিগুড়ি, সোলাইমানলিপি ও কালপুরুষ), ফলে কোনো ভাঙা অক্ষর ছাড়া চকচকে বাংলা ব্যানার পাওয়া যায়।",
    answerEn:
      "Yes! We engineered native Unicode support ensuring complex Bengali conjuncts (যুক্তাক্ষর) render flawlessly using modern verified Bengali typography.",
  },
  {
    questionBn: "ছবিগুলো কি সরাসরি ফেসবুকে দেওয়ার উপযুক্ত সাইজে হবে?",
    questionEn: "Are image exports properly formatted for Facebook & Instagram?",
    answerBn:
      "হ্যাঁ, প্রতিটি ব্যানার একদম ফেসবুক ফিড স্কয়ার (১০৮০x১০৮০), স্টোরি (১০৮০x১৯২০) এবং দারাজ লিস্টিং (১০০০x১০০০) স্ট্যান্ডার্ড মাপে অপ্টিমাইজড থাকে।",
    answerEn:
      "Yes, 1-click export presets give you exact Facebook feed square (1080x1080), Stories (1080x1920), and Daraz marketplace specs with zero blurriness.",
  },
];
