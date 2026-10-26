import fs from "node:fs";
import path from "node:path";

const monthly = path.join(process.cwd(), "src", "content", "monthly");
const urls = new Set();
for (const file of fs.readdirSync(monthly).filter((name) => name.endsWith(".json"))) {
  const issue = JSON.parse(fs.readFileSync(path.join(monthly, file), "utf8"));
  for (const item of issue.items) {
    for (const source of item.sources) urls.add(source.url);
  }
}

const queue = [...urls];
const failures = [];
let checked = 0;

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "DesignAINewsLinkChecker/1.0" },
    });
    if (response.status >= 400 && ![401, 403, 429].includes(response.status)) {
      failures.push({ url, status: response.status });
    }
  } catch (error) {
    failures.push({ url, status: error.name === "AbortError" ? "timeout" : "network" });
  } finally {
    clearTimeout(timer);
    checked += 1;
  }
}

async function worker() {
  while (queue.length) {
    const url = queue.shift();
    if (url) await check(url);
  }
}

await Promise.all(Array.from({ length: 10 }, () => worker()));
console.log(`출처 링크 확인: ${checked}개`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
