# CLAUDE.md — kims-working

## Project Summary

This project is the official static website for a child fingerprint aptitude test business. Its primary job is still lead generation — parents submit basic child/contact information and the operator follows up for remote or in-person consultation — but the site is no longer framed as a single-purpose event landing page.

**Status (2026-09-01): transitioning from event landing page to full website.**
The visual direction and section structure are being re-established. Until that lands, do not treat the current `index.html` structure or `DESIGN.md` aesthetic section as final.

## Brand (from client materials, 2026-09-01)

- **상호: 너바나 (NEOBANA)** — 교육서비스업, 교육관련 자문 및 평가업. 경기 화성시 동탄. 2026-08 개업.
- **슬로건: “너를 알고, 나를 알다.”**
- **로고:** 겹쳐진 두 원(라벤더 퍼플 + 살구 오렌지) 안에 마주 보는 두 얼굴 실루엣, 교집합에 4점 별.
  국문 워드마크는 둥근 산세리프, 딥 네이비.
- 로고 팔레트: 라벤더 퍼플 / 살구 오렌지 / 딥 네이비 / 아이보리 배경.
  → 현재 사이트의 Mastercard 크림+오렌지 팔레트와 어긋난다. 새 디자인 방향은 이 로고에서 출발해야 한다.
- **사이트 표기명: 「너바나 NEOBANA」로 확정 (2026-09-01).** 기존 “지문아이” 표기는 폐기.

원본 자료는 `data/` (gitignore 처리됨, 사업자등록증 등 민감정보 포함 — 커밋·외부 전송 금지).

## Reference Sites Collected by the Client

| 사이트 | 성격 | 특징 |
|---|---|---|
| `ablecare1.mycafe24.com` | 톤 레퍼런스 (고객이 지목) | WordPress/Elementor, Swiper autoplay 캐러셀 히어로 |
| `kkti.co.kr` | 경쟁 (MBTI 정밀검사) | 다크 그라운드 + 퍼플 그라데이션. 가장 “고급”한 톤 |
| `gfat.co.kr` | 경쟁 (한국지문적성평가원) | GFAT 지문적성검사. 정보 과밀, 무료 혜택 소구 |
| `kmbti.co.kr` | 경쟁 (한국MBTI심리연구소) | 블루 배경, 인물 컷아웃 |
| `(주)아이비` | 경쟁 (지문적성검사) | 노란/그레이 슬라이더, 아동 인물 컷 |
| `i-FAS` | 경쟁 (GFAT 본사 계열) | 퍼플-블루 그라데이션, 인물 컷 |

## Current Product Decisions

- Frontend: static HTML/CSS/JavaScript.
- Backend: Google Apps Script Web App.
- Storage: Google Sheets.
- Notification: Gmail via `MailApp.sendEmail`.
- Top navigation is now **allowed and expected** (a proper website needs it).
- 후기(리뷰) 섹션은 **고객 요청으로 2026-09-01 범위에 포함**됐다. 단, 실제 동의받은 후기만 게시한다 — 가공 후기 금지.
- Still out of scope: admin page, login, Kakao Alimtalk.

## Core User Flow

1. Parent opens the public site link or QR code.
2. Parent reads the hero/manifesto/value sections.
3. Parent fills out the form.
4. Static frontend POSTs to Google Apps Script.
5. Apps Script appends one row to Google Sheets and sends an email notification.
6. The operator contacts the parent within 24 hours.

## Collected Fields

- Parent name
- Phone number
- Region
- Number of children
- Child age or ages
- Privacy consent checkbox

## Design System

**Single source of truth: `DESIGN.md`.**

> ⚠️ **Aesthetic direction under revision (2026-09-01).** The client rejected the current
> warm-editorial look and asked for a more premium feel, referencing
> `https://ablecare1.mycafe24.com/` (WordPress/Elementor, Swiper autoplay carousel hero)
> and requesting an "어라운드뷰" style hero. `DESIGN.md` §2 Aesthetic Direction is pending
> replacement via the `design-discovery` skill. Everything below (tokens, scales, motion,
> accessibility) still governs the code as shipped — keep using the tokens until the new
> direction is approved.

Background reference: `DESIGN-mastercard.md` (visual inspiration for the outgoing direction).

