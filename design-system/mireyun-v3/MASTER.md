# 미래연 v3 — Design System MASTER

> 출처: `ui-ux-pro-max` 스킬 (`search.py --design-system`, `--domain style|typography|landing|color`)
> 질의: "patent attorney legal premium editorial" · "legal services consulting firm B2B" (variance 7 · motion 5 · density 4)
> DB 결과 중 한국어 사이트에 맞지 않는 항목은 **[보정]**으로 표시하고 이유를 적었다.
> 페이지별 예외는 `pages/<page>.md` 에 두고, 없으면 이 파일만 따른다.

## 1. 방향

| 항목 | DB 추천 | v3 적용 |
|---|---|---|
| 랜딩 패턴 | **Trust & Authority + Conversion** — Hero(사명·신뢰) → Proof(인증·수치) → Solution → CTA | 그대로. 첫 화면 바로 아래에 실적 수치 · 지정 이력을 둔다 |
| 스타일 | Accessible & Ethical (1순위) · Swiss Modernism 2.0 · Editorial Grid | **Editorial Swiss** — 12단 그리드, 헤어라인 구분선, 큰 세리프 제목, 장식 없음 |
| 피할 것 | Outdated design · Hidden credentials · AI purple/pink gradients | + 스톡 사진, 아이콘 카드 격자, 이모지, 그라데이션, 유리 효과 (기존 사이트의 "AI 티"의 원인) |

## 2. 색 (DB: Legal Services — "Authority navy + trust gold")

| 토큰 | 값 | 용도 | 대비 |
|---|---|---|---|
| `--color-bg` | `#F8FAFC` | 기본 바탕 | — |
| `--color-surface` | `#FFFFFF` | 표 · 폼 면 | — |
| `--color-fg` | `#0F172A` | 본문 · 제목, 어두운 섹션 바탕 | 17.9:1 |
| `--color-primary` | `#1E3A8A` | 강조어 · 링크 · 숫자 | 9.9:1 |
| `--color-accent` | `#B45309` | **CTA 전용** (흰 글자 5.0:1) | 4.8:1 |
| `--color-accent-on-dark` | `#E3B062` | 어두운 섹션의 CTA · 강조 **[보정]** DB에 없음, 같은 계열에서 파생 | 9.0:1 |
| `--color-muted` | `#E9EEF5` | 보조 면 | — |
| `--color-muted-fg` | `#475569` | 보조 텍스트 | 7.2:1 |
| `--color-border` | `#CBD5E1` | 헤어라인 | — |
| `--color-destructive` | `#DC2626` | 폼 오류 | — |

규칙: 원색 hex를 컴포넌트에 직접 쓰지 않는다. 금색(accent)은 CTA와 아주 작은 강조에만.

## 3. 글꼴

DB 추천: **EB Garamond (제목) / Lato (본문)** — "legal, professional, authoritative".

**[보정]** 두 글꼴 모두 한글이 없다. 같은 성격(세리프 제목 + 담백한 산세리프 본문)을 한글로 옮긴다.

| 역할 | 글꼴 | 이유 |
|---|---|---|
| 한글 제목 | Noto Serif KR 600–700 | 법률 · 공문서의 권위감. EB Garamond의 한글 대응 |
| 영문 · 숫자 디스플레이 | EB Garamond 500 | DB 추천 그대로 (실적 수치, 섹션 번호) |
| 본문 · UI | Pretendard Variable | Lato의 역할. 한글 가독성 최상 |

크기: 본문 17px(모바일 16px) · 행간 1.75 · 한 줄 최대 38em(약 60–70자) · 라벨 최소 12px.
`word-break: keep-all` 로 한글 어절 단위 줄바꿈.

## 4. 레이아웃 · 간격 (density 4 — Standard)

- 12단 그리드, 최대 폭 1320px, 거터 `clamp(20px, 5vw, 64px)`
- 섹션 간격 `clamp(88px, 11vw, 160px)`
- 간격 단위 4/8px. 구분은 그림자 대신 1px 헤어라인
- 브레이크포인트 375 / 768 / 1024 / 1440

## 5. 모션 (motion 5 — Subtle~Standard)

DB 추천: Stagger List, 300–450ms, 항목당 30–60ms 간격.
**[보정]** `back.out` 튕김 대신 감속 곡선 `cubic-bezier(0.16,1,0.3,1)` — 법률 사이트에 튀는 동작은 맞지 않음.
- 스크롤 진입 시 8–16px 상승 + 페이드, 한 화면에 1–2 요소만
- 스크롤 하이재킹 · 고정 장면 없음 (읽기 방해 = 기존 피드백 "읽히지 않음")
- `prefers-reduced-motion` 이면 모든 요소를 최종 상태로 즉시 표시
- 숫자 카운트 애니메이션 없음 (데이터는 즉시 읽혀야 함)

## 6. 컴포넌트 규칙

- CTA는 화면당 1개만 주(主)로. 헤더 "상담 문의"는 항상 노출
- 서비스 항목마다 "이 분야 상담" 링크 → 문의 폼의 분야가 미리 선택됨
- 등급 표시는 이모지 ★ 대신 막대 5칸 + `aria-label`
- 긴 목록(실적 72건 · 경력 17건)은 내부 스크롤 대신 "전체 보기"로 펼침
- 폼: 보이는 라벨, 필드 아래 오류 + `aria-describedby`, 제출 중 비활성, 결과는 `aria-live`
- 포커스 링 2px, 터치 대상 44px 이상

## 7. 출시 전 체크리스트 (DB Pre-Delivery)

- [ ] 이모지 아이콘 없음
- [ ] 클릭 요소 cursor-pointer
- [ ] hover 전환 150–300ms
- [ ] 텍스트 대비 4.5:1 이상
- [ ] 키보드 포커스 보임
- [ ] prefers-reduced-motion 대응
- [ ] 375 · 768 · 1024 · 1440 반응형
