"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { contact, navItems } from "@/content/site";
import { asset } from "@/lib/env";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // 현재 위치 표시 — 화면 가운데 띠에 걸친 섹션
    const ids = navItems.map((n) => n.id);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-bg transition-colors duration-200 ${scrolled ? "border-border" : "border-transparent"}`}
      >
        <div className="wrap flex h-[var(--header-h)] items-center gap-6">
          <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="미래연 그룹 — 맨 위로">
            <Image src={asset("/brand/logo.png")} alt="" width={109} height={54} priority className="h-9 w-auto lg:h-10" />
            <span className="hidden border-l border-border pl-3 text-[14px] font-semibold leading-tight sm:block">
              미래연 그룹
              <span className="block text-[12px] font-medium tracking-[0.06em] text-muted-fg">SOL2 MIREYUN</span>
            </span>
          </a>

          <nav className="ml-auto hidden lg:block" aria-label="주요 메뉴">
            <ul className="flex items-center gap-1">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={current === n.id ? "location" : undefined}
                    className={`relative block px-3 py-3 text-[15px] font-medium transition-colors hover:text-primary ${
                      current === n.id ? "text-primary" : "text-fg/80"
                    }`}
                  >
                    {n.nav}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-1.5 h-px origin-left bg-primary transition-transform duration-300 ${
                        current === n.id ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <a href="#contact" className="btn btn-accent !min-h-11 !px-5 !text-[15px]">
              상담 문의
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="grid size-11 place-items-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span className={`absolute left-0 h-[1.5px] w-6 bg-fg transition-transform duration-200 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[1.5px] w-6 bg-fg transition-transform duration-200 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-bg lg:hidden ${open ? "block" : "hidden"}`}
      >
        <nav className="wrap pb-12 pt-4" aria-label="모바일 메뉴">
          <ol className="border-t border-border">
            {navItems.map((n, i) => (
              <li key={n.id} className="border-b border-border">
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={`#${n.id}`}
                  onClick={close}
                  className="flex items-baseline gap-4 py-4"
                >
                  <span className="garamond w-6 text-[15px] text-muted-fg">{String(i + 1).padStart(2, "0")}</span>
                  <span className="serif text-[24px] font-semibold">{n.nav}</span>
                </a>
              </li>
            ))}
          </ol>
          <a href="#contact" onClick={close} className="btn btn-accent mt-8 w-full">
            상담 문의하기 <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
          <dl className="mt-8 grid gap-4 text-[15px]">
            <div>
              <dt className="eyebrow text-muted-fg">전화</dt>
              <dd className="mt-1">
                <a href={contact.phoneHref} className="link-u">{contact.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-fg">이메일</dt>
              <dd className="mt-1">
                <a href={contact.emailHref} className="link-u">{contact.email}</a>
              </dd>
            </div>
          </dl>
        </nav>
      </div>
    </>
  );
}
