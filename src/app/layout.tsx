import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://design-ai-news.vercel.app"),
  title: {
    default: "Design AI News — 상세페이지·광고 디자인 리서치",
    template: "%s | Design AI News",
  },
  description:
    "상품 상세페이지, 광고 디자인, 커머스 정책과 AI 도구의 변화를 출처·변경점·실무 적용 방법과 함께 정리합니다.",
  openGraph: {
    title: "Design AI News",
    description: "디자인과 커머스 실무자를 위한 검증된 변화 기록",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
