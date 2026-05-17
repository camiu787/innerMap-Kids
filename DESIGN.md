# Design System — kims-working

> 어린이 지문 적성검사 리드 수집 랜딩페이지. Mastercard 영감의 따뜻한 에디토리얼 시스템을 한국어 학부모 사용자에 맞춰 튜닝한 결과물.

이 문서는 **단일 소스(single source of truth)** 다. 모든 시각/UI 결정은 여기서 출발한다. 영감의 배경 자료는 `DESIGN-mastercard.md` 에 그대로 남겨두되, 실제 구현 토큰과 사용법은 이 문서를 따른다.

---

## 1. Product Context

- **제품:** 학부모가 자녀의 지문 적성검사를 무료 상담으로 신청하는 정적 랜딩페이지
- **사용자:** 자녀 1~다명을 둔 한국어 학부모 (모바일 비중 높음, 카카오·QR 유입 가정)
- **공간/카테고리:** 교육 리드 수집 — 의료적 진단이 아닌 “이해/강점/가능성”의 언어
- **제품 타입:** 1페이지 마케팅 사이트 (CTA 도착 후 폼 제출이 골든 패스)
- **프레임워크:** 의존성 없는 정적 HTML/CSS/JS
- **메모러블 한 줄:** “성적이 아니라 우리 아이의 타고난 강점을 본다.” 모든 디자인 결정은 이 한 문장의 따뜻함·신중함을 깬다면 거절한다.

---

## 2. Aesthetic Direction

- **방향:** Mastercard 영감의 따뜻한 에디토리얼 (warm editorial / institutional + soft)
- **데코레이션 수준:** intentional — 워터마크 헤드라인, 얇은 오렌지 궤도(orbit) 라인, 원형 지문 오브가 시그니처
- **무드:** “60년 된 신뢰감 + 동네 부모의 따뜻함”. 임상/의료적 차가움을 거부, 잡지스러운 여백
- **레퍼런스:** `.superpowers/brainstorm/65271-1778680010/content/mastercard-v10.html` (최종 승인 목업), `DESIGN-mastercard.md` (시스템 명세)
- **유지 원칙:** 둥근 모서리만 사용 (20/32/40/9999), 순백색은 표면이 아니라 도구 (버튼/모달 내부), 오렌지는 신호색

---

## 3. Color

CSS 변수는 `assets/styles.css` 의 `:root` 가 단일 소스다.

### 표면 (Surfaces)
| Token | Hex | 용도 |
|---|---|---|
| `--canvas` | `#F3F0EE` | 페이지 캔버스. 순백색 사용 금지 |
| `--surface` | `#FCFBFA` | 한 단계 위로 떠 있는 카드/모달 — “페이퍼 온 페이퍼” |
| `--bone` | `#F4F4F4` | 쿨톤 회색이 필요한 보조 서브영역 (현재 미사용, 차후 옵션) |
| `--white` | `#FFFFFF` | 폼 인풋, satellite 버튼, free 칩 등 |

### 텍스트 & 라인
| Token | Hex | 용도 |
|---|---|---|
| `--ink` | `#141413` | 헤드라인 + 본문 1차 텍스트, 프라이머리 CTA 배경 |
| `--charcoal` | `#262627` | 본문 보조 텍스트 |
| `--granite` | `#555555` | 카드 서브타이틀, hero meta |
| `--muted` | `#696969` | 동의 항목, placeholder 보조 |
| `--line` | `#D1CDC7` | 입력 hover 보더, 동의 구분선, dust taupe |

### 브랜드 액센트
| Token | Hex | 용도 |
|---|---|---|
| `--orange` | `#CF4500` | 시그널 오렌지. 약속 라인, 강조 점, 폼 에러 보더 |
| `--orange-light` | `#F37338` | 궤도(orbit) 라인, 활성 인디케이터, 포커스 링 |
| `--clay` | `#9A3A0A` | 에러 텍스트, 깊은 러스트 (오렌지 surface 위 텍스트 대비 확보) |
| `--link` | `#3860BE` | 인라인 링크 (약관 보기 등) |

