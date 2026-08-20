(function () {
  'use strict';

  var docEl = document.documentElement;

  /* ---------- Theme toggle ---------- */
  function applyThemeIcons() {
    var dark = docEl.classList.contains('dark');
    document.querySelectorAll('#icon-sun, .icon-theme-sun').forEach(function (el) {
      el.classList.toggle('hidden', dark);
    });
    document.querySelectorAll('#icon-moon, .icon-theme-moon').forEach(function (el) {
      el.classList.toggle('hidden', !dark);
    });
  }

  function toggleTheme() {
    var dark = docEl.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    applyThemeIcons();
  }

  ['theme-toggle', 'theme-toggle-mobile'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', toggleTheme);
  });
  applyThemeIcons();

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('hidden');
      menuToggle.setAttribute('aria-expanded', String(!open));
      if (iconMenu) iconMenu.classList.toggle('hidden', !open);
      if (iconClose) iconClose.classList.toggle('hidden', open);
    });
  }

  /* ---------- Reading progress bar ---------- */
  var progress = document.getElementById('progress-bar');
  if (progress) {
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        progress.style.width = pct + '%';
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- TOC scroll-spy ---------- */
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length) {
    var headings = Array.prototype.slice.call(document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3'));
    function spy() {
      var pos = window.scrollY + window.innerHeight * 0.25;
      var current = null;
      headings.forEach(function (h) {
        if (h.offsetTop <= pos) current = h;
      });
      tocLinks.forEach(function (a) {
        a.classList.remove('toc-active');
        if (current && a.getAttribute('href') === '#' + current.id) {
          a.classList.add('toc-active');
        }
      });
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  /* ---------- Copy link ---------- */
  var copyBtn = document.getElementById('copy-link');
  var copyLabel = document.getElementById('copy-label');
  if (copyBtn) {
    var originalLabel = copyLabel ? copyLabel.textContent : '';
    var copyTimeout = null;
    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-url') || window.location.href;
      var done = function () {
        if (copyLabel) copyLabel.textContent = '已复制！';
        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(function () {
          if (copyLabel) copyLabel.textContent = originalLabel;
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      }
    });
  }
})();