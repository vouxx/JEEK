import { prisma } from "./prisma";
import { getResend } from "./resend";
import { fetchNewsForCategory } from "./gemini";
import { CATEGORY_KEYS, CATEGORIES } from "./constants";
import { DailyDigest } from "@/emails/DailyDigest";
import { render } from "@react-email/render";
import type { CategoryDigest, MonthSummary } from "@/types/digest";
import type { Category } from "@/types/digest";

/** Vercel(UTC) 서버에서도 KST 기준 오늘 날짜를 반환 */
function getTodayKST(): Date {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const dateStr = kst.toISOString().slice(0, 10);
  return new Date(dateStr + "T00:00:00.000Z");
}

/** 오늘자 다이제스트 콘텐츠만 생성 (이메일 발송 없음) */
export async function generateDigest() {
  const today = getTodayKST();

  // Check if already generated today
  const existing = await prisma.digest.findUnique({
    where: { date: today },
  });
  if (existing) {
    console.log("Digest already exists for today, skipping generation");
    return existing;
  }

  // Fetch news in batches (Gemini 2.5 Flash free tier: 5 RPM)
  const batchSize = 4;
  const results: { category: Category; items: Awaited<ReturnType<typeof fetchNewsForCategory>> }[] = [];

  for (let i = 0; i < CATEGORY_KEYS.length; i += batchSize) {
    const batch = CATEGORY_KEYS.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (category) => ({
        category,
        items: await fetchNewsForCategory(category),
      }))
    );
    results.push(...batchResults);
    if (i + batchSize < CATEGORY_KEYS.length) {
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

  console.log(`Digest generated: ${digest.items.length} items`);
  return digest;
}

/** 오늘자 다이제스트의 이메일만 발송 (평일만, 콘텐츠 생성 없이) */
export async function sendTodayDigest() {
  // 평일(월~금)에만 이메일 발송 (KST 기준)
  const kstDay = new Date(Date.now() + 9 * 60 * 60 * 1000).getDay();
  const isWeekday = kstDay >= 1 && kstDay <= 5;
  if (!isWeekday) {
    console.log("Weekend — email skipped");
    return { ok: true, sent: 0, total: 0, skipped: "weekend" };
  }

  const today = getTodayKST();

  const digest = await prisma.digest.findUnique({
    where: { date: today },
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!digest) {
    return { ok: false, error: "No digest for today" };
  }

  const subscribers = await prisma.subscriber.findMany({
    where: { active: true },
  });

  const categoryDigests: CategoryDigest[] = CATEGORY_KEYS.map((key) => ({
    category: key,
    label: CATEGORIES[key].label,
    items: digest.items
      .filter((item) => item.category === key)
      .map((item) => ({
        title: item.title,
        summary: item.summary,
        whyItMatters: item.whyItMatters,
        sourceUrl: item.sourceUrl,
        sourceHint: "",
      })),
  }));

  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  let sent = 0;

  for (const subscriber of subscribers) {
    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "ZEEK <digest@zeek.dev>",
        to: subscriber.email,
        subject: `ZEEK Daily — ${dateStr}`,
        html: await render(DailyDigest({
          date: dateStr,
          categories: categoryDigests,
          unsubscribeUrl: `${appUrl}/unsubscribe?token=${subscriber.token}`,
        })),
      });
      sent++;
    } catch (e) {
      console.error(`Failed to send email to ${subscriber.email}:`, e);
    }
  }

  console.log(`Email sent to ${sent}/${subscribers.length} subscribers`);
  return { ok: true, sent, total: subscribers.length };
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

export async function getArchiveData(): Promise<MonthSummary[]> {
  const digests = await prisma.digest.findMany({
    select: {
      date: true,
      items: { select: { category: true } },
    },
    orderBy: { date: "desc" },
  });

  const monthMap = new Map<string, MonthSummary>();

  for (const digest of digests) {
    const year = digest.date.getUTCFullYear();
    const month = digest.date.getUTCMonth();
    const key = `${year}-${month}`;

    if (!monthMap.has(key)) {
      monthMap.set(key, {
        year,
        month,
        label: new Date(year, month).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
        }),
        digestCount: 0,
        totalItems: 0,
        categoryBreakdown: [],
        dates: [],
      });
    }

    const entry = monthMap.get(key)!;
    entry.digestCount += 1;
    entry.totalItems += digest.items.length;
    entry.dates.push({
      dateStr: digest.date.toISOString().split("T")[0],
      displayStr: digest.date.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
      itemCount: digest.items.length,
    });
  }

  // Category breakdown per month
  for (const digest of digests) {
    const year = digest.date.getUTCFullYear();
    const month = digest.date.getUTCMonth();
    const entry = monthMap.get(`${year}-${month}`)!;

    for (const item of digest.items) {
      const existing = entry.categoryBreakdown.find(
        (c) => c.category === item.category
      );
      if (existing) {
        existing.count += 1;
      } else {
        const cat = CATEGORIES[item.category as Category];
        entry.categoryBreakdown.push({
          category: item.category,
          label: cat?.label ?? item.category,
          count: 1,
        });
      }
    }
  }

  // Sort category breakdowns by count desc
  for (const entry of monthMap.values()) {
    entry.categoryBreakdown.sort((a, b) => b.count - a.count);
  }

  // 월간 요약 조회
  const summaries = await prisma.monthlySummary.findMany();
  for (const s of summaries) {
    const entry = monthMap.get(`${s.year}-${s.month}`);
    if (entry) entry.summary = s.content;
  }

  return Array.from(monthMap.values());
}
