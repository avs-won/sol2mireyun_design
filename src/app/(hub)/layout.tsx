import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./hub.css";
import { asset } from "@/lib/env";
import { site } from "@/content/site";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-instrument", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title: "미래연 홈페이지 리뉴얼 — 디자인 시안",
  description: "국제특허법률사무소 미래연 홈페이지 리뉴얼 디자인 시안 모음 (검토용)",
  // 시안 목록은 검토용이므로 검색엔진에 노출하지 않는다
  robots: { index: false, follow: false },
  icons: { icon: asset("/brand/logo.png") },
};

export const viewport: Viewport = { themeColor: "#080b12", width: "device-width", initialScale: 1 };

export default function HubLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={serif.variable}>
      <body>{children}</body>
    </html>
  );
}
