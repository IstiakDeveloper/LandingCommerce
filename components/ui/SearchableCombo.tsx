"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface ComboItem {
  id: string;
  name: string;
  bn_name: string;
}

interface SearchableComboProps {
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  items: ComboItem[];
  selectedId: string | null;
  onSelect: (item: ComboItem) => void;
  allowCustomAdd?: boolean;
  onCustomAdd?: (customName: string) => Promise<void> | void;
  disabled?: boolean;
  disabledMessage?: string;
  loading?: boolean;
  required?: boolean;
}

export function SearchableCombo({
  label,
  placeholder = "নির্বাচন করুন...",
  searchPlaceholder = "খুঁজুন...",
  items,
  selectedId,
  onSelect,
  allowCustomAdd = false,
  onCustomAdd,
  disabled = false,
  disabledMessage,
  loading = false,
  required = false,
}: SearchableComboProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find selected item
  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return items.find((it) => it.id === selectedId) || null;
  }, [items, selectedId]);

  // Filter items by query (Bangla and English)
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.bn_name.toLowerCase().includes(q) ||
        it.name.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  async function handleAddCustom() {
    const trimmed = query.trim();
    if (!trimmed || !onCustomAdd) return;
    setIsAddingCustom(true);
    try {
      await onCustomAdd(trimmed);
      setIsOpen(false);
      setQuery("");
    } finally {
      setIsAddingCustom(false);
    }
  }

  return (
    <div ref={containerRef} className="relative space-y-1">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex min-h-[42px] w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100/60 text-slate-400 dark:border-white/5 dark:bg-white/5 dark:text-slate-500"
            : isOpen
            ? "border-emerald-500 ring-1 ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            : "border-slate-300 bg-white hover:border-slate-400 dark:border-white/15 dark:bg-slate-800/80 text-slate-900 dark:text-white"
        }`}
      >
        <span className="truncate">
          {loading ? (
            <span className="text-xs text-slate-400">লোড হচ্ছে...</span>
          ) : selectedItem ? (
            <span className="font-semibold text-slate-900 dark:text-white">
              {selectedItem.bn_name}{" "}
              <span className="text-xs font-normal text-slate-400">
                ({selectedItem.name})
              </span>
            </span>
          ) : (
            <span className="text-slate-400 text-xs">
              {disabled && disabledMessage ? disabledMessage : placeholder}
            </span>
          )}
        </span>
        <span className="ml-2 text-xs text-slate-400">
          {loading ? "⌛" : isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
          {/* Search Input Box */}
          <div className="sticky top-0 border-b border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900">
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-xs text-slate-400">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-7 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Custom Add Action if enabled and query typed */}
          {allowCustomAdd && query.trim().length > 0 && (
            <div className="border-b border-slate-100 bg-emerald-50/50 p-2 dark:border-white/5 dark:bg-emerald-950/30">
              <button
                type="button"
                disabled={isAddingCustom}
                onClick={handleAddCustom}
                className="flex w-full items-center justify-between rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black shadow-sm transition hover:bg-emerald-400 disabled:opacity-50"
              >
                <span className="truncate">
                  ➕ &ldquo;{query.trim()}&rdquo; যুক্ত করুন
                </span>
                <span className="text-[10px] font-black uppercase">
                  {isAddingCustom ? "যোগ হচ্ছে..." : "নতুন অ্যাড"}
                </span>
              </button>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-1 text-xs">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  কোনো মিল পাওয়া যায়নি
                </p>
                {allowCustomAdd && query.trim() && (
                  <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    উপরের সবুজ বাটনে ক্লিক করে সরাসরি এই নাম যুক্ত করতে পারেন
                  </p>
                )}
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                      isSelected
                        ? "bg-emerald-500/15 font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>
                      <span className="font-semibold">{item.bn_name}</span>{" "}
                      <span className="text-[11px] text-slate-400">
                        ({item.name})
                      </span>
                    </span>
                    {isSelected && (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
