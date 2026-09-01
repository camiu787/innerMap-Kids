/* 너바나 — 페이지 인터랙션 (히어로 워크스루, 내비, 스크롤 등장)
   폼 제출 로직은 assets/script.js 에 있다. 이 파일은 시각 동작만 담당한다. */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hero = document.querySelector('.hero');
  var heroImg = document.getElementById('heroImg');
  var heroCopy = document.getElementById('heroCopy');
  var stepsBox = document.getElementById('heroSteps');
  var cue = document.getElementById('cue');
  var nav = document.getElementById('nav');
  var steps = stepsBox ? stepsBox.children : [];

  /* ---- 히어로 워크스루 ----
     줌 범위는 CSS 변수(--zoom-from / --zoom-travel)에서 읽는다.
     모바일은 스타일시트가 더 작은 값을 주기 때문에 사진이 과도하게 확대되지 않는다. */
  var zoomFrom = 1.75;
  var zoomTravel = 0.72;

  function readZoom() {
    if (!heroImg) return;
    var cs = getComputedStyle(heroImg);
    var f = parseFloat(cs.getPropertyValue('--zoom-from'));
    var t = parseFloat(cs.getPropertyValue('--zoom-travel'));
    if (!isNaN(f)) zoomFrom = f;
    if (!isNaN(t)) zoomTravel = t;
  }
  readZoom();

  function onScroll() {
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    var total = hero.offsetHeight - window.innerHeight;
    var p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;

    heroImg.style.transform =
      'scale(' + (zoomFrom - p * zoomTravel).toFixed(3) + ') translateY(' + (p * -2.2).toFixed(2) + '%)';

    var s = p < 0.16 ? 1 : p < 0.36 ? 2 : p < 0.58 ? 3 : 4;
    heroCopy.className = 'hero__copy s' + s;
    for (var i = 0; i < steps.length; i++) steps[i].className = i < s ? 'on' : '';
    if (cue) cue.style.opacity = p > 0.06 ? 0 : 1;

    nav.classList.toggle('solid', window.scrollY > window.innerHeight * 0.9);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    readZoom();
    onScroll();
  });
  onScroll();

  /* ---- 모바일 메뉴 ---- */
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    navLinks.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', '메뉴 열기');
    });
  }

  /* ---- 스크롤 등장 ---- */
  var revealables = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px' }
    );
    Array.prototype.forEach.call(revealables, function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('in');
    });
  }

  /* ---- 현재 섹션 표시 ---- */
  var links = document.querySelectorAll('.nav__links a');
  var secs = [];
  Array.prototype.forEach.call(links, function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) secs.push({ a: a, el: el });
  });
  window.addEventListener(
    'scroll',
    function () {
      var y = window.scrollY + 140;
      var cur = null;
      secs.forEach(function (s) {
        if (s.el.offsetTop <= y) cur = s.a;
      });
      Array.prototype.forEach.call(links, function (a) {
        a.classList.toggle('active', a === cur);
      });
    },
    { passive: true }
  );

  /* ---- 앵커 이동 시 고정 헤더 보정 ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a || a.getAttribute('href') === '#') return;
    var t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({
      top: t.getBoundingClientRect().top + window.scrollY - 70,
      behavior: reduce ? 'auto' : 'smooth'
    });
  });
})();
