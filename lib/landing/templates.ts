export type LandingTemplateId =
  | "single-hero"
  | "flash-sale"
  | "combo-bundle"
  | "gadget-tech"
  | "luxury-boutique";

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ProductReview {
  name: string;
  rating: number;
  date: string;
  comment: string;
  city: string;
}

export interface LandingTemplate {
  id: LandingTemplateId;
  nameBn: string;
  nameEn: string;
  tagline: string;
  badge: string;
  icon: string;
  previewColor: string;
  defaultProduct: {
    title: string;
    subtitle: string;
    pricePoisha: number;
    compareAtPoisha: number;
    rating: string;
    reviewCount: number;
    stock: number;
    image: string;
    gallery?: string[];
    videoUrl?: string;
    features: string[];
    specifications?: ProductSpecification[];
    faqs?: ProductFaq[];
    reviews?: ProductReview[];
  };
}

export const LANDING_TEMPLATES: LandingTemplate[] = [
  {
    id: "single-hero",
    nameBn: "সিঙ্গেল হিরো ল্যান্ডিং পেজ",
    nameEn: "Single Product Hero",
    tagline: "একটি নির্দিষ্ট পণ্যের জন্য সর্বোচ্চ কনভার্সন সেলস পেজ",
    badge: "সবচেয়ে জনপ্রিয়",
    icon: "⚡",
    previewColor: "#00f59b",
    defaultProduct: {
      title: "প্রিমিয়াম এক্সক্লুসিভ ঢাকাই জামদানি শাড়ি",
      subtitle: "১০০% প্রিমিয়াম সুতি ও হাফ-সিল্ক ব্লেন্ড · অভিজাত ও মার্জিত উৎসব লুক",
      pricePoisha: 245000,
      compareAtPoisha: 320000,
      rating: "৪.৯",
      reviewCount: 142,
      stock: 15,
      image: "/demo/jamdani_1.jpg",
      gallery: [
        "/demo/jamdani_1.jpg",
        "/demo/jamdani_2.jpg",
        "/demo/jamdani_3.jpg",
      ],
      videoUrl: "https://www.youtube.com/watch?v=kYJvM9lJb_I",
      features: [
        "রূপগঞ্জ-ডেমরার ঐতিহ্যবাহী দক্ষ তাঁতশিল্পীদের নিখুঁত হাতের কাজ",
        "কালার ১০০% পাকা ও স্থায়ী — কোনো ধোয়াতেই রং ওঠার ভয় নেই",
        "ম্যাচিং ব্লাউজ পিস সাথে সম্পূর্ণ ফ্রি অন্তর্ভুক্ত করা হয়েছে",
        "ক্যাশ অন ডেলিভারি — ডেলিভারি ম্যানের সামনে শাড়ি দেখে টাকা পরিশোধ",
        "প্রিমিয়াম গিফট বক্স প্যাকিং — উপহার দেওয়ার জন্য উপযুক্ত",
      ],
      specifications: [
        { label: "ফেব্রিক / উপাদান", value: "প্রিমিয়াম কটন ও হাফ-সিল্ক কম্বিনেশন" },
        { label: "কাজের ধরন", value: "ঐতিহ্যবাহী গোল্ডেন জরি ও সুতা দিয়ে জামদানি উইভিং" },
        { label: "শাড়ির দৈর্ঘ্য", value: "১২ হাত (পূর্ণ বহর)" },
        { label: "ব্লাউজ পিস", value: "১ হাত ম্যাচিং ব্লাউজ পিস সহ" },
        { label: "কালার গ্যারান্টি", value: "১০০% পাকা কালার গ্যারান্টি" },
        { label: "প্যাকেজিং", value: "লাক্সারি গিফট বক্স ও সিকিউর ডাবল র্যাপিং" },
        { label: "উৎপাদন", value: "রূপগঞ্জ/ডেমরা, নারায়ণগঞ্জ (হস্তচালিত তাঁত)" },
        { label: "ওয়াশ কেয়ার", value: "ড্রাই ওয়াশ অথবা মাইল্ড হ্যান্ড ওয়াশ" },
      ],
      faqs: [
        {
          question: "ডেলিভারি পেতে কতদিন সময় লাগবে?",
          answer: "ঢাকা শহরের ভেতরে মাত্র ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি পেয়ে যাবেন। ঢাকার বাইরে যেকোনো জেলা বা থানায় ২ থেকে ৩ দিনের মধ্যে আপনার ঠিকানায় সরাসরি হোম ডেলিভারি পৌঁছে যাবে।",
        },
        {
          question: "আমি কি পণ্য দেখে ও চেক করে টাকা দিতে পারব?",
          answer: "হ্যাঁ, সম্পূর্ণ নিশ্চিত থাকতে পারেন। ডেলিভারি ম্যান আপনার সামনে পার্সেল হস্তান্তর করবে। আপনি শাড়ির ফেব্রিক, কালার ও কাজ ভালোভাবে দেখে তারপর ক্যাশ অন ডেলিভারিতে মূল্য পরিশোধ করতে পারবেন।",
        },
        {
          question: "পণ্য পছন্দ না হলে বা ডিফেক্ট থাকলে রিটার্ন পলিসি কি?",
          answer: "পণ্য হাতে পাওয়ার পর যদি কোনো ধরনের ত্রুটি পান, তবে কোনো খরচ ছাড়াই তাৎক্ষণিক ডেলিভারি ম্যানকে ফেরত দিতে পারবেন অথবা আমাদের হেল্পলাইনে যোগাযোগ করলে আমরা দ্রুত এক্সচেঞ্জ বা সমাধান নিশ্চিত করি।",
        },
        {
          question: "ডেলিভারি চার্জ কত এবং অগ্রিম কোনো টাকা দিতে হবে?",
          answer: "ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। অর্ডারের জন্য অগ্রিম ১ টাকাও দিতে হবে না—পুরো টাকা ডেলিভারির সময় ক্যাশ বা বিকাশ/নগদে পরিশোধ করবেন।",
        },
      ],
      reviews: [
        {
          name: "নুসরাত জাহান",
          rating: 5,
          date: "৩ দিন আগে",
          comment: "শাড়িটা সত্যিই অসাধারণ! ছবিতে যেমন দেখেছি বাস্তবে তার চেয়েও অনেক সুন্দর। গোল্ডেন জরির কাজটা খুব সূক্ষ্ম। ধন্যবাদ দ্রুত ডেলিভারির জন্য!",
          city: "ঢাকা",
        },
        {
          name: "ফারহানা আফরোজ",
          rating: 5,
          date: "১ সপ্তাহ আগে",
          comment: "কাপড় খুবই আরামদায়ক ও সফট। প্যাকেজিং দেখে মন ভরে গেছে। গিফট দেওয়ার জন্য উপযুক্ত। ডেলিভারির সময় চেক করে নেওয়ার সুযোগ থাকায় কোনো সংশয় ছিল না।",
          city: "চট্টগ্রাম",
        },
        {
          name: "রাবেয়া খাতুন",
          rating: 5,
          date: "২ সপ্তাহ আগে",
          comment: "১০০% অথেনটিক জামদানি। অনেক শপ থেকেই নিয়েছি কিন্তু এদের ফিনিশিং সেরা। আরেকটা কালার অর্ডার করব শীঘ্রই।",
          city: "সিলেট",
        },
      ],
    },
  },
  {
    id: "flash-sale",
    nameBn: "ফ্ল্যাশ সেল ও কাউন্টডাউন",
    nameEn: "Flash Sale & Urgency",
    tagline: "লাইভ টাইমার ও সীমিত স্টক অ্যালার্টে দ্রুত অর্ডার পাওয়ার পেজ",
    badge: "হাই-আর্জেন্ট সেল",
    icon: "🔥",
    previewColor: "#ff9e00",
    defaultProduct: {
      title: "আল্ট্রা-সাউন্ড ওয়্যারলেস এয়ারবাডস প্রিমিয়াম",
      subtitle: "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন · ৩৬ ঘণ্টা ব্যাটারি ব্যাকআপ",
      pricePoisha: 129000,
      compareAtPoisha: 210000,
      rating: "৪.৮",
      reviewCount: 389,
      stock: 7,
      image: "🎧",
      features: [
        "সুপার হেভি বেস অ্যান্ড স্টুডিও সাউন্ড",
        "ওয়াটারপ্রুফ IPX7 রেটিং — বৃষ্টি বা ঘামে নষ্ট হবে না",
        "ইনস্ট্যান্ট অটো-কানেক্ট ব্লুটুথ ৫.৩",
        "আজকের অর্ডারে বিশেষ ডিসকাউন্ট + ফ্রি সিলিকন কেস",
      ],
    },
  },
  {
    id: "combo-bundle",
    nameBn: "কম্বো ও বান্ডল ডিল",
    nameEn: "Combo & Bundle Deal",
    tagline: "মাল্টি-প্যাক অফার — ১টি কিনলে চার্জ, ২টি নিলে ফ্রি ডেলিভারি",
    badge: "বেস্ট ভ্যালু",
    icon: "🎁",
    previewColor: "#00d2ff",
    defaultProduct: {
      title: "এক্সক্লুসিভ জেন্টস কম্বো প্যাকেজ (শার্ট + পলো + ওয়ালেট)",
      subtitle: "৩টি প্রিমিয়াম আইটেমের স্পেশাল কম্বো অফার",
      pricePoisha: 195000,
      compareAtPoisha: 285000,
      rating: "৫.০",
      reviewCount: 94,
      stock: 22,
      image: "👔",
      features: [
        "১টি নিলে ঢাকার বাইরে ডেলিভারি চার্জ প্রযোজ্য",
        "২টি কম্বো নিলে সম্পূর্ণ ফ্রি হোম ডেলিভারি",
        "প্রিমিয়াম এক্সপোর্ট কোয়ালিটি কটন ফেব্রিক",
        "সাইজ পছন্দ না হলে সহজ ৭ দিনের এক্সচেঞ্জ সুবিধা",
      ],
    },
  },
  {
    id: "gadget-tech",
    nameBn: "গ্যাজেট ও টেক স্পেক্স",
    nameEn: "Gadget & Tech Specs",
    tagline: "টেকনিক্যাল স্পেসিফিকেশন চার্ট ও ফিচার গ্রিড সহ ডার্ক সাইবার পেজ",
    badge: "টেক লাভার্স",
    icon: "📱",
    previewColor: "#38bdf8",
    defaultProduct: {
      title: "স্মার্টওয়াচ আল্ট্রা ৯ প্রো ম্যাক্স",
      subtitle: "২.০২ ইঞ্চি সুপার অ্যামোলেড ডিসপ্লে · ব্লুটুথ কলিং ও হেলথ ট্র্যাকিং",
      pricePoisha: 219000,
      compareAtPoisha: 350000,
      rating: "৪.৯",
      reviewCount: 260,
      stock: 12,
      image: "⌚",
      features: [
        "হার্ট রেট, রক্তচাপ ও স্লিপ ট্র্যাকিং সেন্সর",
        "সরাসরি ঘড়ি থেকে ফোন কল রিসিভ ও ডায়াল",
        "ওয়্যারলেস ফাস্ট ম্যাগনেটিক চার্জার অন্তর্ভুক্ত",
        "১ বছরের সম্পূর্ণ ওয়ারেন্টি রিপ্লেসমেন্ট গ্যারান্টি",
      ],
    },
  },
  {
    id: "luxury-boutique",
    nameBn: "লাক্সারি বুটিক ফ্যাশন",
    nameEn: "Luxury Boutique Lookbook",
    tagline: "হাই-ফ্যাশন ও ব্র্যান্ড লুকবুক — বড় ছবি, সাইজ গাইড ও WhatsApp অর্ডার",
    badge: "এলিগ্যান্ট স্টাইল",
    icon: "🌸",
    previewColor: "#c45b7a",
    defaultProduct: {
      title: "রয়েল ডিজাইনার জর্জেট গাউন",
      subtitle: "সিকোয়েন্স এমব্রয়ডারি হ্যান্ডওয়ার্ক · লাক্সারি কালেকশন",
      pricePoisha: 345000,
      compareAtPoisha: 450000,
      rating: "৫.০",
      reviewCount: 88,
      stock: 9,
      image: "✨",
      features: [
        "ইমপোর্টেড সফট বাটারফ্লাই জর্জেট ইনার সহ",
        "বুকের কাজ ও ওড়নায় নিখুঁত সিকোয়েন্স কারুকাজ",
        "সাইজ কাস্টমাইজেশনের জন্য সরাসরি WhatsApp পরামর্শ",
        "সারাদেশে নিশ্চিত হোম ডেলিভারি",
      ],
    },
  },
];
