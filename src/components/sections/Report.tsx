"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SpecMark, Corners } from "@/components/ui/Spec";
import LensFigure from "@/components/figures/LensFigure";
import { lensPositions } from "@/components/figures/lensData";
import { lensModes, reportIntro, reportExtras, type LensKey } from "@/content/report";

export default function Report() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<LensKey>("macro");
  const prevMode = useRef<LensKey>("macro");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(q(".rp-head .mask-line > span"), { y: 0, duration: 1.15, stagger: 0.08, scrollTrigger: { trigger: q(".rp-head")[0], start: "top 80%" } });
        gsap.to(q(".rp-head [data-a='rise']"), { opacity: 1, y: 0, duration: 1, stagger: 0.07, scrollTrigger: { trigger: q(".rp-head")[0], start: "top 78%" } });
        gsap.to(q(".rp-extra"), { opacity: 1, y: 0, duration: 1, stagger: 0.1, scrollTrigger: { trigger: q(".rp-extras")[0], start: "top 85%" } });
        // 도면이 들어올 때: 점이 바닥에서 떠올라 자리 잡는다
        gsap.from(q(".lens-dot"), {
          attr: { cy: 356 },
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: { each: 0.008, from: "random" },
          scrollTrigger: { trigger: q(".rp-lens")[0], start: "top 75%" },
        });
        gsap.to(q(".rp-lens-frame"), { opacity: 1, duration: 1, scrollTrigger: { trigger: q(".rp-lens")[0], start: "top 80%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /* 모드 전환 — 같은 점들이 다른 분석 구도로 재배열된다 */
  useEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia(MQ.reduce).matches;
    const pos = lensPositions[mode];
    const dots = el.querySelectorAll(".lens-dot");
    const d = reduce ? 0 : 1;
    gsap.to(dots, {
      attr: { cx: (i: number) => pos[i].x, cy: (i: number) => pos[i].y, r: (i: number) => pos[i].r },
      fillOpacity: (i: number) => pos[i].f,
      duration: 1.05 * d,
      ease: "power3.inOut",
      stagger: reduce ? 0 : { each: 0.006, from: "random" },
      overwrite: "auto",
    });
    el.querySelectorAll<SVGGElement>(".lens-layer").forEach((g) => {
      const on = g.dataset.layer === mode;
      gsap.to(g, { opacity: on ? 1 : 0, duration: 0.5 * d, delay: on ? 0.45 * d : 0, overwrite: true });
    });
    el.querySelector(".rp-lens")?.setAttribute("data-mode", mode);
    if (!reduce) gsap.fromTo(el.querySelectorAll(".rp-desc > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "expo.out" });
  }, [mode]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = lensModes.length;
    let to = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + n) % n;
    if (e.key === "Home") to = 0;
    if (e.key === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    setMode(lensModes[to].key);
    root.current?.querySelector<HTMLButtonElement>(`#lens-tab-${to}`)?.focus();
  };

  const current = lensModes.find((m) => m.key === mode)!;
  const idx = lensModes.findIndex((m) => m.key === mode);

  return (
    <section ref={root} id="report" data-section="report" data-theme="dark" aria-labelledby="report-title" className="section-y screen relative overflow-hidden bg-ink text-paper">
      <div className="arch-grid hidden lg:block" style={{ ["--grid-c" as string]: "color-mix(in srgb, var(--color-paper) 4%, transparent)" }} />
      <div className="wrap grid-12 relative gap-y-14 scr:gap-y-[3vh]">
        {/* ---------- 설명 ---------- */}
        <div className="rp-head col-span-12 lg:col-span-5">
          <SpecMark no="0006" className="text-paper/60">
            Patent Map · 전략 보고서
          </SpecMark>
          <h2 id="report-title" className="h-section mt-7" aria-label="기술의 흐름을 한눈에 읽는 지도.">
            <span className="mask-line" data-a="line" aria-hidden="true">
              <span>기술의 흐름을</span>
            </span>
            <span className="mask-line" data-a="line" aria-hidden="true">
              <span>
                한눈에 읽는 <span className="text-bronze-light">지도.</span>
              </span>
            </span>
          </h2>
          <p data-a="rise" className="body-lead mt-6 text-paper/75">
            {reportIntro.body}
          </p>
          <ul data-a="rise" className="mt-8 grid grid-cols-2 gap-x-6 border-t border-paper/15">
            {reportIntro.uses.map((u) => (
              <li key={u} className="flex items-baseline gap-3 border-b border-paper/15 py-3 text-[14px] text-paper/85 lg:text-[15px]">
                <span className="h-px w-3 shrink-0 translate-y-[-4px] bg-bronze-light" aria-hidden="true" />
                {u}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- 분석 렌즈 ---------- */}
        <div className="rp-lens col-span-12 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7" data-mode={mode}>
          <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="특허맵 분석 방식">
            {lensModes.map((m, i) => (
              <button
                key={m.key}
                id={`lens-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={mode === m.key}
                aria-controls="lens-panel"
                tabIndex={mode === m.key ? 0 : -1}
                onClick={() => setMode(m.key)}
                onKeyDown={(e) => onKey(e, i)}
                className={`lens-tab shrink-0 rounded-full border px-4 py-2 text-left transition-colors ${
                  mode === m.key ? "border-bronze-light bg-bronze-light text-ink" : "border-paper/20 text-paper/75 hover:border-paper/50 hover:text-paper"
                }`}
              >
                <span className="font-mono text-[11px] opacity-70">0{i + 1}</span>
                <span className="ml-2 text-[14px] font-semibold">{m.name}</span>
              </button>
            ))}
          </div>

          <div id="lens-panel" role="tabpanel" aria-labelledby={`lens-tab-${idx}`} className="relative mt-5">
            <div className="relative p-3 sm:p-5">
              <div className="rp-lens-frame pointer-events-none absolute inset-0 text-paper" data-a="fade" aria-hidden="true">
                <Corners />
              </div>
              <div className="flex items-baseline justify-between">
                <p className="mono-label text-paper/55">FIG. 6 — 분석 개념도</p>
                <p className="mono-label text-bronze-light">{current.short}</p>
              </div>
              <div className="mt-2 aspect-[640/400] w-full short:mx-auto short:max-h-[34vh] short:w-auto">
                <LensFigure />
              </div>
            </div>
            <div className="rp-desc mt-5 grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <p className="text-[18px] font-bold tracking-[-0.03em]">{current.name}</p>
              <p className="text-[15px] text-paper/75 lg:text-[16px]">{current.desc}</p>
            </div>
          </div>
        </div>

        {/* ---------- 함께 제공하는 전략 ---------- */}
        <div className="rp-extras col-span-12 mt-6 grid scr:mt-0 gap-x-8 border-t border-paper/15 lg:grid-cols-12">
          {reportExtras.map((x, i) => (
            <div key={x.title} data-a="rise" className={`rp-extra grid grid-cols-[3rem_1fr] gap-x-4 border-b border-paper/15 py-7 lg:border-b-0 lg:py-9 scr:py-[2.6vh] ${i === 0 ? "lg:col-span-5" : "lg:col-span-6 lg:col-start-7"}`}>
              <span className="font-mono text-[12px] text-bronze-light">6.{i + 1}</span>
              <div>
                <h3 className="text-[20px] font-bold tracking-[-0.03em] lg:text-[22px]">{x.title}</h3>
                <p className="mt-2 text-[15px] text-paper/70 short:hidden lg:text-[16px]">{x.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
