import { generateMonthlySummary } from "@/lib/gemini";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 지난 달 요약 생성
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000); // KST
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;

  try {
    const content = await generateMonthlySummary(year, month);
    return Response.json({ ok: true, year, month: month + 1, content });
  } catch (e) {
    console.error("Monthly summary generation failed:", e);
    return Response.json(
      { error: "Monthly summary generation failed" },
      { status: 500 }
    );
  }
}
