"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { contact } from "@/content/site";
import { asset, IS_DRAFT } from "@/lib/env";
import { TOPIC_EVENT } from "@/drafts/v3/components/TopicLink";

const TOPICS = ["지식재산 권리화", "기술이전 · 거래", "기술사업화 컨설팅", "IP 자금 · 투자", "특허맵 · 전략 보고서", "기타"];

type Status = "idle" | "sending" | "ok" | "error" | "unavailable" | "draft";
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} className="mt-2 text-[14px] text-destructive-dark">
      {msg}
    </p>
  ) : null;
}

/**
 * v2와 같은 계약으로 /api/contact 에 JSON을 보낸다.
 * 메일 발송 키가 없거나 실패하면 전화 · 이메일로 안내한다 (보낸 척하지 않는다).
 */
export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [topics, setTopics] = useState<string[]>([]);

  // 서비스 · 로드맵의 "이 분야 상담" 링크 → 분야 미리 선택
  useEffect(() => {
    const onTopic = (e: Event) => {
      const t = (e as CustomEvent<string>).detail;
      if (TOPICS.includes(t)) setTopics((prev) => (prev.includes(t) ? prev : [...prev, t]));
    };
    window.addEventListener(TOPIC_EVENT, onTopic);
    return () => window.removeEventListener(TOPIC_EVENT, onTopic);
  }, []);

  const toggle = (t: string) => setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const validate = (name: Field, value: string): string | undefined => {
    if (name === "name" && !value) return "성함을 입력해 주세요.";
    if (name === "email") {
      if (!value) return "회신받을 이메일을 입력해 주세요.";
      if (!emailRe.test(value)) return "이메일 주소 형식을 확인해 주세요. 예: name@company.com";
    }
    if (name === "message" && !value) return "문의 내용을 입력해 주세요.";
    return undefined;
  };

  // 입력을 마친 뒤(blur) 검사 — 이미 오류가 표시된 칸만 다시 확인
  const onBlur = (name: Field) => (e: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => {
    if (!errors[name]) return;
    setErrors((prev) => ({ ...prev, [name]: validate(name, e.currentTarget.value.trim()) }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const val = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value.trim();
    const data = { name: val("name"), email: val("email"), phone: val("phone"), message: val("message"), company: val("company"), topics };

    const next: Errors = {};
    (["name", "email", "message"] as const).forEach((k) => {
      const err = validate(k, data[k]);
      if (err) next[k] = err;
    });
    setErrors(next);
    const firstKey = (["name", "email", "message"] as const).find((k) => next[k]);
    if (firstKey) {
      (f.elements.namedItem(firstKey) as HTMLElement | null)?.focus();
      return;
    }

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

  const field =
    "mt-2 block w-full min-h-12 border border-white/25 bg-white/[0.04] px-4 py-3 text-[16px] text-white outline-none transition-colors duration-200 placeholder:text-white/40 hover:border-white/45 focus:border-gold aria-[invalid=true]:border-destructive-dark";
  const labelCls = "text-[15px] font-medium text-white/85";
  const req = (
    <span className="text-gold" aria-hidden="true">
      {" "}*
    </span>
  );
  return (
    <form ref={form} onSubmit={onSubmit} noValidate aria-describedby="form-privacy">
      <fieldset>
        <legend className="text-[15px] font-medium text-white/85">문의 분야 (선택, 여러 개 가능)</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const on = topics.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(t)}
                className={`min-h-11 border px-4 text-[15px] transition-colors duration-200 ${
                  on ? "border-gold bg-gold font-semibold text-fg" : "border-white/25 text-white/85 hover:border-white/60"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelCls}>
            성함{req}
          </label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "cf-name-err" : undefined} onBlur={onBlur("name")} className={field} />
          <Err id="cf-name-err" msg={errors.name} />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelCls}>
            이메일{req}
          </label>
          <input id="cf-email" name="email" type="email" inputMode="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "cf-email-err" : undefined} onBlur={onBlur("email")} className={field} />
          <Err id="cf-email-err" msg={errors.email} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-phone" className={labelCls}>
            연락처 <span className="text-white/55">(선택)</span>
          </label>
          <input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className={labelCls}>
            문의 내용{req}
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "cf-message-err" : "cf-message-hint"}
            onBlur={onBlur("message")}
            className={`${field} resize-y`}
          />
          {errors.message ? (
            <Err id="cf-message-err" msg={errors.message} />
          ) : (
            <p id="cf-message-hint" className="mt-2 text-[14px] text-white/60">
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

      <p className="mt-3 text-[14px] text-white/60">
        <span className="text-gold">*</span> 표시는 필수 항목입니다.
      </p>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-privacy" className="max-w-[28em] text-[14px] leading-relaxed text-white/60">
          보내주신 내용은 상담 회신 목적으로만 사용되며, 목적 달성 후 지체 없이 파기합니다.
        </p>
        <button type="submit" disabled={status === "sending"} className="btn btn-gold shrink-0 self-start disabled:cursor-wait disabled:opacity-60 sm:self-auto">
          {status === "sending" ? "보내는 중…" : "문의 보내기"}
          <span className="btn-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>

      <div role="status" aria-live="polite" className="min-h-[1.5rem]">
        {status === "ok" && <p className="mt-6 border-l-2 border-gold pl-4 text-white">문의가 접수되었습니다. 빠르게 회신드리겠습니다.</p>}
        {status === "error" && (
          <p className="mt-6 border-l-2 border-destructive-dark pl-4 text-white/90">
            전송에 실패했습니다.{" "}
            <a className="underline underline-offset-4" href={contact.phoneHref}>
              {contact.phone}
            </a>
            로 연락 주시거나 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {status === "draft" && (
          <p className="mt-6 border-l-2 border-gold pl-4 text-white/90">
            시안 확인용 사이트라 문의가 실제로 발송되지 않습니다. 정식 오픈 때 메일 발송이 연결됩니다.
          </p>
        )}
        {status === "unavailable" && (
          <p className="mt-6 border-l-2 border-destructive-dark pl-4 text-white/90">
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