### 시맨틱
| Token | Hex | 의미 |
|---|---|---|
| `--success` / `--success-surface` | `#245730` / `#EEF8F0` | 폼 제출 성공 |
| `--warning` / `--warning-surface` | `#A35200` / `#FFF5E8` | 검증 경고 (예약, 현재 미사용) |
| `--error` / `--error-surface` | `#CF4500` / `#FFF2ED` | 폼 에러. 의도적으로 브랜드 오렌지와 정렬 |
| `--info` / `--info-surface` | `#3860BE` / `#EAF0FB` | 안내/링크 컨텍스트 |

> **금지:** 보라색 그라데이션, 차가운 파란색 메인, 의료색(녹색 십자) 메인 사용 금지. 오렌지는 “신호”이지 일반 액션 색이 아니다.

---

## 4. Typography

### Font Stack

```css
--font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Noto Sans KR', system-ui, sans-serif;
```

- **Pretendard Variable** 가 1차. 한글/Latin 글리프가 한 패밀리에 통합되어 있어 Inter+Noto Sans KR 조합의 자폭·행간 어긋남을 제거.
- 로드: `index.html` 에서 `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css` 로 동적 서브셋 사용.
- Noto Sans KR 은 CDN 실패 시 한글 폴백으로만 유지.
- **금지:** Inter, Roboto, Arial, Apple SD Gothic Neo 강제 (시스템 폴백에 맡김), 명조/세리프 액센트.

### 스케일

| Token | Value | 역할 |
|---|---|---|
| `--text-hero` | `clamp(36px, 4.5vw, 52px)` | H1 (지문 적성검사 이벤트) |
| `--text-4xl` | `clamp(34px, 4.2vw, 44px)` | 섹션 H2 |
| `--text-3xl` | `clamp(28px, 4vw, 40px)` | Promise 섹션 H2 |
| `--text-2xl` | `28px` | (예약) |
| `--text-xl` | `22px` | Hero lead 등 큰 본문 |
| `--text-lg` | `18px` | Hero lead 보조 |
| `--text-md` | `16px` | 본문 기본 |
| `--text-base` | `15px` | 카드 본문, 폼 인풋 |
| `--text-sm` | `13px` | eyebrow, 동의 텍스트 |
| `--text-xs` | `12px` | 푸터 micro |

### 라인 하이트 (한국어 튜닝)

| Token | Value | 용도 |
|---|---|---|
| `--lh-tight` | `1.18` | H1 hero — 한 줄이면 충분 |
| `--lh-snug` | `1.35` | H2 섹션 |
| `--lh-normal` | `1.55` | body 기본 |
| `--lh-relaxed` | `1.7` | 카드 본문 — 한글 가독성 우선 |

한국어는 라틴어 대비 자형이 정사각형에 가깝고 위·아래 여백이 좁아, body 에 `1.55` 이상을 기본으로 둔다.

### 원칙
- 헤드라인: `letter-spacing: -0.02 ~ -0.035em` (영문 음의 자간 유지)
- `word-break: keep-all` 글로벌 적용 — 한글 단어 중간 줄바꿈 금지
- eyebrow 만 대문자 (Latin 한정) + +4% 자간

---

## 5. Spacing

8px 베이스 + 4px 마이크로.

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |
| `--space-20` | `80px` |
| `--space-24` | `96px` |
| `--space-32` | `128px` |

- **섹션 수직 패딩 (desktop):** `--space-24` (96px) 기본, hero/promise 는 `--space-32` (128px) 까지
- **섹션 수직 패딩 (mobile, ≤560px):** `--space-12` ~ `--space-16` 로 압축
- **카드 내부 패딩:** desktop 36×32, mobile 28×22

---

## 6. Radius

Mastercard 스케일을 그대로 채택. 8~16px 의 “중간” 라운드는 의도적으로 비워둔다 — 그게 시스템의 정체성이다.

