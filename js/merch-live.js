/* ============================================
   MERCH ENHANCER — Printify Live Data
   Loads AFTER merch.js renders fallback cards.
   Updates cards with real Printify images & links.
   ============================================ */

(function () {
  'use strict';

  // Wait for merch cards to be rendered
  window.addEventListener('load', function () {
    setTimeout(function () {
      fetch('/api/admin-orders?action=products')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.success || !data.products) return;

          var products = data.products;
          var grid = document.getElementById('merch-grid');
          if (!grid) return;

          // Build new merch cards from Printify data
          var html = '';
          products.forEach(function (p) {
            // Get first image
            var img = '';
            if (p.images && p.images.length > 0) {
              var first = p.images[0];
              img = (typeof first === 'string') ? first : (first.src || '');
            }
            if (!img) return; // skip products with no image

            // Get lowest enabled variant price
            var minPrice = null;
            (p.variants || []).forEach(function (v) {
              if (v.is_enabled && v.price) {
                var vp = v.price / 100;
                if (minPrice === null || vp < minPrice) minPrice = vp;
              }
            });
            var priceStr = minPrice !== null ? '$' + minPrice.toFixed(2) : '';

            // Strip HTML from description
            var desc = (p.description || '').replace(/<[^>]*>/g, '').trim();
            if (desc.length > 120) desc = desc.substring(0, 117) + '...';

            // Determine link — use external URL if available
            var link = '';
            if (p.sales_channel_properties) {
              p.sales_channel_properties.forEach(function (sc) {
                if (sc.url) link = sc.url;
              });
            }
            if (!link && p.external_id) {
              link = 'https://wordsthatheal-llc.com/products/' + p.external_id;
            }

            var isLive = p.visible && link;

            html += '<div class="merch-card reveal" id="merch-printify-' + p.id + '">';
            html += '  <div class="merch-card-image-wrapper">';
            html += '    <img src="' + img + '" alt="' + (p.title || '') + '" class="merch-card-image" loading="lazy">';
            html += '  </div>';
            html += '  <div class="merch-card-body">';
            html += '    <h3 class="merch-card-title">' + (p.title || '') + '</h3>';
            html += '    <p class="merch-card-desc">' + desc + '</p>';
            html += '    <div class="merch-card-footer">';
            html += '      <span class="merch-card-price">' + priceStr + '</span>';
            if (isLive) {
              html += '    <a href="' + link + '" class="merch-card-btn" target="_blank" rel="noopener">Shop →</a>';
            } else {
              html += '    <span class="merch-card-btn">Coming Soon</span>';
            }
            html += '    </div>';
            html += '  </div>';
            html += '</div>';
          });

          if (html) {
            grid.innerHTML = html;
          }
        })
        .catch(function (err) {
          // Silently fail — keep fallback merch cards
          console.log('Merch enhancer: using fallback data', err.message);
        });
    }, 500); // Delay to ensure merch.js has rendered first
  });
})();
