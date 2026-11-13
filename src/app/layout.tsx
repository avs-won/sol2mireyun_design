import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import Header from "@/components/layout/Header";
import SmoothScroll from "@/components/layout/SmoothScroll";
import DraftNav from "@/components/layout/DraftNav";
import PaletteSwitch from "@/components/layout/PaletteSwitch";
import { asset, IS_DRAFT, SHOW_PALETTES } from "@/lib/env";
import { contact, site } from "@/content/site";
import { ceo } from "@/content/ceo";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = "미래연 그룹 — 무기가 되는 특허, 돈이 되는 기술";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title,
  description: site.description,
  applicationName: "미래연 그룹",
  keywords: ["미래연", "솔투미래연", "국제특허법률사무소 미래연", "특허", "변리사", "기술이전", "기술거래", "기술사업화", "IP 금융", "특허맵", "TIPS", "정책자금"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "미래연 그룹",
    locale: "ko_KR",
    url: "/",
    title,
    description: "IP 금융 전문기관 미래연이 특허를 설계하고, TIPS·정책자금·투자까지 연결합니다.",
  },
  twitter: { card: "summary_large_image", title },
  icons: { icon: asset("/brand/logo.png"), apple: asset("/brand/logo.png") },
  // 시안 공유 빌드는 검색엔진에 노출하지 않는다
  ...(IS_DRAFT ? { robots: { index: false, follow: false } } : {}),
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0c1322",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// JS가 켜졌음을 첫 페인트 전에 표시 → 모션 초기 상태를 CSS로 숨길 수 있다.
// 4초 안에 모션이 시작되지 않으면 모든 요소를 그대로 보여 준다.
const bootScript = `(function(d){var h=d.documentElement;h.classList.add('js');setTimeout(function(){if(!h.classList.contains('motion-ok'))h.classList.add('js-fallback')},4000)})(document)`;

// 검토 옵션을 첫 페인트 전에 <html> 에 옮긴다 (깜빡임 방지)
//  ?palette=a|b|c → data-palette (색 시안) · ?snap=0 → data-snap="off" (섹션 맞춤 끄기)
const paletteScript = `(function(){try{var s=new URLSearchParams(location.search),h=document.documentElement,p=s.get('palette');if(p&&/^[abc]$/.test(p))h.dataset.palette=p;if(s.get('snap')==='0')h.dataset.snap='off'}catch(e){}})()`;

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {SHOW_PALETTES && <script dangerouslySetInnerHTML={{ __html: paletteScript }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded bg-paper px-4 py-2 text-ink">
          본문으로 건너뛰기
        </a>
        <Header />
        <SmoothScroll />
        {children}
        <DraftNav />
        {SHOW_PALETTES && <PaletteSwitch />}
      </body>
    </html>
  );
}
