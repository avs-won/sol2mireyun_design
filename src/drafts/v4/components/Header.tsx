"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { contact } from "@/content/site";
import { asset } from "@/lib/env";
import { v4Nav } from "@/drafts/v4/nav";


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // 내려갈 때는 숨기고, 올라오면 다시 보인다 (본문을 가리지 않게)
      setHidden(y > 640 && y > lastY + 2);
      if (y < lastY - 2 || y < 640) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    v4Nav.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-60 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-expo)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "border-b border-[var(--line)] bg-ink/75 backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}
      >
        <div className="wrap flex h-[var(--header-h)] items-center gap-6">
          <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="국제특허법률사무소 미래연 — 맨 위로">
            <Image src={asset("/brand/logo.png")} alt="" width={109} height={54} priority className="h-8 w-auto brightness-0 invert" />
            <span className="hidden border-l border-[var(--line-strong)] pl-3 text-[13px] font-semibold leading-tight sm:block">
              국제특허법률사무소 미래연
              <span className="block font-mono text-[11px] font-normal tracking-[0.14em] text-mute">SOL2 MIREYUN</span>
            </span>
          </a>

          <nav className="ml-auto hidden xl:block" aria-label="주요 메뉴">
            <ul className="flex items-center">
              {v4Nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={current === n.id ? "location" : undefined}
                    className={`group relative block px-3.5 py-3 text-[15px] font-medium transition-colors duration-200 ${
                      current === n.id ? "text-gold-2" : "text-ivory/75 hover:text-ivory"
                    }`}
                  >
                    {n.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 bottom-2 h-px origin-left bg-gold transition-transform duration-500 ease-[var(--ease-expo)] ${
                        current === n.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-4">
            <a href={contact.phoneHref} className="hidden font-mono text-[14px] text-ivory/80 transition-colors hover:text-gold-2 md:block">
              {contact.phone}
            </a>
            <a href="#contact" className="btn btn-gold !min-h-[44px] !px-5 !text-[15px]">
              상담 신청
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="relative grid size-11 place-items-center xl:hidden"
              aria-expanded={open}
              aria-controls="v4-menu"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className={`absolute h-px w-6 bg-ivory transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
              <span aria-hidden="true" className={`absolute h-px w-6 bg-ivory transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="v4-menu"
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        hidden={!open}
        className="fixed inset-0 z-50 bg-ink/95 pt-[var(--header-h)] backdrop-blur-xl xl:hidden"
      >
        <nav className="wrap flex h-full flex-col justify-between pb-28 pt-8" aria-label="모바일 메뉴">
          <ul>
            {v4Nav.map((n, i) => (
              <li key={n.id} className="border-b border-[var(--line)]">
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={`#${n.id}`}
                  onClick={close}
                  className="flex items-baseline gap-4 py-4 text-[26px] font-bold tracking-[-0.03em]"
                  style={{ animation: open ? `v4-menu-in 600ms ${80 + i * 50}ms var(--ease-expo) both` : undefined }}
                >
                  <span className="font-mono text-[12px] font-normal text-gold">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-1 text-[15px] text-mute">
            <a href={contact.phoneHref} className="block py-2 font-mono text-ivory">
              T. {contact.phone}
            </a>
            <a href={contact.emailHref} className="block py-2">
              {contact.email}
            </a>
          </div>
        </nav>
        <style>{`@keyframes v4-menu-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
      </div>
    </>
  );
}
