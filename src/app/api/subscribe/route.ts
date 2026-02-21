import { prisma } from "@/lib/prisma";
import { getResend } from "@/lib/resend";
import { Welcome } from "@/emails/Welcome";
import { NextRequest } from "next/server";

async function sendWelcomeEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const unsubscribeUrl = `${appUrl}/unsubscribe?token=${token}`;

  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "ZEEK <digest@zeek.dev>",
      to: email,
      subject: "ZEEK에 오신 걸 환영합니다!",
      react: Welcome({ unsubscribeUrl }),
    });
  } catch (e) {
    console.error("Welcome email error:", e);
  }
}

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
      sendWelcomeEmail(email, existing.token);
      return Response.json({ message: "다시 구독되었습니다!" });
    }

    const subscriber = await prisma.subscriber.create({ data: { email } });
    sendWelcomeEmail(email, subscriber.token);
    return Response.json({ message: "구독 완료! 환영 이메일을 보내드렸습니다." });
  } catch (e) {
    console.error("Subscribe error:", e);
    return Response.json({ error: "구독에 실패했습니다" }, { status: 500 });
  }
}
