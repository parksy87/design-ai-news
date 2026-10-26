export default function Loading() {
  return (
    <div className="shell state-page" role="status" aria-live="polite">
      <div className="loading-line" />
      <div className="loading-line short" />
      <span>확인된 기록을 불러오는 중입니다.</span>
    </div>
  );
}
