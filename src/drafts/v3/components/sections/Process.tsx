import { laneRows, phases, steps } from "@/content/process";
import { SectionHead } from "@/drafts/v3/components/ui";
import TopicLink from "@/drafts/v3/components/TopicLink";

/** 05 — 9단계 사업화 로드맵. 데스크톱은 간트 표, 모바일은 구간별 목록 */
export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y on-dark bg-fg text-white">
      <div className="wrap">
        <SectionHead
          dark
          no="04"
          label="Commercialization Roadmap"
          titleId="process-title"
          title={
            <>
              기초실험부터 양산까지,
              <br />
              9단계 사업화 로드맵
            </>
          }
          intro={
            <p>원천기술 단계부터 상용화 기술개발 단계까지, 기술경향 조사 · 경쟁사 분석과 분쟁예방 · 기술이전과 라이선싱 · 개발내용 권리화를 단계별로 지원합니다.</p>
          }
        />

        {/* 데스크톱: 간트 */}
        <div data-reveal className="mt-16 hidden lg:mt-24 md:block">
          <div className="grid grid-cols-9 border-t border-white/40" role="list" aria-label="9단계">
            {steps.map((s, i) => (
              <div key={s} role="listitem" className={`py-5 pr-3 ${i > 0 ? "border-l border-white/15 pl-4" : ""}`}>
                <span className="garamond block text-[34px] leading-none text-gold">{i + 1}</span>
                <span className="mt-3 block text-[15px] font-medium leading-snug">{s}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-white/15 pt-4">
            {laneRows.map((row, r) => (
              <div key={r} className="grid grid-cols-9 gap-x-2">
                {row.map((l) => (
                  <div
                    key={l.label}
                    style={{ gridColumn: `${l.from} / ${l.to + 1}` }}
                    className={
                      l.kind === "phase"
                        ? "bg-white px-4 py-3 text-[15px] font-semibold text-fg"
                        : "border border-white/25 px-4 py-3 text-[15px] text-white/85"
                    }
                  >
                    {l.label}
                    {l.note && <span className="ml-2 text-[13px] text-white/60">({l.note})</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 모바일: 구간별 목록 */}
        <div className="mt-14 space-y-10 md:hidden">
          {phases.map((p) => (
            <div key={p.label} data-reveal>
              <h3 className="flex items-baseline justify-between border-b border-white/40 pb-3">
                <span className="serif text-[21px] font-bold">{p.label}</span>
                <span className="garamond text-[17px] text-gold">
                  {p.from}–{p.to}단계
                </span>
              </h3>
              <ol className="mt-3 grid grid-cols-1 gap-y-1">
                {steps.slice(p.from - 1, p.to).map((s, i) => (
                  <li key={s} className="flex items-baseline gap-3 py-1.5">
                    <span className="garamond w-5 text-[17px] text-gold">{p.from + i}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <ul className="mt-4 space-y-2">
                {p.supports.map((s) => (
                  <li key={s.label} className="border border-white/25 px-4 py-3 text-[15px] text-white/85">
                    {s.label}
                    {s.note && <span className="block text-[13px] text-white/60">{s.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-8">
          <p className="text-white/75">지금 어느 단계에 있든, 다음 단계에 필요한 권리와 자금을 함께 설계합니다.</p>
          <TopicLink topic="기술사업화 컨설팅" className="btn btn-gold">
            우리 기술의 단계 진단받기
          </TopicLink>
        </div>
      </div>
    </section>
  );
}
