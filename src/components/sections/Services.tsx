"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SpecMark, Corners } from "@/components/ui/Spec";
import ServiceGlyph from "@/components/figures/ServiceGlyph";
import { services } from "@/content/services";

/*
  데스크톱: 왼쪽 목록에서 고르면 오른쪽 도면 시트가 바뀐다 (호버 · 클릭 · 키보드).
  모바일·태블릿: 같은 마크업이 아코디언으로 동작한다 (여러 개를 함께 펼칠 수 있음).
*/

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const [desktop, setDesktop] = useState(true);
  const hoverTimer = useRef(0);
  const prevActive = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fn = () => setDesktop(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  /* 진입 연출 */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(q(".svc-intro .mask-line > span"), {
          y: 0,
          duration: 1.2,
          stagger: 0.08,
          scrollTrigger: { trigger: q(".svc-intro")[0], start: "top 80%" },
        });
        gsap.to(q(".svc-intro [data-a='rise']"), {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          scrollTrigger: { trigger: q(".svc-intro")[0], start: "top 80%" },
        });
        gsap.to(q(".svc-head"), {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.06,
          scrollTrigger: { trigger: q(".svc-list")[0], start: "top 78%" },
        });
        gsap.to(q(".svc-sheet-frame"), {
          opacity: 1,
          duration: 1,
          scrollTrigger: { trigger: q(".svc-list")[0], start: "top 70%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /* 시트 전환 — 도면이 다시 그려지고 글이 차례로 올라온다 */
  const playPanel = useCallback((i: number) => {
    const panel = root.current?.querySelector<HTMLElement>(`#svc-panel-${i}`);
    if (!panel || window.matchMedia(MQ.reduce).matches) return;
    const q = gsap.utils.selector(panel);
    // 시트 테두리(.svc-sheet-frame)의 첫 등장 연출까지 끊지 않도록, 여기서 움직이는 요소만 정리한다
    gsap.killTweensOf(q("[data-draw], [data-a='fill'], .svc-num-roll, .svc-copy > *"));
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(q("[data-draw]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.012 }, 0)
      .fromTo(q("[data-a='fill']"), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.01 }, 0.25)
      .fromTo(q(".svc-num-roll"), { yPercent: 100 }, { yPercent: 0, duration: 0.9 }, 0)
      .fromTo(q(".svc-copy > *"), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.05);
  }, []);

  useIsoLayoutEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    if (desktop) playPanel(active);
  }, [active, desktop, playPanel]);

  /* 첫 시트는 화면에 들어올 때 그린다 */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.timeline({ scrollTrigger: { trigger: q(".svc-list")[0], start: "top 65%", once: true } }).add(() => playPanel(0));
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /* 활성 표시 막대 위치 */
  useEffect(() => {
    const list = root.current?.querySelector<HTMLElement>(".svc-list");
    const head = root.current?.querySelector<HTMLElement>(`#svc-tab-${active}`)?.closest<HTMLElement>(".svc-head");
    const ind = root.current?.querySelector<HTMLElement>(".svc-indicator");
    if (!list || !head || !ind || !desktop) return;
    const y = head.offsetTop;
    const reduce = window.matchMedia(MQ.reduce).matches;
    gsap.to(ind, { y, height: head.offsetHeight, duration: reduce ? 0 : 0.7, ease: "expo.out" });
  }, [active, desktop]);

  const select = (i: number) => {
    if (desktop) setActive(i);
    else {
      setOpen((prev) => {
        const next = new Set(prev);
        if (next.has(i)) next.delete(i);
        else {
          next.add(i);
          requestAnimationFrame(() => playPanel(i));
        }
        return next;
      });
    }
  };

  const onHover = (i: number) => {
    if (!desktop || !window.matchMedia(MQ.finePointer).matches) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(i), 110);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = services.length;
    let to = -1;
    if (e.key === "ArrowDown") to = (i + 1) % n;
    if (e.key === "ArrowUp") to = (i - 1 + n) % n;
    if (e.key === "Home") to = 0;
    if (e.key === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    root.current?.querySelector<HTMLButtonElement>(`#svc-tab-${to}`)?.focus();
    if (desktop) setActive(to);
  };

  return (
    <section ref={root} id="services" data-section="services" data-theme="light" aria-labelledby="services-title" className="section-y screen relative bg-bone text-ink">
      <div className="wrap relative">
        {/* ---------- 머리말 ---------- */}
        <div className="svc-intro grid-12 gap-y-6">
          <div className="col-span-12 lg:col-span-7">
            <SpecMark no="0003" className="text-mute">
              Core Services
            </SpecMark>
            <h2 id="services-title" className="h-section mt-8 scr:mt-[3vh]" aria-label="기술사업화의 모든 단계를, 하나의 파트너와.">
              <span className="mask-line" data-a="line" aria-hidden="true">
                <span>기술사업화의 모든 단계를,</span>
              </span>
              <span className="mask-line" data-a="line" aria-hidden="true">
                <span className="text-bronze-ink">하나의 파트너와.</span>
              </span>
            </h2>
          </div>
          <p data-a="rise" className="body-lead col-span-12 self-end text-mute lg:col-span-4 lg:col-start-9">
            권리화에서 기술이전, 마케팅, 환경분석, 사업화, 자금 전략까지. 여섯 가지 서비스가 한 흐름으로 이어집니다.
          </p>
        </div>

        {/* ---------- 목록 + 시트 ---------- */}
        <div className="svc-list relative mt-16 lg:mt-24 scr:mt-[3.2vh] lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-[clamp(32px,4vw,80px)]">
          <span className="svc-indicator pointer-events-none absolute left-0 top-0 hidden w-[3px] bg-bronze lg:block" aria-hidden="true" />
          {services.map((s, i) => {
            const isOpen = desktop ? active === i : open.has(i);
            return (
              <div key={s.no} className="contents">
                <h3 className="svc-head border-t border-ink/15 lg:col-start-1" data-a="rise" style={{ gridRow: desktop ? i + 1 : undefined }}>
                  <button
                    id={`svc-tab-${i}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`svc-panel-${i}`}
                    onClick={() => select(i)}
                    onPointerEnter={() => onHover(i)}
                    onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
                    onFocus={() => desktop && setActive(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={`svc-btn group grid w-full grid-cols-[2.75rem_1fr_auto] items-center gap-x-3 py-5 text-left lg:grid-cols-[3.5rem_1fr_auto] lg:py-6 lg:pl-6 scr:py-[1.7vh] ${isOpen ? "is-active" : ""}`}
                  >
                    <span className="font-mono text-[12px] text-bronze-ink">{s.no}</span>
                    <span>
                      <span className="block text-[clamp(1.2rem,1.9vw,1.75rem)] font-bold leading-tight tracking-[-0.035em]">{s.title}</span>
                      <span className="mono-label mt-1 block text-mute short:hidden">{s.en}</span>
                    </span>
                    <span className="svc-plus relative size-5" aria-hidden="true" />
                  </button>
                </h3>

                <div
                  id={`svc-panel-${i}`}
                  role="region"
                  aria-labelledby={`svc-tab-${i}`}
                  data-open={isOpen}
                  className="svc-panel lg:col-start-2 lg:row-start-1 lg:row-end-7"
                >
                  <div className="svc-sheet relative pb-8 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:h-full lg:p-10 scr:static scr:p-[3.2vh]">
                    <div className="svc-sheet-frame pointer-events-none absolute inset-0 hidden lg:block" data-a="fade" aria-hidden="true">
                      <Corners />
                    </div>
                    <div className="hidden items-baseline justify-between lg:flex">
                      <p className="mono-label text-mute">FIG. 3-{s.no}</p>
                      <p className="mono-label text-mute">{s.stages.join(" · ")}</p>
                    </div>

                    <div className="grid gap-x-10 gap-y-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:mt-6 lg:grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                      <div className="relative mx-auto aspect-[360/292] w-full max-w-[380px] sm:order-2 lg:order-none lg:max-w-[420px] xl:order-2">
                        <ServiceGlyph glyph={s.glyph} title={s.title} />
                      </div>
                      <div className="svc-copy relative flex flex-col sm:order-1 xl:order-1">
                        <p className="hidden overflow-hidden lg:block short:!hidden" aria-hidden="true">
                          <span className="svc-num-roll display-en block text-[clamp(4rem,6vw,6.5rem)] font-[300] scr:text-[clamp(3rem,min(6vw,8vh),6.5rem)] text-ink/90">{s.no}</span>
                        </p>
                        <p className="text-[clamp(1.35rem,2vw,1.9rem)] font-bold leading-snug tracking-[-0.04em] lg:mt-4">{s.headline}</p>
                        <p className="mt-4 text-[15px] text-ink/80 lg:text-[16px]">{s.body}</p>
                        <ul className="mt-6 border-t border-ink/15 short:mt-4">
                          {s.points.map((p) => (
                            <li key={p} className="flex gap-3 border-b border-ink/10 py-2.5 text-[14px] text-ink/85 short:py-1.5 lg:text-[15px] short:lg:text-[14px]">
                              <span className="mt-[0.7em] h-px w-3 shrink-0 bg-bronze" aria-hidden="true" />
                              {p}
                            </li>
                          ))}
                        </ul>
                        <p className="mono-label mt-5 text-bronze-ink lg:hidden">{s.stages.join(" · ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <span className="block border-t border-ink/15 lg:col-start-1" style={{ gridRow: desktop ? services.length + 1 : undefined }} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
