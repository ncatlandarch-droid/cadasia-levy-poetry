/* ============================================
   CADASIA LEVY — MERCH STORE
   Product data and rendering
   ============================================ */

window.LevyMerch = (function () {

  var products = [
    {
      id: 'book',
      image: 'assets/merch-book.png',
      titleKey: 'merch.book.title',
      descKey: 'merch.book.desc',
      price: '$24.99',
      link: 'https://wordsthatheal-llc.printify.me',
      comingSoon: false
    },
    {
      id: 'tshirt',
      image: 'assets/merch-tshirt.png',
      titleKey: 'merch.tshirt.title',
      descKey: 'merch.tshirt.desc',
      price: '$34.99',
      link: 'https://wordsthatheal-llc.printify.me',
      comingSoon: false
    },
    {
      id: 'mug',
      image: 'assets/merch-mug.png',
      titleKey: 'merch.mug.title',
      descKey: 'merch.mug.desc',
      price: '$18.99',
      link: 'https://wordsthatheal-llc.printify.me',
      comingSoon: false
    },
    {
      id: 'artprint',
      image: 'assets/merch-artprint.png',
      titleKey: 'merch.artprint.title',
      descKey: 'merch.artprint.desc',
      price: '$29.99',
      link: 'https://wordsthatheal-llc.printify.me',
      comingSoon: false
    },
    {
      id: 'nubian-dragon',
      image: 'assets/merch-nubian-dragon.png',
      titleKey: 'merch.nubiandragon.title',
      descKey: 'merch.nubiandragon.desc',
      price: '$34.99',
      link: 'https://wordsthatheal-llc.printify.me',
      comingSoon: false
    }
  ];

  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var t = window.LevyI18n.t;
    var html = '';

    products.forEach(function (p) {
      html += '<div class="merch-card reveal" id="merch-' + p.id + '">';
      html += '  <div class="merch-card-image-wrapper">';
      html += '    <img src="' + p.image + '" alt="' + t(p.titleKey) + '" class="merch-card-image" loading="lazy">';
      html += '  </div>';
      html += '  <div class="merch-card-body">';
      html += '    <h3 class="merch-card-title" data-i18n="' + p.titleKey + '">' + t(p.titleKey) + '</h3>';
      html += '    <p class="merch-card-desc" data-i18n="' + p.descKey + '">' + t(p.descKey) + '</p>';
      html += '    <div class="merch-card-footer">';
      html += '      <span class="merch-card-price">' + p.price + '</span>';
      if (p.comingSoon) {
        html += '    <span class="merch-card-btn" data-i18n="merch.comingSoon">' + t('merch.comingSoon') + '</span>';
      } else {
        html += '    <a href="' + p.link + '" class="merch-card-btn" target="_blank" rel="noopener">Shop →</a>';
      }
      html += '    </div>';
      html += '  </div>';
      html += '</div>';
    });

    container.innerHTML = html;
  }

  return {
    render: render,
    products: products
  };

})();
