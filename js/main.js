/* ============================================
   KAPTAR.IO — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ---------- DOM Ready ----------
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initStickyNav();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavLinks();
    initScrollReveal();
    initCountUpAnimations();
    initContactForm();
  }

  // ---------- Sticky Nav ----------
  function initStickyNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 10) {
            nav.classList.add('nav--scrolled');
          } else {
            nav.classList.remove('nav--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Mobile Menu ----------
  function initMobileMenu() {
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('nav__hamburger--open');
      mobileMenu.classList.toggle('mobile-menu--open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    var links = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('nav__hamburger--open');
        mobileMenu.classList.remove('mobile-menu--open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Smooth Scroll ----------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        var navHeight = 64;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      });
    });
  }

  // ---------- Active Nav Links ----------
  function initActiveNavLinks() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__link');
    if (!sections.length || !navLinks.length) return;

    var ticking = false;

    function updateActive() {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollPos = window.scrollY + 100;

          sections.forEach(function (section) {
            var top = section.offsetTop - 80;
            var bottom = top + section.offsetHeight;
            var id = section.getAttribute('id');

            navLinks.forEach(function (link) {
              if (link.getAttribute('href') === '#' + id) {
                if (scrollPos >= top && scrollPos < bottom) {
                  link.classList.add('nav__link--active');
                } else {
                  link.classList.remove('nav__link--active');
                }
              }
            });
          });

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  // ---------- Scroll Reveal ----------
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      reveals.forEach(function (el) {
        el.classList.add('reveal--visible');
      });
    }
  }

  // ---------- Count-Up Animations ----------
  function initCountUpAnimations() {
    var counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.5
      });

      counters.forEach(function (counter) {
        observer.observe(counter);
      });
    } else {
      counters.forEach(function (counter) {
        animateCounter(counter);
      });
    }
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // ---------- Contact Form ----------
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });
      status.textContent = '';
      status.className = 'contact-form__status';

      // Validate
      var name = form.querySelector('#name');
      var company = form.querySelector('#company');
      var email = form.querySelector('#email');
      var isValid = true;

      if (!name.value.trim()) {
        name.classList.add('error');
        isValid = false;
      }

      if (!company.value.trim()) {
        company.classList.add('error');
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.classList.add('error');
        isValid = false;
      }

      if (!isValid) {
        status.textContent = 'Please fill in all required fields correctly.';
        status.classList.add('contact-form__status--error');
        return;
      }

      // Simulate form submission
      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // In production, replace with actual form handler (WPForms, Formspree, etc.)
      setTimeout(function () {
        status.textContent = 'Thank you! We\'ll be in touch within 24 hours.';
        status.classList.add('contact-form__status--success');
        submitBtn.textContent = 'Message Sent';

        // Reset after delay
        setTimeout(function () {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }, 3000);
      }, 1200);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

})();
