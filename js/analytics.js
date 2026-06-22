/* ═══════════════════════════════════════════════════════════
   Analytics Tracker — Words That Heal
   Tracks pageviews to Firestore for the admin dashboard.
   Include on all public pages via <script src="js/analytics.js"></script>
   ═══════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  // Skip admin pages and bots
  if (window.location.pathname.includes('admin')) return;
  if (navigator.userAgent && /bot|crawl|spider|slurp/i.test(navigator.userAgent)) return;

  // Firebase config (same as admin)
  var firebaseConfig = {
    apiKey: "AIzaSyD4jA66i0djZ6aSFLH3aVa-YgeNRfzo2bA",
    authDomain: "words-that-heal-40e36.firebaseapp.com",
    projectId: "words-that-heal-40e36",
    storageBucket: "words-that-heal-40e36.firebasestorage.app",
    messagingSenderId: "1030628574574",
    appId: "1:1030628574574:web:f865c499d6d50c4276ad7f"
  };

  // Load Firebase SDKs dynamically (minimal footprint)
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js', function() {
      loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js', function() {
        trackPageview();
      });
    });
  }

  function trackPageview() {
    // Initialize Firebase (if not already)
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();

    // Get or create persistent visitor ID
    var visitorId = localStorage.getItem('wth_vid');
    if (!visitorId) {
      visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('wth_vid', visitorId);
    }

    // Session dedup — only count one pageview per page per session
    var pageKey = 'wth_pv_' + window.location.pathname;
    if (sessionStorage.getItem(pageKey)) return;
    sessionStorage.setItem(pageKey, '1');

    // Determine page name
    var path = window.location.pathname;
    var pageName = path === '/' || path === '/index.html' ? 'Home' : path.replace(/\//g, '').replace('.html', '');

    // Get referrer source
    var source = 'direct';
    if (document.referrer) {
      try {
        var ref = new URL(document.referrer);
        if (ref.hostname !== window.location.hostname) {
          source = ref.hostname.replace('www.', '');
        } else {
          source = 'internal';
        }
      } catch (e) {
        source = 'unknown';
      }
    }

    // Get language from URL hash or browser
    var lang = 'en';
    var hash = window.location.hash;
    if (hash.includes('lang=es')) lang = 'es';
    else if (hash.includes('lang=zh')) lang = 'zh';
    else if (hash.includes('lang=sw')) lang = 'sw';

    // Write pageview event
    var now = new Date();
    var dateKey = now.toISOString().split('T')[0]; // YYYY-MM-DD

    db.collection('analytics/pageviews/events').add({
      page: pageName,
      path: path,
      source: source,
      visitorId: visitorId,
      language: lang,
      date: dateKey,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent.substr(0, 200),
      screenWidth: window.screen.width,
      country: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'
    }).catch(function() {
      // Silently fail — analytics should never break the site
    });

    // Increment daily aggregation counter
    var summaryRef = db.doc('analytics/daily/' + dateKey + '/summary');
    db.runTransaction(function(transaction) {
      return transaction.get(summaryRef).then(function(doc) {
        if (doc.exists) {
          var data = doc.data();
          var visitors = data.visitors || [];
          var isNewVisitor = visitors.indexOf(visitorId) === -1;
          var updates = {
            pageviews: (data.pageviews || 0) + 1
          };
          if (isNewVisitor) {
            updates.uniqueVisitors = (data.uniqueVisitors || 0) + 1;
            visitors.push(visitorId);
            // Cap visitor list at 500 to prevent doc bloat
            if (visitors.length > 500) visitors = visitors.slice(-500);
            updates.visitors = visitors;
          }
          transaction.update(summaryRef, updates);
        } else {
          transaction.set(summaryRef, {
            date: dateKey,
            pageviews: 1,
            uniqueVisitors: 1,
            visitors: [visitorId]
          });
        }
      });
    }).catch(function() {
      // Silently fail
    });
  }

  // Start tracking after page load
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
