
// ==========================================
// CINEMATIC EXPERTISE REVEAL
// ==========================================

(() => {
  "use strict";

  const skills = document.querySelector("#skills");

  if (!skills) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) return;

  // Remove old reveal system from Expertise only
  // to prevent animation conflicts.
  skills.querySelectorAll(".home-reveal").forEach(el => {
    el.classList.remove("home-reveal");
  });

  // Check browser support
  if (!("IntersectionObserver" in window)) {
    return;
  }

  // Enable cinematic initial state
  skills.classList.add("skills-cine-ready");

  // ==========================================
  // OBSERVE SECTION
  // ==========================================

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {

      for (const entry of entries) {

        if (!entry.isIntersecting) continue;

        // Trigger the cinematic reveal
        skills.classList.add("skills-cine-visible");

        // Reveal only once
        observerInstance.unobserve(entry.target);

      }

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  observer.observe(skills);

})();
