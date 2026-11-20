import type { Metadata, Viewport } from "next";
import { EB_Garamond, Noto_Serif_KR } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./v3.css";
import Header from "@/drafts/v3/components/Header";
import Reveal from "@/drafts/v3/components/Reveal";
import DraftSwitcher from "@/components/DraftSwitcher";
import { asset, IS_DRAFT } from "@/lib/env";
import { contact, site } from "@/content/site";
import { ceo } from "@/content/ceo";

const serifKr = Noto_Serif_KR({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  preload: false,
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const title = "미래연 그룹 — 무기가 되는 특허, 돈이 되는 기술";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title,
  description: site.description,
  applicationName: "미래연 그룹",
  keywords: ["미래연", "솔투미래연", "국제특허법률사무소 미래연", "특허", "변리사", "기술이전", "기술거래", "기술사업화", "IP 금융", "특허맵", "TIPS", "정책자금"],
  alternates: { canonical: "/v3" },
  openGraph: {
    type: "website",
    siteName: "미래연 그룹",
    locale: "ko_KR",
    url: "/v3",
    title,
    description: "IP 금융 전문기관 미래연이 특허를 설계하고, TIPS·정책자금·투자까지 연결합니다.",
  },
  twitter: { card: "summary_large_image", title },
  icons: { icon: asset("/brand/logo.png"), apple: asset("/brand/logo.png") },
  ...(IS_DRAFT ? { robots: { index: false, follow: false } } : {}),
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

// JS가 켜졌음을 첫 페인트 전에 표시 → 진입 모션의 초기 상태를 CSS로 숨긴다.
// 4초 안에 관찰자가 붙지 않으면 숨김을 해제한다.
const bootScript = `(function(h){h.classList.add('js');setTimeout(function(){if(!h.classList.contains('reveal-on'))h.classList.add('reveal-off')},4000)})(document.documentElement)`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "미래연 그룹 (SOL2 MIREYUN)",
  alternateName: ["국제특허법률사무소 미래연", "㈜솔투미래연"],
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${serifKr.variable} ${garamond.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] bg-fg px-4 py-3 text-bg">
          본문으로 건너뛰기
        </a>
        <Header />
        {children}
        <Reveal />
        <DraftSwitcher current="v3" />
      </body>
    </html>
  );
}
