/**
 * Google Apps Script backend for the fingerprint aptitude landing page.
 *
 * Setup:
 * 1. Create a Google Sheet and copy its ID.
 * 2. Set SHEET_ID and NOTIFY_EMAIL below.
 * 3. Deploy as Web app: Execute as "Me", Who has access "Anyone".
 * 4. Copy the Web app URL into assets/script.js -> APPS_SCRIPT_URL.
 */
const SHEET_ID = '1ElDCHvONz6QgbRMGxVD5Kr0MnDPS1tR2lMcNviuayMY';
const SHEET_NAME = '신청내역';
const NOTIFY_EMAIL = 'camiu787@gmail.com';

function doPost(e) {
  try {
    const body = parseBody_(e);
    validate_(body);

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      body.name || '',
      body.phone || '',
      body.region || '',
      body.kidsCount || '',
      body.kidsAge || '',
      body.tests || '',
      '',
    ]);

    sendNotification_(body);
    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'fingerprint-aptitude-leads' });
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('요청 본문이 비어 있습니다.');
  }
  return JSON.parse(e.postData.contents);
}

function validate_(body) {
  if (!body.name || !String(body.name).trim()) throw new Error('이름이 필요합니다.');
  const phone = String(body.phone || '').replace(/[^0-9]/g, '');
  if (phone.length < 9 || phone.length > 11) throw new Error('연락처 형식이 올바르지 않습니다.');
  if (!body.privacy) throw new Error('개인정보 동의가 필요합니다.');
  body.phone = phone;
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  ensureHeader_(sheet);
  return sheet;
}

const HEADER = ['제출시각', '이름', '전화', '지역', '자녀수', '자녀나이', '관심검사', '처리상태'];

/** 헤더가 없거나 예전 형식이면 1행만 갱신한다. 기존 데이터 행은 건드리지 않는다. */
function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    return;
  }
  const current = sheet.getRange(1, 1, 1, HEADER.length).getValues()[0];
  const same = HEADER.every((label, i) => String(current[i] || '') === label);
  if (!same) {
    sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
  }
}

function sendNotification_(body) {
  if (!NOTIFY_EMAIL || NOTIFY_EMAIL === 'friend@example.com') return;

  const subject = `[새 신청] ${body.name}님 지문 적성검사 상담`;
  const textBody = [
    '새 상담 신청이 접수되었습니다.',
    '',
    `이름: ${body.name || ''}`,
    `연락처: ${body.phone || ''}`,
    `거주 지역: ${body.region || ''}`,
    `자녀 수: ${body.kidsCount || ''}`,
    `자녀 나이: ${body.kidsAge || ''}`,
    `관심 검사: ${body.tests || ''}`,
    `제출 시각: ${body.submittedAt || new Date().toISOString()}`,
  ].join('\n');

  MailApp.sendEmail(NOTIFY_EMAIL, subject, textBody);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
