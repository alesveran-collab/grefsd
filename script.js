(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  var progressEl = document.getElementById('progress');
  var headerEl = document.getElementById('header');
  var menu = document.getElementById('menu');
  var menuBtn = document.getElementById('menuBtn');
  var topBtn = document.getElementById('top');
  var stepsEl = document.getElementById('steps');
  var visualTrack = document.getElementById('visualTrack');

  document.documentElement.classList.add('js-ready');

  /* ── Scroll progress ── */
  if (progressEl) {
    var pCurrent = 0;
    var pTarget = 0;

    function onScrollProgress() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      pTarget = max > 0 ? window.scrollY / max : 0;
    }

    function tickProgress() {
      pCurrent = lerp(pCurrent, pTarget, reduced ? 1 : 0.12);
      progressEl.style.transform = 'scaleX(' + pCurrent + ')';
      requestAnimationFrame(tickProgress);
    }

    window.addEventListener('scroll', onScrollProgress, { passive: true });
    onScrollProgress();
    tickProgress();
  }

  /* ── Header ── */
  var heroEnd = 400;

  function measureHero() {
    var hero = document.getElementById('inicio');
    heroEnd = hero ? hero.offsetHeight * 0.55 : 400;
  }

  function updateHeader() {
    if (!headerEl) return;
    var y = window.scrollY;
    headerEl.classList.toggle('is-solid', y > 24);
    headerEl.classList.toggle('is-hero', y < heroEnd);
  }

  measureHero();
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', measureHero, { passive: true });

  /* ── Parallax ── */
  if (!reduced) {
    var parallaxLayers = document.querySelectorAll('[data-parallax]');
    var scrollY = 0;

    window.addEventListener('scroll', function () {
      scrollY = window.scrollY;
    }, { passive: true });

    function parallaxLoop() {
      for (var i = 0; i < parallaxLayers.length; i++) {
        parallaxLayers[i].style.transform = 'translate3d(0,' + (scrollY * 0.22) + 'px,0)';
      }
      requestAnimationFrame(parallaxLoop);
    }
    if (parallaxLayers.length) parallaxLoop();
  }

  /* ── Reveal ── */
  var animateEls = document.querySelectorAll('[data-animate]:not(.is-in)');

  function revealElement(el, delay) {
    el.style.transitionDelay = (delay || 0) + 'ms';
    el.classList.add('is-in');
  }

  if (reduced) {
    for (var r = 0; r < animateEls.length; r++) animateEls[r].classList.add('is-in');
  } else if ('IntersectionObserver' in window) {
    var revealIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var group = el.parentElement ? el.parentElement.querySelectorAll('[data-animate]:not(.is-in)') : [];
        var idx = 0;
        for (var g = 0; g < group.length; g++) {
          if (group[g] === el) { idx = g; break; }
        }
        revealElement(el, idx * 70);
        revealIo.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    for (var a = 0; a < animateEls.length; a++) {
      var rect = animateEls[a].getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        revealElement(animateEls[a], 0);
      } else {
        revealIo.observe(animateEls[a]);
      }
    }
  } else {
    for (var f = 0; f < animateEls.length; f++) animateEls[f].classList.add('is-in');
  }

  /* ── Counters ── */
  var counters = document.querySelectorAll('[data-count]');

  function runCounter(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(end)) return;
    if (reduced) { el.textContent = end; return; }

    var start = performance.now();
    var duration = 1200;

    function frame(now) {
      var t = clamp((now - start) / duration, 0, 1);
      el.textContent = Math.round(end * easeOutCubic(t));
      if (t < 1) requestAnimationFrame(frame);
    }
    el.textContent = '0';
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var counterIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterIo.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    for (var c = 0; c < counters.length; c++) counterIo.observe(counters[c]);
  } else {
    for (var c2 = 0; c2 < counters.length; c2++) {
      counters[c2].textContent = counters[c2].getAttribute('data-count');
    }
  }

  /* ── Navigation ── */
  var navLinks = document.querySelectorAll('[data-link]');

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      menuBtn.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    for (var n = 0; n < navLinks.length; n++) {
      navLinks[n].addEventListener('click', function () {
        menu.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        menu.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  function syncNav() {
    var y = window.scrollY + 120;
    var current = null;
    var sections = document.querySelectorAll('main section[id]');

    for (var s = 0; s < sections.length; s++) {
      var sec = sections[s];
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
      }
    }

    for (var l = 0; l < navLinks.length; l++) {
      var link = navLinks[l];
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    }
  }

  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  /* ── History steps ── */
  if (stepsEl && !reduced) {
    var stepItems = stepsEl.children;
    var stepIdx = 0;

    for (var st = 0; st < stepItems.length; st++) {
      (function (idx) {
        stepItems[idx].addEventListener('mouseenter', function () {
          for (var j = 0; j < stepItems.length; j++) {
            stepItems[j].classList.toggle('is-active', j === idx);
          }
          stepIdx = idx;
        });
      })(st);
    }

    setInterval(function () {
      stepIdx = (stepIdx + 1) % stepItems.length;
      for (var k = 0; k < stepItems.length; k++) {
        stepItems[k].classList.toggle('is-active', k === stepIdx);
      }
    }, 3200);
  }

  /* ── Gallery loop ── */
  if (visualTrack && !visualTrack.dataset.cloned) {
    visualTrack.innerHTML += visualTrack.innerHTML;
    visualTrack.dataset.cloned = 'true';
  }

  /* ── Back to top ── */
  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.hidden = window.scrollY < 480;
    }, { passive: true });

    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

})();
