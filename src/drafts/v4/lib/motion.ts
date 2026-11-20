"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  // 개발 서버에서만: 창이 숨겨져 rAF가 멈췄을 때 콘솔에서 직접 프레임을 돌려 점검한다
  if (process.env.NODE_ENV === "development") Object.assign(window, { __gsap: gsap, __ST: ScrollTrigger });
}

/** gsap.matchMedia 조건 — 섹션마다 같은 기준을 쓴다 */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  compact: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
} as const;

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
