"use client";

import { useState } from "react";
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

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            activeCategory === "all"
              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          전체
        </button>
        {categoriesWithData.map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              activeCategory === key
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {label}
          </button>
        ))}
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
