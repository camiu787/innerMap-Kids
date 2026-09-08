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
const REVIEW_SHEET_NAME = '후기';
const NOTIFY_EMAIL = 'camiu787@gmail.com';

function doPost(e) {
  try {
    const body = parseBody_(e);

    // 후기 등록은 별도 시트로 분리한다. 승인('Y') 전에는 사이트에 노출되지 않는다.
    if (body.type === 'review') {
      return handleReview_(body);
    }

    validate_(body);

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      body.name || '',
      body.phone || '',
      body.region || '',
      body.kidsCount || '',   // 2026-09-08 폼에서 제거 — 기존 행 열 정렬 유지를 위해 자리만 남김
      body.kidsAge || '',     // 동일
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

function doGet(e) {
  const type = e && e.parameter ? e.parameter.type : '';
  if (type === 'reviews') {
    return json_({ ok: true, reviews: listApprovedReviews_() });
  }
  return json_({ ok: true, service: 'neobana-leads' });
}

/* ==================== 후기 ==================== */

const REVIEW_HEADER = ['제출시각', '표시이름', '연락처', '받은검사', '만족도', '내용', '승인(Y/N)'];

function handleReview_(body) {
  const nickname = String(body.nickname || '').trim();
  const phone = String(body.phone || '').replace(/[^0-9]/g, '');
  const content = String(body.content || '').trim();
  const rating = Number(body.rating || 0);

  if (!nickname) throw new Error('표시할 이름이 필요합니다.');
  if (phone.length < 9 || phone.length > 11) throw new Error('연락처 형식이 올바르지 않습니다.');
  if (content.length < 10) throw new Error('후기 내용이 너무 짧습니다.');
  if (!(rating >= 1 && rating <= 5)) throw new Error('만족도가 올바르지 않습니다.');

  const sheet = getReviewSheet_();
  sheet.appendRow([
    new Date(),
    nickname,
    phone,
    String(body.tests || ''),
    rating,
    content.slice(0, 1000),
    'N',
  ]);

  notifyReview_({ nickname: nickname, phone: phone, tests: body.tests, rating: rating, content: content });
  return json_({ ok: true });
}

function getReviewSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(REVIEW_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(REVIEW_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(REVIEW_HEADER);
    return sheet;
  }
  const current = sheet.getRange(1, 1, 1, REVIEW_HEADER.length).getValues()[0];
  const same = REVIEW_HEADER.every((label, i) => String(current[i] || '') === label);
  if (!same) sheet.getRange(1, 1, 1, REVIEW_HEADER.length).setValues([REVIEW_HEADER]);
  return sheet;
}

/** 승인 열이 'Y' 인 후기만 최신순으로 반환한다. 연락처는 절대 내보내지 않는다. */
function listApprovedReviews_() {
  const sheet = getReviewSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return [];

  const rows = sheet.getRange(2, 1, last - 1, REVIEW_HEADER.length).getValues();
  return rows
    .filter((row) => String(row[6] || '').trim().toUpperCase() === 'Y')
    .map((row) => ({
      date: row[0] ? Utilities.formatDate(new Date(row[0]), 'Asia/Seoul', 'yyyy-MM-dd') : '',
      nickname: String(row[1] || ''),
      tests: String(row[3] || ''),
      rating: Number(row[4] || 0),
      content: String(row[5] || ''),
    }))
    .reverse()
    .slice(0, 30);
}

function notifyReview_(review) {
  if (!NOTIFY_EMAIL) return;
  const subject = `[새 후기] ${review.nickname}님 (${review.rating}점) — 승인 대기`;
  const textBody = [
    '새 후기가 등록되었습니다. 시트의 승인 열을 Y 로 바꾸면 사이트에 게시됩니다.',
    '',
    `표시 이름: ${review.nickname}`,
    `연락처: ${review.phone}`,
    `받은 검사: ${review.tests || ''}`,
    `만족도: ${review.rating}점`,
    '',
    review.content,
  ].join('\n');
  MailApp.sendEmail(NOTIFY_EMAIL, subject, textBody);
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
