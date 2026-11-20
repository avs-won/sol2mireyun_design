"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced } from "@/drafts/v4/lib/motion";

type W = Window & { __lenis?: Lenis; __v4lenis?: Lenis | null };

/** 같은 페이지 안 앵커로 이동 — Lenis가 있으면 관성 스크롤, 없으면 기본 스크롤 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as W).__v4lenis;
  if (lenis) lenis.scrollTo(el, { offset: id === "top" ? 0 : -8, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" });
}

/**
 * 부드러운 스크롤(Lenis) + ScrollTrigger 동기화 + 상단 진행 막대 + 앵커 처리.
 * 모션 감소 설정에서는 Lenis를 켜지 않는다. 터치는 네이티브 스크롤을 유지한다.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("motion-ok");

    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!prefersReduced()) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      (window as W).__v4lenis = lenis;
      if (process.env.NODE_ENV === "development") (window as W).__lenis = lenis;
    }

    // 상단 진행 막대
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar?.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      history.replaceState(null, "", `#${id}`);
      scrollToId(id);
      // 키보드 사용자를 위해 이동한 섹션으로 초점도 옮긴다
      const target = document.getElementById(id);
      if (target && id !== "top") {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    let hashTimer = 0;
    if (location.hash.length > 1) {
      const id = decodeURIComponent(location.hash.slice(1));
      hashTimer = window.setTimeout(() => scrollToId(id), 500);
    }

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", refresh);
      window.clearTimeout(hashTimer);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      (window as W).__v4lenis = null;
    };
  }, []);

  return null;
}
