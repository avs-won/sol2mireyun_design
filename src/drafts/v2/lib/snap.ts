"use client";

import type Lenis from "lenis";
import type { VirtualScrollData } from "lenis";

/* =========================================================
   스크롤 설정 — 클라이언트 미팅 후 조정할 값은 모두 여기에 모아 둔다.
   ========================================================= */
export const SCROLL_CONFIG = {
  /** Lenis 관성 (섹션 맞춤을 끈 상태의 자유 스크롤에 적용). 작을수록 더 미끄러진다 */
  lerp: 0.1,
  /** 휠 한 번에 움직이는 양 배율 (자유 스크롤) */
  wheelMultiplier: 1,

  snap: {
    /** 섹션 넘김 사용 여부. 검토용으로는 주소 ?snap=0 또는 하단 버튼으로 끌 수 있다 */
    enabled: true,
    /** 한 번 넘어가는 데 걸리는 시간 (초) */
    duration: 1.05,
    /**
     * 섹션은 데스크톱에서 한 화면(100vh)에 맞춰 두었다 → 보통 섹션 하나 = 한 칸.
     * 아주 낮은 화면에서 섹션이 화면보다 이 배수 이상 길어지면, 가려지는 부분이 없도록 끝 위치에 한 칸을 더 둔다.
     */
    tallRatio: 1.04,
    /** 긴 섹션 안에서 한 장에 넘기는 양 (화면 높이 대비). 0.8 = 앞 장의 20%가 겹쳐 보인다 */
    pageStep: 0.8,
    /** 휠이 이 시간(ms) 이상 멈췄다가 다시 오면 새 동작으로 본다 (트랙패드 관성 무시) */
    gestureGap: 180,
    /** ↑↓ · PageUp/Down · Space 키로도 한 장씩 넘긴다 */
    keyboard: true,
  },
} as const;

// 출발과 도착이 모두 부드러운 곡선 — 한 장씩 넘기는 느낌
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------- 장면 구역 ----------
   고정(pin) 장면처럼 안쪽에 여러 정지점이 있는 구간은 구역으로 등록한다.
   구역 안에서는 등록한 정지점(= 장면이 완성된 위치)에서만 멈춘다. */
const zones = new Map<string, () => number[]>();

export function registerSnapZone(id: string, getPoints: () => number[]) {
  zones.set(id, getPoints);
  return () => {
    zones.delete(id);
  };
}

export function isSnapOn() {
  return SCROLL_CONFIG.snap.enabled && document.documentElement.dataset.snap !== "off";
}

/** 지금 레이아웃 기준의 정지점 목록 (매번 새로 계산 — 리사이즈 · 고정 장면 변화에 그대로 따라간다) */
export function computeStops(lenis: Lenis) {
  const cfg = SCROLL_CONFIG.snap;
  const V = window.innerHeight;
  const y = lenis.scroll;
  const limit = Math.round(lenis.limit);

  const ranges = Array.from(zones.values())
    .map((get) => get().slice().sort((a, b) => a - b))
    .filter((p) => p.length > 1);
  // 구역 안 + 마지막 장면 바로 뒤(화면 절반 이내)는 섹션 정지점을 두지 않는다
  // — 같은 장면이 한 번 더 멈춰 "넘겼는데 그대로"처럼 느껴지는 것을 막는다
  const insideZone = (s: number) => ranges.some((p) => s > p[0] + 4 && s < p[p.length - 1] + V * 0.5);

  const raw: number[] = [];
  document.querySelectorAll<HTMLElement>("main > section, #site-footer").forEach((el) => {
    const top = el.getBoundingClientRect().top + y;
    const h = el.offsetHeight;
    raw.push(top);
    // 넘치는 양이 아래 여백 정도라면(가려지는 내용 없음) 칸을 더 두지 않는다
    if (h > V * cfg.tallRatio && h - V > 48) {
      const end = top + h - V; // 섹션 끝이 화면 아래에 맞는 위치
      for (let s = top + V * cfg.pageStep; s < end - V * 0.25; s += V * cfg.pageStep) raw.push(s);
      raw.push(end);
    }
  });

  const pts = raw.filter((s) => !insideZone(s));
  ranges.forEach((p) => pts.push(...p));

  // 정리: 범위 안으로 자르고, 정렬하고, 화면 10% 안에 붙은 점은 하나로 (뒤쪽 = 장면이 더 완성된 쪽을 남긴다)
  const sorted = pts.map((s) => Math.round(Math.min(Math.max(s, 0), limit))).sort((a, b) => a - b);
  const out: number[] = [];
  for (const s of sorted) {
    if (out.length && s - out[out.length - 1] < V * 0.1) out[out.length - 1] = s;
    else out.push(s);
  }
  if (out[0] !== 0) out.unshift(0);
  return out;
}

