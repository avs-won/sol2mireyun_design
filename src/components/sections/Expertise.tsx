"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SpecMark } from "@/components/ui/Spec";
import { expertise } from "@/content/ceo";

/*
 * 전문 인력 구성 — 기존 그룹 소개 아래쪽에 있던 "Expertise & Network"를 한 화면으로 분리.
 * 왼쪽 머리말, 오른쪽 부품표(BOM) 형식의 구성표.
 */
export default function Expertise() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(q(".expertise-head [data-a='rise']"), {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.1,
          scrollTrigger: { trigger: q(".expertise-head")[0], start: "top 82%" },
        });
        gsap.to(q(".bom-rule"), {
          scaleX: 1,
          duration: 1.1,
          ease: "expo.inOut",
          stagger: 0.08,
          scrollTrigger: { trigger: q(".bom")[0], start: "top 85%" },
        });
        gsap.to(q(".bom [data-a='fade']"), {
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          delay: 0.2,
          scrollTrigger: { trigger: q(".bom")[0], start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="expertise" data-section="expertise" data-theme="light" aria-labelledby="expertise-title" className="section-y screen relative border-t border-ink/10 bg-paper text-ink">
      <div className="wrap relative">
        <SpecMark no="0002-2" className="text-mute">
          Expertise &amp; Network
        </SpecMark>

        <div className="grid-12 mt-10 gap-y-10 scr:mt-[5vh]">
          <div className="expertise-head col-span-12 lg:col-span-5">
            <h2 id="expertise-title" data-a="rise" className="text-[clamp(1.9rem,3vw,3.25rem)] font-bold leading-[1.18] tracking-[-0.045em]">
              10년 이상의 전문가들이
              <br />
              <span className="font-light">기술사업화 생태계를 만듭니다</span>
            </h2>
            <p data-a="rise" className="mt-6 max-w-[34em] text-[15px] text-mute lg:text-[16px]">
              {expertise.body}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:self-end">
            <p className="mono-label mb-3 text-mute">Parts list — 전문 인력 구성</p>
            <dl className="bom">
              {expertise.parts.map((p) => (
                <div key={p.no} className="relative grid grid-cols-[2.5rem_5rem_1fr] items-baseline gap-x-3 py-5 sm:grid-cols-[3.5rem_7rem_1fr] scr:py-[2.6vh]">
                  <span className="bom-rule absolute inset-x-0 top-0 h-px origin-left bg-ink/20" data-a="scale-x" aria-hidden="true" />
                  <span className="font-mono text-[12px] text-bronze-ink" data-a="fade" aria-hidden="true">
                    {p.no}
                  </span>
                  <dt className="text-[15px] font-bold lg:text-[17px]" data-a="fade">
                    {p.head}
                  </dt>
                  <dd className="text-[15px] text-ink/85 lg:text-[17px]" data-a="fade">
                    {p.text}
                  </dd>
                </div>
              ))}
              <span className="bom-rule block h-px origin-left bg-ink/20" data-a="scale-x" aria-hidden="true" />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
