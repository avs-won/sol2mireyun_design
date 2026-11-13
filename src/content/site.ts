// 회사 기본 정보 — 모든 사실은 기존 사이트(sol2mireyun.com)에서 옮겨 왔다.

export const site = {
  name: "미래연 그룹",
  nameEn: "SOL2 MIREYUN",
  url: "https://sol2mireyun.com",
  tagline: "무기가 되는 특허, 돈이 되는 기술.",
  description:
    "특허를 설계하고 TIPS·정책자금·투자까지 연결하는 IP 금융 전문기관 미래연 그룹입니다. 지식재산 권리화, 기술이전·거래, 기술사업화 컨설팅, IP 기반 자금·경영 전략을 한 팀이 제공합니다.",
  copyright: "COPYRIGHT © 2026 SOL2MIREYUN. ALL RIGHTS RESERVED.",
} as const;

type Contact = {
  phone: string;
  phoneHref: string;
  fax: string;
  email: string;
  emailHref: string;
  address: string;
  mapHref: string | null;
  masked: boolean;
};

/**
 * 공개 시안 빌드(NEXT_PUBLIC_MASK_CONTACT=1)에서는 연락처를 가린다.
 * 빌드 때 값이 고정되므로 가린 빌드의 결과물에는 실제 연락처가 들어가지 않는다.
 */
export const contact: Contact =
  process.env.NEXT_PUBLIC_MASK_CONTACT === "1"
    ? {
        phone: "02-558-****",
        phoneHref: "#contact",
        fax: "02-558-****",
        email: "ma********@gmail.com",
        emailHref: "#contact",
        address: "서울특별시 강남구 ○○동 ○○빌딩",
        mapHref: null,
        masked: true,
      }
    : {
        phone: "02-558-9027",
        phoneHref: "tel:025589027",
        fax: "02-558-9095",
        email: "mayjo0510@gmail.com",
        emailHref: "mailto:mayjo0510@gmail.com",
        address: "서울특별시 강남구 대치동 956-6 한림빌딩 3층",
        mapHref: "https://map.naver.com/p/search/" + encodeURIComponent("서울특별시 강남구 대치동 956-6 한림빌딩"),
        masked: false,
      };

export const entities = [
  {
    code: "10",
    name: "국제특허법률사무소 미래연",
    role: "권리화",
    desc: "특허·실용신안·디자인 등 지식재산의 권리화와 국내외 출원·분쟁 대응을 전문으로 합니다.",
  },
  {
    code: "20",
    name: "㈜ 솔투미래연",
    role: "사업화 · 금융",
    desc: "기술의 정비로 기업 가치를 증대시키고, IP를 근거로 한 사업화·자금확보·투자 전략을 컨설팅합니다.",
  },
  {
    code: "30",
    name: "(사)꿈을 키우는 세상",
    role: "사회공헌",
    desc: "다음 세대의 꿈을 키우는 사회공헌 활동으로 그룹의 가치를 사회와 나눕니다.",
  },
] as const;

/** 지정 · 선정 이력 (기존 사이트 첫 화면) */
export const credentials = [
  { kind: "지정", text: "산업통상부 지정 기술거래기관" },
  { kind: "지정", text: "중소벤처기업부 · 기술보증기금 민간기술거래기관" },
  { kind: "선정", text: "KIAT IP사업화 컨설팅 협력업체" },
  { kind: "자문", text: "금융기관 기술이전 자문기관" },
] as const;

/** 섹션 목록 — 내비게이션과 헤더의 현재 위치 표시에 함께 쓴다 */
export const sections = [
  { id: "top", no: "0001", label: "Overview", nav: null },
  { id: "group", no: "0002", label: "미래연 그룹", nav: "그룹 소개" },
  { id: "expertise", no: "0002-2", label: "전문 인력", nav: null },
  { id: "services", no: "0003", label: "서비스", nav: "서비스" },
  { id: "value", no: "0004", label: "Invention to Value", nav: "가치 설계" },
  { id: "process", no: "0005", label: "사업화 로드맵", nav: "사업화 프로세스" },
  { id: "report", no: "0006", label: "전략 보고서", nav: "전략 보고서" },
  { id: "results", no: "0007", label: "수행 실적", nav: "실적" },
  { id: "ceo", no: "0008", label: "대표 변리사", nav: "대표 변리사" },
  { id: "contact", no: "0009", label: "상담 문의", nav: null },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const navItems = sections.filter((s) => s.nav !== null) as Array<{
  id: SectionId;
  no: string;
  label: string;
  nav: string;
}>;
