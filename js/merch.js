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

  function renderCards(products, containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var t = window.LevyI18n ? window.LevyI18n.t : function (k) { return k; };
    var html = '';

    products.forEach(function (p) {
      var title = p.title || (p.titleKey ? t(p.titleKey) : '');
      var desc = p.description || (p.descKey ? t(p.descKey) : '');

      html += '<div class="merch-card reveal" id="merch-' + p.id + '">';
      html += '  <div class="merch-card-image-wrapper">';
      html += '    <img src="' + p.image + '" alt="' + title + '" class="merch-card-image" loading="lazy">';
      html += '  </div>';
      html += '  <div class="merch-card-body">';
      html += '    <h3 class="merch-card-title"' + (p.titleKey ? ' data-i18n="' + p.titleKey + '"' : '') + '>' + title + '</h3>';
      html += '    <p class="merch-card-desc"' + (p.descKey ? ' data-i18n="' + p.descKey + '"' : '') + '>' + desc + '</p>';
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
  }

  function render(containerId) {
    // Always render fallback first
    renderCards(fallbackProducts, containerId);

    // Then try to fetch live Printify data
    try {
      fetch('/api/admin-orders?action=products')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.success || !data.products || data.products.length === 0) return;

          var mapped = [];
          data.products.forEach(function (p) {
            try {
              // Handle images — could be array of strings OR array of objects {src: "url"}
              var img = 'assets/merch-book.png';
              if (p.images && p.images.length > 0) {
                var firstImg = p.images[0];
                img = typeof firstImg === 'string' ? firstImg : (firstImg.src || img);
              }

              // Get lowest enabled price
              var minPrice = null;
              (p.variants || []).forEach(function (v) {
                if (v.is_enabled && v.price) {
                  var vp = v.price / 100;
                  if (minPrice === null || vp < minPrice) minPrice = vp;
                }
              });
              var priceStr = minPrice !== null ? '$' + minPrice.toFixed(2) : '$0.00';

              // Get description — strip HTML
              var rawDesc = p.description || '';
              var cleanDesc = rawDesc.replace(/<[^>]*>/g, '').substring(0, 120);

              mapped.push({
                id: p.id || 'product',
                image: img,
                title: p.title || 'Product',
                description: cleanDesc,
                price: priceStr,
                link: p.url || 'https://printify.com',
                comingSoon: !p.visible
              });
            } catch (e) {
              // Skip this product if mapping fails
            }
          });

          if (mapped.length > 0) {
            renderCards(mapped, containerId);
          }
        })
        .catch(function () {
          // Keep fallback, do nothing
        });
    } catch (e) {
      // Keep fallback, do nothing
    }
  }

  return {
    render: render,
    products: fallbackProducts
  };

})();
