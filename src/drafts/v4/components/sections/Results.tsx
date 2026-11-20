"use client";

import { useRef, useState } from "react";
import { SectionHead, useSectionMotion } from "@/drafts/v4/components/ui";
import { resultGroups, resultTotal } from "@/content/results";

/** 수행 실적 전체 목록 — 분류 필터 + 처음엔 일부만, 펼치면 전체 */
export default function Results() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<"all" | (typeof resultGroups)[number]["key"]>("all");
  const [expanded, setExpanded] = useState(false);
  useSectionMotion(root);

  const items = resultGroups.flatMap((g) => (filter === "all" || filter === g.key ? g.items.map((t) => ({ t, g: g.short })) : []));
  const shown = expanded ? items : items.slice(0, 12);

  const tabs = [{ key: "all" as const, short: "전체", n: resultTotal }, ...resultGroups.map((g) => ({ key: g.key, short: g.short, n: g.items.length }))];

  return (
    <section ref={root} id="results" className="section" aria-labelledby="results-title">
      <div className="wrap">
        <SectionHead
          id="results-title"
          no="08"
          eyebrow="Track Record"
          title={
            <>
              <span className="num gold-text">{resultTotal}</span>건의 기술이
              <br />
              이미 길을 찾았습니다.
            </>
          }
          lead="기존 홈페이지 실적표에 실린 컨설팅 과제 전체입니다. 분류를 골라 보실 수 있습니다."
        />

        <div className="mt-14 flex flex-wrap gap-2" role="group" aria-label="실적 분류" data-reveal>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={filter === t.key}
              onClick={() => {
                setFilter(t.key);
                setExpanded(false);
              }}
              className={`min-h-[44px] rounded-full border px-5 text-[15px] transition-colors duration-200 ${
                filter === t.key ? "border-gold bg-gold text-ink" : "border-[var(--line-strong)] text-ivory/80 hover:border-gold hover:text-gold-2"
              }`}
            >
              {t.short} <span className="ml-1 font-mono text-[12px] opacity-70">{t.n}</span>
            </button>
          ))}
        </div>

        <ul className="mt-8 grid border-t border-[var(--line)] md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          {shown.map((x, i) => (
            <li
              key={`${filter}-${x.t}`}
              className="flex items-baseline gap-4 border-b border-[var(--line)] py-4 pr-6 text-[16px] animate-[v4-in_600ms_var(--ease-expo)_both] motion-reduce:animate-none"
              style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
            >
              <span className="w-8 shrink-0 font-mono text-[11px] text-gold">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1">{x.t}</span>
              <span className="hidden shrink-0 text-[12px] text-mute sm:block">{x.g}</span>
            </li>
          ))}
        </ul>

        {items.length > 12 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="btn btn-ghost mt-10"
          >
            {expanded ? "접기" : `나머지 ${items.length - 12}건 더 보기`}
          </button>
        )}
      </div>
      <style>{`@keyframes v4-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
    </section>
  );
}
