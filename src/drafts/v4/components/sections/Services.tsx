"use client";

import { useRef } from "react";
import { SectionHead, useSectionMotion, ArrowIcon } from "@/drafts/v4/components/ui";
import { scrollToId } from "@/drafts/v4/components/SmoothScroll";
import { services } from "@/content/services";

export const TOPIC_EVENT = "v4:topic";

/** 6대 서비스 — 카드 위로 커서를 따라가는 빛, '이 분야 상담하기'는 문의 폼의 분야를 미리 고른다 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  useSectionMotion(root);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".spot-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--cx", `${e.clientX - r.left}px`);
    card.style.setProperty("--cy", `${e.clientY - r.top}px`);
  };

  const ask = (title: string) => {
    window.dispatchEvent(new CustomEvent(TOPIC_EVENT, { detail: title }));
    scrollToId("contact");
  };

  return (
    <section ref={root} id="services" className="section" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHead
          id="services-title"
          no="03"
          eyebrow="Services"
          title={
            <>
              기술이 <span className="serif-it text-gold">권리</span>가 되고,
              <br />
              권리가 <span className="serif-it text-gold">자금</span>이 되도록.
            </>
          }
          lead="출원 한 건부터 기술거래 · 투자 유치까지, 필요한 단계만 골라 맡기실 수 있습니다. 여섯 분야 모두 같은 팀이 이어서 진행합니다."
        />

        <ul className="spot-grid mt-16 grid gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 xl:grid-cols-3" onPointerMove={onMove}>
          {services.map((s) => (
            <li key={s.no} data-reveal className="spot-card group flex flex-col p-8 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <span className="num text-[64px] leading-none text-ivory/15 transition-colors duration-500 group-hover:text-gold/70">{s.no}</span>
                <span className="mt-2 font-mono text-[11px] tracking-[0.16em] text-mute">{s.en.toUpperCase()}</span>
              </div>
              <h3 className="mt-10 text-[24px] font-bold tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-2 text-[17px] font-medium text-gold-2">{s.headline}</p>
              <p className="mt-4 text-[15px] leading-[1.75] text-mute">{s.body}</p>
              <ul className="mt-6 space-y-2 border-t border-[var(--line)] pt-6">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[15px] text-ivory/80">
                    <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => ask(s.title)}
                className="mt-auto flex min-h-[48px] items-center gap-2 self-start pt-8 text-[15px] font-semibold text-ivory transition-colors hover:text-gold-2"
              >
                이 분야 상담하기
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
