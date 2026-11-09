
// =======================================
// ROTATING SKILLS ORBIT
// =======================================

(() => {
  const orbit = document.querySelector(".tool-orbit");
  if (!orbit) return;

  const stage = orbit.querySelector(".orbit-stage");
  const wheel = orbit.querySelector(".orbit-wheel");

  const nextBtn = orbit.querySelector(".orbit-next");
  const toggleBtn = orbit.querySelector(".orbit-toggle");

  // Teknologi asli
  const originals = [
    ...wheel.querySelectorAll(".orbit-tile")
  ];

  if (!originals.length) return;

  // Duplikasi untuk membentuk lingkaran penuh.
  // Hanya sisi depan/atas yang ditampilkan.
  originals.forEach((tile) => {
    const clone = tile.cloneNode(true);
    wheel.appendChild(clone);
  });

  const tiles = [...wheel.querySelectorAll(".orbit-tile")];
  const total = tiles.length;

  const TWO_PI = Math.PI * 2;
  const step = TWO_PI / total;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let autoRotate = !reducedMotion;
  let isHovered = false;

  let rotation = 0;
  let currentShift = 0;
  let targetShift = 0;

  let stageWidth = 0;
  let stageHeight = 0;

  let rafId = null;
  let lastTime = null;

  // =====================================
  // MEASURE STAGE
  // =====================================

  function measure() {
    stageWidth = stage.clientWidth;
    stageHeight = stage.clientHeight;
    drawOrbit();
  }

  // =====================================
  // CALCULATE POSITIONS
  // =====================================

  function drawOrbit() {
    if (!stageWidth || !stageHeight) return;

    const tileWidth = tiles[0].offsetWidth;

    const radiusX = Math.min(
      stageWidth * 0.44,
      (stageWidth - tileWidth) / 2 - 5,
      540
    );

    const radiusY = stageHeight * 0.60;

    const centerX = stageWidth / 2;
    const centerY = stageHeight * 0.88;

    tiles.forEach((tile, index) => {

      const angle =
        (index / total) * TWO_PI +
        rotation +
        currentShift;

      const sine = Math.sin(angle);
      const cosine = Math.cos(angle);

      // Posisi elips
      const x = centerX + radiusX * cosine;
      const y = centerY - radiusY * sine;

      // Efek kedalaman dan kemiringan
      const scale =
        0.82 + 0.18 * Math.max(0, sine);

      const tilt = cosine * 18;

      // Memudar saat melewati sisi belakang
      const opacity = Math.max(
        0,
        Math.min(1, (sine + 0.08) / 0.22)
      );

      tile.style.transform = `
        translate3d(${x}px, ${y}px, 0)
        translate(-50%, -50%)
        rotate(${tilt}deg)
        scale(${scale})
      `;

      tile.style.opacity = opacity;

      tile.style.visibility =
        opacity < 0.02 ? "hidden" : "visible";

      tile.style.zIndex = String(
        Math.round((sine + 1) * 100)
      );
    });
  }

  // =====================================
  // SMOOTH ANIMATION
  // =====================================

  function animate(time) {
    rafId = null;

    const dt = lastTime === null
      ? 16
      : Math.min(time - lastTime, 45);

    lastTime = time;

    // Rotasi otomatis
    if (autoRotate && !isHovered) {
      rotation += dt * 0.00013;
    }

    // Perpindahan halus saat tombol ditekan
    const difference = targetShift - currentShift;

    currentShift += difference * Math.min(
      1,
      dt * 0.014
    );

    drawOrbit();

    rafId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (rafId !== null) return;

    lastTime = null;
    rafId = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (rafId === null) return;

    cancelAnimationFrame(rafId);
    rafId = null;
    lastTime = null;
  }

  // =====================================
  // NEXT BUTTON
  // =====================================

  nextBtn.addEventListener("click", () => {
    targetShift += step;

    // Gerak instan jika reduced motion aktif
    if (reducedMotion) {
      currentShift = targetShift;
      drawOrbit();
    }
  });

  // =====================================
  // PLAY / PAUSE BUTTON
  // =====================================

  function updateToggle() {
    toggleBtn.textContent = autoRotate
      ? "Jeda"
      : "Putar";

    toggleBtn.setAttribute(
      "aria-label",
      autoRotate
        ? "Jeda rotasi teknologi"
        : "Lanjutkan rotasi teknologi"
    );
  }

  toggleBtn.addEventListener("click", () => {
    autoRotate = !autoRotate;
    updateToggle();
  });

  updateToggle();

  // =====================================
  // PAUSE ON HOVER
  // =====================================

  orbit.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  orbit.addEventListener("mouseleave", () => {
    isHovered = false;
  });

  // =====================================
  // RESPONSIVE RESIZE
  // =====================================

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(stage);
  } else {
    window.addEventListener("resize", measure);
  }

  // =====================================
  // PERFORMANCE — ONLY WHEN VISIBLE
  // =====================================

  wheel.classList.add("orbit-ready");

  measure();

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
          } else {
            stopAnimation();
          }
        });
      },
      { threshold: 0.05 }
    );

    visibilityObserver.observe(orbit);
  } else {
    startAnimation();
  }

})();
