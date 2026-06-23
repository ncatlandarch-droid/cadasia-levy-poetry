/* ============================================
   MERCH ENHANCER — Printify Live Pipeline
   Loads AFTER merch.js renders fallback cards.
   Fetches real products from Printify API and
   replaces the grid with live data.
   ============================================ */

(function () {
  'use strict';

  window.addEventListener('load', function () {
    setTimeout(function () {
      fetch('/api/admin-orders?action=products')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.success || !data.products || data.products.length === 0) return;

          var grid = document.getElementById('merch-grid');
          if (!grid) return;

          var t = window.LevyI18n ? window.LevyI18n.t : function (k) { return k; };
          var html = '';

          data.products.forEach(function (p) {
            // Images are now pre-mapped to strings by the API
            var img = (p.images && p.images.length > 0) ? p.images[0] : '';
            if (!img) return;

            // Get lowest enabled price
            var minPrice = null;
            (p.variants || []).forEach(function (v) {
              if (v.is_enabled && v.price) {
                var vp = v.price / 100;
                if (minPrice === null || vp < minPrice) minPrice = vp;
              }
            });
            var priceStr = minPrice !== null ? '$' + minPrice.toFixed(2) : '';

            // Strip HTML from description
            var desc = String(p.description || '').replace(/<[^>]*>/g, '').trim();
            if (desc.length > 120) desc = desc.substring(0, 117) + '...';
            if (!desc) desc = p.title || '';

            // Build purchase link — use external URL if available, fallback to Printify store
            var link = 'https://wordsthatheal-llc.printify.me';
            if (p.sales_channel_properties && p.sales_channel_properties.length > 0) {
              p.sales_channel_properties.forEach(function (sc) {
                if (sc.url) link = sc.url;
              });
            }
            if (p.url) link = p.url;

            html += '<div class="merch-card reveal revealed" id="merch-live-' + p.id + '">';
            html += '  <div class="merch-card-image-wrapper">';
            html += '    <img src="' + img + '" alt="' + (p.title || '') + '" class="merch-card-image" loading="lazy">';
            html += '  </div>';
            html += '  <div class="merch-card-body">';
            html += '    <h3 class="merch-card-title">' + (p.title || '') + '</h3>';
            html += '    <p class="merch-card-desc">' + desc + '</p>';
            html += '    <div class="merch-card-footer">';
            html += '      <span class="merch-card-price">' + priceStr + '</span>';
            html += '    <a href="' + link + '" class="merch-card-btn" target="_blank" rel="noopener">Shop →</a>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';
          });

          if (html) {
            grid.innerHTML = html;
          }
        })
        .catch(function (err) {
          console.log('Merch live pipeline: using fallback', err.message);
        });
    }, 300);
  });
})();