All CSS tokens live in `assets/styles.css` `:root`. Use them — never inline raw hex, px, or duration values.

Key tokens (excerpt — see `DESIGN.md` for full list):

- Canvas cream: `var(--canvas)` `#F3F0EE`
- Surface: `var(--surface)` `#FCFBFA`
- Ink black: `var(--ink)` `#141413`
- Signal orange: `var(--orange)` `#CF4500`, light orbit `var(--orange-light)` `#F37338`
- Link blue: `var(--link)` `#3860BE`
- Semantic: `--success`, `--error`, `--warning`, `--info` (each with matching `*-surface`)
- Radii: `--radius-md` (20) / `--radius-card` (32) / `--radius-section` (40) / `--radius-pill` (9999). Skip 8–16px.
- Spacing: 8px base (`--space-2` … `--space-32`)
- Typography: **Pretendard Variable** (single family for Hangul + Latin), `--text-*` and `--lh-*` tokens
- Motion: `var(--duration-base) var(--ease-out)` — never inline `.18s ease`

Style principles:

- Warm, trustworthy, editorial, not clinical.
- Use circles, pills, rounded cards, and thin orange orbit lines.
- Avoid sharp rectangular UI unless technically necessary.
- Use orange sparingly as a signal/accent color.
- Preserve Korean readability with `word-break: keep-all` and `--lh-normal`/`--lh-relaxed`.
- Read `DESIGN.md` before any visual change. Do not deviate without explicit user approval.

## Page Sections

### Approved information architecture (2026-09-01)

**멀티 페이지 (2026-09-01 개편).** 탭마다 별도 HTML 파일이며 앵커 스크롤은 쓰지 않는다.
홈은 히어로가 있어 내비가 투명하게 시작하고, 서브 페이지는 `class="nav solid"` 로 처음부터 불투명하다
(`<body class="has-page-head">` 가 고정 내비 높이만큼 본문을 내린다).

Revised 2026-09-01 after client review of the mockup.

| # | Nav tab | File | Content |
|---|---|---|---|
| — | (홈) | `index.html` | 워크스루 히어로 + 슬로건 + 매니페스토 + 검사 3종 카드(각 페이지 링크) + 하단 CTA |
| 1 | 너바나 소개 | `about.html` | 브랜드·슬로건, 동탄 상담실, 대면/비대면 |
| 2 | 전문가 소개 | `expert.html` | 원장 프로필, 상담 철학, 다루는 검사 3종 |
| 3 | 유전자지문적성검사 | `dna.html` | 성향·학습·사회성·흥미 4관점 |
| 4 | MBTI검사 | `mbti.html` | 16유형 + 4지표 |
| 5 | TCI검사 | `tci.html` | 기질 4척도 + 성격 3척도 |
| 6 | 후기 | `reviews.html` | 학부모 후기 — **동의받은 실제 후기만.** 현재는 샘플 자리 표시 상태 |
| 7 | 자주 묻는 질문 | `faq.html` | 연령, 지문 변화, 개인정보 |
| — | 상담 신청 (버튼) | `apply.html` | 리드 폼 + 약관 모달 3개. **`assets/script.js` 는 이 페이지에서만 로드한다** |

### 페이지 공통 요소는 9개 파일에 복제되어 있다

빌드 단계가 없으므로 내비·푸터·`<head>` 는 각 HTML에 그대로 들어 있다.
**내비 항목이나 푸터를 고칠 때는 9개 파일 전부**(`index`, `about`, `expert`, `dna`, `mbti`, `tci`, `reviews`, `faq`, `apply`)를 함께 수정한다.
각 서브 페이지는 `.page-head`(제목 밴드) → 본문 섹션(`.sec--sub`) → `.cta-strip`(하단 상담 유도) 순서다.

내비가 7개라 1080px 이하에서는 햄버거 메뉴로 접는다.

**삭제된 섹션 (고객 지시, 2026-09-01):** 검사 결과 예시(`#report`), 검사 안내(`#process`).
검사 시간·진행 방식 같은 전환 정보는 신청 섹션의 신뢰 목록으로 흡수했다.