| Token | Value | 용도 |
|---|---|---|
| `--radius-xs` | `6px` | 마이크로 칩 (예약) |
| `--radius-sm` | `12px` | (사용 자제) |
| `--radius-md` | `20px` | 프라이머리/세컨더리 버튼 |
| `--radius-lg` | `24px` | 알럿, 동의 surface |
| `--radius-card` | `32px` | info-card, step-card, 모달 |
| `--radius-section` | `40px` | 섹션 컨테이너, hero 미디어 프레임 |
| `--radius-pill` | `9999px` | 인풋, 폰트 칩, free 칩, 아이콘 서클 |

**원칙:** 어떤 요소가 라운드를 못 정하겠으면 → 20 (버튼), 32 (카드), 40 (큰 컨테이너), 9999 (필) 중 골라라. 그 외는 의심.

---

## 7. Elevation (Shadow)

대기적(atmospheric) 그림자만 사용. 하드한 드롭섀도우 금지.

| Token | Value | 용도 |
|---|---|---|
| `--shadow-1` | `0 4px 24px rgba(20,20,19,.04)` | 떠 있는 nav 칩, satellite 등 미세 부양 |
| `--shadow-2` | `0 24px 48px rgba(20,20,19,.06)` | 카드 hover, lead-form, 기본 elevation (= `--shadow` alias) |
| `--shadow-3` | `0 32px 64px rgba(20,20,19,.10)` | 프라이버시 다이얼로그, 큰 모달 |
| `--shadow-orange` | `0 32px 64px rgba(207,69,0,.22)` | 핑거프린트 오브의 시그니처 글로우 |

---

## 8. Motion

| Token | Value | 용도 |
|---|---|---|
| `--duration-fast` | `120ms` | 즉각 응답 (체크박스, 토글) |
| `--duration-base` | `180ms` | 버튼/인풋 hover, transform |
| `--duration-slow` | `280ms` | 카드 hover lift |
| `--duration-deliberate` | `700ms` | reveal 진입 애니메이션 |
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | 모든 진입 |
| `--ease-in-out` | `cubic-bezier(.4, 0, .2, 1)` | 양방향 전환 |

- 모든 `@keyframes`/`transition` 은 위 토큰을 사용. 인라인 `.18s ease` 금지.
- `prefers-reduced-motion: reduce` 시 모든 애니메이션 비활성화 (이미 구현됨).

---

## 9. Layout

- **컨테이너:** `width: min(1180px, calc(100% - 48px))`, 가운데 정렬
- **섹션 마진:** `margin: 32px` (카드형 섹션이 캔버스 위에 떠 있는 느낌)
- **그리드:**
  - Hero: 2-up 비대칭 (`minmax(0, min(580px, 100%)) 340px`)
  - Value: 2×2
  - Steps: 3-up
  - 모바일 (≤900px): 모두 1-up 스택
- **궤도(orbit) 라인:** hero 와 promise 의 시그니처. 모바일에서는 시각적 노이즈를 줄이도록 그대로 두되 narrow 화

### Breakpoints

| Name | Width | 주요 변화 |
|---|---|---|
| Wide | ≥ 1024px | full grid, orbit 풀 폭 |
| Tablet | 561–900px | 2-up → 1-up 일부, 컨테이너 720px 클램프 |
| Mobile | ≤ 560px | 모든 grid 1-up, 버튼 풀 폭, 섹션 패딩 압축 |

---

## 10. Focus & Accessibility

