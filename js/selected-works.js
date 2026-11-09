
// =====================================
// SELECTED WORKS — INFINITE AUTO SCROLL
// =====================================

(() => {

  const showcase = document.querySelector(
    ".sw-auto-showcase"
  );

  if (!showcase) return;

  const rail = showcase.querySelector(".sw-rail");
  const track = showcase.querySelector(".sw-rail-track");
  const group = showcase.querySelector(".sw-rail-group");

  const title = showcase.querySelector(".sw-active-title");
  const type = showcase.querySelector(".sw-active-type");
  const counter = showcase.querySelector(".sw-project-number");

  const slides = [...group.querySelectorAll(".sw-slide")];

  if (!slides.length) return;

  // =====================================
  // SETTINGS
  // =====================================

  // Kecepatan pergerakan dalam pixel per detik
  const scrollSpeed = 45;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let offset = 0;
  let groupHeight = 0;
  let centers = [];

  let animationId = null;
  let lastTime = 0;
  let lastLabelUpdate = 0;
  let activeIndex = -1;

  let isVisible = false;

  // =====================================
  // IMAGE LOADING
  // =====================================

  function setupImages(scope) {

    scope.querySelectorAll(".sw-slide-visual").forEach(
      (visual) => {

        const img = visual.querySelector("img");
        if (!img) return;

        function showImage() {
          if (img.naturalWidth > 0) {
            visual.classList.add("has-image");
          }
        }

        img.addEventListener("load", showImage);

        if (img.complete) {
          showImage();
        }

      }
    );

  }

  setupImages(group);

  // Reduced motion: keep normal, scrollable images.
  if (reduceMotion) return;

  // =====================================
  // CREATE SEAMLESS LOOP
  // =====================================

  const clonedGroup = group.cloneNode(true);

  clonedGroup.setAttribute("aria-hidden", "true");

  track.appendChild(clonedGroup);
  setupImages(clonedGroup);

  showcase.classList.add("sw-auto-ready");

  // =====================================
  // MEASURE IMAGE POSITIONS
  // =====================================

  function measure() {

    const oldHeight = groupHeight;

    groupHeight = group.getBoundingClientRect().height;

    if (!groupHeight) return;

    const groupRect = group.getBoundingClientRect();

    centers = slides.map((slide) => {

      const rect = slide.getBoundingClientRect();

      return (
        rect.top -
        groupRect.top +
        rect.height / 2
      );

    });

    if (oldHeight > 0) {

      // Preserve current position after resize
      offset = (
        offset / oldHeight
      ) * groupHeight;

    } else {

      // Start with the first project centered
      const firstCenter = centers[0];

      offset = (
        groupHeight +
        firstCenter -
        rail.clientHeight / 2
      ) % groupHeight;

    }

    offset = (
      (offset % groupHeight) + groupHeight
    ) % groupHeight;

    applyPosition();
    updateActiveProject();

  }

  // =====================================
  // MOVE VERTICAL TRACK
  // =====================================

  function applyPosition() {

    track.style.transform = `
      translate3d(0, ${-offset}px, 0)
    `;

  }

  // =====================================
  // UPDATE PROJECT INFORMATION
  // =====================================

  function updateActiveProject() {

    if (!groupHeight || !centers.length) return;

    const viewportCenter = rail.clientHeight / 2;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    centers.forEach((center, index) => {

      const position = center - offset;

      // Consider the original and repeated group
      const distance = Math.min(
        Math.abs(position - viewportCenter),
        Math.abs(position + groupHeight - viewportCenter),
        Math.abs(position - groupHeight - viewportCenter)
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }

    });

    if (nearestIndex === activeIndex) return;

    activeIndex = nearestIndex;

    const slide = slides[activeIndex];

    title.textContent = slide.dataset.title || "Project";
    type.textContent = slide.dataset.type || "";

    counter.textContent = `
      ${String(activeIndex + 1).padStart(2, "0")}
      /
      ${String(slides.length).padStart(2, "0")}
    `;

    // Gentle text transition
    if (typeof title.animate === "function") {

      title.animate(
        [
          {
            opacity: 0.45,
            transform: "translateY(8px)"
          },
          {
            opacity: 1,
            transform: "translateY(0)"
          }
        ],
        {
          duration: 420,
          easing: "ease-out"
        }
      );

    }

  }

  // =====================================
  // CONTINUOUS ANIMATION
  // =====================================

  function animate(time) {

    if (!isVisible || document.hidden) {
      animationId = null;
      lastTime = 0;
      return;
    }

    if (lastTime && groupHeight > 0) {

      const delta = Math.min(
        time - lastTime,
        50
      );

      // Move upward continuously
      offset += (delta / 1000) * scrollSpeed;

      // Seamless repeat after one full group
      if (offset >= groupHeight) {
        offset %= groupHeight;
      }

      applyPosition();

    }

    lastTime = time;

    // Updating labels less often improves performance
    if (time - lastLabelUpdate > 120) {
      updateActiveProject();
      lastLabelUpdate = time;
    }

    animationId = requestAnimationFrame(animate);

  }

  // =====================================
  // START / STOP ANIMATION
  // =====================================

  function start() {

    if (animationId !== null || document.hidden) {
      return;
    }

    lastTime = 0;
    animationId = requestAnimationFrame(animate);

  }

  function stop() {

    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }

    animationId = null;
    lastTime = 0;

  }

  // =====================================
  // PERFORMANCE — OBSERVE VISIBILITY
  // =====================================

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          isVisible = entry.isIntersecting;

          if (isVisible) {
            start();
          } else {
            stop();
          }

        });

      },
      {
        threshold: 0.05
      }
    );

    observer.observe(showcase);

  } else {

    isVisible = true;
    start();

  }

  // =====================================
  // HANDLE TAB VISIBILITY
  // =====================================

  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
      stop();
    } else if (isVisible) {
      start();
    }

  });

  // =====================================
  // RESPONSIVE
  // =====================================

  if ("ResizeObserver" in window) {

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(rail);
    resizeObserver.observe(group);

  } else {

    window.addEventListener("resize", measure);

  }

  // INITIALIZE
  measure();

})();
