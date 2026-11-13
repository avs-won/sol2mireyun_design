// 6대 서비스 — 본문(body)은 기존 사이트 문장, points는 기존 사이트의 관련 문장에서 뽑은 항목.
// headline은 리뉴얼용 카피(사실 주장 없음).

export type Stage = "INVENT" | "PROTECT" | "CONNECT" | "GROW";

export type Service = {
  no: string;
  title: string;
  en: string;
  headline: string;
  body: string;
  points: string[];
  stages: Stage[];
  glyph: "claim" | "transfer" | "match" | "scan" | "contract" | "capital";
};

export const services: Service[] = [
  {
    no: "01",
    title: "지식재산 권리화 지원",
    en: "IP Rights",
    headline: "기술을 권리로 정비합니다.",
    body: "기업 내부 환경조사를 통해 개발 기술을 정비하고, 출원·기술이전 등 사업화의 기본이 되는 권리화 전략을 구축합니다.",
    points: [
      "기업 내부 환경조사 · 개발 기술 정비",
      "특허 · 실용신안 · 디자인 출원",
      "국내외 출원 · 분쟁 대응",
      "등록 특허 양수 · 실시권 취득 · 신규 출원 전략",
    ],
    stages: ["INVENT", "PROTECT"],
    glyph: "claim",
  },
  {
    no: "02",
    title: "기술이전 · 기술거래",
    en: "Technology Transfer",
    headline: "좋은 기술이 주인을 만나도록.",
    body: "국내외 대학·연구소·기업 기술의 등록 가능성 컨설팅, 우수기술 발굴과 기술사업화 가능성 분석을 제공합니다.",
    points: [
      "대학 · 연구소 · 기업 기술의 등록 가능성 컨설팅",
      "우수기술 발굴",
      "기술사업화 가능성 분석",
      "산 · 학 · 연 기술이전 인프라",
    ],
    stages: ["CONNECT"],
    glyph: "transfer",
  },
  {
    no: "03",
    title: "기술 마케팅 지원",
    en: "Tech Marketing",
    headline: "기술을 필요로 하는 곳에 닿게.",
    body: "수요기업 발굴을 위한 중개·알선 대행, 기술이전 설명회·상담 주선, 기술이전 정보 DB 구축·검색 서비스를 제공합니다.",
    points: [
      "수요기업 발굴 · 중개 · 알선 대행",
      "기술이전 설명회 · 상담 주선",
      "기술이전 정보 DB 구축 · 검색",
      "수요기업 애로기술 ↔ 연구자 개발방향 매칭",
    ],
    stages: ["CONNECT"],
    glyph: "match",
  },
  {
    no: "04",
    title: "기업 내·외부 환경분석",
    en: "Environment Analysis",
    headline: "시장에 들어서기 전, 지형부터 읽습니다.",
    body: "권리화 정도·재무현황·시장동향을 분석해 시장진입 전략을 제공하고, 기술분쟁 예방과 마켓·홍보 전략을 수립합니다.",
    points: [
      "권리화 정도 · 재무현황 · 시장동향 분석",
      "시장진입 전략",
      "기술분쟁 예방",
      "마켓 · 홍보 전략",
    ],
    stages: ["INVENT", "PROTECT"],
    glyph: "scan",
  },
  {
    no: "05",
    title: "기술사업화 지원",
    en: "Commercialization",
    headline: "협상부터 사후관리까지 책임집니다.",
    body: "기술거래·기술평가, 협상 전략과 거래조건 검토, 계약서 작성, 회계·투자 계획 및 사후관리까지 지원합니다.",
    points: [
      "기술거래 · 기술평가",
      "협상 전략 · 거래조건 검토",
      "계약서 작성 · 계약 준수 모니터링",
      "로열티 · 실사 · 회계 · 투자 계획",
    ],
    stages: ["CONNECT", "GROW"],
    glyph: "contract",
  },
  {
    no: "06",
    title: "IP 기반 자금 · 경영 전략",
    en: "IP Finance",
    headline: "특허를 자금의 근거로 만듭니다.",
    body: "단계별 자금 스케줄, 융자·출연·VC·크라우드 펀딩 전략, IPO·승계까지 IP를 근거로 한 경영 전략을 설계합니다.",
    points: [
      "단계별 인력 · 자금 스케줄",
      "융자 · 출연 · 해외 공동개발 자금",
      "크라우드 펀딩 · VC 전략",
      "IPO · 승계 · 코스닥 상장기업 관리",
    ],
    stages: ["GROW"],
    glyph: "capital",
  },
];
