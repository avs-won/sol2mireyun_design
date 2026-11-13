"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SpecMark } from "@/components/ui/Spec";
import { steps, phases } from "@/content/process";

/*
 * 9단계 사업화 로드맵
 * 한 화면에서 세 가지가 동시에 읽히도록 구성한다.
 *   ① 9단계는 계단처럼 오른다 (단면도)
 *   ② 그 계단은 두 구간으로 나뉜다 (원천 기술 1–5 / 상용화 6–9)
 *   ③ 구간마다 미래연이 무엇을 지원하는가
 * 고정(pin) · 스크롤 연동 없이, 화면에 들어올 때 한 번만 그려진다.
 */

/* 계단 단면 — viewBox 900 × 200, 디딤판 9개 */
const TREAD = 100;
const RISE = 17;
const BASE = 188;
const yAt = (i: number) => BASE - i * RISE;
const stairPath = (from: number, to: number) => {
  // from·to: 0부터 시작하는 디딤판 번호 (양끝 포함)
  let d = `M${from * TREAD},${yAt(from)}`;
  for (let i = from; i <= to; i++) {
    d += ` H${(i + 1) * TREAD}`;
    if (i < to) d += ` V${yAt(i + 1)}`;
  }
  return d;
};
const SPLIT = phases[0]?.to ?? 5; // 구간이 바뀌는 단계 (1–5 | 6–9)

const pad = (n: number) => String(n).padStart(2, "0");

