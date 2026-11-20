"use client";

import { useRef, useState } from "react";
import ParticleStage from "@/drafts/v4/components/ParticleStage";
import { gsap, SplitText, useGSAP, MQ } from "@/drafts/v4/lib/motion";
import { contact, credentials } from "@/content/site";

const stageCaptions = [
  { en: "INVENT", kr: "발명 · 기술 정비" },
  { en: "PROTECT", kr: "특허 권리화" },
  { en: "CONNECT", kr: "기술이전 · 거래" },
  { en: "GROW", kr: "자금 · 투자 연계" },
] as const;

const quick = [
  { no: "01", label: "특허 · 실용신안 · 디자인 출원", href: "#services" },
  { no: "02", label: "기술이전 · 기술거래", href: "#services" },
  { no: "03", label: "기술사업화 컨설팅", href: "#services" },
  { no: "04", label: "TIPS · 정책자금 · 투자 연계", href: "#services" },
] as const;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create("[data-split]", { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set("[data-split]", { visibility: "visible" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        // 1) 막이 열리고 금빛 선이 가로지른다 (0.9s) — 그 사이 헤드라인이 이미 올라오기 시작한다
        tl.fromTo(".hero-curtain-line", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.inOut" }, 0)
          .to(".hero-curtain-top", { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 0.45)
          .to(".hero-curtain-bottom", { yPercent: 100, duration: 0.9, ease: "expo.inOut" }, 0.45)
          .to(".hero-curtain-line", { opacity: 0, duration: 0.3 }, 0.75)
          .set(".hero-curtain", { display: "none" })
          // 2) 헤드라인: 줄 단위로 마스크 밖에서 솟아오른다
          .from(split.lines, { yPercent: 110, rotate: 2.5, duration: 1.3, stagger: 0.09 }, 0.5)
          .fromTo("[data-hero-fade]", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 0.75)
          .fromTo(".hero-stage", { opacity: 0, scale: 0.92, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.8 }, 0.55);

        // 3) 스크롤로 빠져나갈 때: 글은 위로 흩어지고, 입자 무대는 다가오며 흐려진다
        gsap.to(".hero-copy", {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-stage-wrap", {
          scale: 1.18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        return () => split.revert();
      });
      mm.add(MQ.reduce, () => {
        gsap.set(".hero-curtain", { display: "none" });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--header-h)]" aria-labelledby="hero-title">
      {/* 첫 진입 막 (모션 허용 시에만 보인다) */}
      <div className="hero-curtain pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
        <div className="hero-curtain-top absolute inset-x-0 top-0 h-1/2 bg-ink" />
        <div className="hero-curtain-bottom absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
        <div className="hero-curtain-line absolute inset-x-0 top-1/2 h-px origin-center bg-gold" />
      </div>

      {/* 배경: 도면 격자 + 금빛 광원 */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-ivory)_1px,transparent_1px),linear-gradient(90deg,var(--color-ivory)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_70%_45%,#000_10%,transparent_70%)]" />
        <div className="absolute right-[-10%] top-[8%] size-[70vmax] rounded-full bg-[radial-gradient(circle,rgb(212_175_106/0.16),transparent_60%)] blur-2xl" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <div className="wrap grid flex-1 items-center gap-x-10 gap-y-6 py-10 lg:grid-cols-12 lg:py-0">
        <div className="hero-copy relative z-10 lg:col-span-7">
          <p data-hero-fade className="eyebrow !font-sans !text-[14px] !tracking-[0.02em]">
            변리사가 직접 설계하는 특허 · 기술사업화
          </p>

          <h1 id="hero-title" data-split className="h-display mt-6 text-[clamp(44px,7.4vw,112px)]">
            <span className="gold-text is-sweep">특허 출원</span>부터
            <br />
            자금 조달까지,
            <br />
            <span className="text-ivory/60">한 팀이 끝까지.</span>
          </h1>

          <p data-hero-fade className="lead mt-8 max-w-[34em]">
            특허 · 실용신안 · 디자인 출원과 분쟁 대응, 기술이전 · 거래, TIPS · 정책자금 · 투자 연계까지.
            <strong className="font-semibold text-ivory"> 前 특허청 심사관 출신 대표 변리사</strong>가 처음부터 끝까지 맡습니다.
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#contact" className="btn btn-gold">
              상담 신청하기 <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a href={contact.phoneHref} className="btn btn-ghost font-mono">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
              {contact.phone}
            </a>
          </div>

          <ul data-hero-fade className="mt-12 grid max-w-[640px] grid-cols-1 border-t border-[var(--line)] sm:grid-cols-2" aria-label="주요 업무">
            {quick.map((q) => (
              <li key={q.no} className="border-b border-[var(--line)] sm:odd:border-r sm:odd:pr-4 sm:even:pl-4">
                <a href={q.href} className="group flex min-h-[52px] items-center gap-3 py-3 text-[15px] text-ivory/85 transition-colors hover:text-gold-2">
                  <span className="font-mono text-[11px] text-gold">{q.no}</span>
                  {q.label}
                  <span aria-hidden="true" className="ml-auto translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-stage-wrap relative lg:col-span-5">
          <div className="hero-stage relative mx-auto aspect-square w-full max-w-[560px]">
            <ParticleStage
              className="absolute inset-0 size-full"
              onStage={setStage}
              label="빛 입자가 전구(발명), 방패(권리화), 연결망(기술이전), 성장 막대(자금) 모양으로 차례로 바뀌는 그림"
            />
            {/* 장면 이름 */}
            <ol className="absolute inset-x-0 -bottom-2 grid grid-cols-4 gap-2" aria-label="미래연이 하는 일의 흐름">
              {stageCaptions.map((s, i) => (
                <li key={s.en} aria-current={i === stage ? "step" : undefined} className="relative pt-3">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-[var(--line-strong)]">
                    <span
                      key={i === stage ? `on-${stage}` : "off"}
                      className={`block h-full origin-left bg-gold ${i === stage ? "animate-[v4-fill_3.6s_linear_both] motion-reduce:animate-none" : i < stage ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </span>
                  <span className={`block font-mono text-[10px] tracking-[0.14em] transition-colors duration-500 sm:text-[11px] ${i === stage ? "text-gold" : "text-mute/70"}`}>
                    {String(i + 1).padStart(2, "0")}<span className="hidden xl:inline"> {s.en}</span>
                  </span>
                  <span className={`mt-1 block text-[12px] transition-colors duration-500 sm:text-[13px] ${i === stage ? "text-ivory" : "text-mute/70"}`}>{s.kr}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* 지정 · 선정 이력 — 흐르는 띠 */}
      <div data-hero-fade className="marquee-mask relative border-y border-[var(--line)] py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <p className="sr-only">지정 · 선정 이력: {credentials.map((c) => c.text).join(", ")}</p>
        <div className="marquee [--dur:42s]" aria-hidden="true">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[...credentials, ...credentials].map((c, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-3 px-8 text-[14px] text-ivory/70">
                  <span className="rounded-full border border-gold/40 px-2 py-0.5 font-mono text-[11px] text-gold">{c.kind}</span>
                  {c.text}
                  <span className="ml-8 text-gold/50">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes v4-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
    </section>
  );
}
