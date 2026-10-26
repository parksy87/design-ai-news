import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuarterlyIssue, getQuarterlyIssues } from "@/lib/content";

export function generateStaticParams() {
  return getQuarterlyIssues().map((issue) => ({ period: issue.period }));
}

export async function generateMetadata(
  { params }: PageProps<"/quarterly/[period]">,
): Promise<Metadata> {
  const { period } = await params;
  const issue = getQuarterlyIssue(period);
  return { title: issue ? `${issue.label} 트렌드` : "분기 트렌드" };
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="insight-block">
      <h2>{title}</h2>
      <ol>
        {items.map((item, index) => (
          <li key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{item}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function QuarterlyPage({ params }: PageProps<"/quarterly/[period]">) {
  const { period } = await params;
  const issue = getQuarterlyIssue(period);
  if (!issue) notFound();

  return (
    <div className="shell page-shell">
      <header className="page-hero quarter-hero">
        <div>
          <p className="eyebrow">QUARTERLY REVIEW · {period.toUpperCase()}</p>
          <h1>{issue.label}<br />트렌드 리포트</h1>
        </div>
        <div>
          <span className={`status-badge ${issue.status}`}>
            {issue.status === "in-progress" ? "진행 중인 분기" : "분기 결산"}
          </span>
          <p>{issue.summary}</p>
        </div>
      </header>

      <div className="quarter-content">
        <InsightList title="핵심 디자인 트렌드" items={issue.designTrends} />
        <InsightList title="상세페이지·광고 변화" items={issue.commerceChanges} />
        <InsightList title="AI 도구 활용 변화" items={issue.aiChanges} />
        <InsightList title="실무 적용 우선순위" items={issue.priorities} />
        <InsightList title="다음 분기 준비 사항" items={issue.nextQuarter} />
      </div>

      <section className="related-months">
        <p className="eyebrow">SOURCE MONTHS</p>
        <h2>이 분석에 포함된 월간 기록</h2>
        <div>
          {issue.months.map((month) => (
            <Link key={month} href={`/monthly/${month}`}>{month}</Link>
          ))}
        </div>
      </section>
    </div>
  );
}
