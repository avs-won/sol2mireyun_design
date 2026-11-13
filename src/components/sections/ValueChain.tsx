"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { registerSnapZone } from "@/lib/snap";
import { SpecMark } from "@/components/ui/Spec";
import ValueFigure, { dots, vBars, vBarPaths, vBarTop } from "@/components/figures/ValueFigure";
import { valueStages } from "@/content/value";

const LABELS = ["invent", "protect", "connect", "grow"] as const;

/** 네 단계 도면 변화를 하나의 타임라인으로 만든다 (데스크톱 · 모바일 공용) */
function buildFigure(scope: HTMLElement) {
  const q = gsap.utils.selector(scope);
  const bars = q(".v-bar");
  const h = vBars.map(() => ({ v: 0.01 }));
  const draw = (i: number) => {
    const el = bars[i];
    if (!el) return;
    const p = vBarPaths(i, h[i].v);
    el.querySelector(".bar-l")?.setAttribute("d", p.left);
    el.querySelector(".bar-r")?.setAttribute("d", p.right);
    el.querySelector(".bar-t")?.setAttribute("d", p.top);
    const [lx, ly] = vBarTop(i, h[i].v);
    const t = el.querySelector(".v-bar-label");
    t?.setAttribute("x", lx.toFixed(1));
    t?.setAttribute("y", (ly - 16).toFixed(1));
  };
  const drawAll = () => vBars.forEach((_, i) => draw(i));
  drawAll();

  gsap.set(q(".v-node"), { scale: 0, opacity: 0 });
  gsap.set(q(".v-bar-label, .v-claim-label, .v-dim-label, .v-bar"), { opacity: 0 });
  gsap.set(q(".v-dot"), { x: (i: number) => dots[i].dx, y: (i: number) => dots[i].dy, opacity: 0 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: 1 } });

  // 4A INVENT — 흩어진 점이 격자로, 판과 중심 원이 그려진다
  tl.to(q(".v-base .po"), { strokeDashoffset: 0, duration: 0.8 }, 0)
    .to(q(".v-base [data-a='fill']"), { opacity: 1, duration: 0.5 }, 0.2)
    .to(q(".v-dot"), { x: 0, y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: { each: 0.012, from: "random" } }, 0.15)
    .to(q(".v-core [data-draw]"), { strokeDashoffset: 0, duration: 0.7, stagger: 0.12 }, 0.35)
    .addLabel("invent", 1.1)
    // 4B PROTECT — 경계, 해칭, 벽
    .to(q(".v-claim-line"), { strokeDashoffset: 0, duration: 0.6 }, "invent+=0.6")
    .to(q(".v-hatch"), { strokeDashoffset: 0, duration: 0.5, stagger: 0.025 }, "invent+=0.75")
    .to(q(".v-wall"), { strokeDashoffset: 0, duration: 0.45, stagger: 0.06 }, "invent+=1.05")
    .to(q(".v-claim-label"), { opacity: 1, duration: 0.3 }, "invent+=1.25")
    .to(q(".v-dots"), { opacity: 0.45, duration: 0.5 }, "invent+=0.8")
    .addLabel("protect", "invent+=1.7")
    // 4C CONNECT — 바깥으로 선이 뻗어 기관에 닿는다
    .to(q(".v-claim-label"), { opacity: 0, duration: 0.25 }, "protect+=0.55")
    .to(q(".v-link"), { strokeDashoffset: 0, duration: 0.7, stagger: 0.08 }, "protect+=0.65")
    .to(q(".v-node"), { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)", stagger: 0.08 }, "protect+=1.05")
    .to(q(".v-hatch"), { opacity: 0.45, duration: 0.4 }, "protect+=0.7")
    .addLabel("connect", "protect+=1.75")
    // 4D GROW — 판 위로 기둥이 솟는다
    .to(q(".v-net"), { opacity: 0.35, duration: 0.4 }, "connect+=0.6")
    .to(q(".v-nodes"), { opacity: 0.5, duration: 0.4 }, "connect+=0.6")
    .to(q(".v-walls, .v-claim"), { opacity: 0.25, duration: 0.4 }, "connect+=0.6")
    .to(q(".v-dots"), { opacity: 0.18, duration: 0.4 }, "connect+=0.6")
    .to(q(".v-bar"), { opacity: 1, duration: 0.2, stagger: 0.09 }, "connect+=0.72")
    .to(h, { v: (i: number) => vBars[i].h, duration: 0.9, ease: "power3.out", stagger: 0.09, onUpdate: drawAll }, "connect+=0.75")
    .to(q(".v-bar-label"), { opacity: 1, duration: 0.3, stagger: 0.09 }, "connect+=1.2")
    .to(q(".v-dim-line"), { strokeDashoffset: 0, duration: 0.6, stagger: 0.1 }, "connect+=1.05")
    .to(q(".v-dim-label"), { opacity: 1, duration: 0.3 }, "connect+=1.5")
    .addLabel("grow", "connect+=1.8")
    .to({}, { duration: 0.6 });

  return tl;
}

