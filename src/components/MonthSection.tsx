"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { MonthSummary } from "@/types/digest";

interface MonthSectionProps {
  month: MonthSummary;
  defaultOpen: boolean;
}

export function MonthSection({ month, defaultOpen }: MonthSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const topCategories = month.categoryBreakdown.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-neutral-50 px-4 py-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
      >
        <div className="text-left">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {month.label}
          </span>
          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <span>{month.digestCount}개 다이제스트</span>
            <span>·</span>
            <span>{month.totalItems}개 아티클</span>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {(month.summary || topCategories.length > 0) && (
        <div className="border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-800/30">
          {month.summary && (
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              {month.summary}
            </p>
          )}
          {topCategories.length > 0 && (
            <div className={`flex flex-wrap gap-1.5${month.summary ? " mt-2" : ""}`}>
              {topCategories.map(({ category, label, count }) => (
                <span
                  key={category}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400"
                >
                  {label} {count}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {open && (
        <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {month.dates.map(({ dateStr, displayStr, itemCount }) => (
            <li key={dateStr}>
              <Link
                href={`/digest/${dateStr}`}
                className="flex items-center justify-between px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <span>{displayStr}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  {itemCount}개
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
