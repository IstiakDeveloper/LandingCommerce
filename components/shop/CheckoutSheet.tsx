"use client";

import { SearchableCombo, ComboItem } from "@/components/ui/SearchableCombo";
import { compressImage } from "@/lib/image/compress";
import { loadAddress, saveAddress } from "@/lib/storage";
import { deliveryFee } from "@/lib/shop";
import type { ProductPublic, ShopPublic } from "@/lib/types";
import { formatTaka } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function CheckoutSheet({
  open,
  shop,
  product,
  onClose,
}: {
  open: boolean;
  shop: ShopPublic;
  product: ProductPublic;
  onClose: () => void;
}) {
  const t = useTranslations("checkout");
  const locale = useLocale() as "bn" | "en";
  const isBn = locale === "bn";
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isDhaka, setIsDhaka] = useState<boolean>(true); // default to Dhaka

  // Geo Location Cascading Data & Selections
  const [districts, setDistricts] = useState<ComboItem[]>([]);
  const [upazilas, setUpazilas] = useState<ComboItem[]>([]);
  const [unions, setUnions] = useState<ComboItem[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<ComboItem | null>(null);
  const [selectedUpazila, setSelectedUpazila] = useState<ComboItem | null>(null);
  const [selectedUnion, setSelectedUnion] = useState<ComboItem | null>(null);

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingUpazilas, setLoadingUpazilas] = useState(false);
  const [loadingUnions, setLoadingUnions] = useState(false);

  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const [payMethod, setPayMethod] = useState<"cod" | "bkash" | "nagad" | "advance">("cod");
  const [trxId, setTrxId] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [demoOrderSuccess, setDemoOrderSuccess] = useState<{
    id: string;
    total: number;
    phone: string;
  } | null>(null);

  // 1. Fetch all districts on mount
  useEffect(() => {
    let active = true;
    setLoadingDistricts(true);
    fetch("/api/locations?type=districts")
      .then((r) => r.json())
      .then((res) => {
        if (active && res.ok && Array.isArray(res.data)) {
          setDistricts(res.data);
          const dhaka = res.data.find(
            (d: ComboItem) => d.id === "47" || d.name.toLowerCase() === "dhaka"
          );
          if (dhaka && !selectedDistrict) {
            setSelectedDistrict(dhaka);
          }
        }
      })
      .catch((err) => console.error("Districts error", err))
      .finally(() => {
        if (active) setLoadingDistricts(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // 2. Fetch upazilas when selectedDistrict changes
  useEffect(() => {
    if (!selectedDistrict) {
      setUpazilas([]);
      setSelectedUpazila(null);
      setUnions([]);
      setSelectedUnion(null);
      return;
    }
    let active = true;
    setLoadingUpazilas(true);
    fetch(`/api/locations?type=upazilas&districtId=${selectedDistrict.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (active && res.ok && Array.isArray(res.data)) {
          setUpazilas(res.data);
        }
      })
      .catch((err) => console.error("Upazilas error", err))
      .finally(() => {
        if (active) setLoadingUpazilas(false);
      });
    return () => {
      active = false;
    };
  }, [selectedDistrict]);

  // 3. Fetch unions when selectedUpazila changes
  useEffect(() => {
    if (!selectedUpazila) {
      setUnions([]);
      setSelectedUnion(null);
      return;
    }
    let active = true;
    setLoadingUnions(true);
    fetch(`/api/locations?type=unions&upazilaId=${selectedUpazila.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (active && res.ok && Array.isArray(res.data)) {
          setUnions(res.data);
        }
      })
      .catch((err) => console.error("Unions error", err))
      .finally(() => {
        if (active) setLoadingUnions(false);
      });
    return () => {
      active = false;
    };
  }, [selectedUpazila]);

  // Auto-restore saved address if available
  useEffect(() => {
    if (open) {
      const last = loadAddress();
      if (last) {
        setSaved(true);
        if (!name) setName(last.name || "");
        if (!phone) setPhone(last.phone || "");
        if (last.isDhaka !== undefined) setIsDhaka(last.isDhaka);
        if (!address) setAddress(last.address || "");
        if (!landmark) setLandmark(last.landmark || "");
      }
    }
  }, [open]);

  // Set default variant if variants exist
  useEffect(() => {
    if (product.variants?.length && !variant) {
      const firstGroup = product.variants[0];
      if (firstGroup?.options?.length) {
        setVariant(`${firstGroup.name}:${firstGroup.options[0]}`);
      }
    }
  }, [product.variants, variant]);

  // Recalculate isDhaka whenever selectedDistrict changes
  useEffect(() => {
    if (selectedDistrict) {
      const dhakaCheck =
        selectedDistrict.id === "47" ||
        selectedDistrict.name.toLowerCase() === "dhaka";
      setIsDhaka(dhakaCheck);
    }
  }, [selectedDistrict]);

  const subtotal = product.pricePoisha * qty;
  const fee = deliveryFee(shop, isDhaka, subtotal);
  const total = subtotal + fee;
  const payAmount =
    payMethod === "advance" && shop.advanceEnabled ? shop.advancePoisha : total;

  const isPhoneValid = useMemo(() => {
    const clean = phone.replace(/\D/g, "");
    return clean.length === 11 && clean.startsWith("01");
  }, [phone]);

  if (!open) return null;

  function useLast() {
    const last = loadAddress();
    if (!last) return;
    setName(last.name || "");
    setPhone(last.phone || "");
    setIsDhaka(last.isDhaka);
    setAddress(last.address || "");
    setLandmark(last.landmark || "");

    if (last.districtId && districts.length) {
      const dMatch = districts.find((d) => d.id === last.districtId);
      if (dMatch) setSelectedDistrict(dMatch);
    }
  }

  // Instant add custom union
  async function handleCustomUnionAdd(customName: string) {
    if (!selectedUpazila) return;
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upazilaId: selectedUpazila.id,
          upazilaName: selectedUpazila.bn_name,
          districtName: selectedDistrict?.bn_name,
          unionName: customName,
        }),
      });
      const data = await res.json();
      if (data.ok && data.data) {
        const newItem: ComboItem = {
          id: data.data.id,
          name: data.data.name,
          bn_name: data.data.bn_name,
        };
        setUnions((prev) => [newItem, ...prev]);
        setSelectedUnion(newItem);
      } else {
        const localItem: ComboItem = {
          id: `custom-${Date.now()}`,
          name: customName,
          bn_name: customName,
        };
        setUnions((prev) => [localItem, ...prev]);
        setSelectedUnion(localItem);
      }
    } catch {
      const localItem: ComboItem = {
        id: `custom-${Date.now()}`,
        name: customName,
        bn_name: customName,
      };
      setUnions((prev) => [localItem, ...prev]);
      setSelectedUnion(localItem);
    }
  }

  function handleDhakaToggle(dhakaMode: boolean) {
    setIsDhaka(dhakaMode);
    if (dhakaMode) {
      const dhaka = districts.find(
        (d) => d.id === "47" || d.name.toLowerCase() === "dhaka"
      );
      if (dhaka) {
        setSelectedDistrict(dhaka);
        setSelectedUpazila(null);
        setSelectedUnion(null);
      }
    } else {
      if (
        selectedDistrict?.id === "47" ||
        selectedDistrict?.name.toLowerCase() === "dhaka"
      ) {
        setSelectedDistrict(null);
        setSelectedUpazila(null);
        setSelectedUnion(null);
      }
    }
  }

  async function shot(file: File) {
    try {
      const blob = await compressImage(file, 1000, 0.7);
      const body = new FormData();
      body.append("file", blob, "ss.jpg");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      setScreenshot(data.url);
    } catch {
      /* ignore */
    }
  }

  async function place(confirmDuplicate = false) {
    if (!name.trim()) {
      setError(isBn ? "অনুগ্রহ করে আপনার নাম লিখুন" : "Please enter your full name");
      return;
    }
    if (!isPhoneValid) {
      setError(isBn ? "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)" : "Enter valid 11-digit mobile number");
      return;
    }
    if (!selectedDistrict) {
      setError(isBn ? "অনুগ্রহ করে জেলা নির্বাচন করুন" : "Please select your district");
      return;
    }
    if (!selectedUpazila) {
      setError(isBn ? "অনুগ্রহ করে উপজেলা / থানা নির্বাচন করুন" : "Please select your upazila / thana");
      return;
    }

    const fullComposedAddress = [
      address.trim(),
      selectedUnion ? `ইউনিয়ন/এলাকা: ${selectedUnion.bn_name}` : "",
      selectedUpazila ? `উপজেলা: ${selectedUpazila.bn_name}` : "",
      selectedDistrict ? `জেলা: ${selectedDistrict.bn_name}` : "",
    ]
      .filter(Boolean)
      .join(", ");

    setBusy(true);
    setError("");

    // Demo store handling
    const isDemoStore =
      shop.slug === "demo" ||
      shop.id === "demo-shop-id" ||
      (product as { isSample?: boolean }).isSample;

    if (isDemoStore) {
      setTimeout(() => {
        setBusy(false);
        setDemoOrderSuccess({
          id: `HL-${Math.floor(100000 + Math.random() * 900000)}`,
          total,
          phone,
        });
        saveAddress({
          name,
          phone,
          isDhaka,
          district: selectedDistrict.bn_name,
          districtId: selectedDistrict.id,
          upazilaId: selectedUpazila?.id,
          upazilaName: selectedUpazila?.bn_name,
          unionId: selectedUnion?.id,
          unionName: selectedUnion?.bn_name,
          address,
          landmark,
        });
      }, 700);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopSlug: shop.slug,
          productId: product.id,
          qty,
          variant,
          name,
          phone,
          isDhaka,
          district: selectedDistrict.bn_name,
          address: fullComposedAddress,
          landmark,
          geoLat: geo?.lat,
          geoLng: geo?.lng,
          payMethod,
          trxId,
          screenshotUrl: screenshot,
          website,
          confirmDuplicate,
        }),
      });

      const data = await res.json();
      setBusy(false);

      if (data.duplicate) {
        if (
          confirm(
            isBn
              ? "এই নম্বর থেকে এই প্রোডাক্ট এইমাত্র অর্ডার হয়েছে। আপনি কি আবার অর্ডার করতে চান?"
              : "Same order just placed. Place again?"
          )
        ) {
          return place(true);
        }
        return;
      }

      if (!res.ok) {
        setError(data.error || (isBn ? "অর্ডার নেওয়া যায়নি, পুনরায় চেষ্টা করুন" : "Order failed, please retry"));
        return;
      }

      saveAddress({
        name,
        phone,
        isDhaka,
        district: selectedDistrict.bn_name,
        districtId: selectedDistrict.id,
        upazilaId: selectedUpazila?.id,
        upazilaName: selectedUpazila?.bn_name,
        unionId: selectedUnion?.id,
        unionName: selectedUnion?.bn_name,
        address,
        landmark,
      });

      router.push(`/s/${shop.slug}/order/${data.id}`);
    } catch {
      setBusy(false);
      setError(isBn ? "নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।" : "Network error, please retry");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:p-4 animate-in fade-in duration-200">
      <div
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl text-slate-900 dark:text-slate-100 md:max-h-[88vh] md:rounded-3xl overflow-hidden"
      >
        {/* Top Handle and Header */}
        <div className="sticky top-0 z-10 border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 px-4 pt-3 pb-3 backdrop-blur-md">
          <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                ⚡
              </span>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {isBn ? "অর্ডার সম্পন্ন করুন" : "Complete Your Order"}
                </h2>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {isBn ? "✓ ক্যাশ অন ডেলিভারি · পণ্য দেখে মূল্য পরিশোধ" : "✓ Cash on delivery · Inspect upon delivery"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-32">
          {/* Demo Order Success State View */}
          {demoOrderSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl">
                🎉
              </div>
              <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {isBn ? "অর্ডার সফলভাবে সম্পন্ন হয়েছে!" : "Order Placed Successfully!"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {isBn
                  ? `আপনার অর্ডার আইডি #${demoOrderSuccess.id}। আমাদের প্রতিনিধি শীঘ্রই ${demoOrderSuccess.phone} নম্বরে যোগাযোগ করবেন।`
                  : `Your Order ID #${demoOrderSuccess.id}. We will call you soon at ${demoOrderSuccess.phone}.`}
              </p>
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 p-4 text-left text-xs space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span>{isBn ? "পণ্য" : "Product"}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{product.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isBn ? "পরিমাণ" : "Quantity"}:</span>
                  <span>{qty} টি</span>
                </div>
                <div className="flex justify-between">
                  <span>{isBn ? "ডেলিভারি লোকেশন" : "Location"}:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {[selectedUnion?.bn_name, selectedUpazila?.bn_name, selectedDistrict?.bn_name].filter(Boolean).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{isBn ? "সর্বমোট টাকা" : "Total"}:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{formatTaka(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isBn ? "পেমেন্ট" : "Payment"}:</span>
                  <span>{payMethod === "cod" ? (isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery") : payMethod.toUpperCase()}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="neon-btn w-full py-3 text-sm font-black shadow-[0_0_20px_rgba(0,245,155,0.4)]"
              >
                {isBn ? "ধন্যবাদ, সম্পন্ন করুন" : "Done, Close"}
              </button>
            </div>
          ) : (
            <>
              {/* Product Mini Recap Card */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/50 p-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
                  {product.photos?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.photos[0]}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-xs font-bold text-slate-900 dark:text-white">
                    {product.title}
                  </h4>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {formatTaka(product.pricePoisha)}
                    </span>
                    {product.compareAtPoisha && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {formatTaka(product.compareAtPoisha)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 font-bold text-slate-700 dark:text-white transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 font-bold text-slate-700 dark:text-white transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Variant selector if applicable */}
              {product.variants?.map((g) => (
                <div key={g.name} className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {g.name} নির্বাচন করুন:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {g.options.map((opt) => {
                      const selected = variant === `${g.name}:${opt}`;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setVariant(`${g.name}:${opt}`)}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                            selected
                              ? "border-2 border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold"
                              : "border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {opt} {selected ? "✓" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Saved Address Autofill Pill */}
              {saved && (
                <button
                  type="button"
                  onClick={useLast}
                  className="flex w-full items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  <span>📋 {isBn ? "পূর্বের সেভ করা ঠিকানা ব্যবহার করুন" : "Use saved address"}</span>
                  <span>↓</span>
                </button>
              )}

              {/* Customer Inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "আপনার পুরো নাম *" : "Your Full Name *"}
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isBn ? "যেমন: মো: আরিফুল ইসলাম" : "e.g. Ariful Islam"}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isBn ? "মোবাইল নম্বর *" : "Mobile Phone Number *"}
                    </label>
                    {phone && (
                      <span className={`text-[10px] font-bold ${isPhoneValid ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}`}>
                        {isPhoneValid ? (isBn ? "✓ সঠিক নম্বর" : "✓ Valid number") : (isBn ? "১১ ডিজিট (০১...)" : "11 digits")}
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                      phone && !isPhoneValid
                        ? "border-amber-400 dark:border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 focus:ring-amber-400"
                        : "border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800/80 focus:border-emerald-500 focus:ring-emerald-500"
                    }`}
                  />
                </div>

                {/* Delivery Location Quick Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isBn ? "ডেলিভারি এলাকা নির্বাচন করুন *" : "Select Delivery Area *"}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleDhakaToggle(true)}
                      className={`flex flex-col items-center justify-center rounded-2xl p-3 text-center border-2 transition ${
                        isDhaka
                          ? "border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white font-black shadow-sm"
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xl">🏠</span>
                      <span className="mt-1 text-xs font-extrabold">{isBn ? "ঢাকার ভেতরে" : "Inside Dhaka"}</span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {formatTaka(shop.dhakaFeePoisha)} চার্জ
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDhakaToggle(false)}
                      className={`flex flex-col items-center justify-center rounded-2xl p-3 text-center border-2 transition ${
                        !isDhaka
                          ? "border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white font-black shadow-sm"
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xl">🚚</span>
                      <span className="mt-1 text-xs font-extrabold">{isBn ? "ঢাকার বাইরে" : "Outside Dhaka"}</span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {formatTaka(shop.outsideFeePoisha)} চার্জ
                      </span>
                    </button>
                  </div>
                </div>

                {/* Cascading Location Selectors: District, Upazila, Union */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <span>📍</span>
                      <span>লোকেশন বিবরণ (জেলা, থানা ও ইউনিয়ন)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">সার্চ করে সিলেক্ট করুন</span>
                  </div>

                  {/* 1. District Combo */}
                  <SearchableCombo
                    label={isBn ? "১. জেলা (District)" : "1. District"}
                    placeholder={isBn ? "জেলা নির্বাচন করুন..." : "Select district..."}
                    searchPlaceholder={isBn ? "জেলার নাম খুঁজুন..." : "Search district..."}
                    items={districts}
                    selectedId={selectedDistrict?.id || null}
                    onSelect={(item) => setSelectedDistrict(item)}
                    loading={loadingDistricts}
                    required
                  />

                  {/* 2. Upazila Combo */}
                  <SearchableCombo
                    label={isBn ? "২. উপজেলা / থানা (Upazila / Thana)" : "2. Upazila / Thana"}
                    placeholder={isBn ? "উপজেলা / থানা নির্বাচন করুন..." : "Select upazila..."}
                    searchPlaceholder={isBn ? "উপজেলা বা থানা খুঁজুন..." : "Search upazila / thana..."}
                    items={upazilas}
                    selectedId={selectedUpazila?.id || null}
                    onSelect={(item) => setSelectedUpazila(item)}
                    disabled={!selectedDistrict}
                    disabledMessage={isBn ? "আগে জেলা নির্বাচন করুন" : "Select district first"}
                    loading={loadingUpazilas}
                    required
                  />

                  {/* 3. Union / Area Combo (With instant custom add!) */}
                  <SearchableCombo
                    label={isBn ? "৩. ইউনিয়ন / এলাকা (Union / Area)" : "3. Union / Area"}
                    placeholder={isBn ? "ইউনিয়ন / এলাকা নির্বাচন করুন..." : "Select union / area..."}
                    searchPlaceholder={isBn ? "ইউনিয়ন বা এলাকার নাম খুঁজুন..." : "Search union / area..."}
                    items={unions}
                    selectedId={selectedUnion?.id || null}
                    onSelect={(item) => setSelectedUnion(item)}
                    allowCustomAdd={true}
                    onCustomAdd={handleCustomUnionAdd}
                    disabled={!selectedUpazila}
                    disabledMessage={isBn ? "আগে উপজেলা নির্বাচন করুন" : "Select upazila first"}
                    loading={loadingUnions}
                  />
                </div>

                {/* Street / House Address Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "বাসা নম্বর, রোড নম্বর বা গ্রাম/পাড়া *" : "House, Road or Village/Holding *"}
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isBn ? "যেমন: রোড নং ৪, বাড়ি নং ১২, ফ্ল্যাট ৩এ" : "e.g. Road 4, House 12..."}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? "পেমেন্ট মাধ্যম বেছে নিন" : "Payment Method"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod("cod")}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center border transition ${
                      payMethod === "cod"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold"
                        : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-lg">💵</span>
                    <span className="text-[11px] mt-0.5">{isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod("bkash")}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center border transition ${
                      payMethod === "bkash"
                        ? "border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 font-extrabold"
                        : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-lg">📱</span>
                    <span className="text-[11px] mt-0.5">{isBn ? "বিকাশ পেমেন্ট" : "bKash"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod("nagad")}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center border transition ${
                      payMethod === "nagad"
                        ? "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300 font-extrabold"
                        : "border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-lg">💳</span>
                    <span className="text-[11px] mt-0.5">{isBn ? "নগদ পেমেন্ট" : "Nagad"}</span>
                  </button>
                </div>

                {/* bKash / Nagad Details Card */}
                {(payMethod === "bkash" || payMethod === "nagad") && (
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/70 p-3.5 text-xs space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {payMethod === "nagad" ? "নগদ পার্সোনাল নম্বর" : "বিকাশ পার্সোনাল নম্বর"}:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                          {(payMethod === "nagad" ? shop.nagadNumber : shop.bkashNumber) || "01700000000"}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText((payMethod === "nagad" ? shop.nagadNumber : shop.bkashNumber) || "")}
                          className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300"
                        >
                          কপি
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      উপরে দেওয়া নম্বরে {formatTaka(payAmount)} সেন্ড মানি করে ট্রানজেকশন আইডি (TrxID) নিচে দিন:
                    </p>
                    <input
                      type="text"
                      placeholder="Transaction ID (যেমন: 9J7X65K3)"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Bill Cost Breakdown Box */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isBn ? "পণ্যের মোট মূল্য" : "Items Subtotal"} ({qty} টি):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatTaka(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isBn ? "ডেলিভারি চার্জ" : "Delivery Fee"}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatTaka(fee)}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-white/10 pt-1.5 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                  <span>{isBn ? "সর্বমোট পরিশোধযোগ্য" : "Net Total"}:</span>
                  <span className="text-base text-emerald-600 dark:text-emerald-400">{formatTaka(total)}</span>
                </div>
              </div>

              {/* Honeypot */}
              <input className="hidden" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} aria-hidden />

              {/* Error Message */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-center text-xs font-bold text-red-600 dark:text-red-400">
                  ⚠️ {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky Floating Bottom Bar for Checkout Confirm */}
        {!demoOrderSuccess && (
          <div className="sticky bottom-0 z-20 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-4 backdrop-blur-md">
            <button
              type="button"
              disabled={busy || !name || !phone || !selectedDistrict || !selectedUpazila}
              onClick={() => place()}
              className="neon-btn flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black shadow-[0_0_25px_rgba(0,245,155,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isBn ? "অর্ডার প্রসেস হচ্ছে..." : "Processing order..."}
                </span>
              ) : (
                <span>
                  ⚡ {isBn ? `অর্ডার নিশ্চিত করুন · ${formatTaka(total)}` : `Confirm Order · ${formatTaka(total)}`}
                </span>
              )}
            </button>
            <p className="mt-1.5 text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {isBn ? "🔒 কোনো অগ্রিম পেমেন্ট নেই · পণ্য হাতে পেয়ে টাকা দিন" : "🔒 No advance payment · Pay cash on delivery"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
