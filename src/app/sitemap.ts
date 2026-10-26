import type { MetadataRoute } from "next";
import { getAllNews, getMonthlyIssues, getQuarterlyIssues } from "@/lib/content";

const baseUrl = "https://design-ai-news.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/archive",
    ...getMonthlyIssues().map((issue) => `/monthly/${issue.period}`),
    ...getQuarterlyIssues().map((issue) => `/quarterly/${issue.period}`),
    ...getAllNews().map((item) => `/news/${item.id}`),
  ];

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-10-26"),
    changeFrequency: path === "" ? "monthly" : "yearly",
  }));
}
