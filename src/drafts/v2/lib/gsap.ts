"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
  // 모바일 주소창이 접히고 펴질 때마다 전체를 다시 계산하지 않는다
  ScrollTrigger.config({ ignoreMobileResize: true });
  // 개발 서버에서만: 콘솔에서 모션을 점검할 수 있게 노출
  if (process.env.NODE_ENV === "development") Object.assign(window, { __gsap: gsap, __ST: ScrollTrigger });
}

/** gsap.matchMedia 조건 — 섹션마다 같은 기준을 쓴다 */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  compact: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
