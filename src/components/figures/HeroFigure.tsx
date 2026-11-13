import { plate, poly, seg, isoCircle, prism, iso, leader, fmt } from "@/lib/iso";

/*
  FIG. 1 — 발명에서 가치까지의 분해도
  네 장의 판이 아래에서 위로 INVENT → PROTECT → CONNECT → GROW를 이룬다.
  SSR 상태는 "분해된" 최종 형태이며, 모션은 Hero.tsx가 담당한다.
*/

export const A = 96; // 판 반폭
export const T = 16; // 판 두께
export const GAP = 142; // 분해 상태의 판 간격
export const Z_EXPLODED = [0, GAP, GAP * 2, GAP * 3];
export const Z_COLLAPSED = [0, T, T * 2, T * 3];
/** 분해 → 조립으로 갈 때 각 판이 내려가는 거리 (화면 px) */
export const COLLAPSE_DELTA = Z_EXPLODED.map((z, i) => z - Z_COLLAPSED[i]);

const plateGeo = plate(A, T);
const tz = T; // 윗면 높이

/* --- 판별 내용물 (공간 좌표, 앞쪽(+x,+y)으로 치우쳐 위 판에 가리지 않게) --- */
const O = 18;

function CoreContent() {
  const rings = [20, 38, 56].map((r) => isoCircle(O, O, tz, r));
  const c = isoCircle(O, O, tz, 4);
  return (
    <g className="pc">
      <path data-draw pathLength={1} className="pc-thin" d={seg([-A, O, tz], [A, O, tz])} />
      <path data-draw pathLength={1} className="pc-thin" d={seg([O, -A, tz], [O, A, tz])} />
      {rings.map((e, i) => (
        <ellipse key={i} data-draw pathLength={1} cx={fmt(e.cx)} cy={fmt(e.cy)} rx={fmt(e.rx)} ry={fmt(e.ry)} />
      ))}
      <ellipse className="pc-dot" data-a="fill" cx={fmt(c.cx)} cy={fmt(c.cy)} rx={fmt(c.rx)} ry={fmt(c.ry)} />
    </g>
  );
}

function ClaimContent() {
  const x0 = -58;
  const x1 = 84;
  const hatch = [];
  for (let x = x0 + 12; x < x1; x += 12) hatch.push(x);
  return (
    <g className="pc">
      {hatch.map((x) => (
        <path key={x} data-draw pathLength={1} className="pc-thin" d={seg([x, x0, tz], [x, x1, tz])} />
      ))}
      <path data-draw pathLength={1} className="pc-strong" d={poly([[x0, x0, tz], [x1, x0, tz], [x1, x1, tz], [x0, x1, tz]])} />
    </g>
  );
}

const grid = [-46, 18, 82];
const nodes = grid.flatMap((y) => grid.map((x) => [x, y] as [number, number]));
const links: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [4, 5], [2, 5], [4, 7], [3, 6], [6, 7], [7, 8], [5, 8], [1, 5], [3, 7],
];

function NetworkContent() {
  return (
    <g className="pc">
      {links.map(([a, b], i) => (
        <path key={i} data-draw pathLength={1} className="pc-thin" d={seg([nodes[a][0], nodes[a][1], tz], [nodes[b][0], nodes[b][1], tz])} />
      ))}
      {nodes.map(([x, y], i) => {
        const e = isoCircle(x, y, tz, i === 4 ? 9 : 6);
        return <ellipse key={i} data-a="fill" className={i === 4 ? "pc-node pc-node-hub" : "pc-node"} cx={fmt(e.cx)} cy={fmt(e.cy)} rx={fmt(e.rx)} ry={fmt(e.ry)} />;
      })}
    </g>
  );
}

/** GROW 판 위의 막대 — 높이는 Hero 모션에서 다시 계산해 자라난다 */
export const BARS = [
  { x: -66, y: 44, h: 22 },
  { x: -28, y: 22, h: 40 },
  { x: 10, y: 0, h: 62 },
  { x: 48, y: -22, h: 92 },
];
export const BAR_W = 22;

export function barPaths(i: number, h: number) {
  const b = BARS[i];
  return prism(b.x, b.y, BAR_W, BAR_W, tz, Math.max(h, 0.01));
}

