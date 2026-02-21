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
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
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
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {groupedItems.map(({ key, label, items: groupItems }) => (
        <section key={key} className="mb-8">
          <h2 className="mb-2 inline-block rounded bg-neutral-100 px-2 py-1 text-sm font-bold text-neutral-700">
            {label}
          </h2>
          <div className="divide-y divide-neutral-100">
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
        <p className="py-12 text-center text-neutral-400">아직 뉴스가 없습니다.</p>
      )}
    </div>
  );
}
