"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="shell state-page">
      <p className="eyebrow">LOAD ERROR</p>
      <h1>기록을 불러오지 못했습니다.</h1>
      <p>잠시 후 다시 시도해 주세요. 문제가 계속되면 저장소의 빌드 상태를 확인하세요.</p>
      <button className="button button-primary" onClick={reset}>다시 시도</button>
    </div>
  );
}
