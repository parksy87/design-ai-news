import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import {
  getAllNews,
  getLatestPeriod,
  getMonthlyIssue,
  getQuarterlyIssues,
} from "@/lib/content";
import { categories } from "@/lib/types";

export default function Home() {
  const latestPeriod = getLatestPeriod();
  const latestIssue = latestPeriod ? getMonthlyIssue(latestPeriod) : undefined;
  const latestQuarter = getQuarterlyIssues()[0];
  const allNews = getAllNews();
  const priorityNews = (latestIssue?.items ?? [])
    .filter((item) => item.priority === "high")
    .slice(0, 5);

  return (
    <>
      <section className="hero-section">
        <div className="shell hero-grid">
          <div>
            <p className="eyebrow">DESIGN · COMMERCE · AI</p>
            <h1>변화를 수집하고,<br />실무의 다음 수를 정합니다.</h1>
            <p className="hero-copy">
              상세페이지, 광고 디자인, 플랫폼 정책과 AI 도구의 실제 변화를
              원문 출처와 함께 추적합니다.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href={latestPeriod ? `/monthly/${latestPeriod}` : "/archive"}>
                최신 월간 브리핑
              </Link>
              <Link className="button button-secondary" href="/archive">전체 기록 검색</Link>
            </div>
          </div>
          <aside className="hero-note" aria-label="편집 원칙">
            <span>EDITORIAL NOTE</span>
            <strong>새로운 정보가 없으면<br />억지로 채우지 않습니다.</strong>
            <p>발표일과 확인일을 구분하고, 이전과 달라진 점이 있을 때만 기록합니다.</p>
          </aside>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LATEST MONTHLY</p>
            <h2>{latestIssue?.label ?? "최신 월간 소식"}</h2>
          </div>
          {latestPeriod && <Link href={`/monthly/${latestPeriod}`}>월간 전체 보기 →</Link>}
        </div>
        {priorityNews.length ? (
          <div className="lead-grid">
            <NewsCard item={priorityNews[0]} featured />
            <div className="card-grid compact-grid">
              {priorityNews.slice(1).map((item) => <NewsCard key={item.id} item={item} />)}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <strong>검증된 최신 소식을 준비하고 있습니다.</strong>
            <p>출처 확인이 끝난 항목만 공개됩니다.</p>
          </div>
        )}
      </section>

      {latestQuarter && (
        <section className="quarter-band">
          <div className="shell quarter-grid">
            <div>
              <p className="eyebrow">QUARTERLY SIGNAL</p>
              <h2>{latestQuarter.label}</h2>
              <p>{latestQuarter.summary}</p>
              <Link className="text-link" href={`/quarterly/${latestQuarter.period}`}>
                분기 분석 읽기 →
              </Link>
            </div>
            <ol className="priority-list">
              {latestQuarter.priorities.slice(0, 4).map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BY CATEGORY</p>
            <h2>분야별 최신 변화</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((category) => {
            const item = allNews.find((news) => news.category === category);
            return (
              <article key={category} className="category-panel">
                <span>{category}</span>
                <h3>{item?.title ?? "검증된 소식을 준비 중입니다."}</h3>
                {item ? (
                  <Link href={`/news/${item.id}`}>자세히 보기 →</Link>
                ) : (
                  <Link href="/archive">아카이브 보기 →</Link>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
