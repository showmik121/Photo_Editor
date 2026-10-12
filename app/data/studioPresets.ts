export type SurfaceType =
  | "tiles"          // Ceramic stone tiles grid (Raw Stitch streetwear flatlay)
  | "desert-arch"    // Desert sand dunes with architectural archway (Illiyeen Panjabi)
  | "wall-minimal"   // Clean warm plaster/studio wall
  | "podium-marble"  // High-end marble pedestal & floor
  | "terracotta"     // Deshi warm terracotta / clay
  | "studio-gradient"// Smooth luxury studio gradient
  | "clean-white";   // E-commerce white catalog

export type SurfaceColorTone =
  | "warm-sand"      // #F5EBE1 / warm beige stone
  | "cool-grey"      // #E2E8F0 / minimal studio concrete
  | "dark-charcoal"  // #1E293B / luxury dark streetwear
  | "rich-terracotta"// #7C2D12 / deshi clay
  | "emerald-luxury" // #064E3B / royal eid
  | "pure-white";    // #FFFFFF / clean white

export interface CustomCardState {
  // 1. Surface Backdrop
  surfaceType: SurfaceType;
  surfaceTone: SurfaceColorTone;
  showTileGrid: boolean; // Subtle grout lines for flatlay
  lightingIntensity: number; // 0 - 100

  // 2. Atmospheric Shadows & Props (from user reference images!)
  showPalmShadow: boolean;       // Tropical palm leaf shadow & foliage overhang (Image 1)
  palmShadowOpacity: number;     // 20 - 100
  showWindowShadow: boolean;     // Architectural window pane / blinds shadow (Image 5)
  showWoodenHanger: boolean;     // Realistic wooden hanger prop at top (Image 3)
  showKinfolkProp: boolean;      // Kinfolk / lookbook magazine prop at bottom right (Image 1)
  showPampasGrass: boolean;      // Dried pampas botanical prop at bottom (Image 2)
  showDesertDunes: boolean;      // Desert dune landscape in background (Image 2 & 4)
  showSunlightGlow: boolean;     // Warm golden sunlight flare / beam (Image 4)

  // 3. Editorial Brand Header (like RAW STITCH / ILLIYEEN)
  showBrandHeader: boolean;
  brandName: string;             // e.g. "RAW STITCH" or "عليين ILLIYEEN"
  brandTagline: string;          // e.g. "PREMIUM STREETWEAR"
  brandPosition: "top-left" | "top-center" | "top-right";
  brandStyle: "minimal" | "luxury-badge" | "korean-craft";

  // 4. Big Collection Typography (like AW26 NEW ARRIVALS / PANJABI)
  showCollectionText: boolean;
  collectionSeason: string;      // e.g. "AW26" or "EID '26" or "SUMMER '26"
  collectionSub: string;         // e.g. "NEW ARRIVALS" or "EXCLUSIVE DROP"
  collectionPosition: "bottom-right" | "bottom-left" | "top-left" | "top-right";
  collectionStyle: "glowing-outline" | "solid-bold" | "minimal-clean";

  // 5. Editorial Micro-Copy / Details (like Timeless Stripes. Built to Last)
  showEditorialCopy: boolean;
  editorialHeading: string;      // e.g. "TIMELESS STRIPES. BUILT TO LAST."
  editorialBullets: string;      // 3 feature lines
  editorialPosition: "bottom-left" | "top-right";
}

export const defaultCustomCardState: CustomCardState = {
  surfaceType: "tiles",
  surfaceTone: "warm-sand",
  showTileGrid: true,
  lightingIntensity: 90,
  showPalmShadow: true,
  palmShadowOpacity: 70,
  showWindowShadow: false,
  showWoodenHanger: false,
  showKinfolkProp: true,
  showPampasGrass: false,
  showDesertDunes: false,
  showSunlightGlow: true,
  showBrandHeader: true,
  brandName: "RAW STITCH",
  brandTagline: "PREMIUM STREETWEAR",
  brandPosition: "top-left",
  brandStyle: "minimal",
  showCollectionText: true,
  collectionSeason: "AW26",
  collectionSub: "NEW ARRIVALS",
  collectionPosition: "bottom-right",
  collectionStyle: "glowing-outline",
  showEditorialCopy: true,
  editorialHeading: "TIMELESS STRIPES. BUILT TO LAST.",
  editorialBullets: "Clean design.\nPremium fabric.\nEveryday comfort.",
  editorialPosition: "bottom-left",
};

