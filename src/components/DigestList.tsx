"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { DigestCard } from "./DigestCard";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/types/digest";

interface DigestItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  whyItMatters: string;
  sourceUrl: string;
}

interface DigestListProps {
  items: DigestItem[];
}

export function DigestList({ items }: DigestListProps) {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = Object.entries(CATEGORIES) as [Category, { label: string }][];
  const categoriesWithData = categories.filter(([key]) =>
    items.some((item) => item.category === key)
  );
  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const groupedItems = categoriesWithData
    .map(([key, { label }]) => ({
      key,
      label,
      items: filteredItems.filter((item) => item.category === key),
    }))
    .filter((group) => group.items.length > 0);

  const activeLabel =
    activeCategory === "all"
      ? "전체 카테고리"
      : CATEGORIES[activeCategory].label;

  const options: { value: Category | "all"; label: string }[] = [
    { value: "all", label: "전체 카테고리" },
    ...categoriesWithData.map(([key, { label }]) => ({ value: key, label })),
  ];

  return (
    <div>
      <div className="relative mb-4" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 transition-colors"
        >
          {activeLabel}
          <ChevronDown className={`h-4 w-4 text-neutral-400 dark:text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-1 shadow-lg">
            {options.map(({ value, label }) => (
              <li key={value}>
                <button
                  onClick={() => { setActiveCategory(value); setOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                    activeCategory === value
                      ? "font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700/50"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {groupedItems.map(({ key, label, items: groupItems }) => (
        <section key={key} className="mb-10">
          <h2 className="mb-3 text-xs font-medium tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
            {label}
          </h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {groupItems.map((item) => (
              <DigestCard
                key={item.id}
                title={item.title}
                summary={item.summary}
                whyItMatters={item.whyItMatters}
                sourceUrl={item.sourceUrl}
              />
            ))}
          </div>
        </section>
      ))}

      {filteredItems.length === 0 && (
        <p className="py-12 text-center text-neutral-400 dark:text-neutral-500">아직 뉴스가 없습니다.</p>
      )}
    </div>
  );
}
