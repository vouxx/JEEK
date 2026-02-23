import { generateAndSendDigest } from "@/lib/digest";
import { generateMonthlySummary } from "@/lib/gemini";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const digest = await generateAndSendDigest();

    const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);

    // 이번 달 요약 매일 갱신 (새 다이제스트 반영)
    await generateMonthlySummary(kst.getFullYear(), kst.getMonth(), true).catch((e) =>
      console.error("Current month summary update failed:", e)
    );

    // 매월 1일에 지난 달 요약 최종 확정
    if (kst.getDate() === 1) {
      const year = kst.getMonth() === 0 ? kst.getFullYear() - 1 : kst.getFullYear();
      const month = kst.getMonth() === 0 ? 11 : kst.getMonth() - 1;
      await generateMonthlySummary(year, month, true).catch((e) =>
        console.error("Previous month summary generation failed:", e)
      );
    }

    return Response.json({ ok: true, id: digest.id });
  } catch (e) {
    console.error("Digest generation failed:", e);
    return Response.json(
      { error: "Digest generation failed" },
      { status: 500 }
    );
  }
}
