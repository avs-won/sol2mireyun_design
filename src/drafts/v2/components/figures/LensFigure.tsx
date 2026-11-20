import { lensPositions, histogram, towers, microFocus, GAP, NOW_X, WINDOW_X, W, H, X0, Y0 } from "./lensData";

/* FIG. 6 — 특허맵 분석 개념도. 모드 전환 모션은 Report.tsx가 담당한다. */
export default function LensFigure() {
  const macro = lensPositions.macro;
  return (
    <svg className="fig lens-fig block h-full w-full" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="특허맵 분석 개념도: 전체 지형, 공백기술 확대, Tower 분석, 18개월 공개 감시">
      <defs>
        <clipPath id="lens-clip">
          <rect x={X0} y={16} width={W - X0 - 12} height={Y0 - 16} />
        </clipPath>
      </defs>

      {/* 축 */}
      <g className="lens-axes">
        <line x1={X0} y1={Y0} x2={W - 12} y2={Y0} />
        <line x1={X0} y1={Y0} x2={X0} y2={16} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} className="lens-tick" x1={X0 + ((W - X0 - 12) / 6) * i} x2={X0 + ((W - X0 - 12) / 6) * i} y1={Y0} y2={Y0 + 6} />
        ))}
      </g>
      <text className="lens-cap" x={W - 12} y={Y0 + 26} textAnchor="end">
        시간 →
      </text>
      <text className="lens-cap lens-cap-y" x={X0 - 14} y={20} textAnchor="end" transform={`rotate(-90 ${X0 - 14} 20)`}>
        기술 분야 · 출원인
      </text>

      {/* 모드별 보조 요소 */}
      <g className="lens-layer" data-layer="macro">
        {histogram.map((b, i) => (
          <rect key={i} className="lens-hist" x={b.x} y={Y0 - b.h} width={b.w} height={b.h} />
        ))}
        <circle className="lens-focus" cx={microFocus.x} cy={microFocus.y} r={microFocus.r} />
        <text className="lens-note" x={microFocus.x + microFocus.r + 8} y={microFocus.y - microFocus.r + 6}>
          확대 →
        </text>
      </g>
      <g className="lens-layer" data-layer="micro" opacity={0}>
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`v${i}`} className="lens-matrix" x1={X0 + 20 + i * 140} x2={X0 + 20 + i * 140} y1={24} y2={Y0 - 8} />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line key={`h${i}`} className="lens-matrix" x1={X0 + 8} x2={W - 20} y1={40 + i * 100} y2={40 + i * 100} />
        ))}
        <rect className="lens-gap" x={GAP.x} y={GAP.y} width={GAP.w} height={GAP.h} rx={2} />
        <text className="lens-note lens-note-strong" x={GAP.x + 12} y={GAP.y + 26}>
          공백기술
        </text>
        <text className="lens-note" x={GAP.x + 12} y={GAP.y + 46}>
          OS Matrix · IP History
        </text>
      </g>
      <g className="lens-layer" data-layer="tower" opacity={0}>
        {towers.map((t, i) => (
          <g key={i}>
            <rect className="lens-tower" x={t.x - 18} y={Y0 - t.h - 6} width={36} height={t.h + 6} />
          </g>
        ))}
        <text className="lens-note" x={X0 + 16} y={40}>
          기술 – Revenue 관계 · 경쟁사 비교 · 융합기술
        </text>
      </g>
      <g className="lens-layer" data-layer="patrol" opacity={0}>
        <rect className="lens-window" x={WINDOW_X} y={96} width={NOW_X - WINDOW_X} height={238} />
        <line className="lens-now" x1={NOW_X} x2={NOW_X} y1={84} y2={Y0} />
        <line className="lens-scan" x1={WINDOW_X} x2={WINDOW_X} y1={96} y2={334} />
        <text className="lens-note lens-note-strong" x={NOW_X + 8} y={96}>
          현재
        </text>
        <text className="lens-note" x={WINDOW_X + 8} y={88}>
          출원 후 18개월 — 미공개
        </text>
        <text className="lens-note" x={X0 + 16} y={88}>
          공개된 출원
        </text>
      </g>

      {/* 점 */}
      <g clipPath="url(#lens-clip)">
        {macro.map((p, i) => (
          <circle key={i} className="lens-dot" cx={p.x} cy={p.y} r={p.r} />
        ))}
      </g>
    </svg>
  );
}
