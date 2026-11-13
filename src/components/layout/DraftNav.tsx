import { IS_DRAFT } from "@/lib/env";

/**
 * 시안 공유 빌드에서만 보이는 작은 전환 버튼 (시안 목록 · v1 · v2).
 * 정식 배포 빌드에서는 렌더링되지 않는다.
 */
export default function DraftNav() {
  if (!IS_DRAFT) return null;
  return (
    <nav
      aria-label="시안 전환"
      className="fixed bottom-4 left-4 z-[80] flex items-center gap-1 rounded-full border border-paper/20 bg-ink/85 p-1 text-[12px] text-paper shadow-[0_8px_24px_rgba(0,0,0,.25)] backdrop-blur-md sm:bottom-5 sm:left-5"
    >
      <a href="../" className="rounded-full px-3 py-1.5 text-paper/75 transition-colors hover:bg-paper/10 hover:text-paper">
        ← 시안 목록
      </a>
      <a href="../v1/" className="rounded-full px-3 py-1.5 font-mono text-paper/75 transition-colors hover:bg-paper/10 hover:text-paper">
        v1
      </a>
      <span aria-current="page" className="rounded-full bg-bronze-light px-3 py-1.5 font-mono font-medium text-ink">
        v2
      </span>
    </nav>
  );
}
