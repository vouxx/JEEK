import { getLatestDigest } from "@/lib/digest";

export async function GET() {
  const latest = await getLatestDigest();
  const todayKST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const latestDate = latest?.date.toISOString().slice(0, 10);
  const hasToday = latestDate === todayKST;

  if (!hasToday) {
    return Response.json(
      { status: "missing", latestDate, todayKST },
      { status: 503 }
    );
  }

  return Response.json({
    status: "ok",
    date: latestDate,
    items: latest?.items.length ?? 0,
  });
}
