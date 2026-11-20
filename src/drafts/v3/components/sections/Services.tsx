import { services } from "@/content/services";
import { SectionHead } from "@/drafts/v3/components/ui";
import TopicLink from "@/drafts/v3/components/TopicLink";

/** 서비스 → 문의 폼의 분야 (ContactForm TOPICS) */
const topicOf: Record<string, string> = {
  "01": "지식재산 권리화",
  "02": "기술이전 · 거래",
  "03": "기술이전 · 거래",
  "04": "기술사업화 컨설팅",
  "05": "기술사업화 컨설팅",
  "06": "IP 자금 · 투자",
};

/** 03 — 서비스 (Trust & Authority: Solution) */
export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y border-t border-border bg-surface">
      <div className="wrap">
        <SectionHead
          no="02"
          label="Services"
          titleId="services-title"
          title={
            <>
              기술사업화의 모든 단계를,
              <br />
              하나의 파트너와.
            </>
          }
          intro={<p>권리화에서 기술이전, 마케팅, 환경분석, 사업화, 자금 전략까지. 여섯 개 분야를 한 팀이 이어서 맡습니다.</p>}
        />

        <ol className="mt-16 grid border-t border-fg sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {services.map((s, i) => (
            <li
              key={s.no}
              data-reveal
              style={{ ["--i" as string]: i % 3 }}
              className={`flex flex-col border-b border-border py-9 sm:px-0 lg:py-12 ${i % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"} ${
                i % 3 === 0 ? "lg:border-l-0 lg:pl-0 lg:pr-8" : "lg:border-l lg:px-8"
              }`}
            >
              <p className="flex items-baseline justify-between gap-4">
                <span className="garamond text-[44px] leading-none text-primary">{s.no}</span>
                <span className="eyebrow text-right text-muted-fg">{s.en}</span>
              </p>
              <h3 className="serif mt-8 text-[23px] font-bold leading-snug lg:text-[25px]">{s.title}</h3>
              <p className="mt-2 font-semibold text-primary">{s.headline}</p>
              <p className="mt-4 text-fg/80">{s.body}</p>
              <ul className="mt-6 space-y-2 border-t border-border pt-5 text-[15px] text-fg/80">
                {s.points.map((p) => (
                  <li key={p} className="grid grid-cols-[14px_1fr] gap-2">
                    <span aria-hidden="true" className="mt-[0.8em] h-px w-2.5 bg-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <TopicLink topic={topicOf[s.no]} className="link-arrow mt-auto inline-flex items-center gap-2 pt-7 text-[15px] font-semibold text-accent">
                이 분야 상담하기
              </TopicLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
