# JEEK

AI 기반 한국어 데일리 기술 뉴스 큐레이션 서비스.

Google Gemini AI가 매일 주요 기술 뉴스를 수집/요약하고, 웹과 이메일로 전달한다.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Neon serverless) + Prisma 7
- **AI**: Google Gemini 2.5 Flash + Google Search
- **Email**: Resend + React Email
- **Deployment**: Vercel (Cron)

## Features

- 8개 기술 카테고리 뉴스 자동 수집 (AI/ML, Web Dev, Cloud/Infra, Security, Mobile, Startups, Open Source, Science/Tech)
- Gemini grounding metadata 기반 출처 URL 검증
- 카테고리별 필터링 웹 UI
- 날짜별 아카이브
- 이메일 구독/해지
- Vercel Cron 기반 일일 자동 생성 (UTC 23:00)

## Getting Started

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인.

## Environment Variables

```bash
DATABASE_URL=           # Neon PostgreSQL 연결 문자열
GEMINI_API_KEY=         # Google Gemini API 키
RESEND_API_KEY=         # Resend API 키
RESEND_FROM_EMAIL=      # 발신 이메일 (예: "JEEK <digest@jeek.dev>")
CRON_SECRET=            # 크론 인증 토큰
NEXT_PUBLIC_APP_URL=    # 앱 공개 URL
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── subscribe/       # 구독 API
│   │   ├── unsubscribe/     # 구독 해지 API
│   │   └── cron/generate/   # 다이제스트 생성 크론
│   ├── digest/[date]/       # 날짜별 다이제스트 페이지
│   ├── archive/             # 아카이브 페이지
│   ├── unsubscribe/         # 구독 해지 페이지
│   └── page.tsx             # 홈 (최신 다이제스트)
├── components/              # React 컴포넌트
├── emails/                  # React Email 템플릿
├── lib/                     # 핵심 로직 (gemini, digest, constants)
└── types/                   # TypeScript 타입
prisma/                      # DB 스키마
specs/                       # 스펙 및 계획 문서
scripts/                     # 유틸리티 스크립트
```

## Scripts

```bash
npm run dev              # 개발 서버
npm run build            # 프로덕션 빌드
npm run lint             # ESLint
node scripts/check-sources.mjs   # 수집된 출처 확인
node scripts/reset-digest.mjs    # 다이제스트 초기화
```
