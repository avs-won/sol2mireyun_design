import Image from "next/image";
import { contact, entities, navItems, site } from "@/content/site";
import { asset } from "@/lib/env";

export default function Footer() {
  return (
    <footer className="on-dark bg-fg text-white">
      <div className="wrap border-t border-white/15 pb-10 pt-14">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <Image src={asset("/brand/logo.png")} alt="Sol2 미래연" width={109} height={54} className="h-10 w-auto brightness-0 invert" />
            <ul className="mt-6 space-y-1 text-[15px] text-white/70">
              {entities.map((e) => (
                <li key={e.code}>{e.name}</li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 sm:col-span-7 md:col-span-4">
            <h2 className="eyebrow text-white/60">Contact</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">
              {contact.address}
              <br />
              전화 <a href={contact.phoneHref} className="inline-block py-1 hover:text-white">{contact.phone}</a> · 팩스 {contact.fax}
              <br />
              <a href={contact.emailHref} className="inline-block break-all py-1 hover:text-white">{contact.email}</a>
            </p>
          </div>
          <nav className="col-span-12 sm:col-span-5 md:col-span-3" aria-label="사이트맵">
            <h2 className="eyebrow text-white/60">Sitemap</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 text-[15px] text-white/75">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a className="block py-1.5 hover:text-white" href={`#${n.id}`}>
                    {n.nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-12 border-t border-white/15 pt-6 text-[13px] tracking-[0.04em] text-white/55">{site.copyright}</p>
      </div>
    </footer>
  );
}
