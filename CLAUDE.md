# JEEK - AI/Tech Daily Newsletter

## Project Overview

Gemini AI + Google Search를 활용한 한국어 기술 뉴스 큐레이션 및 이메일 뉴스레터 플랫폼.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Neon serverless) + Prisma 7
- **AI**: Google Gemini 2.5 Flash
- **Email**: Resend + React Email
- **Deployment**: Vercel (Cron)

## Development Workflow: Spec-Driven + File-Based Planning

### 규칙

1. **Spec First**: 기능 추가/변경 시 반드시 `specs/` 디렉토리에 스펙을 먼저 작성
2. **승인 후 구현**: 스펙을 사용자에게 보여주고 승인받은 후에만 구현 시작
3. **Planning Files**: 복잡한 작업은 3-file pattern으로 진행 추적

### 파일 구조

```
specs/
  SPEC.md              # 프로젝트 전체 스펙 (현재 상태 반영)
  tasks.md             # 작업 계획 및 추적
  findings.md          # 기술적 발견사항 및 결정
  progress.md          # 세션별 작업 내역
```

### 작업 흐름

1. 사용자가 기능 요청
2. `specs/SPEC.md` 업데이트 (새 기능 스펙 추가)
3. 사용자 승인
4. `specs/tasks.md`에 작업 계획 작성
5. 구현하면서 `specs/findings.md`, `specs/progress.md` 업데이트
6. 완료 후 `specs/SPEC.md` 최종 반영

### 스펙 작성 원칙

- **What(무엇을)** 만들지 정의, How(어떻게)는 plan에서
- 사용자 시나리오 + 수용 기준(Given/When/Then) 포함
- 기능 요구사항은 MUST/SHOULD로 구분
- 제약사항과 성공 기준 명시

## Commands

```bash
npm run dev          # 로컬 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
```

## Key Directories

- `src/app/` - Next.js App Router 페이지 및 API 라우트
- `src/components/` - React 컴포넌트
- `src/lib/` - 핵심 비즈니스 로직 (gemini, digest, constants)
- `src/emails/` - React Email 템플릿
- `src/types/` - TypeScript 타입 정의
- `prisma/` - 데이터베이스 스키마
- `specs/` - 스펙 및 계획 문서
