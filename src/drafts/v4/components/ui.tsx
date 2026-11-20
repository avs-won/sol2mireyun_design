"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MQ } from "@/drafts/v4/lib/motion";

/**
 * 섹션 공통 진입 모션.
 * - [data-split]  : 제목을 줄 단위로 마스크 밖에서 올린다
 * - [data-reveal] : 아래에서 떠오르며 나타난다 (같은 줄은 순서대로)
 * - [data-count]  : 숫자가 0부터 굴러 올라간다
 * - [data-draw]   : SVG 선이 그려진다 (pathLength=1 필요)
 */
export function useSectionMotion(scope: RefObject<HTMLElement | null>, extra?: () => void | (() => void)) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = scope.current!;
        const splits: SplitText[] = [];
        el.querySelectorAll<HTMLElement>("[data-split]").forEach((h) => {
          const s = SplitText.create(h, { type: "lines", mask: "lines" });
          splits.push(s);
          gsap.set(h, { visibility: "visible" });
          gsap.from(s.lines, {
            yPercent: 110,
            rotate: 2,
            duration: 1.3,
            stagger: 0.08,
            scrollTrigger: { trigger: h, start: "top 85%", once: true },
          });
        });

        ScrollTrigger.batch(el.querySelectorAll("[data-reveal]"), {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(batch, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, overwrite: true }),
        });

        el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
          const to = Number(n.dataset.count);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: to,
            duration: 2.2,
            ease: "power3.out",
            scrollTrigger: { trigger: n, start: "top 88%", once: true },
            onUpdate: () => {
              n.textContent = String(Math.round(obj.v));
            },
          });
        });

        el.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((p) => {
          gsap.fromTo(
            p,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.8, ease: "expo.inOut", scrollTrigger: { trigger: p, start: "top 85%", once: true } },
          );
        });

        const cleanup = extra?.();
        return () => {
          splits.forEach((s) => s.revert());
          if (typeof cleanup === "function") cleanup();
        };
      });
    },
    { scope },
  );
}

export function SectionHead({
  no,
  eyebrow,
  title,
  lead,
  id,
  className = "",
}: {
  no: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <header className={`grid gap-6 lg:grid-cols-12 lg:gap-10 ${className}`}>
      <div className="lg:col-span-7">
        <p className="eyebrow" data-reveal>
          <span className="text-mute">{no}</span> {eyebrow}
        </p>
        <h2 id={id} data-split className="h-section mt-6">
          {title}
        </h2>
      </div>
      {lead && (
        <p className="lead self-end lg:col-span-5 lg:pb-3" data-reveal>
          {lead}
        </p>
      )}
    </header>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
