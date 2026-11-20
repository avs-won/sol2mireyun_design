import { credentials } from "@/content/site";
import { ceo } from "@/content/ceo";
import { Arrow } from "@/drafts/v3/components/ui";

/** 01 — 사명 · 신뢰 (Trust & Authority: Hero) */
export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative pt-[var(--header-h)]">
      <div className="wrap">
        <div className="grid-12 gap-y-10 pb-14 pt-12 lg:pb-20 lg:pt-20">
          <div className="col-span-12 lg:col-span-8">
            <p data-reveal className="eyebrow text-primary">
              IP 사업화 · 금융 전문 그룹
            </p>
            <h1 id="hero-title" data-reveal style={{ ["--i" as string]: 1 }} className="h-display mt-6">
              무기가 되는 <span className="text-primary">특허</span>,
              <br />
              돈이 되는 <span className="text-primary">기술</span>.
            </h1>
            <p data-reveal style={{ ["--i" as string]: 2 }} className="lead prose-w mt-8 text-fg/80">
              특허 권리화부터 기술이전·거래, 사업화 컨설팅, TIPS·정책자금·투자 연결까지. 前 특허청 심사관 출신 변리사와 분야별
              10년 이상 전문가들이 한 팀으로 설계합니다.
            </p>
            <div data-reveal style={{ ["--i" as string]: 3 }} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href="#contact" className="btn btn-accent">
                상담 문의하기 <Arrow />
              </a>
              <a href="#services" className="link-u text-[16px] font-semibold">
                서비스 살펴보기
              </a>
            </div>
          </div>

          {/* 대표 변리사 — 첫 화면에서 바로 보이는 신뢰 근거 */}
          <aside
            data-reveal
            style={{ ["--i" as string]: 3 }}
            aria-label="대표 변리사"
            className="col-span-12 self-end border-t border-fg pt-5 sm:col-span-8 md:col-span-6 lg:col-span-4"
          >
            <p className="eyebrow text-muted-fg">Lead Counsel</p>
            <p className="serif mt-4 text-[28px] font-bold leading-tight">
              {ceo.name} <span className="text-[18px] font-semibold text-muted-fg">{ceo.role}</span>
            </p>
            <dl className="mt-5 divide-y divide-border border-y border-border text-[15px]">
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-muted-fg">前 특허청 심사관</dt>
                <dd className="garamond text-[17px]">1997 – 2004</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-muted-fg">학위</dt>
                <dd className="font-medium">공학박사 · 법학석사</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-muted-fg">자격</dt>
                <dd className="text-right font-medium">변리사 · 기술거래사 외 2</dd>
              </div>
            </dl>
            <a href="#ceo" className="link-arrow mt-4 inline-flex items-center gap-2 py-2 text-[15px] font-semibold text-primary">
              대표 변리사 소개 <Arrow />
            </a>
          </aside>
        </div>
      </div>

      {/* 지정 · 선정 이력 — 공식 기록처럼 */}
      <div className="border-y border-border bg-surface">
        <div className="wrap">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" aria-label="지정 및 선정 이력">
            {credentials.map((c, i) => (
              <li
                key={c.text}
                data-reveal
                style={{ ["--i" as string]: i }}
                className={`flex gap-4 py-5 sm:py-6 ${i > 0 ? "border-t border-border sm:border-t-0" : ""} ${
                  i % 2 === 1 ? "sm:border-l sm:pl-6" : ""
                } ${i > 1 ? "sm:border-t lg:border-t-0" : ""} lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0`}
              >
                <span className="eyebrow mt-1 shrink-0 text-primary">{c.kind}</span>
                <span className="text-[15px] font-medium leading-snug">{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
