// ====================================================
// GrievAI – Components JS (components.js) v3.0
// Builds: Header (Nav LEFT + Lang/Login RIGHT), Footer
// Tasks 2, 3, 4 applied: no CPGRAMS bar, no Google Translate
// ====================================================

(function () {
  'use strict';

  // ── Navigation Links (LEFT side of nav) ──────────
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

  // ── Language list (NO Google Translate – controlled only) ──
  var LANGUAGES = [
    { code:'en',  label:'English'    },
    { code:'hi',  label:'हिन्दी'      },
    { code:'bn',  label:'বাংলা'       },
    { code:'te',  label:'తెలుగు'      },
    { code:'mr',  label:'मराठी'       },
    { code:'ta',  label:'தமிழ்'       },
    { code:'gu',  label:'ગુજરાતી'     },
    { code:'kn',  label:'ಕನ್ನಡ'       },
    { code:'ml',  label:'മലയാളം'      },
    { code:'pa',  label:'ਪੰਜਾਬੀ'      },
    { code:'or',  label:'ଓଡ଼ିଆ'       },
    { code:'ur',  label:'اردو'        }
  ];

  function getSavedLang() {
    return localStorage.getItem('grievai_lang') || 'en';
  }
  function getLangLabel(code) {
    var found = LANGUAGES.find(function(l){ return l.code === code; });
    return found ? found.label : 'English';
  }

  // ── Build Language Dropdown (RIGHT side of nav) ──
  function buildLangDropdown() {
    var cur = getSavedLang();
    var items = LANGUAGES.map(function(l) {
      return '<li class="nav-lang-item' + (l.code === cur ? ' active' : '') +
             '" data-code="' + l.code + '">' + l.label + '</li>';
    }).join('');

    return (
      '<div class="nav-lang-wrap" id="navLangWrap">' +
        '<button class="nav-lang-btn" id="navLangBtn" aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="nav-lang-globe">🌐</span>' +
          '<span class="nav-lang-selected" id="navLangSelected">' + getLangLabel(cur) + '</span>' +
          '<span class="nav-lang-arrow">▾</span>' +
        '</button>' +
        '<ul class="nav-lang-list" id="navLangList" role="listbox">' + items + '</ul>' +
      '</div>'
    );
  }

  // ── Build full header ─────────────────────────────
  function buildHeader() {
    var current = window.location.pathname.split('/').pop() || 'index.html';

    var navItems = NAV_LINKS.map(function(l) {
      return '<li><a href="' + l.href + '" data-i18n="' + l.key + '"' +
             (l.href === current ? ' class="active"' : '') + '>' + l.label + '</a></li>';
    }).join('');

    return (
      // ── Accessibility bar ──
      '<div class="gov-top-bar">' +
        '<div class="top-bar-inner">' +
          '<div class="top-links">' +
            '<a href="#">Skip to Content</a>' +
            '<a href="#">Screen Reader</a>' +
            '<a href="sitemap.html">Sitemap</a>' +
          '</div>' +
          '<div class="accessibility-links">' +
            '<button onclick="document.documentElement.style.fontSize=\'13px\'">A-</button>' +
            '<button onclick="document.documentElement.style.fontSize=\'16px\'">A</button>' +
            '<button onclick="document.documentElement.style.fontSize=\'19px\'">A+</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // ── Logo + Ministry ──
      '<header class="site-header">' +
        '<div class="header-main">' +
          '<div class="header-logo">' +
            '<div class="emblem-placeholder"><span style="font-size:1.8rem;">🏛️</span></div>' +
            '<div class="header-title">' +
              '<span class="ministry-hi">भारत सरकार | लोक शिकायत एवं पेंशन मंत्रालय</span>' +
              '<span class="ministry-en-main">GrievAI – Citizen Grievance Portal</span>' +
              '<span class="ministry-en-sub">Ministry of Personnel, Public Grievances &amp; Pensions | Government of India</span>' +
            '</div>' +
          '</div>' +
          '<div class="header-right">' +
            '<div class="swachh-badge">🇮🇳 Swachh Bharat Mission</div>' +
            '<div class="portal-name-tag">CPGRAMS • GrievAI</div>' +
          '</div>' +
        '</div>' +
      '</header>' +

      // ── Ticker ──
      '<div class="ticker-bar">' +
        '<div class="ticker-inner">' +
          '<span class="ticker-label">🔔 NOTICE</span>' +
          '<div class="ticker-text">' +
            '<marquee behavior="scroll" direction="left" scrollamount="4" onmouseover="this.stop()" onmouseout="this.start()">' +
              'New: AI-based auto-classification of complaints now active &nbsp;|&nbsp; Grievance Day every 1st &amp; 3rd Monday &nbsp;|&nbsp; Toll-Free Helpline: 1800-11-7781 &nbsp;|&nbsp; Mobile App on Play Store &amp; App Store' +
            '</marquee>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // ── MAIN NAV: Left links + Right (Language + Login) ──
      '<nav class="main-nav" role="navigation" aria-label="Main Navigation">' +
        '<div class="nav-inner">' +

          // LEFT: nav links
          '<ul class="nav-menu" id="navMenu">' + navItems + '</ul>' +

          // RIGHT: Language dropdown + Login btn
          '<div class="nav-right-controls">' +
            buildLangDropdown() +
            '<div class="nav-divider"></div>' +
            '<a class="nav-login-btn" href="login.html">' +
              '<span>➜</span> Login / Sign In' +
            '</a>' +
          '</div>' +

          // Hamburger (mobile)
          '<button class="nav-hamburger" id="navHamburger" aria-label="Toggle Navigation" aria-expanded="false" aria-controls="navMenu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +

        '</div>' +
      '</nav>'
    );
  }

  // ── Build Footer ──────────────────────────────────
  function buildFooter() {
    return (
      '<footer class="site-footer">' +
        '<div class="footer-main">' +
          '<div class="footer-brand">' +
            '<div class="footer-logo">' +
              '<span style="font-size:2rem;">🏛️</span>' +
              '<h3>GrievAI Portal<br><span style="font-size:0.82rem;font-weight:400;color:rgba(255,255,255,0.6);">Government of India</span></h3>' +
            '</div>' +
            '<p>An AI-powered Citizen Grievance Redressal System for all 29 States and 8 Union Territories of India.</p>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4 data-i18n="footer.quicklinks">Quick Links</h4>' +
            '<ul>' +
              '<li><a href="index.html">Home</a></li>' +
              '<li><a href="about.html">About</a></li>' +
              '<li><a href="departments.html">Departments</a></li>' +
              '<li><a href="faq.html">FAQ</a></li>' +
              '<li><a href="contact.html">Contact</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Services</h4>' +
            '<ul>' +
              '<li><a href="index.html#lodge">Lodge Complaint</a></li>' +
              '<li><a href="track.html">Track Complaint</a></li>' +
              '<li><a href="status.html">Check Status</a></li>' +
              '<li><a href="dashboard.html">Dashboard</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Contact</h4>' +
            '<ul>' +
              '<li>📞 1800-11-7781</li>' +
              '<li>✉️ grievances@gov.in</li>' +
              '<li>🕐 Mon–Fri, 9 AM–6 PM</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>© 2025 GrievAI – Government of India. All rights reserved.</p>' +
          '<p>Designed &amp; developed under Digital India Initiative</p>' +
        '</div>' +
      '</footer>'
    );
  }

  // ── Bind Language Dropdown ────────────────────────
  function bindLangDropdown() {
    var btn  = document.getElementById('navLangBtn');
    var list = document.getElementById('navLangList');
    var wrap = document.getElementById('navLangWrap');
    if (!btn || !list) return;

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = list.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });

    list.addEventListener('click', function(e) {
      var li = e.target.closest('.nav-lang-item');
      if (!li) return;
      var code = li.dataset.code;

      // Update UI
      list.querySelectorAll('.nav-lang-item').forEach(function(el){ el.classList.remove('active'); });
      li.classList.add('active');
      var sel = document.getElementById('navLangSelected');
      if (sel) sel.textContent = li.textContent;

      // Save & apply via GrievLang i18n ONLY (no Google Translate)
      localStorage.setItem('grievai_lang', code);
      if (window.GrievLang) window.GrievLang.setLang(code);

      list.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', function(e) {
      if (!wrap.contains(e.target)) {
        list.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Bind Hamburger ────────────────────────────────
  function bindHamburger() {
    var ham  = document.getElementById('navHamburger');
    var menu = document.getElementById('navMenu');
    if (!ham || !menu) return;
    ham.addEventListener('click', function() {
      var open = menu.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
    });
  }

  // ── Init ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var headerEl = document.getElementById('siteHeader');
    var footerEl = document.getElementById('siteFooter');
    if (headerEl) headerEl.innerHTML = buildHeader();
    if (footerEl) footerEl.innerHTML = buildFooter();

    bindLangDropdown();
    bindHamburger();

    // Apply saved i18n language (controlled only, no auto-translate)
    if (window.GrievLang) window.GrievLang.init();
  });

})();
