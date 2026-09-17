export type District = {
  id: string;
  bn: string;
  en: string;
  popular?: boolean;
};

export const DISTRICTS: District[] = [
  { id: "dhaka", bn: "ঢাকা", en: "Dhaka", popular: true },
  { id: "chattogram", bn: "চট্টগ্রাম", en: "Chattogram", popular: true },
  { id: "sylhet", bn: "সিলেট", en: "Sylhet", popular: true },
  { id: "khulna", bn: "খুলনা", en: "Khulna", popular: true },
  { id: "rajshahi", bn: "রাজশাহী", en: "Rajshahi", popular: true },
  { id: "barishal", bn: "বরিশাল", en: "Barishal", popular: true },
  { id: "rangpur", bn: "রংপুর", en: "Rangpur", popular: true },
  { id: "mymensingh", bn: "ময়মনসিংহ", en: "Mymensingh", popular: true },
  { id: "gazipur", bn: "গাজীপুর", en: "Gazipur" },
  { id: "narayanganj", bn: "নারায়ণগঞ্জ", en: "Narayanganj" },
  { id: "cumilla", bn: "কুমিল্লা", en: "Cumilla" },
  { id: "noakhali", bn: "নোয়াখালী", en: "Noakhali" },
  { id: "feni", bn: "ফেনী", en: "Feni" },
  { id: "lakshmipur", bn: "লক্ষ্মীপুর", en: "Lakshmipur" },
  { id: "chandpur", bn: "চাঁদপুর", en: "Chandpur" },
  { id: "brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া", en: "Brahmanbaria" },
  { id: "coxsbazar", bn: "কক্সবাজার", en: "Cox's Bazar" },
  { id: "rangamati", bn: "রাঙ্গামাটি", en: "Rangamati" },
  { id: "bandarban", bn: "বান্দরবান", en: "Bandarban" },
  { id: "khagrachhari", bn: "খাগড়াছড়ি", en: "Khagrachhari" },
  { id: "narsingdi", bn: "নরসিংদী", en: "Narsingdi" },
  { id: "manikganj", bn: "মানিকগঞ্জ", en: "Manikganj" },
  { id: "munshiganj", bn: "মুন্সিগঞ্জ", en: "Munshiganj" },
  { id: "tangail", bn: "টাঙ্গাইল", en: "Tangail" },
  { id: "kishoreganj", bn: "কিশোরগঞ্জ", en: "Kishoreganj" },
  { id: "faridpur", bn: "ফরিদপুর", en: "Faridpur" },
  { id: "gopalganj", bn: "গোপালগঞ্জ", en: "Gopalganj" },
  { id: "madaripur", bn: "মাদারীপুর", en: "Madaripur" },
  { id: "shariatpur", bn: "শরীয়তপুর", en: "Shariatpur" },
  { id: "rajbari", bn: "রাজবাড়ী", en: "Rajbari" },
  { id: "jamalpur", bn: "জামালপুর", en: "Jamalpur" },
  { id: "netrokona", bn: "নেত্রকোনা", en: "Netrokona" },
  { id: "sherpur", bn: "শেরপুর", en: "Sherpur" },
  { id: "bogra", bn: "বগুড়া", en: "Bogura" },
  { id: "pabna", bn: "পাবনা", en: "Pabna" },
  { id: "sirajganj", bn: "সিরাজগঞ্জ", en: "Sirajganj" },
  { id: "natore", bn: "নাটোর", en: "Natore" },
  { id: "naogaon", bn: "নওগাঁ", en: "Naogaon" },
  { id: "chapai", bn: "চাঁপাইনবাবগঞ্জ", en: "Chapai Nawabganj" },
  { id: "joypurhat", bn: "জয়পুরহাট", en: "Joypurhat" },
  { id: "dinajpur", bn: "দিনাজপুর", en: "Dinajpur" },
  { id: "thakurgaon", bn: "ঠাকুরগাঁও", en: "Thakurgaon" },
  { id: "panchagarh", bn: "পঞ্চগড়", en: "Panchagarh" },
  { id: "nilphamari", bn: "নীলফামারী", en: "Nilphamari" },
  { id: "lalmonirhat", bn: "লালমনিরহাট", en: "Lalmonirhat" },
  { id: "kurigram", bn: "কুড়িগ্রাম", en: "Kurigram" },
  { id: "gaibandha", bn: "গাইবান্ধা", en: "Gaibandha" },
  { id: "jessore", bn: "যশোর", en: "Jashore" },
  { id: "jhenaidah", bn: "ঝিনাইদহ", en: "Jhenaidah" },
  { id: "magura", bn: "মাগুরা", en: "Magura" },
  { id: "narail", bn: "নড়াইল", en: "Narail" },
  { id: "kushtia", bn: "কুষ্টিয়া", en: "Kushtia" },
  { id: "chuadanga", bn: "চুয়াডাঙ্গা", en: "Chuadanga" },
  { id: "meherpur", bn: "মেহেরপুর", en: "Meherpur" },
  { id: "satkhira", bn: "সাতক্ষীরা", en: "Satkhira" },
  { id: "bagerhat", bn: "বাগেরহাট", en: "Bagerhat" },
  { id: "habiganj", bn: "হবিগঞ্জ", en: "Habiganj" },
  { id: "moulvibazar", bn: "মৌলভীবাজার", en: "Moulvibazar" },
  { id: "sunamganj", bn: "সুনামগঞ্জ", en: "Sunamganj" },
  { id: "bhola", bn: "ভোলা", en: "Bhola" },
  { id: "patuakhali", bn: "পটুয়াখালী", en: "Patuakhali" },
  { id: "pirojpur", bn: "পিরোজপুর", en: "Pirojpur" },
  { id: "jhalokati", bn: "ঝালকাঠি", en: "Jhalokati" },
  { id: "barguna", bn: "বরগুনা", en: "Barguna" },
];

export function districtLabel(id: string, locale: "bn" | "en") {
  const d = DISTRICTS.find((x) => x.id === id);
  if (!d) return id;
  return locale === "bn" ? d.bn : d.en;
}
