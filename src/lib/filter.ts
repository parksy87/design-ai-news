import type { NewsItem } from "@/lib/types";

export type ArchiveItem = NewsItem & { period: string };

export function filterNews(
  items: ArchiveItem[],
  query: string,
  category: string,
  year: string,
): ArchiveItem[] {
  const normalized = query.trim().toLocaleLowerCase("ko-KR");
  return items.filter((item) => {
    const matchesCategory = category === "전체" || item.category === category;
    const matchesYear = year === "전체" || item.period.startsWith(year);
    const haystack = [
      item.title,
      item.summary,
      item.changes,
      item.application,
      ...item.tags,
    ]
      .join(" ")
      .toLocaleLowerCase("ko-KR");
    return matchesCategory && matchesYear && (!normalized || haystack.includes(normalized));
  });
}
