"use client";

import { useRef } from "react";
import { useSectionMotion } from "@/drafts/v4/components/ui";
import { gsap, MQ } from "@/drafts/v4/lib/motion";
import ContactForm from "@/drafts/v4/components/ContactForm";
import { contact } from "@/content/site";

/** 상담 문의 — 거대한 문장이 스크롤에 맞춰 금빛으로 채워지고, 바로 아래에 연락처와 폼 */
export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, () => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        ".contact-fill",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: ".contact-title", start: "top 80%", end: "bottom 40%", scrub: true } },
      );
    });
    return () => mm.revert();
  });

  const rows = [
    { k: "TEL", v: contact.phone, href: contact.phoneHref },
    { k: "EMAIL", v: contact.email, href: contact.emailHref },
    { k: "FAX", v: contact.fax, href: null },
    { k: "ADDRESS", v: contact.address, href: contact.mapHref },
  ];

  return (
    <section ref={root} id="contact" className="section relative overflow-hidden border-t border-[var(--line)]" aria-labelledby="contact-title">
      <div aria-hidden="true" className="pointer-events-none absolute -left-[20%] top-0 size-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(212_175_106/0.1),transparent_60%)]" />
      <div className="wrap relative">
        <p className="eyebrow" data-reveal>
          <span className="text-mute">09</span> Contact
        </p>
        <h2 id="contact-title" className="contact-title relative mt-6 text-[clamp(40px,8vw,128px)] font-extrabold leading-[1.05] tracking-[-0.05em]">
          <span className="block text-ivory/20">
            다음 특허는
            <br />
            귀사의 기술입니다.
          </span>
          <span aria-hidden="true" className="contact-fill gold-text absolute inset-0 block">
            다음 특허는
            <br />
            귀사의 기술입니다.
          </span>
        </h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <p className="lead">기술 설명 한 줄이면 충분합니다. 보유 기술과 필요한 지원을 남겨 주시면 검토 후 회신드립니다.</p>
            <dl className="mt-10 border-t border-[var(--line)]">
              {rows.map((r) => (
                <div key={r.k} className="grid grid-cols-[88px_1fr] items-baseline gap-4 border-b border-[var(--line)] py-4">
                  <dt className="font-mono text-[11px] tracking-[0.16em] text-gold">{r.k}</dt>
                  <dd className="text-[16px]">
                    {r.href ? (
                      <a href={r.href} className="transition-colors hover:text-gold-2" {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {r.v}
                      </a>
                    ) : (
                      r.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-3xl border border-[var(--line)] bg-ink-2/80 p-6 backdrop-blur sm:p-10 lg:col-span-8" data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
