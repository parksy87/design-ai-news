"use client";

import { useMemo, useState } from "react";
import { NewsCard } from "@/components/news-card";
import { filterNews, type ArchiveItem } from "@/lib/filter";
import { categories } from "@/lib/types";

export function ArchiveExplorer({ items }: { items: ArchiveItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [year, setYear] = useState("전체");

  const years = useMemo(
    () => [...new Set(items.map((item) => item.period.slice(0, 4)))].sort().reverse(),
    [items],
  );

  const results = useMemo(
    () => filterNews(items, query, category, year),
    [items, query, category, year],
  );

  return (
    <div>
      <div className="filter-panel" role="search">
        <label className="search-field">
          <span>제목 및 키워드 검색</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: 생성형 AI, 광고 정책, 상세페이지"
            type="search"
          />
        </label>
        <label>
          <span>카테고리</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>전체</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>연도</span>
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            <option>전체</option>
            {years.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="results-line" aria-live="polite">
        <strong>{results.length}</strong>개의 확인된 변화
      </div>
      {results.length ? (
        <div className="card-grid">
          {results.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="empty-state">
          <strong>조건에 맞는 소식이 없습니다.</strong>
          <p>검색어를 줄이거나 다른 카테고리를 선택해 보세요.</p>
        </div>
      )}
    </div>
  );
}
