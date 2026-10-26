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
