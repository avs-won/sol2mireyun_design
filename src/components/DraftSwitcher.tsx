import { asset } from "@/lib/env";
import { drafts, switcherOrder, type DraftId } from "@/lib/drafts";
import "./draft-switcher.css";

/**
 * 모든 시안 하단에 떠 있는 시안 전환 버튼 (클라이언트 검토용 — 정식 오픈 때 제거).
 * 시안마다 글꼴 · 색 체계가 달라서 Tailwind 대신 전용 CSS(dsw- 접두어)로 모양을 고정한다.
 * (이 프로젝트의 Turbopack CSS 규칙은 CSS 모듈 클래스 이름을 살리지 못해 일반 CSS를 쓴다)
 * 시안끼리는 루트 레이아웃이 달라 이동 시 페이지가 새로 열린다 (모션 정리도 자연히 된다).
 */
export default function DraftSwitcher({ current }: { current: DraftId }) {
  return (
    <nav aria-label="디자인 시안 전환" className="dsw-root">
      <a href={asset("/")} className="dsw-home" aria-label="시안 목록으로">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="currentColor" />
        </svg>
        <span className="dsw-homeLabel">시안</span>
      </a>
      <span className="dsw-divider" aria-hidden="true" />
      {switcherOrder.map((id) => {
        const d = drafts.find((x) => x.id === id)!;
        const active = id === current;
        return active ? (
          <span key={id} aria-current="page" className="dsw-item dsw-active" title={`${d.name} — ${d.concept}`}>
            {id}
          </span>
        ) : (
          <a key={id} href={asset(`/${id}`)} className="dsw-item" title={`${d.name} — ${d.concept}`}>
            {id}
            {d.isNew && <span className="dsw-dot" aria-label="새 시안" />}
          </a>
        );
      })}
    </nav>
  );
}