- 포커스 링: `box-shadow: var(--focus-ring)` 또는 `outline: 3px solid rgba(243,115,56,.45)` + offset 3px
- 모든 인풋/버튼/체크박스/다이얼로그 close 에 적용 (구현됨)
- 클릭 가능 영역 최소 44×44px (모바일)
- `<label>` 로 모든 인풋 래핑 (구현됨)
- `aria-labelledby`, `aria-live="polite"` 폼 알럿에 적용 (구현됨)
- 색상 대비:
  - `--ink` on `--canvas`: AAA
  - `--charcoal` on `--surface`: AAA
  - `--muted` (#696969) on `--canvas`: AA (큰 텍스트만 권장)
  - `--clay` on `--error-surface`: AA+

---

## 11. Component Inventory

현재 페이지에 구현된 컴포넌트 (`assets/styles.css` 참조):

- **Hero** — 워터마크(`hero__watermark`) + orbit + 2-up 그리드 + 핑거프린트 오브
- **Promise** — `--ink` 배경의 큰 라운드 섹션, eyebrow + H2 + rule + sub
- **Value cards** — 2×2 info-card, 각각 icon-circle + label + h3 + p
- **Steps** — 3-up step-card, 번호 라벨
- **Lead form** — 입력 5종 + 동의 3종 (필수 2, 선택 1) + 제출 버튼
- **Privacy dialogs** — `<dialog>` 3개 (수집/제3자/마케팅)
- **Footer** — `--ink` 배경 mini footer

### 사용 안 함 (Mastercard 명세에는 있으나 MVP 범위 밖)
- 플로팅 네비게이션 필
- 캐러셀 카드
- 원형 포트레이트 + satellite 그리드 (단, hero 의 fingerprint-orb 는 satellite 변형)
- 4-column 푸터

---

## 12. Do's and Don'ts

### Do
- 캔버스는 `--canvas` (`#F3F0EE`) 로 시작. 순백색 위에 빌드하지 말 것
- 본문/카드 텍스트는 `--lh-normal` 또는 `--lh-relaxed` — 한글 행간 보호
- 새 컴포넌트 라운드는 20/32/40/9999 중 하나로 정해라
- 폼 에러는 `--error-surface` + `--clay`, 성공은 `--success-surface` + `--success`
- 인터랙션 transition 은 토큰 사용 (`var(--duration-base) var(--ease-out)`)
- 한글이 들어가는 헤드라인은 `<br>` 로 의도된 줄바꿈 위치를 명시
- 새 색을 만들기 전에 토큰 테이블에서 가능한 매칭을 먼저 찾기

### Don't
- 보라색 그라데이션, 차가운 파란색 메인, 의료 녹색 메인 사용 금지
- 폰트 추가 금지 (Pretendard 단일 시스템 유지)
- 라운드 8~16px 사용 금지 (시스템 정체성 손상)
- 인라인 `.18s ease` 금지 — 토큰 사용
- “진단/처방/100% 정확” 류 의료적 단정 표현 금지 (CLAUDE.md 와 합치)
- 외부 폰트 4개 이상 로딩 금지 (성능)
- 동의 항목 위에 가벼운 마이크로카피로 “법적 의무 회피” 분위기 만들지 말 것

---

## 13. Implementation Map

| 토큰 | 파일·라인 |
|---|---|
| 모든 CSS 변수 | `assets/styles.css:1–96` (:root) |
| 폰트 로드 | `index.html:11–16` |
| 한국어 word-break | `assets/styles.css` body 룰 |
| reveal 애니메이션 | `assets/styles.css` `.reveal` + `@keyframes reveal` |
| reduced-motion | `assets/styles.css` `@media (prefers-reduced-motion: reduce)` |

---

## 14. Future / Known Gaps

- **다크 모드 미지원** — 학부모 사용자의 야간 사용 가설은 있으나, 폼 제출 1회 후 이탈하는 랜딩 특성상 ROI 낮음. 도입 시 `--canvas` → 따뜻한 `#1B1A19`, 모든 surface 채도 -15% 권장
- **`--bone`, `--space-1`, `--text-xs`** 등 일부 토큰은 예약 (현재 페이지에서 미사용)
- **plain-text 폴백:** Pretendard CDN 차단 환경 (사내 방화벽 등) 에서 Noto Sans KR 폴백 시 자간 ~1px 더 좁아 보임. 치명적이지 않음
- **카카오 알림톡, 관리자 페이지** — MVP 범위 밖 (CLAUDE.md)

---

## 15. Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-13 | Mastercard 시스템 채택 | 사용자 비교 시안에서 최종 승인 |
| 2026-05-17 | 토큰 시스템화, Pretendard 도입 | 한국어 가독성 + 향후 확장 일관성 + 임의값 드리프트 방지 |
| 2026-05-17 | 다크모드 보류 | 1회성 리드 랜딩 ROI 부족, 차후 옵션으로 명시 |
