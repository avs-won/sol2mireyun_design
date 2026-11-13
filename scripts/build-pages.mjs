// 시안 공유용 정적 빌드 (GitHub Pages 등) → out/
// 사용: node scripts/build-pages.mjs --base /저장소이름/v2 --site https://계정.github.io/저장소이름/v2
//
// - 정적 파일로 내보내므로 문의 API(/api/contact)는 결과물에서 빠진다.
//   대신 문의 폼은 "시안에서는 발송되지 않음"을 안내한다 (NEXT_PUBLIC_DRAFT=1).
// - 검색 노출 차단(noindex)과 시안 전환 버튼이 켜진다.
// - 공개 링크이므로 연락처(전화 · 팩스 · 이메일 · 상세 주소)는 가린다.
// - 평소 개발(npm run dev)과 정식 배포 빌드(npm run build)에는 영향이 없다.

import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};

const base = (arg("base") || "").replace(/\/$/, "");
const site = arg("site") || "";
if (!base.startsWith("/")) {
  console.error("--base 는 /로 시작해야 합니다. 예: --base /sol2mireyun_design/v2");
  process.exit(1);
}

const r = spawnSync(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "build"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    DEPLOY_TARGET: "pages",
    NEXT_PUBLIC_BASE_PATH: base,
    NEXT_PUBLIC_SITE_URL: site,
    NEXT_PUBLIC_DRAFT: "1",
    NEXT_PUBLIC_MASK_CONTACT: "1",
  },
});
process.exit(r.status ?? 1);
