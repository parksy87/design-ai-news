import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <strong>Design AI News</strong>
          <p>상품 상세페이지와 광고 디자인의 변화를 출처와 함께 기록합니다.</p>
        </div>
        <div className="footer-links">
          <Link href="/archive">전체 아카이브</Link>
          <a href="https://github.com/parksy87/design-ai-news" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <p className="footer-note">
          모든 항목은 원문 발표일과 확인일을 분리해 표시합니다. 최종 적용 전 원문 정책을 다시 확인하세요.
        </p>
      </div>
    </footer>
  );
}
