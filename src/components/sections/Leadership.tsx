"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { SpecMark } from "@/components/ui/Spec";
import { ceo } from "@/content/ceo";

const CAREER_SHOWN = 3;

/*
  FIG. 8 — 경력 타임라인 (실제 연도 비율)
  세 줄(기술 · 특허 · 사업화)에 막대가 연도만큼 그려진다.
  1987–1997 기술 → 1997–2004 특허 심사 → 現 IP 사업화.
  연도는 기존 사이트에 명시된 것만 쓴다 (現 막대의 시작 연도는 명시돼 있지 않아 점선으로만 잇는다).
*/
const [ENG, LAW] = ceo.timeline;
const Y0 = ENG.from;
const Y1 = LAW.to;
const SPAN = 72; // 1987–2004 구간이 차지하는 폭(%). 나머지는 現
const x = (year: number) => ((year - Y0) / (Y1 - Y0)) * SPAN;
const NOW_START = SPAN + 6;

const lanes = [
  {
    key: "eng",
    label: "기술 · 연구",
    left: x(ENG.from),
    width: x(ENG.to) - x(ENG.from),
    years: `${ENG.from}–${ENG.to} · ${ENG.to - ENG.from}년`,
    title: "대우전자 전략연구소 책임연구원",
    detail: ENG.detail,
  },
  {
    key: "law",
    label: "특허 · 심사",
    left: x(LAW.from),
    width: x(LAW.to) - x(LAW.from),
    years: `${LAW.from}–${LAW.to} · ${LAW.to - LAW.from}년`,
    title: "특허청 심사관 · 사무관",
    detail: "LCD · OLED · 3D Display 심사",
  },
  {
    key: "biz",
    label: "IP 사업화",
    left: NOW_START,
    width: 100 - NOW_START,
    years: "現",
    title: "대표 변리사",
    detail: "권리화부터 사업화 · 자금까지",
  },
] as const;

const ticks = [
  { label: String(ENG.from), at: x(ENG.from) },
  { label: String(ENG.to), at: x(ENG.to) },
  { label: String(LAW.to), at: x(LAW.to) },
  { label: "現", at: 100 },
];

