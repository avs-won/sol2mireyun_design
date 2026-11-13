// 9단계 사업화 로드맵 — 기존 사이트와 동일.
// 지원 구간은 기존 사이트 도표의 5:4 분할(1–5단계 / 6–9단계)을 그대로 따른다.

export const steps = [
  "기초실험",
  "개념정립",
  "기본성능검증",
  "부품/시스템검증",
  "시제품제작",
  "시제품성능검사",
  "신뢰성 평가",
  "제품인증",
  "양산",
] as const;

export type Lane = { label: string; note?: string; from: number; to: number; kind: "phase" | "support" };

/** from/to는 1부터 시작하는 단계 번호 (양끝 포함) */
export const laneRows: Lane[][] = [
  [
    { label: "원천 기술 단계", from: 1, to: 5, kind: "phase" },
    { label: "상용화 기술 개발 단계", from: 6, to: 9, kind: "phase" },
  ],
  [
    { label: "기술 및 논문 경향 조사", note: "기술환경 · 시장변화 고려", from: 1, to: 5, kind: "support" },
    { label: "경쟁사 분석 · 분쟁예방", from: 6, to: 9, kind: "support" },
  ],
  [
    { label: "기술이전 & 라이선싱 계약", note: "해외 참여기관", from: 1, to: 5, kind: "support" },
    { label: "개발내용 권리화", from: 6, to: 9, kind: "support" },
  ],
];

/** 특정 단계(1–9)에서 함께 진행되는 구간 */
export function lanesAt(step: number) {
  return laneRows.flat().filter((l) => step >= l.from && step <= l.to);
}

export type Phase = Lane & { supports: Lane[] };

/** 구간(원천 기술 · 상용화) 단위로 묶은 지원 내용 */
export const phases: Phase[] = laneRows
  .flat()
  .filter((l) => l.kind === "phase")
  .map((p) => ({
    ...p,
    supports: laneRows.flat().filter((s) => s.kind === "support" && s.from === p.from && s.to === p.to),
  }));
