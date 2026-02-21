import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json({ error: "Token required" }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { token },
    });

    if (!subscriber) {
      return Response.json({ error: "Invalid token" }, { status: 404 });
    }

    await prisma.subscriber.update({
      where: { token },
      data: { active: false, unsubscribedAt: new Date() },
    });

    return Response.json({ message: "Unsubscribed successfully" });
  } catch (e) {
    console.error("Unsubscribe error:", e);
    return Response.json({ error: "Unsubscribe failed" }, { status: 500 });
  }
}
