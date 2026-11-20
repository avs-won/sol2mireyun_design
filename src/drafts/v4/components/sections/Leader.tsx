"use client";

import { useRef } from "react";
import { useSectionMotion } from "@/drafts/v4/components/ui";
import { gsap, SplitText, MQ } from "@/drafts/v4/lib/motion";
import { ceo } from "@/content/ceo";

/** 대표 변리사 — 선언문이 스크롤에 맞춰 한 단어씩 밝아지고, 공학 · 법률 두 선이 하나로 만나는 경력 도식 */
export default function Leader() {
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const split = SplitText.create(".ceo-statement", { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".ceo-statement", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      return () => split.revert();
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} id="ceo" className="section" aria-labelledby="ceo-title">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          <span className="text-mute">06</span> {ceo.roleEn}
        </p>

        <blockquote className="mt-10 max-w-[22em] text-[clamp(30px,4.4vw,64px)] font-bold leading-[1.3] tracking-[-0.04em]">
          <p className="ceo-statement">
            “{ceo.statement}”
          </p>
        </blockquote>

        <div className="mt-16 grid gap-12 border-t border-[var(--line)] pt-12 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <h2 id="ceo-title" className="text-[40px] font-extrabold tracking-[-0.04em]">
              {ceo.name} <span className="text-[18px] font-medium text-mute">{ceo.role}</span>
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="보유 자격">
              {ceo.licenses.map((l) => (
                <li key={l} className="rounded-full border border-gold/40 px-3 py-1 text-[14px] text-gold-2">
                  {l}
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-1 text-[15px] text-mute">
              {ceo.companies.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          {/* 두 선이 만나는 경력 도식 */}
          <div className="lg:col-span-8" data-reveal>
            <svg viewBox="0 0 800 150" className="w-full" aria-hidden="true">
              <path data-draw pathLength={1} d="M10 30 H300 C380 30 400 75 470 75 H790" fill="none" stroke="#a2a8b5" strokeWidth="1.5" />
              <path data-draw pathLength={1} d="M10 120 H300 C380 120 400 75 470 75" fill="none" stroke="#d4af6a" strokeWidth="1.5" />
              <circle cx="470" cy="75" r="7" fill="#d4af6a" />
              <circle cx="470" cy="75" r="16" fill="none" stroke="#d4af6a" strokeOpacity=".4" />
              <text x="10" y="18" fill="#a2a8b5" fontSize="13" fontFamily="var(--font-plex-mono)">ENGINEERING · 공학</text>
              <text x="10" y="145" fill="#d4af6a" fontSize="13" fontFamily="var(--font-plex-mono)">LAW · 법률</text>
              <text x="496" y="64" fill="#ece5d6" fontSize="14">권리화 → 사업화</text>
            </svg>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {ceo.timeline.map((t) => (
                <li key={t.title} className="rounded-2xl border border-[var(--line)] bg-ink-2 p-6">
                  <p className="num text-[28px] text-gold">
                    {t.from}–{t.to}
                  </p>
                  <p className="mt-2 text-[17px] font-semibold">{t.title}</p>
                  <p className="text-[14px] text-mute">{t.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2" data-reveal>
          <div>
            <h3 className="font-mono text-[12px] tracking-[0.16em] text-gold">학력 · 공학</h3>
            <ul className="mt-4 space-y-2 text-[15px] text-ivory/85">
              {ceo.education.engineering.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[12px] tracking-[0.16em] text-gold">학력 · 법학</h3>
            <ul className="mt-4 space-y-2 text-[15px] text-ivory/85">
              {ceo.education.law.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>

        <details className="group mt-12 border-y border-[var(--line)]" data-reveal>
          <summary className="flex min-h-[64px] items-center justify-between gap-4 text-[17px] font-semibold">
            주요 경력 {ceo.career.length}건 모두 보기
            <span className="chev grid size-9 place-items-center rounded-full border border-[var(--line-strong)] text-[18px] text-gold" aria-hidden="true">
              +
            </span>
          </summary>
          <ul className="grid gap-x-10 pb-8 md:grid-cols-2">
            {ceo.career.map((c) => (
              <li key={c} className="border-t border-[var(--line)] py-3 text-[15px] text-ivory/80">
                {c}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
