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

- Gemini REST API 직접 호출 (SDK 대신 `fetch()`) — `@google/genai` SDK가 grounding metadata를 누락하는 버그 존재
- `google_search` 도구 활성화 (REST API: `google_search`, SDK: `googleSearch` — 이름 다름 주의)
- 시스템 프롬프트로 JSON 배열 포맷 강제
- `groundingMetadata`에서 출처 URL 추출 (2단계 전략 + fallback)
- Temperature 0.3으로 사실 기반 응답 유도
- 전체 카테고리 1회 API 호출 (Gemini free tier 20 RPD 대응)

### 출처 URL 매칭 전략

1. `groundingSupports`의 `startIndex` 기반 위치 매핑 — 아이템의 title이 응답 텍스트에서 나타나는 위치와 support의 startIndex 비교
2. 텍스트 유사도 기반 fallback — 아이템 제목/요약의 단어가 support 텍스트에 20% 이상 일치하면 매핑
3. URL 리졸브: (a) `google.com/url?q=` 형태면 query param 직접 파싱, (b) 그 외 302 redirect chain을 최대 5 hop follow (google/vertexaisearch 도메인은 계속 추적)
4. 실패 시 DuckDuckGo !ducky fallback (`https://duckduckgo.com/?q=!ducky+...`) — 첫 검색 결과로 자동 리다이렉트

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| 전체 카테고리 1회 통합 호출 | Gemini free tier 20 RPD (일일 20회 제한) 발견 → 8개 개별 호출 불가, 1회 통합 호출로 전환 |
| 카테고리 description 영어 | Gemini Google Search가 영어 키워드로 더 넓은 범위 검색 |
| DigestList 동적 필터 | CATEGORIES 객체 기반으로 UI 자동 반영 |
| `html: await render(...)` 방식 | Resend `react:` 옵션이 `@react-email/render` 해석 실패 → 명시적 렌더링으로 전환 |
| Gmail 구독 제한 | Resend `onboarding@resend.dev` 테스트 도메인은 계정 이메일로만 발송 가능. 커스텀 도메인 등록 전까지 Gmail만 허용 |
| KST 날짜 유틸 | Vercel(UTC 서버)에서 `new Date().setHours(0,0,0,0)` 사용 시 KST 날짜와 불일치 → `getTodayKST()` 도입 |
| 월간 요약 upsert | 이번 달 요약은 매일 갱신(force=true)해야 하므로 create 대신 upsert 사용. 지난 달은 1일에 최종 확정 |
| 크론 생성/발송 분리 | 생성 KST 00:00 (웹 갱신) + 발송 KST 08:00 (이메일) 별도 실행. 생성은 매일, 발송은 평일만 |
| URL 검증 병렬화 | 전체 아이템 URL 리졸브를 `Promise.all`로 병렬 처리 → 실행 시간 대폭 단축 |
| maxDuration = 300 | Vercel Hobby 플랜에서 300초까지 설정 가능. Gemini API 응답이 2분+ 소요될 수 있으므로 300초 필요 |
| SDK → REST API 직접 호출 | `@google/genai` SDK v1.42.0이 `groundingMetadata` (groundingChunks, groundingSupports)를 응답에 포함하지 않는 버그 → REST API `fetch()` 직접 호출로 전환 |
| DuckDuckGo !ducky fallback | URL 리졸브 실패 시 Google 검색 페이지 대신 DuckDuckGo !ducky 사용 → 첫 검색 결과로 바로 리다이렉트, 사용자가 검색 페이지를 볼 일 없음 |
| 소스 범위 확장 | X/Twitter 트렌딩 + GeekNews(긱뉴스) 추가 → 개발자 커뮤니티 및 소셜 커버리지 확대 |
| 빈 다이제스트 재생성 | 이전에 빈 다이제스트(아이템 0개)가 생성되면 "이미 존재"로 스킵되는 문제 → 빈 다이제스트 감지 시 삭제 후 재생성 |
| Prisma 클라이언트 재생성 | 스키마 변경 후 `prisma db push`만으로는 클라이언트 타입이 갱신 안 됨. 반드시 `prisma generate` 실행 필요 |

## Issues Encountered

### `@google/genai` SDK grounding metadata 누락 (2026-02-25)

- **증상**: SDK로 Gemini API 호출 시 `groundingChunks: 0, groundingSupports: 0` — 모든 URL이 Google 검색 fallback으로 처리됨
- **원인**: `@google/genai` SDK v1.42.0이 REST API 응답의 `groundingMetadata` 필드를 파싱하지 않음
- **검증**: 동일 요청을 `curl`로 REST API 직접 호출하면 42개 chunks, 64개 supports 정상 반환
- **해결**: SDK 제거, `fetch()`로 REST API 직접 호출 (`callGeminiRaw()` 함수)
- **결과**: 17/18 실제 기사 URL 확보 (94% 검증률)

### Gemini free tier 실제 제한 (2026-02-25)

- **문서상**: 5 RPM (분당 5회)
- **실제**: 20 RPD (일일 20회) — 이게 실질적 병목
- **해결**: 8개 카테고리 개별 호출 → 전체 1회 통합 호출로 전환 (일 2회: 다이제스트 + 월간 요약)

### Vercel 크론 미실행 (2026-02-25)

- **증상**: 48시간 동안 크론 실행 로그 없음
- **원인**: `maxDuration=60`으로는 Gemini API 응답 대기 시간 부족 → 504 타임아웃
- **해결**: `maxDuration=300` + 통합 API 호출로 실행 시간 단축

## Resources

### 핵심 파일

- Gemini 연동: `src/lib/gemini.ts`
- 다이제스트 생성: `src/lib/digest.ts`
- 카테고리 정의: `src/lib/constants.ts`
- 타입 정의: `src/types/digest.ts`
- DB 스키마: `prisma/schema.prisma`
- 크론 엔드포인트: `src/app/api/cron/generate/route.ts`
- 이메일 재발송: `src/app/api/cron/send/route.ts`
- 월간 요약 생성: `src/app/api/cron/monthly-summary/route.ts`
- 아카이브 월별 섹션: `src/components/MonthSection.tsx`

### 참고 문서

- [Gemini REST API](https://ai.google.dev/api/generate-content) (SDK 대신 직접 호출)
- [Resend Docs](https://resend.com/docs)
- [React Email](https://react.email)
