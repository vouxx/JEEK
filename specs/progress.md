# Progress Log

> 각 단계를 완료하거나 문제가 발생하면 업데이트하세요.

## Session 2026-02-21

### 카테고리 확장 ✅

**작업 내역**:

1. 뉴스 카테고리 4개 → 8개 확장
   - 추가: cloud-infra, security, mobile, science-tech
2. 빈 카테고리 필터 버튼 숨김 처리 (DigestList)
3. Spec-driven 워크플로우 세팅

**수정 파일**:

- `src/types/digest.ts` — Category 타입에 4개 추가
- `src/lib/constants.ts` — CATEGORIES에 4개 카테고리 정의 추가
- `src/components/DigestList.tsx` — 데이터 있는 카테고리만 필터 버튼 표시

**생성 파일**:

- `CLAUDE.md` — 프로젝트 개요 및 워크플로우 규칙
- `specs/SPEC.md` — 프로젝트 전체 스펙
- `specs/tasks.md` — 작업 계획 및 추적
- `specs/findings.md` — 기술적 발견사항
- `specs/progress.md` — 진행 기록 (이 파일)

---

## Session 2026-02-21 (2)

### 배포 및 UI 전면 리디자인 ✅

**작업 내역**:

1. git 저장소 분리 (zei/ → zeek/ 독립 저장소)
2. Vercel 배포 설정 (prisma generate 빌드 수정)
3. 아이폰 목업 UI 구현
   - 상태바 (실시간 시간, 셀룰러, 와이파이, 배터리)
   - 다이나믹 아일랜드, 사이드 버튼 (무음/볼륨/전원)
   - 홈 인디케이터 (비활성 시 1.5초 페이드아웃, 스와이프 맨 위 이동)
4. 미니멀 디자인 강화 (여백, 타이포그래피, 애니메이션)
5. 반응형: 데스크톱 폰 목업 / 모바일 풀스크린
6. 헤더: 네비 활성 표시, 스크롤 방향 감지 숨김/표시
7. 페이지 전환 fade-in 애니메이션
8. 다크모드 (클래스 기반 토글, 전체 컴포넌트 대응)
9. 구독 전용 페이지 (/subscribe) 분리
10. PWA manifest + 앱 아이콘 (SVG)
11. OG 이미지 동적 생성 + Apple 아이콘
12. 파비콘 커스텀, Next.js 기본 아이콘 제거

**주요 파일 변경**:

- `src/app/layout.tsx` — 아이폰 목업 프레임 + 반응형
- `src/app/globals.css` — 애니메이션, 다크모드 variant, 스크롤바 숨김
- `src/app/template.tsx` — 페이지 전환 애니메이션
- `src/app/subscribe/page.tsx` — 구독 전용 페이지 (신규)
- `src/app/manifest.ts` — PWA manifest (신규)
- `src/app/opengraph-image.tsx` — OG 이미지 (신규)
- `src/app/apple-icon.tsx` — Apple 아이콘 (신규)
- `src/app/icon.svg` — 파비콘 (신규)
- `src/components/StatusBar.tsx` — 아이폰 상태바 (신규)
- `src/components/HomeIndicator.tsx` — 홈 인디케이터 (신규)
- `src/components/ThemeProvider.tsx` — 다크모드 컨텍스트 (신규)
- `src/components/Header.tsx` — 활성 표시, 스크롤 숨김, 다크모드 토글
- `src/components/Footer.tsx` — 카피라이트, 다크모드
- `src/components/SubscribeForm.tsx` — 다크모드
- `src/components/DigestCard.tsx` — 다크모드
- `src/components/DigestList.tsx` — 다크모드
- `next.config.ts` — devIndicators 비활성화

---

## Session 2026-02-23

### 크론 스케줄 변경 + 평일 이메일 발송 + Gmail 제한 ✅

**작업 내역**:

