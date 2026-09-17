"use client";

import { telLink, waLink } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export function ThanksClient({
  code,
  shopName,
  shopSlug,
  callPhone,
  whatsapp,
}: {
  code: string;
  shopName: string;
  shopSlug: string;
  callPhone: string | null;
  whatsapp: string | null;
}) {
  const t = useTranslations("thanks");
  const [copied, setCopied] = useState(false);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-leaf text-3xl text-white">✓</div>
      <h1 className="mt-6 text-2xl font-black">{t("title")}</h1>
      <p className="mt-2 text-ink/60">{t("shot")}</p>
      <button
        type="button"
        className="mt-4 w-full rounded-2xl bg-white py-5 text-3xl font-black tracking-wide"
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
        }}
      >
        {code}
      </button>
      <p className="mt-2 text-sm font-bold text-leaf">{copied ? t("copy") + " ✓" : ""}</p>
      <div className="mt-8 grid w-full grid-cols-2 gap-2">
        {callPhone ? (
          <a href={telLink(callPhone)} className="flex h-14 items-center justify-center rounded-2xl bg-ink font-bold text-white">
            কল
          </a>
        ) : null}
        {whatsapp ? (
          <a href={waLink(whatsapp, `অর্ডার ${code}`)} className="flex h-14 items-center justify-center rounded-2xl bg-clay font-bold text-white">
            WhatsApp
          </a>
        ) : null}
      </div>
      <Link href={`/s/${shopSlug}`} className="mt-6 font-bold">
        ← {shopName}
      </Link>
    </div>
  );
}
