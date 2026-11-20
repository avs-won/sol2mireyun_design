"use client";

import { useState } from "react";
import { resultFields, resultGroups, resultTotal } from "@/content/results";
import { SectionHead } from "@/drafts/v3/components/ui";

type Key = "all" | (typeof resultGroups)[number]["key"];
const PREVIEW = 15;

/** 07 — 수행 실적. 내부 스크롤 대신 "전체 보기"로 펼친다 (MASTER §6). */
export default function Results() {
  const [key, setKey] = useState<Key>("all");
  const [expanded, setExpanded] = useState(false);

  const rows = resultGroups.flatMap((g) => g.items.map((title) => ({ title, group: g.short, key: g.key })));
  const filtered = key === "all" ? rows : rows.filter((r) => r.key === key);
  const shown = expanded ? filtered : filtered.slice(0, PREVIEW);
  const tabs: { key: Key; label: string; n: number }[] = [
    { key: "all", label: "전체", n: resultTotal },
    ...resultGroups.map((g) => ({ key: g.key as Key, label: g.short, n: g.items.length })),
  ];

  return (
    <section id="results" aria-labelledby="results-title" className="section-y border-t border-border bg-surface">
      <div className="wrap">
        <SectionHead
          no="06"
          label="Track Record"
          titleId="results-title"
          title={
            <>
              {resultTotal}건의 수행 실적이
              <br />
              말해 주는 것.
            </>
          }
          intro={<p>{resultFields} 기존 홈페이지에 공개된 목록을 그대로 옮겼습니다.</p>}
        />

        <div className="mt-14 lg:mt-20">
          <div className="flex flex-wrap gap-2" role="group" aria-label="분류 필터">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={key === t.key}
                onClick={() => {
                  setKey(t.key);
                  setExpanded(false);
                }}
                className={`min-h-11 border px-4 text-[15px] font-medium transition-colors duration-200 ${
                  key === t.key ? "border-fg bg-fg text-white" : "border-border bg-bg text-fg hover:border-fg"
                }`}
              >
                {t.label} <span className="garamond ml-1 text-[16px] opacity-80">{t.n}</span>
              </button>
            ))}
          </div>

          <ol className="mt-8 border-t border-fg md:columns-2 md:gap-12" aria-live="polite">
            {shown.map((r, i) => (
              <li key={`${r.key}-${r.title}`} className="grid break-inside-avoid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-border py-4">
                <span className="garamond pt-0.5 text-[16px] text-muted-fg">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-medium leading-snug">{r.title}</span>
                  {key === "all" && <span className="mt-1 block text-[13px] text-muted-fg">{r.group}</span>}
                </span>
              </li>
            ))}
          </ol>

          {filtered.length > PREVIEW && (
            <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="btn btn-line mt-8">
              {expanded ? "접기" : `전체 ${filtered.length}건 보기`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
