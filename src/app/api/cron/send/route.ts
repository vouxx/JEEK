import { sendTodayDigest } from "@/lib/digest";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
