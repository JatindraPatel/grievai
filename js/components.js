// ====================================================
// GrievAI – Shared Components (components.js)
// Fixed hamburger + data-i18n + lang init
// ====================================================
(function () {

  var NAV_LINKS = [
    { href:'index.html',       key:'nav.home'        },
    { href:'about.html',       key:'nav.about'       },
    { href:'departments.html', key:'nav.departments'  },
    { href:'faq.html',         key:'nav.faq'         },
    { href:'help.html',        key:'nav.help'        },
    { href:'contact.html',     key:'nav.contact'     },
    { href:'sitemap.html',     key:'nav.sitemap'     },
    { href:'security.html',    key:'nav.security'    },
    { href:'login.html',       key:'nav.login'       }
  ];

  function buildHeader() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var navItems = NAV_LINKS.map(function(l) {
      return '<li><a href="' + l.href + '" data-i18n="' + l.key + '"' +
             (l.href === current ? ' class="active"' : '') + '></a></li>';
    }).join('');

    return '\
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
          <p>An AI-powered Citizen Grievance Redressal System for all 29 States and 8 Union Territories of India. Ensuring transparent, timely, and accountable government service delivery.</p>\
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

  document.addEventListener('DOMContentLoaded', function() {
    var headerEl = document.getElementById('site-header-placeholder');
    if (headerEl) headerEl.innerHTML = buildHeader();

    var footerEl = document.getElementById('site-footer-placeholder');
    if (footerEl) footerEl.innerHTML = buildFooter();

    initHamburger();
    setActiveNav();

    if (window.GrievLang) {
      window.GrievLang.init();
    }
  });

})();
