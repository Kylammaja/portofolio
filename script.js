
// =================================
// MOBILE NAVIGATION
// =================================

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function closeMenu() {
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka menu");
  mobileMenu.hidden = true;
}

if (menuToggle && mobileMenu) {

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      mobileMenu.hidden = false;
      menuToggle.classList.add("is-active");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Tutup menu");
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

// =================================
// PROFILE PHOTO
// =================================

const hero = document.querySelector(".hero");
const profileImage = document.querySelector(".hero-photo");

function checkPhoto() {
  if (profileImage.complete && profileImage.naturalWidth > 0) {
    hero.classList.add("has-photo");
  }
}

if (hero && profileImage) {
  profileImage.addEventListener("load", checkPhoto);
  checkPhoto();
}

// =================================
// PORTRAIT PARALLAX
// =================================

const motionAllowed = window.matchMedia(
  "(pointer: fine) and (prefers-reduced-motion: no-preference)"
);

if (hero && motionAllowed.matches) {

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    hero.style.setProperty("--move-x", `${x * 14}px`);
    hero.style.setProperty("--move-y", `${y * 8}px`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--move-x", "0px");
    hero.style.setProperty("--move-y", "0px");
  });
}
