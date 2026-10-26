import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news-card";
import { getMonthlyIssue, getMonthlyIssues } from "@/lib/content";
import { categories } from "@/lib/types";

export function generateStaticParams() {
  return getMonthlyIssues().map((issue) => ({ period: issue.period }));
}

export async function generateMetadata(
  { params }: PageProps<"/monthly/[period]">,
): Promise<Metadata> {
  const { period } = await params;
  const issue = getMonthlyIssue(period);
  return { title: issue ? `${issue.label} 월간 소식` : "월간 소식" };
}

export default async function MonthlyPage({ params }: PageProps<"/monthly/[period]">) {
  const { period } = await params;
  const issue = getMonthlyIssue(period);
  if (!issue) notFound();

  const allIssues = getMonthlyIssues();
  const index = allIssues.findIndex((item) => item.period === period);
  const newer = allIssues[index - 1];
  const older = allIssues[index + 1];
  const priority = issue.items.filter((item) => item.priority === "high");

  return (
    <div className="shell page-shell">
      <header className="page-hero">
        <p className="eyebrow">MONTHLY BRIEFING · {period}</p>
        <h1>{issue.label}<br />디자인·커머스 변화</h1>
        <p>
          이달에 새롭게 확인된 변화 {issue.items.length}건입니다.
          핵심 {priority.length}건을 먼저 배치했으며 모든 항목에 원문 출처를 표시합니다.
        </p>
        <div className="issue-meta">
          <span>확인일 {issue.checkedAt}</span>
          <span>검증된 항목 {issue.items.length}</span>
        </div>
      </header>

      <section className="section section-tight">
        <div className="section-heading">
          <h2>이번 달 핵심 변화</h2>
        </div>
        <div className="card-grid">
          {priority.map((item) => <NewsCard key={item.id} item={item} featured />)}
        </div>
      </section>

      {categories.map((category) => {
        const items = issue.items.filter((item) => item.category === category);
        if (!items.length) return null;
        return (
          <section className="section section-tight" key={category}>
            <div className="section-heading">
              <h2>{category}</h2>
              <span>{items.length}건</span>
            </div>
            <div className="card-grid">
              {items.map((item) => <NewsCard key={item.id} item={item} />)}
            </div>
          </section>
        );
      })}

      <nav className="period-nav" aria-label="월간 이동">
        {older ? <Link href={`/monthly/${older.period}`}>← {older.label}</Link> : <span />}
        {newer ? <Link href={`/monthly/${newer.period}`}>{newer.label} →</Link> : <span />}
      </nav>
    </div>
  );
}
