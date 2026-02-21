import { getLatestDigest } from "@/lib/digest";
import { DigestList } from "@/components/DigestList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const digest = await getLatestDigest();

  const dateStr = digest
    ? digest.date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : null;

  return (
    <div className="px-6 py-6">
      {digest ? (
        <div className="animate-fade-in">
          <div className="mb-10">
            <p className="text-xs font-medium tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">{dateStr}</p>
            <h1 className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">오늘의 다이제스트</h1>
          </div>
          <DigestList items={digest.items} />
        </div>
      ) : (
        <div className="animate-slide-up py-24 text-center">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">ZEEK</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400 dark:text-neutral-500">
            매일 아침, AI와 테크 뉴스를 큐레이션합니다.
          </p>
        </div>
      )}

    </div>
  );
}
