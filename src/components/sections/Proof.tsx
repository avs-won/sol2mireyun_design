"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SpecMark } from "@/components/ui/Spec";
import { resultGroups, resultTotal, resultFields } from "@/content/results";

type Filter = "all" | (typeof resultGroups)[number]["key"];
const COLLAPSED = 14;

/** 숫자가 굴러 멈추는 계수기. SSR에서는 최종 숫자 위치로 렌더된다. */
function Odometer({ value, className = "" }: { value: number; className?: string }) {
  const digits = String(value).split("");
  return (
    <span className={`odo inline-flex ${className}`} aria-label={String(value)} role="img">
      {digits.map((d, i) => (
        <span key={i} className="odo-col relative inline-block h-[1em] overflow-hidden" aria-hidden="true">
          <span className="odo-strip block" data-d={d} style={{ transform: `translateY(${-(10 + Number(d)) * 5}%)` }}>
            {Array.from({ length: 20 }, (_, k) => (
              <span key={k} className="block h-[1em] leading-none">
                {k % 10}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Proof() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const prevView = useRef("all|false");

  const rows = useMemo(() => {
    const groups = filter === "all" ? resultGroups : resultGroups.filter((g) => g.key === filter);
    let n = 0;
    return groups.flatMap((g) => g.items.map((t) => ({ id: `${g.key}-${n}`, no: ++n, group: g.short, key: g.key, title: t })));
  }, [filter]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(q(".pf-head .mask-line > span"), { y: 0, duration: 1.15, stagger: 0.08, scrollTrigger: { trigger: q(".pf-head")[0], start: "top 80%" } });
        gsap.to(q(".pf-head [data-a='rise']"), { opacity: 1, y: 0, duration: 1, stagger: 0.07, scrollTrigger: { trigger: q(".pf-head")[0], start: "top 80%" } });

        // 계수기: 0에서 출발해 한 바퀴 돈 뒤 멈춘다
        q(".odo-strip").forEach((s) => gsap.set(s, { y: 0, yPercent: 0 }));
        gsap.to(q(".odo-strip"), {
          yPercent: (_i: number, t: HTMLElement) => -(10 + Number(t.dataset.d)) * 5,
          duration: 2.2,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: q(".pf-counts")[0], start: "top 82%" },
        });
        gsap.to(q(".pf-count-rule"), { scaleX: 1, duration: 1.2, ease: "expo.inOut", stagger: 0.1, scrollTrigger: { trigger: q(".pf-counts")[0], start: "top 85%" } });

        // 대장: 주사선이 위에서 아래로 지나가며 행을 밝힌다
        const list = q(".pf-list")[0];
        const scanRows = q(".pf-row");
        gsap.set(scanRows, { opacity: 0.12 });
        gsap
          .timeline({ scrollTrigger: { trigger: list, start: "top 75%" } })
          .fromTo(q(".pf-scan"), { top: "0%", opacity: 1 }, { top: "100%", duration: 1.6, ease: "power1.inOut" })
          .to(scanRows, { opacity: 1, duration: 0.3, stagger: 1.4 / Math.max(scanRows.length, 1) }, 0.05)
          .to(q(".pf-scan"), { opacity: 0, duration: 0.3 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /* 필터 · 펼치기 후 새 행 등장 */
  useEffect(() => {
    const view = `${filter}|${expanded}`;
    if (prevView.current === view) return;
    prevView.current = view;
    if (window.matchMedia(MQ.reduce).matches) return;
    const fresh = root.current?.querySelectorAll(".pf-row:not([data-seen])");
    if (!fresh?.length) return;
    gsap.fromTo(fresh, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.6, ease: "expo.out", stagger: 0.015 });
  }, [filter, expanded]);

  useEffect(() => {
    root.current?.querySelectorAll(".pf-row").forEach((r) => r.setAttribute("data-seen", ""));
  });

  const tabs: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "전체", n: resultTotal },
    ...resultGroups.map((g) => ({ key: g.key as Filter, label: g.short, n: g.items.length })),
  ];

  return (
    <section ref={root} id="results" data-section="results" data-theme="light" aria-labelledby="results-title" className="section-y screen relative bg-paper text-ink">
      <div className="wrap grid-12 relative gap-y-14">
        {/* ---------- 왼쪽: 머리말 + 계수기 ---------- */}
        <div className="col-span-12 flex flex-col lg:col-span-5">
          <div className="pf-head">
            <SpecMark no="0007" className="text-mute">
              Proof &amp; Experience
            </SpecMark>
            <h2 id="results-title" className="h-section mt-7 scr:mt-[3vh]" aria-label={`${resultTotal}건의 수행 실적이 말해 주는 것.`}>
              <span className="mask-line" data-a="line" aria-hidden="true">
                <span>{resultTotal}건의 수행 실적이</span>
              </span>
              <span className="mask-line" data-a="line" aria-hidden="true">
                <span className="font-light">말해 주는 것.</span>
              </span>
            </h2>
            <p data-a="rise" className="mt-6 max-w-[30em] text-[15px] text-mute scr:mt-[2.6vh] lg:text-[16px]">
              {resultFields} 기존 홈페이지에 공개된 목록을 그대로 옮겼습니다.
            </p>
          </div>

          {/* 계수기 */}
          <dl className="pf-counts mt-12 grid grid-cols-3 scr:mt-auto">
            {resultGroups.map((g, i) => (
              <div key={g.key} className={`relative flex flex-col py-5 pr-2 sm:py-7 sm:pr-4 ${i > 0 ? "pl-3 sm:pl-5" : ""}`}>
                <span className="pf-count-rule absolute inset-x-0 top-0 h-px origin-left bg-ink" data-a="scale-x" aria-hidden="true" />
                {i > 0 && <span className="absolute bottom-6 left-0 top-6 w-px bg-ink/15" aria-hidden="true" />}
                <dt className="order-2 mt-3 text-[13px] font-semibold leading-snug sm:text-[14px] lg:text-[15px]">{g.title}</dt>
                <dd className="display-en -order-1 text-[clamp(2.6rem,9vw,9.5rem)] font-[300] leading-[0.85] tabular-nums lg:text-[clamp(2.6rem,min(5.4vw,10vh),7rem)]">
                  <Odometer value={g.items.length} />
                  <span className="ml-1 align-top font-sans text-[12px] font-semibold tracking-normal text-mute sm:ml-2 sm:text-[15px]">건</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- 오른쪽: 실적 대장 (데스크톱 한 화면에서는 칸 안에서 스크롤) ---------- */}
        <div className="pf-register col-span-12 flex flex-col lg:col-span-7 lg:col-start-6 scr:h-[calc(100svh-var(--header-h)-2*var(--screen-pad))]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="mono-label text-mute">Result register — 실적 목록</h3>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="실적 분류">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={filter === t.key}
                  onClick={() => {
                    setFilter(t.key);
                    setExpanded(false);
                  }}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    filter === t.key ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink/75 hover:border-ink/60 hover:text-ink"
                  }`}
                >
                  {t.label} <span className="font-mono text-[11px] opacity-70">{t.n}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pf-scroll relative mt-6 scr:min-h-0 scr:flex-1 scr:overflow-y-auto scr:overscroll-contain scr:pr-3" data-lenis-prevent tabIndex={0} aria-label="실적 목록 (스크롤)">
            <span className="pf-scan pointer-events-none absolute inset-x-0 z-10 h-px bg-bronze opacity-0 shadow-[0_0_12px_color-mix(in_srgb,var(--color-bronze)_60%,transparent)]" aria-hidden="true" />
            <ol className="pf-list grid border-t border-ink/20 md:grid-cols-2 md:gap-x-10 scr:grid-cols-1" aria-live="polite">
              {rows.map((r, i) => (
                <li
                  key={r.id}
                  className={`pf-row grid grid-cols-[3.25rem_1fr] items-baseline gap-x-3 border-b border-ink/10 py-3.5 lg:grid-cols-[3.5rem_1fr_auto] scr:py-3 ${
                    i >= COLLAPSED && !expanded ? "noscr:hidden" : ""
                  }`}
                >
                  <span className="font-mono text-[12px] text-bronze-ink">R-{String(r.no).padStart(2, "0")}</span>
                  <span className="text-[15px] leading-snug text-ink/90 lg:text-[16px]">{r.title}</span>
                  <span className="mono-label col-start-2 mt-1 text-[11px] text-mute lg:col-start-auto lg:mt-0">{r.group}</span>
                </li>
              ))}
            </ol>
            {!expanded && rows.length > COLLAPSED && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent scr:hidden" aria-hidden="true" />}
          </div>
          {/* 한 화면 모드에서는 목록이 칸 안에서 스크롤되므로 펼치기 버튼이 필요 없다 */}
          <p className="mono-label mt-3 hidden text-mute scr:block" aria-hidden="true">
            ↕ 목록 위에서 스크롤 · {rows.length}건
          </p>

          {rows.length > COLLAPSED && (
            <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="link-u mt-8 self-start text-[15px] scr:!hidden">
              {expanded ? "목록 접기" : `전체 목록 펼치기 (${rows.length}건)`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
