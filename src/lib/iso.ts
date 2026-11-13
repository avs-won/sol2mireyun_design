// 등각 투영(isometric) 도면을 그리기 위한 계산 도구.
// 공간 좌표 (x, y, z) → 화면 좌표 (X, Y). z가 커질수록 화면 위로 올라간다.

const C = Math.cos(Math.PI / 6); // 0.866
const S = 0.5;

export type P3 = [number, number, number];

const f = (n: number) => (Math.round(n * 100) / 100).toString();

export function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * C, (x + y) * S - z];
}

export function pt(x: number, y: number, z = 0) {
  const [X, Y] = iso(x, y, z);
  return `${f(X)},${f(Y)}`;
}

/** 공간 위 점들을 잇는 경로 (closed=true면 닫힌 다각형) */
export function poly(points: P3[], closed = true) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${pt(p[0], p[1], p[2])}`).join(" ") + (closed ? " Z" : "");
}

export function seg(a: P3, b: P3) {
  return `M${pt(a[0], a[1], a[2])} L${pt(b[0], b[1], b[2])}`;
}

/** 정사각 판(반폭 a, 두께 t) — 윗면, 왼쪽 옆면, 오른쪽 옆면, 외곽선 */
export function plate(a: number, t: number, z = 0) {
  const top = poly([
    [-a, -a, z + t],
    [a, -a, z + t],
    [a, a, z + t],
    [-a, a, z + t],
  ]);
  const left = poly([
    [-a, a, z + t],
    [a, a, z + t],
    [a, a, z],
    [-a, a, z],
  ]);
  const right = poly([
    [a, a, z + t],
    [a, -a, z + t],
    [a, -a, z],
    [a, a, z],
  ]);
  // 외곽선: 윗면 + 보이는 아래 모서리 + 앞 세로 모서리
  const outline =
    top +
    " " +
    poly(
      [
        [-a, a, z + t],
        [-a, a, z],
        [a, a, z],
        [a, -a, z],
        [a, -a, z + t],
      ],
      false,
    ) +
    " " +
    seg([a, a, z + t], [a, a, z]);
  return { top, left, right, outline };
}

/** 직육면체 기둥 (밑면 x0..x0+w, y0..y0+d, 높이 z0..z0+h) */
export function prism(x0: number, y0: number, w: number, d: number, z0: number, h: number) {
  const x1 = x0 + w;
  const y1 = y0 + d;
  const z1 = z0 + h;
  const top = poly([
    [x0, y0, z1],
    [x1, y0, z1],
    [x1, y1, z1],
    [x0, y1, z1],
  ]);
  const left = poly([
    [x0, y1, z1],
    [x1, y1, z1],
    [x1, y1, z0],
    [x0, y1, z0],
  ]);
  const right = poly([
    [x1, y1, z1],
    [x1, y0, z1],
    [x1, y0, z0],
    [x1, y1, z0],
  ]);
  return { top, left, right };
}

/** 수평면 위의 원 → 화면 위 타원 */
export function isoCircle(cx: number, cy: number, z: number, r: number) {
  const [X, Y] = iso(cx, cy, z);
  return { cx: X, cy: Y, rx: r * C * Math.SQRT2, ry: r * S * Math.SQRT2 };
}

/** 두 화면 점을 잇는 부드러운 지시선 (특허 도면의 곡선 리더) */
export function leader(x1: number, y1: number, x2: number, y2: number, bend = 0.35) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * bend;
  const cy = my + dx * bend * 0.4;
  return `M${f(x1)},${f(y1)} Q${f(cx)},${f(cy)} ${f(x2)},${f(y2)}`;
}

/** 결정론적 의사난수 — SSR과 클라이언트가 같은 값을 갖도록 */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export { f as fmt };
