// 시안 공유 사이트의 /v2/ 만 새로 빌드해 교체한다 → GitHub Actions(.github/workflows/deploy-draft.yml)가 실행
// 사용: node scripts/deploy-draft.mjs --user 깃허브계정 --repo 저장소이름 --out gh-pages작업폴더/v2
//
// - 공유 사이트의 목록(/) · v1(/v1/)은 gh-pages 브랜치에 있는 그대로 두고, v2 폴더만 바꾼다.
// - 공개 링크이므로 연락처를 가린 빌드(scripts/build-pages.mjs)를 쓰고,
//   결과물에 실제 연락처가 하나라도 남아 있으면 실패해서 배포를 멈춘다.

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const user = arg("user");
const repo = arg("repo");
const out = arg("out") && resolve(arg("out"));
if (!user || !repo || !out) {
  console.error("사용: node scripts/deploy-draft.mjs --user 깃허브계정 --repo 저장소이름 --out 폴더");
  process.exit(1);
}
const base = `/${repo}/v2`;
const site = `https://${user}.github.io${base}`;

/** 결과물 어디에도 나오면 안 되는 실제 연락처 */
const SENSITIVE = [/558-?9027/, /558-?9095/, /025589027/, /mayjo/i, /956-6/, /한림빌딩/, /대치동/];

/* 1. 연락처를 가린 정적 빌드 → out/ */
const r = spawnSync(process.execPath, [join(root, "scripts/build-pages.mjs"), "--base", base, "--site", site], { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);

/* 2. v2 폴더 교체 */
rmSync(out, { recursive: true, force: true });
cpSync(join(root, "out"), out, { recursive: true });

/* 3. 공유 미리보기 이미지는 확장자가 있어야 GitHub Pages가 image/png 로 보낸다 */
const og = join(out, "opengraph-image");
if (existsSync(og) && statSync(og).isFile()) {
  renameSync(og, `${og}.png`);
  const walk = (d) =>
    readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const p = join(d, e.name);
      if (e.isDirectory()) return walk(p);
      if (!/\.(html|txt)$/.test(e.name)) return;
      const s = readFileSync(p, "utf8");
      if (s.includes("/v2/opengraph-image?")) writeFileSync(p, s.replaceAll("/v2/opengraph-image?", "/v2/opengraph-image.png?"));
    });
  walk(out);
}

/* 4. 공개 전 점검 */
const leaks = [];
const scan = (d) =>
  readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = join(d, e.name);
    if (e.isDirectory()) return scan(p);
    if (!/\.(html|js|css|txt|json|xml|map)$/.test(e.name)) return;
    const text = readFileSync(p, "utf8");
    for (const re of SENSITIVE) if (re.test(text)) leaks.push(`${p.replace(out, "v2")} ← ${re}`);
  });
scan(out);
if (leaks.length) {
  console.error("\n✗ 가려지지 않은 연락처가 있어 배포를 멈춥니다:\n  " + leaks.join("\n  "));
  process.exit(1);
}

console.log(`\n✓ v2 준비 완료 → ${out}\n  연락처 마스킹 점검 통과\n  배포 주소: ${site}/\n`);
