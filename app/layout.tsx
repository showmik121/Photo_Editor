import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ছবি Studio — বাংলাদেশি অনলাইন মার্চেন্টদের জন্য প্রিমিয়াম এআই ফটো স্টুডিও",
  description:
    "স্মার্টফোনের সাধারণ ছবিকে বানান প্রিমিয়াম স্টুডিও শট। দেশীয় উৎসবের ব্যাকগ্রাউন্ড, ৳ মূল্য ট্যাগ এবং ফ্রি ডেলিভারি ব্যাজ যুক্ত করুন মাত্র ৩ ক্লিকে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FBFBFA] text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950">
        {children}
      </body>
    </html>
  );
}
