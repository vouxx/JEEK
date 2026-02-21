import { notFound } from "next/navigation";
import { getDigestByDate } from "@/lib/digest";
import { DigestList } from "@/components/DigestList";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ date: string }>;
}

export default async function DigestPage({ params }: Props) {
  const { date: dateParam } = await params;

  const parsed = new Date(dateParam + "T00:00:00");
  if (isNaN(parsed.getTime())) {
    notFound();
  }

  const digest = await getDigestByDate(parsed);
  if (!digest) {
    notFound();
  }

  const dateStr = digest.date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">데일리 다이제스트</h1>
        <p className="text-sm text-neutral-500">{dateStr}</p>
      </div>
      <DigestList items={digest.items} />
    </div>
  );
}
