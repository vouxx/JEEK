import { GoogleGenAI } from "@google/genai";
import type { Category, NewsItem } from "@/types/digest";
import { CATEGORIES } from "./constants";

let _ai: GoogleGenAI | null = null;

function getAI() {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return _ai;
}

const SYSTEM_PROMPT = `너는 ZEEK이라는 데일리 뉴스레터의 테크 뉴스 큐레이터야.
지난 24시간 동안의 가장 중요한 뉴스를 찾아서 요약해줘.

반드시 한국어로 작성하고, JSON 배열로 5~7개 뉴스 아이템을 반환해줘. 각 아이템은 다음 필드를 포함해야 해:
- "title": 간결한 헤드라인 (40자 이내)
- "summary": 뉴스를 한 문장으로 요약
- "whyItMatters": 개발자/테크 종사자가 왜 관심을 가져야 하는지 한 문장
- "sourceHint": 출처 매체명 (예: TechCrunch, The Verge, 한겨레 등)

예시:
[
  {
    "title": "OpenAI, GPT-5 정식 출시",
    "summary": "OpenAI가 네이티브 함수 호출과 환각 감소 기능을 탑재한 GPT-5를 공개했다.",
    "whyItMatters": "AI 기반 앱 개발의 복잡도가 크게 줄어들 전망이다.",
    "sourceHint": "The Verge"
  }
]

규칙:
- 지난 24시간 이내의 뉴스만 포함
- 중요도와 개발자 관련성을 기준으로 우선순위 결정
- 사실에 기반하여 작성, 추측 금지
- 영어/한국어 소스 모두 검색하되, 결과는 반드시 한국어로 작성
- JSON 배열만 반환, 다른 텍스트 없이`;

export async function fetchNewsForCategory(category: Category): Promise<NewsItem[]> {
  const categoryInfo = CATEGORIES[category];

  const response = await getAI().models.generateContent({
    model: "gemini-2.5-flash",
    contents: `오늘의 주요 뉴스를 찾아줘. 카테고리: ${categoryInfo.description}`,
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

    // Grounding metadata에서 검증된 URL만 수집
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const groundingSupports =
      response.candidates?.[0]?.groundingMetadata?.groundingSupports ?? [];

    // 검증된 URL 풀 만들기: { uri, title } 쌍
    const verifiedSources = groundingChunks
      .map((chunk) => ({
        uri: chunk.web?.uri ?? "",
        title: (chunk.web?.title ?? "").toLowerCase(),
      }))
      .filter((c) => c.uri);

    return parsed.map((item) => {
      const titleLower = item.title.toLowerCase();
      const titleWords = titleLower.split(/\s+/).filter((w) => w.length > 1);

      // 1차: groundingSupports에서 텍스트 매칭으로 정확한 chunk 찾기
      for (const support of groundingSupports) {
        const supportText = (support.segment?.text ?? "").toLowerCase();
        const matchCount = titleWords.filter((w) => supportText.includes(w)).length;

        if (matchCount >= 2 && support.groundingChunkIndices?.length) {
          const chunkIndex = support.groundingChunkIndices[0];
          const chunk = groundingChunks[chunkIndex];
          if (chunk?.web?.uri) {
            return {
              title: item.title,
              summary: item.summary,
              whyItMatters: item.whyItMatters,
              sourceUrl: chunk.web.uri,
              sourceHint: item.sourceHint,
            };
          }
        }
      }

      // 2차: grounding chunk title과 뉴스 title 매칭
      const matchedSource = verifiedSources.find((s) => {
        const matchCount = titleWords.filter((w) => s.title.includes(w)).length;
        return matchCount >= 2;
      });

      if (matchedSource) {
        return {
          title: item.title,
          summary: item.summary,
          whyItMatters: item.whyItMatters,
          sourceUrl: matchedSource.uri,
          sourceHint: item.sourceHint,
        };
      }

      // 3차: 매칭 실패 → Google News 검색 링크 (유저가 직접 기사를 찾을 수 있음)
      return {
        title: item.title,
        summary: item.summary,
        whyItMatters: item.whyItMatters,
        sourceUrl: `https://news.google.com/search?q=${encodeURIComponent(item.title)}&hl=ko&gl=KR`,
        sourceHint: item.sourceHint,
      };
    });
  } catch (e) {
    console.error(`JSON parse error for ${category}:`, e);
    return [];
  }
}
