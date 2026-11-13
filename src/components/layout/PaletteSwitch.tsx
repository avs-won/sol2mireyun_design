"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * 검토용 옵션 막대 (클라이언트 미팅용). 시안 공유 빌드와 개발 서버에서만 렌더링된다.
 *  - 색 시안: 기존 · A · B · C  → 주소 ?palette=a
 *  - 스크롤: 섹션 넘김 켬/끔     → 주소 ?snap=0
 * 선택은 주소에 반영되어 그 링크를 그대로 공유할 수 있다.
 * 첫 페인트 전 적용은 layout.tsx 의 paletteScript 가 맡는다.
 */
export const PALETTES = [
  { id: "", short: "기존", label: "기존" },
  { id: "a", short: "A", label: "A 맑게" },
  { id: "b", short: "B", label: "B 청사진" },
  { id: "c", short: "C", label: "C 도장" },
] as const;

type PaletteId = (typeof PALETTES)[number]["id"];

const EVENT = "mireyun:review";

function setParam(key: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  window.history.replaceState(window.history.state, "", url);
}

function applyPalette(id: PaletteId) {
  const html = document.documentElement;
  if (id) html.dataset.palette = id;
  else delete html.dataset.palette;
  setParam("palette", id || null);
  syncThemeColor();
  window.dispatchEvent(new Event(EVENT));
}

function applySnap(on: boolean) {
  const html = document.documentElement;
  if (on) delete html.dataset.snap;
  else html.dataset.snap = "off";
  setParam("snap", on ? null : "0");
  window.dispatchEvent(new Event(EVENT));
}

function syncThemeColor() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const ink = getComputedStyle(document.documentElement).getPropertyValue("--color-ink").trim();
  if (meta && ink) meta.content = ink;
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
// 스냅샷은 문자열 하나로 — "팔레트|스냅"
const read = () => `${document.documentElement.dataset.palette ?? ""}|${document.documentElement.dataset.snap === "off" ? "off" : "on"}`;
const readServer = () => "|on";

const chip = (on: boolean) =>
  `rounded-full px-3 py-1.5 transition-colors ${on ? "bg-bronze-light font-medium text-ink" : "text-paper/75 hover:bg-paper/10 hover:text-paper"}`;

export default function PaletteSwitch() {
  const [palette, snap] = useSyncExternalStore(subscribe, read, readServer).split("|") as [PaletteId, "on" | "off"];

  // ?palette= 로 열었을 때 브라우저 상단 색도 맞춘다
  useEffect(syncThemeColor, []);

  return (
    <nav
      aria-label="검토 옵션"
      className="fixed bottom-[64px] left-4 z-[80] flex flex-wrap items-center gap-1 rounded-[22px] border border-paper/20 bg-ink/85 p-1 text-[12px] text-paper shadow-[0_8px_24px_rgba(0,0,0,.25)] backdrop-blur-md sm:bottom-5 sm:left-auto sm:right-5 sm:rounded-full"
    >
      <span className="px-2 font-mono text-paper/60">색</span>
      {PALETTES.map((p) => (
        <button key={p.id || "base"} type="button" aria-pressed={p.id === palette} onClick={() => applyPalette(p.id)} className={chip(p.id === palette)}>
          <span className="sm:hidden">{p.short}</span>
          <span className="hidden sm:inline">{p.label}</span>
        </button>
      ))}
      <span className="mx-1 hidden h-4 w-px bg-paper/20 lg:block" aria-hidden="true" />
      {/* 섹션 넘김은 휠 스크롤(데스크톱)에서만 동작하므로 넓은 화면에서만 보인다 */}
      <button
        type="button"
        aria-pressed={snap === "on"}
        onClick={() => applySnap(snap !== "on")}
        className={`hidden lg:inline-block ${chip(snap === "on")}`}
        title="휠 한 번에 한 장씩 넘깁니다"
      >
        섹션 넘김 {snap === "on" ? "켬" : "끔"}
      </button>
    </nav>
  );
}
