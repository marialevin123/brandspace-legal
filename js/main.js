(function () {
  'use strict';

  var NAVBAR_OFFSET = 80;
  var TESTIMONIAL_INTERVAL_MS = 5000;

  document.addEventListener('DOMContentLoaded', function () {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var navbar = document.getElementById('navbar');
    if (navbar) {
      function onScrollNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }
      onScrollNavbar();
      window.addEventListener('scroll', onScrollNavbar, { passive: true });
    }

    var menuToggle = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
      function syncMenuAria() {
        var open = mobileMenu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }
      menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        syncMenuAria();
      });
      syncMenuAria();
      mobileMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function () {
          if (window.matchMedia('(max-width: 767px)').matches) {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            syncMenuAria();
          }
        });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var top =
          target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      });
    });

    var revealEls = document.querySelectorAll('.reveal-on-scroll');
    if (revealEls.length) {
      if (reducedMotion) {
        revealEls.forEach(function (el) {
          el.classList.add('revealed');
        });
      } else {
        var revealObserver = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('revealed');
              obs.unobserve(entry.target);
            });
          },
          { threshold: 0.1 }
        );
        revealEls.forEach(function (el) {
          revealObserver.observe(el);
        });
      }
    }

    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        if (!item) return;
        var wasOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('active');
          var q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    var testimonialTrack = document.getElementById('testimonial-track');
    if (testimonialTrack) {
      var cards = testimonialTrack.querySelectorAll('.testimonial-card');
      var n = cards.length;
      if (n > 0) {
        var testimonialIndex = 0;
        var dotsWrap =
          document.getElementById('testimonial-dots') ||
          (function () {
            var d = document.createElement('div');
            d.id = 'testimonial-dots';
            d.className = 'testimonial-dots';
            testimonialTrack.parentNode.insertBefore(d, testimonialTrack.nextSibling);
            return d;
          })();
        dotsWrap.innerHTML = '';
        var dots = [];
        for (var i = 0; i < n; i++) {
          (function (idx) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', 'Testimonial ' + (idx + 1));
            dot.addEventListener('click', function () {
              goTo(idx);
            });
            dotsWrap.appendChild(dot);
            dots.push(dot);
          })(i);
        }

        function syncCarousel() {
          var pct = -(100 / n) * testimonialIndex;
          testimonialTrack.style.transform = 'translateX(' + pct + '%)';
          dots.forEach(function (d, j) {
            d.classList.toggle('active', j === testimonialIndex);
          });
        }

        function goTo(index) {
          testimonialIndex = ((index % n) + n) % n;
          syncCarousel();
        }

        testimonialTrack.style.display = 'flex';
        testimonialTrack.style.width = n * 100 + '%';
        cards.forEach(function (card) {
          card.style.flex = '0 0 ' + 100 / n + '%';
          card.style.width = 100 / n + '%';
        });

        syncCarousel();

        var carouselTimer = null;
        function startTestimonialAuto() {
          window.clearInterval(carouselTimer);
          carouselTimer = window.setInterval(function () {
            goTo(testimonialIndex + 1);
          }, TESTIMONIAL_INTERVAL_MS);
        }
        function stopTestimonialAuto() {
          window.clearInterval(carouselTimer);
          carouselTimer = null;
        }
        startTestimonialAuto();
        document.addEventListener('visibilitychange', function () {
          if (document.hidden) stopTestimonialAuto();
          else startTestimonialAuto();
        });
      }
    }

    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        card.classList.toggle('expanded');
      });
    });

    var contactForm = document.getElementById('contact-form');
    var formSuccess = document.getElementById('form-success');
    if (contactForm && formSuccess) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        formSuccess.classList.add('show');
        window.setTimeout(function () {
          contactForm.reset();
          formSuccess.classList.remove('show');
        }, 3000);
      });
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (!lang || !window.i18n || typeof window.i18n.setLanguage !== 'function') return;
        window.i18n.setLanguage(lang).then(function () {
          document.querySelectorAll('.lang-btn').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-lang') === lang);
          });
        }).catch(function () {});
      });
    });

    if (window.i18n && typeof window.i18n.getCurrentLanguage === 'function') {
      var cur = window.i18n.getCurrentLanguage();
      if (cur) {
        document.querySelectorAll('.lang-btn').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-lang') === cur);
        });
      }
      document.addEventListener('languageChanged', function (ev) {
        var lang = ev.detail && ev.detail.lang;
        if (!lang) return;
        document.querySelectorAll('.lang-btn').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-lang') === lang);
        });
      });
    }
  });
})();