function GrowContent() {
  return (
    <g className="pc">
      {BARS.map((b, i) => {
        const p = barPaths(i, b.h);
        return (
          <g key={i} className="bar" data-bar={i}>
            <path className="bar-l" d={p.left} />
            <path className="bar-r" d={p.right} />
            <path className="bar-t" d={p.top} />
          </g>
        );
      })}
    </g>
  );
}

/* --- 참조번호 --- */
const anchorL = iso(-A / 2, A, T / 2); // 왼쪽 옆면 가운데
const anchorR = iso(A, -A / 2, T / 2); // 오른쪽 옆면 가운데

const refs = [
  { no: "100", en: "INVENT", ko: "발명 · 기술 정비", side: "l" as const },
  { no: "200", en: "PROTECT", ko: "권리화", side: "r" as const },
  { no: "300", en: "CONNECT", ko: "기술이전 · 거래", side: "l" as const },
  { no: "400", en: "GROW", ko: "자금 · 성장", side: "r" as const },
];
export const heroRefs = refs;

function Ref({ r }: { r: (typeof refs)[number] }) {
  const left = r.side === "l";
  const tx = left ? -232 : 232;
  const ty = -26;
  const [ax, ay] = left ? anchorL : anchorR;
  const lx = left ? tx + 10 : tx - 10;
  return (
    <g className="ref">
      <path className="leader" data-draw pathLength={1} d={leader(lx, ty - 4, ax, ay, left ? -0.28 : 0.28)} />
      <circle className="leader-dot" data-a="fill" cx={fmt(ax)} cy={fmt(ay)} r={2.4} />
      <g className="ref-text" data-a="fade" textAnchor={left ? "end" : "start"}>
        <text className="ref-no" x={tx} y={ty}>
          {r.no}
        </text>
        <text className="ref-ko" x={tx} y={ty + 22}>
          {r.ko}
        </text>
        <text className="ref-en" x={tx} y={ty + 40}>
          {r.en}
        </text>
      </g>
    </g>
  );
}

const contents = [CoreContent, ClaimContent, NetworkContent, GrowContent];

export default function HeroFigure({ hot, onHot }: { hot: number | null; onHot?: (i: number | null) => void }) {
  const top = -A - T - Z_EXPLODED[3];
  return (
    <svg
      className="fig hero-fig block h-full w-full"
      viewBox="-360 -690 720 900"
      role="img"
      aria-labelledby="fig1-title fig1-desc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="fig1-title">FIG. 1 — 발명에서 가치까지의 분해도</title>
      <desc id="fig1-desc">
        네 장의 판이 아래에서부터 발명(100), 권리화(200), 기술이전·거래(300), 자금·성장(400)을 나타내며 하나의 축 위에 정렬되어 있습니다.
      </desc>

      {/* 중심축 — 일점쇄선 */}
      <g className="axis" data-a="scale-y">
        <line x1="0" y1="168" x2="0" y2={top - 70} className="axis-line" />
        <path d={`M-6,${top - 58} L0,${top - 72} L6,${top - 58}`} className="axis-arrow" />
      </g>
      <text className="axis-cap" data-a="fade" x="0" y={top - 92} textAnchor="middle">
        VALUE
      </text>
      <text className="axis-cap" data-a="fade" x="0" y="196" textAnchor="middle">
        INVENTION
      </text>

      {Z_EXPLODED.map((z, i) => {
        const Content = contents[i];
        return (
          <g key={i} transform={`translate(0 ${-z})`}>
            <g className="pl-a" data-i={i}>
              <g className="pl-b">
                <g
                  className={`pl-c plate-${i}${hot === i ? " is-hot" : ""}`}
                  onPointerEnter={onHot ? () => onHot(i) : undefined}
                  onPointerLeave={onHot ? () => onHot(null) : undefined}
                >
                  <path className="pf-l" data-a="fill" d={plateGeo.left} />
                  <path className="pf-r" data-a="fill" d={plateGeo.right} />
                  <path className="pf-t" data-a="fill" d={plateGeo.top} />
                  <path className="po" data-draw pathLength={1} d={plateGeo.outline} />
                  <Content />
                  <Ref r={refs[i]} />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
