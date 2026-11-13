"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import HeroFigure, { COLLAPSE_DELTA, BARS, barPaths, heroRefs } from "@/components/figures/HeroFigure";
import MagneticButton from "@/components/ui/MagneticButton";
import { SpecMark } from "@/components/ui/Spec";
import { credentials } from "@/content/site";

const serviceIndex = [
  { no: "100", label: "지식재산 권리화", href: "#services" },
  { no: "200", label: "기술이전 · 기술거래", href: "#services" },
  { no: "300", label: "기술사업화 컨설팅", href: "#process" },
  { no: "400", label: "IP 기반 자금 · 투자", href: "#value" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [hot, setHot] = useState<number | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, desktop: MQ.desktop, fine: MQ.finePointer }, (ctx) => {
        const { motion, desktop, fine } = ctx.conditions as Record<string, boolean>;
        if (!motion) return;

        const plA = q(".pl-a");
        const bars = q(".bar");

        /* ---------- 1. 오프닝: 선이 그려지고, 판이 분해되고, 번호가 붙는다 ---------- */
        gsap.set(plA, { y: (i: number) => COLLAPSE_DELTA[i] });
        const grow = BARS.map(() => ({ h: 0.01 }));
        const setBar = (i: number) => {
          const p = barPaths(i, grow[i].h);
          const el = bars[i];
          if (!el) return;
          el.querySelector(".bar-l")?.setAttribute("d", p.left);
          el.querySelector(".bar-r")?.setAttribute("d", p.right);
          el.querySelector(".bar-t")?.setAttribute("d", p.top);
        };
        BARS.forEach((_, i) => setBar(i));

        const tl = gsap.timeline({ delay: 0.05, defaults: { ease: "expo.out" } });
        tl.to(q("[data-hero-grid]"), { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
          .to(q(".axis"), { scaleY: 1, duration: 1.1, ease: "power3.inOut", transformOrigin: "50% 100%" }, 0)
          .to(q(".hero-kicker"), { opacity: 1, y: 0, duration: 0.9 }, 0.05)
          .to(q(".hero-title .mask-line > span"), { y: 0, duration: 1.15, stagger: 0.09 }, 0.1)
          .to(q("[data-hero-rise]"), { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.45)
          // 판 외곽선 — 아래에서 위로
          .to(q(".po"), { strokeDashoffset: 0, duration: 0.85, ease: "power2.inOut", stagger: 0.1 }, 0.15)
          .to(q(".pf-t, .pf-l, .pf-r"), { opacity: 1, duration: 0.6, ease: "power1.out", stagger: 0.03 }, 0.55)
          // 분해 — 위 판일수록 더 멀리
          .to(plA, { y: 0, duration: 1.25, ease: "expo.inOut", stagger: 0.05 }, 0.75)
          // 판 위의 내용
          .to(q(".pc [data-draw]"), { strokeDashoffset: 0, duration: 0.9, ease: "power2.out", stagger: 0.012 }, 1.25)
          .to(q(".pc [data-a='fill']"), { opacity: 1, duration: 0.4, stagger: 0.02 }, 1.5)
          .to(grow, { h: (i: number) => BARS[i].h, duration: 1.1, ease: "expo.out", stagger: 0.08, onUpdate: () => BARS.forEach((_, i) => setBar(i)) }, 1.5)
          // 지시선과 참조번호
          .to(q(".leader"), { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.09 }, 1.7)
          .to(q(".leader-dot"), { opacity: 1, duration: 0.3, stagger: 0.09 }, 1.85)
          .to(q(".ref-text"), { opacity: 1, duration: 0.6, stagger: 0.09 }, 1.95)
          .to(q(".axis-cap"), { opacity: 1, duration: 0.8 }, 2.1)
          // 도면 표제란
          .to(q(".tb-rule"), { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0.9)
          .to(q(".tb-cell"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, 1.3);

        /* ---------- 2. 스크롤: 분해된 판이 하나로 조립된다 ---------- */
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
            defaults: { ease: "none" },
          })
          .to(q(".pl-b"), { y: (i: number) => COLLAPSE_DELTA[i] * 0.92 }, 0)
          .to(q(".hero-fig-inner"), { yPercent: desktop ? -6 : -3, scale: 0.94 }, 0)
          .to(q(".hero-copy"), { y: desktop ? -90 : -30 }, 0)
          .to(q("[data-hero-grid]"), { yPercent: 8 }, 0);

        /* ---------- 3. 마우스: 판마다 다른 깊이로 반응 ---------- */
        if (desktop && fine) {
          const layers = q(".pl-c");
          const xs = layers.map((el) => gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" }));
          const ys = layers.map((el) => gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" }));
          const move = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((_, i) => {
              const d = 5 + i * 7;
              xs[i](nx * d);
              ys[i](ny * d * 0.55);
            });
          };
          const el = root.current!;
          el.addEventListener("pointermove", move);
          return () => el.removeEventListener("pointermove", move);
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      data-section="top"
      data-theme="dark"
      aria-labelledby="hero-title"
      className="hero grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
    >
      <div className="arch-grid hidden md:block" data-a="fade" data-hero-grid style={{ ["--grid-c" as string]: "color-mix(in srgb, var(--color-paper) 5%, transparent)" }} />

      <div className="wrap grid-12 relative flex-1 items-center gap-y-10 pb-10 pt-[calc(var(--header-h)+36px)] lg:pb-6 lg:pt-[calc(var(--header-h)+24px)]">
        {/* ---------- 카피 ---------- */}
        <div className="hero-copy relative z-10 col-span-12 lg:col-span-7 lg:pr-4">
          <SpecMark no="0001" className="hero-kicker text-paper/70" data-a="rise">
            IP 사업화 · 금융 전문 그룹
          </SpecMark>

          <h1 id="hero-title" className="hero-title mt-6 lg:mt-8" aria-label="무기가 되는 특허, 돈이 되는 기술.">
            <span className="mask-line" data-a="line" aria-hidden="true">
              <span>
                무기가 되는 <b>특허</b>,
              </span>
            </span>
            <span className="mask-line" data-a="line" aria-hidden="true">
              <span>
                돈이 되는 <b>기술</b>.
              </span>
            </span>
          </h1>

          <p data-a="rise" data-hero-rise className="body-lead mt-7 max-w-[34em] text-paper/80 lg:mt-9">
            특허 권리화부터 기술이전·거래, 사업화 컨설팅, TIPS·정책자금·투자 연결까지.
            <br className="hidden sm:block" /> 前 특허청 심사관 출신 변리사와 분야별 10년 이상 전문가들이 한 팀으로 설계합니다.
          </p>

          <ol data-a="rise" data-hero-rise className="hero-index mt-8 grid short:!hidden grid-cols-2 border-t border-paper/15 sm:grid-cols-4 lg:mt-10" aria-label="주요 서비스">
            {serviceIndex.map((s, i) => (
              <li key={s.no} className="border-b border-paper/15 sm:border-b-0">
                <a
                  href={s.href}
                  className={`hero-index-item group flex h-full flex-col gap-1 py-3.5 pr-3 transition-colors ${hot === i ? "is-hot" : ""}`}
                  onPointerEnter={() => setHot(i)}
                  onPointerLeave={() => setHot(null)}
                  onFocus={() => setHot(i)}
                  onBlur={() => setHot(null)}
                >
                  <span className="font-mono text-[12px] tracking-[0.06em] text-bronze-light">{s.no}</span>
                  <span className="text-[14px] font-medium leading-snug text-paper/85 group-hover:text-paper lg:text-[15px]">{s.label}</span>
                </a>
              </li>
            ))}
          </ol>

          <div data-a="rise" data-hero-rise className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 lg:mt-10">
            <MagneticButton href="#contact" variant="bronze">
              상담 문의하기
            </MagneticButton>
            <a href="#services" className="link-u text-paper/90 hover:text-paper">
              서비스 살펴보기
            </a>
          </div>
        </div>

        {/* ---------- 도면 ---------- */}
        <div className="hero-figure relative col-span-12 mx-auto w-full max-w-[520px] lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <div className="hero-fig-inner relative aspect-[720/900] max-h-[calc(100svh-var(--header-h)-150px)] w-full short:max-h-[calc(100svh-var(--header-h)-270px)] lg:mx-auto">
            <HeroFigure hot={hot} onHot={setHot} />
          </div>
          <p className="mono-label mt-2 text-center text-paper/55" data-a="fade" data-hero-rise>
            FIG. 1 — 발명에서 가치까지 · 분해도
          </p>
        </div>
      </div>

      {/* ---------- 도면 표제란: 지정 · 선정 이력 ---------- */}
      <div className="wrap relative z-10 pb-6 lg:pb-8">
        <div className="relative">
          <span className="tb-rule absolute inset-x-0 top-0 h-px origin-left bg-paper/20" data-a="scale-x" aria-hidden="true" />
          <ul className="grid grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]" aria-label="지정 및 선정 이력">
            {credentials.map((c, i) => (
              <li
                key={c.text}
                data-a="rise"
                className={`tb-cell flex flex-col gap-1 border-paper/15 py-3.5 pr-4 ${i % 2 === 1 ? "pl-4 border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0`}
              >
                <span className="mono-label text-paper/55">{c.kind}</span>
                <span className="text-[13px] leading-snug text-paper/85 lg:text-[14px]">{c.text}</span>
              </li>
            ))}
            <li data-a="rise" className="tb-cell hidden flex-col justify-center gap-1 border-l border-paper/15 py-3.5 pl-5 lg:flex" aria-hidden="true">
              <span className="mono-label text-paper/55">Sheet</span>
              <span className="font-mono text-[13px] text-bronze-light">01 / 09</span>
            </li>
          </ul>
        </div>
      </div>

      <span className="sr-only">{heroRefs.map((r) => `${r.no} ${r.ko}`).join(", ")}</span>
    </section>
  );
}
