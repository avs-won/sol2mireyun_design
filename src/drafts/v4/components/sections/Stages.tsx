"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/drafts/v4/lib/motion";
import { valueStages } from "@/content/value";

/**
 * 시그니처 고정 장면 — 화면이 멈춘 채 가로로 흘러가며 INVENT → PROTECT → CONNECT → GROW를 보여 준다.
 * 데스크톱 + 모션 허용에서만 고정(pin)하고, 그 밖에는 세로로 쌓인 일반 섹션이다.
 */
export default function Stages() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const track = root.current!.querySelector<HTMLElement>(".stage-track")!;
        const panels = gsap.utils.toArray<HTMLElement>("article.stage-panel", root.current);
        const dist = () => track.scrollWidth - window.innerWidth;

        const scrollTween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${dist()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              root.current!.style.setProperty("--stage-progress", String(self.progress));
              const idx = Math.min(valueStages.length - 1, Math.max(0, Math.round(self.progress * valueStages.length - 0.35)));
              root.current!.querySelectorAll("[data-hud]").forEach((el, i) => el.classList.toggle("is-on", i <= idx));
            },
          },
        });

        // 거대한 영문 단어는 패널보다 느리게 흘러 깊이감을 만든다
        panels.forEach((p) => {
          const word = p.querySelector(".outline-word");
          if (word)
            gsap.fromTo(
              word,
              { xPercent: 18 },
              { xPercent: -18, ease: "none", scrollTrigger: { trigger: p, containerAnimation: scrollTween, start: "left right", end: "right left", scrub: true } },
            );
          const items = p.querySelectorAll("[data-stage-in]");
          if (items.length)
            gsap.from(items, {
              opacity: 0,
              y: 60,
              stagger: 0.08,
              duration: 1.1,
              scrollTrigger: { trigger: p, containerAnimation: scrollTween, start: "left 70%", toggleActions: "play none none reverse" },
            });
          const stars = p.querySelectorAll(".star-fill");
          if (stars.length)
            gsap.from(stars, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.4,
              stagger: 0.12,
              ease: "expo.inOut",
              scrollTrigger: { trigger: p, containerAnimation: scrollTween, start: "left 55%" },
            });
        });

        const intro = SplitText.create(".stage-intro-title", { type: "lines", mask: "lines" });
        gsap.set(".stage-intro-title", { visibility: "visible" });
        gsap.from(intro.lines, { yPercent: 110, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 70%" } });
        gsap.from(".stage-intro-lead", { opacity: 0, y: 40, duration: 1.2, delay: 0.3, scrollTrigger: { trigger: root.current, start: "top 70%" } });
        return () => intro.revert();
      });

      mm.add(MQ.compact, () => {
        gsap.set(".stage-intro-title", { visibility: "visible" });
        gsap.utils.toArray<HTMLElement>("[data-stage-in]", root.current).forEach((el) =>
          gsap.from(el, { opacity: 0, y: 40, duration: 1, scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="value" className="relative overflow-hidden bg-ink-2 lg:h-[100svh]" aria-labelledby="value-title">
      <div className="stage-track flex flex-col lg:h-full lg:w-max lg:flex-row">
        {/* 도입 */}
        <div className="stage-panel relative flex w-full shrink-0 flex-col justify-center px-[var(--gutter)] py-[var(--section-y)] lg:h-full lg:w-[56vw] lg:py-0">
          <p className="eyebrow">
            <span className="text-mute">02</span> Invention to Value
          </p>
          <h2 id="value-title" data-split className="stage-intro-title h-section mt-6">
            특허는 등록으로
            <br />
            끝나지 않습니다.
          </h2>
          <p className="stage-intro-lead lead mt-8 max-w-[30em]" data-stage-in>
            기술을 정비하고, 권리로 만들고, 필요한 곳과 잇고, 자금으로 바꾸기까지. 미래연은 네 단계를 한 흐름으로 설계합니다.
          </p>
          <p className="mt-12 hidden items-center gap-3 font-mono text-[12px] tracking-[0.16em] text-mute lg:flex">
            SCROLL
            <span className="relative block h-px w-24 overflow-hidden bg-[var(--line-strong)]">
              <span className="absolute inset-0 origin-left animate-[v4-scan_2.4s_var(--ease-io)_infinite] bg-gold" />
            </span>
          </p>
        </div>

        {valueStages.map((s, i) => (
          <article
            key={s.key}
            className="stage-panel relative flex w-full shrink-0 flex-col justify-center overflow-hidden border-t border-[var(--line)] px-[var(--gutter)] py-20 lg:h-full lg:w-[78vw] lg:border-l lg:border-t-0 lg:py-0 xl:w-[64vw]"
            aria-labelledby={`stage-${s.key}`}
          >
            <span aria-hidden="true" className="outline-word pointer-events-none absolute -bottom-[0.12em] left-0 select-none whitespace-nowrap text-[clamp(120px,22vw,380px)]">
              {s.key.charAt(0) + s.key.slice(1).toLowerCase()}
            </span>

            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="flex items-center gap-4 font-mono text-[12px] tracking-[0.16em] text-gold" data-stage-in>
                  <span className="grid size-12 place-items-center rounded-full border border-gold/50 text-[14px]">{String(i + 1).padStart(2, "0")}</span>
                  {s.key} · {s.kr}
                </p>
                <h3 id={`stage-${s.key}`} className="mt-8 text-[clamp(30px,3.6vw,56px)] font-extrabold leading-[1.15] tracking-[-0.04em]" data-stage-in>
                  {s.title}
                </h3>
                <p className="lead mt-6 max-w-[28em]" data-stage-in>
                  {s.body}
                </p>
              </div>

              <div className="self-end" data-stage-in>
                {"rating" in s && s.rating ? (
                  <div className="rounded-2xl border border-[var(--line)] bg-ink/60 p-6 backdrop-blur sm:p-8">
                    <p className="font-mono text-[12px] tracking-[0.14em] text-mute">특허 현황별 자금 평가</p>
                    <ul className="mt-6 space-y-6">
                      {s.rating.map((r) => (
                        <li key={r.label}>
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="text-[16px] font-semibold">{r.label}</span>
                            <span className="font-mono text-[13px] text-gold" aria-label={`5점 만점에 ${r.stars}점`}>
                              {r.stars}/5
                            </span>
                          </div>
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--line)]" aria-hidden="true">
                            <div className="star-fill h-full rounded-full bg-gradient-to-r from-gold to-gold-2" style={{ width: `${(r.stars / 5) * 100}%` }} />
                          </div>
                          {r.note && <p className="mt-2 text-[14px] text-mute">→ {r.note}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul className="border-t border-[var(--line)]">
                    {s.facts.map((f, k) => (
                      <li key={f} className="flex items-center gap-4 border-b border-[var(--line)] py-4 text-[17px]">
                        <span className="font-mono text-[11px] text-gold">{s.fig}-{k + 1}</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 진행 표시 (데스크톱 고정 장면에서만) */}
      <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-24 hidden items-center gap-6 lg:flex" aria-hidden="true">
        {valueStages.map((s) => (
          <span key={s.key} data-hud className="flex-1 border-t border-[var(--line-strong)] pt-3 font-mono text-[11px] tracking-[0.16em] text-mute transition-colors duration-500 [&.is-on]:border-gold [&.is-on]:text-gold">
            {s.key}
          </span>
        ))}
      </div>
      <style>{`@keyframes v4-scan{0%{transform:scaleX(0);transform-origin:left}50%{transform:scaleX(1);transform-origin:left}50.1%{transform-origin:right}100%{transform:scaleX(0);transform-origin:right}}`}</style>
    </section>
  );
}
