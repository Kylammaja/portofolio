
// ===================================
// HOME — SCROLL REVEAL
// ===================================

const homeRevealItems = document.querySelectorAll(
  ".home-reveal"
);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (
  !prefersReducedMotion &&
  "IntersectionObserver" in window
) {
  document.body.classList.add("home-motion");

  const homeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  homeRevealItems.forEach((item) => {
    homeObserver.observe(item);
  });
} else {
  homeRevealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}
