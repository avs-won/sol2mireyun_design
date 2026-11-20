"use client";

import { useRef, useState } from "react";
import { SectionHead, useSectionMotion } from "@/drafts/v4/components/ui";
import { lensModes, reportExtras, reportIntro } from "@/content/report";

// 개념도용 점 (실제 통계 아님 — 화면에 '개념도'로 표기). 고정 시드라 서버 · 브라우저 결과가 같다.
const dots = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  // 삼각함수 끝자리 차이로 하이드레이션이 어긋나지 않게 반올림
  const round = (v: number) => Math.round(v * 10) / 10;
  return Array.from({ length: 90 }, () => {
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 150;
    return { x: round(200 + Math.cos(a) * r), y: round(200 + Math.sin(a) * r), hot: rnd() < 0.14 };
  });
})();

/** 특허맵 · 전략 보고서 — 네 가지 분석 렌즈를 탭으로 바꿔 보며, 레이더 개념도가 확대 · 감시 모드로 바뀐다 */
export default function Report() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useSectionMotion(root);


  const scale = [1, 2.1, 1.35, 1][active];
  const mode = lensModes[active];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = (active + d + lensModes.length) % lensModes.length;
    setActive(next);
    document.getElementById(`lens-tab-${next}`)?.focus();
  };

  return (
    <section ref={root} id="report" className="section bg-ink-2" aria-labelledby="report-title">
      <div className="wrap">
        <SectionHead
          id="report-title"
          no="05"
          eyebrow="Patent Map Report"
          title={
            <>
              시장에 들어가기 전,
              <br />
              특허 지형부터 읽습니다.
            </>
          }
          lead={reportIntro.body}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5" data-reveal>
            <div role="tablist" aria-label="분석 방식" aria-orientation="vertical" className="border-t border-[var(--line)]" onKeyDown={onKey}>
              {lensModes.map((m, i) => (
                <button
                  key={m.key}
                  id={`lens-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={i === active}
                  aria-controls="lens-panel"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group relative flex min-h-[72px] w-full items-center gap-5 border-b border-[var(--line)] text-left transition-colors duration-300 ${
                    i === active ? "text-ivory" : "text-mute hover:text-ivory"
                  }`}
                >
                  <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-px origin-top bg-gold transition-transform duration-500 ${i === active ? "scale-y-100" : "scale-y-0"}`} />
                  <span className="pl-5 font-mono text-[12px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[20px] font-bold tracking-[-0.03em]">{m.name}</span>
                  <span className="ml-auto pr-2 text-[14px]">{m.short}</span>
                </button>
              ))}
            </div>
            <p className="mt-8 text-[15px] text-mute">
              활용: {reportIntro.uses.join(" · ")}
            </p>
          </div>

          <div id="lens-panel" role="tabpanel" aria-labelledby={`lens-tab-${active}`} className="lg:col-span-7" data-reveal>
            <div className="grid items-center gap-8 rounded-3xl border border-[var(--line)] bg-ink p-6 sm:grid-cols-[1fr_1.1fr] sm:p-10">
              <div className="relative aspect-square">
                <svg viewBox="0 0 400 400" className="size-full" aria-hidden="true">
                  <defs>
                    <radialGradient id="lens-sweep" cx="0" cy="0" r="1">
                      <stop offset="0" stopColor="#d4af6a" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#d4af6a" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id="lens-clip">
                      <circle cx="200" cy="200" r="170" />
                    </clipPath>
                  </defs>
                  {[170, 120, 70].map((r) => (
                    <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="rgb(236 229 214 / 0.14)" />
                  ))}
                  <path d="M30 200H370M200 30V370" stroke="rgb(236 229 214 / 0.1)" />
                  <g clipPath="url(#lens-clip)">
                    <g style={{ transform: `scale(${scale})`, transformOrigin: "200px 200px", transition: "transform 1.1s cubic-bezier(.16,1,.3,1)" }}>
                      {dots.map((d, i) =>
                        active === 2 ? (
                          <rect
                            key={i}
                            x={150 + (i % 6) * 18}
                            y={260 - (i % 6) * 14 - Math.floor(i / 6) * 4}
                            width="10"
                            height="3"
                            fill={d.hot ? "#f0d8a4" : "rgb(236 229 214 / 0.45)"}
                            style={{ transition: "all 1s cubic-bezier(.16,1,.3,1)" }}
                          />
                        ) : (
                          <circle
                            key={i}
                            cx={d.x}
                            cy={d.y}
                            r={d.hot ? 3.2 : 2}
                            fill={d.hot ? "#f0d8a4" : "rgb(236 229 214 / 0.45)"}
                          />
                        ),
                      )}
                    </g>
                    {active === 3 && (
                      <g className="origin-[200px_200px] animate-[spin_4s_linear_infinite] motion-reduce:animate-none">
                        <path d="M200 200 L370 200 A170 170 0 0 0 320 80 Z" fill="url(#lens-sweep)" transform="translate(0 0)" />
                      </g>
                    )}
                  </g>
                </svg>
                <span className="absolute bottom-0 left-0 font-mono text-[10px] tracking-[0.14em] text-mute">개념도 · 실제 통계 아님</span>
              </div>
              <div key={mode.key} className="animate-[v4-in_700ms_var(--ease-expo)_both] motion-reduce:animate-none">
                <p className="font-mono text-[12px] tracking-[0.16em] text-gold">{mode.short}</p>
                <h3 className="mt-3 text-[30px] font-extrabold tracking-[-0.04em]">{mode.name}</h3>
                <p className="mt-4 text-[16px] leading-[1.8] text-mute">{mode.desc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          {reportExtras.map((x) => (
            <div key={x.title} data-reveal className="bg-ink-2 p-8 sm:p-10">
              <h3 className="text-[22px] font-bold tracking-[-0.03em]">{x.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-mute">{x.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes v4-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