1. 크론 스케줄 변경: `0 23 * * *` → `0 0 * * *` (UTC 00:00 = KST 09:00)
2. KST 날짜 계산 유틸 추가 (`getTodayKST()`) — UTC 서버에서도 KST 기준 날짜 사용
3. 평일 체크 로직 추가 — 주말(토/일)이면 이메일 발송 스킵, 콘텐츠 생성만 수행
4. `@react-email/render` 직접 의존성 추가 + `html: await render(...)` 방식으로 변경
5. 이메일 발송 전용 API 추가 (`/api/cron/send`) — 기존 다이제스트의 이메일만 재발송
6. Gmail 구독 제한 — Resend 테스트 도메인 제약으로 `@gmail.com`만 허용
7. 구독 폼 안내 문구 + placeholder 업데이트

**수정 파일**:

- `vercel.json` — 크론 스케줄 변경
- `src/lib/digest.ts` — KST 날짜 유틸 + 평일 체크 + `sendTodayDigest()` + `html` 렌더링
- `src/app/api/cron/send/route.ts` — 이메일 발송 전용 엔드포인트 (신규)
- `src/app/api/subscribe/route.ts` — Gmail 제한 + `html` 렌더링
- `src/components/SubscribeForm.tsx` — Gmail 안내 문구 + placeholder
- `specs/SPEC.md` — US-6, CON-3, FR-12, FR-15, CON-5 업데이트

### 링크 검증 + 소스 다양화 ✅

**작업 내역**:

1. grounding redirect URL → 실제 URL 리졸브 (`resolveAndVerifyUrl`) — GET + follow redirect
2. 접근 불가 URL/홈페이지 URL 자동 제외
3. 시스템 프롬프트 소스 다양화 — HN, Reddit, dev.to, GitHub, 블로그 등 명시적 포함
4. 카테고리당 7~10개 요청 (검증 탈락 대비 여유분)
5. Google News fallback 제거 — 검증된 URL 없는 아이템은 결과에서 제외
6. 아이템-chunk 매핑 개선: startIndex 기반 위치 매핑 + 텍스트 유사도 fallback 병행
7. 중복 URL 방지 (`usedUrls` Set)

**수정 파일**:

- `src/lib/gemini.ts` — 전면 리팩토링
- `specs/SPEC.md` — FR-1, FR-2, FR-5, FR-29 업데이트

---

## Session 2026-02-23 (2)

### 아카이브 월별 그룹핑 + AI 요약 ✅

**작업 내역**:

1. 아카이브 페이지 월별 그룹핑 — 플랫 날짜 리스트 → 월 단위 접기/펼치기 섹션
2. 월별 요약 통계 — 다이제스트 수, 총 아이템 수, 상위 3개 카테고리 pill
3. MonthlySummary DB 모델 추가 — Gemini AI 월간 요약 텍스트 저장
4. `generateMonthlySummary()` — 해당 월 뉴스를 Gemini로 3~4문장 요약, upsert로 갱신
5. Daily cron 연동 — 매일 다이제스트 생성 후 이번 달 요약 갱신 (force), 1일에 지난 달 확정
6. 월간 요약 수동 트리거 API (`/api/cron/monthly-summary`)

**생성 파일**:

- `src/components/MonthSection.tsx` — 월별 접기/펼치기 섹션 컴포넌트
- `src/app/api/cron/monthly-summary/route.ts` — 월간 요약 수동 생성 API

**수정 파일**:

- `prisma/schema.prisma` — MonthlySummary 모델 추가
- `src/types/digest.ts` — MonthSummary 인터페이스 추가
- `src/lib/digest.ts` — `getArchiveData()` 추가 (월별 그룹핑 + 요약 조회)
- `src/lib/gemini.ts` — `generateMonthlySummary()` 추가 (force/upsert 지원)
- `src/app/archive/page.tsx` — 월별 그룹 UI로 교체
- `src/app/api/cron/generate/route.ts` — 매일 월간 요약 갱신 연동
- `specs/SPEC.md` — US-5 갱신, FR-30~33, MonthlySummary 모델, API 엔드포인트 추가

