import { ceo } from "@/content/ceo";

const TOP = 6;

/** 08 — 대표 변리사 */
export default function Leadership() {
  const lead = ceo.career.slice(0, TOP);
  const more = ceo.career.slice(TOP);
  return (
    <section id="ceo" aria-labelledby="ceo-title" className="section-y">
      <div className="wrap">
        <p data-reveal className="flex items-baseline gap-3 border-t border-fg pt-4 eyebrow text-primary">
          <span className="garamond text-[15px] tracking-normal">07</span>
          <span>{ceo.roleEn}</span>
        </p>

        <div className="mt-10 grid-12 gap-y-12 lg:mt-14">
          {/* 인물 */}
          <div className="col-span-12 lg:col-span-5">
            <h2 id="ceo-title" data-reveal className="serif text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-none tracking-[-0.04em]">
              {ceo.name}
              <span className="mt-4 block text-[clamp(1.25rem,2vw,1.6rem)] font-semibold tracking-[-0.02em] text-muted-fg">{ceo.role}</span>
            </h2>
            <p data-reveal className="lead mt-8 prose-w text-fg/85">{ceo.statement}</p>

            <dl className="mt-10 space-y-6">
              <div data-reveal>
                <dt className="eyebrow text-muted-fg">자격</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {ceo.licenses.map((l) => (
                    <span key={l} className="border border-fg px-3 py-1.5 text-[15px] font-medium">
                      {l}
                    </span>
                  ))}
                </dd>
              </div>
              <div data-reveal>
                <dt className="eyebrow text-muted-fg">관련 회사</dt>
                <dd className="mt-3 space-y-1">
                  {ceo.companies.map((c) => (
                    <p key={c}>{c}</p>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* 이력 */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <h3 data-reveal className="eyebrow text-muted-fg">공학에서 특허로</h3>
            <ol data-reveal className="mt-4 border-t border-fg">
              {ceo.timeline.map((t) => (
                <li key={t.title} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-border py-5 sm:grid-cols-[9rem_1fr]">
                  <span className="garamond text-[20px] text-primary">
                    {t.from} – {t.to}
                  </span>
                  <span>
                    <span className="block font-semibold">{t.title}</span>
                    <span className="mt-1 block text-[15px] text-muted-fg">{t.detail}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div data-reveal>
                <h3 className="font-semibold">학력 — 공학</h3>
                <ul className="mt-3 space-y-2 text-[15px] text-fg/80">
                  {ceo.education.engineering.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
              <div data-reveal>
                <h3 className="font-semibold">학력 — 법학</h3>
                <ul className="mt-3 space-y-2 text-[15px] text-fg/80">
                  {ceo.education.law.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div data-reveal className="mt-10">
              <h3 className="font-semibold">
                주요 경력 <span className="garamond ml-1 text-[18px] text-primary">{ceo.career.length}</span>
              </h3>
              <ul className="mt-3 border-t border-border">
                {lead.map((c) => (
                  <li key={c} className="border-b border-border py-3 text-[15px] text-fg/85">
                    {c}
                  </li>
                ))}
              </ul>
              <details className="group">
                <summary className="flex min-h-11 list-none items-center gap-2 py-3 text-[15px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">경력 {more.length}건 더 보기</span>
                  <span className="hidden group-open:inline">접기</span>
                  <span aria-hidden="true" className="transition-transform duration-200 group-open:rotate-180">
                    ↓
                  </span>
                </summary>
                <ul className="border-t border-border">
                  {more.map((c) => (
                    <li key={c} className="border-b border-border py-3 text-[15px] text-fg/85">
                      {c}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
