import Link from "next/link";
import { getDigestDates } from "@/lib/digest";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const dates = await getDigestDates();

  return (
    <div className="px-6 py-6">
      <h1 className="mb-6 text-xl font-bold text-neutral-900 dark:text-neutral-100">아카이브</h1>

      {dates.length > 0 ? (
        <ul className="space-y-2">
          {dates.map((date) => {
            const dateStr = date.toISOString().split("T")[0];
            const displayStr = date.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            });

            return (
              <li key={dateStr}>
                <Link
                  href={`/digest/${dateStr}`}
                  className="block rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                >
                  {displayStr}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-12 text-center text-neutral-400 dark:text-neutral-500">
          아직 아카이브가 없습니다.
        </p>
      )}
    </div>
  );
}
