# 작업 메모리 — 지문 적성검사 랜딩페이지

이 파일은 매 세션 작업 내용을 누적 기록한다. 새 세션을 시작할 때 가장 먼저 이 파일을 읽고 이어서 작업한다.

---

## 📌 프로젝트 한 줄 요약
친구분의 아동 지문 적성검사 비즈니스를 위한 **리드 수집 랜딩페이지** 제작.
부모(학부모)가 페이지에 자녀 정보를 남기면, 친구분이 그 정보로 연락해 비대면/방문 상담을 진행한다.

## 🎯 현재 상태 (이어작업 기준 요약)

### ✅ 이미 된 것
- 브레인스토밍·데이터 필드·기술 스택(MVP) 확정
- Mastercard v10 디자인 합의, 설계 스펙 문서 커밋됨
- **정적 랜딩 프로덕션 구현물 작성됨**: `index.html`, `assets/styles.css`, `assets/script.js`
- 폼 검증·데모 모드·Apps Script POST 연동 **자리**(URL 미설정 시 안전하게 동작)
- **백엔드 템플릿** `apps-script/Code.gs`(시트 append + 메일 알림 골격, placeholder 존재)
- 팀 컨텍스트 문서 **`CLAUDE.md`**
- **히어로 레이아웃**: 글블록과 오른쪽 지문 원 사이 간격 축소(`.hero__grid` 첫 칸 너비 제한 + `column-gap`)

### ⬜ 아직 안 된 것
- **Git 정리**: 구현 파일·`CLAUDE.md` 등 대부분 **미추적(untracked)** 이라 원격 저장소에는 없음 (`git status` 참고)
- **Google 연동 실값**: Spreadsheet ID, 시트 이름, 알림 받을 이메일, Apps Script **웹앱 배포 URL** → `Code.gs` · `assets/script.js`의 `APPS_SCRIPT_URL`(또는 동일 목적 설정) 교체
- **E2E**: 실제 제출 → 행 저장 → Gmail 수신 확인
- **정식 호스팅**: Netlify / Vercel / GitHub Pages 등 + 도메인·QR(필요 시)

### 📌 다음 세션에서 맨 먼저 할 만한 순서
1. `git add` 후 의미 있는 커밋(예: `feat: 정적 랜딩 + Apps Script 템플릿`). 친구/협업자 넘길 거면 브랜치·원격 레포 생성
2. 시트·Apps Script 세팅 후 프론트 URL 연결 및 제출 테스트
3. 호스팅 연결 후 공개 URL 확정 → 운영자에게 전달

---

## 📂 핵심 파일 위치
| 파일 | 용도 |
|------|------|
| `docs/superpowers/specs/2026-05-13-fingerprint-aptitude-landing-design.md` | 최종 설계 문서 (요구사항·아키텍처·페이지 구성·데이터 흐름) |
| `DESIGN-mastercard.md` | 적용한 디자인 시스템 (토큰·타이포·컬러·컴포넌트) |
| `DESIGN-notion.md` / `DESIGN-airbnb.md` / `DESIGN-apple.md` | 비교용 (선택 안 함) |
| `.superpowers/brainstorm/65271-.../content/mastercard-v10.html` | 합의된 최종 디자인 시안 (HTML 목업) |
| `index.html` | 배포용 랜딩 HTML |
| `assets/styles.css` / `assets/script.js` | 스타일·폼·제출 로직 |
| `apps-script/Code.gs` | Google Sheets + MailApp 템플릿 |
| `CLAUDE.md` | 에이전트/개발자용 프로젝트 요약·로컬 실행·연동 순서 |
| `.hermes/plans/2026-05-14_052923-design-upgrade-plan.md` | 구현 전 계획 메모(선택 참고) |
| `memory.md` | 이 파일 (작업 기록 누적) |

### 로컬 미리보기
```bash
cd /Users/seonwoo/Documents/GitHub/kims-working && python3 -m http.server 4173
```
브라우저: `http://localhost:4173/`

## 🔑 확정된 핵심 결정사항

### 사용자
- **고객(부모)**: 공개 링크/QR로 누구나 페이지 접근. 인증 없음.
- **친구분(검사자)**: 구글 시트로 입력 정보 직접 조회. 별도 어드민 페이지·비밀번호 없음.
- 사용자는 페이지를 직접 쓰지 않음. **친구분의 비즈니스 페이지**임.

### 수집 데이터 5필드
이름 / 전화번호 / 거주 지역 / 자녀 수 / 자녀 나이

### 기술 스택
- **프론트엔드**: 정적 HTML/CSS/JS (Netlify, Vercel, 또는 GitHub Pages 무료 호스팅)
- **백엔드**: Google Apps Script 웹앱 (별도 서버 없음)
- **저장**: Google Sheets (친구분의 어드민 화면 역할)
- **알림**: Gmail MailApp으로 친구분 이메일 자동 발송
- **알림톡**: MVP 이후로 보류 (셋업 무거움)

