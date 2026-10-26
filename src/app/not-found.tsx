import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell state-page">
      <p className="eyebrow">404 · NOT FOUND</p>
      <h1>요청한 기록을 찾을 수 없습니다.</h1>
      <p>기간이나 주소가 올바른지 확인하거나 전체 아카이브에서 다시 찾아보세요.</p>
      <Link className="button button-primary" href="/archive">아카이브로 이동</Link>
    </div>
  );
}
