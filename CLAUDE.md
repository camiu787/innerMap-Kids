# CLAUDE.md — kims-working

## Project Summary

This project is a static lead-generation landing page for a child fingerprint aptitude test business. Parents submit basic child/contact information, and the operator follows up for remote or in-person consultation.

## Current Product Decisions

- Frontend: static HTML/CSS/JavaScript.
- Backend: Google Apps Script Web App.
- Storage: Google Sheets.
- Notification: Gmail via `MailApp.sendEmail`.
- No admin page, login, top navigation, testimonial section, or Kakao Alimtalk in the MVP.

## Core User Flow

1. Parent opens public landing page link or QR code.
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

Use the Mastercard-inspired design system documented in `DESIGN-mastercard.md`.

Key tokens:

- Canvas cream: `#F3F0EE`
- Lifted cream: `#FCFBFA`
- Ink black: `#141413`
- Signal orange: `#CF4500`
- Light orange orbit: `#F37338`
- Link blue: `#3860BE`
- Large radii: `20px`, `32px`, `40px`, `9999px`
- Typography: `Inter`, `Noto Sans KR`, system sans-serif

Style principles:

- Warm, trustworthy, editorial, not clinical.
- Use circles, pills, rounded cards, and thin orange orbit lines.
- Avoid sharp rectangular UI unless technically necessary.
- Use orange sparingly as a signal/accent color.
- Preserve Korean readability with `word-break: keep-all`.

## Required Page Sections

1. Hero — “지문 적성검사 이벤트” and primary CTA.
2. Manifesto — black rounded section with the two user-approved sentences.
3. Four value cards — personality, learning style, social behavior, interests.
4. Three steps — 신청, 상담, 분석.
5. Lead form — five data fields plus privacy consent.
6. Simple footer.

## User-Approved Copy That Must Be Preserved

- “우리 아이의 가능성은 성적보다 타고난 기질과 강점에서 시작됩니다.”
- “지문검사는 아이를 바꾸기 위한 검사가 아니라, 아이를 더 깊이 이해하기 위한 작은 시작입니다.”
- “우리 아이만의 재능과 가능성을 발견해보세요.”

## Important Files

- `index.html` — production static landing page.
- `assets/styles.css` — design system and responsive CSS.
- `assets/script.js` — form validation and Google Apps Script submission.
- `apps-script/Code.gs` — Google Apps Script backend template.
- `docs/superpowers/specs/2026-05-13-fingerprint-aptitude-landing-design.md` — product/design spec.
- `DESIGN-mastercard.md` — visual system reference.
- `.superpowers/brainstorm/65271-1778680010/content/mastercard-v10.html` — final approved mockup.
- `memory.md` — session memory and decisions.

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

- Keep the site dependency-free unless the user explicitly asks for a framework.
- Do not add nav, testimonials, authentication, admin pages, or Kakao Alimtalk in MVP work.
- Use accessible HTML elements and visible focus states.
- Keep the form usable on 390px mobile width.
- Preserve entered values on submission failure.
- If Apps Script URL is not configured, keep demo mode safe and obvious.
- Avoid strong medical/diagnostic claims. Prefer “경향”, “이해”, “강점”, “가능성”, and “상담”.

## Verification Before Reporting Done

- Run `git status --short`.
- Confirm the static files exist.
- Start `python3 -m http.server 4173` and open the page if browser tooling is available.
- Test empty form validation.
- Test valid demo-mode form submission.
- Confirm the page is responsive at desktop and mobile widths.
