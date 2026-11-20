"use client";

import type { ReactNode } from "react";

export const TOPIC_EVENT = "mireyun:topic";

/** 상담 폼으로 이동하면서 문의 분야를 미리 선택한다 (MASTER §6). */
export default function TopicLink({ topic, className, children }: { topic: string; className?: string; children: ReactNode }) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(TOPIC_EVENT, { detail: topic }))}
    >
      {children}
      <span className="sr-only"> ({topic})</span>
      <span className="btn-arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}
