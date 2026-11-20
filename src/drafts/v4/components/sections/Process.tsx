"use client";

import { useRef } from "react";
import { SectionHead, useSectionMotion } from "@/drafts/v4/components/ui";
import { gsap, ScrollTrigger, MQ } from "@/drafts/v4/lib/motion";
import { laneRows, phases, steps } from "@/content/process";

/** 9단계 사업화 로드맵 — 스크롤에 맞춰 금빛 선이 단계를 따라 그어지고, 지원 구간 막대가 채워진다 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => {
      const el = root.current!;
      const nodes = el.querySelectorAll<HTMLElement>("[data-step]");
      gsap.set(".road-fill", { scaleX: 0 });
      const st = ScrollTrigger.create({
        trigger: ".road",
        start: "top 75%",
        end: "bottom 35%",
        scrub: 0.6,
        onUpdate: (self) => {
          gsap.set(".road-fill", { scaleX: self.progress });
          const on = Math.round(self.progress * (steps.length - 1));
          nodes.forEach((n, i) => n.classList.toggle("is-on", i <= on));
        },
      });
      gsap.from(".lane-bar", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        stagger: 0.12,
        ease: "expo.inOut",
        scrollTrigger: { trigger: ".lanes", start: "top 80%", once: true },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} id="process" className="section border-t border-[var(--line)]" aria-labelledby="process-title">
      <div className="wrap">
        <SectionHead
          id="process-title"
          no="04"
          eyebrow="Commercialization Roadmap"
          title={
            <>
              기초실험에서 양산까지,
              <br />
              9단계를 함께 걷습니다.
            </>
          }
          lead="기술 개발의 각 단계마다 필요한 조사 · 계약 · 권리화를 미리 배치해, 개발이 끝났을 때 사업화도 준비되어 있도록 합니다."
        />

        {/* 데스크톱: 가로 로드맵 */}
        <div className="road relative mt-20 hidden lg:block">
          <div className="absolute left-[calc(100%/18)] right-[calc(100%/18)] top-[22px] h-px bg-[var(--line-strong)]" aria-hidden="true">
            <div className="road-fill h-full origin-left bg-gradient-to-r from-gold to-gold-2 shadow-[0_0_12px_rgb(212_175_106/0.7)]" />
          </div>
          <ol className="relative grid grid-cols-9">
            {steps.map((s, i) => (
              <li
                key={s}
                data-step
                className="group flex flex-col items-center text-center [&.is-on_.dot]:border-gold [&.is-on_.dot]:bg-gold [&.is-on_.dot]:text-ink [&.is-on_.lbl]:text-ivory"
              >
                <span className="dot grid size-11 place-items-center rounded-full border border-[var(--line-strong)] bg-ink font-mono text-[13px] text-mute transition-colors duration-500">
                  {i + 1}
                </span>
                <span className="lbl mt-4 px-1 text-[15px] font-medium text-mute transition-colors duration-500">{s}</span>
              </li>
            ))}
          </ol>

          <div className="lanes mt-14 space-y-3" aria-label="단계별 지원 구간">
            {laneRows.map((row, r) => (
              <div key={r} className="grid grid-cols-9 gap-3">
                {row.map((l) => (
                  <div
                    key={l.label}
                    className={`lane-bar flex min-h-[60px] flex-col justify-center rounded-xl px-5 ${
                      l.kind === "phase" ? "bg-gold/12 border border-gold/40" : "border border-[var(--line)] bg-ink-3"
                    }`}
                    style={{ gridColumn: `${l.from} / ${l.to + 1}` }}
                  >
                    <span className={`text-[15px] font-semibold ${l.kind === "phase" ? "text-gold-2" : "text-ivory"}`}>{l.label}</span>
                    {l.note && <span className="text-[13px] text-mute">{l.note}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 모바일 · 태블릿: 구간별 세로 목록 */}
        <div className="mt-14 space-y-12 lg:hidden">
          {phases.map((p) => (
            <div key={p.label} data-reveal>
              <p className="inline-flex rounded-full border border-gold/40 px-3 py-1 font-mono text-[12px] text-gold">
                {p.from}–{p.to}단계 · {p.label}
              </p>
              <ol className="mt-6 border-l border-[var(--line-strong)] pl-6">
                {steps.slice(p.from - 1, p.to).map((s, k) => (
                  <li key={s} className="relative py-2.5 text-[17px]">
                    <span aria-hidden="true" className="absolute -left-[29px] top-[18px] size-[9px] rounded-full border border-gold bg-ink" />
                    <span className="mr-3 font-mono text-[12px] text-mute">{p.from + k}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <ul className="mt-4 space-y-2">
                {p.supports.map((sp) => (
                  <li key={sp.label} className="rounded-xl border border-[var(--line)] bg-ink-3 px-4 py-3 text-[15px]">
                    {sp.label}
                    {sp.note && <span className="block text-[13px] text-mute">{sp.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
