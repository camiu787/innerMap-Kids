/* 너바나 — 후기 페이지
   - 승인된 후기를 Apps Script(doGet)에서 불러와 렌더링
   - 후기 작성 폼을 Apps Script(doPost, type=review)로 전송
   승인 전 후기는 게시되지 않는다 (Apps Script 쪽에서 승인='Y' 인 행만 반환). */

(function () {
  const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbz3Xq6_4T2K3-VCw3RcKTv5utSktrjR7thWBxoR0MdTSwNaI0qmTogInhEpCOygsGrPnw/exec';

  const list = document.getElementById('reviewList');
  const form = document.getElementById('reviewForm');
  const alertBox = document.getElementById('reviewAlert');
  const starsBox = document.getElementById('starsInput');
  const ratingValue = document.getElementById('ratingValue');

  /* ---------------- 별점 입력 ---------------- */
  if (starsBox) {
    const buttons = Array.prototype.slice.call(starsBox.querySelectorAll('button'));
    const paint = (score) => {
      buttons.forEach((b, i) => b.classList.toggle('on', i < score));
    };
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const score = Number(btn.dataset.score);
        ratingValue.value = String(score);
        starsBox.dataset.score = String(score);
        paint(score);
        const err = document.getElementById('ratingError');
        if (err) err.textContent = '';
      });
      btn.addEventListener('mouseenter', () => paint(Number(btn.dataset.score)));
    });
    starsBox.addEventListener('mouseleave', () => paint(Number(ratingValue.value || 0)));
  }

  /* ---------------- 후기 목록 ---------------- */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  function stars(score) {
    const n = Math.max(0, Math.min(5, Number(score) || 0));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function renderReviews(items) {
    if (!items.length) {
      list.innerHTML =
        '<p class="reviews__state">아직 등록된 후기가 없습니다. 첫 후기를 남겨주세요.</p>';
      return;
    }
    list.innerHTML = items
      .map((r) => {
        const tests = r.tests ? `<span class="review__tag">${escapeHtml(r.tests)}</span>` : '';
        return `<article class="review review--real">
          <p class="stars" aria-label="만족도 ${escapeHtml(r.rating)}점">${stars(r.rating)}</p>
          <p>${escapeHtml(r.content).replace(/\n/g, '<br />')}</p>
          <p class="who"><i></i>${escapeHtml(r.nickname)}${tests}</p>
        </article>`;
      })
      .join('');
  }

  /* 백엔드(Apps Script)가 후기 기능을 지원하는 버전인지 먼저 확인한다.
     구버전이면 폼을 잠근다 — 열어두면 방문자가 쓴 후기가 저장되지 않는데
     성공 메시지만 보이는 상태가 된다. 재배포하면 자동으로 다시 열린다. */
  function lockForm(message) {
    if (!form) return;
    form.querySelectorAll('input, textarea, button').forEach((el) => { el.disabled = true; });
    const notice = document.createElement('p');
    notice.className = 'form-notice';
    notice.textContent = message;
    form.prepend(notice);
  }

  function loadReviews() {
    if (!list) return;
    fetch(APPS_SCRIPT_URL + '?type=reviews', { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !Array.isArray(data.reviews)) {
          // 후기 기능이 아직 배포되지 않은 상태
          list.innerHTML =
            '<p class="reviews__state">후기 기능을 준비하고 있습니다. 곧 열립니다.</p>';
          lockForm('후기 작성 기능을 준비하고 있습니다. 준비가 끝나면 바로 열립니다. 급하신 문의는 010-9542-2406 으로 연락 주세요.');
          return;
        }
        renderReviews(data.reviews);
      })
      .catch(() => {
        list.innerHTML =
          '<p class="reviews__state">후기를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>';
      });
  }
  loadReviews();

  /* ---------------- 폼 전송 ---------------- */
  function setAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = 'form-alert is-visible is-' + type;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setFieldError(input, message) {
    const wrapper = input.closest('.field');
    const error = wrapper ? wrapper.querySelector('.field-error') : null;
    if (wrapper) wrapper.classList.toggle('is-invalid', Boolean(message));
    if (error) error.textContent = message || '';
  }

  function clearErrors() {
    form.querySelectorAll('.field').forEach((f) => f.classList.remove('is-invalid'));
    form.querySelectorAll('.field-error').forEach((e) => { e.textContent = ''; });
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    alertBox.className = 'form-alert';

    const data = new FormData(form);
    const nickname = String(data.get('nickname') || '').trim();
    const phone = String(data.get('phone') || '').replace(/[^0-9]/g, '');
    const content = String(data.get('content') || '').trim();
    const tests = data.getAll('tests');
    const rating = Number(data.get('rating') || 0);
    let firstInvalid = null;

    if (!nickname) {
      setFieldError(form.elements.nickname, '표시할 이름을 입력해 주세요.');
      firstInvalid = firstInvalid || form.elements.nickname;
    }
    if (phone.length < 9 || phone.length > 11) {
      setFieldError(form.elements.phone, '연락처를 정확히 입력해 주세요.');
      firstInvalid = firstInvalid || form.elements.phone;
    }
    if (!tests.length) {
      document.getElementById('testsError').textContent = '받으신 검사를 선택해 주세요.';
      firstInvalid = firstInvalid || form.querySelector('input[name="tests"]');
    }
    if (!rating) {
      document.getElementById('ratingError').textContent = '만족도를 선택해 주세요.';
      firstInvalid = firstInvalid || starsBox.querySelector('button');
    }
    if (content.length < 10) {
      setFieldError(form.elements.content, '후기를 10자 이상 적어주세요.');
      firstInvalid = firstInvalid || form.elements.content;
    }
    if (!form.elements.agree.checked) {
      document.getElementById('agreeError').textContent = '개인정보 수집·이용에 동의해 주세요.';
      firstInvalid = firstInvalid || form.elements.agree;
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const label = button.querySelector('span');
    const originalText = label.textContent;
    button.disabled = true;
    label.textContent = '등록 중...';

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          type: 'review',
          nickname,
          phone,
          tests: tests.join(', '),
          rating,
          content,
          submittedAt: new Date().toISOString()
        })
      });
      form.reset();
      if (starsBox) {
        ratingValue.value = '';
        starsBox.querySelectorAll('button').forEach((b) => b.classList.remove('on'));
      }
      setAlert('후기를 보내주셔서 감사합니다. 확인 후 이 페이지에 게시됩니다.', 'success');
    } catch (error) {
      console.error(error);
      setAlert('전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요. 입력한 내용은 그대로 남아 있습니다.', 'error');
    } finally {
      button.disabled = false;
      label.textContent = originalText;
    }
  });

  /* ---------------- 약관 모달 ---------------- */
  const dialog = document.getElementById('privacyDialog1');
  document.querySelectorAll('[data-open-privacy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  document.querySelectorAll('[data-close-privacy]').forEach((btn) => {
    btn.addEventListener('click', () => dialog?.close());
  });
  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
})();
