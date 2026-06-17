/* ============================================
   WORDS THAT HEAL — MAIN APPLICATION
   Orchestrates all modules
   ============================================ */

(function () {
  'use strict';

  var I18n = window.LevyI18n;
  var Poems = window.LevyPoems;
  var Animations = window.LevyAnimations;
  var Merch = window.LevyMerch;
  var Gallery = window.LevyGallery;
  var Audio = window.LevyAudio;
  var Cursor = window.LevyCursor;

  /* ---------- Page Loader ---------- */
  function hideLoader() {
    var loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('loaded');
      setTimeout(function () { loader.style.display = 'none'; }, 800);
    }
  }

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initApp();
  });

  function initApp() {
    renderPoemCards();
    Merch.render('merch-grid');
    Gallery.render('gallery-grid');
    Gallery.initLightbox();
    Audio.init();
    I18n.updatePage();
    initLanguageSwitcher();
    initMobileNav();
    initSmoothScroll();
    initPoemModal();
    initDailyVerse();
    initNewsletter();
    initBackToTop();
    Cursor.init();

    Animations.initNavScroll();
    Animations.initParticles(document.getElementById('hero-canvas'));
    Animations.animateHeroEntrance();

    // Start typewriter
    var quoteEl = document.getElementById('hero-quote');
    if (quoteEl) {
      Animations.typeWriter(quoteEl, I18n.t('hero.quote'), 45);
    }

    setTimeout(function () {
      Animations.initScrollReveal();
    }, 200);

    initCommunityFilters();

    // Hide loader
    setTimeout(hideLoader, 600);
  }

  /* ---------- Community Filters ---------- */
  function initCommunityFilters() {
    var filtersEl = document.getElementById('community-filters');
    var searchEl = document.getElementById('community-search');
    if (!filtersEl) return;

    function getActiveFilter() {
      var active = filtersEl.querySelector('.community-filter.active');
      return active ? active.dataset.filter : 'all';
    }

    function filterCards() {
      var filter = getActiveFilter();
      var query = searchEl ? searchEl.value.toLowerCase().trim() : '';
      var cards = document.querySelectorAll('#community-grid .community-card');

      cards.forEach(function (card) {
        var matchesCategory = (filter === 'all' || card.dataset.category === filter);
        var matchesSearch = true;

        if (query) {
          var text = card.textContent.toLowerCase();
          var keywords = (card.dataset.keywords || '').toLowerCase();
          matchesSearch = text.indexOf(query) !== -1 || keywords.indexOf(query) !== -1;
        }

        if (matchesCategory && matchesSearch) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }

    filtersEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.community-filter');
      if (!btn) return;

      filtersEl.querySelectorAll('.community-filter').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      filterCards();
    });

    if (searchEl) {
      searchEl.addEventListener('input', filterCards);
    }
  }

  /* ---------- Daily Verse ---------- */
  function initDailyVerse() {
    var verseEl = document.getElementById('daily-verse-text');
    if (!verseEl) return;

    // Collect all non-empty lines from all poems
    var allLines = [];
    var lang = I18n.getLanguage();
    Poems.forEach(function (poem) {
      var lines = Poems.getLines(poem, lang);
      lines.forEach(function (line) {
        if (line.trim().length > 20) {
          allLines.push({ text: line, title: Poems.getTitle(poem, lang) });
        }
      });
    });

    // Pick based on day of year
    var now = new Date();
    var dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    var pick = allLines[dayOfYear % allLines.length];

    if (pick) {
      verseEl.textContent = '"' + pick.text + '"';
      var sourceEl = document.getElementById('daily-verse-source');
      if (sourceEl) sourceEl.textContent = '— ' + pick.title;
    }
  }

  /* ---------- Render Poem Cards ---------- */
  function renderPoemCards() {
    var grid = document.getElementById('poetry-grid');
    if (!grid) return;

    var lang = I18n.getLanguage();
    var html = '';
    Poems.forEach(function (poem, index) {
      var num = (index + 1).toString().padStart(2, '0');
      var title = Poems.getTitle(poem, lang);
      var preview = Poems.getPreview(poem, lang);
      var isFree = poem.free === true;

      html += '<div class="poem-card reveal' + (isFree ? '' : ' poem-card--locked') + '" data-poem-id="' + poem.id + '" id="poem-card-' + poem.id + '">';
      if (!isFree) {
        html += '  <span class="poem-card-lock">🔒</span>';
      }
      html += '  <span class="poem-card-number">' + num + '</span>';
      html += '  <h3 class="poem-card-title">' + title + '</h3>';
      html += '  <p class="poem-card-preview">' + preview + '</p>';
      html += '  <div class="poem-card-footer">';
      html += '    <span class="poem-card-date">' + poem.date + '</span>';
      if (isFree) {
        html += '    <span class="poem-card-read" data-i18n="poetry.readMore">' + I18n.t('poetry.readMore') + '</span>';
      } else {
        html += '    <span class="poem-card-read poem-card-read--locked">Preview · Get the Book</span>';
      }
      html += '  </div>';

      // Audio player only for free poems
      if (isFree) {
        html += '  <div class="poem-card-audio" id="poem-audio-' + poem.id + '"></div>';
      }
      html += '</div>';
    });

    grid.innerHTML = html;

    // Create audio players for free poems only
    Poems.forEach(function (poem) {
      if (poem.free !== true) return;
      var audioContainer = document.getElementById('poem-audio-' + poem.id);
      if (audioContainer) {
        Audio.createPlayer(poem.id, audioContainer);
      }
    });
  }

  /* ---------- Poem Modal ---------- */
  function initPoemModal() {
    var overlay = document.getElementById('poem-modal-overlay');
    var modalTitle = document.getElementById('poem-modal-title');
    var modalDate = document.getElementById('poem-modal-date');
    var modalBody = document.getElementById('poem-modal-body');
    var closeBtn = document.getElementById('poem-modal-close');

    if (!overlay) return;

    document.addEventListener('click', function (e) {
      // Don't open modal if clicking audio player
      if (e.target.closest('.audio-player') || e.target.closest('.audio-play-btn')) return;

      var card = e.target.closest('.poem-card');
      if (!card) return;

      var poemId = card.dataset.poemId;
      var poem = Poems.find(function (p) { return p.id === poemId; });
      if (!poem) return;

      openPoemModal(poem);
    });

    closeBtn.addEventListener('click', closePoemModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePoemModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePoemModal();
    });

    function openPoemModal(poem) {
      var lang = I18n.getLanguage();
      var title = Poems.getTitle(poem, lang);
      var lines = Poems.getLines(poem, lang);
      var isFree = poem.free === true;
      var teaserCount = poem.teaserLines || 4;

      modalTitle.textContent = title;
      modalDate.textContent = poem.date;

      var linesHtml = '';

      if (isFree) {
        // FREE poem — show full text
        lines.forEach(function (line) {
          if (line === '') {
            linesHtml += '<div class="poem-modal-line empty"></div>';
          } else {
            linesHtml += '<div class="poem-modal-line">' + line + '</div>';
          }
        });
      } else {
        // LOCKED poem — show teaser lines + blur + CTA
        lines.forEach(function (line, i) {
          if (i < teaserCount) {
            if (line === '') {
              linesHtml += '<div class="poem-modal-line empty"></div>';
            } else {
              linesHtml += '<div class="poem-modal-line">' + line + '</div>';
            }
          }
        });

        // Blurred preview of next few lines
        linesHtml += '<div class="poem-locked-fade">';
        for (var j = teaserCount; j < Math.min(teaserCount + 4, lines.length); j++) {
          if (lines[j] && lines[j] !== '') {
            linesHtml += '<div class="poem-modal-line">' + lines[j] + '</div>';
          }
        }
        linesHtml += '</div>';

        // CTA
        linesHtml += '<div class="poem-locked-cta">';
        linesHtml += '  <div class="poem-locked-icon">🔒</div>';
        linesHtml += '  <p class="poem-locked-message">This poem continues in the full collection.</p>';
        linesHtml += '  <a href="https://cash.app/$cadasiata" target="_blank" rel="noopener" class="poem-locked-btn">';
        linesHtml += '    Support Cadasia · Get the Book';
        linesHtml += '  </a>';
        linesHtml += '  <p class="poem-locked-sub">Includes all 5 poems + exclusive audio + art prints</p>';
        linesHtml += '</div>';
      }

      modalBody.innerHTML = linesHtml;

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';

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

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
    });

    dropdown.querySelectorAll('.lang-option').forEach(function (option) {
      option.addEventListener('click', function () {
        var lang = this.dataset.lang;
        I18n.setLanguage(lang);
        dropdown.classList.remove('open');

        // Re-render everything
        renderPoemCards();
        Merch.render('merch-grid');
        Gallery.render('gallery-grid');
        initDailyVerse();

        setTimeout(function () {
          Animations.initScrollReveal();
        }, 100);

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

  /* ---------- Newsletter Signup ---------- */
  function initNewsletter() {
    var form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var btn = form.querySelector('button');

      if (input && input.value) {
        btn.textContent = I18n.t('newsletter.thanks');
        btn.style.background = 'var(--gold)';
        btn.style.color = 'var(--bg-primary)';
        input.value = '';
        setTimeout(function () {
          btn.textContent = I18n.t('newsletter.cta');
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      }
    });
  }

  /* ---------- Back to Top ---------- */
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