**“무료”·“비용 없음”·“Free” 표현 금지 (2026-09-01 고객 지시).** CTA는 “상담 신청”이다.
검사는 유료다 — 유전자지문적성검사 79,000원(1:1 해석상담 포함)은 `dna.html` 검사 안내 표에 표기한다.

- **히어로: 스크롤 워크스루(어라운드뷰 C안) 확정.** 스크롤에 따라 카메라가 상담실 안으로 들어가고 카피가 순차 등장. 소재는 `data/hero-room.png`.
- B2B(자격증·가맹·평가사)는 내비에 넣지 않고 **푸터에 “강사·제휴 문의” 링크로만** 노출.
- 나머지 기존 섹션(폼, 승인 카피)은 위 구조 안으로 흡수한다.

기존 배포본 섹션 (참고):

1. Hero — “지문 적성검사 이벤트” and primary CTA.
2. Manifesto — black rounded section with the two user-approved sentences.
3. Four value cards — personality, learning style, social behavior, interests.
4. Three steps — 신청, 상담, 분석.
5. Lead form — five data fields plus privacy consent.
6. Simple footer.

The lead form and the user-approved copy below must survive any restructuring.

## User-Approved Copy

### 현행 (2026-09-02 고객 직접 작성 — 홈페이지)

히어로:
- “너를 알고, 나를 이해하며 / 서로의 다름을 발견하는 것.”
- 리드: “너바나는 그 이해의 시작을 함께합니다.”

슬로건 배너:
- “너를 알고, 나를 알다.”
- “성격을 이해하는 순간, 관계를 바라보는 시선이 달라집니다.”

우리의 약속 (매니페스토):
- “우리는 누군가를 바꾸기 위해 검사하지 않습니다. 서로를 더 잘 이해하기 위해 알아갑니다.”
- “사람은 하나의 결과나 유형만으로 설명될 수 없습니다. 너바나는 다양한 검사를 통해 각자의 성향과 기질, 강점과 차이를 살펴봅니다.”
- “나를 이해하고, 너를 이해하는 것. 그것이 너바나가 생각하는 검사의 시작입니다.”

PROGRAMS:
- “나를 이해하는 다양한 방법”
- “무엇이 궁금한지에 따라 나를 들여다보는 방법도 달라질 수 있습니다. 너바나에서 지금의 나에게 맞는 검사를 만나보세요.”

> **포지셔닝 변화:** 새 카피는 대상을 “아이”에서 **“너와 나(관계·상호 이해)”** 로 넓혔다.
> 홈은 이 톤으로 정렬됐으나 `about.html` / `expert.html` / 검사 3개 페이지의 본문은
> 여전히 아이·학부모 중심 문장이다. **전면 정렬은 고객 확인 후 진행한다.**

### 이전 승인 카피 (2026-05 승인 → 2026-09-02 홈에서 교체됨)

- “우리 아이의 가능성은 성적보다 타고난 기질과 강점에서 시작됩니다.” (슬로건에서 교체)
- “지문검사는 아이를 바꾸기 위한 검사가 아니라, 아이를 더 깊이 이해하기 위한 작은 시작입니다.” (매니페스토에서 교체)
- “우리 아이만의 재능과 가능성을 발견해보세요.” — **`apply.html` 에서 계속 사용 중, 유지**

## Important Files

- `index.html` — 홈. 워크스루 히어로 + 검사 3종 카드.
- `about.html` / `expert.html` / `dna.html` / `mbti.html` / `tci.html` / `reviews.html` / `faq.html` — 탭별 페이지.
- `apply.html` — 상담 신청 폼 페이지 (Apps Script 연동은 이 페이지에서만 동작).
- `assets/site.js` — 히어로 워크스루·내비·모바일 메뉴·스크롤 등장 (시각 동작 전용).
- `assets/styles.css` — design system and responsive CSS.
- `assets/script.js` — form validation and Google Apps Script submission.
- `apps-script/Code.gs` — Google Apps Script backend template.
- `docs/superpowers/specs/2026-05-13-fingerprint-aptitude-landing-design.md` — product/design spec.
- `DESIGN.md` — design system single source of truth (tokens, scales, rules).
- `DESIGN-mastercard.md` — Mastercard visual inspiration reference (background).
- `.superpowers/brainstorm/65271-1778680010/content/mastercard-v10.html` — final approved mockup.
- `memory.md` — session memory and decisions.

