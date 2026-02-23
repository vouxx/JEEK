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

---

## 5-Question Reboot Check

| Question | Answer |
|----------|--------|
| 1. 현재 어느 단계인가? | 초기 구축 완료, 운영 중 |
| 2. 다음에 할 일은? | 새 기능 요청 대기 (backlog 비어있음) |
| 3. 목표는? | AI 기반 한국어 데일리 기술 뉴스레터 |
| 4. 지금까지 배운 것? | findings.md 참조 |
| 5. 완료한 작업은? | 위 세션 기록 참조 |