### 디자인 시스템
**Mastercard DESIGN.md** 적용. 핵심 토큰:
- 캔버스 `#F3F0EE` (따뜻한 크림)
- 검정 CTA `#141413`
- 액센트 오렌지 `#CF4500` (적게 사용)
- 극단적 둥근 모서리 (20/32/40/9999px)
- 원형 일러스트 + 가는 오렌지 호선
- 모노라인 SVG 아이콘 (1.6px 스트로크)
- 완전 반응형 (PC·모바일 동등)

### 페이지 구성 (상단 nav·후기 없음)
1. HERO — "지문 적성검사 이벤트" + 서브카피 + 검정 CTA + 오렌지 지문 원형
2. MANIFESTO (검정 박스) — "우리 아이의 가능성은 성적보다…" + "지문검사는 아이를 바꾸기 위한 검사가 아니라…"
3. 4 VALUES (2x2 그리드) — 인격적 성향 / 학습 성향 / 행동·사회성(대인관계) / 흥미 영역
4. 3 STEPS — 신청 → 상담 → 분석
5. FORM — 5필드 + 동의 + 검정 CTA
6. FOOTER (간단)

## ✏️ 사용자 직접 작성 카피
다음 세 문장은 사용자가 직접 작성해서 페이지 결정적 위치에 배치됨:
1. **MANIFESTO 메인** — "우리 아이의 가능성은 성적보다 타고난 기질과 강점에서 시작됩니다."
2. **MANIFESTO 부연** — "지문검사는 아이를 바꾸기 위한 검사가 아니라, 아이를 더 깊이 이해하기 위한 작은 시작입니다."
3. **FORM 위 헤드** — "우리 아이만의 재능과 가능성을 발견해보세요."

## 🚫 명시적 범위 외
- 카카오 알림톡 (MVP 이후)
- 상단 네비게이션 메뉴
- 후기 섹션
- 어드민 페이지·로그인·검색·메모 기능

## 🗓️ 세션 로그

### 2026-05-13 (1차 세션)
- 사용자 의도 파악: 친구분 비즈니스용 리드 수집 페이지
- 데이터 5필드 확정, 구글폼 대신 자체 웹폼 결정
- 기술 스택 옵션 3개 비교 → A안(정적 HTML + Apps Script + 시트) 선택
- 디자인 시안 11종 시도 (A~K 직접 그림 7종 + Notion/Airbnb/Apple/Mastercard DESIGN.md 적용 4종)
- **Mastercard 시스템 최종 선택**
- 카피 톤 업계 리서치 (다중지능·강점지능·학습성향 키워드)
- 사용자 카피 3문장 직접 제공받아 배치
- v1 → v10 까지 디자인 미세조정 (헤더 제거·카드 내용 교체·서브헤더 추가·설명 제거·간격 조정)
- 설계 문서 작성: `docs/superpowers/specs/2026-05-13-fingerprint-aptitude-landing-design.md`
- git 초기화 + 첫 커밋 (`ecb5640`)
- 다음 세션 진입점: **사용자의 설계 문서 검토 → writing-plans 스킬로 구현 계획 작성**

### 2026-05-14 (2차 세션)
- `/workspace/kims-working` 구조 확인 후 구현 계획서 작성: `.hermes/plans/2026-05-14_052923-design-upgrade-plan.md`
- 최종 Mastercard v10 목업을 실제 배포 가능한 정적 랜딩페이지로 구현
- 생성 파일:
  - `index.html` — 실제 배포용 정적 랜딩페이지 HTML
  - `assets/styles.css` — Mastercard 기반 디자인 토큰, 반응형 레이아웃, 카드/폼/버튼 스타일
  - `assets/script.js` — 폼 검증, 제출 상태, 데모 모드, Apps Script POST 연동 준비
  - `apps-script/Code.gs` — Google Sheets 저장 + Gmail 알림용 Apps Script 백엔드 템플릿
  - `CLAUDE.md` — Claude Code용 프로젝트 컨텍스트/하네스 문서
- 구현된 페이지 구성:
  1. HERO — `지문 적성검사 이벤트`, 원형 지문 일러스트, CTA, `신청 5분 · 비대면 가능`
  2. MANIFESTO — 사용자 확정 카피 2문장을 검정 라운드 섹션으로 강조
  3. 4 VALUES — 인격적 성향 / 학습 성향 / 행동·사회성 / 흥미 영역 카드
  4. 3 STEPS — 신청 / 상담 / 분석 절차 카드
  5. FORM — 학부모 이름, 연락처, 거주 지역, 자녀 수, 자녀 나이, 개인정보 동의
  6. FOOTER — 간단한 사이트명/저작권/개인정보처리방침 텍스트
