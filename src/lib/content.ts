import fs from "node:fs";
import path from "node:path";
import type { MonthlyIssue, NewsItem, QuarterlyIssue } from "@/lib/types";

const contentRoot = path.join(process.cwd(), "src", "content");

function readJsonFiles<T>(directory: string): T[] {
  const target = path.join(contentRoot, directory);
  if (!fs.existsSync(target)) return [];

  return fs
    .readdirSync(target)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) =>
      JSON.parse(fs.readFileSync(path.join(target, file), "utf8")) as T,
    );
}

export function getMonthlyIssues(): MonthlyIssue[] {
  return readJsonFiles<MonthlyIssue>("monthly").sort((a, b) =>
    b.period.localeCompare(a.period),
  );
}

export function getMonthlyIssue(period: string): MonthlyIssue | undefined {
  return getMonthlyIssues().find((issue) => issue.period === period);
}

export function getQuarterlyIssues(): QuarterlyIssue[] {
  return readJsonFiles<QuarterlyIssue>("quarterly").sort((a, b) =>
    b.period.localeCompare(a.period),
  );
}

export function getQuarterlyIssue(period: string): QuarterlyIssue | undefined {
  return getQuarterlyIssues().find((issue) => issue.period === period);
}

export function getAllNews(): (NewsItem & { period: string })[] {
  return getMonthlyIssues()
    .flatMap((issue) =>
      issue.items.map((item) => ({ ...item, period: issue.period })),
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNewsItem(
  id: string,
): (NewsItem & { period: string }) | undefined {
  return getAllNews().find((item) => item.id === id);
}

export function getLatestPeriod(): string | undefined {
  return getMonthlyIssues()[0]?.period;
}
