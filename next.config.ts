import type { NextConfig } from "next";

// DEPLOY_TARGET=pages 일 때는 GitHub Pages용 정적 파일(out/)로 내보낸다.
// 실행은 scripts/build-pages.mjs 가 담당한다. 평소 개발 · 정식 배포에는 영향 없음.
const pages = process.env.DEPLOY_TARGET === "pages";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// 이 사이트는 데이터 캐싱 기능을 쓰지 않는 완전 정적 페이지라 Cache Components는 끈다.
// (켜 두면 정적 내보내기에서 robots · sitemap 을 정적으로 지정할 수 없다)
const nextConfig: NextConfig = {
  ...(pages
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
