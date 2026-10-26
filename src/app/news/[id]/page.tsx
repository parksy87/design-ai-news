import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { getAllNews, getNewsItem } from "@/lib/content";
import { formatKoreanDate } from "@/lib/format";
import type { Category } from "@/lib/types";

const categoryGuides: Record<
  Category,
  { lens: string; checks: string[] }
> = {
  "정책·규정": {
    lens:
      "표현 가능 범위만 확인하지 말고 적용 국가, 시행 시점, 예외 조건과 내부 승인 절차가 함께 바뀌는지 살펴봐야 합니다.",
    checks: [
      "원문에서 적용 국가·대상·시행일을 다시 확인합니다.",
      "현재 사용 중인 문구와 이미지가 새 기준에 걸리는지 목록으로 점검합니다.",
      "기획·디자인·광고 운영자가 같은 검수 기준을 사용하도록 기록합니다.",
    ],
  },
  "상세페이지·커머스": {
    lens:
      "새 기능 자체보다 정보 구조, 상품 탐색, 모바일 구매 동선과 운영 효율에 어떤 차이를 만드는지가 핵심입니다.",
    checks: [
      "홈·목록·상세·장바구니에서 동일한 정보가 일관되게 보이는지 확인합니다.",
      "모바일 첫 화면과 결제 직전 단계에서 이탈 요소가 생기지 않는지 점검합니다.",
      "실제 상품 데이터와 긴 상품명, 품절·할인 상태로 화면을 검수합니다.",
    ],
  },
  "광고 디자인": {
    lens:
      "메시지 우선순위, 플랫폼별 화면 비율, 제품 노출 방식과 성과 측정 기준을 하나의 제작 조건으로 다뤄야 합니다.",
    checks: [
      "첫 화면에서 브랜드·제품·핵심 효익이 구분되는지 확인합니다.",
      "플랫폼별 비율과 안전 영역에서 로고와 문구가 잘리지 않는지 점검합니다.",
      "원본과 변경 소재를 분리해 클릭 이후 전환까지 비교합니다.",
    ],
  },
  "시즌·프로모션": {
    lens:
      "행사 비주얼보다 준비 시점, 가격 표현, 재고·배송 마감과 채널별 교체 일정이 실제 성과를 좌우합니다.",
    checks: [
      "행사 시작·종료와 배송 마감 기준으로 역산한 제작 일정을 만듭니다.",
      "할인율·가격·혜택 조건이 랜딩페이지와 동일한지 확인합니다.",
      "품절과 행사 종료 시 교체할 대체 소재를 함께 준비합니다.",
    ],
  },
  "AI 도구": {
    lens:
      "제작 시간 단축만이 아니라 결과의 재현성, 제품 사실성, 권리 관계와 사람이 최종 승인할 지점을 함께 설계해야 합니다.",
    checks: [
      "제품 형태·로고·한글·인물 표현의 왜곡을 확대해 검수합니다.",
      "상업 이용 조건과 저작권·초상권·AI 표시 의무를 확인합니다.",
      "프롬프트, 원본과 수정 이력을 남겨 결과를 재현할 수 있게 합니다.",
    ],
  },
};

export function generateStaticParams() {
  return getAllNews().map((item) => ({ id: item.id }));
}

export async function generateMetadata(
  { params }: PageProps<"/news/[id]">,
): Promise<Metadata> {
  const { id } = await params;
  const item = getNewsItem(id);
  return {
    title: item?.title ?? "소식",
    description: item?.summary,
  };
}

