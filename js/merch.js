/* ============================================
   CADASIA LEVY — MERCH STORE
   Product data and rendering
   Pulls live data from Printify via /api/admin-orders
   Falls back to hardcoded data if API unavailable
   ============================================ */

window.LevyMerch = (function () {

  // Hardcoded fallback products
  var fallbackProducts = [
    {
      id: 'book',
      image: 'assets/merch-book.png',
      titleKey: 'merch.book.title',
      descKey: 'merch.book.desc',
      price: '$24.99',
      link: '#',
      comingSoon: true
    },
    {
      id: 'tshirt',
      image: 'assets/merch-tshirt.png',
      titleKey: 'merch.tshirt.title',
      descKey: 'merch.tshirt.desc',
      price: '$34.99',
      link: '#',
      comingSoon: true
    },
    {
      id: 'mug',
      image: 'assets/merch-mug.png',
      titleKey: 'merch.mug.title',
      descKey: 'merch.mug.desc',
      price: '$18.99',
      link: '#',
      comingSoon: true
    },
    {
      id: 'artprint',
      image: 'assets/merch-artprint.png',
      titleKey: 'merch.artprint.title',
      descKey: 'merch.artprint.desc',
      price: '$29.99',
      link: '#',
      comingSoon: true
    },
    {
      id: 'nubian-dragon',
      image: 'assets/merch-nubian-dragon.png',
      titleKey: 'merch.nubiandragon.title',
      descKey: 'merch.nubiandragon.desc',
      price: '$34.99',
      link: '#',
      comingSoon: true
    }
  ];

  // Live products loaded from Printify
  var liveProducts = null;

  function renderCards(products, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var t = window.LevyI18n.t;
    var html = '';

    products.forEach(function (p) {
      html += '<div class="merch-card reveal" id="merch-' + p.id + '">';
      html += '  <div class="merch-card-image-wrapper">';
      html += '    <img src="' + p.image + '" alt="' + (p.title || t(p.titleKey || '')) + '" class="merch-card-image" loading="lazy">';
      html += '  </div>';
      html += '  <div class="merch-card-body">';
      html += '    <h3 class="merch-card-title"' + (p.titleKey ? ' data-i18n="' + p.titleKey + '"' : '') + '>' + (p.title || t(p.titleKey || '')) + '</h3>';
      html += '    <p class="merch-card-desc"' + (p.descKey ? ' data-i18n="' + p.descKey + '"' : '') + '>' + (p.description || t(p.descKey || '')) + '</p>';
      html += '    <div class="merch-card-footer">';
      html += '      <span class="merch-card-price">' + p.price + '</span>';
      if (p.comingSoon) {
        html += '    <span class="merch-card-btn" data-i18n="merch.comingSoon">' + t('merch.comingSoon') + '</span>';
      } else {
        html += '    <a href="' + p.link + '" class="merch-card-btn merch-card-btn--live" target="_blank" rel="noopener">Shop →</a>';
      }
      html += '    </div>';
      html += '  </div>';
      html += '</div>';
    });

    container.innerHTML = html;

    // Re-trigger reveal animations
    if (window.LevyReveal) {
      window.LevyReveal.observe();
    }
  }

  function render(containerId) {
    // First render with fallback data immediately
    renderCards(fallbackProducts, containerId);

    // Then fetch live Printify data
    fetch('/api/admin-orders?action=products')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.success || !data.products || data.products.length === 0) return;

        liveProducts = data.products.map(function (p) {
          var img = p.images && p.images.length > 0 ? p.images[0] : 'assets/merch-book.png';
          var minPrice = null;
          (p.variants || []).forEach(function (v) {
            if (v.is_enabled && v.price) {
              var vp = v.price / 100;
              if (minPrice === null || vp < minPrice) minPrice = vp;
            }
          });
          var priceStr = minPrice !== null ? '$' + minPrice.toFixed(2) : '$0.00';

          // Build the external URL
          var externalUrl = '';
          if (p.sales_channel_properties && p.sales_channel_properties.length > 0) {
            p.sales_channel_properties.forEach(function (sc) {
              if (sc.url) externalUrl = sc.url;
              if (sc.external && sc.external.handle) {
                externalUrl = 'https://wordsthatheal-llc.com/merch/' + sc.external.handle;
              }
            });
          }
          // Fallback: use Printify product page
          if (!externalUrl) {
            externalUrl = 'https://printify.com/app/product/' + p.id;
          }

          return {
            id: p.id,
            image: img,
            title: p.title,
            description: (p.description || '').replace(/<[^>]*>/g, '').substring(0, 120),
            price: priceStr,
            link: externalUrl,
            comingSoon: !p.visible
          };
        });

        // Re-render with live data
        renderCards(liveProducts, containerId);
      })
      .catch(function () {
        // Keep fallback rendering, no action needed
      });
  }

  return {
    render: render,
    products: fallbackProducts
  };

})();
