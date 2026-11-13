// 문의 폼 → 메일 발송 (Resend). 기존 사이트의 /api/contact 와 같은 JSON 계약을 쓴다.
// 필요한 환경 변수 (README 참고):
//   RESEND_API_KEY      — Resend API 키 (없으면 503을 돌려주고, 화면은 전화·이메일로 안내)
//   CONTACT_TO_EMAIL    — 받는 주소 (기본: 기존 사이트의 문의 메일)
//   CONTACT_FROM_EMAIL  — 보내는 주소 (Resend에서 인증한 도메인의 주소)

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  company?: unknown;
  topics?: unknown;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// 아주 단순한 연속 전송 제한 (서버 인스턴스 메모리 기준)
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // 사람에게 보이지 않는 칸이 채워졌다면 봇으로 보고 조용히 성공 처리
  if (str(body.company, 200)) return Response.json({ ok: true });

  const name = str(body.name, 80);
  const email = str(body.email, 160);
  const phone = str(body.phone, 40);
  const message = str(body.message, 5000);
  const topics = Array.isArray(body.topics) ? body.topics.filter((t): t is string => typeof t === "string").map((t) => t.slice(0, 40)).slice(0, 8) : [];

  if (!name || !email || !message || !emailRe.test(email)) {
    return Response.json({ ok: false, error: "invalid_fields" }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ ok: false, error: "too_many_requests" }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json({ ok: false, error: "mail_not_configured" }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL || "mayjo0510@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "미래연 홈페이지 <onboarding@resend.dev>";

  const text = [
    `이름: ${name}`,
    `이메일: ${email}`,
    `연락처: ${phone || "-"}`,
    `관심 분야: ${topics.length ? topics.join(", ") : "-"}`,
    "",
    message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `[홈페이지 문의] ${name}`, text }),
    });
    if (!res.ok) return Response.json({ ok: false, error: "mail_failed" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "mail_failed" }, { status: 502 });
  }
}
