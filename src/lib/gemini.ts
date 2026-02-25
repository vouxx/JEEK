import { GoogleGenAI } from "@google/genai";
import type { Category, NewsItem } from "@/types/digest";
import { CATEGORIES } from "./constants";
import { prisma } from "./prisma";

let _ai: GoogleGenAI | null = null;

function getAI() {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return _ai;
}

const SYSTEM_PROMPT = `너는 ZEEK이라는 데일리 뉴스레터의 테크 뉴스 큐레이터야.
지난 24시간 동안의 가장 중요한 뉴스와 화제 글을 찾아서 요약해줘.

소스 범위:
- 뉴스 매체: TechCrunch, The Verge, Ars Technica, 한겨레, ZDNet 등
- 개발자 커뮤니티: Hacker News, Reddit (r/programming, r/webdev 등), Lobste.rs
- 블로그/포럼: dev.to, Medium 기술 블로그, 개인 개발자 블로그
- 오픈소스: GitHub Trending, 주요 프로젝트 릴리스 노트
- 커뮤니티에서 화제가 되는 글, 토론, 프로젝트도 포함해줘

반드시 한국어로 작성하고, JSON 배열로 7~10개 아이템을 반환해줘. 각 아이템은 다음 필드를 포함해야 해:
- "title": 간결한 헤드라인 (40자 이내)
- "summary": 한 문장으로 요약
- "whyItMatters": 개발자/테크 종사자가 왜 관심을 가져야 하는지 한 문장
- "sourceHint": 출처명 (예: TechCrunch, Hacker News, r/programming, GitHub 등)

예시:
[
  {
    "title": "OpenAI, GPT-5 정식 출시",
    "summary": "OpenAI가 네이티브 함수 호출과 환각 감소 기능을 탑재한 GPT-5를 공개했다.",
    "whyItMatters": "AI 기반 앱 개발의 복잡도가 크게 줄어들 전망이다.",
    "sourceHint": "The Verge"
  },
  {
    "title": "Bun 2.0 릴리스, Node.js 호환성 대폭 개선",
    "summary": "Bun이 2.0을 출시하며 Node.js 모듈 호환성을 95%까지 끌어올렸다.",
    "whyItMatters": "Node.js 대체재로서 프로덕션 도입 장벽이 크게 낮아졌다.",
    "sourceHint": "Hacker News"
  }
]

규칙:
- 지난 24시간 이내의 뉴스/글만 포함
- 중요도와 개발자 관련성을 기준으로 우선순위 결정
- 사실에 기반하여 작성, 추측 금지
- 영어/한국어 소스 모두 검색하되, 결과는 반드시 한국어로 작성
- JSON 배열만 반환, 다른 텍스트 없이`;

/** 구두점 제거 후 단어 분리 */
function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * grounding redirect URL을 실제 URL로 리졸브하고 접근 가능한지 확인.
 * 성공 시 최종 URL, 실패 시 null 반환.
 */
async function resolveAndVerifyUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "ZEEK-Bot/1.0" },
    });
    if (!res.ok) return null;
    // 홈페이지나 카테고리 페이지가 아닌 구체적 기사 URL만 허용
    const path = new URL(res.url).pathname;
    if (path.length <= 1) return null; // "/" 만 있는 홈페이지
    return res.url;
  } catch {
    return null;
  }
}