/** 좁은 칸에서 단어 중간이 아니라 의미 단위로 줄이 바뀌도록 */
function StepName({ name }: { name: string }) {
  const m = name.match(/^(시제품|기본|부품\/)(.{3,})$/);
  if (!m) return <>{name}</>;
  return (
    <>
      {m[1]}
      <wbr />
      {m[2]}
    </>
  );
}

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.to(q(".pr-head .mask-line > span"), { y: 0, duration: 1.1, stagger: 0.08, scrollTrigger: { trigger: q(".pr-head")[0], start: "top 80%" } });
        gsap.to(q(".pr-head [data-a='rise'], .pr-sum [data-a='rise']"), {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.06,
          delay: 0.15,
          scrollTrigger: { trigger: q(".pr-head")[0], start: "top 80%" },
        });
      });

      // 데스크톱: 계단이 왼쪽부터 그려지고 → 단계 이름 → 구간 치수선 → 지원 내용
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: q(".pr-board")[0], start: "top 78%" } });
        const drawn = "inset(-12px -12px -12px -12px)";
        tl.fromTo(q(".pr-line-1"), { clipPath: "inset(-12px 100% -12px -12px)" }, { clipPath: drawn, duration: 0.9, ease: "power2.inOut" }, 0)
          .fromTo(q(".pr-line-2"), { clipPath: "inset(-12px 100% -12px -12px)" }, { clipPath: drawn, duration: 0.75, ease: "power2.inOut" }, 0.8)
          .to(q(".pr-step"), { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.07 }, 0.1)
          .to(q(".pr-split"), { scaleY: 1, duration: 0.6, ease: "power3.inOut" }, 0.8)
          .to(q(".pr-dim"), { scaleX: 1, duration: 0.9, ease: "expo.inOut", stagger: 0.15 }, 0.9)
          .to(q(".pr-phase [data-a='rise']"), { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.05 }, 1.05);
      });

      // 모바일 · 태블릿: 구간 카드가 차례로 올라온다
      mm.add(MQ.compact, () => {
        q(".prm-phase").forEach((card) => {
          gsap.from(card.querySelectorAll(".prm-in"), {
            opacity: 0,
            y: 18,
            duration: 0.8,
            stagger: 0.05,
            scrollTrigger: { trigger: card, start: "top 82%" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const supportCount = phases.reduce((n, p) => n + p.supports.length, 0);

  return (
    <section ref={root} id="process" data-section="process" data-theme="light" aria-labelledby="process-title" className="section-y screen relative bg-paper text-ink">
      <div className="arch-grid hidden lg:block" />
      <div className="wrap relative">
        {/* ---------- 머리말 + 한눈 요약 ---------- */}
        <div className="grid-12 items-end gap-y-8">
          <div className="pr-head col-span-12 lg:col-span-7">
            <SpecMark no="0005" className="text-mute">
              9-Step Commercialization
            </SpecMark>
            <h2 id="process-title" className="h-section mt-7" aria-label="기초실험부터 양산까지, 9단계 사업화 로드맵">
              <span className="mask-line" data-a="line" aria-hidden="true">
                <span>기초실험부터 양산까지,</span>
              </span>
              <span className="mask-line" data-a="line" aria-hidden="true">
                <span className="font-light">9단계 사업화 로드맵</span>
              </span>
            </h2>
            <p data-a="rise" className="mt-5 max-w-[36em] text-[15px] text-mute short:hidden lg:text-[16px]">
              원천기술 단계부터 상용화 기술개발 단계까지, 기술경향 조사, 경쟁사 분석·분쟁예방, 기술이전·라이선싱, 개발내용 권리화를 단계별로 지원합니다.
            </p>
          </div>

          <dl className="pr-sum col-span-12 grid grid-cols-3 border-t border-ink/15 lg:col-span-4 lg:col-start-9" aria-label="로드맵 요약">
            {[
              { n: steps.length, u: "단계", d: "기초실험 → 양산" },
              { n: phases.length, u: "구간", d: "원천 · 상용화" },
              { n: supportCount, u: "지원", d: "구간별 IP 지원" },
            ].map((s) => (
              <div key={s.u} data-a="rise" className="border-r border-ink/10 pt-4 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4">
                <dt className="sr-only">{s.u}</dt>
                <dd>
                  <span className="display-en text-[clamp(2.25rem,3.4vw,3.25rem)] font-[400] leading-none tabular-nums">{pad(s.n)}</span>
                  <span className="ml-1.5 text-[15px] font-bold">{s.u}</span>
                  <span className="mt-1.5 block text-[13px] text-mute">{s.d}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- 데스크톱: 계단 단면도 + 구간 ---------- */}
        <div className="pr-board mt-14 hidden lg:block xl:mt-16 scr:mt-[3.5vh]">
          <div className="pr-stair relative">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 200" preserveAspectRatio="none" aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <line key={i} x1={i * TREAD} x2={i * TREAD} y1={0} y2={200} className="pr-grid" />
              ))}
              <path d={stairPath(0, SPLIT - 1)} className="pr-line pr-line-1" />
              <path d={`M${SPLIT * TREAD},${yAt(SPLIT - 1)} V${yAt(SPLIT)}${stairPath(SPLIT, 8).replace(/^M[^ ]+/, "")}`} className="pr-line pr-line-2" />
            </svg>
            <span className="pr-split" style={{ left: `${(SPLIT / 9) * 100}%` }} aria-hidden="true" />
            <ol className="absolute inset-0" aria-label="9단계">
              {steps.map((s, i) => (
                <li
                  key={s}
                  className={`pr-step absolute flex flex-col justify-end px-2.5 pb-3 ${i >= SPLIT ? "is-late" : ""}`}
                  data-a="rise"
                  style={{ left: `${(i / 9) * 100}%`, width: `${100 / 9}%`, bottom: `${((200 - yAt(i)) / 200) * 100}%` }}
                >
                  <span className="pr-step-no font-mono text-[12px] tabular-nums">{pad(i + 1)}</span>
                  <span className="mt-1 text-[clamp(0.95rem,1.2vw,1.2rem)] font-bold leading-[1.25] tracking-[-0.035em] [overflow-wrap:normal]">
                    <StepName name={s} />
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* 구간 — 치수선 아래에 지원 내용 */}
          <div className="grid grid-cols-9 gap-x-4">
            {phases.map((p, k) => (
              <div key={p.label} className={`pr-phase pr-phase-${k + 1} pt-5`} style={{ gridColumn: `${p.from} / ${p.to + 1}` }}>
                <span className="pr-dim" aria-hidden="true" />
                <div className="mt-5 flex items-baseline justify-between gap-4" data-a="rise">
                  <h3 className="text-[clamp(1.25rem,1.7vw,1.6rem)] font-bold tracking-[-0.04em]">{p.label}</h3>
                  <span className="font-mono text-[12px] tabular-nums text-mute">
                    {pad(p.from)}–{pad(p.to)}단계
                  </span>
                </div>
                <p className="mono-label mt-5 text-mute" data-a="rise">
                  미래연 지원
                </p>
                <ul className="mt-2.5 border-t border-ink/12">
                  {p.supports.map((s) => (
                    <li key={s.label} data-a="rise" className="flex items-baseline gap-3 border-b border-ink/12 py-3.5">
                      <span className="pr-bullet" aria-hidden="true" />
                      <span className="text-[16px] font-semibold tracking-[-0.02em] xl:text-[17px]">{s.label}</span>
                      {s.note && <span className="ml-auto shrink-0 text-[13px] text-mute">{s.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- 모바일 · 태블릿: 구간 카드 ---------- */}
        <div className="mt-12 space-y-5 lg:hidden">
          {phases.map((p, k) => (
            <article key={p.label} className={`prm-phase pr-phase-${k + 1} relative border border-ink/12 bg-paper`}>
              <header className="prm-in flex items-baseline justify-between gap-3 border-b border-ink/12 px-5 py-4">
                <h3 className="text-[19px] font-bold tracking-[-0.035em]">{p.label}</h3>
                <span className="font-mono text-[12px] tabular-nums text-mute">
                  {pad(p.from)}–{pad(p.to)}단계
                </span>
              </header>
              <ol className="px-5 py-3">
                {steps.slice(p.from - 1, p.to).map((s, i) => (
                  <li key={s} className="prm-in prm-step flex items-baseline gap-4 py-2">
                    <span className="pr-step-no w-6 shrink-0 font-mono text-[12px] tabular-nums">{pad(p.from + i)}</span>
                    <span className="text-[17px] font-bold tracking-[-0.03em]">{s}</span>
                  </li>
                ))}
              </ol>
              <div className="prm-in border-t border-ink/12 bg-bone/60 px-5 py-4">
                <p className="mono-label text-mute">미래연 지원</p>
                <ul className="mt-2 space-y-1.5">
                  {p.supports.map((s) => (
                    <li key={s.label} className="flex items-baseline gap-3 text-[15px] font-semibold">
                      <span className="pr-bullet" aria-hidden="true" />
                      <span>
                        {s.label}
                        {s.note && <span className="ml-1.5 text-[13px] font-normal text-mute">{s.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
