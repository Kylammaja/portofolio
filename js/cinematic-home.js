
/* ==========================================
   CINEMATIC HOME MOTION — V3
   Carbon & Muted Gold

   Features:
   - Synchronize with WELCOME loader
   - Cinematic Hero entrance
   - About text reveal
   - Subtle Hero parallax
   - Optimized scroll performance
========================================== */

(() => {
  "use strict";

  // ==========================================
  // 01. ELEMENTS
  // ==========================================

  const body = document.body;
  const root = document.documentElement;

  const hero = document.querySelector(".hero");
  const about = document.querySelector(".hp-about");

  if (!hero || !about) return;

  // ==========================================
  // 02. ACCESSIBILITY
  // ==========================================

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  // ==========================================
  // 03. PREPARE ABOUT ANIMATION
  // ==========================================

  // Remove older reveal system from About
  // to prevent conflicting animations.

  about.querySelectorAll(".home-reveal").forEach(
    (element) => {
      element.classList.remove("home-reveal");
    }
  );

  const aboutTitle = about.querySelector(
    ".hp-about-heading h2"
  );

  // Support both masked-line headings
  // and regular headings.

  if (aboutTitle) {

    const hasMaskedLines = aboutTitle.querySelector(
      ".cine-line"
    );

    if (!hasMaskedLines) {
      aboutTitle.classList.add("cine-about-single");
    }

  }

  about.classList.add("cine-about-ready");

  // ==========================================
  // 04. ENABLE CINEMATIC MOTION
  // ==========================================

  body.classList.add("cine-ready");

  let heroOpened = false;

  // ==========================================
  // 05. HERO ENTRANCE
  // ==========================================

  function openHero() {

    // Prevent duplicate animations
    if (heroOpened) return;

    heroOpened = true;

    // Wait for the browser to render
    // the initial state before revealing Hero.

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        body.classList.add("cine-open");

      });

    });

  }

  
// ==========================================
// 06. SEAMLESS LOADER TO HERO
// ==========================================

function onIntroReveal() {

  if (window.scrollY > 80) {
    heroOpened = true;
    body.classList.add("cine-open");
    return;
  }

  // Hero begins while the loader is still opening
  openHero();

}

const introIsRunning = root.classList.contains(
  "intro-running"
);

if (introIsRunning) {

  // Start when curtains are opening
  window.addEventListener(
    "portfolio:intro-reveal",
    onIntroReveal,
    { once: true }
  );

  // Fallback if reveal event was missed
  window.addEventListener(
    "portfolio:intro-complete",
    onIntroReveal,
    { once: true }
  );

} else {

  onIntroReveal();

}


  // ==========================================
  // 07. ABOUT SCROLL REVEAL
  // ==========================================

  const aboutObserver = new IntersectionObserver(

    (entries, observer) => {

      for (const entry of entries) {

        if (!entry.isIntersecting) continue;

        // Reveal About content
        about.classList.add(
          "cine-about-visible"
        );

        // Animate only once
        observer.unobserve(entry.target);

      }

    },

    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    }

  );

  aboutObserver.observe(about);

  // ==========================================
  // 08. RESPONSIVE PARALLAX
  // ==========================================

  const desktop = window.matchMedia(
    "(min-width: 801px)"
  );

  let ticking = false;

  function clamp(value, min, max) {

    return Math.min(
      max,
      Math.max(min, value)
    );

  }

  // ==========================================
  // 09. UPDATE HERO PARALLAX
  // ==========================================

  function updateParallax() {

    ticking = false;

    // Disable parallax on mobile
    if (!desktop.matches) {

      hero.style.removeProperty(
        "--cine-heading-y"
      );

      hero.style.removeProperty(
        "--cine-portrait-y"
      );

      return;

    }

    const rect = hero.getBoundingClientRect();

    // Skip updates when Hero is outside
    // the visible screen.

    if (
      rect.bottom < -100 ||
      rect.top > window.innerHeight + 100
    ) {
      return;
    }

    const progress = clamp(

      -rect.top / Math.max(rect.height, 1),

      0,
      1

    );

    // Different speeds create depth.
    // Keep motion subtle and elegant.

    const headingY = progress * 28;
    const portraitY = progress * 48;

    hero.style.setProperty(
      "--cine-heading-y",
      `${headingY.toFixed(1)}px`
    );

    hero.style.setProperty(
      "--cine-portrait-y",
      `${portraitY.toFixed(1)}px`
    );

  }

  // ==========================================
  // 10. OPTIMIZED SCROLL
  // ==========================================

  function requestParallax() {

    if (ticking) return;

    ticking = true;

    requestAnimationFrame(updateParallax);

  }

  window.addEventListener(
    "scroll",
    requestParallax,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestParallax
  );

  // ==========================================
  // 11. BROWSER BACK / FORWARD
  // ==========================================

  window.addEventListener("pageshow", () => {

    // Restore Hero if intro already finished.
    if (
      !root.classList.contains("intro-running")
    ) {
      onIntroComplete();
    }

    requestParallax();

  });

  // ==========================================
  // 12. INITIALIZE
  // ==========================================

  updateParallax();

})();
