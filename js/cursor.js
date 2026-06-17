/* ============================================
   WORDS THAT HEAL — CUSTOM CURSOR + PAINT TRAIL
   Adapted from Sean Parrish Design cursor
   Gold dot + ring + paint drop trail
   ============================================ */

window.LevyCursor = (function () {
  'use strict';

  /* ---------- Helpers ---------- */
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Config ---------- */
  var MAX_DROPS     = 30;
  var DROP_INTERVAL = 80;   // ms between paint drops
  var DROP_LIFETIME = 1000; // ms before a drop fades

  var dot  = null;
  var ring = null;
  var mouseX = 0, mouseY = 0;
  var ringX  = 0, ringY  = 0;
  var isHovering   = false;
  var isVisible    = false;
  var lastDropTime = 0;
  var isMouseMoving = false;
  var moveTimer = null;

  // Paint drop pool
  var pool = [];
  var activeDrops = [];

  /* ---------- Init ---------- */
  function init() {
    // Skip on touch or reduced motion
    if (!hasFinePointer || prefersReducedMotion) return;

    // Create cursor dot
    dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    // Create cursor ring
    ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // Add CSS — hide default cursor, style custom elements
    var style = document.createElement('style');
    style.textContent =
      '*, *::before, *::after { cursor: none !important; }' +
      '.cursor-dot {' +
      '  position: fixed; top: 0; left: 0; width: 8px; height: 8px;' +
      '  background: #D4AF37; border-radius: 50%;' +
      '  pointer-events: none; z-index: 100000;' +
      '  transform: translate(-50%, -50%);' +
      '  transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), opacity 0.3s;' +
      '  opacity: 0; mix-blend-mode: difference;' +
      '}' +
      '.cursor-ring {' +
      '  position: fixed; top: 0; left: 0; width: 40px; height: 40px;' +
      '  border: 1.5px solid rgba(212, 175, 55, 0.6); border-radius: 50%;' +
      '  pointer-events: none; z-index: 99999;' +
      '  transform: translate(-50%, -50%);' +
      '  transition: transform 0.2s cubic-bezier(0.22,1,0.36,1),' +
      '              border-color 0.3s, opacity 0.3s;' +
      '  opacity: 0;' +
      '}' +
      '.cursor-dot.visible, .cursor-ring.visible { opacity: 1; }' +
      '.cursor-dot.hover {' +
      '  transform: translate(-50%, -50%) scale(2.5);' +
      '  background: #E8D48B;' +
      '}' +
      '.cursor-ring.hover {' +
      '  transform: translate(-50%, -50%) scale(1.6);' +
      '  border-color: #E8D48B;' +
      '}' +
      '.paint-drop {' +
      '  position: fixed; pointer-events: none; z-index: 99998;' +
      '  border-radius: 50%;' +
      '  background: #D4AF37;' +
      '  opacity: 0.5; mix-blend-mode: difference;' +
      '  transform: translate(-50%, -50%) scale(1);' +
      '  transition: none; will-change: opacity, transform;' +
      '}';
    document.head.appendChild(style);

    // Pre-fill paint drop pool
    for (var i = 0; i < MAX_DROPS; i++) {
      var drop = document.createElement('div');
      drop.className = 'paint-drop';
      drop.style.display = 'none';
      drop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(drop);
      pool.push(drop);
    }

    // Event listeners
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', function () { show(); }, { passive: true });
    document.addEventListener('mouseleave', function () { hide(); }, { passive: true });

    // Hover detection for interactive elements
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .poem-card, .merch-card, .gallery-item, [role="button"], input, select, textarea, label')) {
        isHovering = true;
        dot.classList.add('hover');
        ring.classList.add('hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, .poem-card, .merch-card, .gallery-item, [role="button"], input, select, textarea, label')) {
        isHovering = false;
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      }
    }, { passive: true });

    // Start animation loop
    animate();
  }

  /* ---------- Show / Hide ---------- */
  function show() {
    if (!dot) return;
    isVisible = true;
    dot.classList.add('visible');
    ring.classList.add('visible');
  }

  function hide() {
    if (!dot) return;
    isVisible = false;
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  }

  /* ---------- Mouse Move ---------- */
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) show();

    isMouseMoving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(function () { isMouseMoving = false; }, 150);
  }

  /* ---------- Animation Loop ---------- */
  function animate() {
    if (!dot) return;

    // Dot follows exactly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // Ring follows with lerp (smooth trailing)
    ringX = lerp(ringX, mouseX, 0.15);
    ringY = lerp(ringY, mouseY, 0.15);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    // Paint trail — spawn drops while moving
    var now = Date.now();
    if (isMouseMoving && isVisible && now - lastDropTime > DROP_INTERVAL) {
      spawnDrop(mouseX, mouseY);
      lastDropTime = now;
    }

    // Update active drops (fade + shrink)
    updateDrops(now);

    requestAnimationFrame(animate);
  }

  /* ---------- Paint Drops ---------- */
  function spawnDrop(x, y) {
    var drop;
    if (pool.length > 0) {
      drop = pool.pop();
    } else if (activeDrops.length > 0) {
      // Recycle oldest
      drop = activeDrops.shift();
    } else {
      return;
    }

    var size = 4 + Math.random() * 6; // 4–10px
    drop.style.width  = size + 'px';
    drop.style.height = size + 'px';
    drop.style.left   = x + 'px';
    drop.style.top    = y + 'px';
    drop.style.opacity = (0.35 + Math.random() * 0.2).toFixed(3);
    drop.style.transform = 'translate(-50%, -50%) scale(1)';
    drop.style.display = 'block';
    drop._spawnTime = Date.now();
    drop._initialOpacity = parseFloat(drop.style.opacity);

    activeDrops.push(drop);
  }

  function updateDrops(now) {
    for (var i = activeDrops.length - 1; i >= 0; i--) {
      var drop = activeDrops[i];
      var age = now - drop._spawnTime;
      var progress = Math.min(age / DROP_LIFETIME, 1);

      if (progress >= 1) {
        drop.style.display = 'none';
        activeDrops.splice(i, 1);
        pool.push(drop);
        continue;
      }

      // Ease-out fade and shrink
      var easedProgress = 1 - Math.pow(1 - progress, 3);
      drop.style.opacity = (drop._initialOpacity * (1 - easedProgress)).toFixed(3);
      drop.style.transform = 'translate(-50%, -50%) scale(' + (1 - easedProgress * 0.6).toFixed(3) + ')';
    }
  }

  return { init: init };
})();
