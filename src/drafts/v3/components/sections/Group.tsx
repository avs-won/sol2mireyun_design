import { entities } from "@/content/site";
import { expertise } from "@/content/ceo";
import { SectionHead } from "@/drafts/v3/components/ui";

/** 그룹 소개 + 전문 인력 */
export default function Group() {
  return (
    <section id="group" aria-labelledby="group-title" className="section-y">
      <div className="wrap">
        <SectionHead
          no="01"
          label="Mireyun Group"
          titleId="group-title"
          title={
            <>
              태양처럼 빛나도록,
              <br />
              그림자처럼 늘 곁에서.
            </>
          }
          intro={
            <p>
              <strong className="font-semibold text-fg">Sol</strong>은 태양을 의미합니다. 기업·연구소·대학이 태양처럼 밝게 빛나도록,
              숫자 <strong className="font-semibold text-fg">2</strong>는 그림자처럼 항상 곁을 지킨다는 뜻입니다. Sol2(솔투), 즉 소금의
              역할을 다한다는 것이 미래연 그룹의 모토입니다.
            </p>
          }
        />

        {/* 3개 법인 */}
        <ol className="mt-16 grid gap-0 border-t border-fg md:grid-cols-3 lg:mt-24" aria-label="그룹 구성">
          {entities.map((e, i) => (
            <li
              key={e.code}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={`flex flex-col gap-4 border-b border-border py-8 md:border-b-0 md:py-10 ${i > 0 ? "md:border-l md:pl-8" : ""} md:pr-8`}
            >
              <p className="flex items-baseline justify-between">
                <span className="garamond text-[40px] leading-none text-primary">{e.code}</span>
                <span className="eyebrow text-muted-fg">{e.role}</span>
              </p>
              <h3 className="serif text-[22px] font-bold leading-snug lg:text-[24px]">{e.name}</h3>
              <p className="text-muted-fg">{e.desc}</p>
            </li>
          ))}
        </ol>

        {/* 전문 인력 */}
        <div id="expertise" className="mt-20 grid-12 gap-y-8 border-t border-border pt-12 lg:mt-28 lg:pt-16">
          <div className="col-span-12 lg:col-span-5">
            <p data-reveal className="eyebrow text-primary">Expertise &amp; Network</p>
            <h3 data-reveal className="serif mt-4 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-snug">
              10년 이상의 전문가들이
              <br />
              기술사업화 생태계를 만듭니다
            </h3>
            <p data-reveal className="mt-6 text-muted-fg prose-w">{expertise.body}</p>
          </div>
          <dl className="col-span-12 lg:col-span-6 lg:col-start-7">
            {expertise.parts.map((p, i) => (
              <div
                key={p.no}
                data-reveal
                style={{ ["--i" as string]: i }}
                className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-border py-5 first:border-t sm:grid-cols-[7rem_1fr]"
              >
                <dt className="font-semibold">{p.head}</dt>
                <dd className="text-fg/80">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
