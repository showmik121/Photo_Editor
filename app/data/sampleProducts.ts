export interface SampleProduct {
  id: string;
  nameBn: string;
  nameEn: string;
  categoryBn: string;
  categoryEn: string;
  defaultPrice: string;
  defaultDiscount: string;
  rawUrl: string;
  cutoutSvg: string; // SVG data URI or crisp SVG representation of the isolated product
}

// SVG vector illustrations of high-end products isolated with transparent background
const PANJABI_CUTOUT_SVG = `<svg viewBox="0 0 400 480" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pjFabric" x1="200" y1="40" x2="200" y2="440" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="35%" stop-color="#115e59"/>
      <stop offset="70%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#042f2e"/>
    </linearGradient>
    <linearGradient id="pjGold" x1="190" y1="50" x2="210" y2="220" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="pjShadow" x1="130" y1="50" x2="200" y2="440">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="40%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
    </linearGradient>
    <filter id="fabricShimmer">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.05   0 0 0 0 0.46   0 0 0 0 0.43  0 0 0 0.08 0"/>
    </filter>
  </defs>
  <!-- Body Silhouette -->
  <path d="M140 45 C165 75 235 75 260 45 L320 135 L270 160 L255 430 H145 L130 160 L80 135 Z" fill="url(#pjFabric)" stroke="#fbbf24" stroke-width="2.5"/>
  <path d="M140 45 C165 75 235 75 260 45 L320 135 L270 160 L255 430 H145 L130 160 L80 135 Z" fill="url(#pjShadow)"/>
  <!-- Draped pleat shadows -->
  <path d="M175 68 Q185 240 180 430" stroke="#042f2e" stroke-width="4" opacity="0.4" fill="none"/>
  <path d="M225 68 Q215 240 220 430" stroke="#042f2e" stroke-width="4" opacity="0.4" fill="none"/>
  <!-- Collar Mandarin -->
  <path d="M165 42 Q200 52 235 42 L238 65 Q200 75 162 65 Z" fill="#042f2e" stroke="#fbbf24" stroke-width="2"/>
  <path d="M167 47 Q200 55 233 47" stroke="#fef08a" stroke-width="1.5" fill="none"/>
  <!-- Gold Placket -->
  <path d="M192 65 H208 V210 H192 Z" fill="url(#pjGold)" stroke="#b45309" stroke-width="1"/>
  <!-- Embroidery motifs along placket -->
  <circle cx="200" cy="85" r="3.5" fill="#451a03"/>
  <circle cx="200" cy="85" r="2" fill="#fef08a"/>
  <circle cx="200" cy="115" r="3.5" fill="#451a03"/>
  <circle cx="200" cy="115" r="2" fill="#fef08a"/>
  <circle cx="200" cy="145" r="3.5" fill="#451a03"/>
  <circle cx="200" cy="145" r="2" fill="#fef08a"/>
  <circle cx="200" cy="175" r="3.5" fill="#451a03"/>
  <circle cx="200" cy="175" r="2" fill="#fef08a"/>
  <!-- Sleeve Cuffs with Gold Zari -->
  <path d="M78 133 L102 145 L94 158 L70 146 Z" fill="url(#pjGold)"/>
  <path d="M322 133 L298 145 L306 158 L330 146 Z" fill="url(#pjGold)"/>
</svg>`;

const SAREE_CUTOUT_SVG = `<svg viewBox="0 0 400 480" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="srFabric" x1="200" y1="30" x2="200" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fff1f2"/>
      <stop offset="50%" stop-color="#ffe4e6"/>
      <stop offset="100%" stop-color="#fecdd3"/>
    </linearGradient>
    <linearGradient id="srBorder" x1="100" y1="50" x2="300" y2="450" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#e11d48"/>
      <stop offset="40%" stop-color="#be123c"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>
    <linearGradient id="srGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <!-- Saree Drape Form -->
  <path d="M140 40 C170 65 230 65 260 40 L330 120 L280 150 L270 440 H130 L120 150 L70 120 Z" fill="url(#srFabric)" stroke="#e11d48" stroke-width="2"/>
  <!-- Jamdani Red Border & Traditional Alpona motifs -->
  <path d="M140 40 L260 40 L220 440 H130 Z" fill="url(#srBorder)"/>
  <path d="M120 150 L70 120 L95 190 Z" fill="url(#srBorder)"/>
  <!-- Gold Zari thread lines -->
  <path d="M145 42 L255 42 L215 438 H135 Z" stroke="url(#srGold)" stroke-width="2.5" stroke-dasharray="4 2" fill="none"/>
  <!-- Gold Polka Buti Motifs across the pallu -->
  <circle cx="160" cy="110" r="4" fill="url(#srGold)"/>
  <circle cx="190" cy="130" r="4" fill="url(#srGold)"/>
  <circle cx="170" cy="170" r="5" fill="url(#srGold)"/>
  <circle cx="200" cy="200" r="5" fill="url(#srGold)"/>
  <circle cx="160" cy="240" r="5" fill="url(#srGold)"/>
  <circle cx="190" cy="280" r="5" fill="url(#srGold)"/>
  <circle cx="165" cy="330" r="5" fill="url(#srGold)"/>
  <circle cx="185" cy="380" r="5" fill="url(#srGold)"/>
  <!-- Pleat shadows -->
  <path d="M175 42 Q195 240 185 440" stroke="#4c0519" stroke-width="3" opacity="0.4" fill="none"/>
  <path d="M205 42 Q215 240 210 440" stroke="#4c0519" stroke-width="3" opacity="0.4" fill="none"/>
</svg>`;

