/* ============================================
   CADASIA LEVY — ANIMATIONS
   Scroll reveals, typewriter, gold particles
   ============================================ */

window.LevyAnimations = (function () {

  /* ---------- Scroll Reveal ---------- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Typewriter Effect ---------- */
  function typeWriter(element, text, speed, callback) {
    var i = 0;
    element.textContent = '';

    // Create cursor
    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    element.appendChild(cursor);

    function type() {
      if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        element.appendChild(cursor);
        i++;
        setTimeout(type, speed);
      } else {
        // Keep cursor blinking for a moment, then remove
        setTimeout(function () {
          cursor.style.display = 'none';
          if (callback) callback();
        }, 2000);
      }
    }

    // Small delay before starting
    setTimeout(type, 800);
  }

  /* ---------- Gold Particle Canvas ---------- */
  function initParticles(canvasEl) {
    if (!canvasEl) return;

    var ctx = canvasEl.getContext('2d');
    var particles = [];
    var particleCount = 50;
    var animId;

    function resize() {
      canvasEl.width = canvasEl.offsetWidth;
      canvasEl.height = canvasEl.offsetHeight;
    }

    function Particle() {
      this.x = Math.random() * canvasEl.width;
      this.y = Math.random() * canvasEl.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.opacitySpeed = (Math.random() - 0.5) * 0.005;
    }

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.opacitySpeed;

      if (this.opacity <= 0.05 || this.opacity >= 0.6) {
        this.opacitySpeed *= -1;
      }

      // Wrap around
      if (this.x < 0) this.x = canvasEl.width;
      if (this.x > canvasEl.width) this.x = 0;
      if (this.y < 0) this.y = canvasEl.height;
      if (this.y > canvasEl.height) this.y = 0;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 175, 55, ' + this.opacity + ')';
      ctx.fill();
    };

    function init() {
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      // Draw connections between close particles
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(212, 175, 55, ' + (0.06 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(function (p) {
        p.update();
        p.draw();
      });

      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', function () {
      resize();
    });

    resize();
    init();
    animate();

    return function stop() {
      cancelAnimationFrame(animId);
    };
  }

  /* ---------- Poem Line Reveal ---------- */
  function revealPoemLines(container, delay) {
    delay = delay || 120;
    var lines = container.querySelectorAll('.poem-modal-line');
    lines.forEach(function (line, index) {
      setTimeout(function () {
        line.classList.add('visible');
      }, index * delay);
    });
  }

  /* ---------- Nav Scroll Effect ---------- */
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrolled = false;
    function checkScroll() {
      var shouldBeScrolled = window.scrollY > 60;
      if (shouldBeScrolled !== scrolled) {
        scrolled = shouldBeScrolled;
        nav.classList.toggle('scrolled', scrolled);
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ---------- Hero Entrance Animation ---------- */
  function animateHeroEntrance() {
    var elements = document.querySelectorAll('.hero-content > *');
    elements.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.transitionDelay = (0.2 + i * 0.15) + 's';

      // Trigger
      requestAnimationFrame(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }

  /* ---------- Public API ---------- */
  return {
    initScrollReveal: initScrollReveal,
    typeWriter: typeWriter,
    initParticles: initParticles,
    revealPoemLines: revealPoemLines,
    initNavScroll: initNavScroll,
    animateHeroEntrance: animateHeroEntrance
  };

})();
