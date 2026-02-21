# JEEK Tasks

## Goal

AI 기반 한국어 데일리 기술 뉴스레터 플랫폼 운영 및 개선

## Current Phase

✅ 초기 구축 완료 — 운영 중

## Completed

- [x] Next.js 프로젝트 초기 세팅
- [x] Prisma + Neon DB 연동
- [x] Gemini AI 뉴스 수집 로직 구현
- [x] 웹 UI (홈, 아카이브, 구독 해지)
- [x] React Email 이메일 템플릿
- [x] Resend 이메일 발송
- [x] Vercel Cron 자동 생성
- [x] 카테고리 확장 (4개 → 8개)
- [x] 빈 카테고리 필터 버튼 숨김 처리
- [x] Spec-driven 워크플로우 세팅
- [x] 독립 git 저장소 분리 (zei → jeek)
- [x] Vercel 배포 (Prisma generate 빌드 수정)
- [x] 아이폰 목업 UI (상태바, 사이드 버튼, 홈 인디케이터)
- [x] 미니멀 디자인 강화 (여백, 타이포그래피, 애니메이션)
- [x] 반응형: 데스크톱 폰 목업 / 모바일 풀스크린
- [x] 헤더 네비 활성 표시 + 스크롤 숨김/표시
- [x] 페이지 전환 애니메이션 (template.tsx)
- [x] 다크모드 (클래스 기반 토글)
- [x] 구독 전용 페이지 (/subscribe)
- [x] PWA manifest + 앱 아이콘
- [x] OG 이미지 동적 생성 + Apple 아이콘
- [x] 파비콘 커스텀 (SVG)
- [x] Next.js 기본 아이콘 제거

## Backlog

> 새 기능 요청 시 여기에 추가, 스펙 작성 후 Phase로 승격

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Gemini 2.5 Flash | Google Search 내장, 한국어 성능 우수 |
| Neon PostgreSQL | Serverless, Vercel 호환 |
| 15초 간격 호출 | Gemini free tier 5 RPM 제한 |
| 카테고리 8개 확장 | 다양한 기술 분야 커버리지 |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| (아직 없음) | | |
