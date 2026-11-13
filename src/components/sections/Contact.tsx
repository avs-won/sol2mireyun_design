"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SpecMark } from "@/components/ui/Spec";
import MagneticButton from "@/components/ui/MagneticButton";
import ContactForm from "./ContactForm";
import { contact } from "@/content/site";
import { plate, isoCircle, fmt } from "@/lib/iso";

/* FIG. 10 — 아직 그려지지 않은 도면. 점선이 천천히 흐르며 다음 도면을 기다린다. */
function EmptyFigure() {
  const g = plate(92, 16);
  const c = isoCircle(0, 0, 16, 34);
  return (
    <svg className="fig empty-fig block h-full w-full" viewBox="-200 -150 400 260" aria-hidden="true">
      <path className="ef-dash" d={g.outline} />
      <ellipse className="ef-dash ef-core" cx={fmt(c.cx)} cy={fmt(c.cy)} rx={fmt(c.rx)} ry={fmt(c.ry)} />
      <line className="ef-axis" x1="0" x2="0" y1="96" y2="-140" />
      <text className="ef-cap" x="0" y="-122" textAnchor="middle">
        ?
      </text>
    </svg>
  );
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%" } });
        tl.to(q(".ct-head .mask-line > span"), { y: 0, duration: 1.2, stagger: 0.1 })
          .to(q(".ct-head [data-a='rise']"), { opacity: 1, y: 0, duration: 1, stagger: 0.07 }, 0.25)
          .to(q(".ct-fig"), { opacity: 1, duration: 1.4, ease: "power2.out" }, 0)
          .to(q(".ct-form"), { opacity: 1, y: 0, duration: 1.1 }, 0.35);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" data-section="contact" data-theme="dark" aria-labelledby="contact-title" className="section-y screen relative overflow-hidden bg-ink text-paper">
      <div className="arch-grid hidden lg:block" style={{ ["--grid-c" as string]: "color-mix(in srgb, var(--color-paper) 4%, transparent)" }} />
      <div className="wrap grid-12 relative gap-y-16">
        <div className="ct-head col-span-12 lg:col-span-6">
          <div className="flex items-center justify-between gap-6">
            <SpecMark no="0009" className="text-paper/60">
              Contact
            </SpecMark>
          </div>

          <div className="ct-fig relative mt-8 aspect-[400/260] w-full max-w-[360px] scr:hidden" data-a="fade">
            <EmptyFigure />
            <p className="mono-label absolute bottom-0 left-0 text-paper/55">FIG. 10 — 작성 예정</p>
          </div>

          <h2 id="contact-title" className="h-statement ct-title mt-8 scr:mt-[4vh]" aria-label="다음 도면은 귀사의 기술입니다.">
            <span className="mask-line" data-a="line" aria-hidden="true">
              <span className="font-light">다음 도면은</span>
            </span>
            <span className="mask-line" data-a="line" aria-hidden="true">
              <span>
                귀사의 <span className="text-bronze-light">기술</span>입니다.
              </span>
            </span>
          </h2>
          <p data-a="rise" className="body-lead mt-7 max-w-[32em] text-paper/75 scr:mt-[3vh]">
            기술 정비로 기업 가치를 높이고, 사업화 전략과 IP를 근거로 한 자금 확보·투자 전략까지. 궁금한 점은 언제든 문의해 주세요. 친절하고 성실한 상담과 답변을 약속드립니다.
          </p>

          <div data-a="rise" className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 scr:mt-[3.5vh]">
            <MagneticButton href={contact.phoneHref} variant="bronze" ariaLabel={`전화 상담 ${contact.phone}`}>
              전화 상담 {contact.phone}
            </MagneticButton>
            <a href={contact.emailHref} className="link-u text-paper/90 hover:text-paper">
              이메일 보내기
            </a>
          </div>

          <dl data-a="rise" className="mt-12 grid grid-cols-[4rem_1fr] gap-x-4 gap-y-3 border-t border-paper/15 pt-6 text-[15px] scr:mt-[4.5vh] scr:gap-y-2">
            <dt className="text-paper/55">전화</dt>
            <dd>
              <a className="hover:text-bronze-light" href={contact.phoneHref}>
                {contact.phone}
              </a>
            </dd>
            <dt className="text-paper/55">팩스</dt>
            <dd>{contact.fax}</dd>
            <dt className="text-paper/55">이메일</dt>
            <dd>
              <a className="break-all hover:text-bronze-light" href={contact.emailHref}>
                {contact.email}
              </a>
            </dd>
            <dt className="text-paper/55">주소</dt>
            <dd>
              {contact.address}
              {contact.mapHref && (
                <a className="link-u ml-3 text-[13px] text-bronze-light" href={contact.mapHref} target="_blank" rel="noopener noreferrer">
                  지도 보기<span className="sr-only"> (네이버 지도, 새 창)</span>
                </a>
              )}
            </dd>
          </dl>
        </div>

        <div className="ct-form col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-24 scr:self-center scr:pt-0" data-a="rise">
          <div className="relative border border-paper/15 bg-ink-2/60 p-6 sm:p-9 scr:p-[3.4vh]">
            <p className="mono-label mb-8 flex justify-between text-paper/55 scr:mb-[2.6vh]">
              <span>문의 남기기</span>
              <span className="text-bronze-light">* 필수</span>
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
