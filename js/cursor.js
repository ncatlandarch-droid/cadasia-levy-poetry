/* ============================================
   WORDS THAT HEAL — DYNAMIC CURSOR
   Gold particle trail + magnetic effects
   ============================================ */

window.LevyCursor = (function () {
  'use strict';

  // Skip on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return { init: function () {} };
  }

  var cursor = null;
  var cursorDot = null;
  var particles = [];
  var mouseX = -100, mouseY = -100;
  var cursorX = -100, cursorY = -100;
  var dotX = -100, dotY = -100;
  var isHovering = false;
  var hoverTarget = null;
  var rafId = null;

  var MAX_PARTICLES = 35;
  var PARTICLE_RATE = 3; // frames between spawns
  var frameCount = 0;

  /* ---------- Particle Class ---------- */
  function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5 - 0.5;
    this.opacity = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.el = document.createElement('div');
    this.el.className = 'cursor-particle';
    this.el.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,0.8),rgba(212,175,55,0));';
    document.body.appendChild(this.el);
  }

  Particle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= this.decay;
    this.size *= 0.98;

    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
    this.el.style.width = this.size + 'px';
    this.el.style.height = this.size + 'px';
    this.el.style.opacity = this.opacity;

    return this.opacity > 0.01;
  };

  Particle.prototype.destroy = function () {
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  };

  /* ---------- Click Ripple ---------- */
  function createRipple(x, y) {
    var ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.cssText = 'position:fixed;pointer-events:none;z-index:9997;border-radius:50%;border:2px solid rgba(212,175,55,0.6);left:' + x + 'px;top:' + y + 'px;width:0;height:0;transform:translate(-50%,-50%);transition:all 0.6s cubic-bezier(0.16,1,0.3,1);';
    document.body.appendChild(ripple);

    requestAnimationFrame(function () {
      ripple.style.width = '60px';
      ripple.style.height = '60px';
      ripple.style.opacity = '0';
      ripple.style.borderColor = 'rgba(212,175,55,0)';
    });

    setTimeout(function () {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 700);
  }

  /* ---------- Magnetic Effect ---------- */
  function getMagneticOffset(el) {
    if (!el) return { x: 0, y: 0 };
    var rect = el.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var distX = mouseX - centerX;
    var distY = mouseY - centerY;
    var dist = Math.sqrt(distX * distX + distY * distY);
    var maxDist = 100;

    if (dist < maxDist) {
      var strength = (1 - dist / maxDist) * 0.3;
      return {
        x: distX * strength,
        y: distY * strength
      };
    }
    return { x: 0, y: 0 };
  }

  /* ---------- Animation Loop ---------- */
  function animate() {
    frameCount++;

    // Smooth cursor follow
    var ease = isHovering ? 0.15 : 0.12;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;

    // Dot follows faster
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;

    // Apply magnetic offset to outer ring
    var magOffset = getMagneticOffset(hoverTarget);

    // Update cursor ring
    if (cursor) {
      var scale = isHovering ? 2.2 : 1;
      var opacity = isHovering ? 0.5 : 0.7;
      cursor.style.transform = 'translate(' + (cursorX + magOffset.x) + 'px, ' + (cursorY + magOffset.y) + 'px) translate(-50%, -50%) scale(' + scale + ')';
      cursor.style.opacity = opacity;
    }

    // Update cursor dot
    if (cursorDot) {
      cursorDot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';
    }

    // Spawn particles on movement
    var dx = mouseX - (particles.length ? particles[particles.length - 1].x : mouseX);
    var dy = mouseY - (particles.length ? particles[particles.length - 1].y : mouseY);
    var moved = Math.sqrt(dx * dx + dy * dy);

    if (moved > 3 && frameCount % PARTICLE_RATE === 0 && particles.length < MAX_PARTICLES) {
      particles.push(new Particle(mouseX, mouseY));
    }

    // Update particles
    particles = particles.filter(function (p) {
      var alive = p.update();
      if (!alive) p.destroy();
      return alive;
    });

    rafId = requestAnimationFrame(animate);
  }

  /* ---------- Init ---------- */
  function init() {
    // Hide default cursor
    var style = document.createElement('style');
    style.textContent = '*, *::before, *::after { cursor: none !important; } .poem-modal-overlay:not(.open) ~ * { cursor: none !important; }';
    document.head.appendChild(style);

    // Create cursor ring
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor-ring';
    cursor.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:36px;height:36px;border:1.5px solid rgba(212,175,55,0.6);border-radius:50%;transition:opacity 0.3s ease;will-change:transform;';
    document.body.appendChild(cursor);

    // Create cursor dot
    cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    cursorDot.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:6px;height:6px;background:rgba(212,175,55,0.9);border-radius:50%;will-change:transform;box-shadow:0 0 8px rgba(212,175,55,0.4);';
    document.body.appendChild(cursorDot);

    // Mouse move
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Click ripple
    document.addEventListener('click', function (e) {
      createRipple(e.clientX, e.clientY);
    });

    // Hover detection for magnetic effect
    var interactives = 'a, button, .poem-card, .merch-card, .merch-card-btn, .cashapp-btn, .social-icon, .nav-link, .hero-cta, .lang-btn, .lang-option, .gallery-item';

    document.addEventListener('mouseover', function (e) {
      var target = e.target.closest(interactives);
      if (target) {
        isHovering = true;
        hoverTarget = target;
      }
    });

    document.addEventListener('mouseout', function (e) {
      var target = e.target.closest(interactives);
      if (target) {
        isHovering = false;
        hoverTarget = null;
      }
    });

    // Poem line glow effect
    document.addEventListener('mouseover', function (e) {
      if (e.target.classList && e.target.classList.contains('poem-modal-line')) {
        e.target.style.color = '#D4AF37';
        e.target.style.transition = 'color 0.3s ease';
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.classList && e.target.classList.contains('poem-modal-line')) {
        e.target.style.color = '';
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      if (cursor) cursor.style.opacity = '0';
      if (cursorDot) cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      if (cursor) cursor.style.opacity = '0.7';
      if (cursorDot) cursorDot.style.opacity = '1';
    });

    // Start animation loop
    animate();
  }

  return { init: init };
})();
