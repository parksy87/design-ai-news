import Link from "next/link";

const navigation = [
  { href: "/", label: "최신 소식" },
  { href: "/archive", label: "전체 아카이브" },
  { href: "/monthly/2026-10", label: "월간" },
  { href: "/quarterly/2026-q4", label: "분기 트렌드" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Design AI News 홈">
          <span className="brand-mark" aria-hidden="true">D/A</span>
          <span>Design AI News</span>
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
