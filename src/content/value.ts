// FROM INVENTION TO VALUE — 4단계 시그니처 장면의 문구.
// 본문은 기존 사이트의 "IP Financing", "Expertise & Network", "IP 기반 자금 설계" 문장을 재구성.

export const valueStages = [
  {
    key: "INVENT",
    fig: "4A",
    kr: "발명 · 기술 정비",
    title: "흩어진 기술을 정비합니다",
    body: "모든 가치는 기술에서 시작됩니다. 기업 내부 환경조사로 개발 기술을 정비하고, 무엇을 어떻게 권리로 만들지 설계합니다.",
    facts: ["기업 내부 환경조사", "개발 기술 정비", "등록 가능성 컨설팅"],
  },
  {
    key: "PROTECT",
    fig: "4B",
    kr: "권리화",
    title: "특허의 상태가 자금의 출발점입니다",
    body: "대출·출연 자금은 기본적으로 기술을 근거로 진행되며, 기업의 기술능력은 특허 현황으로 판단됩니다.",
    facts: [],
    rating: [
      { label: "등록된 특허 보유", stars: 5, note: null },
      { label: "출원된 특허 보유", stars: 3, note: null },
      { label: "출원 · 등록 특허 없음", stars: 0, note: "양수 · 실시권 취득 · 신규 출원으로 보완" },
    ],
  },
  {
    key: "CONNECT",
    fig: "4C",
    kr: "기술이전 · 거래",
    title: "필요한 곳과 기술을 잇습니다",
    body: "전문기관 네트워크로 산·학·연 기술이전 인프라를 구축하고, 수요기업의 애로기술과 연구자의 개발방향을 매칭합니다.",
    facts: ["기술이전 · 라이선싱 계약", "중개 · 알선 · 설명회", "금융기관 기술이전 자문"],
  },
  {
    key: "GROW",
    fig: "4D",
    kr: "자금 · 성장",
    title: "IP를 근거로 성장 경로를 설계합니다",
    body: "단계별 환경조성에 따른 인력·자금 스케줄을 세우고, 융자·출연부터 크라우드 펀딩·VC, IPO·승계까지 연결합니다.",
    facts: ["융자 · 출연", "해외 공동개발 자금 (미국·유럽·러시아)", "크라우드 펀딩 · VC", "IPO · 승계"],
  },
] as const;

/** CONNECT 장면의 외부 노드 — 기존 사이트에 등장하는 협력 주체 */
export const networkNodes = ["대학", "연구소", "수요기업", "해외 참여기관", "금융기관"] as const;

/** GROW 장면의 막대 라벨 */
export const growthSteps = ["융자 · 출연", "해외 공동개발", "크라우드 · VC", "IPO · 승계"] as const;
