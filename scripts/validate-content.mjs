import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "src", "content");
const categories = new Set([
  "정책·규정",
  "상세페이지·커머스",
  "광고 디자인",
  "시즌·프로모션",
  "AI 도구",
]);
const expectedMonths = [];
for (let year = 2025; year <= 2026; year += 1) {
  const lastMonth = year === 2026 ? 10 : 12;
  for (let month = 1; month <= lastMonth; month += 1) {
    expectedMonths.push(`${year}-${String(month).padStart(2, "0")}`);
  }
}

const monthlyDir = path.join(root, "monthly");
const files = fs.existsSync(monthlyDir)
  ? fs.readdirSync(monthlyDir).filter((file) => file.endsWith(".json"))
  : [];
const errors = [];
const ids = new Set();
const eventKeys = new Set();
let itemCount = 0;

for (const period of expectedMonths) {
  if (!files.includes(`${period}.json`)) errors.push(`월간 파일 누락: ${period}.json`);
}

for (const file of files) {
  const issue = JSON.parse(fs.readFileSync(path.join(monthlyDir, file), "utf8"));
  if (`${issue.period}.json` !== file) errors.push(`${file}: period와 파일명이 다릅니다.`);
  if (!Array.isArray(issue.items)) errors.push(`${file}: items가 배열이 아닙니다.`);
  const highCount = (issue.items ?? []).filter((item) => item.priority === "high").length;
  if (issue.items?.length >= 3 && (highCount < 3 || highCount > 5)) {
    errors.push(`${file}: 핵심 변화는 3~5건이어야 합니다. 현재 ${highCount}건`);
  }
  for (const item of issue.items ?? []) {
    itemCount += 1;
    for (const field of [
      "id", "eventKey", "title", "category", "priority", "publishedAt",
      "checkedAt", "status", "summary", "changes", "application",
    ]) {
      if (!item[field]) errors.push(`${file}: ${item.id ?? "unknown"}의 ${field} 누락`);
    }
    if (ids.has(item.id)) errors.push(`중복 id: ${item.id}`);
    ids.add(item.id);
    if (eventKeys.has(item.eventKey)) errors.push(`중복 eventKey: ${item.eventKey}`);
    eventKeys.add(item.eventKey);
    if (!categories.has(item.category)) errors.push(`${item.id}: 잘못된 category`);
    if (!item.publishedAt?.startsWith(issue.period)) {
      errors.push(`${item.id}: 발표일이 월간 period와 다릅니다.`);
    }
    if (!Array.isArray(item.sources) || item.sources.length === 0) {
      errors.push(`${item.id}: 출처가 없습니다.`);
    }
    if (!Array.isArray(item.history) || item.history.length < 2) {
      errors.push(`${item.id}: 발표·확인 이력이 없습니다.`);
    }
    for (const source of item.sources ?? []) {
      try {
        const url = new URL(source.url);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("invalid protocol");
      } catch {
        errors.push(`${item.id}: 잘못된 URL ${source.url}`);
      }
    }
  }
}

const quarterlyDir = path.join(root, "quarterly");
const quarterFiles = fs.existsSync(quarterlyDir)
  ? fs.readdirSync(quarterlyDir).filter((file) => file.endsWith(".json"))
  : [];
if (quarterFiles.length !== 8) errors.push(`분기 파일은 8개여야 합니다. 현재 ${quarterFiles.length}개`);
for (const file of quarterFiles) {
  const issue = JSON.parse(fs.readFileSync(path.join(quarterlyDir, file), "utf8"));
  if (`${issue.period}.json` !== file) errors.push(`${file}: period와 파일명이 다릅니다.`);
  for (const field of [
    "months", "designTrends", "commerceChanges", "aiChanges",
    "priorities", "nextQuarter", "relatedIds",
  ]) {
    if (!Array.isArray(issue[field]) || issue[field].length === 0) {
      errors.push(`${file}: ${field}가 비어 있습니다.`);
    }
  }
  for (const id of issue.relatedIds ?? []) {
    if (!ids.has(id)) errors.push(`${file}: 존재하지 않는 relatedId ${id}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`검증 완료: 월간 ${files.length}개, 분기 ${quarterFiles.length}개, 소식 ${itemCount}건`);
