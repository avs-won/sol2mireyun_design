import Hero from "@/drafts/v3/components/sections/Hero";
import Proof from "@/drafts/v3/components/sections/Proof";
import Group from "@/drafts/v3/components/sections/Group";
import Services from "@/drafts/v3/components/sections/Services";
import Value from "@/drafts/v3/components/sections/Value";
import Process from "@/drafts/v3/components/sections/Process";
import Report from "@/drafts/v3/components/sections/Report";
import Results from "@/drafts/v3/components/sections/Results";
import Leadership from "@/drafts/v3/components/sections/Leadership";
import Contact from "@/drafts/v3/components/sections/Contact";
import Footer from "@/drafts/v3/components/Footer";

// 순서: Trust & Authority 패턴 — Hero → Proof → Solution → CTA (design-system/mireyun-v3/MASTER.md)
export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Proof />
        <Group />
        <Services />
        <Value />
        <Process />
        <Report />
        <Results />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
