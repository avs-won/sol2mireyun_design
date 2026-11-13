import { plate, poly, seg, isoCircle, prism, iso, leader, seeded, fmt } from "@/lib/iso";
import { networkNodes, growthSteps } from "@/content/value";

/*
  FIG. 4 — 하나의 판이 네 단계를 거친다.
  4A INVENT  : 흩어진 점이 판 위 격자로 모이고, 중심 원이 그려진다
  4B PROTECT : 청구범위 경계 · 해칭 · 벽이 세워진다
  4C CONNECT : 판의 모서리에서 외부 기관으로 선이 뻗는다
  4D GROW    : 판 위에 기둥이 솟아 가치로 자란다
  SSR(모션 감소 · JS 없음)에서는 모든 단계가 겹친 완성 도면을 보여 준다.
*/

export const VA = 132;
export const VT = 18;
const tz = VT;
const g = plate(VA, VT);

/* 4A — 격자 점 (가운데 4개는 중심 원 자리라 비운다) */
const gx = [-100, -60, -20, 20, 60, 100];
const gy = [-96, -34, 34, 96];
const rnd = seeded(7);
export const dots = gy
  .flatMap((y) => gx.map((x) => [x, y] as [number, number]))
  .filter(([x, y]) => !(Math.abs(x) < 40 && Math.abs(y) < 40))
  .map(([x, y]) => {
    const [X, Y] = iso(x, y, tz);
    const ang = rnd() * Math.PI * 2;
    const dist = 140 + rnd() * 160;
    return { X, Y, dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist * 0.7 - 40 };
  });

/* 4B — 청구범위 */
const C = 112;
const hatch: number[] = [];
for (let x = -C + 14; x < C; x += 14) hatch.push(x);
const WALL = 30;

/* 4C — 외부 기관 */
const L = iso(-VA, VA, tz);
const R = iso(VA, -VA, tz);
const Tp = iso(-VA, -VA, tz);
const B = iso(VA, VA, 0);
export const nodePos: [number, number][] = [
  [-372, -112],
  [-238, -286],
  [238, -286],
  [372, -112],
  [0, 248],
];
const nodeFrom: [number, number][] = [L, [Tp[0] - 40, Tp[1] + 22], [Tp[0] + 40, Tp[1] + 22], R, B];

/* 4D — 기둥 */
export const vBars = [
  { x: -104, y: 44, h: 34 },
  { x: -52, y: 18, h: 66 },
  { x: 0, y: -8, h: 104 },
  { x: 52, y: -34, h: 150 },
];
export const V_BAR_W = 34;
export function vBarPaths(i: number, h: number) {
  const b = vBars[i];
  return prism(b.x, b.y, V_BAR_W, V_BAR_W, tz, Math.max(h, 0.01));
}
export function vBarTop(i: number, h: number) {
  const b = vBars[i];
  return iso(b.x + V_BAR_W / 2, b.y + V_BAR_W / 2, tz + h);
}

const D = { "data-draw": true, pathLength: 1 } as const;

