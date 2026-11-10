
// =====================================
// CINEMATIC NAVBAR SCROLL ANIMATION
// =====================================

(() => {

  const navbar = document.querySelector("#siteNavbar");
  const home = document.querySelector(".home-card");

  if (!navbar || !home) return;

  const navLinks = navbar.querySelector(".nav-links");
  const hireButton = navbar.querySelector(".nav-cta");

  if (!navLinks || !hireButton) return;

  let ticking = false;

  // =====================================
  // CALCULATE MENU DESTINATION
  // =====================================

  function calculateTravel() {

    if (window.innerWidth <= 800) {
      navbar.style.setProperty("--nav-travel", "0px");
      return;
    }

    const navRect = navbar.getBoundingClientRect();
    const hireRect = hireButton.getBoundingClientRect();

    const navCenter =
      navRect.left + navRect.width / 2;

    const menuWidth = navLinks.offsetWidth;

    // Right edge when menu is centered
    const centeredMenuRight =
      navCenter + menuWidth / 2;

    // Final position: before Hire Me
    const gap = 26;
    const destinationRight = hireRect.left - gap;

    const travel = Math.max(
      0,
      destinationRight - centeredMenuRight
    );

    navbar.style.setProperty(
      "--nav-travel",
      `${travel}px`
    );

  }

  // =====================================
  // CHECK SCROLL POSITION
  // =====================================

  function updateNavbar() {

    const homeRect = home.getBoundingClientRect();

    // When the next section reaches the navbar
    const isPastHome =
      homeRect.bottom <= navbar.offsetHeight + 12;

    navbar.classList.toggle(
      "is-shifted",
      isPastHome
    );

    ticking = false;

  }

  // =====================================
  // OPTIMIZED SCROLL EVENT
  // =====================================

  function onScroll() {

    if (ticking) return;

    ticking = true;

    requestAnimationFrame(updateNavbar);

  }

  window.addEventListener(
    "scroll",
    onScroll,
    { passive: true }
  );

  // =====================================
  // RESIZE
  // =====================================

  window.addEventListener("resize", () => {
    calculateTravel();
    onScroll();
  });

  // =====================================
  // INITIALIZE
  // =====================================

  calculateTravel();
  updateNavbar();

  // Turn on smooth transition only after
  // the first position has been calculated
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      navbar.classList.add("motion-ready");
    });
  });

  // Recalculate when web fonts are ready
  if (document.fonts) {
    document.fonts.ready.then(() => {
      calculateTravel();
      onScroll();
    });
  }

  // Restore state on browser back/forward
  window.addEventListener("pageshow", () => {
    calculateTravel();
    onScroll();
  });

})();
