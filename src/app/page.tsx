import { getLatestDigest } from "@/lib/digest";
import { DigestList } from "@/components/DigestList";
import { SubscribeForm } from "@/components/SubscribeForm";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      {digest ? (
        <>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-neutral-900">오늘의 다이제스트</h1>
            <p className="text-sm text-neutral-500">{dateStr}</p>
          </div>
          <DigestList items={digest.items} />
        </>
      ) : (
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">JEEK</h1>
          <p className="mt-2 text-neutral-500">
            AI/Tech 뉴스 다이제스트가 곧 시작됩니다.
          </p>
        </div>
      )}

      <div className="mt-12">
        <SubscribeForm />
      </div>
    </div>
  );
}
