import type { Metadata, Viewport } from "next";
import { Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./v4.css";
import Header from "@/drafts/v4/components/Header";
import SmoothScroll from "@/drafts/v4/components/SmoothScroll";
import DraftSwitcher from "@/components/DraftSwitcher";
import { asset, IS_DRAFT } from "@/lib/env";
import { contact, site } from "@/content/site";
import { ceo } from "@/content/ceo";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = "국제특허법률사무소 미래연 — 특허 출원부터 자금 조달까지";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title,
  description: site.description,
  applicationName: "미래연 그룹",
  keywords: ["미래연", "솔투미래연", "국제특허법률사무소 미래연", "특허", "변리사", "특허 출원", "기술이전", "기술거래", "기술사업화", "IP 금융", "특허맵", "TIPS", "정책자금"],
  alternates: { canonical: "/v4" },
  openGraph: {
    type: "website",
    siteName: "미래연 그룹",
    locale: "ko_KR",
    url: "/v4",
    title,
    description: "변리사가 직접 설계하는 특허 · 기술이전 · IP 금융. 출원부터 TIPS · 정책자금 · 투자까지 한 팀이 연결합니다.",
  },
  twitter: { card: "summary_large_image", title },
  icons: { icon: asset("/brand/logo.png"), apple: asset("/brand/logo.png") },
  ...(IS_DRAFT ? { robots: { index: false, follow: false } } : {}),
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// JS가 켜졌음을 첫 페인트 전에 표시 → 모션 초기 상태를 CSS로 숨긴다.
// 3초 안에 모션이 시작되지 않으면(스크립트 오류 등) 모든 요소를 그대로 보여 준다.
const bootScript = `(function(h){h.classList.add('js');setTimeout(function(){if(!h.classList.contains('motion-ok'))h.classList.add('js-fallback')},3000)})(document.documentElement)`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "국제특허법률사무소 미래연 (SOL2 MIREYUN)",
  alternateName: ["미래연 그룹", "㈜솔투미래연"],
  url: site.url,
  logo: `${site.url}/brand/logo.png`,
  description: site.description,
  ...(contact.masked
    ? {}
    : {
        telephone: "+82-2-558-9027",
        faxNumber: "+82-2-558-9095",
        email: contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "대치동 956-6 한림빌딩 3층",
          addressLocality: "강남구",
          addressRegion: "서울특별시",
          addressCountry: "KR",
        },
      }),
  founder: { "@type": "Person", name: ceo.name, jobTitle: ceo.role },
  areaServed: "KR",
  knowsAbout: ["특허", "지식재산 권리화", "기술이전", "기술거래", "기술사업화", "IP 금융", "특허맵"],
};

export default function V4Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        <div className="grain" aria-hidden="true" />
        <div className="scroll-progress" aria-hidden="true" />
        <Header />
        <SmoothScroll />
        {children}
        <DraftSwitcher current="v4" />
      </body>
    </html>
  );
}
