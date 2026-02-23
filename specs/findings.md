# Findings & Decisions

> 기술적 발견, 중요한 결정이 있을 때마다 이 파일을 즉시 업데이트하세요.

## Research Findings

### 프로젝트 구조

- Framework: Next.js 16 (App Router)
- AI: Google Gemini 2.5 Flash + Google Search tool
- DB: PostgreSQL (Neon serverless) + Prisma 7
- Email: Resend + React Email
- Deploy: Vercel + Cron

### Gemini 뉴스 수집 패턴

- `googleSearch` 도구를 활성화하여 실시간 뉴스 검색
- 시스템 프롬프트로 JSON 배열 포맷 강제
- `groundingMetadata`에서 출처 URL 추출 (3단계 fallback)
- Temperature 0.3으로 사실 기반 응답 유도

### 출처 URL 매칭 전략

1. `groundingSupports` 텍스트 매칭 (단어 2개 이상 일치)
2. `groundingChunks` title 매칭
3. Google News 검색 링크 fallback

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| 카테고리 순차 호출 | Gemini free tier RPM 제한, 병렬 호출 불가 |
| 카테고리 description 영어 | Gemini Google Search가 영어 키워드로 더 넓은 범위 검색 |
| DigestList 동적 필터 | CATEGORIES 객체 기반으로 UI 자동 반영 |
| `html: await render(...)` 방식 | Resend `react:` 옵션이 `@react-email/render` 해석 실패 → 명시적 렌더링으로 전환 |
| Gmail 구독 제한 | Resend `onboarding@resend.dev` 테스트 도메인은 계정 이메일로만 발송 가능. 커스텀 도메인 등록 전까지 Gmail만 허용 |
| KST 날짜 유틸 | Vercel(UTC 서버)에서 `new Date().setHours(0,0,0,0)` 사용 시 KST 날짜와 불일치 → `getTodayKST()` 도입 |

## Issues Encountered

(아직 없음)

## Resources

### 핵심 파일

- Gemini 연동: `src/lib/gemini.ts`
- 다이제스트 생성: `src/lib/digest.ts`
- 카테고리 정의: `src/lib/constants.ts`
- 타입 정의: `src/types/digest.ts`
- DB 스키마: `prisma/schema.prisma`
- 크론 엔드포인트: `src/app/api/cron/generate/route.ts`
- 이메일 재발송: `src/app/api/cron/send/route.ts`

### 참고 문서

- [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- [Resend Docs](https://resend.com/docs)
- [React Email](https://react.email)
