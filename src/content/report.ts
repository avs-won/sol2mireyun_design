// 특허맵 · 전략 보고서 — 기존 사이트 "Patent Map" 섹션 문장.

export const reportIntro = {
  body: "전략서(Patent Map)는 특정 분야의 국내외 특허·출원 현황을 상세히 분석해 기술 흐름을 시각화한 자료입니다.",
  uses: ["연구개발 테마 선정", "신제품 개발 전략 수립", "시장진입 시 분쟁예방", "경쟁사 현황분석"],
};

export const lensModes = [
  {
    key: "macro",
    name: "Macro 분석",
    short: "전체 지형",
    desc: "출원인별·연도별 통계 그래프로 기술 동향의 전반적 현황을 파악합니다.",
  },
  {
    key: "micro",
    name: "Micro 분석",
    short: "공백 기술",
    desc: "기술 개발 단계와 공백기술을 확인하고, OS Matrix·IP History 등으로 구체적으로 분석합니다.",
  },
  {
    key: "tower",
    name: "전략적 분석",
    short: "Tower 분석",
    desc: "자체 개발한 Tower 분석으로 기술-Revenue 관계, 경쟁사 비교·융합기술을 분석하고 회피설계 기반 권리화 전략을 수립합니다.",
  },
  {
    key: "patrol",
    name: "Patrol 서비스",
    short: "18개월 감시",
    desc: "특허는 출원 후 18개월이 지나면 공개됩니다. 경쟁사·자사 사업화 기술과 관련된 출원 특허의 공개 내용을 지속 모니터링하고 대응 전략을 도출합니다.",
  },
] as const;

export type LensKey = (typeof lensModes)[number]["key"];

export const reportExtras = [
  {
    title: "IP 기반 경영 전략",
    body: "IP를 근거로 한 Financing·마켓 전략, 사업화 자금·투자, 해외 공동협약, 상속·승계, IPO 및 코스닥 상장기업 관리까지 지원합니다.",
  },
  {
    title: "협상 · 계약 · 사후관리",
    body: "기술거래·기술평가, 협상전략과 거래조건 검토, 계약서 작성부터 계약 준수 모니터링, 로열티·실사 서비스까지 사후관리를 책임집니다.",
  },
] as const;
