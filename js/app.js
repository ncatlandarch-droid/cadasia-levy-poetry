/* ============================================
   CADASIA LEVY — MAIN APPLICATION
   Orchestrates all modules
   ============================================ */

(function () {
  'use strict';

  var I18n = window.LevyI18n;
  var Poems = window.LevyPoems;
  var Animations = window.LevyAnimations;
  var Merch = window.LevyMerch;

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initApp();
  });

  function initApp() {
    renderPoemCards();
    Merch.render('merch-grid');
    I18n.updatePage();
    initLanguageSwitcher();
    initMobileNav();
    initSmoothScroll();
    initPoemModal();

    Animations.initNavScroll();
    Animations.initParticles(document.getElementById('hero-canvas'));
    Animations.animateHeroEntrance();

    // Start typewriter after a brief delay
    var quoteEl = document.getElementById('hero-quote');
    if (quoteEl) {
      var quoteText = I18n.t('hero.quote');
      Animations.typeWriter(quoteEl, quoteText, 45);
    }

    // Delay scroll reveal init slightly so DOM is settled
    setTimeout(function () {
      Animations.initScrollReveal();
    }, 200);
  }

  /* ---------- Render Poem Cards ---------- */
  function renderPoemCards() {
    var grid = document.getElementById('poetry-grid');
    if (!grid) return;

    var html = '';
    Poems.forEach(function (poem, index) {
      var num = (index + 1).toString().padStart(2, '0');
      html += '<div class="poem-card reveal" data-poem-id="' + poem.id + '" id="poem-card-' + poem.id + '">';
      html += '  <span class="poem-card-number">' + num + '</span>';
      html += '  <h3 class="poem-card-title">' + poem.title + '</h3>';
      html += '  <p class="poem-card-preview">' + poem.preview + '</p>';
      html += '  <div class="poem-card-footer">';
      html += '    <span class="poem-card-date">' + poem.date + '</span>';
      html += '    <span class="poem-card-read" data-i18n="poetry.readMore">' + I18n.t('poetry.readMore') + '</span>';
      html += '  </div>';
      html += '</div>';
    });

    grid.innerHTML = html;
  }

  /* ---------- Poem Modal ---------- */
  function initPoemModal() {
    var overlay = document.getElementById('poem-modal-overlay');
    var modalTitle = document.getElementById('poem-modal-title');
    var modalDate = document.getElementById('poem-modal-date');
    var modalBody = document.getElementById('poem-modal-body');
    var closeBtn = document.getElementById('poem-modal-close');

    if (!overlay) return;

    // Open poem on card click
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.poem-card');
      if (!card) return;

      var poemId = card.dataset.poemId;
      var poem = Poems.find(function (p) { return p.id === poemId; });
      if (!poem) return;

      openPoemModal(poem);
    });

    // Close modal
    closeBtn.addEventListener('click', closePoemModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePoemModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePoemModal();
    });

    function openPoemModal(poem) {
      modalTitle.textContent = poem.title;
      modalDate.textContent = poem.date;

      // Build lines
      var linesHtml = '';
      poem.lines.forEach(function (line) {
        if (line === '') {
          linesHtml += '<div class="poem-modal-line empty"></div>';
        } else {
          linesHtml += '<div class="poem-modal-line">' + line + '</div>';
        }
      });
      modalBody.innerHTML = linesHtml;

      // Show modal
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Animate lines
      setTimeout(function () {
        Animations.revealPoemLines(modalBody, 100);
      }, 300);
    }

    function closePoemModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ---------- Language Switcher ---------- */
  function initLanguageSwitcher() {
    var btn = document.getElementById('lang-btn');
    var dropdown = document.getElementById('lang-dropdown');

    if (!btn || !dropdown) return;

    // Toggle dropdown
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
    });

    // Language option clicks
    dropdown.querySelectorAll('.lang-option').forEach(function (option) {
      option.addEventListener('click', function () {
        var lang = this.dataset.lang;
        I18n.setLanguage(lang);
        dropdown.classList.remove('open');

        // Re-render dynamic content
        renderPoemCards();
        Merch.render('merch-grid');

        // Re-init scroll reveal for new elements
        setTimeout(function () {
          Animations.initScrollReveal();
        }, 100);

        // Update typewriter quote
        var quoteEl = document.getElementById('hero-quote');
        if (quoteEl) {
          Animations.typeWriter(quoteEl, I18n.t('hero.quote'), 45);
        }
      });
    });
  }

  /* ---------- Mobile Navigation ---------- */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });

    // Close on link click
    links.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  /* ---------- Smooth Scroll ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

})();
