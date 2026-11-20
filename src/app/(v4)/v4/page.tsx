import Hero from "@/drafts/v4/components/sections/Hero";
import Proof from "@/drafts/v4/components/sections/Proof";
import Stages from "@/drafts/v4/components/sections/Stages";
import Services from "@/drafts/v4/components/sections/Services";
import Process from "@/drafts/v4/components/sections/Process";
import Report from "@/drafts/v4/components/sections/Report";
import Leader from "@/drafts/v4/components/sections/Leader";
import Group from "@/drafts/v4/components/sections/Group";
import Results from "@/drafts/v4/components/sections/Results";
import Contact from "@/drafts/v4/components/sections/Contact";
import Footer from "@/drafts/v4/components/Footer";

// v4 "Seal" — 첫 화면에서 '무엇을 하는 곳인지'(특허 출원 → 기술이전 → 자금)를 바로 말하고,
// 이후 장면이 그 흐름을 하나씩 증명한다: 실적 → 4단계 → 서비스 → 로드맵 → 보고서 → 대표 → 그룹 → 실적 목록 → 상담
export default function V4Page() {
  return (
    <>
      <main id="main">
        <Hero />
        <Proof />
        <Stages />
        <Services />
        <Process />
        <Report />
        <Leader />
        <Group />
        <Results />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
