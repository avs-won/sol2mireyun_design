import Hero from "@/components/sections/Hero";
import Identity from "@/components/sections/Identity";
import Expertise from "@/components/sections/Expertise";
import Services from "@/components/sections/Services";
import ValueChain from "@/components/sections/ValueChain";
import Process from "@/components/sections/Process";
import Report from "@/components/sections/Report";
import Proof from "@/components/sections/Proof";
import Leadership from "@/components/sections/Leadership";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

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
