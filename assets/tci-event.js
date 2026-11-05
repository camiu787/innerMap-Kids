/* 너바나 — TCI 기질·성격검사 이벤트 신청서 (tci-event.html)
   - 보험 보장분석 "예" 선택 시에만 건강정보 문항을 연다.
   - 건강정보(민감정보)는 4번 동의(민감정보 수집·이용)가 '동의'일 때만 전송한다.
     서버(Code.gs handleTciEvent_)도 같은 조건으로 한 번 더 걸러낸다.
   - 백엔드가 이 기능을 지원하지 않는 구버전이면 폼을 잠근다 (조용한 유실 방지). */

(function () {
  const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbz3Xq6_4T2K3-VCw3RcKTv5utSktrjR7thWBxoR0MdTSwNaI0qmTogInhEpCOygsGrPnw/exec';

  const form = document.getElementById('tciEventForm');
  const alertBox = document.getElementById('tciEventAlert');
  const done = document.getElementById('tciEventDone');
  const healthBlock = document.getElementById('healthBlock');
  if (!form) return;

  const HEALTH_CHECKS = ['h_recent', 'h_major', 'h_meds', 'h_checkup'];
  const HEALTH_TEXTS = ['h_recentDetail', 'h_surgeryDetail', 'h_majorDetail', 'h_medsDetail', 'h_checkupDetail'];

  /* ---------- 백엔드 버전 확인 ---------- */
  function lockForm(message) {
    form.querySelectorAll('input, textarea, button').forEach((el) => { el.disabled = true; });
    const notice = document.createElement('p');
    notice.className = 'form-notice';
    notice.textContent = message;
    form.prepend(notice);
  }

  fetch(APPS_SCRIPT_URL + '?type=tci-event', { method: 'GET' })
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.tciEvent !== true) {
        lockForm('신청서 접수를 준비하고 있습니다. 준비가 끝나면 바로 열립니다. 급하신 문의는 010-9542-2406 으로 연락 주세요.');
      }
    })
    .catch(() => { /* 네트워크 오류는 제출 시점에 다시 드러난다 */ });

  /* ---------- 보장분석 선택 → 건강정보 문항 토글 ---------- */
  function syncHealth() {
    const yes = form.elements.insurance.value === '예';
    healthBlock.hidden = !yes;
  }
  form.querySelectorAll('input[name="insurance"]').forEach((r) => r.addEventListener('change', syncHealth));

  /* ---------- "해당 사항 없음"은 다른 항목과 배타 ---------- */
  form.querySelectorAll('[data-none-group]').forEach((group) => {
    const none = group.querySelector('[data-none]');
    const others = Array.prototype.filter.call(group.querySelectorAll('input'), (i) => i !== none);
    none.addEventListener('change', () => { if (none.checked) others.forEach((o) => { o.checked = false; }); });
    others.forEach((o) => o.addEventListener('change', () => { if (o.checked) none.checked = false; }));
  });

  /* ---------- 검증 ---------- */
  function setAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = 'form-alert is-visible is-' + (type || 'error');
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setError(el, message) {
    const wrap = el.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('is-invalid', Boolean(message));
    const err = wrap.querySelector('.field-error');
    if (err) err.textContent = message || '';
  }

  function clearErrors() {
    form.querySelectorAll('.field').forEach((f) => f.classList.remove('is-invalid'));
    form.querySelectorAll('.field-error').forEach((e) => { e.textContent = ''; });
    alertBox.textContent = '';
    alertBox.className = 'form-alert';
  }

  function hasHealthInput() {
    if (form.elements.h_surgery.value) return true;
    if (HEALTH_CHECKS.some((n) => form.querySelectorAll('input[name="' + n + '"]:checked').length)) return true;
    return HEALTH_TEXTS.some((n) => form.elements[n].value.trim());
  }

  function collect() {
    clearErrors();
    const el = form.elements;
    let first = null;
    const fail = (node, msg) => { setError(node, msg); first = first || node; };

    const phone = el.phone.value.replace(/[^0-9]/g, '');
    if (!el.name.value.trim()) fail(el.name, '성함을 입력해 주세요.');
    if (!phone) fail(el.phone, '연락처를 입력해 주세요.');
    else if (phone.length < 9 || phone.length > 11) fail(el.phone, '전화번호를 정확히 입력해 주세요.');
    if (!el.relation.value) fail(form.querySelector('input[name="relation"]'), '관계를 선택해 주세요.');
    if (!el.childName.value.trim()) fail(el.childName, '자녀의 이름을 입력해 주세요.');
    if (!el.childBirth.value) fail(el.childBirth, '생년월일을 입력해 주세요.');
    if (!el.reason.value.trim()) fail(el.reason, '신청 이유를 작성해 주세요.');
    if (!el.insurance.value) fail(form.querySelector('input[name="insurance"]'), '보장분석 상담 희망 여부를 선택해 주세요.');
    if (el.c1.value !== '동의') fail(form.querySelector('input[name="c1"]'), '검사 진행을 위해 필수 동의가 필요합니다.');
    if (el.c2.value !== '동의') fail(form.querySelector('input[name="c2"]'), '자녀 검사 진행을 위해 법정대리인 동의가 필요합니다.');

    const insuranceYes = el.insurance.value === '예';
    const sensitiveOk = el.c4.value === '동의';
    if (insuranceYes && hasHealthInput() && !sensitiveOk) {
      fail(form.querySelector('input[name="c4"]'),
        '건강정보를 보내시려면 4번 민감정보 수집·이용에 동의해 주세요. 동의하지 않으시려면 03의 건강정보 칸을 비워 주세요.');
    }

    if (first) {
      first.focus({ preventScroll: false });
      return null;
    }

    const payload = {
      type: 'tci-event',
      name: el.name.value.trim(),
      phone: phone,
      address: el.address.value.trim(),
      relation: el.relation.value,
      childName: el.childName.value.trim(),
      childBirth: el.childBirth.value,
      reason: el.reason.value.trim(),
      insurance: el.insurance.value,
      c1: el.c1.value, c2: el.c2.value,
      c3: el.c3.value || '미선택', c4: el.c4.value || '미선택',
      c5: el.c5.value || '미선택', c6: el.c6.value || '미선택',
      submittedAt: new Date().toISOString(),
    };

    // 민감정보: 보장분석 '예' + 4번 동의일 때만 담는다
    if (insuranceYes && sensitiveOk) {
      HEALTH_CHECKS.forEach((n) => {
        payload[n] = Array.prototype.map.call(form.querySelectorAll('input[name="' + n + '"]:checked'), (i) => i.value).join(', ');
      });
      payload.h_surgery = el.h_surgery.value;
      HEALTH_TEXTS.forEach((n) => { payload[n] = el[n].value.trim(); });
    }
    return payload;
  }

  /* ---------- 전송 ---------- */
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = collect();
    if (!payload) return;

    const button = form.querySelector('button[type="submit"]');
    const label = button.querySelector('span');
    const original = label.textContent;
    button.disabled = true;
    label.textContent = '신청서를 보내는 중...';

    try {
      // Apps Script 웹앱은 CORS 헤더가 없어 no-cors 로 보낸다 (응답은 불투명 — 전송 성공으로 간주)
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      form.reset();
      form.hidden = true;
      done.hidden = false;
      done.focus();
      done.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error(error);
      setAlert('전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요. 입력하신 내용은 그대로 남아 있습니다.', 'error');
    } finally {
      button.disabled = false;
      label.textContent = original;
    }
  });
})();
