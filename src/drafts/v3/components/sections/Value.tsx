import { valueStages } from "@/content/value";
import { SectionHead } from "@/drafts/v3/components/ui";

const acquire = ["등록된 특허를 양도받아 지식재산권 획득", "등록된 특허의 실시권 취득", "신규 출원을 통한 권리화 전략 수립"];
const funding = [
  "단계별 환경조성에 따른 인력 · 자금 스케줄",
  "융자 · 출연, 해외 공동개발 자금(미국 · 유럽 · 러시아), 크라우드 펀딩 · VC 전략",
  "사업화 단계별 스케줄 수립",
];

function Meter({ n }: { n: number }) {
  return (
    <span className="meter" role="img" aria-label={`5단계 중 ${n}단계`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < n ? "on" : ""} />
      ))}
    </span>
  );
}

/** 04 — Invention to Value + IP Financing */
export default function Value() {
  const rating = valueStages.find((s) => s.key === "PROTECT")?.rating ?? [];
  return (
    <section id="value" aria-labelledby="value-title" className="section-y">
      <div className="wrap">
        <SectionHead
          no="03"
          label="From Invention to Value"
          titleId="value-title"
          title={
            <>
              기술은 특허가 되고,
              <br />
              특허는 자금이 됩니다.
            </>
          }
          intro={<p>One-stop 창업부터 해외진출까지 Non-stop 컨설팅. 발명에서 성장까지 네 단계를 끊김 없이 잇습니다.</p>}
        />

        <ol className="mt-16 grid border-t border-fg md:grid-cols-2 lg:mt-24 lg:grid-cols-4" aria-label="가치 설계 4단계">
          {valueStages.map((s, i) => (
            <li
              key={s.key}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={`relative border-b border-border py-8 md:pr-8 lg:py-10 ${i % 2 === 1 ? "md:border-l md:pl-8" : ""} ${
                i === 2 ? "lg:border-l lg:pl-8" : ""
              }`}
            >
              <p className="flex items-center gap-3">
                <span className="garamond text-[17px] text-primary">0{i + 1}</span>
                <span className="eyebrow text-muted-fg">{s.key}</span>
              </p>
              <h3 className="serif mt-5 text-[22px] font-bold">{s.kr}</h3>
              <p className="mt-2 font-semibold">{s.title}</p>
              <p className="mt-3 text-[15px] text-fg/75">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* IP Financing */}
        <div className="mt-20 grid-12 gap-y-10 lg:mt-28">
          <div className="col-span-12 lg:col-span-5">
            <p data-reveal className="eyebrow text-primary">IP Financing</p>
            <h3 data-reveal className="serif mt-4 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-snug">
              자금은 기술을 근거로 움직입니다
            </h3>
            <p data-reveal className="mt-6 prose-w text-fg/80">
              대출·출연 자금은 기본적으로 기술을 근거로 진행되며, 기업의 기술능력 여부는 특허 현황으로 판단됩니다.
              <strong className="font-semibold text-fg"> 특허의 상태가 곧 자금 전략의 출발점입니다.</strong>
            </p>
          </div>

          <div data-reveal className="col-span-12 lg:col-span-6 lg:col-start-7">
            <table className="w-full border-collapse text-left">
              <caption className="eyebrow pb-3 text-left text-muted-fg">특허 현황에 따른 자금 평가</caption>
              <thead>
                <tr className="border-y border-fg text-[14px]">
                  <th scope="col" className="py-3 font-semibold">특허 현황</th>
                  <th scope="col" className="py-3 text-right font-semibold">평가</th>
                </tr>
              </thead>
              <tbody>
                {rating.map((r) => (
                  <tr key={r.label} className="border-b border-border">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      {r.label}
                      {r.note && <span className="mt-1 block text-[14px] font-normal text-muted-fg">{r.note}</span>}
                    </th>
                    <td className="py-4 text-right">
                      {r.stars > 0 ? <Meter n={r.stars} /> : <span className="text-[15px] font-semibold text-accent">보완 필요</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h4 className="font-semibold">지식재산권 획득 방안</h4>
                <ol className="mt-3 space-y-2 text-[15px] text-fg/80">
                  {acquire.map((a, i) => (
                    <li key={a} className="grid grid-cols-[1.5rem_1fr]">
                      <span className="garamond text-primary">{i + 1}.</span>
                      {a}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="font-semibold">IP 기반 자금 설계</h4>
                <ol className="mt-3 space-y-2 text-[15px] text-fg/80">
                  {funding.map((a, i) => (
                    <li key={a} className="grid grid-cols-[1.5rem_1fr]">
                      <span className="garamond text-primary">{i + 1}.</span>
                      {a}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
