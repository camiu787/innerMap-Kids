/**
 * 너바나 — TCI 이벤트 신청서 전용 Apps Script (tci-event.html)
 *
 * 상담 신청(Code.gs)과 완전히 분리된 별도 스프레드시트·별도 웹앱이다.
 *
 * 설치:
 * 1. 새 구글 시트를 만든다 (예: 「너바나 TCI 이벤트 신청」).
 * 2. 그 시트에서 확장 프로그램 → Apps Script 를 열고 이 파일 내용을 붙여넣는다.
 *    (시트에 묶인 스크립트라 SHEET_ID 를 넣을 필요가 없다.)
 * 3. 배포 → 새 배포 → 유형: 웹 앱 / 실행: 나 / 액세스: 모든 사용자.
 * 4. 웹앱 URL 을 assets/tci-event.js 의 APPS_SCRIPT_URL 에 넣는다.
 *
 * 건강정보(민감정보)는 받지 않는다 (2026-11-05). 보장분석용 건강정보는 상담 시 GA 정식 절차로 받는다.
 */
const SHEET_NAME = 'TCI이벤트';
const NOTIFY_EMAIL = 'camiu787@gmail.com';

const HEADER = [
  '제출시각', '신청인', '연락처', '주소', '관계', '자녀이름', '생년월일', '신청이유', '보장분석희망',
  '동의1_검사(필수)', '동의2_법정대리인(필수)', '동의3_보험개인정보', '동의4_개인정보제3자',
  '처리상태',
];

function doGet() {
  // tci-event.html 이 이 응답으로 백엔드 연결 여부를 확인한다. 없으면 폼을 잠근다.
  return json_({ ok: true, tciEvent: true });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('요청 본문이 비어 있습니다.');
    const body = JSON.parse(e.postData.contents);
    if (body.type !== 'tci-event') throw new Error('지원하지 않는 요청입니다.');

    const str = (v, max) => String(v || '').trim().slice(0, max || 500);
    const phone = String(body.phone || '').replace(/[^0-9]/g, '');

    if (!str(body.name)) throw new Error('성함이 필요합니다.');
    if (phone.length < 9 || phone.length > 11) throw new Error('연락처 형식이 올바르지 않습니다.');
    if (!str(body.childName)) throw new Error('자녀 이름이 필요합니다.');
    if (!str(body.childBirth)) throw new Error('생년월일이 필요합니다.');
    if (!str(body.reason)) throw new Error('신청 이유가 필요합니다.');
    if (body.c1 !== '동의' || body.c2 !== '동의') throw new Error('필수 동의가 필요합니다.');

    getSheet_().appendRow([
      new Date(), str(body.name, 100), phone, str(body.address, 300), str(body.relation, 30),
      str(body.childName, 100), str(body.childBirth, 20), str(body.reason, 3000), str(body.insurance, 10),
      str(body.c1, 10), str(body.c2, 10), str(body.c3, 10), str(body.c4, 10),
      '',
    ]);

    notify_({
      name: str(body.name, 100), phone: phone, insurance: str(body.insurance, 10),
      c3: str(body.c3, 10), c4: str(body.c4, 10),
    });
    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    return sheet;
  }
  const current = sheet.getRange(1, 1, 1, HEADER.length).getValues()[0];
  const same = HEADER.every((label, i) => String(current[i] || '') === label);
  if (!same) sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
  return sheet;
}

/** 알림 메일에는 자녀 정보·신청 사유를 넣지 않는다. 상세는 시트에서 확인한다. */
function notify_(info) {
  if (!NOTIFY_EMAIL) return;
  const subject = `[TCI 이벤트] ${info.name}님 신청 — 보장분석 ${info.insurance}`;
  const textBody = [
    'TCI 이벤트 신청서가 접수되었습니다. 상세 내용은 TCI 이벤트 전용 구글 시트에서 확인하세요.',
    '',
    `신청인: ${info.name}`,
    `연락처: ${info.phone}`,
    `보장분석 희망: ${info.insurance}`,
    `보험 점검용 개인정보 동의: ${info.c3} / 제3자(위드지사) 제공 동의: ${info.c4}`,
    '',
    '※ 위드지사 제공은 제3자 제공 동의가 「동의」인 경우에만 가능합니다.',
  ].join('\n');
  MailApp.sendEmail(NOTIFY_EMAIL, subject, textBody);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
