/* ============================================
   WORDS THAT HEAL — i18n TRANSLATION SYSTEM
   Languages: English, Spanish, Mandarin, Swahili
   ============================================ */

window.LevyI18n = (function () {
  const translations = {
    /* ===================== ENGLISH ===================== */
    en: {
      // Nav
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.poetry': 'Poetry',
      'nav.gallery': 'Gallery',
      'nav.merch': 'Merch',
      'nav.support': 'Support',

      // Hero
      'hero.tagline': 'Words That Heal. Art That Speaks.',
      'hero.cta': 'Read Her Poetry',
      'hero.quote': '"Just breathe love, you\'re doing your absolute best"',

      // Daily Verse
      'daily.label': 'Daily Verse',
      'daily.share': 'Share this verse',

      // About
      'about.label': 'About the Poet',
      'about.name': 'Cadasia Levy',
      'about.bio': 'Cadasia Levy is a poet, artist, and the voice behind Words That Heal. Her words cut through the noise and speak directly to the soul — exploring the raw edges of love, loss, faith, and self-discovery.',
      'about.bio2': 'Through her poetry and art, Cadasia transforms pain into power and vulnerability into strength. Each piece is a mirror, a prayer, and a promise that you are not alone in what you feel.',

      // Poetry
      'poetry.title': 'Poetry Collection',
      'poetry.subtitle': 'Words written from the heart, for the heart',
      'poetry.readMore': 'Read poem →',
      'poetry.close': 'Close',
      'poetry.share': 'Share',
      'poetry.listen': 'Listen',
      'poetry.preview': 'Preview',
      'poetry.fullPoem': 'Full poem available with audio download',
      'poetry.teaserNote': '— Preview ends here. Support Cadasia to read the full poem & download audio.',

      // Gallery
      'gallery.title': 'Art Gallery',
      'gallery.subtitle': 'Visual stories that speak without words',
      'gallery.view': 'View',
      'gallery.breathe': 'Breathe — Finding peace in the storm',
      'gallery.escape': 'Can I Escape — Breaking free',
      'gallery.howcouldyou': 'How Could You — Broken bonds',
      'gallery.amithereason': 'Am I the Reason — Self-reflection',
      'gallery.ideaofme': 'The Idea of Me — Beyond the surface',

      // Audio
      'audio.preview': 'Preview',
      'audio.upgradeTitle': 'Love what you hear?',
      'audio.upgradeDesc': 'Support Cadasia to unlock full audio poems, downloads, and early access to new work.',
      'audio.unlockCta': 'Support via CashApp',
      'audio.maybeLater': 'Maybe later',
      'audio.listenPreview': 'Listen preview',

      // Merch
      'merch.title': 'Merch & Art',
      'merch.subtitle': 'Carry her words with you',
      'merch.book.title': 'Words That Heal — Poetry Book',
      'merch.book.desc': 'The complete collection of Cadasia\'s poetry in a beautifully designed book.',
      'merch.tshirt.title': '"Just Breathe" Tee',
      'merch.tshirt.desc': 'Premium black tee with gold foil signature quote. Unisex fit.',
      'merch.mug.title': '"Just Breathe" Mug',
      'merch.mug.desc': 'Start your mornings with a reminder to breathe. Ceramic, 11oz.',
      'merch.artprint.title': 'Poetry Art Print',
      'merch.artprint.desc': 'Gold typography art print featuring poetry excerpts. Gallery quality.',
      'merch.comingSoon': 'Coming Soon',

      // Support
      'support.title': 'Support the Art',
      'support.subtitle': 'Fuel the fire. Every dollar supports Cadasia\'s creative journey.',
      'support.description': 'Your support helps bring more poetry, more art, and more healing into the world. Every contribution matters — whether it\'s a dollar or a share.',
      'support.cta': 'Send Love via CashApp',
      'support.tag': '$cadasiata',

      // Newsletter
      'newsletter.title': 'Get New Poems First',
      'newsletter.subtitle': 'Join the inner circle. Be the first to read new work, get early merch drops, and exclusive audio.',
      'newsletter.placeholder': 'Enter your email',
      'newsletter.cta': 'Join',
      'newsletter.privacy': 'No spam. Unsubscribe anytime.',
      'newsletter.thanks': 'Welcome to the family',

      // Book Announcement
      'book.label': 'Coming Soon',
      'book.title': 'The Book Is Coming',
      'book.desc': 'Cadasia\'s debut poetry collection — raw, unfiltered, and beautiful. Be the first to know when it drops.',
      'book.cta': 'Notify Me',

      // Footer
      'footer.copyright': '© 2026 Words That Heal by Cadasia Levy. All rights reserved.',
      'footer.madeWith': 'Made with',
      'footer.forArt': 'for the art',

      // Language names
      'lang.en': 'English',
      'lang.es': 'Español',
      'lang.zh': '中文',
      'lang.sw': 'Kiswahili'
    },

    /* ===================== SPANISH ===================== */
    es: {
      'nav.home': 'Inicio',
      'nav.about': 'Sobre',
      'nav.poetry': 'Poesía',
      'nav.gallery': 'Galería',
      'nav.merch': 'Tienda',
      'nav.support': 'Apoyar',

      'hero.tagline': 'Palabras Que Sanan. Arte Que Habla.',
      'hero.cta': 'Lee Su Poesía',
      'hero.quote': '"Solo respira amor, estás dando lo mejor de ti"',

      'daily.label': 'Verso del Día',
      'daily.share': 'Comparte este verso',

      'about.label': 'Sobre la Poeta',
      'about.name': 'Cadasia Levy',
      'about.bio': 'Cadasia Levy es una poeta, artista, y la voz detrás de Words That Heal. Sus palabras atraviesan el ruido y hablan directamente al alma — explorando los bordes crudos del amor, la pérdida, la fe y el autodescubrimiento.',
      'about.bio2': 'A través de su poesía y arte, Cadasia transforma el dolor en poder y la vulnerabilidad en fortaleza. Cada pieza es un espejo, una oración y una promesa de que no estás solo en lo que sientes.',

      'poetry.title': 'Colección de Poesía',
      'poetry.subtitle': 'Palabras escritas desde el corazón, para el corazón',
      'poetry.readMore': 'Leer poema →',
      'poetry.close': 'Cerrar',
      'poetry.share': 'Compartir',
      'poetry.listen': 'Escuchar',
      'poetry.preview': 'Vista previa',
      'poetry.fullPoem': 'Poema completo disponible con descarga de audio',
      'poetry.teaserNote': '— La vista previa termina aquí. Apoya a Cadasia para leer el poema completo.',

      'gallery.title': 'Galería de Arte',
      'gallery.subtitle': 'Historias visuales que hablan sin palabras',
      'gallery.view': 'Ver',
      'gallery.breathe': 'Respira — Encontrando paz en la tormenta',
      'gallery.escape': '¿Puedo Escapar? — Liberándose',
      'gallery.howcouldyou': '¿Cómo Pudiste? — Lazos rotos',
      'gallery.amithereason': '¿Soy Yo la Razón? — Autorreflexión',
      'gallery.ideaofme': 'La Idea de Mí — Más allá de la superficie',

      'audio.preview': 'Vista previa',
      'audio.upgradeTitle': '¿Te gusta lo que escuchas?',
      'audio.upgradeDesc': 'Apoya a Cadasia para desbloquear poemas completos en audio, descargas y acceso anticipado.',
      'audio.unlockCta': 'Apoyar vía CashApp',
      'audio.maybeLater': 'Quizás luego',
      'audio.listenPreview': '▶ Escuchar vista previa',

      'merch.title': 'Tienda y Arte',
      'merch.subtitle': 'Lleva sus palabras contigo',
      'merch.book.title': 'Palabras Que Sanan — Libro de Poesía',
      'merch.book.desc': 'La colección completa de la poesía de Cadasia en un libro bellamente diseñado.',
      'merch.tshirt.title': 'Camiseta "Solo Respira"',
      'merch.tshirt.desc': 'Camiseta negra premium con cita en lámina dorada. Corte unisex.',
      'merch.mug.title': 'Taza "Solo Respira"',
      'merch.mug.desc': 'Empieza tus mañanas con un recordatorio para respirar. Cerámica, 330ml.',
      'merch.artprint.title': 'Impresión Artística de Poesía',
      'merch.artprint.desc': 'Impresión artística con tipografía dorada. Calidad de galería.',
      'merch.comingSoon': 'Próximamente',

      'support.title': 'Apoya el Arte',
      'support.subtitle': 'Alimenta el fuego. Cada dólar apoya el viaje creativo de Cadasia.',
      'support.description': 'Tu apoyo ayuda a traer más poesía, más arte y más sanación al mundo.',
      'support.cta': 'Enviar Amor por CashApp',
      'support.tag': '$cadasiata',

      'newsletter.title': 'Recibe Poemas Primero',
      'newsletter.subtitle': 'Únete al círculo íntimo. Sé el primero en leer obra nueva y acceso exclusivo.',
      'newsletter.placeholder': 'Tu correo electrónico',
      'newsletter.cta': 'Unirse',
      'newsletter.privacy': 'Sin spam. Cancela cuando quieras.',
      'newsletter.thanks': 'Bienvenida a la familia ✦',

      'book.label': 'Próximamente',
      'book.title': 'El Libro Viene',
      'book.desc': 'La primera colección de poesía de Cadasia — cruda, sin filtros y hermosa.',
      'book.cta': 'Notifícame',

      'footer.copyright': '© 2026 Words That Heal por Cadasia Levy. Todos los derechos reservados.',
      'footer.madeWith': 'Hecho con',
      'footer.forArt': 'para el arte',

      'lang.en': 'English', 'lang.es': 'Español', 'lang.zh': '中文', 'lang.sw': 'Kiswahili'
    },

    /* ===================== MANDARIN CHINESE ===================== */
    zh: {
      'nav.home': '首页',
      'nav.about': '关于',
      'nav.poetry': '诗歌',
      'nav.gallery': '画廊',
      'nav.merch': '商店',
      'nav.support': '支持',

      'hero.tagline': '治愈的文字。会说话的艺术。',
      'hero.cta': '阅读她的诗歌',
      'hero.quote': '"只管呼吸吧亲爱的，你已经做到最好了"',

      'daily.label': '每日诗句',
      'daily.share': '分享这句诗',

      'about.label': '关于诗人',
      'about.name': 'Cadasia Levy',
      'about.bio': 'Cadasia Levy 是一位诗人、艺术家，也是"治愈之言"品牌的声音。她的文字穿透喧嚣，直达灵魂深处——探索爱、失去、信仰和自我发现的原始边缘。',
      'about.bio2': '通过她的诗歌和艺术，Cadasia 将痛苦转化为力量，将脆弱转化为坚强。每一首诗都是一面镜子、一个祈祷、一个承诺——你所感受到的，你并不孤单。',

      'poetry.title': '诗歌集',
      'poetry.subtitle': '从心出发，为心而写',
      'poetry.readMore': '阅读诗歌 →',
      'poetry.close': '关闭',
      'poetry.share': '分享',
      'poetry.listen': '聆听',
      'poetry.preview': '预览',
      'poetry.fullPoem': '完整诗歌可通过音频下载获得',
      'poetry.teaserNote': '——预览到此结束。支持 Cadasia 阅读完整诗歌并下载音频。',

      'gallery.title': '艺术画廊',
      'gallery.subtitle': '无声的视觉故事',
      'gallery.view': '查看',
      'gallery.breathe': '呼吸——在风暴中寻找平静',
      'gallery.escape': '我能逃脱吗——突破束缚',
      'gallery.howcouldyou': '你怎么能——破碎的纽带',
      'gallery.amithereason': '是我的原因吗——自我反思',
      'gallery.ideaofme': '我的假象——超越表面',

      'audio.preview': '预览',
      'audio.upgradeTitle': '喜欢你听到的吗？',
      'audio.upgradeDesc': '支持 Cadasia 解锁完整音频诗歌、下载和新作品的早期访问。',
      'audio.unlockCta': '通过 CashApp 支持',
      'audio.maybeLater': '稍后再说',
      'audio.listenPreview': '▶ 试听预览',

      'merch.title': '周边与艺术',
      'merch.subtitle': '将她的文字随身携带',
      'merch.book.title': '治愈之言——诗集',
      'merch.book.desc': 'Cadasia 诗歌的完整合集。',
      'merch.tshirt.title': '"只管呼吸" T恤',
      'merch.tshirt.desc': '高级黑色T恤，金箔标志性引语。',
      'merch.mug.title': '"只管呼吸" 马克杯',
      'merch.mug.desc': '用呼吸的提醒开始每个早晨。',
      'merch.artprint.title': '诗歌艺术印刷品',
      'merch.artprint.desc': '金色排版艺术印刷品。',
      'merch.comingSoon': '即将推出',

      'support.title': '支持艺术',
      'support.subtitle': '每一美元都支持 Cadasia 的创作之旅。',
      'support.description': '您的支持帮助为世界带来更多诗歌、更多艺术和更多治愈。',
      'support.cta': '通过 CashApp 送出关爱',
      'support.tag': '$cadasiata',

      'newsletter.title': '率先获取新诗',
      'newsletter.subtitle': '加入内部圈子。率先阅读新作品和独家音频。',
      'newsletter.placeholder': '输入您的邮箱',
      'newsletter.cta': '加入',
      'newsletter.privacy': '无垃圾邮件。随时取消。',
      'newsletter.thanks': '欢迎加入大家庭 ✦',

      'book.label': '即将推出',
      'book.title': '诗集即将问世',
      'book.desc': 'Cadasia 的首部诗集——原始、真实、美丽。',
      'book.cta': '通知我',

      'footer.copyright': '© 2026 Words That Heal by Cadasia Levy. 版权所有。',
      'footer.madeWith': '用',
      'footer.forArt': '为艺术而作',

      'lang.en': 'English', 'lang.es': 'Español', 'lang.zh': '中文', 'lang.sw': 'Kiswahili'
    },

    /* ===================== SWAHILI ===================== */
    sw: {
      'nav.home': 'Nyumbani',
      'nav.about': 'Kuhusu',
      'nav.poetry': 'Ushairi',
      'nav.gallery': 'Jumba la Sanaa',
      'nav.merch': 'Duka',
      'nav.support': 'Saidia',

      'hero.tagline': 'Maneno Yanayoponya. Sanaa Inayozungumza.',
      'hero.cta': 'Soma Ushairi Wake',
      'hero.quote': '"Pumzika tu mpenzi, unafanya vizuri kabisa"',

      'daily.label': 'Shairi la Leo',
      'daily.share': 'Shiriki shairi hili',

      'about.label': 'Kuhusu Mshairi',
      'about.name': 'Cadasia Levy',
      'about.bio': 'Cadasia Levy ni mshairi, msanii, na sauti nyuma ya Words That Heal. Maneno yake yanakata kelele na kuzungumza moja kwa moja na roho — ikichunguza makali ya upendo, kupoteza, imani, na kujigundua.',
      'about.bio2': 'Kupitia ushairi na sanaa yake, Cadasia anabadilisha maumivu kuwa nguvu na udhaifu kuwa ujasiri. Kila kipande ni kioo, dua, na ahadi kwamba huko si peke yako.',

      'poetry.title': 'Mkusanyiko wa Ushairi',
      'poetry.subtitle': 'Maneno yaliyoandikwa kutoka moyoni, kwa moyo',
      'poetry.readMore': 'Soma shairi →',
      'poetry.close': 'Funga',
      'poetry.share': 'Shiriki',
      'poetry.listen': 'Sikiliza',
      'poetry.preview': 'Onyesho',
      'poetry.fullPoem': 'Shairi kamili inapatikana kwa kupakua sauti',
      'poetry.teaserNote': '— Onyesho linaishia hapa. Saidia Cadasia kusoma shairi kamili.',

      'gallery.title': 'Jumba la Sanaa',
      'gallery.subtitle': 'Hadithi za kuona zinazozungumza bila maneno',
      'gallery.view': 'Tazama',
      'gallery.breathe': 'Pumzika — Kupata amani katika dhoruba',
      'gallery.escape': 'Je, Naweza Kutoroka — Kujitoa huru',
      'gallery.howcouldyou': 'Ungewezaje — Vifungo vilivyovunjika',
      'gallery.amithereason': 'Je, Mimi Ndio Sababu — Kujitafakari',
      'gallery.ideaofme': 'Wazo la Mimi — Zaidi ya uso',

      'audio.preview': 'Onyesho',
      'audio.upgradeTitle': 'Unapenda unachosikia?',
      'audio.upgradeDesc': 'Saidia Cadasia kufungua mashairi kamili ya sauti na upakuaji.',
      'audio.unlockCta': 'Saidia kupitia CashApp',
      'audio.maybeLater': 'Labda baadaye',
      'audio.listenPreview': '▶ Sikiliza onyesho',

      'merch.title': 'Duka na Sanaa',
      'merch.subtitle': 'Beba maneno yake nawe',
      'merch.book.title': 'Maneno Yanayoponya — Kitabu',
      'merch.book.desc': 'Mkusanyiko kamili wa ushairi wa Cadasia.',
      'merch.tshirt.title': 'Fulana "Pumzika Tu"',
      'merch.tshirt.desc': 'Fulana nyeusi ya hali ya juu.',
      'merch.mug.title': 'Kikombe "Pumzika Tu"',
      'merch.mug.desc': 'Anza asubuhi yako na ukumbusho.',
      'merch.artprint.title': 'Uchapishaji wa Sanaa',
      'merch.artprint.desc': 'Uchapishaji wa sanaa yenye fonti ya dhahabu.',
      'merch.comingSoon': 'Inakuja Hivi Karibuni',

      'support.title': 'Saidia Sanaa',
      'support.subtitle': 'Kila dola inasaidia safari ya ubunifu ya Cadasia.',
      'support.description': 'Msaada wako unasaidia kuleta ushairi zaidi, sanaa zaidi, na uponyaji zaidi.',
      'support.cta': 'Tuma Upendo kupitia CashApp',
      'support.tag': '$cadasiata',

      'newsletter.title': 'Pata Mashairi Mapya Kwanza',
      'newsletter.subtitle': 'Jiunge na mduara wa ndani. Kuwa wa kwanza kusoma kazi mpya.',
      'newsletter.placeholder': 'Ingiza barua pepe yako',
      'newsletter.cta': 'Jiunge',
      'newsletter.privacy': 'Hakuna barua taka. Jiondoe wakati wowote.',
      'newsletter.thanks': 'Karibu katika familia ✦',

      'book.label': 'Inakuja Hivi Karibuni',
      'book.title': 'Kitabu Kinakuja',
      'book.desc': 'Mkusanyiko wa kwanza wa ushairi wa Cadasia — halisi na mzuri.',
      'book.cta': 'Nijulishe',

      'footer.copyright': '© 2026 Words That Heal na Cadasia Levy. Haki zote zimehifadhiwa.',
      'footer.madeWith': 'Imetengenezwa kwa',
      'footer.forArt': 'kwa sanaa',

      'lang.en': 'English', 'lang.es': 'Español', 'lang.zh': '中文', 'lang.sw': 'Kiswahili'
    }
  };

  let currentLang = localStorage.getItem('levy-lang') || 'en';

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key])
      || (translations.en && translations.en[key])
      || key;
  }

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('levy-lang', lang);
    updatePage();
  }

  function getLanguage() { return currentLang; }

  function updatePage() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    document.documentElement.lang = currentLang;

    document.querySelectorAll('.lang-option').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    var langBtn = document.querySelector('.lang-btn-label');
    if (langBtn) langBtn.textContent = t('lang.' + currentLang);
  }

  return { t: t, setLanguage: setLanguage, getLanguage: getLanguage, updatePage: updatePage };
})();
