import { getArchiveData } from "@/lib/digest";
import { MonthSection } from "@/components/MonthSection";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const months = await getArchiveData();

  return (
    <div className="px-6 py-6">
      <h1 className="mb-6 text-xl font-bold text-neutral-900 dark:text-neutral-100">아카이브</h1>

      {months.length > 0 ? (
        <div className="space-y-4">
          {months.map((month, index) => (
            <MonthSection
              key={`${month.year}-${month.month}`}
              month={month}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-neutral-400 dark:text-neutral-500">
          아직 아카이브가 없습니다.
        </p>
      )}
    </div>
  );
}
