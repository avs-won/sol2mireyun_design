"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { getLenis, scrollToId } from "@/lib/scroll";
import { contact, navItems, sections } from "@/content/site";
import MagneticButton from "@/components/ui/MagneticButton";
import { asset } from "@/lib/env";

type Theme = "dark" | "light";

export default function Header() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [current, setCurrent] = useState<(typeof sections)[number]>(sections[0]);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  /* 지금 헤더 아래에 있는 섹션 → 색 테마 + 현재 위치 표시 */
  useEffect(() => {
    let io: IntersectionObserver | null = null;
    const build = () => {
      io?.disconnect();
      const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
      const band = Math.round(h / 2);
      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            const el = en.target as HTMLElement;
            setTheme((el.dataset.theme as Theme) || "light");
            const s = sections.find((x) => x.id === el.dataset.section);
            if (s) setCurrent(s);
          }
        },
        { rootMargin: `-${band}px 0px -${Math.max(window.innerHeight - band - 2, 0)}px 0px` },
      );
      document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => io!.observe(el));
    };
    build();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* 진행 막대 */
  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      },
    });
    return () => st.kill();
  });

  /* 스크롤을 시작하면 헤더에 바탕을 깐다 */
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  /* 모바일 메뉴 */
  useGSAP(
    () => {
      const el = menu.current;
      if (!el) return;
      const reduce = window.matchMedia(MQ.reduce).matches;
      const tl = gsap.timeline({ paused: true });
      if (reduce) {
        tl.set(el, { autoAlpha: 1 });
      } else {
        tl.set(el, { autoAlpha: 1 })
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.inOut" })
          .from(el.querySelectorAll("[data-menu-item]"), { yPercent: 110, duration: 0.8, ease: "expo.out", stagger: 0.045 }, 0.3)
          .from(el.querySelectorAll("[data-menu-foot]"), { opacity: 0, y: 12, duration: 0.6, stagger: 0.05 }, 0.5);
      }
      menuTl.current = tl;
      return () => tl.kill();
    },
    { scope: menu },
  );

  const close = useCallback((then?: () => void) => {
    setOpen(false);
    const tl = menuTl.current;
    const done = () => {
      getLenis()?.start();
      document.documentElement.style.removeProperty("overflow");
      then?.();
    };
    if (tl) {
      tl.timeScale(1.6).reverse();
      tl.eventCallback("onReverseComplete", done);
    } else done();
  }, []);

  const openMenu = () => {
    setOpen(true);
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
    const tl = menuTl.current;
    tl?.eventCallback("onReverseComplete", null);
    tl?.timeScale(1).play();
  };

  useEffect(() => {
    const main = document.getElementById("main");
    const foot = document.getElementById("site-footer");
    [main, foot].forEach((n) => n && (open ? n.setAttribute("inert", "") : n.removeAttribute("inert")));
    if (!open) return;
    const first = menu.current?.querySelector<HTMLElement>("a");
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close(() => toggle.current?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // 1280px 이상으로 넓어지면 메뉴를 닫는다
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const fn = () => mq.matches && open && close();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [open, close]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (open) close(() => scrollToId(id));
    else scrollToId(id);
  };

  const dark = open || theme === "dark";

  return (
    <>
      <header
        className={`site-header fixed inset-x-0 top-0 z-[70] transition-colors duration-500 ${dark ? "text-paper" : "text-ink"} ${
          solid && !open ? (dark ? "bg-ink/80 backdrop-blur-md" : "bg-paper/85 backdrop-blur-md") : "bg-transparent"
        }`}
        data-theme={dark ? "dark" : "light"}
      >
        <div className="wrap flex h-[var(--header-h)] items-center gap-6">
          <a href="#top" onClick={go("top")} className="flex shrink-0 items-center gap-4" aria-label="미래연 그룹 — 처음으로">
            <Image
              src={asset("/brand/logo.png")}
              alt="Sol2 미래연"
              width={109}
              height={54}
              priority
              className={`h-9 w-auto transition-[filter] duration-500 lg:h-10 ${dark ? "brightness-0 invert" : ""}`}
            />
          </a>

          {/* 현재 위치 — 문서의 머리글처럼 */}
          <p className="hidden items-center gap-3 border-l border-current/20 pl-5 lg:flex" aria-live="off">
            <span className="font-mono text-[12px] tracking-[0.04em] opacity-70">【{current.no}】</span>
            <span key={current.id} className="header-current mono-label opacity-80">
              {current.label}
            </span>
          </p>

          <nav className="ml-auto hidden xl:block" aria-label="주요 메뉴">
            <ul className="flex items-center gap-7">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={go(n.id)}
                    className={`nav-link text-[15px] font-medium ${current.id === n.id ? "is-current" : ""}`}
                    aria-current={current.id === n.id ? "location" : undefined}
                  >
                    {n.nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-4">
            <MagneticButton
              href="#contact"
              variant={dark ? "bronze" : "ink"}
              arrow={false}
              className="!h-10 !px-5 !text-[14px] sm:!h-11"
              onClick={go("contact")}
            >
              상담 문의
            </MagneticButton>
            <button
              ref={toggle}
              type="button"
              className="menu-toggle relative grid size-11 place-items-center xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => (open ? close() : openMenu())}
            >
              <span className={`menu-bar ${open ? "is-open" : ""}`} aria-hidden="true" />
            </button>
          </div>
        </div>
        <span ref={bar} className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-bronze-light/80" aria-hidden="true" />
      </header>

      {/* ---------- 모바일 · 태블릿 메뉴 ---------- */}
      <div
        ref={menu}
        id="mobile-menu"
        className="invisible fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-paper opacity-0 xl:hidden"
        aria-hidden={!open}
        data-theme="dark"
      >
        <div className="arch-grid" style={{ ["--grid-c" as string]: "color-mix(in srgb, var(--color-paper) 5%, transparent)" }} />
        <nav className="wrap relative flex-1 pb-10 pt-[calc(var(--header-h)+28px)]" aria-label="모바일 메뉴">
          <ol className="border-t border-paper/15">
            {navItems.map((n) => (
              <li key={n.id} className="overflow-hidden border-b border-paper/15">
                <a href={`#${n.id}`} onClick={go(n.id)} className="flex items-baseline gap-4 py-4 sm:py-5" data-menu-item tabIndex={open ? 0 : -1}>
                  <span className="w-14 shrink-0 font-mono text-[12px] text-bronze-light">【{n.no.slice(2)}】</span>
                  <span className="text-[clamp(1.6rem,6.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.04em]">{n.nav}</span>
                </a>
              </li>
            ))}
            <li className="overflow-hidden">
              <a href="#contact" onClick={go("contact")} className="flex items-baseline gap-4 py-4 text-bronze-light sm:py-5" data-menu-item tabIndex={open ? 0 : -1}>
                <span className="w-14 shrink-0 font-mono text-[12px]">【09】</span>
                <span className="text-[clamp(1.6rem,6.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.04em]">상담 문의 →</span>
              </a>
            </li>
          </ol>
          <dl className="mt-10 grid gap-5 text-[15px] sm:grid-cols-2">
            <div data-menu-foot>
              <dt className="mono-label text-paper/55">전화</dt>
              <dd className="mt-1">
                <a href={contact.phoneHref} className="link-u" tabIndex={open ? 0 : -1}>
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div data-menu-foot>
              <dt className="mono-label text-paper/55">이메일</dt>
              <dd className="mt-1">
                <a href={contact.emailHref} className="link-u" tabIndex={open ? 0 : -1}>
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>
        </nav>
      </div>
    </>
  );
}
