/* ============================================
   WORDS THAT HEAL — ART GALLERY
   Masonry grid + Lightbox viewer
   ============================================ */

window.LevyGallery = (function () {
  'use strict';

  var artworks = [
    {
      id: 'breathe',
      image: 'assets/art-breathe.png',
      titleKey: 'gallery.breathe',
      poem: 'Breathe'
    },
    {
      id: 'escape',
      image: 'assets/art-escape.png',
      titleKey: 'gallery.escape',
      poem: 'Can I escape?'
    },
    {
      id: 'howcouldyou',
      image: 'assets/art-howcouldyou.png',
      titleKey: 'gallery.howcouldyou',
      poem: 'How could you?'
    },
    {
      id: 'amithereason',
      image: 'assets/art-amithereason.png',
      titleKey: 'gallery.amithereason',
      poem: 'Am I the reason?'
    },
    {
      id: 'ideaofme',
      image: 'assets/art-ideaofme.png',
      titleKey: 'gallery.ideaofme',
      poem: 'The idea of me'
    },
    {
      id: 'dragon-fire',
      image: 'assets/art-dragon-fire.png',
      titleKey: 'gallery.dragonfire',
      poem: 'Dragon & Flame'
    },
    {
      id: 'dragon-bloom',
      image: 'assets/art-dragon-bloom.png',
      titleKey: 'gallery.dragonbloom',
      poem: 'Dragon & Bloom'
    },
    {
      id: 'affirmation-queen',
      image: 'assets/art-affirmation-queen.png',
      titleKey: 'gallery.affirmationqueen',
      poem: 'Affirmation Queen'
    },
    {
      id: 'rainbow-bloom',
      image: 'assets/art-rainbow-bloom.png',
      titleKey: 'gallery.rainbowbloom',
      poem: 'Rainbow Bloom'
    },
    {
      id: 'mudra-hand',
      image: 'assets/art-mudra-hand.png',
      titleKey: 'gallery.mudrahand',
      poem: 'Mudra'
    },
    {
      id: 'heartbeat-breathe',
      image: 'assets/art-heartbeat-breathe.png',
      titleKey: 'gallery.heartbeatbreathe',
      poem: 'Heartbeat'
    }
  ];

  var lightbox = null;
  var lightboxImg = null;
  var lightboxCaption = null;

  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var t = window.LevyI18n.t;
    var html = '';

    artworks.forEach(function (art, i) {
      var delay = (i % 3) + 1;
      html += '<div class="gallery-item reveal reveal-delay-' + delay + '" data-art-id="' + art.id + '">';
      html += '  <div class="gallery-item-inner">';
      html += '    <img src="' + art.image + '" alt="Art for ' + art.poem + '" class="gallery-item-image" loading="lazy">';
      html += '    <div class="gallery-item-overlay">';
      html += '      <span class="gallery-item-poem">' + art.poem + '</span>';
      html += '      <span class="gallery-item-view">' + t('gallery.view') + '</span>';
      html += '    </div>';
      html += '    <span class="gallery-item-buy">Buy Print</span>';
      html += '  </div>';
      html += '</div>';
    });

    container.innerHTML = html;
  }

  function initLightbox() {
    // Create lightbox
    lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = '<button class="gallery-lightbox-close" aria-label="Close">✕</button>' +
      '<img class="gallery-lightbox-img" src="" alt="">' +
      '<p class="gallery-lightbox-caption"></p>' +
      '<div class="gallery-lightbox-actions">' +
      '<a href="https://cash.app/$cadasiata" target="_blank" rel="noopener" class="gallery-buy-btn">Buy Print — $29.99</a>' +
      '</div>';
    document.body.appendChild(lightbox);

    lightboxImg = lightbox.querySelector('.gallery-lightbox-img');
    lightboxCaption = lightbox.querySelector('.gallery-lightbox-caption');

    // Close button
    lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });

    // Open on gallery item click
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (!item) return;

      var artId = item.dataset.artId;
      var art = artworks.find(function (a) { return a.id === artId; });
      if (!art) return;

      lightboxImg.src = art.image;
      lightboxImg.alt = art.poem;
      lightboxCaption.textContent = '"' + art.poem + '"';

      // Update buy button
      var buyBtn = lightbox.querySelector('.gallery-buy-btn');
      if (buyBtn) {
        buyBtn.textContent = 'Buy "' + art.poem + '" Print — $29.99';
      }

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  return {
    render: render,
    initLightbox: initLightbox,
    artworks: artworks
  };
})();
