import Hero from "@/drafts/v2/components/sections/Hero";
import Identity from "@/drafts/v2/components/sections/Identity";
import Expertise from "@/drafts/v2/components/sections/Expertise";
import Services from "@/drafts/v2/components/sections/Services";
import ValueChain from "@/drafts/v2/components/sections/ValueChain";
import Process from "@/drafts/v2/components/sections/Process";
import Report from "@/drafts/v2/components/sections/Report";
import Proof from "@/drafts/v2/components/sections/Proof";
import Leadership from "@/drafts/v2/components/sections/Leadership";
import Contact from "@/drafts/v2/components/sections/Contact";
import Footer from "@/drafts/v2/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Identity />
        <Expertise />
        <Services />
        <ValueChain />
        <Process />
        <Report />
        <Proof />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
