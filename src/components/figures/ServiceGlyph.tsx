import type { Service } from "@/content/services";
import { plate, poly, prism, isoCircle, seg, iso, fmt } from "@/lib/iso";

/*
  서비스별 도면 기호. 모두 같은 등각 투영 · 같은 선 규칙으로 그려
  하나의 도면집처럼 보이게 한다. data-draw 선은 선택될 때 그려진다.
*/

const D = { "data-draw": true, pathLength: 1 } as const;

function Ellipse({ cx, cy, z, r, cls = "", draw = true }: { cx: number; cy: number; z: number; r: number; cls?: string; draw?: boolean }) {
  const e = isoCircle(cx, cy, z, r);
  return <ellipse className={cls} {...(draw ? D : { "data-a": "fill" })} cx={fmt(e.cx)} cy={fmt(e.cy)} rx={fmt(e.rx)} ry={fmt(e.ry)} />;
}

function Prism({ x, y, w, d, z = 0, h, accent = false }: { x: number; y: number; w: number; d: number; z?: number; h: number; accent?: boolean }) {
  const p = prism(x, y, w, d, z, h);
  return (
    <g className="g-prism">
      <path className="g-fl" data-a="fill" d={p.left} />
      <path className="g-fr" data-a="fill" d={p.right} />
      <path className={accent ? "g-ft-accent" : "g-ft"} data-a="fill" d={p.top} />
      <path className="g-line" {...D} d={p.top + " " + p.left + " " + p.right} />
    </g>
  );
}

function Ground({ a = 96, t = 8 }: { a?: number; t?: number }) {
  const g = plate(a, t, -t);
  return (
    <g>
      <path className="g-gl" data-a="fill" d={g.left} />
      <path className="g-gr" data-a="fill" d={g.right} />
      <path className="g-gt" data-a="fill" d={g.top} />
      <path className="g-line" {...D} d={g.outline} />
    </g>
  );
}

function Claim() {
  const lines = [];
  for (let x = -66; x <= 66; x += 12) lines.push(x);
  return (
    <>
      <Ground />
      {lines.map((x) => (
        <path key={x} className="g-thin" {...D} d={seg([x, -72, 0], [x, 72, 0])} />
      ))}
      <path className="g-accent" {...D} d={poly([[-72, -72, 0], [72, -72, 0], [72, 72, 0], [-72, 72, 0]])} />
      <Prism x={-30} y={-30} w={60} d={60} h={58} />
      <Ellipse cx={0} cy={0} z={58} r={14} cls="g-accent" />
    </>
  );
}

function Transfer() {
  const [ax, ay] = iso(-58, 34, 62);
  const [bx, by] = iso(46, -46, 52);
  const cy = Math.min(ay, by) - 90;
  const arc = `M${fmt(ax)},${fmt(ay)} C${fmt(ax + 20)},${fmt(cy)} ${fmt(bx - 20)},${fmt(cy)} ${fmt(bx)},${fmt(by)}`;
  return (
    <>
      <Ground />
      <Prism x={-80} y={14} w={44} d={40} h={62} />
      <Prism x={26} y={-66} w={42} d={40} h={52} accent />
      <path className="g-accent" {...D} d={arc} />
      <path className="g-accent" {...D} d={`M${fmt(bx - 9)},${fmt(by - 14)} L${fmt(bx)},${fmt(by)} L${fmt(bx + 8)},${fmt(by - 15)}`} />
      <circle className="g-dot" data-a="fill" cx={fmt((ax + bx) / 2)} cy={fmt(cy + 27)} r={5} />
    </>
  );
}

function Match() {
  const ring = Array.from({ length: 6 }, (_, i) => {
    const t = (i / 6) * Math.PI * 2 + 0.3;
    return [Math.cos(t) * 82, Math.sin(t) * 82] as [number, number];
  });
  const matched = new Set([0, 2, 4]);
  return (
    <>
      <Ground />
      <Ellipse cx={0} cy={0} z={0} r={82} cls="g-thin" />
      {ring.map(([x, y], i) => (
        <path key={i} className={matched.has(i) ? "g-accent" : "g-thin"} {...D} d={seg([0, 0, 18], [x, y, 10])} />
      ))}
      {ring.map(([x, y], i) => (
        <Prism key={`n${i}`} x={x - 9} y={y - 9} w={18} d={18} h={matched.has(i) ? 22 : 10} accent={matched.has(i)} />
      ))}
      <Prism x={-16} y={-16} w={32} d={32} h={30} />
    </>
  );
}

