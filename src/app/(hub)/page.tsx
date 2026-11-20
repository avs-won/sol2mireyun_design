import Image from "next/image";
import { asset } from "@/lib/env";
import { drafts, type DraftId } from "@/lib/drafts";
import { site } from "@/content/site";

/** 시안별 미니 미리보기 — 실제 화면 캡처 대신 각 시안의 색 · 형태 문법을 축약해 그린다 */
function Thumb({ id }: { id: DraftId }) {
  if (id === "v4")
    return (
      <div className="relative h-full overflow-hidden bg-[#070b14]">
        <div className="absolute right-[-10%] top-[-20%] size-[80%] rounded-full bg-[radial-gradient(circle,rgb(212_175_106/0.35),transparent_60%)]" />
        <svg viewBox="0 0 200 120" className="absolute right-4 top-1/2 h-[78%] -translate-y-1/2" aria-hidden="true">
          {Array.from({ length: 110 }, (_, i) => {
            const a = (i / 110) * Math.PI * 2;
            const r = i % 3 === 0 ? 34 : 44;
            return <rect key={i} x={140 + Math.cos(a) * r} y={58 + Math.sin(a) * r * 0.95} width="1.6" height="1.6" fill={i % 4 ? "#d4af6a" : "#ece5d6"} />;
          })}
          <path d="M126 60l10 10 18-20" stroke="#d4af6a" strokeWidth="2.2" fill="none" />
        </svg>
        <div className="absolute left-5 top-1/2 -translate-y-1/2 space-y-1.5">
          <div className="h-1 w-10 bg-[#d4af6a]" />
          <div className="h-3 w-28 rounded-sm bg-[#d4af6a]/90" />
          <div className="h-3 w-24 rounded-sm bg-[#ece5d6]/85" />
          <div className="h-3 w-20 rounded-sm bg-[#ece5d6]/40" />
          <div className="mt-3 h-4 w-16 rounded-full bg-[#d4af6a]" />
        </div>
      </div>
    );
  if (id === "v3")
    return (
      <div className="relative h-full bg-[#f8fafc] p-5">
        <div className="h-px w-full bg-[#cbd5e1]" />
        <div className="mt-4 grid grid-cols-12 gap-2">
          <div className="col-span-7 space-y-1.5">
            <div className="h-3.5 w-full rounded-sm bg-[#0f172a]" />
            <div className="h-3.5 w-4/5 rounded-sm bg-[#0f172a]" />
            <div className="mt-3 h-1.5 w-full bg-[#94a3b8]" />
            <div className="h-1.5 w-2/3 bg-[#94a3b8]" />
            <div className="mt-3 h-4 w-14 bg-[#b45309]" />
          </div>
          <div className="col-span-5 border-l border-[#cbd5e1] pl-2">
            {[0, 1, 2].map((k) => (
              <div key={k} className="mb-2 border-b border-[#cbd5e1] pb-2">
                <div className="h-3 w-8 rounded-sm bg-[#1e3a8a]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div className="relative h-full overflow-hidden bg-[#0c1322]">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#f3efe7_1px,transparent_1px),linear-gradient(90deg,#f3efe7_1px,transparent_1px)] [background-size:16px_16px]" />
      <svg viewBox="0 0 200 120" className="absolute inset-0 size-full" aria-hidden="true">
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M140 ${30 + k * 16} l34 -14 l-34 -14 l-34 14 z`} transform={`translate(0 ${k * 6})`} fill="#16213a" stroke={k === 1 ? "#c6ac8b" : "#f3efe7"} strokeWidth="0.8" />
        ))}
        <path d="M60 40 L100 40" stroke="#c6ac8b" strokeWidth="0.8" />
        <text x="20" y="44" fill="#c6ac8b" fontSize="7" fontFamily="monospace">FIG. 1</text>
        <rect x="20" y="60" width="70" height="6" fill="#f3efe7" />
        <rect x="20" y="70" width="52" height="6" fill="#f3efe7" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function HubPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-30%] size-[90vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(214_178_110/0.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-[1280px] px-5 pb-24 pt-14 sm:px-10 lg:pt-20">
        <header className="rise flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src={asset("/brand/logo.png")} alt="Sol2 미래연" width={109} height={54} priority className="h-9 w-auto brightness-0 invert" />
            <span className="border-l border-white/15 pl-4 text-[13px] leading-tight text-mute">
              국제특허법률사무소 미래연
              <span className="block font-mono text-[11px] tracking-[0.14em]">WEBSITE RENEWAL</span>
            </span>
          </div>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-[14px] text-ivory/80 transition-colors hover:border-gold hover:text-gold">
            현재 운영 중인 사이트 <span aria-hidden="true">↗</span>
          </a>
        </header>

        <section className="mt-16 lg:mt-24" aria-labelledby="hub-title">
          <p className="rise font-mono text-[12px] tracking-[0.2em] text-gold" style={{ animationDelay: "80ms" }}>
            DESIGN PROPOSALS · {drafts.length}
          </p>
          <h1 id="hub-title" className="rise mt-5 text-[clamp(36px,6vw,84px)] font-extrabold leading-[1.08] tracking-[-0.045em]" style={{ animationDelay: "140ms" }}>
            홈페이지 리뉴얼 <span className="font-serif font-normal italic text-gold">시안</span>을
            <br />
            골라 보세요.
          </h1>
          <p className="rise mt-6 max-w-[36em] text-[17px] text-mute" style={{ animationDelay: "220ms" }}>
            같은 내용(기존 홈페이지의 정보)을 세 가지 디자인으로 만들었습니다. 각 시안 화면 아래의 버튼으로 언제든 다른 시안으로 바로 넘어갈 수 있습니다.
          </p>
        </section>

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {drafts.map((d, i) => (
            <li key={d.id} className={`rise ${i === 0 ? "lg:col-span-3" : ""}`} style={{ animationDelay: `${300 + i * 90}ms` }}>
              <a
                href={asset(`/${d.id}`)}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-2 transition-[border-color,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 hover:border-gold/60 ${
                  i === 0 ? "lg:grid lg:grid-cols-[1.25fr_1fr]" : ""
                }`}
              >
                <div className={`relative overflow-hidden ${i === 0 ? "aspect-[16/9] lg:aspect-auto lg:min-h-[340px]" : "aspect-[16/9]"}`}>
                  <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]">
                    <Thumb id={d.id} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[13px] text-gold">{d.id.toUpperCase()}</span>
                    {d.isNew && <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-ink">NEW · 추천</span>}
                    <span className="ml-auto text-[12px] text-mute">움직임 {d.motion}</span>
                  </div>
                  <h2 className="mt-5 text-[clamp(26px,2.6vw,38px)] font-extrabold tracking-[-0.04em]">
                    {d.name} <span className="font-serif text-[0.8em] font-normal italic text-mute">— {d.concept}</span>
                  </h2>
                  <p className="mt-4 text-[15px] leading-[1.8] text-mute">{d.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="특징">
                    {d.keywords.map((k) => (
                      <li key={k} className="rounded-full border border-white/12 px-3 py-1 text-[13px] text-ivory/75">
                        {k}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold text-ivory transition-colors group-hover:text-gold">
                    {d.id} 시안 열기
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-16 text-[13px] text-mute">검토용 페이지입니다. 정식 오픈 때는 선택된 시안 하나만 사이트 주소(/)에 연결됩니다.</p>
      </div>
    </main>
  );
}
