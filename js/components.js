// ====================================================
// GrievAI – Shared Components (components.js)
// Includes: CPGRAMS-style Language Dropdown + Sign In
// ====================================================
(function () {

  var NAV_LINKS = [
    { href:'index.html',       key:'nav.home',        label:'Home'        },
    { href:'about.html',       key:'nav.about',       label:'About'       },
    { href:'departments.html', key:'nav.departments', label:'Departments' },
    { href:'faq.html',         key:'nav.faq',         label:'FAQ'         },
    { href:'help.html',        key:'nav.help',        label:'Help'        },
    { href:'contact.html',     key:'nav.contact',     label:'Contact'     },
    { href:'sitemap.html',     key:'nav.sitemap',     label:'Sitemap'     },
    { href:'security.html',    key:'nav.security',    label:'Security'    }
  ];
  // Note: Login is in top CPGRAMS bar, not nav menu

  // All 22 Indian languages exactly like CPGRAMS
  var CPGRAMS_LANGUAGES = [
    { code:'en',  label:'English'                  },
    { code:'hi',  label:'हिंदी (Hindi)'             },
    { code:'gu',  label:'ગુજરાતી (Gujarati)'        },
    { code:'mr',  label:'मराठी (Marathi)'           },
    { code:'bn',  label:'বাংলা (Bangla)'            },
    { code:'te',  label:'తెలుగు (Telugu)'           },
    { code:'as',  label:'অসমীয়া (Assamese)'        },
    { code:'or',  label:'ଓଡ଼ିଆ (Odia)'              },
    { code:'ta',  label:'தமிழ் (Tamil)'             },
    { code:'ml',  label:'മലയാളം (Malayalam)'        },
    { code:'ur',  label:'اردو (Urdu)'              },
    { code:'sd',  label:'Sindhi'                   },
    { code:'bo',  label:'बोडो (Bodo)'              },
    { code:'kok', label:'कोंकणी (Konkani)'          },
    { code:'ne',  label:'नेपाली (Nepali)'           },
    { code:'mni', label:'Manipuri'                 },
    { code:'pa',  label:'ਪੰਜਾਬੀ (Punjabi)'          },
    { code:'kn',  label:'ಕನ್ನಡ (Kannada)'           },
    { code:'doi', label:'डोगरी (Dogri)'             },
    { code:'mai', label:'मैथिली (Maithili)'         },
    { code:'sa',  label:'संस्कृतम् (Sanskrit)'      },
    { code:'sat', label:'ᱥᱟᱱᱛᱟᱲᱤ (Santali)'       }
  ];

  // ── Get saved language ──────────────────────────
  function getSavedLang() {
    return localStorage.getItem('grievai_lang') || 'en';
  }

  // ── Get language label ──────────────────────────
  function getLangLabel(code) {
    var found = CPGRAMS_LANGUAGES.find(function(l){ return l.code === code; });
    return found ? found.label : 'English';
  }

  // ── Build CPGRAMS-style Language Bar (FIX 3 & 4) ──
  function buildLangSigninBar() {
    var currentLang = getSavedLang();
    var currentLabel = getLangLabel(currentLang);

    var langItems = CPGRAMS_LANGUAGES.map(function(l) {
      return '<li class="cpgrams-lang-item' + (l.code === currentLang ? ' active' : '') + '" ' +
             'data-code="' + l.code + '">' + l.label + '</li>';
    }).join('');

    return (
      '<div class="cpgrams-bar" id="cpgramsBar">' +
        '<div class="cpgrams-bar-inner">' +
          // LEFT: Language
          '<div class="cpgrams-lang-section">' +
            '<span class="cpgrams-lang-label">🌐 Language :</span>' +
            '<div class="cpgrams-dropdown" id="cpgramsDropdown">' +
              '<button class="cpgrams-dropdown-btn" id="cpgramsDropBtn" aria-haspopup="listbox" aria-expanded="false">' +
                '<span class="cpgrams-selected-text" id="cpgramsSelectedText">' + currentLabel + '</span>' +
                '<span class="cpgrams-arrow">▾</span>' +
              '</button>' +
              '<ul class="cpgrams-dropdown-list" id="cpgramsDropList" role="listbox">' +
                langItems +
              '</ul>' +
            '</div>' +
          '</div>' +
          // RIGHT: Login / Sign In button
          '<div class="cpgrams-right-section">' +
            '<a class="cpgrams-signin-btn" href="login.html" id="cpgramsSignIn">' +
              '<span class="cpgrams-signin-icon">➜</span>' +
              '<span class="cpgrams-signin-text">Login / Sign In</span>' +
            '</a>' +
          '</div>' +
        '</div>' +
        // Google Translate hidden element
        '<div id="google_translate_element" style="display:none;"></div>' +
      '</div>'
    );
  }

  // ── Build full header ───────────────────────────
  function buildHeader() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var navItems = NAV_LINKS.map(function(l) {
      return '<li><a href="' + l.href + '" data-i18n="' + l.key + '"' +
             (l.href === current ? ' class="active"' : '') + '>' + l.label + '</a></li>';
    }).join('');

    return buildLangSigninBar() + '\
    <div class="gov-top-bar">\
      <div class="top-bar-inner">\
        <div class="top-links">\
          <a href="#">Skip to Content</a>\
          <a href="#">Screen Reader</a>\
          <a href="sitemap.html">Sitemap</a>\
        </div>\
        <div class="accessibility-links">\
          <button onclick="document.documentElement.style.fontSize=\'13px\'">A-</button>\
          <button onclick="document.documentElement.style.fontSize=\'16px\'">A</button>\
          <button onclick="document.documentElement.style.fontSize=\'19px\'">A+</button>\
        </div>\
      </div>\
    </div>\
    <header class="site-header">\
      <div class="header-main">\
        <div class="header-logo">\
          <div class="emblem-placeholder"><span style="font-size:1.8rem;">🏛️</span></div>\
          <div class="header-title">\
            <span class="ministry-hi">भारत सरकार | लोक शिकायत एवं पेंशन मंत्रालय</span>\
            <span class="ministry-en-main">GrievAI – Citizen Grievance Portal</span>\
            <span class="ministry-en-sub">Ministry of Personnel, Public Grievances &amp; Pensions | Government of India</span>\
          </div>\
        </div>\
        <div class="header-right">\
          <div class="swachh-badge">🇮🇳 Swachh Bharat Mission</div>\
          <div class="portal-name-tag">CPGRAMS • GrievAI</div>\
        </div>\
      </div>\
    </header>\
    <div class="ticker-bar">\
      <div class="ticker-inner">\
        <span class="ticker-label">🔔 NOTICE</span>\
        <div class="ticker-text">\
          <marquee behavior="scroll" direction="left" scrollamount="4" onmouseover="this.stop()" onmouseout="this.start()">\
            New: AI-based auto-classification of complaints now active &nbsp;|&nbsp; Grievance Day every 1st &amp; 3rd Monday &nbsp;|&nbsp; Toll-Free Helpline: 1800-11-7781 &nbsp;|&nbsp; Mobile App on Play Store &amp; App Store\
          </marquee>\
        </div>\
      </div>\
    </div>\
    <nav class="main-nav" role="navigation" aria-label="Main Navigation">\
      <div class="nav-inner">\
        <ul class="nav-menu" id="navMenu">' + navItems + '</ul>\
        <button class="nav-hamburger" id="navHamburger" aria-label="Toggle Navigation" aria-expanded="false" aria-controls="navMenu">\
          <span></span><span></span><span></span>\
        </button>\
      </div>\
    </nav>';
  }

  function buildFooter() {
    return '\
    <footer class="site-footer">\
      <div class="footer-main">\
        <div class="footer-brand">\
          <div class="footer-logo">\
            <span style="font-size:2rem;">🏛️</span>\
            <h3>GrievAI Portal<br><span style="font-size:0.82rem;font-weight:400;color:rgba(255,255,255,0.6);">Government of India</span></h3>\
          </div>\
          <p>An AI-powered Citizen Grievance Redressal System for all 29 States and 8 Union Territories of India.</p>\
        </div>\
        <div class="footer-col">\
          <h4 data-i18n="footer.quicklinks">Quick Links</h4>\
          <ul>\
            <li><a href="index.html" data-i18n="nav.home">Home</a></li>\
            <li><a href="about.html" data-i18n="nav.about">About</a></li>\
            <li><a href="departments.html" data-i18n="nav.departments">Departments</a></li>\
            <li><a href="faq.html" data-i18n="nav.faq">FAQ</a></li>\
            <li><a href="contact.html" data-i18n="nav.contact">Contact</a></li>\
          </ul>\
        </div>\
        <div class="footer-col">\
          <h4 data-i18n="footer.services">Services</h4>\
          <ul>\
            <li><a href="index.html#lodge" data-i18n="btn.lodge">Lodge Complaint</a></li>\
            <li><a href="track.html" data-i18n="btn.track">Track Complaint</a></li>\
            <li><a href="status.html" data-i18n="btn.status">View Status</a></li>\
            <li><a href="dashboard.html">Dashboard</a></li>\
            <li><a href="login.html" data-i18n="nav.login">Login</a></li>\
          </ul>\
        </div>\
        <div class="footer-col">\
          <h4 data-i18n="footer.legal">Legal</h4>\
          <ul>\
            <li><a href="security.html" data-i18n="nav.security">Security</a></li>\
            <li><a href="help.html" data-i18n="nav.help">Help</a></li>\
            <li><a href="sitemap.html" data-i18n="nav.sitemap">Sitemap</a></li>\
            <li><a href="#">RTI Act</a></li>\
          </ul>\
        </div>\
      </div>\
      <div class="footer-bottom">\
        <div class="footer-bottom-inner">\
          <span data-i18n="footer.copy">© 2024 Government of India. All Rights Reserved.</span>\
          <span><a href="security.html">Privacy</a><a href="sitemap.html">Sitemap</a><a href="contact.html">Contact</a></span>\
        </div>\
      </div>\
    </footer>';
  }

  // ── CPGRAMS Dropdown Logic ──────────────────────
  function initCpgramsDropdown() {
    var btn    = document.getElementById('cpgramsDropBtn');
    var list   = document.getElementById('cpgramsDropList');
    var selTxt = document.getElementById('cpgramsSelectedText');
    var drop   = document.getElementById('cpgramsDropdown');

    if (!btn || !list) return;

    // Toggle dropdown open/close
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = drop.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      // Scroll selected item into view
      var active = list.querySelector('.active');
      if (active && isOpen) {
        setTimeout(function(){ active.scrollIntoView({ block:'nearest' }); }, 50);
      }
    });

    // Select language on item click
    list.addEventListener('click', function(e) {
      var item = e.target.closest('.cpgrams-lang-item');
      if (!item) return;

      var code  = item.dataset.code;
      var label = item.textContent.trim();

      // Update UI
      selTxt.textContent = label;
      list.querySelectorAll('.cpgrams-lang-item').forEach(function(el){
        el.classList.remove('active');
      });
      item.classList.add('active');

      // Close dropdown
      drop.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');

      // Save & apply language (i18n labels + Google Translate full page)
      localStorage.setItem('grievai_lang', code);
      if (window.GrievLang) {
        window.GrievLang.setLang(code);
      }
      // Full-page Google Translate
      if (window.GrievTranslate) {
        window.GrievTranslate.setLanguage(code);
      }
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!drop.contains(e.target)) {
        drop.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        drop.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });

    // Keyboard navigation inside list
    list.addEventListener('keydown', function(e) {
      var items = Array.from(list.querySelectorAll('.cpgrams-lang-item'));
      var active = document.activeElement;
      var idx = items.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (items[idx+1]) items[idx+1].focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); if (items[idx-1]) items[idx-1].focus(); }
      if (e.key === 'Enter')     { active.click(); }
    });

    // Make list items focusable
    list.querySelectorAll('.cpgrams-lang-item').forEach(function(item) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'option');
    });
  }

  // ── Hamburger ───────────────────────────────────
  function initHamburger() {
    var hamburger = document.getElementById('navHamburger');
    var navMenu   = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  }

  // ── Main Init ───────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    var headerEl = document.getElementById('site-header-placeholder');
    if (headerEl) headerEl.innerHTML = buildHeader();

    var footerEl = document.getElementById('site-footer-placeholder');
    if (footerEl) footerEl.innerHTML = buildFooter();

    initHamburger();
    setActiveNav();
    initCpgramsDropdown();

    if (window.GrievLang) {
      window.GrievLang.init();
    }
    // Init Google Translate full-page system
    if (window.GrievTranslate) {
      window.GrievTranslate.init();
    }
  });

})();
