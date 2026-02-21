import { prisma } from "./prisma";
import { getResend } from "./resend";
import { fetchNewsForCategory } from "./gemini";
import { CATEGORY_KEYS, CATEGORIES } from "./constants";
import { DailyDigest } from "@/emails/DailyDigest";
import type { CategoryDigest } from "@/types/digest";
import type { Category } from "@/types/digest";

export async function generateAndSendDigest() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already generated today
  const existing = await prisma.digest.findUnique({
    where: { date: today },
  });
  if (existing) {
    console.log("Digest already exists for today, skipping generation");
    return existing;
  }

  // Fetch news for each category sequentially (Gemini free tier: 5 RPM)
  const results: { category: Category; items: Awaited<ReturnType<typeof fetchNewsForCategory>> }[] = [];
  for (const category of CATEGORY_KEYS) {
    const items = await fetchNewsForCategory(category);
    results.push({ category, items });
    // Wait 15s between calls to stay under rate limit
    if (category !== CATEGORY_KEYS[CATEGORY_KEYS.length - 1]) {
      await new Promise((r) => setTimeout(r, 15000));
    }
  }

  // Store in database
  const digest = await prisma.digest.create({
    data: {
      date: today,
      items: {
        create: results.flatMap(({ category, items }) =>
          items.map((item, index) => ({
            category,
            title: item.title,
            summary: item.summary,
            whyItMatters: item.whyItMatters,
            sourceUrl: item.sourceUrl,
            order: index,
          }))
        ),
      },
    },
    include: { items: true },
  });

  // Send emails to all active subscribers
  const subscribers = await prisma.subscriber.findMany({
    where: { active: true },
  });

  const categoryDigests: CategoryDigest[] = CATEGORY_KEYS.map((key) => ({
    category: key,
    label: CATEGORIES[key].label,
    items: results
      .find((r) => r.category === key)
      ?.items ?? [],
  }));

  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  for (const subscriber of subscribers) {
    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "ZEEK <digest@zeek.dev>",
        to: subscriber.email,
        subject: `ZEEK Daily — ${dateStr}`,
        react: DailyDigest({
          date: dateStr,
          categories: categoryDigests,
          unsubscribeUrl: `${appUrl}/unsubscribe?token=${subscriber.token}`,
        }),
      });
    } catch (e) {
      console.error(`Failed to send email to ${subscriber.email}:`, e);
    }
  }

  console.log(
    `Digest generated: ${digest.items.length} items, sent to ${subscribers.length} subscribers`
  );

  return digest;
}

export async function getLatestDigest() {
  return prisma.digest.findFirst({
    orderBy: { date: "desc" },
    include: { items: { orderBy: { order: "asc" } } },
  });
}

export async function getDigestByDate(date: Date) {
  return prisma.digest.findUnique({
    where: { date },
    include: { items: { orderBy: { order: "asc" } } },
  });
}

export async function getDigestDates() {
  const digests = await prisma.digest.findMany({
    select: { date: true },
    orderBy: { date: "desc" },
  });
  return digests.map((d) => d.date);
}
