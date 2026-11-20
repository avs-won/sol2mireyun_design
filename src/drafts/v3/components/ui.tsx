import type { ReactNode } from "react";

/** 섹션 머리 — 번호 · 영문 라벨 · 세리프 제목 · 소개 (12단 그리드 왼쪽 정렬) */
export function SectionHead({
  no,
  label,
  title,
  titleId,
  intro,
  dark = false,
  aside,
}: {
  no: string;
  label: string;
  title: ReactNode;
  titleId: string;
  intro?: ReactNode;
  dark?: boolean;
  aside?: ReactNode;
}) {
  return (
    <div className="grid-12 gap-y-6">
      <p
        data-reveal
        className={`col-span-12 flex items-baseline gap-3 border-t pt-4 eyebrow ${dark ? "border-white/20 text-gold" : "border-fg text-primary"}`}
      >
        <span className="garamond text-[15px] tracking-normal">{no}</span>
        <span>{label}</span>
      </p>
      <h2 id={titleId} data-reveal className="h-section col-span-12 lg:col-span-7">
        {title}
      </h2>
      {intro && (
        <div
          data-reveal
          style={{ ["--i" as string]: 1 }}
          className={`col-span-12 lead lg:col-span-5 lg:pt-3 ${dark ? "text-white/75" : "text-muted-fg"}`}
        >
          {intro}
        </div>
      )}
      {aside}
    </div>
  );
}

export function Arrow() {
  return (
    <span className="btn-arrow" aria-hidden="true">
      →
    </span>
  );
}
