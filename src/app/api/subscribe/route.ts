import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return Response.json({ error: "유효하지 않은 이메일입니다" }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.active) {
        return Response.json({ message: "이미 구독 중입니다" });
      }
      // Re-subscribe
      await prisma.subscriber.update({
        where: { email },
        data: { active: true, unsubscribedAt: null },
      });
      return Response.json({ message: "다시 구독되었습니다" });
    }

    await prisma.subscriber.create({ data: { email } });
    return Response.json({ message: "구독 완료!" });
  } catch (e) {
    console.error("Subscribe error:", e);
    return Response.json({ error: "구독에 실패했습니다" }, { status: 500 });
  }
}