/**
 * 한 번의 휠 동작 = 한 장 넘김 (전체 화면 스크롤 스냅).
 * - 휠(마우스 · 트랙패드)과 키보드에 적용. 모바일 터치는 기본 스크롤 그대로.
 * - 넘어가는 동안과 트랙패드 관성이 남아 있는 동안의 입력은 무시한다.
 * - 화면보다 긴 섹션은 안에서 여러 장으로, 고정 장면은 장면 하나씩 넘긴다.
 * Lenis의 virtualScroll 훅으로 연결한다 (false를 돌려주면 Lenis는 그 입력을 처리하지 않는다).
 */
export function createSnap() {
  const cfg = SCROLL_CONFIG.snap;
  let lenis: Lenis | null = null;
  let animating = false;
  let lastTime = 0;
  let lastAbs = 0;
  let safety = 0;

  const go = (dir: number) => {
    if (!lenis || animating) return;
    const cur = lenis.scroll;
    const stops = computeStops(lenis);
    const target = dir > 0 ? stops.find((s) => s > cur + 4) : [...stops].reverse().find((s) => s < cur - 4);
    if (target === undefined) return;
    animating = true;
    const done = () => {
      animating = false;
      window.clearTimeout(safety);
    };
    safety = window.setTimeout(done, cfg.duration * 1000 + 400);
    lenis.scrollTo(target, { duration: cfg.duration, easing: easeInOutCubic, lock: true, force: true, onComplete: done });
  };

  /** Lenis 생성 옵션 virtualScroll 에 넣는다 */
  const virtualScroll = ({ deltaY, event }: VirtualScrollData) => {
    if (!lenis || event.type !== "wheel" || event.ctrlKey || lenis.isStopped || !isSnapOn()) return true;
    // 안쪽에 따로 스크롤되는 영역은 건드리지 않는다
    if (event.composedPath().some((n) => n instanceof HTMLElement && n.hasAttribute("data-lenis-prevent"))) return true;

    if (event.cancelable) event.preventDefault();
    const now = performance.now();
    const gap = now - lastTime;
    const abs = Math.abs(deltaY);
    lastTime = now;
    if (abs < 2) return false;
    // 새 동작: 잠시 멈췄다가 다시 굴렸거나, 관성으로 줄어들던 값이 다시 커졌을 때
    const fresh = gap > cfg.gestureGap || (abs > lastAbs * 1.5 && abs > 20);
    lastAbs = abs;
    if (fresh) go(Math.sign(deltaY));
    return false;
  };

  const onKey = (e: KeyboardEvent) => {
    if (!cfg.keyboard || !lenis || lenis.isStopped || !isSnapOn() || e.defaultPrevented) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName))) return;
    let dir = 0;
    if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) dir = 1;
    else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) dir = -1;
    if (!dir) return;
    e.preventDefault();
    go(dir);
  };

  return {
    virtualScroll,
    attach(l: Lenis) {
      lenis = l;
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        window.clearTimeout(safety);
        lenis = null;
      };
    },
  };
}