export interface StudioPreset {
  id: string;
  nameBn: string;
  nameEn: string;
  taglineBn: string;
  taglineEn: string;
  badgeTagBn: string;
  bgGradient: string;
  pedestalType: "round-gold" | "marble-slab" | "terracotta" | "dark-glass" | "none";
  ambientLighting: string;
  lightingTone: "warm-gold" | "cool-studio" | "festive-red" | "luxury-amber" | "pure-white";
  decorativeSvgType: "crescent-stars" | "alpona-frame" | "bokeh-circles" | "minimal-lines" | "clean";
  textColor: string;
  cardConfig: Partial<CustomCardState>;
}

export const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: "streetwear-flatlay",
    nameBn: "র' স্টিচ ক্যালিফোর্নিয়া টাইলস",
    nameEn: "Streetwear Tiles & Palm",
    taglineBn: "টাইলস ফ্লোর, পাম ট্রির ছায়া, কিনফোক ম্যাগাজিন ও মিনিমাল ব্র‍্যান্ডিং",
    taglineEn: "Aesthetic warm tiles, palm leaf shadow & Kinfolk lookbook prop",
    badgeTagBn: "টপ ট্রেন্ডিং",
    bgGradient: "from-stone-100 via-amber-50 to-stone-200",
    pedestalType: "none",
    ambientLighting: "radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.15) 0%, transparent 60%)",
    lightingTone: "warm-gold",
    decorativeSvgType: "clean",
    textColor: "text-slate-900",
    cardConfig: {
      surfaceType: "tiles",
      surfaceTone: "warm-sand",
      showTileGrid: true,
      showPalmShadow: true,
      palmShadowOpacity: 75,
      showWindowShadow: false,
      showWoodenHanger: false,
      showKinfolkProp: true,
      showPampasGrass: false,
      showDesertDunes: false,
      showSunlightGlow: true,
      showBrandHeader: true,
      brandName: "RAW STITCH",
      brandTagline: "PREMIUM STREETWEAR",
      brandPosition: "top-left",
      brandStyle: "minimal",
      showCollectionText: false,
      showEditorialCopy: true,
      editorialHeading: "TIMELESS STRIPES. BUILT TO LAST.",
      editorialBullets: "Clean design.\nPremium fabric.\nEveryday comfort.",
      editorialPosition: "bottom-left",
    },
  },
  {
    id: "desert-arch",
    nameBn: "ইলিয়িন ডেজার্ট আর্চ",
    nameEn: "Illiyeen Desert Arch",
    taglineBn: "মরুভূমির আর্কিটেকচারাল আর্চ, AW26 নিয়ন টাইপোগ্রাফি ও গোল্ডেন লাইট",
    taglineEn: "Surreal luxury desert archway, glowing AW26 typography & sun flare",
    badgeTagBn: "পাঞ্জাবি ও থোব",
    bgGradient: "from-amber-100 via-stone-200 to-amber-200",
    pedestalType: "none",
    ambientLighting: "radial-gradient(circle at 85% 15%, rgba(251, 191, 36, 0.3) 0%, transparent 70%)",
    lightingTone: "luxury-amber",
    decorativeSvgType: "clean",
    textColor: "text-amber-950",
    cardConfig: {
      surfaceType: "desert-arch",
      surfaceTone: "warm-sand",
      showTileGrid: false,
      showPalmShadow: false,
      showWindowShadow: false,
      showWoodenHanger: false,
      showKinfolkProp: false,
      showPampasGrass: true,
      showDesertDunes: true,
      showSunlightGlow: true,
      showBrandHeader: true,
      brandName: "عليين ILLIYEEN",
      brandTagline: "PLATINUM EDITION",
      brandPosition: "top-left",
      brandStyle: "luxury-badge",
      showCollectionText: true,
      collectionSeason: "AW26",
      collectionSub: "NEW ARRIVALS",
      collectionPosition: "bottom-right",
      collectionStyle: "glowing-outline",
      showEditorialCopy: false,
    },
  },
  {
    id: "wooden-hanger",
    nameBn: "কোরিয়ান ক্রাফট হ্যাঙ্গার ওয়াল",
    nameEn: "Korean Craft Hanger Wall",
    taglineBn: "কাঠের হ্যাঙ্গার প্রপ, ক্লিন প্লাস্টার ওয়াল ও প্রিমিয়াম ড্রপ শ্যাডো",
    taglineEn: "Realistic wooden hanger prop, warm studio plaster & directional shadow",
    badgeTagBn: "টি-শার্ট ও ড্রপ শোল্ডার",
    bgGradient: "from-stone-50 via-zinc-100 to-stone-200",
    pedestalType: "none",
    ambientLighting: "radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.5) 0%, transparent 70%)",
    lightingTone: "warm-gold",
    decorativeSvgType: "clean",
    textColor: "text-stone-900",
    cardConfig: {
      surfaceType: "wall-minimal",
      surfaceTone: "warm-sand",
      showTileGrid: false,
      showPalmShadow: false,
      showWindowShadow: false,
      showWoodenHanger: true,
      showKinfolkProp: false,
      showPampasGrass: false,
      showDesertDunes: false,
      showSunlightGlow: false,
      showBrandHeader: true,
      brandName: "RAW STITCH",
      brandTagline: "SEOUL CREATIVE COLLECTIVE",
      brandPosition: "top-center",
      brandStyle: "korean-craft",
      showCollectionText: false,
      showEditorialCopy: false,
    },
  },
  {
    id: "window-shadow",
    nameBn: "সানলিট উইন্ডো শ্যাডো",
    nameEn: "Sunlit Window Blinds",
    taglineBn: "জানালার গ্রিল ও ব্লাইন্ডসের প্রাকৃতিক রোদ-ছায়া এবং লাইফস্টাইল লুক",
    taglineEn: "Architectural window blinds shadow cutting across warm minimalist wall",
    badgeTagBn: "লাইফস্টাইল শট",
    bgGradient: "from-stone-100 via-slate-100 to-stone-200",
    pedestalType: "none",
    ambientLighting: "radial-gradient(circle at 20% 20%, rgba(254, 243, 199, 0.4) 0%, transparent 60%)",
    lightingTone: "warm-gold",
    decorativeSvgType: "clean",
    textColor: "text-slate-900",
    cardConfig: {
      surfaceType: "wall-minimal",
      surfaceTone: "cool-grey",
      showTileGrid: false,
      showPalmShadow: true,
      palmShadowOpacity: 40,
      showWindowShadow: true,
      showWoodenHanger: false,
      showKinfolkProp: false,
      showPampasGrass: false,
      showDesertDunes: false,
      showSunlightGlow: true,
      showBrandHeader: true,
      brandName: "STUDIO DHAKA",
      brandTagline: "CASUAL COLLECTION",
      brandPosition: "top-left",
      brandStyle: "minimal",
      showCollectionText: true,
      collectionSeason: "SUMMER",
      collectionSub: "DROP 01",
      collectionPosition: "bottom-right",
      collectionStyle: "solid-bold",
      showEditorialCopy: false,
    },
  },
  {
    id: "eid-festive",
    nameBn: "ঈদ ফেস্টিভ রয়্যাল",
    nameEn: "Eid Festive Royal",
    taglineBn: "রাজকীয় পান্না সবুজ, সোনালী চাঁদ ও লণ্ঠনের স্নিগ্ধ আভা",
    taglineEn: "Emerald & royal teal with gold crescent bokeh & round pedestal",
    badgeTagBn: "ঈদ স্পেশাল",
    bgGradient: "from-emerald-950 via-teal-950 to-slate-950",
    pedestalType: "round-gold",
    ambientLighting: "radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.3) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 75%)",
    lightingTone: "warm-gold",
    decorativeSvgType: "crescent-stars",
    textColor: "text-amber-300",
    cardConfig: {
      surfaceType: "studio-gradient",
      surfaceTone: "emerald-luxury",
      showTileGrid: false,
      showPalmShadow: false,
      showWindowShadow: false,
      showWoodenHanger: false,
      showKinfolkProp: false,
      showPampasGrass: false,
      showDesertDunes: false,
      showSunlightGlow: true,
      showBrandHeader: true,
      brandName: "EID COLLECTION",
      brandTagline: "EXCLUSIVE FESTIVE WEAR",
      brandPosition: "top-left",
      brandStyle: "luxury-badge",
      showCollectionText: true,
      collectionSeason: "EID '26",
      collectionSub: "SPECIAL EDITION",
      collectionPosition: "bottom-right",
      collectionStyle: "glowing-outline",
      showEditorialCopy: false,
    },
  },
  {
    id: "deshi-boutique",
    nameBn: "দেশি বুটিক পোড়ামাটি",
    nameEn: "Deshi Boutique Terracotta",
    taglineBn: "ঐতিহ্যবাহী পোড়ামাটি, লাল-সোনালী আলপনা ও দেশীয় নকশা",
    taglineEn: "Terracotta warmth, vibrant red & festive Alpona motif frame",
    badgeTagBn: "দেশি বুটিক",
    bgGradient: "from-rose-950 via-amber-950 to-stone-950",
    pedestalType: "terracotta",
    ambientLighting: "radial-gradient(circle at 50% 30%, rgba(225, 29, 72, 0.25) 0%, rgba(217, 119, 6, 0.2) 50%, transparent 75%)",
    lightingTone: "festive-red",
    decorativeSvgType: "alpona-frame",
    textColor: "text-rose-200",
    cardConfig: {
      surfaceType: "terracotta",
      surfaceTone: "rich-terracotta",
      showTileGrid: false,
      showPalmShadow: false,
      showWindowShadow: false,
      showWoodenHanger: false,
      showKinfolkProp: false,
      showPampasGrass: false,
      showDesertDunes: false,
      showSunlightGlow: true,
      showBrandHeader: true,
      brandName: "দেশজ কালেকশন",
      brandTagline: "হাতে বোনা দেশীয় ঐতিহ্য",
      brandPosition: "top-left",
      brandStyle: "minimal",
      showCollectionText: true,
      collectionSeason: "বৈশাখ",
      collectionSub: "এক্সক্লুসিভ কালেকশন",
      collectionPosition: "bottom-right",
      collectionStyle: "solid-bold",
      showEditorialCopy: false,
    },
  },
  {
    id: "luxury-minimalist",
    nameBn: "লাক্সারি মার্বেল পোডিয়াম",
    nameEn: "Luxury Marble Podium",
    taglineBn: "চকচকে মার্বেল স্ল্যাব, ক্লাসি লাইটিং ও ডার্ক স্টুডিও ফিল",
    taglineEn: "Architectural podium, soft studio key light & charcoal slate",
    badgeTagBn: "লাক্সারি প্রোডাক্ট",
    bgGradient: "from-slate-900 via-zinc-900 to-black",
    pedestalType: "marble-slab",
    ambientLighting: "radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.12) 0%, rgba(148, 163, 184, 0.05) 50%, transparent 70%)",
    lightingTone: "cool-studio",
    decorativeSvgType: "minimal-lines",
    textColor: "text-slate-100",
    cardConfig: {
      surfaceType: "podium-marble",
      surfaceTone: "dark-charcoal",
      showTileGrid: false,
      showPalmShadow: false,
      showWindowShadow: false,
      showWoodenHanger: false,
      showKinfolkProp: false,
      showPampasGrass: false,
      showDesertDunes: false,
      showSunlightGlow: true,
      showBrandHeader: true,
      brandName: "SIGNATURE",
      brandTagline: "PREMIUM COLLECTION",
      brandPosition: "top-left",
      brandStyle: "minimal",
      showCollectionText: true,
      collectionSeason: "AW26",
      collectionSub: "LIMITED EDITION",
      collectionPosition: "bottom-right",
      collectionStyle: "glowing-outline",
      showEditorialCopy: false,
    },
  },
  {
    id: "daraz-white",
    nameBn: "দারাজ পিওর হোয়াইট",
    nameEn: "Daraz Pure White",
    taglineBn: "দারাজ ও ইকমার্স কমপ্লায়েন্ট #FFFFFF ক্যাটালগ ব্যাকগ্রাউন্ড",
    taglineEn: "Daraz compliant clean #FFFFFF studio catalog mode",
    badgeTagBn: "ক্যাটালগ শট",
    bgGradient: "from-white via-slate-50 to-stone-100",
    pedestalType: "none",
    ambientLighting: "radial-gradient(circle at 50% 30%, rgba(241, 245, 249, 0.9) 0%, transparent 70%)",
    lightingTone: "pure-white",
    decorativeSvgType: "clean",
    textColor: "text-slate-800",
    cardConfig: {
      surfaceType: "clean-white",
      surfaceTone: "pure-white",
      showTileGrid: false,
      showPalmShadow: false,
      showWindowShadow: false,
      showWoodenHanger: false,
      showKinfolkProp: false,
      showPampasGrass: false,
      showDesertDunes: false,
      showSunlightGlow: false,
      showBrandHeader: false,
      showCollectionText: false,
      showEditorialCopy: false,
    },
  },
];