function Scan() {
  const axes: [number, number][] = [
    [0, -96],
    [88, 54],
    [-88, 54],
  ];
  return (
    <>
      <Ground />
      {[30, 58, 86].map((r) => (
        <Ellipse key={r} cx={0} cy={0} z={0} r={r} cls={r === 58 ? "g-line" : "g-thin"} />
      ))}
      {axes.map(([x, y], i) => (
        <path key={i} className="g-line" {...D} d={seg([0, 0, 0], [x, y, 0])} />
      ))}
      <path className="g-accent" {...D} d={poly([[0, -70, 0], [52, 30, 0], [-36, 22, 0]])} />
      <path className="g-sweep" {...D} d={seg([0, 0, 0], [62, -62, 0])} />
      <Ellipse cx={0} cy={0} z={0} r={5} cls="g-dot" draw={false} />
    </>
  );
}

function Contract() {
  const sheet = poly([[-70, -86, 0], [44, -86, 0], [44, 64, 0], [-70, 64, 0]]);
  const rows = [-66, -50, -34, -18];
  const steps = [-80, 0, 80];
  return (
    <>
      <Ground />
      <path className="g-sheet" data-a="fill" d={sheet} />
      <path className="g-line" {...D} d={sheet} />
      {rows.map((y, i) => (
        <path key={y} className="g-thin" {...D} d={seg([-56, y, 0], [i === 3 ? -6 : 30, y, 0])} />
      ))}
      <path
        className="g-accent"
        {...D}
        d={`M${iso(-52, 30, 0).map(fmt).join(",")} Q${iso(-40, 14, 0).map(fmt).join(",")} ${iso(-28, 32, 0).map(fmt).join(",")} T${iso(0, 34, 0)
          .map(fmt)
          .join(",")} T${iso(24, 38, 0).map(fmt).join(",")}`}
      />
      <path className="g-thin" {...D} d={seg([-60, 48, 0], [34, 48, 0])} />
      <path className="g-line" {...D} d={seg([steps[0], 92, 0], [steps[2], 92, 0])} />
      {steps.map((x, i) => (
        <Ellipse key={x} cx={x} cy={92} z={0} r={7} cls={i === 2 ? "g-dot" : "g-node"} draw={false} />
      ))}
    </>
  );
}

function Capital() {
  const bars = [
    { x: -78, y: 30, h: 26 },
    { x: -40, y: 10, h: 50 },
    { x: -2, y: -10, h: 80 },
    { x: 36, y: -30, h: 118 },
  ];
  const tops = bars.map((b) => iso(b.x + 13, b.y + 13, b.h + 18));
  return (
    <>
      <Ground />
      {bars.map((b, i) => (
        <Prism key={i} x={b.x} y={b.y} w={26} d={26} h={b.h} accent={i === 3} />
      ))}
      <path className="g-accent" {...D} d={"M" + tops.map((p) => p.map(fmt).join(",")).join(" L")} />
      {tops.map(([x, y], i) => (
        <circle key={i} className={i === 3 ? "g-dot" : "g-node"} data-a="fill" cx={fmt(x)} cy={fmt(y)} r={3.5} />
      ))}
    </>
  );
}

const map = { claim: Claim, transfer: Transfer, match: Match, scan: Scan, contract: Contract, capital: Capital };

export default function ServiceGlyph({ glyph, title }: { glyph: Service["glyph"]; title: string }) {
  const G = map[glyph];
  return (
    <svg className="fig fig-light svc-glyph block h-full w-full" viewBox="-180 -172 360 292" role="img" aria-label={`${title} 도식`}>
      <G />
    </svg>
  );
}
