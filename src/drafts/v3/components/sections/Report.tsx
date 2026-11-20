import { lensModes, reportExtras, reportIntro } from "@/content/report";
import { SectionHead } from "@/drafts/v3/components/ui";
import TopicLink from "@/drafts/v3/components/TopicLink";

/** 06 — 특허맵 · 전략 보고서 */
export default function Report() {
  return (
    <section id="report" aria-labelledby="report-title" className="section-y">
      <div className="wrap">
        <SectionHead
          no="05"
          label="Patent Map · Strategy Report"
          titleId="report-title"
          title={
            <>
              기술의 흐름을
              <br />
              한눈에 읽는 지도.
            </>
          }
          intro={
            <>
              <p>{reportIntro.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="활용 분야">
                {reportIntro.uses.map((u) => (
                  <li key={u} className="border border-border bg-surface px-3 py-1.5 text-[14px] font-medium text-fg">
                    {u}
                  </li>
                ))}
              </ul>
            </>
          }
        />

        <ol className="mt-16 grid border-t border-fg sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {lensModes.map((m, i) => (
            <li
              key={m.key}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={`border-b border-border py-8 sm:pr-8 lg:py-10 ${i % 2 === 1 ? "sm:border-l sm:pl-8" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <p className="flex items-baseline justify-between gap-3">
                <span className="garamond text-[17px] text-primary">0{i + 1}</span>
                <span className="eyebrow text-muted-fg">{m.short}</span>
              </p>
              <h3 className="serif mt-5 text-[22px] font-bold">{m.name}</h3>
              <p className="mt-3 text-[15px] text-fg/80">{m.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:mt-16">
          {reportExtras.map((x) => (
            <div key={x.title} data-reveal className="border-l-2 border-primary bg-surface px-6 py-6 lg:px-8">
              <h3 className="text-[18px] font-bold">{x.title}</h3>
              <p className="mt-2 text-[15px] text-fg/80">{x.body}</p>
            </div>
          ))}
        </div>

        <TopicLink topic="특허맵 · 전략 보고서" className="link-arrow mt-10 inline-flex items-center gap-2 py-2 text-[16px] font-semibold text-accent">
          전략 보고서 상담하기
        </TopicLink>
      </div>
    </section>
  );
}