const SERUM_CUTOUT_SVG = `<svg viewBox="0 0 320 460" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glassBody" x1="90" y1="120" x2="230" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="goldCap" x1="130" y1="70" x2="190" y2="120">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="dropperBulb" x1="140" y1="20" x2="180" y2="70">
      <stop offset="0%" stop-color="#09090b"/>
      <stop offset="100%" stop-color="#27272a"/>
    </linearGradient>
  </defs>
  <!-- Rubber Dropper Bulb -->
  <rect x="145" y="20" width="30" height="50" rx="8" fill="url(#dropperBulb)" stroke="#3f3f46"/>
  <!-- Gold Dropper Ring -->
  <rect x="135" y="70" width="50" height="30" rx="3" fill="url(#goldCap)" stroke="#78350f" stroke-width="1.5"/>
  <line x1="135" y1="80" x2="185" y2="80" stroke="#fef08a" stroke-width="1"/>
  <line x1="135" y1="90" x2="185" y2="90" stroke="#b45309" stroke-width="1"/>
  <!-- Glass Shoulder -->
  <path d="M135 100 L110 135 H210 L185 100 Z" fill="#0f172a" stroke="#475569" stroke-width="1"/>
  <!-- Main Glass Amber Bottle Body -->
  <rect x="95" y="135" width="130" height="280" rx="24" fill="url(#glassBody)" stroke="#334155" stroke-width="2"/>
  <!-- Clean Luxury Label -->
  <rect x="115" y="195" width="90" height="150" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
  <!-- Label Content -->
  <rect x="130" y="215" width="60" height="6" rx="2" fill="#0f172a"/>
  <rect x="138" y="228" width="44" height="4" rx="2" fill="#d97706"/>
  <rect x="125" y="240" width="70" height="2" fill="#94a3b8"/>
  <rect x="130" y="250" width="60" height="2" fill="#94a3b8"/>
  <rect x="135" y="260" width="50" height="2" fill="#94a3b8"/>
  <circle cx="160" cy="300" r="14" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="160" y="304" font-size="10" font-weight="bold" fill="#b45309" text-anchor="middle">PURE</text>
  <!-- Specular Light Reflection Streak -->
  <path d="M110 155 Q 106 390 114 395" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.35"/>
  <path d="M120 155 Q 118 390 122 395" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
</svg>`;

const SNEAKER_CUTOUT_SVG = `<svg viewBox="0 0 460 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="snkOrange" x1="100" y1="80" x2="380" y2="240" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="50%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
    <linearGradient id="snkSole" x1="80" y1="210" x2="380" y2="260">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
  </defs>
  <!-- Main Sneaker Silhouette -->
  <path d="M70 195 C70 155 110 130 160 100 L240 85 L290 120 L380 145 C400 160 405 190 385 220 L80 220 Z" fill="url(#snkOrange)" stroke="#9a3412" stroke-width="2"/>
  <!-- White Rubber Sole -->
  <path d="M75 220 L385 220 C395 240 375 255 350 255 H80 C60 255 60 220 75 220 Z" fill="url(#snkSole)" stroke="#cbd5e1" stroke-width="2"/>
  <!-- Tread Grip Bottom -->
  <path d="M80 255 H350 L345 262 H85 Z" fill="#0f172a"/>
  <!-- Dark Heel & Ankle Collar -->
  <path d="M160 100 L240 85 L220 150 L140 150 Z" fill="#18181b"/>
  <path d="M180 100 L220 90 L210 130 L160 130 Z" fill="#3f3f46"/>
  <!-- Dynamic Gold Swoosh Accent -->
  <path d="M130 165 Q 220 125 330 150" stroke="#fef08a" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M130 165 Q 220 125 330 150" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" fill="none"/>
  <!-- Eyelets & Laces -->
  <circle cx="250" cy="105" r="3.5" fill="#ffffff"/>
  <circle cx="270" cy="115" r="3.5" fill="#ffffff"/>
  <circle cx="290" cy="125" r="3.5" fill="#ffffff"/>
  <path d="M245 105 L275 118 M265 115 L295 128" stroke="#f1f5f9" stroke-width="3"/>
</svg>`;