## SEO / AEO / GEO

기준 URL은 `https://camiu787.github.io/innerMap-Kids/` 다. **커스텀 도메인으로 옮기면
canonical·OG·JSON-LD·sitemap·llms.txt의 절대 URL을 전부 교체해야 한다.**

각 페이지 `<head>` 에 들어 있는 것:
- `canonical`, `robots`(index, follow, max-image-preview:large), `theme-color`
- Open Graph + Twitter 카드 (`assets/og-image.jpg`, 1200×630)
- JSON-LD `@graph` — 페이지 타입 + `BreadcrumbList` + 조직 엔티티(`EducationalOrganization`/`LocalBusiness`)
- 홈은 히어로 이미지 `preload` 추가

사이트 루트 파일:
- `robots.txt` — 검색 크롤러 + AI 답변엔진(GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Yeti, Daumoa) 허용
- `sitemap.xml` — 9개 페이지. **페이지를 추가하면 여기도 추가한다.**
- `llms.txt` — AI 답변엔진용 사실 요약(핵심 사실, 검사 3종 설명, FAQ). 페이지 내용이 바뀌면 같이 갱신한다.
- `404.html` — GitHub Pages 커스텀 404, `noindex`

AEO 장치: `faq.html` 의 `FAQPage` 구조화 데이터, 검사 3개 페이지의 `.spec` 요약(`<dl>`) 블록,
각 페이지 헤더의 한 문장 요약 리드.

**가격:** 유전자지문적성검사 **79,000원** (1:1 대면 해석상담 포함, 2026-09-02 고객 확정).
`dna.html` 의 `Service` 스키마에 `Offer`(KRW 79000)로 들어가 있고 검사 안내 표에도 표기된다.
MBTI·TCI 가격은 미확정 — 확정 전까지 표기하지 않는다.

**금지:** `Review`·`AggregateRating` 구조화 데이터는 실제 동의받은 후기가 확보될 때까지 넣지 않는다
(없는 평점은 구글 스팸 정책 위반이며 수동 조치 대상이다). 전화번호도 확정 전까지 스키마에 넣지 않는다.

## Local Development Harness

This is a no-build static site.

Run local preview:

```bash
cd /workspace/kims-working
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173
```

Quick checks:

```bash
python3 -m py_compile /dev/null
python3 - <<'PY'
from pathlib import Path
for path in ['index.html', 'assets/styles.css', 'assets/script.js', 'apps-script/Code.gs']:
    assert Path(path).exists(), f'missing {path}'
print('static files present')
PY
```

## Google Apps Script Setup

1. Create a Google Sheet.
2. Open Apps Script from the Sheet or create a standalone Apps Script project.
3. Paste `apps-script/Code.gs`.
4. Set:
   - `SHEET_ID`
   - `SHEET_NAME` if needed
   - `NOTIFY_EMAIL`
5. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
6. Copy the deployment URL into `assets/script.js`:

```js
const APPS_SCRIPT_URL = '...';
```

## Implementation Rules

- Keep the site dependency-free unless the user explicitly asks for a framework or a
  specific interaction (e.g. a carousel/around-view hero) genuinely needs a library.
- Do not add authentication, admin pages, or Kakao Alimtalk.
- 후기 섹션은 허용되지만 **없는 후기를 만들어 넣지 않는다.** 실제 후기가 없으면 “자리 표시”임이 화면에 보이게 둔다.
- Use accessible HTML elements and visible focus states.
- Keep the form usable on 390px mobile width.
- Preserve entered values on submission failure.
- If Apps Script URL is not configured, keep demo mode safe and obvious.
- Avoid strong medical/diagnostic claims. Prefer “경향”, “이해”, “강점”, “가능성”, and “상담”.

## Verification Before Reporting Done

- Run `git status --short`.
- Confirm the static files exist.
- Start `python3 -m http.server 4173` and open the pages if browser tooling is available.
- 9개 페이지 전부 열어 내비·푸터 링크가 깨지지 않았는지 확인한다.
- Test empty form validation.
- Test valid demo-mode form submission.
- Confirm the page is responsive at desktop and mobile widths.