export default function ValueFigure() {
  const core = [36, 64].map((r) => isoCircle(0, 0, tz, r));
  const dimX = 300;
  return (
    <svg className="fig v-fig block h-full w-full" viewBox="-430 -340 860 640" role="img" aria-labelledby="fig4-title fig4-desc">
      <title id="fig4-title">FIG. 4 — 기술이 가치가 되기까지</title>
      <desc id="fig4-desc">
        하나의 기술 판 위에 점이 정렬되고(발명), 청구범위 경계와 해칭이 생기며(권리화), 대학·연구소·수요기업·해외 참여기관·금융기관으로 선이 연결되고(기술이전), 판 위에 기둥이 솟아오릅니다(자금·성장).
      </desc>

      <g className="v-world">
        {/* 4C 연결선 — 판 뒤로 지나가도록 먼저 그린다 */}
        <g className="v-net">
          {nodePos.map(([x, y], i) => (
            <path key={i} className="v-link" {...D} d={leader(nodeFrom[i][0], nodeFrom[i][1], x, y, i % 2 ? 0.18 : -0.18)} />
          ))}
        </g>

        {/* 판 */}
        <g className="v-base">
          <path className="pf-l" data-a="fill" d={g.left} />
          <path className="pf-r" data-a="fill" d={g.right} />
          <path className="pf-t" data-a="fill" d={g.top} />
          <path className="po" {...D} d={g.outline} />
        </g>

        {/* 4B 청구범위 — 해칭과 경계 */}
        <g className="v-claim">
          {hatch.map((x) => (
            <path key={x} className="v-hatch" {...D} d={seg([x, -C, tz], [x, C, tz])} />
          ))}
          <path className="v-claim-line" {...D} d={poly([[-C, -C, tz], [C, -C, tz], [C, C, tz], [-C, C, tz]])} />
        </g>

        {/* 4A 중심 원 + 점 */}
        <g className="v-core">
          {core.map((e, i) => (
            <ellipse key={i} {...D} className={i === 0 ? "v-core-in" : "v-core-out"} cx={fmt(e.cx)} cy={fmt(e.cy)} rx={fmt(e.rx)} ry={fmt(e.ry)} />
          ))}
        </g>
        <g className="v-dots">
          {dots.map((d, i) => (
            <circle key={i} className="v-dot" cx={fmt(d.X)} cy={fmt(d.Y)} r={3.4} />
          ))}
        </g>

        {/* 4B 벽 — 청구범위가 세워진다 */}
        <g className="v-walls">
          {[
            [-C, C],
            [C, C],
            [C, -C],
          ].map(([x, y], i) => (
            <path key={i} className="v-wall" {...D} d={seg([x, y, tz], [x, y, tz + WALL])} />
          ))}
          <path className="v-wall" {...D} d={poly([[-C, C, tz + WALL], [C, C, tz + WALL], [C, -C, tz + WALL]], false)} />
          <path className="v-wall v-wall-back" {...D} d={poly([[C, -C, tz + WALL], [-C, -C, tz + WALL], [-C, C, tz + WALL]], false)} />
        </g>
        <g className="v-claim-label" data-a="fade">
          <path className="leader" d={leader(...iso(-C, 20, tz + WALL), -330, 40, -0.25)} />
          <text className="v-label" x={-338} y={46} textAnchor="end">
            청구범위
          </text>
          <text className="v-label-en" x={-338} y={66} textAnchor="end">
            CLAIM 1
          </text>
        </g>

        {/* 4C 노드 */}
        <g className="v-nodes">
          {nodePos.map(([x, y], i) => {
            const r = 15;
            const d = `M${x},${y - r * 0.58} L${x + r},${y} L${x},${y + r * 0.58} L${x - r},${y} Z`;
            const below = y > 0;
            return (
              <g key={i} className="v-node" style={{ transformOrigin: `${x}px ${y}px` }}>
                <path className="v-node-shape" d={d} />
                <text className="v-label" x={x} y={below ? y + 36 : y - 24} textAnchor="middle">
                  {networkNodes[i]}
                </text>
              </g>
            );
          })}
        </g>

        {/* 4D 기둥 */}
        <g className="v-grow">
          {vBars.map((b, i) => {
            const p = vBarPaths(i, b.h);
            const [lx, ly] = vBarTop(i, b.h);
            return (
              <g key={i} className="v-bar" data-bar={i}>
                <path className="bar-l" d={p.left} />
                <path className="bar-r" d={p.right} />
                <path className="bar-t" d={p.top} />
                <text className="v-bar-label" x={fmt(lx)} y={fmt(ly - 16)} textAnchor="middle">
                  {growthSteps[i]}
                </text>
              </g>
            );
          })}
          <g className="v-dim">
            <path className="v-dim-line" {...D} d={`M${dimX},96 L${dimX},-250`} />
            <path className="v-dim-line" {...D} d={`M${dimX - 7},-238 L${dimX},-252 L${dimX + 7},-238`} />
            <path className="v-dim-line" {...D} d={`M${dimX - 9},96 L${dimX + 9},96`} />
            <text className="v-label-en v-dim-label" x={dimX + 16} y={-240}>
              VALUE
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}
