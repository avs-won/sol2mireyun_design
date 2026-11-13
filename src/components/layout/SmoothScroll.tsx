"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { setLenis, scrollToId } from "@/lib/scroll";
import { SCROLL_CONFIG, createSnap } from "@/lib/snap";

/**
 * 부드러운 스크롤(Lenis)과 ScrollTrigger를 한 박자로 묶는다.
 * - 모션 감소 설정에서는 Lenis를 켜지 않고 브라우저 기본 스크롤을 쓴다.
 * - 터치 스크롤은 Lenis 기본값대로 네이티브를 유지한다.
 * - 페이지 안 앵커(#...)는 여기서 한 번에 처리한다.
 * - 휠 한 번 = 한 장 넘김 (섹션 스냅, lib/snap.ts — 설정값도 거기에 있다).
 */
export default function SmoothScroll() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("motion-ok");

    const reduce = window.matchMedia(MQ.reduce).matches;
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let detachSnap: (() => void) | null = null;

    if (!reduce) {
      const snap = createSnap();
      lenis = new Lenis({
        lerp: SCROLL_CONFIG.lerp,
        smoothWheel: true,
        wheelMultiplier: SCROLL_CONFIG.wheelMultiplier,
        virtualScroll: snap.virtualScroll, // 휠 입력을 먼저 받아 한 장씩 넘긴다 (lib/snap.ts)
      });
      lenis.on("scroll", ScrollTrigger.update);
      detachSnap = snap.attach(lenis);
      // 개발 서버에서만: 콘솔에서 스크롤 동작을 점검할 수 있게 노출
      if (process.env.NODE_ENV === "development") (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
    };
    document.addEventListener("click", onClick);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    // 주소에 #섹션이 붙어 들어온 경우, 고정 장면 계산이 끝난 뒤 다시 맞춘다
    let hashTimer = 0;
    if (location.hash.length > 1) {
      const id = decodeURIComponent(location.hash.slice(1));
      hashTimer = window.setTimeout(() => scrollToId(id, { immediate: true }), 450);
    }

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(hashTimer);
      detachSnap?.();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
