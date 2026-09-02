const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3Xq6_4T2K3-VCw3RcKTv5utSktrjR7thWBxoR0MdTSwNaI0qmTogInhEpCOygsGrPnw/exec';

const form = document.querySelector('#leadForm');
const alertBox = document.querySelector('#formAlert');
const privacyDialogs = {
  1: document.querySelector('#privacyDialog1'),
  2: document.querySelector('#privacyDialog2'),
  3: document.querySelector('#privacyDialog3'),
};

function normalizePhone(value) {
  return value.replace(/[^0-9]/g, '');
}

function setAlert(message, type = 'error') {
  alertBox.textContent = message;
  alertBox.className = `form-alert is-visible is-${type}`;
  alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearAlert() {
  alertBox.textContent = '';
  alertBox.className = 'form-alert';
}

function setFieldError(field, message) {
  const wrapper = field.closest('.field');
  const error = wrapper?.querySelector('.field-error');
  if (wrapper) wrapper.classList.toggle('is-invalid', Boolean(message));
  if (error) error.textContent = message || '';
}

function clearErrors() {
  form.querySelectorAll('.field').forEach((field) => field.classList.remove('is-invalid'));
  form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
  const privacyError = document.querySelector('#privacyError');
  if (privacyError) privacyError.textContent = '';
  const testsError = document.querySelector('#testsError');
  if (testsError) testsError.textContent = '';
}

function validate(formData) {
  clearErrors();
  const fields = Object.fromEntries(formData.entries());
  let firstInvalid = null;

  const nameInput = form.elements.name;
  const phoneInput = form.elements.phone;
  const privacy1 = form.elements.privacy1;
  const privacy2 = form.elements.privacy2;
  const phoneDigits = normalizePhone(fields.phone || '');

  if (!fields.name?.trim()) {
    setFieldError(nameInput, '학부모 이름을 입력해 주세요.');
    firstInvalid ||= nameInput;
  }

  if (!phoneDigits) {
    setFieldError(phoneInput, '연락처를 입력해 주세요.');
    firstInvalid ||= phoneInput;
  } else if (phoneDigits.length < 9 || phoneDigits.length > 11) {
    setFieldError(phoneInput, '전화번호를 정확히 입력해 주세요.');
    firstInvalid ||= phoneInput;
  }

  const tests = formData.getAll('tests');
  if (!tests.length) {
    const testsError = document.querySelector('#testsError');
    if (testsError) testsError.textContent = '관심 있는 검사를 하나 이상 선택해 주세요.';
    firstInvalid ||= form.querySelector('input[name="tests"]');
  }

  if (!privacy1.checked || !privacy2.checked) {
    document.querySelector('#privacyError').textContent = '필수 개인정보 항목에 모두 동의해 주세요.';
    firstInvalid ||= privacy1;
  }

  if (firstInvalid) {
    firstInvalid.focus({ preventScroll: false });
    return null;
  }

  return {
    name: fields.name.trim(),
    phone: phoneDigits,
    region: fields.region?.trim() || '',
    kidsCount: fields.kidsCount || '',
    kidsAge: fields.kidsAge?.trim() || '',
    tests: tests.join(', '),
    privacy: true,
    marketing: form.elements.privacy3?.checked || false,
    submittedAt: new Date().toISOString(),
  };
}

async function submitLead(payload) {
  const isConfigured = APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT');

  if (!isConfigured) {
    console.info('[demo mode] Apps Script URL is not configured. Payload:', payload);
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { demo: true };
  }

  // Google Apps Script web apps often do not expose CORS headers.
  // no-cors keeps the static landing page deployable; the opaque response is treated as accepted.
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });

  return { ok: true };
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearAlert();

  const payload = validate(new FormData(form));
  if (!payload) return;

  const button = form.querySelector('button[type="submit"]');
  const label = button.querySelector('span');
  const originalText = label.textContent;
  button.disabled = true;
  label.textContent = '신청을 보내는 중...';

  try {
    const result = await submitLead(payload);
    form.reset();
    setAlert(result.demo
      ? '데모 모드입니다. Apps Script URL을 설정하면 실제 신청이 전송됩니다.'
      : '신청이 완료되었습니다. 24시간 안에 상담 안내 연락을 드릴게요.', 'success');
  } catch (error) {
    console.error(error);
    setAlert('전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요. 입력값은 유지됩니다.', 'error');
  } finally {
    button.disabled = false;
    label.textContent = originalText;
  }
});

document.querySelectorAll('[data-scroll-to-form]').forEach((link) => {
  link.addEventListener('click', () => {
    setTimeout(() => form?.elements.name?.focus({ preventScroll: true }), 550);
  });
});

document.querySelectorAll('[data-open-privacy]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.openPrivacy;
    const dialog = privacyDialogs[id];
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  });
});

document.querySelectorAll('[data-close-privacy]').forEach((btn) => {
  btn.addEventListener('click', () => {
    Object.values(privacyDialogs).forEach((d) => d?.close());
  });
});

Object.values(privacyDialogs).forEach((dialog) => {
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
});
