"use client";

import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Arrow } from "./Spec";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "bronze" | "ink" | "ghost";
  className?: string;
  arrow?: boolean;
  onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
};

/**
 * 커서에 살짝 끌려오는 버튼. 정밀 포인터(마우스)에서만 동작하고,
 * 터치 · 모션 감소 환경에서는 일반 링크로 남는다.
 */
export default function MagneticButton({ href, children, variant = "bronze", className = "", arrow = true, onClick, ariaLabel }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const label = el.querySelector(".btn-label");
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        const lx = label ? gsap.quickTo(label, "x", { duration: 0.6, ease: "power3" }) : null;
        const ly = label ? gsap.quickTo(label, "y", { duration: 0.6, ease: "power3" }) : null;

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * 0.22);
          yTo(dy * 0.32);
          lx?.(dx * 0.08);
          ly?.(dy * 0.1);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
          lx?.(0);
          ly?.(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const cls = variant === "bronze" ? "btn-solid-bronze" : variant === "ink" ? "btn-solid-ink" : "btn-ghost";

  return (
    <a ref={ref} href={href} className={`btn ${cls} ${className}`} onClick={onClick} aria-label={ariaLabel}>
      <span className="btn-label">{children}</span>
      {arrow && <Arrow />}
    </a>
  );
}
