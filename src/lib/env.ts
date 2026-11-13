// 배포 환경 값. 정식 배포(루트 도메인)에서는 모두 비어 있고,
// 시안 공유용 GitHub Pages 빌드(scripts/build-pages.mjs)에서만 채워진다.

/** 하위 경로 배포 시 앞에 붙는 경로 (예: /sol2mireyun_design/v2) */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 시안 공유 빌드 여부 — 검색 노출 차단, 시안 전환 버튼, 문의 발송 안내 */
export const IS_DRAFT = process.env.NEXT_PUBLIC_DRAFT === "1";

/** 색 시안 전환(?palette=a|b|c)을 켤지 — 시안 공유 빌드와 개발 서버에서만 */
export const SHOW_PALETTES = IS_DRAFT || process.env.NODE_ENV === "development";

/** public/ 안의 파일 경로에 BASE_PATH를 붙인다 (next/image는 자동으로 붙여 주지 않는다) */
export const asset = (path: string) => `${BASE_PATH}${path}`;
