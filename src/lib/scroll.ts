"use client";

import type Lenis from "lenis";

// Lenis 인스턴스를 앱 어디서든 쓰기 위한 아주 작은 저장소
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}
export function getLenis() {
  return instance;
}

/** 섹션으로 이동하고, 도착하면 키보드 포커스도 그 섹션으로 옮긴다 */
export function scrollToId(id: string, opts: { immediate?: boolean } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  const focus = () => {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };
  if (history.replaceState) history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);

  if (instance) {
    instance.scrollTo(el, {
      offset: 0,
      immediate: opts.immediate,
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      onComplete: focus,
    });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce || opts.immediate ? "auto" : "smooth", block: "start" });
    window.setTimeout(focus, reduce ? 0 : 700);
  }
}