export async function fetchNewsForCategory(category: Category): Promise<NewsItem[]> {
  const categoryInfo = CATEGORIES[category];

  const response = await getAI().models.generateContent({
    model: "gemini-2.5-flash",
    contents: `오늘의 주요 뉴스와 커뮤니티 화제 글을 찾아줘. 카테고리: ${categoryInfo.description}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
      temperature: 0.3,
    },
  });

  const text = response.text ?? "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error(`Failed to parse Gemini response for ${category}:`, text);
    return [];
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Array<{
      title: string;
      summary: string;
      whyItMatters: string;
      sourceHint: string;
    }>;

    // Grounding metadata에서 URL 수집
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const groundingSupports =
      response.candidates?.[0]?.groundingMetadata?.groundingSupports ?? [];

    // support → 아이템 매핑 (2가지 전략 병행)
    const itemChunkMap = new Map<number, Set<number>>();

    // 전략 1: startIndex 기반 위치 매핑 (rawText에서 아이템 경계 탐지)
    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? text;
    const itemBoundaries: number[] = parsed.map((item) => {
      const pos = rawText.indexOf(item.title);
      return pos >= 0 ? pos : Infinity;
    });

    for (const support of groundingSupports) {
      if (!support.groundingChunkIndices?.length) continue;
      const startIdx = support.segment?.startIndex ?? 0;

      let itemIdx = 0;
      for (let i = itemBoundaries.length - 1; i >= 0; i--) {
        if (startIdx >= itemBoundaries[i]) {
          itemIdx = i;
          break;
        }
      }

      if (!itemChunkMap.has(itemIdx)) itemChunkMap.set(itemIdx, new Set());
      for (const idx of support.groundingChunkIndices) {
        itemChunkMap.get(itemIdx)!.add(idx);
      }
    }

    // 전략 2: 텍스트 유사도 기반 fallback (전략 1에서 매핑 안 된 아이템용)
    for (let i = 0; i < parsed.length; i++) {
      if (itemChunkMap.has(i)) continue;
      const item = parsed[i];
      const itemWords = extractWords(`${item.title} ${item.summary} ${item.whyItMatters}`);

      for (const support of groundingSupports) {
        if (!support.groundingChunkIndices?.length) continue;
        const supportWords = extractWords(support.segment?.text ?? "").join(" ");
        const matchCount = itemWords.filter((w) => supportWords.includes(w)).length;
        const score = matchCount / Math.max(itemWords.length, 1);

        if (score > 0.2) {
          if (!itemChunkMap.has(i)) itemChunkMap.set(i, new Set());
          for (const idx of support.groundingChunkIndices) {
            itemChunkMap.get(i)!.add(idx);
          }
        }
      }
    }

    // 각 아이템에 대해 매핑된 chunk URL 리졸브 + 접근성 검증 (전체 병렬)
    const resolvedItems = await Promise.all(
      parsed.map(async (item, i) => {
        const chunkIndices = itemChunkMap.get(i);
        if (!chunkIndices) return null;

        const candidates = [...chunkIndices]
          .map((idx) => groundingChunks[idx])
          .filter((c) => c?.web?.uri);

        const results = await Promise.all(
          candidates.map((c) => resolveAndVerifyUrl(c!.web!.uri!))
        );
        const url = results.find((u) => u !== null);
        if (url) return { ...item, sourceUrl: url };
        return null;
      })
    );

    // 중복 URL 제거 후 최종 아이템 구성
    const items: NewsItem[] = [];
    const usedUrls = new Set<string>();

    for (const item of resolvedItems) {
      if (!item) continue;
      if (usedUrls.has(item.sourceUrl)) continue;
      usedUrls.add(item.sourceUrl);

      items.push({
        title: item.title,
        summary: item.summary,
        whyItMatters: item.whyItMatters,
        sourceUrl: item.sourceUrl,
        sourceHint: item.sourceHint,
      });
    }

    console.log(`[${category}] ${items.length}/${parsed.length} items with verified URLs`);
    return items;
  } catch (e) {
    console.error(`JSON parse error for ${category}:`, e);
    return [];
  }
}

/**
 * 특정 월의 다이제스트 아이템을 기반으로 월간 요약을 생성하고 DB에 저장.
 * force=true이면 기존 요약을 덮어씀 (이번 달 매일 갱신용).
 */
export async function generateMonthlySummary(year: number, month: number, force = false): Promise<string> {
  if (!force) {
    const existing = await prisma.monthlySummary.findUnique({
      where: { year_month: { year, month } },
    });
    if (existing) return existing.content;
  }

  // 해당 월의 다이제스트 아이템 조회
  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 1));

  const items = await prisma.digestItem.findMany({
    where: {
      digest: {
        date: { gte: startDate, lt: endDate },
      },
    },
    select: { category: true, title: true, summary: true },
    orderBy: { digest: { date: "asc" } },
  });

  if (items.length === 0) {
    return "";
  }

  // 카테고리별로 제목 그룹핑하여 프롬프트 구성
  const grouped = new Map<string, string[]>();
  for (const item of items) {
    const label = CATEGORIES[item.category as Category]?.label ?? item.category;
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label)!.push(`- ${item.title}: ${item.summary}`);
  }

  let input = "";
  for (const [label, titles] of grouped) {
    input += `\n[${label}]\n${titles.join("\n")}\n`;
  }

  const monthLabel = new Date(year, month).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  const response = await getAI().models.generateContent({
    model: "gemini-2.5-flash",
    contents: `다음은 ${monthLabel}에 다뤄진 기술 뉴스 목록이야:\n${input}`,
    config: {
      systemInstruction: `너는 ZEEK 기술 뉴스레터의 월간 요약 작성자야.
주어진 뉴스 목록을 분석해서 해당 월의 핵심 트렌드와 주요 이슈를 3~4문장으로 요약해줘.

규칙:
- 한국어로 작성
- 가장 영향력 있었던 뉴스와 트렌드를 중심으로
- 개발자/테크 종사자 관점에서 의미 있는 흐름을 짚어줘
- 간결하고 읽기 쉬운 문체
- JSON이 아닌 일반 텍스트로 반환`,
      temperature: 0.3,
    },
  });

  const content = response.text?.trim() ?? "";

  // DB에 저장 (upsert: 있으면 갱신, 없으면 생성)
  await prisma.monthlySummary.upsert({
    where: { year_month: { year, month } },
    update: { content },
    create: { year, month, content },
  });

  console.log(`[monthly-summary] Generated for ${monthLabel}`);
  return content;
}
