"use client";

import { useEffect, useRef } from "react";

/**
 * 첫 화면의 빛 입자 장면 — 같은 입자들이 발명(전구) → 권리(방패) → 거래(네트워크) → 자금(성장 막대)으로
 * 모양을 바꾸며 '미래연이 하는 일'의 흐름을 그림 한 장으로 보여 준다.
 * Canvas 2D만 사용 (WebGL 없음). 화면 밖 · 탭 숨김일 때는 멈추고, 모션 감소 설정에서는 완성된 그림을 정지 화면으로 그린다.
 */

export const STAGE_COUNT = 4;
const HOLD_MS = 3600;
const SRC = 400; // 모양을 그리는 기준 캔버스 크기

type Draw = (c: CanvasRenderingContext2D) => void;

const line = (c: CanvasRenderingContext2D, pts: number[][]) => {
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.stroke();
};

const SHAPES: Draw[] = [
  // 0 · INVENT — 전구
  (c) => {
    c.beginPath();
    c.arc(200, 160, 100, (Math.PI * 3) / 4, Math.PI * 2 + Math.PI / 4);
    c.stroke();
    line(c, [[129, 231], [158, 292]]);
    line(c, [[271, 231], [242, 292]]);
    line(c, [[155, 300], [245, 300]]);
    line(c, [[163, 320], [237, 320]]);
    line(c, [[178, 340], [222, 340]]);
    line(c, [[168, 205], [184, 172], [200, 205], [216, 172], [232, 205]]);
    for (const a of [-90, -40, -140, 5, 175]) {
      const r = (a * Math.PI) / 180;
      line(c, [[200 + Math.cos(r) * 128, 160 + Math.sin(r) * 128], [200 + Math.cos(r) * 152, 160 + Math.sin(r) * 152]]);
    }
  },
  // 1 · PROTECT — 방패 + 체크
  (c) => {
    c.stroke(new Path2D("M200 52 L322 98 V196 C322 278 266 328 200 356 C134 328 78 278 78 196 V98 Z"));
    c.stroke(new Path2D("M200 88 L290 122 V198 C290 260 250 298 200 320 C150 298 110 260 110 198 V122 Z"));
    line(c, [[146, 204], [186, 244], [258, 162]]);
  },
  // 2 · CONNECT — 중심(미래연)과 다섯 협력 주체
  (c) => {
    const nodes = Array.from({ length: 5 }, (_, k) => {
      const a = ((-90 + k * 72) * Math.PI) / 180;
      return [200 + Math.cos(a) * 138, 200 + Math.sin(a) * 138];
    });
    nodes.forEach((n, k) => {
      line(c, [[200, 200], n]);
      line(c, [n, nodes[(k + 1) % 5]]);
    });
    c.save();
    c.fillStyle = "#fff";
    c.beginPath();
    c.arc(200, 200, 30, 0, Math.PI * 2);
    c.fill();
    nodes.forEach(([x, y]) => {
      c.beginPath();
      c.arc(x, y, 17, 0, Math.PI * 2);
      c.fill();
    });
    c.restore();
  },
  // 3 · GROW — 성장 막대 + 상승 화살표
  (c) => {
    [[70, 270], [148, 220], [226, 160], [304, 96]].forEach(([x, top]) => {
      c.strokeRect(x, top, 44, 336 - top);
    });
    line(c, [[60, 232], [150, 172], [214, 186], [330, 74]]);
    line(c, [[292, 74], [330, 74], [330, 112]]);
  },
];

/** 모양을 그려 픽셀에서 점을 뽑는다 → [-0.5, 0.5] 정규화 좌표 n개 */
function sampleShape(draw: Draw, n: number): Float32Array {
  const cv = document.createElement("canvas");
  cv.width = cv.height = SRC;
  const c = cv.getContext("2d", { willReadFrequently: true })!;
  c.strokeStyle = "#fff";
  c.lineWidth = 9;
  c.lineCap = "round";
  c.lineJoin = "round";
  draw(c);
  const data = c.getImageData(0, 0, SRC, SRC).data;
  const pool: number[] = [];
  for (let y = 0; y < SRC; y += 2) {
    for (let x = 0; x < SRC; x += 2) {
      if (data[(y * SRC + x) * 4 + 3] > 120) pool.push(x, y);
    }
  }
  const out = new Float32Array(n * 2);
  const count = pool.length / 2;
  for (let i = 0; i < n; i++) {
    const j = Math.floor(Math.random() * count);
    out[i * 2] = pool[j * 2] / SRC - 0.5 + (Math.random() - 0.5) * 0.004;
    out[i * 2 + 1] = pool[j * 2 + 1] / SRC - 0.5 + (Math.random() - 0.5) * 0.004;
  }
  return out;
}

