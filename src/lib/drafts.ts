// 시안 목록 — 첫 화면(/)의 시안 카드와 모든 시안 하단의 전환 버튼이 함께 쓴다.
// 새 시안을 추가할 때는 여기 한 줄 + src/app/(vN)/ 폴더 하나만 만들면 된다.

export type DraftId = "v2" | "v3" | "v4";

export type Draft = {
  id: DraftId;
  name: string;
  concept: string;
  summary: string;
  keywords: string[];
  motion: "강함" | "보통" | "약함";
  isNew?: boolean;
};

export const drafts: Draft[] = [
  {
    id: "v4",
    name: "Seal",
    concept: "권리가 되는 순간",
    summary:
      "어두운 무대 위에서 빛 입자가 발명 → 권리 → 거래 → 자금으로 모양을 바꿉니다. 첫 화면 한 줄로 '특허 출원부터 자금까지'를 전달하고, 스크롤에 맞춰 장면이 이어지는 시네마틱 시안.",
    keywords: ["입자 모핑", "키네틱 타이포", "고정 장면", "다크 · 골드"],
    motion: "강함",
    isNew: true,
  },
  {
    id: "v3",
    name: "Editorial Swiss",
    concept: "신뢰와 권위",
    summary:
      "밝은 바탕 · 12단 그리드 · 큰 세리프 제목. 대표 변리사와 실적 수치를 먼저 보여 주는 정통 법률사무소형 시안. 움직임은 최소한으로.",
    keywords: ["세리프", "헤어라인", "실적 우선", "라이트"],
    motion: "약함",
  },
  {
    id: "v2",
    name: "명세서",
    concept: "FROM INVENTION TO VALUE",
    summary:
      "특허 도면의 문법(분해도 · 참조번호 · 치수선)을 사이트 전체 언어로 쓴 시안. 스크롤하면 도면이 조립되고 변형됩니다.",
    keywords: ["특허 도면", "등각 분해도", "섹션 스냅", "네이비 · 브론즈"],
    motion: "보통",
  },
];

/** 하단 전환 버튼에 보일 순서 (오래된 것 → 새것) */
export const switcherOrder: DraftId[] = ["v2", "v3", "v4"];
