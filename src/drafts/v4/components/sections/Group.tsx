"use client";

import { useRef } from "react";
import { SectionHead, useSectionMotion } from "@/drafts/v4/components/ui";
import { entities } from "@/content/site";
import { expertise } from "@/content/ceo";

/** 그룹 소개 — 한 그룹, 세 법인 + 전문 인력 구성 */
export default function Group() {
  const root = useRef<HTMLElement>(null);
  useSectionMotion(root);

  return (
    <section ref={root} id="group" className="section bg-ink-2" aria-labelledby="group-title">
      <div className="wrap">
        <SectionHead
          id="group-title"
          no="07"
          eyebrow="Sol2 Mireyun Group"
          title={
            <>
              한 그룹, 세 법인이
              <br />
              하나의 흐름으로.
            </>
          }
          lead={expertise.body}
        />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] lg:grid-cols-3">
          {entities.map((e) => (
            <li key={e.code} data-reveal className="group relative overflow-hidden bg-ink p-8 sm:p-10">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
              <p className="flex items-center justify-between font-mono text-[12px] tracking-[0.16em] text-gold">
                <span>{e.code}</span>
                <span className="rounded-full border border-gold/40 px-2.5 py-0.5 text-[11px]">{e.role}</span>
              </p>
              <h3 className="mt-10 text-[24px] font-bold tracking-[-0.03em]">{e.name}</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-mute">{e.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <h3 className="text-[clamp(24px,2.4vw,34px)] font-bold leading-snug tracking-[-0.03em] lg:col-span-4" data-reveal>
            {expertise.title}
          </h3>
          <dl className="border-t border-[var(--line)] lg:col-span-8">
            {expertise.parts.map((p) => (
              <div key={p.no} data-reveal className="grid gap-2 border-b border-[var(--line)] py-5 sm:grid-cols-[140px_1fr]">
                <dt className="flex items-center gap-3 text-[16px] font-semibold">
                  <span className="font-mono text-[11px] text-gold">{p.no}</span>
                  {p.head}
                </dt>
                <dd className="text-[16px] text-ivory/80">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