const WATCH_CUTOUT_SVG = `<svg viewBox="0 0 340 440" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wtStrap" x1="140" y1="20" x2="200" y2="420" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3b0764"/>
      <stop offset="50%" stop-color="#581c87"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="wtGold" x1="90" y1="140" x2="250" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="80%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
  </defs>
  <!-- Leather Luxury Strap -->
  <rect x="135" y="25" width="70" height="390" rx="10" fill="url(#wtStrap)" stroke="#1e1b4b" stroke-width="2"/>
  <line x1="145" y1="35" x2="145" y2="405" stroke="#a855f7" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="195" y1="35" x2="195" y2="405" stroke="#a855f7" stroke-width="1" stroke-dasharray="4 4"/>
  <!-- Gold Bezel Case -->
  <circle cx="170" cy="220" r="82" fill="url(#wtGold)" stroke="#fef08a" stroke-width="4"/>
  <circle cx="170" cy="220" r="70" fill="#09090b" stroke="#ca8a04" stroke-width="2"/>
  <!-- Dial Ticks -->
  <circle cx="170" cy="155" r="3" fill="#fef08a"/>
  <circle cx="235" cy="220" r="3" fill="#fef08a"/>
  <circle cx="170" cy="285" r="3" fill="#fef08a"/>
  <circle cx="105" cy="220" r="3" fill="#fef08a"/>
  <!-- Chronograph Sub-dials -->
  <circle cx="170" cy="188" r="14" stroke="#a16207" stroke-width="1" fill="#18181b"/>
  <circle cx="146" cy="230" r="12" stroke="#a16207" stroke-width="1" fill="#18181b"/>
  <circle cx="194" cy="230" r="12" stroke="#a16207" stroke-width="1" fill="#18181b"/>
  <!-- Gold Hands -->
  <line x1="170" y1="220" x2="170" y2="170" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
  <line x1="170" y1="220" x2="208" y2="220" stroke="#fef08a" stroke-width="3" stroke-linecap="round"/>
  <line x1="170" y1="220" x2="150" y2="250" stroke="#ef4444" stroke-width="1.5"/>
  <circle cx="170" cy="220" r="6" fill="#f59e0b"/>
  <!-- Crown Button -->
  <rect x="252" y="212" width="10" height="16" rx="2" fill="url(#wtGold)"/>
</svg>`;

export function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: "sample-panjabi",
    nameBn: "রয়্যাল এমারেল্ড পাঞ্জাবি",
    nameEn: "Royal Emerald Panjabi",
    categoryBn: "ঈদ কালেকশন",
    categoryEn: "Eid Collection",
    defaultPrice: "১,৪৯০",
    defaultDiscount: "৪০%",
    rawUrl: "/samples/panjabi-raw.jpg",
    cutoutSvg: PANJABI_CUTOUT_SVG,
  },
  {
    id: "sample-saree",
    nameBn: "ঢাকাই জামদানি শাড়ি",
    nameEn: "Dhakai Jamdani Saree",
    categoryBn: "দেশি বুটিক",
    categoryEn: "Deshi Boutique",
    defaultPrice: "২,৭৫০",
    defaultDiscount: "৩৫%",
    rawUrl: "/samples/saree-raw.jpg",
    cutoutSvg: SAREE_CUTOUT_SVG,
  },
  {
    id: "sample-serum",
    nameBn: "অর্গানিক স্কিনকেয়ার সিরাম",
    nameEn: "Organic Glow Serum",
    categoryBn: "কসমেটিকস",
    categoryEn: "Cosmetics",
    defaultPrice: "৮৯০",
    defaultDiscount: "২৫%",
    rawUrl: "/samples/serum-raw.jpg",
    cutoutSvg: SERUM_CUTOUT_SVG,
  },
  {
    id: "sample-sneaker",
    nameBn: "আর্বান অরেঞ্জ স্নিকার্স",
    nameEn: "Urban Street Sneakers",
    categoryBn: "ফুটওয়্যার",
    categoryEn: "Footwear",
    defaultPrice: "১,৮৫০",
    defaultDiscount: "৫০%",
    rawUrl: "/samples/sneaker-raw.jpg",
    cutoutSvg: SNEAKER_CUTOUT_SVG,
  },
  {
    id: "sample-watch",
    nameBn: "গোল্ড ক্রোনোগ্রাফ ওয়াচ",
    nameEn: "Luxury Gold Chronograph",
    categoryBn: "ঘড়ি ও গহনা",
    categoryEn: "Watches & Jewelry",
    defaultPrice: "৩,২৯০",
    defaultDiscount: "৩০%",
    rawUrl: "/samples/watch-raw.jpg",
    cutoutSvg: WATCH_CUTOUT_SVG,
  },
];
