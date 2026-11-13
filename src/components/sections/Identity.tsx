"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SpecMark } from "@/components/ui/Spec";
import { entities } from "@/content/site";

/*
 * 그룹 소개 — 한 화면: 왼쪽 선언문 + Sol2의 뜻, 오른쪽 조직도.
 * (전문 인력 구성은 별도 섹션 Expertise.tsx)
 */
export default function Identity() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        /* 1. 선언문 — 교정선이 지나가며 글자를 드러낸다 */
        gsap
          .timeline({ scrollTrigger: { trigger: q(".statement")[0], start: "top 85%" }, defaults: { ease: "power3.inOut" } })
          .fromTo(q(".st-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, stagger: 0.15 }, 0)
          .fromTo(q(".st-text"), { clipPath: "inset(-10% 100% -10% 0%)" }, { clipPath: "inset(-10% 0% -10% 0%)", duration: 0.9, stagger: 0.15 }, 0.08);

        /* 2. Sol2 — 해칭이 흐르며 그림자가 드리운다 */
        gsap.to(q(".glyph-two"), {
          backgroundPosition: "60px 0px",
          ease: "none",
          scrollTrigger: { trigger: q(".glyph")[0], start: "top bottom", end: "bottom top", scrub: 0.5 },
        });
        gsap.from(q(".glyph-part"), {
          yPercent: 30,
          opacity: 0,
          duration: 1.3,
          stagger: 0.12,
          scrollTrigger: { trigger: q(".glyph")[0], start: "top 85%" },
        });
        gsap.to(q(".glyph-note [data-a='scale-y']"), {
          scaleY: 1,
          duration: 0.9,
          ease: "power3.inOut",
          stagger: 0.12,
          delay: 0.3,
          scrollTrigger: { trigger: q(".glyph")[0], start: "top 85%" },
        });
        // 문단(p.glyph-note) 자체에 data-a가 붙어 있어 자손 선택자만으로는 잡히지 않는다
        gsap.to(q(".glyph-note [data-a='rise'], .glyph-note[data-a='rise']"), {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          delay: 0.45,
          scrollTrigger: { trigger: q(".glyph")[0], start: "top 85%" },
        });

        /* 3. 조직도 — 줄기가 자라고 가지가 뻗어 각 법인에 닿는다 (한 번만) */
        const tree = gsap.timeline({ scrollTrigger: { trigger: q(".tree")[0], start: "top 80%" }, defaults: { ease: "power2.out" } });
        tree.fromTo(q(".tree-root"), { opacity: 0.15 }, { opacity: 1, duration: 0.4 }, 0).to(q(".trunk"), { scaleY: 1, duration: 1.2, ease: "power2.inOut" }, 0.1);
        q(".tree-item").forEach((item, i) => {
          tree
            .to(item.querySelector(".branch"), { scaleX: 1, duration: 0.4 }, 0.35 + i * 0.3)
            .fromTo(item.querySelector(".tree-body"), { opacity: 0.12, x: -16 }, { opacity: 1, x: 0, duration: 0.6 }, 0.5 + i * 0.3);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="group" data-section="group" data-theme="light" aria-labelledby="group-title" className="section-y screen relative bg-paper text-ink">
      <div className="arch-grid hidden lg:block" />
      <div className="wrap relative">
        <div className="flex items-baseline justify-between gap-6">
          <SpecMark no="0002" className="text-mute">
            미래연 그룹
          </SpecMark>
          <p className="mono-label hidden text-mute sm:block">Sol + 2 = Sol2 Mireyun Group</p>
        </div>

        <div className="grid-12 mt-10 gap-y-16 scr:mt-[4vh]">
          {/* ---------- 선언문 + Sol2 ---------- */}
          <div className="col-span-12 lg:col-span-7">
            <h2 id="group-title" className="statement id-statement max-w-[15em]" aria-label="태양처럼 빛나도록, 그림자처럼 늘 곁에서.">
              {["태양처럼 빛나도록,", "그림자처럼 늘 곁에서."].map((t, i) => (
                <span key={i} className="relative block pb-[0.08em]" aria-hidden="true">
                  <span className="st-text block">{t}</span>
                  <span className="st-rule absolute bottom-0 left-0 h-[2px] w-full origin-left bg-bronze/70" />
                </span>
              ))}
            </h2>

            <div className="glyph-wrap id-glyph mt-12 scr:mt-[5vh]">
              <div className="glyph relative select-none" aria-hidden="true">
                <span className="glyph-part glyph-sol">Sol</span>
                <span className="glyph-part glyph-two">2</span>
              </div>
            </div>
            <dl className="glyph-note mt-2 grid max-w-[640px] grid-cols-[1.25fr_1fr] gap-x-6 sm:gap-x-10">
              <div className="relative pt-10 scr:pt-[4vh]">
                <span className="absolute left-[18%] top-0 h-8 w-px origin-top bg-ink/40 scr:h-[3.2vh]" data-a="scale-y" />
                <dt data-a="rise" className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="font-mono text-[12px] text-bronze-ink">11</span>
                  <span className="text-[17px] font-bold sm:text-[18px] lg:text-[20px]">Sol은 태양입니다.</span>
                </dt>
                <dd data-a="rise" className="mt-1.5 text-[15px] text-mute lg:text-[16px]">
                  기업·연구소·대학이 태양처럼 밝게 빛나도록.
                </dd>
              </div>
              <div className="relative pt-10 scr:pt-[4vh]">
                <span className="absolute left-[30%] top-0 h-8 w-px origin-top bg-ink/40 scr:h-[3.2vh]" data-a="scale-y" />
                <dt data-a="rise" className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="font-mono text-[12px] text-bronze-ink">12</span>
                  <span className="text-[17px] font-bold sm:text-[18px] lg:text-[20px]">2는 그림자입니다.</span>
                </dt>
                <dd data-a="rise" className="mt-1.5 text-[15px] text-mute lg:text-[16px]">
                  그림자처럼 항상 곁을 지킨다는 뜻입니다.
                </dd>
              </div>
            </dl>
            <p data-a="rise" className="glyph-note mt-8 max-w-[640px] border-t border-ink/15 pt-4 text-[15px] text-ink/80 scr:mt-[3.5vh] lg:text-[16px]">
              <b className="font-semibold text-ink">Sol2(솔투)</b>, 즉 소금의 역할을 다한다는 것이 미래연 그룹의 모토입니다.
            </p>
          </div>

          {/* ---------- 조직도 ---------- */}
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-center">
            <div className="tree relative">
              <p className="tree-root flex items-baseline justify-between gap-4 border-b border-ink pb-3">
                <span className="text-[20px] font-bold tracking-[-0.03em] lg:text-[22px]">미래연 그룹</span>
                <span className="mono-label text-mute">{entities.length} entities</span>
              </p>
              <span className="trunk absolute bottom-[4.5rem] left-[7px] top-[3.25rem] w-px origin-top bg-ink/50" data-a="scale-y" aria-hidden="true" />
              <ol className="mt-8 space-y-9 scr:mt-[3.5vh] scr:space-y-[4.2vh]">
                {entities.map((e) => (
                  <li key={e.code} className="tree-item relative grid grid-cols-[48px_1fr] items-start">
                    <span className="branch relative mt-[13px] h-px w-[40px] origin-left bg-ink/50" data-a="scale-x" aria-hidden="true">
                      <span className="absolute -left-[3px] -top-[3px] size-[7px] rounded-full bg-paper ring-1 ring-ink/60" />
                    </span>
                    <div className="tree-body">
                      <p className="flex items-baseline gap-3">
                        <span className="font-mono text-[12px] text-bronze-ink">{e.code}</span>
                        <span className="mono-label text-mute">{e.role}</span>
                      </p>
                      <h3 className="mt-1 text-[21px] font-bold leading-snug tracking-[-0.035em] lg:text-[23px]">{e.name}</h3>
                      <p className="mt-1.5 text-[15px] text-mute lg:text-[16px]">{e.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
