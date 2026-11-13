import { seeded } from "@/lib/iso";
import type { LensKey } from "@/content/report";

/*
  특허맵 "개념도"용 점 배치. 실제 통계가 아니라 분석 방식(Macro · Micro · Tower · Patrol)을
  설명하기 위한 도식이며, 화면에도 '개념도'로 표기한다.
*/

export const N = 56;
export const W = 640;
export const H = 400;
export const X0 = 48;
export const Y0 = 356;

type P = { x: number; y: number; r: number; f: number };

const rnd = seeded(42);
const gauss = () => (rnd() + rnd() + rnd() + rnd() - 2) / 1.15;

const clusters = [
  { x: 150, y: 262, sx: 44, sy: 34, n: 13 },
  { x: 262, y: 150, sx: 38, sy: 30, n: 16 },
  { x: 410, y: 236, sx: 46, sy: 32, n: 15 },
  { x: 528, y: 116, sx: 36, sy: 28, n: 12 },
];

const macro: P[] = clusters.flatMap((c) =>
  Array.from({ length: c.n }, () => ({
    x: Math.round(c.x + gauss() * c.sx),
    y: Math.round(c.y + gauss() * c.sy),
    r: 4,
    f: 1,
  })),
);

/* Micro — 두 번째 군집을 확대 */
const focus = clusters[1];
const Z = 3.4;
export const GAP = { x: 430, y: 236, w: 150, h: 92 };
const micro: P[] = macro.map((p) => {
  let x = Math.round(300 + (p.x - focus.x) * Z);
  const y = Math.round(180 + (p.y - focus.y) * Z);
  // 공백기술 상자 안에는 점이 없도록 왼쪽으로 밀어낸다
  if (x > GAP.x - 14 && x < GAP.x + GAP.w + 14 && y > GAP.y - 14 && y < GAP.y + GAP.h + 14) x = GAP.x - 20 - Math.round(rnd() * 40);
  return { x, y, r: 6.5, f: 1 };
});

/* Tower — 다섯 개의 탑으로 쌓는다 */
const towerCounts = [7, 13, 17, 11, 8];
const towerX = (k: number) => 132 + k * 98;
const tower: P[] = [];
towerCounts.forEach((n, k) => {
  for (let j = 0; j < n; j++) {
    const col = j % 2;
    const row = Math.floor(j / 2);
    tower.push({ x: towerX(k) - 7 + col * 14, y: Y0 - 12 - row * 15, r: 5, f: 1 });
  }
});

/* Patrol — 시간축 위의 출원. 최근 18개월 안의 출원은 아직 공개 전(속이 빈 점) */
export const NOW_X = 548;
export const WINDOW_X = 418;
const patrol: P[] = Array.from({ length: N }, (_, i) => {
  const lane = i % 3;
  const x = Math.round(X0 + 30 + (i / (N - 1)) * (NOW_X - X0 - 40) + (rnd() - 0.5) * 8);
  return { x, y: 140 + lane * 72 + Math.round((rnd() - 0.5) * 14), r: 4.5, f: x > WINDOW_X ? 0 : 1 };
});

export const lensPositions: Record<LensKey, P[]> = { macro, micro, tower, patrol };

/** Macro 장면의 하단 막대 — 도식의 점 분포에서 계산 */
export const histogram = (() => {
  const bins = 12;
  const counts = Array(bins).fill(0) as number[];
  macro.forEach((p) => {
    const b = Math.min(bins - 1, Math.max(0, Math.floor(((p.x - X0) / (W - X0 - 20)) * bins)));
    counts[b]++;
  });
  const bw = (W - X0 - 20) / bins;
  return counts.map((c, i) => ({ x: X0 + i * bw + 3, w: bw - 6, h: c * 5 }));
})();

export const towers = towerCounts.map((n, k) => ({ x: towerX(k), h: Math.ceil(n / 2) * 15 + 10 }));
export const microFocus = { x: focus.x, y: focus.y, r: 58 };
