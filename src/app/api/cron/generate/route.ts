import { generateAndSendDigest } from "@/lib/digest";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const digest = await generateAndSendDigest();
    return Response.json({ ok: true, id: digest.id });
  } catch (e) {
    console.error("Digest generation failed:", e);
    return Response.json(
      { error: "Digest generation failed" },
      { status: 500 }
    );
  }
}
