// 시안마다 루트 레이아웃이 달라서, 어떤 경로에도 맞지 않는 주소는 이 페이지가 받는다.
import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./(hub)/hub.css";
import { asset } from "@/lib/env";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title: "페이지를 찾을 수 없습니다 — 미래연",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <body>
        <main className="grid min-h-[100svh] place-items-center px-5 text-center">
          <div>
            <p className="font-mono text-[13px] tracking-[0.2em] text-gold">404</p>
            <h1 className="mt-4 text-[clamp(28px,4vw,48px)] font-extrabold tracking-[-0.04em]">페이지를 찾을 수 없습니다.</h1>
            <p className="mt-3 text-mute">주소가 바뀌었거나 없는 페이지입니다.</p>
            <a href={asset("/")} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-gold px-6 font-bold text-ink">
              시안 목록으로
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
