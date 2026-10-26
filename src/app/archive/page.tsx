import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveExplorer } from "@/components/archive-explorer";
import { getAllNews, getMonthlyIssues, getQuarterlyIssues } from "@/lib/content";

export const metadata: Metadata = {
  title: "전체 아카이브",
  description: "연도, 카테고리, 키워드로 검증된 디자인·커머스 변화를 검색합니다.",
};

export default function ArchivePage() {
  const news = getAllNews();
  const months = getMonthlyIssues();
  const quarters = getQuarterlyIssues();

  return (
    <div className="shell page-shell">
      <header className="page-hero archive-hero">
        <p className="eyebrow">FULL ARCHIVE</p>
        <h1>확인된 변화의<br />전체 기록</h1>
        <p>제목과 실무 키워드로 검색하고 카테고리와 연도를 조합해 필요한 기록을 찾으세요.</p>
        <div className="issue-meta">
          <span>월간 {months.length}개</span>
          <span>분기 분석 {quarters.length}개</span>
          <span>검증 항목 {news.length}건</span>
        </div>
      </header>

      <section className="archive-periods">
        <div>
          <h2>월별 페이지</h2>
          <div className="period-chips">
            {months.map((issue) => (
              <Link key={issue.period} href={`/monthly/${issue.period}`}>{issue.period}</Link>
            ))}
          </div>
        </div>
        <div>
          <h2>분기별 페이지</h2>
          <div className="period-chips">
            {quarters.map((issue) => (
              <Link key={issue.period} href={`/quarterly/${issue.period}`}>
                {issue.period.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <ArchiveExplorer items={news} />
      </section>
    </div>
  );
}
