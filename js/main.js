/**
 * NOVIARA - Global Client Scripts
 * Header glassmorphism, responsive navigation, scroll reveal observer, cursor tracker.
 */

(function () {
  'use strict';

  // --- 1. Header Scroll Glassmorphism ---
  const header = document.querySelector('.site-header');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --- 2. Mobile Menu Drawer & Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileToggle && mobileMenu) {
    function toggleMobileMenu() {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    function openMobileMenu() {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Close when clicking on any link inside mobile menu
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --- 3. Scroll Reveal Animations (IntersectionObserver) ---
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-visible'));
    } else {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach((el) => {
        revealObserver.observe(el);
      });
    }
  }

  // --- 4. Ambient Cursor Glow Tracker (Desktop only - Optimized Sleep on Idle) ---
  const cursorGlow = document.querySelector('.cursor-ambient-glow');
  if (cursorGlow && window.innerWidth > 1024 && !prefersReduced) {
    let mouseX = -500;
    let mouseY = -500;
    let glowX = -500;
    let glowY = -500;
    let isAnimating = false;

    function renderGlow() {
      const diffX = mouseX - glowX;
      const diffY = mouseY - glowY;

      if (Math.abs(diffX) < 0.25 && Math.abs(diffY) < 0.25) {
        glowX = mouseX;
        glowY = mouseY;
        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
        isAnimating = false;
        return; // Sleep until next mousemove!
      }

      glowX += diffX * 0.14;
      glowY += diffY * 0.14;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderGlow);
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(renderGlow);
      }
    }, { passive: true });
  }

  // --- 5. Navigation: Active Link Detection & Dynamic Sliding Indicator ---
  function getCleanFileName(urlStr) {
    if (!urlStr) return 'index.html';
    const clean = urlStr.split('#')[0].split('?')[0];
    const segments = clean.split('/').filter(Boolean);
    const last = segments.pop() || '';
    if (!last || last === '.' || !last.includes('.')) {
      return 'index.html';
    }
    return last.toLowerCase();
  }

  const currentFile = getCleanFileName(window.location.pathname);
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');

  allNavLinks.forEach((link) => {
    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#')) return;
    const targetFile = getCleanFileName(rawHref);
    if (targetFile === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- Dynamic Sliding Magnetic Indicator for Desktop Header ---
  const navLinksContainer = document.querySelector('.nav-links');
  if (navLinksContainer) {
    let indicator = navLinksContainer.querySelector('.nav-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'nav-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      navLinksContainer.prepend(indicator);
    }

    const desktopNavLinks = navLinksContainer.querySelectorAll('.nav-link');

    function updateIndicator(targetEl, immediate = false) {
      if (!indicator || !navLinksContainer) return;
      if (!targetEl) {
        indicator.style.opacity = '0';
        return;
      }

      const containerRect = navLinksContainer.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const x = targetRect.left - containerRect.left;
      const y = targetRect.top - containerRect.top;
      const width = targetRect.width;
      const height = targetRect.height;

      if (width === 0 || height === 0) return;

      if (immediate) {
        const prevTransition = indicator.style.transition;
        indicator.style.transition = 'none';
        indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        indicator.style.width = `${width}px`;
        indicator.style.height = `${height}px`;
        indicator.style.opacity = '1';
        indicator.offsetHeight; // Force layout reflow
        indicator.style.transition = prevTransition;
      } else {
        indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        indicator.style.width = `${width}px`;
        indicator.style.height = `${height}px`;
        indicator.style.opacity = '1';
      }

      navLinksContainer.classList.add('indicator-active');
    }

    function getActiveNavLink() {
      return navLinksContainer.querySelector('.nav-link.active') || desktopNavLinks[0];
    }

    // Set position immediately on load
    const activeLink = getActiveNavLink();
    if (activeLink) {
      requestAnimationFrame(() => updateIndicator(activeLink, true));
    }

    // Gliding interaction on mouse hover and keyboard focus
    desktopNavLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        updateIndicator(link, false);
      });
      link.addEventListener('focus', () => {
        updateIndicator(link, false);
      });
      link.addEventListener('click', () => {
        desktopNavLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        updateIndicator(link, false);
      });
    });

    // Return to active tab on mouse leave
    navLinksContainer.addEventListener('mouseleave', () => {
      const active = getActiveNavLink();
      if (active) updateIndicator(active, false);
    });

    navLinksContainer.addEventListener('focusout', (e) => {
      if (!navLinksContainer.contains(e.relatedTarget)) {
        const active = getActiveNavLink();
        if (active) updateIndicator(active, false);
      }
    });

    // Re-align on resize, language switch, and font loading
    window.addEventListener('resize', () => {
      const active = getActiveNavLink();
      if (active) updateIndicator(active, true);
    }, { passive: true });

    window.addEventListener('languageChanged', () => {
      requestAnimationFrame(() => {
        const active = getActiveNavLink();
        if (active) updateIndicator(active, true);
      });
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const active = getActiveNavLink();
        if (active) updateIndicator(active, true);
      });
    }
  }

})();
