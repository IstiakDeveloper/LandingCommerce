"use client";

import { DISTRICTS } from "@/lib/geo/bd-districts";
import { useMemo, useState } from "react";

export function DistrictSheet({
  open,
  locale,
  value,
  onClose,
  onSelect,
}: {
  open: boolean;
  locale: "bn" | "en";
  value?: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtered = DISTRICTS.filter((d) => {
      if (!query) return true;
      return d.bn.includes(q) || d.en.toLowerCase().includes(query);
    });
    return [...filtered].sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white md:mx-auto md:max-w-lg md:rounded-2xl md:shadow-2xl">
      <div className="safe-top flex items-center gap-2 border-b border-black/10 px-4 py-3">
        <button type="button" className="tap font-semibold" onClick={onClose}>
          ←
        </button>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={locale === "bn" ? "জেলা খুঁজুন" : "Search district"}
          className="field"
        />
      </div>
      <div className="h-[calc(100dvh-72px)] overflow-y-auto">
        {list.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => {
              onSelect(d.id);
              onClose();
            }}
            className={`flex min-h-14 w-full items-center justify-between border-b border-black/5 px-4 text-left ${
              value === d.id ? "bg-paper font-bold" : ""
            }`}
          >
            <span>{locale === "bn" ? d.bn : d.en}</span>
            {d.popular ? (
              <span className="text-xs text-clay">★</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
