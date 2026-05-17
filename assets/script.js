const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

const form = document.querySelector('#leadForm');
const alertBox = document.querySelector('#formAlert');
const privacyDialog = document.querySelector('#privacyDialog');

function normalizePhone(value) {
  return value.replace(/[^0-9]/g, '');
}

function setAlert(message, type = 'error') {
  alertBox.textContent = message;
  alertBox.className = `form-alert is-visible is-${type}`;
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
  document.querySelector('#privacyError').textContent = '';
}

function validate(formData) {
  clearErrors();
  const fields = Object.fromEntries(formData.entries());
  let firstInvalid = null;

  const nameInput = form.elements.name;
  const phoneInput = form.elements.phone;
  const privacyInput = form.elements.privacy;
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

  if (!privacyInput.checked) {
    document.querySelector('#privacyError').textContent = '개인정보 수집 및 이용에 동의해 주세요.';
    firstInvalid ||= privacyInput;
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
    privacy: true,
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

document.querySelector('[data-open-privacy]')?.addEventListener('click', () => {
  if (typeof privacyDialog.showModal === 'function') privacyDialog.showModal();
  else alert('상담 신청을 위해 입력하신 정보는 상담 안내 목적으로만 사용됩니다.');
});

document.querySelectorAll('[data-close-privacy]').forEach((button) => {
  button.addEventListener('click', () => privacyDialog.close());
});

privacyDialog?.addEventListener('click', (event) => {
  if (event.target === privacyDialog) privacyDialog.close();
});