export default async function NewsDetailPage({ params }: PageProps<"/news/[id]">) {
  const { id } = await params;
  const item = getNewsItem(id);
  if (!item) notFound();
  const guide = categoryGuides[item.category];
  const relatedItems = getAllNews()
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => ({
      item: candidate,
      score:
        (candidate.category === item.category ? 3 : 0) +
        candidate.tags.filter((tag) => item.tags.includes(tag)).length * 2,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.item.publishedAt.localeCompare(a.item.publishedAt),
    )
    .slice(0, 3)
    .map(({ item: relatedItem }) => relatedItem);

  return (
    <article className="shell detail-shell">
      <nav className="breadcrumb" aria-label="현재 위치">
        <Link href="/">홈</Link><span>/</span>
        <Link href={`/monthly/${item.period}`}>{item.period}</Link><span>/</span>
        <span>{item.category}</span>
      </nav>
      <header className="detail-header">
        <div className="card-meta">
          <span className="category-pill">{item.category}</span>
          {item.priority === "high" && <span className="priority-label">핵심 변화</span>}
        </div>
        <h1>{item.title}</h1>
        <p className="detail-summary">발표 내용과 이전 대비 변화, 실무 적용 포인트를 한 번에 확인하는 리서치 브리프입니다.</p>
      </header>

      <section className="detail-overview" id="summary" aria-labelledby="summary-title">
        <div className="detail-section-label">
          <span>00</span>
          <p>AT A GLANCE</p>
        </div>
        <div>
          <h2 id="summary-title">핵심 내용</h2>
          <p className="overview-copy">{item.summary}</p>
        </div>
        <dl className="detail-meta">
          <div><dt>최초 발표</dt><dd>{formatKoreanDate(item.publishedAt)}</dd></div>
          <div><dt>확인 날짜</dt><dd>{formatKoreanDate(item.checkedAt)}</dd></div>
          <div><dt>확인 상태</dt><dd>{item.status === "verified" ? "출처 확인" : "시연 데이터"}</dd></div>
          <div><dt>원문</dt><dd>{item.sources.length}개 출처</dd></div>
        </dl>
      </section>

      <div className="detail-layout">
        <nav className="detail-toc" aria-label="상세 내용 목차">
          <p>이 페이지에서</p>
          <a href="#summary">핵심 내용</a>
          <a href="#changed">달라진 점</a>
          <a href="#interpretation">디자인 관점</a>
          <a href="#action">실무 적용</a>
          {item.history && item.history.length > 0 && <a href="#history">확인 이력</a>}
          <a href="#sources">원문 출처</a>
        </nav>

        <div className="detail-body">
          <section id="changed" className="numbered-section">
            <div className="detail-section-label">
              <span>01</span>
              <p>WHAT CHANGED</p>
            </div>
            <div>
              <h2>이전과 달라진 점</h2>
              <p>{item.changes}</p>
            </div>
          </section>

          <section id="interpretation" className="numbered-section interpretation-box">
            <div className="detail-section-label">
              <span>02</span>
              <p>DESIGN LENS</p>
            </div>
            <div>
              <h2>디자이너가 볼 지점</h2>
              <p>{guide.lens}</p>
              <span className="editorial-label">편집 해석 · {item.category}</span>
            </div>
          </section>

          <section id="action" className="numbered-section application-box">
            <div className="detail-section-label">
              <span>03</span>
              <p>ACTION</p>
            </div>
            <div>
              <h2>실무 적용 방법</h2>
              <p className="action-lead">{item.application}</p>
              <h3>적용 전 체크리스트</h3>
              <ol className="action-checklist">
                {guide.checks.map((check, index) => (
                  <li key={check}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{check}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {item.history && item.history.length > 0 && (
            <section id="history" className="numbered-section">
              <div className="detail-section-label">
                <span>04</span>
                <p>CHANGE LOG</p>
              </div>
              <div>
                <h2>확인 이력</h2>
                <ol className="history-list">
                  {item.history.map((entry) => (
                    <li key={`${entry.date}-${entry.note}`}>
                      <time dateTime={entry.date}>{formatKoreanDate(entry.date)}</time>
                      <span>{entry.note}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}
        </div>

        <aside className="source-panel" id="sources">
          <p className="eyebrow">PRIMARY SOURCES</p>
          <h2>원문 출처</h2>
          <ul>
            {item.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  <span>{source.name}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="source-note">정책과 기능은 변경될 수 있으므로 실제 적용 직전에 원문을 다시 확인하세요.</p>
          <div className="source-tags" aria-label="관련 태그">
            {item.tags.map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
        </aside>
      </div>

      {relatedItems.length > 0 && (
        <section className="related-news">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RELATED RESEARCH</p>
              <h2>함께 볼 기록</h2>
            </div>
            <Link href="/archive">전체 기록 보기 →</Link>
          </div>
          <div className="card-grid">
            {relatedItems.map((relatedItem) => (
              <NewsCard key={relatedItem.id} item={relatedItem} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
