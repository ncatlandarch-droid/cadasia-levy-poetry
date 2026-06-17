/* ============================================
   WORDS THAT HEAL — AUDIO PLAYER
   Teaser model: 30s preview, full = premium
   ============================================ */

window.LevyAudio = (function () {
  'use strict';

  var currentlyPlaying = null;
  var stickyBar = null;

  /* ---------- Create Audio Player for a Poem ---------- */
  function createPlayer(poemId, container) {
    var t = window.LevyI18n.t;

    var html = '<div class="audio-player" id="audio-player-' + poemId + '">';
    html += '  <button class="audio-play-btn" data-poem="' + poemId + '" aria-label="Play preview">';
    html += '    <svg class="audio-icon-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
    html += '    <svg class="audio-icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    html += '  </button>';
    html += '  <div class="audio-waveform" data-poem="' + poemId + '">';
    for (var i = 0; i < 40; i++) {
      var h = Math.random() * 60 + 20;
      html += '<div class="audio-bar" style="height:' + h + '%;"></div>';
    }
    html += '  </div>';
    html += '  <span class="audio-time">0:00 / 0:30</span>';
    html += '  <span class="audio-badge" data-i18n="audio.preview">' + t('audio.preview') + '</span>';
    html += '</div>';

    container.innerHTML = html;
  }

  /* ---------- Waveform Animation ---------- */
  function animateWaveform(waveformEl, playing) {
    var bars = waveformEl.querySelectorAll('.audio-bar');
    bars.forEach(function (bar) {
      if (playing) {
        var duration = (Math.random() * 0.3 + 0.3) + 's';
        bar.style.animation = 'waveformPulse ' + duration + ' ease-in-out infinite alternate';
      } else {
        bar.style.animation = 'none';
      }
    });
  }

  /* ---------- Simulated Playback ---------- */
  function simulatePlay(poemId) {
    var player = document.getElementById('audio-player-' + poemId);
    if (!player) return;

    var playIcon = player.querySelector('.audio-icon-play');
    var pauseIcon = player.querySelector('.audio-icon-pause');
    var timeEl = player.querySelector('.audio-time');
    var waveform = player.querySelector('.audio-waveform');

    // Stop any currently playing
    if (currentlyPlaying && currentlyPlaying !== poemId) {
      stopPlayback(currentlyPlaying);
    }

    // Check if already playing (toggle pause)
    if (player.dataset.playing === 'true') {
      stopPlayback(poemId);
      return;
    }

    // Start playback
    player.dataset.playing = 'true';
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    currentlyPlaying = poemId;
    animateWaveform(waveform, true);
    showStickyBar(poemId);

    var duration = 30;
    var elapsed = 0;

    var interval = setInterval(function () {
      elapsed++;
      var mins = Math.floor(elapsed / 60);
      var secs = elapsed % 60;
      timeEl.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs + ' / 0:30';

      // Update waveform progress
      var progress = elapsed / duration;
      var bars = waveform.querySelectorAll('.audio-bar');
      bars.forEach(function (bar, i) {
        if (i / bars.length <= progress) {
          bar.style.background = 'var(--gold)';
        } else {
          bar.style.background = 'var(--text-muted)';
        }
      });

      if (elapsed >= duration) {
        clearInterval(interval);
        stopPlayback(poemId);
        showUpgradePrompt();
      }
    }, 1000);

    player.dataset.intervalId = interval;
  }

  function stopPlayback(poemId) {
    var player = document.getElementById('audio-player-' + poemId);
    if (!player) return;

    player.dataset.playing = 'false';
    var playIcon = player.querySelector('.audio-icon-play');
    var pauseIcon = player.querySelector('.audio-icon-pause');
    var waveform = player.querySelector('.audio-waveform');

    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    animateWaveform(waveform, false);

    if (player.dataset.intervalId) {
      clearInterval(parseInt(player.dataset.intervalId));
    }

    currentlyPlaying = null;
    hideStickyBar();
  }

  /* ---------- Sticky Now Playing Bar ---------- */
  function showStickyBar(poemId) {
    if (!stickyBar) {
      stickyBar = document.createElement('div');
      stickyBar.className = 'audio-sticky-bar';
      stickyBar.innerHTML = '<div class="audio-sticky-inner">' +
        '<span class="audio-sticky-icon">🎧</span>' +
        '<span class="audio-sticky-text">Now playing preview...</span>' +
        '<button class="audio-sticky-close" aria-label="Stop">✕</button>' +
        '</div>';
      document.body.appendChild(stickyBar);

      stickyBar.querySelector('.audio-sticky-close').addEventListener('click', function () {
        if (currentlyPlaying) stopPlayback(currentlyPlaying);
      });
    }

    stickyBar.classList.add('visible');
    var poem = window.LevyPoems.find(function (p) { return p.id === poemId; });
    if (poem) {
      stickyBar.querySelector('.audio-sticky-text').textContent = '🎧 ' + poem.title + ' — preview';
    }
  }

  function hideStickyBar() {
    if (stickyBar) stickyBar.classList.remove('visible');
  }

  /* ---------- Upgrade Prompt ---------- */
  function showUpgradePrompt() {
    var t = window.LevyI18n.t;
    var modal = document.createElement('div');
    modal.className = 'audio-upgrade-modal';
    modal.innerHTML = '<div class="audio-upgrade-content glass-card">' +
      '<div class="audio-upgrade-icon">🎵</div>' +
      '<h3>' + t('audio.upgradeTitle') + '</h3>' +
      '<p>' + t('audio.upgradeDesc') + '</p>' +
      '<a href="https://cash.app/$cadasiata" target="_blank" rel="noopener" class="cashapp-btn" style="margin-top:1rem;">' +
      '<span>' + t('audio.unlockCta') + '</span></a>' +
      '<button class="audio-upgrade-close">' + t('audio.maybeLater') + '</button>' +
      '</div>';
    document.body.appendChild(modal);

    requestAnimationFrame(function () { modal.classList.add('open'); });

    function close() {
      modal.classList.remove('open');
      setTimeout(function () { modal.remove(); }, 400);
    }

    modal.querySelector('.audio-upgrade-close').addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    // Attach play button events via delegation
    document.addEventListener('click', function (e) {
      var playBtn = e.target.closest('.audio-play-btn');
      if (playBtn) {
        simulatePlay(playBtn.dataset.poem);
      }
    });
  }

  return {
    createPlayer: createPlayer,
    init: init,
    simulatePlay: simulatePlay
  };
})();
