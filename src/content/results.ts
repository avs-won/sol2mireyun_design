// 수행 실적 — 기존 사이트 "Result Table"에서 그대로 추출한 목록(results.source.json).
// 건수는 목록 개수와 일치함을 확인했다 (27 · 37 · 8).
import source from "./results.source.json";

type SourceGroup = { title: string; count: string; n: number; items: string[] };

const keys = ["design", "ip", "map"] as const;
const shortNames = ["기술설계 · 사업화", "IP 컨설팅", "특허맵 · 기술조사"] as const;

export type ResultGroup = {
  key: (typeof keys)[number];
  title: string;
  short: string;
  items: string[];
};

export const resultGroups: ResultGroup[] = (source as SourceGroup[]).map((g, i) => ({
  key: keys[i],
  title: g.title.replace(/\s+/g, " ").trim(),
  short: shortNames[i],
  items: g.items,
}));

export const resultTotal = resultGroups.reduce((sum, g) => sum + g.items.length, 0);

export const resultFields = "전자, 기계, 화학, 소프트웨어 등 다양한 분야에서 수행한 컨설팅 실적입니다.";
