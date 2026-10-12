# ছবি Studio (Chobi Studio) 📸✨

> **AI-Powered E-Commerce Product Photo Studio & Banner Generator for Bangladeshi F-Commerce & Global Merchants**

ছবি Studio হলো একটি আধুনিক ওয়েব অ্যাপ্লিকেশন যা স্মার্টফোনে তোলা সাধারণ প্রোডাক্ট ছবিকে সেকেন্ডেই প্রিমিয়াম স্টুডিও শট এবং সোশ্যাল মিডিয়া সেলস ব্যানারে রূপান্তর করে।

---

## 🌟 মূল ফিচারসমূহ (Core Features)

1. **AI ব্যাকগ্রাউন্ড রিমুভাল (RMBG-2.0 Integration):**
   - অত্যাধুনিক Bria AI RMBG-2.0 মডেলের মাধ্যমে প্রোডাক্টের নিখুঁত কাটআউট।
   - ১-ক্লিকে ব্যাকগ্রাউন্ড রিমুভ ও ইনস্ট্যান্ট প্রিভিউ।

2. **মিনিমালিস্টিক স্টুডিও ব্যাকগ্রাউন্ড ও কাস্টমাইজেশন:**
   - সিরামিক টাইলস, মার্বেল পেডেস্টাল, ডেজার্ট আর্চ, ন্যাচারাল উড ও রয়্যাল সিল্ক সারফেস।
   - রিয়েলিস্টিক পাম লিফ শ্যাডো, উইন্ডো ব্লাইন্ডস শ্যাডো, সানলাইট গ্লো এবং কিনফোক ম্যাগাজিন প্রপস।
   - কাস্টম ব্র্যান্ড হেডার ও কালেকশন টাইপোগ্রাফি।

3. **মুভেবল ও কাস্টমাইজেবল মার্কেটিং ব্যাজ (Interactive Overlay Engine):**
   - ড্র্যাগ করে ইচ্ছামতো সরানো যায় এমন ৳ মূল্য ট্যাগ (Movable Price Tag)।
   - অফার ও ছাড় স্টিকার, ক্যাশ অন ডেলিভারি, এবং সারা দেশে ফ্রি ডেলিভারি রিবন।
   - 'Hind Siliguri' বাংলা ইউনিকোড টাইপোগ্রাফি সাপোর্ট।

4. **ফটো অটো-এনহ্যান্সার (Lighting & Clarity Fix):**
   - ব্রাইটনেস, কনট্রাস্ট, স্যাচুরেশন এবং শার্পনেস ফাইন-টিউনিং।
   - ফোনের ডিম লাইটে তোলা ছবিকে ১-ক্লিকে স্টুডিও ব্রাইটনেসে রূপান্তর।

5. **রেজল্যুশন ও ইনস্ট্যান্ট এক্সপোর্ট:**
   - 1:1 Square (Facebook / Instagram Feed - 1080x1080px)
   - 9:16 Vertical (Story / Reel - 1080x1920px)
   - হাই-রেজোলিউশন PNG ডাউনলোড এবং ১-ক্লিকে ক্লিপবোর্ডে কপি।

---

## 🚀 লোকাল সেটআপ (Local Setup)

```bash
# ১. ডিপেনডেন্সি ইনস্টল করুন
npm install

# ২. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ করুন
cp .env.example .env.local
# .env.local ফাইলে আপনার HUGGINGFACE_API_KEY বসান

# ৩. ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```

ব্রাউজারে ওপেন করুন: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ টেকনোলজি স্ট্যাক (Tech Stack)

- **Framework:** Next.js 16 (Turbopack, App Router)
- **Styling:** Tailwind CSS v4 (Clean Minimalist Light Theme)
- **Icons:** Lucide React
- **Exporting:** html-to-image & canvas-confetti
- **AI Processing:** Hugging Face Inference API (briaai/RMBG-2.0)
