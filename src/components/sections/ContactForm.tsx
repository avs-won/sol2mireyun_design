"use client";

import { useRef, useState, type FormEvent } from "react";
import { contact } from "@/content/site";
import { Arrow } from "@/components/ui/Spec";
import { asset, IS_DRAFT } from "@/lib/env";

const TOPICS = ["지식재산 권리화", "기술이전 · 거래", "기술사업화 컨설팅", "IP 자금 · 투자", "특허맵 · 전략 보고서", "기타"];

type Status = "idle" | "sending" | "ok" | "error" | "unavailable" | "draft";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 기존 사이트와 같은 계약으로 /api/contact 에 JSON을 보낸다.
 * 서버에 메일 발송 키가 설정되지 않았거나 실패하면, 전화 · 이메일로 안내한다.
 */
export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [topics, setTopics] = useState<string[]>([]);

  const toggle = (t: string) => setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const data = {
      name: (f.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (f.elements.namedItem("email") as HTMLInputElement).value.trim(),
      phone: (f.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      message: (f.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      company: (f.elements.namedItem("company") as HTMLInputElement).value.trim(), // 스팸 방지용 빈 칸
      topics,
    };

    const next: Errors = {};
    if (!data.name) next.name = "성함을 입력해 주세요.";
    if (!data.email) next.email = "회신받을 이메일을 입력해 주세요.";
    else if (!emailRe.test(data.email)) next.email = "이메일 주소 형식을 확인해 주세요.";
    if (!data.message) next.message = "문의 내용을 입력해 주세요.";
    setErrors(next);
    if (Object.keys(next).length) {
      const firstKey = (["name", "email", "message"] as const).find((k) => next[k]);
      (f.elements.namedItem(firstKey!) as HTMLElement | null)?.focus();
      return;
    }

    // 시안 공유 사이트(정적 호스팅)에는 메일 발송 서버가 없다 — 보낸 척하지 않고 그대로 알린다
    if (IS_DRAFT) {
      setStatus("draft");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(asset("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 503 || res.status === 404 || res.status === 405) {
        setStatus("unavailable");
        return;
      }
      if (!res.ok) throw new Error(`http_${res.status}`);
      f.reset();
      setTopics([]);
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  const field = "peer w-full border-0 border-b border-paper/25 bg-transparent px-0 pb-3 pt-6 text-[16px] text-paper outline-none transition-colors placeholder:text-transparent focus:border-bronze-light";
  const label =
    "pointer-events-none absolute left-0 top-6 origin-left text-[15px] text-paper/55 transition-all duration-300 peer-focus:-translate-y-5 peer-focus:scale-[0.82] peer-focus:text-bronze-light peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-[0.82]";

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="contact-form relative" aria-describedby="form-privacy">
      <fieldset className="mb-8 short:mb-4">
        <legend className="mono-label mb-3 text-paper/55">관심 분야 (선택)</legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const on = topics.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(t)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${on ? "border-bronze-light bg-bronze-light text-ink" : "border-paper/25 text-paper/80 hover:border-paper/60"}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        <div className="relative">
          <input id="cf-name" name="name" type="text" autoComplete="name" placeholder="성함" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "cf-name-err" : undefined} className={field} />
          <label htmlFor="cf-name" className={label}>
            성함 <span className="text-bronze-light">*</span>
          </label>
          {errors.name && (
            <p id="cf-name-err" className="mt-2 text-[13px] text-[#f0b8a0]">
              {errors.name}
            </p>
          )}
        </div>
        <div className="relative">
          <input id="cf-email" name="email" type="email" autoComplete="email" placeholder="이메일" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "cf-email-err" : undefined} className={field} />
          <label htmlFor="cf-email" className={label}>
            이메일 <span className="text-bronze-light">*</span>
          </label>
          {errors.email && (
            <p id="cf-email-err" className="mt-2 text-[13px] text-[#f0b8a0]">
              {errors.email}
            </p>
          )}
        </div>
        <div className="relative sm:col-span-2">
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder="연락처" className={field} />
          <label htmlFor="cf-phone" className={label}>
            연락처 <span className="text-paper/40">(선택)</span>
          </label>
        </div>
        <div className="relative sm:col-span-2">
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            placeholder="문의 내용"
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "cf-message-err" : "cf-message-hint"}
            className={`${field} resize-y short:h-[12vh]`}
          />
          <label htmlFor="cf-message" className={label}>
            문의 내용 <span className="text-bronze-light">*</span>
          </label>
          {errors.message ? (
            <p id="cf-message-err" className="mt-2 text-[13px] text-[#f0b8a0]">
              {errors.message}
            </p>
          ) : (
            <p id="cf-message-hint" className="mt-2 text-[13px] text-paper/55">
              보유 기술, IP 현황, 필요한 지원 등을 자유롭게 적어 주세요.
            </p>
          )}
        </div>
        {/* 스팸 방지 — 사람에게는 보이지 않는 칸 */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="cf-company">회사명 (입력하지 마세요)</label>
          <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 short:mt-5 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-privacy" className="max-w-[26em] text-[13px] leading-relaxed text-paper/50">
          보내주신 내용은 상담 회신 목적으로만 사용되며, 목적 달성 후 지체 없이 파기합니다.
        </p>
        <button type="submit" disabled={status === "sending"} className="btn btn-solid-bronze shrink-0 self-start disabled:cursor-wait disabled:opacity-60 sm:self-auto">
          <span className="btn-label">{status === "sending" ? "보내는 중…" : "문의 보내기"}</span>
          <Arrow />
        </button>
      </div>

      <div role="status" aria-live="polite" className="min-h-[1.5rem]">
        {status === "ok" && <p className="mt-6 border-l-2 border-bronze-light pl-4 text-[15px] text-paper">문의가 접수되었습니다. 빠르게 회신드리겠습니다.</p>}
        {status === "error" && (
          <p className="mt-6 border-l-2 border-[#f0b8a0] pl-4 text-[15px] text-paper/90">
            전송에 실패했습니다.{" "}
            <a className="underline underline-offset-4" href={contact.phoneHref}>
              {contact.phone}
            </a>
            로 연락 주시거나 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {status === "draft" && (
          <p className="mt-6 border-l-2 border-bronze-light pl-4 text-[15px] text-paper/90">
            시안 확인용 사이트라 문의가 실제로 발송되지 않습니다. 입력 확인 · 안내 문구까지 정식 사이트와 같게 동작하며, 정식 오픈 때 메일 발송이 연결됩니다.
          </p>
        )}
        {status === "unavailable" && (
          <p className="mt-6 border-l-2 border-[#f0b8a0] pl-4 text-[15px] text-paper/90">
            지금은 온라인 접수를 받을 수 없습니다.{" "}
            <a className="underline underline-offset-4" href={contact.emailHref}>
              {contact.email}
            </a>{" "}
            또는{" "}
            <a className="underline underline-offset-4" href={contact.phoneHref}>
              {contact.phone}
            </a>
            로 문의해 주세요.
          </p>
        )}
      </div>
    </form>
  );
}