function CareerChart() {
  return (
    <div className="cc relative hidden md:block" aria-hidden="true">
      <div className="relative ml-[7.5rem]">
        {lanes.map((l, i) => (
          <div key={l.key} className={`cc-lane cc-${l.key} relative`}>
            <span className="cc-lane-label mono-label absolute right-full top-1/2 mr-5 -translate-y-1/2 whitespace-nowrap text-mute">{l.label}</span>
            <span className="cc-guide absolute inset-x-0 top-1/2" />
            {l.key === "biz" && <span className="cc-lead absolute top-1/2" style={{ left: `${SPAN}%`, width: `${NOW_START - SPAN}%` }} />}
            <div className="cc-bar absolute inset-y-[9%] flex flex-col justify-center overflow-hidden px-4" style={{ left: `${l.left}%`, width: `${l.width}%` }}>
              <p className="cc-text flex items-baseline gap-2.5 whitespace-nowrap leading-tight">
                <span className="text-[15px] font-bold tracking-[-0.03em] xl:text-[16px]">{l.title}</span>
                <span className="cc-years font-mono text-[11px]">{l.years}</span>
              </p>
              <p className="cc-text cc-detail mt-1 truncate text-[12.5px] leading-tight">{l.detail}</p>
            </div>
            {/* 다음 줄로 넘어가는 연결선 */}
            {i < 2 && (
              <span className="cc-link absolute" style={{ left: `${l.left + l.width}%` }}>
                <span className="cc-link-tag">{i === 0 ? "기술 → 특허" : "기술 × 법률"}</span>
              </span>
            )}
          </div>
        ))}
        {/* 연도 축 */}
        <div className="cc-axis relative mt-2 h-7">
          <span className="cc-axis-rule absolute inset-x-0 top-0" />
          <span className="cc-axis-break absolute top-0" style={{ left: `${(SPAN + NOW_START) / 2}%` }} />
          {ticks.map((t, i) => (
            <span
              key={t.label}
              className={`cc-tick absolute top-0 pt-2 font-mono text-[12px] text-mute ${i === 0 ? "is-first" : ""} ${i === ticks.length - 1 ? "is-last" : ""}`}
              style={{ left: `${t.at}%`, transform: `translateX(${i === 0 ? "0" : i === ticks.length - 1 ? "-100%" : "-50%"})` }}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Leadership() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(q(".ld-name .mask-line > span"), { y: 0, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: q(".ld-name")[0], start: "top 85%" } });
        gsap.to(q(".ld-intro [data-a='rise']"), { opacity: 1, y: 0, duration: 1, stagger: 0.08, scrollTrigger: { trigger: q(".ld-intro")[0], start: "top 85%" } });

        // 경력 타임라인: 축 → 기술 막대 → 연결 → 특허 막대 → 연결 → 사업화 막대 (한 번만)
        const bars = q(".cc-bar");
        const links = q(".cc-link");
        const tl = gsap.timeline({ scrollTrigger: { trigger: q(".cc")[0], start: "top 85%" }, defaults: { ease: "power3.out" } });
        tl.fromTo(q(".cc-axis-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0)
          .fromTo(q(".cc-tick, .cc-lane-label"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.06 }, 0.2)
          .fromTo(bars[0], { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, 0.35)
          .fromTo(links[0], { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: "power2.inOut" }, 1.0)
          .fromTo(bars[1], { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, 1.25)
          .fromTo(links[1], { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: "power2.inOut" }, 1.8)
          .fromTo(q(".cc-lead"), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "none" }, 2.0)
          .fromTo(bars[2], { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, 2.2);
        bars.forEach((b, i) => {
          tl.fromTo(b.querySelectorAll(".cc-text"), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06 }, [0.75, 1.6, 2.55][i]);
        });
        tl.fromTo(q(".cc-link-tag"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.8 }, 1.15);

        gsap.to(q(".ld-facts [data-a='rise']"), { opacity: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.3, scrollTrigger: { trigger: q(".ld-facts")[0], start: "top 92%" } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // 경력 전체 보기 — 대화상자가 열린 동안 페이지 스크롤(Lenis)을 멈춘다
  const closeCareer = () => {
    dialog.current?.close();
    getLenis()?.start(); // close 이벤트를 기다리지 않고 바로 스크롤을 되살린다
  };
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => getLenis()?.start(); // Esc로 닫을 때
    const onClick = (e: MouseEvent) => e.target === d && closeCareer(); // 바깥(배경) 클릭으로 닫기
    d.addEventListener("close", onClose);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("click", onClick);
    };
  }, []);
  const openCareer = () => {
    getLenis()?.stop();
    dialog.current?.showModal();
  };

  return (
    <section ref={root} id="ceo" data-section="ceo" data-theme="light" aria-labelledby="ceo-title" className="section-y screen relative bg-bone text-ink">
      <div className="wrap relative">
        <SpecMark no="0008" className="text-mute">
          Leadership
        </SpecMark>

        {/* ---------- 이름 + 한 줄 소개 ---------- */}
        <div className="ld-intro grid-12 mt-10 gap-y-8 scr:mt-[3vh]">
          <div className="ld-name col-span-12 lg:col-span-6">
            <p data-a="rise" className="mono-label text-bronze-ink short:hidden">
              {ceo.roleEn}
            </p>
            <h2 id="ceo-title" className="mt-3" aria-label={`${ceo.name} ${ceo.role}`}>
              <span className="mask-line" data-a="line" aria-hidden="true">
                <span className="ld-name-text font-bold leading-[0.95] tracking-[-0.06em]">{ceo.name}</span>
              </span>
              <span className="mask-line" data-a="line" aria-hidden="true">
                <span className="mt-2 text-[clamp(1.3rem,2vw,1.9rem)] font-light tracking-[-0.03em]">{ceo.role}</span>
              </span>
            </h2>
          </div>
          <div className="col-span-12 self-end lg:col-span-5 lg:col-start-8">
            <blockquote data-a="rise" className="border-l-2 border-bronze pl-6 text-[clamp(1.15rem,1.6vw,1.5rem)] font-medium leading-[1.55] tracking-[-0.03em]">
              {ceo.statement}
            </blockquote>
            <ul data-a="rise" className="mt-5 flex flex-wrap gap-2" aria-label="자격">
              {ceo.licenses.map((l) => (
                <li key={l} className="rounded-full border border-ink/25 px-3.5 py-1.5 text-[13px] font-semibold">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- 경력 타임라인 ---------- */}
        <figure className="mt-16 scr:mt-[3.6vh] short:mt-[2.6vh]">
          <figcaption className="mono-label flex flex-wrap justify-between gap-2 text-mute">
            <span>FIG. 8 — 경력 타임라인</span>
            <span className="text-ink">
              기술 {ENG.to - ENG.from}년 <span className="text-mute">→</span> 특허 심사 {LAW.to - LAW.from}년 <span className="text-mute">→</span>{" "}
              <span className="text-bronze-ink">IP 사업화</span>
            </span>
          </figcaption>
          <div className="mt-6 scr:mt-[2.6vh]">
            <CareerChart />
          </div>
          {/* 화면 읽기 프로그램 · 모바일: 세로 연대표 */}
          <ol className="mt-6 border-l border-ink/25 pl-6 md:sr-only">
            {ceo.timeline.map((t) => (
              <li key={t.title} className="relative pb-7">
                <span className="absolute -left-[29px] top-[0.45rem] size-[9px] rounded-full bg-ink" aria-hidden="true" />
                <p className="font-mono text-[12px] text-bronze-ink">
                  {t.from}–{t.to} · {t.to - t.from}년 · {t.track === "engineering" ? "기술 · 연구" : "특허 · 심사"}
                </p>
                <p className="mt-1 text-[17px] font-semibold">{t.title}</p>
                <p className="text-[14px] text-mute">{t.detail}</p>
              </li>
            ))}
            <li className="relative">
              <span className="absolute -left-[30px] top-[0.4rem] size-[11px] rounded-full bg-bronze" aria-hidden="true" />
              <p className="font-mono text-[12px] text-bronze-ink">現 · IP 사업화</p>
              <p className="mt-1 text-[17px] font-semibold">대표 변리사</p>
              <p className="text-[14px] text-mute">기술의 권리화부터 사업화까지</p>
            </li>
          </ol>
        </figure>

        {/* ---------- 학력 · 회사 · 경력 ---------- */}
        <div className="ld-facts mt-16 grid gap-x-10 gap-y-10 scr:mt-[3.6vh] short:mt-[2.6vh] md:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_1.4fr]">
          <div data-a="rise">
            <h3 className="mono-label border-b border-ink pb-2.5">학력 — 공학 · 법학</h3>
            <ul className="mt-2.5 space-y-1.5 text-[14px] text-ink/85 short:space-y-0.5 short:text-[13px]">
              {[...ceo.education.engineering, ...ceo.education.law].map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div data-a="rise">
            <h3 className="mono-label border-b border-ink pb-2.5">관련 회사</h3>
            <ul className="mt-2.5 space-y-1.5 text-[14px] text-ink/85 short:space-y-0.5 short:text-[13px]">
              {ceo.companies.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div data-a="rise" className="md:col-span-2 lg:col-span-1">
            <h3 className="mono-label flex justify-between border-b border-ink pb-2.5">
              <span>주요 경력</span>
              <span className="text-mute">{ceo.career.length}</span>
            </h3>
            <ol className="text-[14px] text-ink/85">
              {ceo.career.slice(0, CAREER_SHOWN).map((c, i) => (
                <li key={c} className={`grid grid-cols-[2rem_1fr] border-b border-ink/10 py-1.5 ${i === CAREER_SHOWN - 1 ? "short:hidden" : ""}`}>
                  <span className="font-mono text-[11px] leading-[1.6rem] text-bronze-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate leading-relaxed" title={c}>
                    {c}
                  </span>
                </li>
              ))}
            </ol>
            <button type="button" onClick={openCareer} aria-haspopup="dialog" className="link-u mt-4 text-[14px]">
              경력 전체 보기 ({ceo.career.length}개)
            </button>
          </div>
        </div>
      </div>

      {/* ---------- 경력 전체 (대화상자) ---------- */}
      <dialog ref={dialog} className="ld-dialog m-auto w-[min(760px,calc(100vw-32px))] bg-paper p-0 text-ink" aria-labelledby="career-title">
        <div className="flex items-center justify-between border-b border-ink/15 px-6 py-4 sm:px-8">
          <h3 id="career-title" className="text-[18px] font-bold tracking-[-0.03em]">
            {ceo.name} {ceo.role} — 주요 경력 <span className="font-mono text-[13px] font-normal text-mute">{ceo.career.length}</span>
          </h3>
          <button type="button" onClick={closeCareer} className="rounded-full px-3 py-1.5 text-[14px] hover:bg-ink/5" aria-label="닫기">
            닫기 ✕
          </button>
        </div>
        <ol className="max-h-[min(70vh,640px)] overflow-y-auto overscroll-contain px-6 py-2 text-[15px] text-ink/85 sm:px-8" data-lenis-prevent>
          {ceo.career.map((c, i) => (
            <li key={c} className="grid grid-cols-[2.25rem_1fr] border-b border-ink/10 py-2.5 last:border-b-0">
              <span className="font-mono text-[11px] leading-[1.9rem] text-bronze-ink">{String(i + 1).padStart(2, "0")}</span>
              <span className="leading-relaxed">{c}</span>
            </li>
          ))}
        </ol>
      </dialog>
    </section>
  );
}
