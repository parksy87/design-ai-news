export const categories = [
  "정책·규정",
  "상세페이지·커머스",
  "광고 디자인",
  "시즌·프로모션",
  "AI 도구",
] as const;

export type Category = (typeof categories)[number];
export type Priority = "high" | "normal";

export type Source = {
  name: string;
  url: string;
};

export type NewsItem = {
  id: string;
  eventKey: string;
  title: string;
  category: Category;
  priority: Priority;
  publishedAt: string;
  checkedAt: string;
  status: "verified" | "sample";
  sources: Source[];
  summary: string;
  changes: string;
  application: string;
  tags: string[];
  history?: {
    date: string;
    note: string;
  }[];
};

export type MonthlyIssue = {
  period: string;
  label: string;
  checkedAt: string;
  items: NewsItem[];
};

export type QuarterlyIssue = {
  period: string;
  label: string;
  status: "complete" | "in-progress";
  months: string[];
  summary: string;
  designTrends: string[];
  commerceChanges: string[];
  aiChanges: string[];
  priorities: string[];
  nextQuarter: string[];
  relatedIds: string[];
};
