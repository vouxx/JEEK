import { generateDigest, sendTodayDigest, getLatestDigest } from "@/lib/digest";
import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 오늘 다이제스트가 없으면 자동 생성 (00시 크론 실패 대비)
    const latest = await getLatestDigest();
    const todayKST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const latestDate = latest?.date.toISOString().slice(0, 10);

    if (latestDate !== todayKST) {
      console.log("Today's digest missing — generating before send");
      await generateDigest();
    }

    const result = await sendTodayDigest();
    return Response.json(result);
  } catch (e) {
    console.error("Email send failed:", e);
    return Response.json(
      { error: "Email send failed" },
      { status: 500 }
    );
  }
}
