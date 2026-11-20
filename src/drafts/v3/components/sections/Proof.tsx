import { resultGroups, resultTotal } from "@/content/results";

/** 02 — 증거 (Trust & Authority: Proof). 숫자는 실적 목록 개수에서 계산한다. */
export default function Proof() {
  const stats = [
    { n: String(resultTotal), unit: "건", label: "수행 실적 전체" },
    ...resultGroups.map((g) => ({ n: String(g.items.length), unit: "건", label: g.short })),
  ];
  return (
    <section aria-label="수행 실적 요약" className="on-dark bg-fg text-white">
      <div className="wrap py-14 lg:py-20">
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={`flex flex-col-reverse gap-3 pr-4 ${i % 2 === 1 ? "border-l border-white/15 pl-5 lg:pl-8" : ""} ${
                i === 2 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""
              }`}
            >
              <dt className="text-[15px] text-white/75">{s.label}</dt>
              <dd className="garamond text-[clamp(3.25rem,7vw,5.5rem)] leading-none text-white">
                {s.n}
                <span className="ml-1 font-sans text-[18px] font-medium text-gold">{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-[15px] text-white/75">
          <span>전자 · 기계 · 화학 · 소프트웨어 등 다양한 분야의 기술설계 · IP 컨설팅 · 특허맵</span>
          <a href="#results" className="link-u font-semibold text-gold">
            전체 실적 보기
          </a>
        </p>
      </div>
    </section>
  );
}
