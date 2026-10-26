import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNews, getNewsItem } from "@/lib/content";
import { formatKoreanDate } from "@/lib/format";

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
        <p className="detail-summary">{item.summary}</p>
        <dl className="detail-meta">
          <div><dt>최초 발표</dt><dd>{formatKoreanDate(item.publishedAt)}</dd></div>
          <div><dt>확인 날짜</dt><dd>{formatKoreanDate(item.checkedAt)}</dd></div>
          <div><dt>확인 상태</dt><dd>{item.status === "verified" ? "출처 확인" : "시연 데이터"}</dd></div>
        </dl>
      </header>

      <div className="detail-grid">
        <div className="detail-body">
          <section>
            <p className="eyebrow">WHAT CHANGED</p>
            <h2>이전과 달라진 점</h2>
            <p>{item.changes}</p>
          </section>
          <section className="application-box">
            <p className="eyebrow">ACTION</p>
            <h2>실무 적용 방법</h2>
            <p>{item.application}</p>
          </section>
          {item.history && item.history.length > 0 && (
            <section>
              <p className="eyebrow">CHANGE HISTORY</p>
              <h2>확인 이력</h2>
              <ol className="history-list">
                {item.history.map((entry) => (
                  <li key={`${entry.date}-${entry.note}`}>
                    <time dateTime={entry.date}>{formatKoreanDate(entry.date)}</time>
                    <span>{entry.note}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
        <aside className="source-panel">
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
          <p>정책과 기능은 변경될 수 있으므로 실제 적용 직전에 원문을 다시 확인하세요.</p>
        </aside>
      </div>

      <div className="tag-list" aria-label="관련 태그">
        {item.tags.map((tag) => <span key={tag}>#{tag}</span>)}
      </div>
    </article>
  );
}
