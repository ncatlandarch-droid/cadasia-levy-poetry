/* ═══════════════════════════════════════════════════════════
   Analytics Tracker — Words That Heal
   Tracks pageviews to Firestore for the admin dashboard.
   Pattern: Matches RTTL analytics.js exactly.
   ═══════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  // Skip admin pages and bots
  if (window.location.pathname.includes('admin')) return;
  if (navigator.userAgent && /bot|crawl|spider|slurp/i.test(navigator.userAgent)) return;

  // Firebase config (same project as admin)
  var firebaseConfig = {
    apiKey: "AIzaSyD4jA66i0djZ6aSFLH3aVa-YgeNRfzo2bA",
    authDomain: "words-that-heal-40e36.firebaseapp.com",
    projectId: "words-that-heal-40e36",
    storageBucket: "words-that-heal-40e36.firebasestorage.app",
    messagingSenderId: "1030628574574",
    appId: "1:1030628574574:web:f865c499d6d50c4276ad7f"
  };

  // Load Firebase SDKs dynamically
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js', function() {
      loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js', function() {
        // Delay tracking so it doesn't block page rendering
        setTimeout(trackPageview, 1000);
      });
    });
  }

  function trackPageview() {
    try {
      // Initialize as SEPARATE Firebase app to avoid conflicts
      var app;
      try {
        app = firebase.app('wth-analytics');
      } catch (e) {
        app = firebase.initializeApp(firebaseConfig, 'wth-analytics');
      }
      var db = app.firestore();

      // Persistent visitor ID
      var visitorId = localStorage.getItem('wth_vid');
      if (!visitorId) {
        visitorId = 'v_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('wth_vid', visitorId);
      }

      // Session dedup — only one pageview per page per session
      var pageKey = 'wth_pv_' + window.location.pathname;
      if (sessionStorage.getItem(pageKey)) return;
      sessionStorage.setItem(pageKey, '1');

      // Page name
      var path = window.location.pathname;
      var pageName = path === '/' || path === '/index.html' ? '/' : path;

      // Referrer source
      var source = 'Direct';
      if (document.referrer) {
        try {
          var ref = new URL(document.referrer);
          if (ref.hostname !== window.location.hostname) {
            source = ref.hostname.replace('www.', '');
          } else {
            source = 'Direct';
          }
        } catch (e) {
          source = 'Direct';
        }
      }

      // Date key
      var now = new Date();
      var dateKey = now.toISOString().split('T')[0];

      // Language
      var lang = 'en';

      // Write 1: Individual event document (uses create: if true rule)
      db.collection('analytics/pageviews/events').add({
        page: pageName,
        source: source,
        visitorId: visitorId,
        date: dateKey,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent.substr(0, 100),
        screenWidth: window.screen.width,
        language: lang
      }).catch(function(e) {
        console.debug('WTH Analytics event write failed:', e.message);
      });

      // Write 2: Daily aggregation (may fail for anon users — that's OK)
      var summaryRef = db.doc('analytics/daily/' + dateKey + '/summary');
      var pageField = 'pages.' + pageName.replace(/\//g, '_');
      var sourceField = 'sources.' + source.replace(/\./g, '_');
      var updateData = {
        date: dateKey,
        pageviews: firebase.firestore.FieldValue.increment(1)
      };
      updateData[pageField] = firebase.firestore.FieldValue.increment(1);
      updateData[sourceField] = firebase.firestore.FieldValue.increment(1);

      summaryRef.set(updateData, { merge: true }).catch(function(e) {
        console.debug('WTH Analytics daily aggregate failed:', e.message);
      });

    } catch (e) {
      console.debug('WTH Analytics error:', e.message);
    }
  }

  // Start after page load
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
