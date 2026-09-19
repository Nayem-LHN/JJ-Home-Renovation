/* J&J Home Renovations - main.js */
(function () {
  'use strict';

  var body = document.body;

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  var onScrollHeader = function () {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.drawer');
  var scrim = document.querySelector('.scrim');
  var closeNav = function () {
    if (toggle) toggle.classList.remove('open');
    if (drawer) drawer.classList.remove('open');
    if (scrim) scrim.classList.remove('show');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
  };
  var openNav = function () {
    if (toggle) toggle.classList.add('open');
    if (drawer) drawer.classList.add('open');
    if (scrim) scrim.classList.add('show');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('no-scroll');
  };
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      drawer.classList.contains('open') ? closeNav() : openNav();
    });
    if (scrim) scrim.addEventListener('click', closeNav);
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }
  if (!body.classList.contains('no-scroll')) {
    var _s = document.createElement('style');
    _s.textContent = '.no-scroll{overflow:hidden}';
    document.head.appendChild(_s);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          var d = en.target.getAttribute('data-delay');
          if (d) en.target.style.transitionDelay = d * 120 + 'ms';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Hero entrance ---------- */
  document.querySelectorAll('.hero .reveal-hero').forEach(function (el) {
    el.style.opacity = '0';
  });
  window.addEventListener('load', function () {
    document.querySelectorAll('.hero .reveal-hero').forEach(function (el, i) {
      setTimeout(function () { el.style.opacity = '1'; }, 120 + i * 130);
    });
  });

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600;
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || ''); });
  }

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var gItems = document.querySelectorAll('.g-item');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        gItems.forEach(function (item) {
          var show = f === 'all' || item.getAttribute('data-cat') === f;
          item.classList.toggle('hide', !show);
          if (show) { item.style.animation = 'none'; void item.offsetWidth; item.style.animation = ''; }
        });
        closeLightbox();
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  var lbImg, lbCap, lbCount, lbClose, lbPrev, lbNext;
  if (lightbox) {
    lightbox.insertAdjacentHTML('afterbegin', '<span class="lb-counter"></span>');
    lbImg = lightbox.querySelector('img');
    lbCap = lightbox.querySelector('.lb-cap');
    lbCount = lightbox.querySelector('.lb-counter');
    lbClose = lightbox.querySelector('.lb-close');
    lbPrev = lightbox.querySelector('.lb-prev');
    lbNext = lightbox.querySelector('.lb-next');
  }
  var lib = [];
  var libIdx = 0;

  var visibleItems = function () {
    return Array.prototype.filter.call(gItems, function (i) { return !i.classList.contains('hide'); });
  };
  var openLightbox = function (list, idx) {
    if (!lightbox) return;
    lib = list;
    libIdx = idx;
    renderLightbox();
    lightbox.classList.add('open');
    body.classList.add('no-scroll');
  };
  var renderLightbox = function () {
    var item = lib[libIdx];
    var img = item.querySelector('img');
    lbImg.src = img.getAttribute('data-full');
    lbImg.alt = img.alt || 'J&J Home Renovations project';
    if (lbCap) {
      var t = item.getAttribute('data-title');
      lbCap.textContent = t || '';
    }
    lbCount.textContent = (libIdx + 1) + ' / ' + lib.length;
  };
  var closeLightbox = function () {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    body.classList.remove('no-scroll');
  };
  var moveLightbox = function (dir) {
    if (!lib.length) return;
    libIdx = (libIdx + dir + lib.length) % lib.length;
    renderLightbox();
  };

  if (lightbox) {
    gItems.forEach(function (item) {
      item.addEventListener('click', function () {
        openLightbox(visibleItems(), visibleItems().indexOf(item));
      });
    });
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { moveLightbox(-1); });
    lbNext.addEventListener('click', function () { moveLightbox(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') moveLightbox(-1);
      if (e.key === 'ArrowRight') moveLightbox(1);
    });
  }

  /* ---------- Review carousel ---------- */
  var carousel = document.querySelector('.carousel');
  var track, cards, dotsWrap;
  if (carousel) {
    track = carousel.querySelector('.carousel-track');
    cards = Array.prototype.slice.call(track.children);
    dotsWrap = document.querySelector('.carousel-dots');
    cards.forEach(function (c) {
      c.setAttribute('aria-hidden', 'false');
    });
    if (dotsWrap) {
      cards.forEach(function (card, i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', 'Go to review ' + (i + 1));
        if (i === 0) d.classList.add('active');
        d.addEventListener('click', function () { goTo(i); restart(); });
        dotsWrap.appendChild(d);
      });
    }
    var dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];
  }

  var perView = function () {
    if (!carousel) return 1;
    var w = carousel.offsetWidth;
    if (w >= 700) return 2;
    return 1;
  };
  var maxIndex = function () { return Math.max(0, cards.length - perView()); };
  var cur = 0;

  var goTo = function (i) {
    cur = Math.max(0, Math.min(i, maxIndex()));
    track.style.transform = 'translateX(-' + (cur * (100 / perView())) + '%)';
    if (dots) dots.forEach(function (d, di) {
      d.classList.toggle('active', di === cur);
    });
  };

  var timer = null;
  var startTimer = function () {
    if (!carousel || cards.length <= perView()) return;
    stopTimer();
    timer = setInterval(function () {
      goTo(cur >= maxIndex() ? 0 : cur + 1);
    }, 5200);
  };
  var stopTimer = function () {
    if (timer) clearInterval(timer);
  };
  var restart = function () { startTimer(); };

  if (carousel && cards.length) {
    goTo(0);
    startTimer();
    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);
    var cN = document.querySelector('.carousel-nav');
    if (cN) {
      var prevBtn = cN.querySelector('.prev');
      var nextBtn = cN.querySelector('.next');
      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(cur - 1); restart(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(cur + 1); restart(); });
    }
    window.addEventListener('resize', function () {
      goTo(cur);
      if (cards.length > perView()) startTimer();
    });
    /* swipe */
    var sx = null;
    carousel.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) moveCarousel(dx < 0 ? 1 : -1);
      sx = null;
    }, { passive: true });
  }
  var moveCarousel = function (dir) { goTo(cur + dir); restart(); };

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        var b = o.querySelector('.faq-q');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Back to top + FAB ---------- */
  var toTop = document.querySelector('.to-top');
  window.addEventListener('scroll', function () {
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('fName') || {}).value || '';
      var project = (document.getElementById('fService') || {}).value || '';
      var email = (document.getElementById('fEmail') || {}).value || '';
      var phone = (document.getElementById('fPhone') || {}).value || '';
      var msg = (document.getElementById('fMsg') || {}).value || '';
      var subject = encodeURIComponent('Free estimate request from ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Project type: ' + project + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n\n' +
        'Details:\n' + msg
      );
      var success = form.querySelector('.form-success');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Opening your email…'; }
      setTimeout(function () {
        if (success) success.classList.add('show');
        if (btn) { btn.disabled = false; btn.textContent = 'Request Free Estimate'; }
        form.reset();
        document.querySelector('.contact-card .form-note').textContent = 'Your browser email app has now opened with your request ready to send.';
        window.location.href = 'mailto:jjhomerenovations@outlook.com?subject=' + subject + '&body=' + body;
      }, 500);
    });
  }

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();