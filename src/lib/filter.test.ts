import assert from "node:assert/strict";
import test from "node:test";
import { filterNews, type ArchiveItem } from "./filter.ts";

const base: ArchiveItem = {
  id: "one",
  eventKey: "one",
  title: "생성형 AI 광고 기능",
  category: "AI 도구",
  priority: "high",
  publishedAt: "2026-10-01",
  checkedAt: "2026-10-26",
  status: "verified",
  sources: [{ name: "공식", url: "https://example.com" }],
  summary: "광고 제작 기능이 추가됐다.",
  changes: "이미지 제작 단계가 줄었다.",
  application: "시안을 빠르게 비교한다.",
  tags: ["생성형AI"],
  period: "2026-10",
};

test("키워드는 제목과 실무 적용 문장에서 검색된다", () => {
  assert.equal(filterNews([base], "생성형", "전체", "전체").length, 1);
  assert.equal(filterNews([base], "비교", "전체", "전체").length, 1);
});

test("카테고리와 연도를 함께 필터링한다", () => {
  assert.equal(filterNews([base], "", "AI 도구", "2026").length, 1);
  assert.equal(filterNews([base], "", "정책·규정", "2026").length, 0);
  assert.equal(filterNews([base], "", "AI 도구", "2025").length, 0);
});
