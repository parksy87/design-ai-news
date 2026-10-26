import Link from "next/link";
import { formatKoreanDate } from "@/lib/format";
import type { NewsItem } from "@/lib/types";

type Props = {
  item: NewsItem & { period?: string };
  featured?: boolean;
};

export function NewsCard({ item, featured = false }: Props) {
  return (
    <article className={`news-card${featured ? " news-card-featured" : ""}`}>
      <div className="card-meta">
        <span className="category-pill">{item.category}</span>
        {item.priority === "high" && <span className="priority-label">핵심 변화</span>}
      </div>
      <h3>
        <Link href={`/news/${item.id}`}>{item.title}</Link>
      </h3>
      <p className="card-summary">{item.summary}</p>
      <dl className="card-details">
        <div>
          <dt>발표</dt>
          <dd>{formatKoreanDate(item.publishedAt)}</dd>
        </div>
        <div>
          <dt>출처</dt>
          <dd>{item.sources.map((source) => source.name).join(" · ")}</dd>
        </div>
      </dl>
      <div className="card-action">
        <Link href={`/news/${item.id}`}>변경점과 적용 방법 보기 <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
