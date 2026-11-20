import Image from "next/image";
import { asset } from "@/lib/env";
import { contact, entities, site } from "@/content/site";
import { v4Nav } from "@/drafts/v4/nav";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-ink pb-28 pt-16">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Image src={asset("/brand/logo.png")} alt="Sol2 미래연" width={109} height={54} className="h-10 w-auto brightness-0 invert" />
          <p className="mt-6 max-w-[26em] text-[15px] leading-relaxed text-mute">{site.description}</p>
        </div>
        <nav className="lg:col-span-3" aria-label="바닥글 메뉴">
          <ul className="space-y-2 text-[15px]">
            {v4Nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="inline-block py-1 text-ivory/75 transition-colors hover:text-gold-2">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-1 text-[14px] text-mute lg:col-span-4">
          {entities.map((e) => (
            <p key={e.code} className="text-ivory/80">
              {e.name}
            </p>
          ))}
          <p className="pt-4">{contact.address}</p>
          <p>
            T. {contact.phone} · F. {contact.fax}
          </p>
          <p>{contact.email}</p>
        </div>
      </div>
      <div className="wrap mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6 font-mono text-[11px] tracking-[0.12em] text-mute">
        <span>{site.copyright}</span>
        <a href="#top" className="transition-colors hover:text-gold-2">
          TOP ↑
        </a>
      </div>
    </footer>
  );
}