- 디자인 개선 사항:
  - 캔버스 `#F3F0EE`, 카드 `#FCFBFA`, CTA `#141413`, 오렌지 `#CF4500/#F37338` 토큰 적용
  - 원형 지문 그래픽, 위성 CTA, FREE 칩, 오렌지 궤도선, 큰 EVENT 워터마크 적용
  - PC/태블릿/모바일 반응형 처리, 모바일 1열 카드/폼 레이아웃 적용
  - 한국어 줄바꿈을 위해 `word-break: keep-all` 적용
  - 버튼/입력/동의 체크박스에 hover, focus-visible, 오류 상태 스타일 추가
- 폼 동작:
  - 이름 필수 검증
  - 전화번호 숫자 정규화 및 9~11자리 검증
  - 개인정보 동의 체크 검증
  - 제출 중 버튼 문구 변경
  - 성공/실패 알림 표시
  - Apps Script URL 미설정 시 실제 저장 없이 데모 모드로 안전 처리
- Apps Script 백엔드 템플릿:
  - `SHEET_ID`, `SHEET_NAME`, `NOTIFY_EMAIL` placeholder 포함
  - `doPost(e)`에서 JSON 파싱 → 검증 → 시트 appendRow → 이메일 알림 → JSON 응답
  - `doGet()` 헬스체크 응답 포함
- `CLAUDE.md` 기록 내용:
  - 프로젝트 목적/기술 스택/사용자 플로우/수집 필드
  - Mastercard 디자인 시스템 핵심 토큰과 구현 규칙
  - 반드시 보존해야 하는 사용자 확정 카피 3문장
  - 주요 파일 설명
  - 로컬 개발 하네스: `python3 -m http.server 4173`
  - Google Apps Script 설정 순서
  - 구현 규칙 및 검증 체크리스트
- 검증 완료:
  - 정적 파일 존재 확인
  - `assets/script.js` 문법 검사: `node --check assets/script.js`
  - 로컬 서버 `python3 -m http.server 4173` 실행
  - `http://127.0.0.1:4173/` HTTP 200 확인
  - HTML에서 주요 토큰(`지문 적성검사`, `무료 상담 신청하기`, CSS/JS 링크) 확인
  - 브라우저 스크린샷 검증은 환경에 Chrome이 없어 생략
- 임시 미리보기:
  - 로컬 서버를 localhost.run 터널로 공개
  - 미리보기 URL: `https://052c03d558361c.lhr.life`
  - 임시 터널이라 세션 종료 시 끊길 수 있음
- 현재 git 상태 요약:
  - 수정: `memory.md`
  - 미추적: `.hermes/`, `CLAUDE.md`, `apps-script/`, `assets/`, `index.html`
- 다음 진입점:
  1. 사용자가 미리보기 사이트에서 디자인/문구/모바일 레이아웃 최종 확인
  2. 수정 피드백 반영
  3. 실제 Google Sheet ID, 친구분 이메일, Apps Script Web App URL 확보
  4. `apps-script/Code.gs`와 `assets/script.js` placeholder 교체
  5. 실제 신청 제출 → Google Sheet 저장 → 이메일 알림까지 E2E 테스트
  6. Netlify/Vercel/GitHub Pages 중 하나로 정식 배포
  7. 최종 링크/QR 코드 생성 후 친구분에게 전달

### 세션 간 정리 (Cursor, ~2026-05-14)
- 작업 진행 상황 사용자 질의로 재확인
- 미리보기: `python3 -m http.server 4173` + 브라우저 `localhost:4173`
- UX: 히어로 영역 카피 vs 지문 원 **가로 간격 축소** (`assets/styles.css` `.hero__grid`)
- 깃허브·협업: 이 PC에서 타인 계정 가입보다 레포 초대(collaborator) 권장 — 별도 대화로 안내함
- **이 세션 종료 시 핸드오프**: 상단 「현재 상태」「다음 세션에서 맨 먼저 할 만한 순서」 참고

### (다음 세션 여기에 추가)

---

## 📝 새 세션 시작 시 체크리스트
1. 이 파일(`memory.md`)부터 읽기 — 특히 「현재 상태」「다음 세션에서 맨 먼저 할 만한 순서」
2. `git status --short`로 로컬 변경·미추적 파일 확인
3. `git log --oneline -5`로 원격과 맞춰야 할 커밋 여부 확인
4. 사용자에게 지난 핸드오프와 맞춰 이어서 할 일 확인
5. 작업 끝나면 이 파일의 「세션 로그」에 오늘 한 일·결정·남은 일 추가
