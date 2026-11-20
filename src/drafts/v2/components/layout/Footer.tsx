import Image from "next/image";
import { contact, entities, navItems, site } from "@/content/site";
import { asset } from "@/lib/env";

export default function Footer() {
  return (
    <footer id="site-footer" data-section="contact" data-theme="dark" className="relative bg-ink text-paper">
      <div className="wrap border-t border-paper/12 pb-10 pt-14 lg:pt-20">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <Image src={asset("/brand/logo.png")} alt="Sol2 미래연" width={109} height={54} className="h-11 w-auto brightness-0 invert" />
            <ul className="mt-6 space-y-1 text-[14px] text-paper/70">
              {entities.map((e) => (
                <li key={e.code}>{e.name}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 sm:col-span-7 md:col-span-4 lg:col-span-4 lg:col-start-6">
            <h2 className="mono-label text-paper/55">Contact</h2>
            <dl className="mt-4 grid grid-cols-[3.5rem_1fr] gap-x-3 gap-y-2 text-[14px] text-paper/80">
              <dt className="text-paper/55">전화</dt>
              <dd>
                <a className="hover:text-paper" href={contact.phoneHref}>
                  {contact.phone}
                </a>
              </dd>
              <dt className="text-paper/55">팩스</dt>
              <dd>{contact.fax}</dd>
              <dt className="text-paper/55">이메일</dt>
              <dd>
                <a className="break-all hover:text-paper" href={contact.emailHref}>
                  {contact.email}
                </a>
              </dd>
              <dt className="text-paper/55">주소</dt>
              <dd>{contact.address}</dd>
            </dl>
          </div>

          <nav className="col-span-12 sm:col-span-5 md:col-span-3 lg:col-span-2 lg:col-start-11" aria-label="사이트맵">
            <h2 className="mono-label text-paper/55">Sitemap</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] text-paper/80 sm:grid-cols-1">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a className="hover:text-paper" href={`#${n.id}`}>
                    {n.nav}
                  </a>
                </li>
              ))}
              <li>
                <a className="hover:text-paper" href="#contact">
                  상담 문의
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/12 pt-6 text-[12px] text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono tracking-[0.04em]">{site.copyright}</p>
          <p className="font-mono tracking-[0.04em]">FIG. 1–9 · FROM INVENTION TO VALUE</p>
        </div>
      </div>
    </footer>
  );
}