---

## Session 2026-02-24

### 크론 분리 + 병렬 처리 + 카테고리 드롭다운 ✅

**작업 내역**:

1. 크론 스케줄 분리: 생성 (KST 00:00) + 발송 (KST 08:00) 별도 크론
2. `generateAndSendDigest` → `generateDigest` (생성 전용) 분리
3. `sendTodayDigest`에 평일 체크 로직 추가
4. Hobby 플랜 60초 타임아웃 대응: 순차 15초 대기 → 4개씩 배치 병렬 처리 + 5초 대기
5. URL 검증 병렬화 (`Promise.all`)
6. `maxDuration = 60` 설정 (크론 라우트 3개)
7. 카테고리 필터: pill 버튼 → 커스텀 드롭다운 (기본값: 전체)
8. "오늘의 다이제스트" 헤더 마진 축소

**수정 파일**:

- `vercel.json` — 크론 2개 분리 (generate + send)
- `src/lib/digest.ts` — `generateDigest` 분리, 배치 병렬, `sendTodayDigest` 평일 체크
- `src/lib/gemini.ts` — URL 검증 `Promise.all` 병렬화
- `src/app/api/cron/generate/route.ts` — `generateDigest` 호출, `maxDuration = 60`
- `src/app/api/cron/send/route.ts` — `maxDuration = 60`
- `src/app/api/cron/monthly-summary/route.ts` — `maxDuration = 60`
- `src/components/DigestList.tsx` — 커스텀 드롭다운 (바깥 클릭 닫힘, chevron 회전)
- `src/app/page.tsx` — 헤더 마진 축소

---

## Session 2026-02-25

### 크론 자동 갱신 전면 수정 — 실제 기사 URL 확보 ✅

**문제 상황**:

- 크론 48시간 미실행 (504 타임아웃)
- 실행 시 Gemini free tier 20 RPD 초과
- URL 리졸브 0% (모든 링크가 Google 검색 fallback)

**작업 내역**:

1. `maxDuration` 60 → 300 (크론 라우트 2개)
2. Gemini free tier 실제 제한 발견 (20 RPD) → 8개 개별 호출에서 1회 통합 호출로 전환
3. `@google/genai` SDK grounding metadata 누락 버그 발견 → SDK 제거, REST API `fetch()` 직접 호출
4. URL 리졸브: 302 Location 헤더 추출 방식으로 변경
5. URL 실패 시 Google 검색 링크 fallback (아이템 제외 대신)
6. 빈 다이제스트(아이템 0개) 감지 시 삭제 후 재생성 로직 추가
7. Gemini API 키 별도 Google Cloud 프로젝트에서 발급 (RPD 한도 리셋)

**결과**: 18개 아이템 중 17개 실제 기사 URL 확보 (94% 검증률)

**수정 파일**:

- `src/lib/gemini.ts` — 전면 재작성: SDK→REST API, 통합 호출, 302 URL 리졸브, fallback
- `src/lib/digest.ts` — `fetchAllNews()` 사용, 빈 다이제스트 재생성
- `src/app/api/cron/generate/route.ts` — `maxDuration` 300
- `src/app/api/cron/send/route.ts` — `maxDuration` 300, 다이제스트 없으면 자동 생성 fallback

---

## 5-Question Reboot Check

| Question | Answer |
|----------|--------|
| 1. 현재 어느 단계인가? | 초기 구축 완료, 운영 중 |
| 2. 다음에 할 일은? | 새 기능 요청 대기 (backlog 비어있음) |
| 3. 목표는? | AI 기반 한국어 데일리 기술 뉴스레터 |
| 4. 지금까지 배운 것? | findings.md 참조 |
| 5. 완료한 작업은? | 위 세션 기록 참조 |
