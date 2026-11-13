import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

// 공유 미리보기 이미지 — 사이트와 같은 도면 언어(판 · 축 · 참조번호)로 빌드 때 생성한다.
export const alt = "미래연 그룹 — 무기가 되는 특허, 돈이 되는 기술";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const fontDir = join(process.cwd(), "node_modules/pretendard/dist/public/static");
const bold = await readFile(join(fontDir, "Pretendard-Bold.otf"));
const light = await readFile(join(fontDir, "Pretendard-Light.otf"));

const ink = "#0c1322";
const paper = "#f3efe7";
const bronze = "#c6ac8b";

function Plate({ y, accent }: { y: number; accent?: boolean }) {
  // 등각 판 하나 (윗면 + 옆면 두께)
  const w = 150;
  const h = 86;
  return (
    <svg width="320" height="120" viewBox="-160 -60 320 120" style={{ position: "absolute", left: 790, top: y }}>
      <path d={`M0,${-h / 2} L${w},0 L0,${h / 2} L${-w},0 Z`} fill="#16213a" stroke={accent ? bronze : paper} strokeWidth="1.5" />
      <path d={`M${-w},0 L${-w},12 L0,${h / 2 + 12} L${w},12 L${w},0`} fill="none" stroke={paper} strokeOpacity="0.6" strokeWidth="1.5" />
    </svg>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: ink, color: paper, fontFamily: "Pretendard" }}>
        <div style={{ position: "absolute", left: 950, top: 40, width: 1, height: 560, background: bronze, opacity: 0.5 }} />
        <Plate y={420} />
        <Plate y={310} />
        <Plate y={200} />
        <Plate y={90} accent />
        <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", width: 760 }}>
          <div style={{ fontSize: 22, color: bronze, letterSpacing: 2 }}>【0001】 SOL2 MIREYUN · 미래연 그룹</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 56, fontSize: 84, lineHeight: 1.08, letterSpacing: -4 }}>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: 300 }}>무기가 되는&nbsp;</span>
              <span style={{ fontWeight: 700 }}>특허,</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: 300 }}>돈이 되는&nbsp;</span>
              <span style={{ fontWeight: 700 }}>기술.</span>
            </div>
          </div>
          <div style={{ marginTop: 44, fontSize: 26, lineHeight: 1.5, color: "rgba(243,239,231,0.78)" }}>
            특허 권리화 · 기술이전 · 사업화 컨설팅 · IP 기반 자금 전략
          </div>
          <div style={{ marginTop: "auto", fontSize: 20, color: "rgba(243,239,231,0.6)", letterSpacing: 1 }}>FIG. 1 — FROM INVENTION TO VALUE</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
        { name: "Pretendard", data: light, weight: 300, style: "normal" },
      ],
    },
  );
}