export default function ValueChain() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      /* ---------- 데스크톱: 화면을 고정하고 스크롤로 장면을 넘긴다 ---------- */
      mm.add(MQ.desktop, () => {
        el.classList.add("v-cinema");
        const tl = buildFigure(el);
        const blocks = q(".v-block");
        // 단어는 마크업에서 이미 글자 단위로 나뉘어 있다 (.v-char)
        const words = q(".v-word").map((w) => ({ chars: Array.from(w.querySelectorAll(".v-char")) }));
        const stops = q(".v-stop");
        const fill = q(".v-rail-fill")[0];

        gsap.set(blocks.slice(1), { opacity: 0, y: 40 });
        words.forEach((s, i) => gsap.set(s.chars, { yPercent: i === 0 ? 0 : 110 }));
        gsap.set(q(".v-block-0 .v-in"), { opacity: 0, y: 30 });
        gsap.set(words[0].chars, { yPercent: 110 });

        // 첫 장면의 글은 판이 그려지는 동안 들어온다
        tl.to(words[0].chars, { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.03 }, 0.2).to(
          q(".v-block-0 .v-in"),
          { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.06 },
          0.35,
        );

        // 장면 전환: 단어는 글자 단위로 올라가 사라지고 다음 단어가 아래에서 올라온다
        for (let i = 1; i < 4; i++) {
          const at = `${LABELS[i - 1]}+=0.35`;
          tl.to(words[i - 1].chars, { yPercent: -110, duration: 0.45, ease: "power3.in", stagger: 0.02 }, at)
            .to(blocks[i - 1], { opacity: 0, y: -40, duration: 0.45, ease: "power2.in" }, at)
            .to(words[i].chars, { yPercent: 0, duration: 0.6, ease: "expo.out", stagger: 0.03 }, `${LABELS[i - 1]}+=0.8`)
            .to(blocks[i], { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, `${LABELS[i - 1]}+=0.75`);
        }

        const total = tl.duration();
        const pin = ScrollTrigger.create({
          trigger: q(".v-scene")[0],
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 3.2)}`,
          pin: true,
          anticipatePin: 1,
        });

        const lp = LABELS.map((l) => tl.labels[l] / total);
        const st = ScrollTrigger.create({
          trigger: q(".v-scene")[0],
          start: "top 55%",
          end: () => pin.end,
          // 장면 사이는 lib/snap.ts 가 한 번에 넘긴다 — 지연을 줄여 도착과 함께 장면이 맞춰지게
          scrub: 0.5,
          animation: tl,
          // 장면 정지점 맞춤은 Lenis 쪽(lib/snap.ts)이 맡는다.
          // ScrollTrigger snap은 Lenis와 서로 스크롤을 당겨 멈출 때 떨림이 생겼다.
          onUpdate: (self) => {
            const p = self.progress;
            let f = 0;
            if (p >= lp[3]) f = 1;
            else if (p > lp[0]) {
              const k = p < lp[1] ? 0 : p < lp[2] ? 1 : 2;
              f = (k + (p - lp[k]) / (lp[k + 1] - lp[k])) / 3;
            }
            if (fill) fill.style.transform = `scaleX(${f.toFixed(4)})`;
            let cur = 0;
            lp.forEach((x, i) => p >= x - 0.04 && (cur = i));
            stops.forEach((s, i) => s.classList.toggle("is-on", i <= cur));
          },
        });

        // 장면 정지점 = 각 장면이 완성되는 위치 (고정이 시작되기 전 지점은 고정 시작선으로).
        // 마지막 장면 다음은 곧바로 다음 섹션으로 넘어간다.
        const unzone = registerSnapZone("value", () => {
          const pts = lp.map((x) => Math.max(pin.start, Math.round(st.start + (st.end - st.start) * x)));
          return Array.from(new Set([pin.start, ...pts]));
        });

        // 진행 표시를 누르면 해당 장면으로 이동
        const handlers = stops.map((s, i) => {
          const fn = () => {
            const y = st.start + (st.end - st.start) * lp[i];
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(y, { duration: 1.2 });
            else window.scrollTo({ top: y, behavior: "smooth" });
          };
          s.addEventListener("click", fn);
          return fn;
        });

        return () => {
          unzone();
          stops.forEach((s, i) => s.removeEventListener("click", handlers[i]));
          el.classList.remove("v-cinema");
        };
      });

      /* ---------- 모바일 · 태블릿: 도면은 위에 붙어 있고 글이 지나가며 장면을 바꾼다 ---------- */
      mm.add(MQ.compact, () => {
        const tl = buildFigure(el);
        let tween: gsap.core.Tween | null = null;
        const go = (label: string) => {
          tween?.kill();
          tween = tl.tweenTo(label, { duration: 1.3, ease: "power2.inOut" });
        };
        q(".v-block").forEach((b, i) => {
          ScrollTrigger.create({
            trigger: b,
            start: "top 62%",
            end: "bottom 62%",
            onEnter: () => go(LABELS[i]),
            onEnterBack: () => go(LABELS[i]),
          });
          gsap.from(b.querySelectorAll(".v-in, .v-word"), {
            opacity: 0,
            y: 26,
            duration: 0.9,
            stagger: 0.06,
            scrollTrigger: { trigger: b, start: "top 80%" },
          });
        });
        return () => tween?.kill();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="value" data-section="value" data-theme="dark" aria-labelledby="value-title" className="v-section relative bg-ink text-paper">
      <div className="v-scene relative">
        <div className="arch-grid hidden lg:block" style={{ ["--grid-c" as string]: "color-mix(in srgb, var(--color-paper) 4%, transparent)" }} />
        <div className="v-inner wrap relative">
          {/* 머리말 */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <SpecMark no="0004" className="text-paper/60">
              From Invention to Value
            </SpecMark>
            <p className="mono-label text-paper/55">One-stop 창업 → 해외진출 Non-stop 컨설팅</p>
          </div>
          <h2 id="value-title" className="mt-6 max-w-[22em] text-[clamp(1.6rem,2.6vw,2.6rem)] font-bold leading-[1.25] tracking-[-0.04em] lg:mt-5">
            기술은 특허가 되고, <span className="text-bronze-light">특허는 자금이 됩니다.</span>
          </h2>

          {/* 장면 */}
          <div className="v-body relative">
            <div className="v-figure-wrap">
              <div className="relative h-full w-full">
                <ValueFigure />
              </div>
            </div>

            <div className="v-stack relative">
              {valueStages.map((s, i) => (
                <article key={s.key} className={`v-block v-block-${i}`} aria-labelledby={`v-title-${i}`}>
                  <p className="v-in flex items-baseline gap-4 font-mono text-[12px] tracking-[0.06em] text-paper/55">
                    <span className="text-bronze-light">FIG. {s.fig}</span>
                    <span>
                      {String(i + 1).padStart(2, "0")} / 04
                    </span>
                  </p>
                  <p className="v-word display-en mt-4 flex text-[clamp(2.75rem,5.2vw,6rem)] font-[650] text-paper" aria-hidden="true">
                    {s.key.split("").map((c, k) => (
                      <span key={k} className="inline-block overflow-hidden pb-[0.04em]">
                        <span className="v-char inline-block">{c}</span>
                      </span>
                    ))}
                  </p>
                  <h3 id={`v-title-${i}`} className="v-in mt-5 text-[clamp(1.3rem,1.7vw,1.7rem)] font-bold leading-snug tracking-[-0.035em]">
                    <span className="mono-label mr-3 align-middle text-bronze-light">{s.kr}</span>
                    <span className="block sm:inline">{s.title}</span>
                  </h3>
                  <p className="v-in mt-4 max-w-[30em] text-[15px] text-paper/75 lg:text-[16px]">{s.body}</p>

                  {"rating" in s && s.rating ? (
                    <table className="v-in mt-6 w-full max-w-[30em] border-collapse text-left text-[14px] lg:text-[15px]">
                      <caption className="sr-only">특허 보유 상태별 자금 전략 평가</caption>
                      <tbody>
                        {s.rating.map((r) => (
                          <tr key={r.label} className="border-t border-paper/15 last:border-b">
                            <th scope="row" className="py-3 pr-4 font-medium text-paper/85">
                              {r.label}
                            </th>
                            <td className="py-3 text-right">
                              {r.stars > 0 ? (
                                <span className="tracking-[0.2em] text-bronze-light" aria-label={`별 ${r.stars}개`}>
                                  {"★".repeat(r.stars)}
                                  <span className="text-paper/20">{"★".repeat(5 - r.stars)}</span>
                                </span>
                              ) : (
                                <span className="text-[13px] text-paper/60">보완 필요</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                  {"rating" in s && s.rating ? (
                    <p className="v-in mt-3 text-[13px] text-paper/55">출원·등록 특허가 없다면 — 등록 특허 양수 · 실시권 취득 · 신규 출원으로 보완합니다.</p>
                  ) : null}

                  {s.facts.length > 0 && (
                    <ul className="v-in mt-6 flex max-w-[32em] flex-wrap gap-2">
                      {s.facts.map((f) => (
                        <li key={f} className="rounded-full border border-paper/20 px-3.5 py-1.5 text-[13px] text-paper/80">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>

          {/* 진행 표시 (데스크톱) */}
          <div className="v-rail relative" aria-hidden="true">
            <span className="absolute inset-x-0 top-[5px] h-px bg-paper/15" />
            <span className="v-rail-fill absolute inset-x-0 top-[5px] h-px origin-left scale-x-0 bg-bronze-light" />
            <ol className="relative h-9">
              {valueStages.map((s, i) => (
                <li key={s.key} className="absolute top-0" style={{ left: `${(i / 3) * 100}%`, transform: `translateX(${-(i / 3) * 100}%)` }}>
                  <button type="button" tabIndex={-1} className={`v-stop group flex flex-col gap-2 whitespace-nowrap ${i === 0 ? "items-start" : i === 3 ? "items-end" : "items-center"}`} data-i={i}>
                    <span className="v-stop-dot block size-[11px] rounded-full border border-paper/40 bg-ink transition-colors" />
                    <span className="font-mono text-[11px] tracking-[0.08em] text-paper/50 transition-colors group-hover:text-paper">
                      {s.fig} {s.key}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
