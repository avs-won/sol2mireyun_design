"use client";

import { useRef } from "react";
import { useSectionMotion } from "@/drafts/v4/components/ui";
import { gsap, ScrollTrigger } from "@/drafts/v4/lib/motion";
import { resultGroups, resultTotal } from "@/content/results";

/** 숫자로 먼저 증명한다 — 실적 72건(목록 개수에서 계산) + 분야별 건수 + 흘러가는 실적 제목 */
export default function Proof() {
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, () => {
    // 스크롤 속도만큼 실적 띠가 기울어진다 (관성이 느껴지는 마퀴)
    const rows = root.current!.querySelectorAll(".proof-row");
    const skew = gsap.quickTo(rows, "skewX", { duration: 0.6, ease: "power3.out" });
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -300)),
    });
    return () => st.kill();
  });

  const stats = [
    { n: resultTotal, label: "누적 컨설팅 수행 실적", unit: "건" },
    ...resultGroups.map((g) => ({ n: g.items.length, label: g.title, unit: "건" })),
  ];

  const rowA = resultGroups.flatMap((g) => g.items).slice(0, 36);
  const rowB = resultGroups.flatMap((g) => g.items).slice(36);

  return (
    <section ref={root} className="section !pb-0" aria-labelledby="proof-title">
      <div className="wrap">
        <h2 id="proof-title" className="sr-only">
          수행 실적 요약
        </h2>
        <dl className="grid grid-cols-2 border-t border-[var(--line)] lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              className={`flex flex-col-reverse justify-end border-b border-[var(--line)] py-8 pr-4 lg:py-10 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "border-l pl-4 lg:pl-8" : ""}`}
            >
              <dt className="mt-3 text-[14px] leading-snug text-mute">{s.label}</dt>
              <dd className="flex items-baseline gap-1">
                <span className={`num text-[clamp(56px,7vw,112px)] leading-none ${i === 0 ? "gold-text" : "text-ivory"}`} data-count={s.n}>
                  {s.n}
                </span>
                <span className="text-[18px] text-mute">{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[14px] text-mute" data-reveal>
          전자 · 기계 · 화학 · 소프트웨어 등 다양한 분야에서 수행한 컨설팅 실적입니다. (기존 홈페이지 실적표 기준)
        </p>
      </div>

      <div className="marquee-mask mt-16 space-y-3 overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]" aria-hidden="true">
        {[rowA, rowB].map((row, r) => (
          <div key={r} className="proof-row">
            <div className={`marquee ${r ? "rev [--dur:80s]" : "[--dur:70s]"}`}>
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0">
                  {row.map((t, i) => (
                    <span
                      key={`${k}-${i}`}
                      className={`mx-2 whitespace-nowrap rounded-full border px-5 py-2.5 text-[15px] ${
                        (i + r) % 5 === 0 ? "border-gold/40 text-gold-2" : "border-[var(--line)] text-ivory/70"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
