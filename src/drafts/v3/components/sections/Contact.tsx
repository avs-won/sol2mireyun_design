import { contact } from "@/content/site";
import ContactForm from "@/drafts/v3/components/ContactForm";

/** 09 — 상담 문의 (Trust & Authority: Clear CTA path) */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y on-dark relative bg-fg text-white">
      <div className="wrap">
        <p data-reveal className="flex items-baseline gap-3 border-t border-white/20 pt-4 eyebrow text-gold">
          <span className="garamond text-[15px] tracking-normal">08</span>
          <span>Consultation</span>
        </p>

        <div className="mt-10 grid-12 gap-y-14 lg:mt-14">
          <div className="col-span-12 lg:col-span-5">
            <h2 id="contact-title" data-reveal className="h-section">
              귀사의 기술,
              <br />
              어떤 가치가 될 수
              <br />
              있을까요?
            </h2>
            <p data-reveal className="lead mt-8 prose-w text-white/75">
              기술 정비부터 권리화, 기술이전, 자금 확보까지. 현재 상황을 남겨 주시면 담당 전문가가 검토 후 회신드립니다.
            </p>

            <dl className="mt-12 border-t border-white/20 text-[16px]">
              {[
                { k: "전화", v: contact.phone, href: contact.phoneHref },
                { k: "이메일", v: contact.email, href: contact.emailHref },
                { k: "팩스", v: contact.fax, href: null },
                { k: "주소", v: contact.address, href: contact.mapHref },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-white/15 py-4">
                  <dt className="text-white/60">{r.k}</dt>
                  <dd className="break-words">
                    {r.href ? (
                      <a
                        href={r.href}
                        className="link-u inline-block py-1"
                        {...(r.k === "주소" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {r.v}
                        {r.k === "주소" && <span className="sr-only"> (네이버 지도, 새 창)</span>}
                      </a>
                    ) : (
                      r.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-reveal className="col-span-12 border border-white/15 bg-white/[0.03] p-6 sm:p-8 lg:col-span-6 lg:col-start-7 lg:p-10">
            <h3 className="serif text-[24px] font-bold">온라인 상담 신청</h3>
            <p className="mb-8 mt-2 text-[15px] text-white/65">* 표시 항목만 입력하셔도 됩니다.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
