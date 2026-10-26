# Design AI News

상품 상세페이지, 광고 디자인, 커머스 정책, AI 디자인 도구의 실제 변화를
출처·변경점·실무 적용 방법과 함께 정리하는 한국어 리서치 사이트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

## 검증

```bash
npm run validate:content
npm test
npm run lint
npm run build
```

`npm run check`는 위 검증을 순서대로 실행합니다.

## 콘텐츠 구조

- `src/content/monthly/YYYY-MM.json`: 월간 신규 변화
- `src/content/quarterly/YYYY-qN.json`: 분기 종합 분석
- `src/lib/types.ts`: 데이터 형식과 카테고리
- `scripts/validate-content.mjs`: 누락·중복·날짜·출처 검사

모든 실제 항목에는 원문 URL, 최초 발표일, 확인일이 필요합니다. 같은 사건은
`eventKey`로 통합하며 확인되지 않은 정보는 사실처럼 게시하지 않습니다.

## 배포

Next.js 기본 설정으로 Vercel에 배포합니다. 작업 브랜치는 Preview, `main`은
Production으로 연결하며 `.env*`와 `.vercel`은 커밋하지 않습니다.
