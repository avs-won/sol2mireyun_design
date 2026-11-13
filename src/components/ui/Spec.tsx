import type { HTMLAttributes, ReactNode } from "react";

/** 【0002】 문단번호형 섹션 표식 */
export function SpecMark({
  no,
  children,
  className = "",
  ...rest
}: { no: string; children: ReactNode; className?: string } & HTMLAttributes<HTMLParagraphElement> & { [k: `data-${string}`]: string | boolean | undefined }) {
  return (
    <p className={`spec-mark ${className}`} {...rest}>
      <b aria-hidden="true">【{no}】</b>
      <span>{children}</span>
    </p>
  );
}

/** 도면 틀의 네 모서리 표식 */
export function Corners() {
  return (
    <>
      <span className="corner tl" aria-hidden="true" />
      <span className="corner tr" aria-hidden="true" />
      <span className="corner bl" aria-hidden="true" />
      <span className="corner br" aria-hidden="true" />
    </>
  );
}

/** 선으로 그린 화살표 — 호버 때 한 번 밀려 지나간다 */
export function Arrow({ className = "" }: { className?: string }) {
  const one = (
    <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 11h15M12.5 5.5 18 11l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
  return (
    <span className={`btn-arrow ${className}`} aria-hidden="true">
      {one}
      {one}
    </span>
  );
}

/** 줄 단위 마스크 리빌용 래퍼 */
export function Lines({ lines, className = "", anim = true }: { lines: ReactNode[]; className?: string; anim?: boolean }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className={`mask-line ${className}`} data-a={anim ? "line" : undefined}>
          <span>{l}</span>
        </span>
      ))}
    </>
  );
}