export default function ParticleStage({
  onStage,
  className,
  label,
}: {
  onStage?: (i: number) => void;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const onStageRef = useRef(onStage);
  useEffect(() => {
    onStageRef.current = onStage;
  }, [onStage]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let size = 0; // 모양이 차지하는 한 변 길이(px)
    let cx = 0;
    let cy = 0;

    const area = () => canvas.clientWidth * canvas.clientHeight;
    const N = area() > 380_000 ? 1700 : area() > 160_000 ? 1200 : 800;
    const shapes = SHAPES.map((d) => sampleShape(d, N));

    const x = new Float32Array(N);
    const y = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const seed = new Float32Array(N);
    const gold = new Uint8Array(N);
    const sz = new Float32Array(N);

    let stage = 0;
    let stageAt = performance.now();
    let pulseAt = performance.now() + 900;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      size = Math.min(w, h) * 0.86;
      cx = w / 2;
      cy = h / 2;
    };
    resize();

    for (let i = 0; i < N; i++) {
      // 처음에는 화면 전체에 흩어져 있다가 모양으로 모인다
      x[i] = Math.random() * w;
      y[i] = Math.random() * h;
      seed[i] = Math.random() * 1000;
      gold[i] = Math.random() < 0.62 ? 1 : 0;
      sz[i] = 0.9 + Math.random() * 1.3;
    }

    const target = (i: number, t: number) => {
      const s = shapes[stage];
      const breathe = Math.sin(t * 0.0012 + seed[i]) * 0.9;
      return [cx + s[i * 2] * size + breathe, cy + s[i * 2 + 1] * size + Math.cos(t * 0.001 + seed[i]) * 0.9];
    };

    const paint = (t: number, settle = false) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 잔상(모션 블러): 이전 프레임을 조금씩 지운다
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = settle ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.24)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // 모양이 완성되는 순간의 인장(印章) 파동
      const pt = (t - pulseAt) / 1400;
      if (!settle && pt > 0 && pt < 1) {
        const e = 1 - Math.pow(1 - pt, 3);
        ctx.strokeStyle = `rgba(212,175,106,${0.38 * (1 - pt)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, size * (0.34 + e * 0.32), 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(236,229,214,${0.16 * (1 - pt)})`;
        ctx.beginPath();
        ctx.arc(cx, cy, size * (0.3 + e * 0.46), 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const g of [1, 0]) {
        ctx.fillStyle = g ? "rgba(222,186,118,0.9)" : "rgba(236,229,214,0.75)";
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          if (gold[i] !== g) continue;
          const flick = 0.75 + 0.25 * Math.sin(t * 0.004 + seed[i]);
          const s = sz[i] * flick;
          ctx.rect(x[i] - s / 2, y[i] - s / 2, s, s);
        }
        ctx.fill();
      }
    };

    if (reduce) {
      // 정지 화면: 첫 장면(전구)을 완성된 상태로
      for (let i = 0; i < N; i++) {
        const [tx, ty] = target(i, 0);
        x[i] = tx;
        y[i] = ty;
      }
      paint(0, true);
      onStageRef.current?.(0);
      const ro = new ResizeObserver(() => {
        resize();
        for (let i = 0; i < N; i++) {
          const [tx, ty] = target(i, 0);
          x[i] = tx;
          y[i] = ty;
        }
        paint(0, true);
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    let raf = 0;
    let running = false;
    let visible = true;

    const nextStage = (t: number) => {
      stage = (stage + 1) % STAGE_COUNT;
      stageAt = t;
      pulseAt = t + 1000;
      // 흩어지는 힘 — 모양이 깨졌다가 다시 맞춰지는 느낌
      for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2;
        const f = 2 + Math.random() * 7;
        vx[i] += Math.cos(a) * f;
        vy[i] += Math.sin(a) * f;
      }
      onStageRef.current?.(stage);
    };

    const frame = (t: number) => {
      if (t - stageAt > HOLD_MS) nextStage(t);
      const R = Math.max(70, size * 0.2);
      for (let i = 0; i < N; i++) {
        const [tx, ty] = target(i, t);
        vx[i] = (vx[i] + (tx - x[i]) * 0.022) * 0.86;
        vy[i] = (vy[i] + (ty - y[i]) * 0.022) * 0.86;
        const dx = x[i] - mouse.x;
        const dy = y[i] - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 3.2;
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
        }
        x[i] += vx[i];
        y[i] += vy[i];
      }
      paint(t);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      // 멈춰 있던 시간만큼 장면 타이머를 밀어 준다
      const now = performance.now();
      stageAt = Math.max(stageAt, now - HOLD_MS * 0.5);
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const host = canvas.parentElement ?? canvas;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    onStageRef.current?.(0);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} role="img" aria-label={label} />;
}
