
// =====================================
// ACTIVITIES PHOTO CAROUSEL
// =====================================

(() => {
  const track = document.querySelector("#activityTrack");
  if (!track) return;

  const gallery = track.closest(".activity-gallery");
  const section = track.closest(".hp-activities");

  const prevBtn = gallery.querySelector(".activity-prev");
  const nextBtn = gallery.querySelector(".activity-next");

  const cards = [...track.querySelectorAll(".activity-card")];

  const currentLabel = section.querySelector(".activity-current");
  const totalLabel = section.querySelector(".activity-total");

  if (!cards.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const formatNumber = (number) =>
    String(number).padStart(2, "0");

  totalLabel.textContent = formatNumber(cards.length);

  // =====================================
  // PHOTO LOADING & FALLBACK
  // =====================================

  cards.forEach((card) => {
    const image = card.querySelector("img");
    const frame = card.querySelector(".activity-frame");

    if (!image || !frame) return;

    function showImage() {
      if (image.naturalWidth > 0) {
        frame.classList.add("has-photo");
      }
    }

    image.addEventListener("load", showImage);

    // Jika gambar sudah tersimpan di cache
    if (image.complete) {
      showImage();
    }
  });

  // =====================================
  // CAROUSEL MEASUREMENTS
  // =====================================

  function getStep() {
    if (cards.length < 2) {
      return cards[0].offsetWidth;
    }

    return cards[1].offsetLeft - cards[0].offsetLeft;
  }

  function getMaxScroll() {
    return Math.max(
      0,
      track.scrollWidth - track.clientWidth
    );
  }

  function getCurrentIndex() {
    const step = getStep();

    if (step <= 0) return 0;

    return Math.max(
      0,
      Math.min(
        cards.length - 1,
        Math.round(track.scrollLeft / step)
      )
    );
  }

  // =====================================
  // UPDATE CONTROLS & COUNTER
  // =====================================

  function updateControls() {
    const scrollLeft = track.scrollLeft;
    const maxScroll = getMaxScroll();

    prevBtn.disabled = scrollLeft <= 2;
    nextBtn.disabled = scrollLeft >= maxScroll - 2;

    currentLabel.textContent = formatNumber(
      getCurrentIndex() + 1
    );
  }

  // =====================================
  // SCROLL TO CARD
  // =====================================

  function scrollToCard(index) {
    const step = getStep();

    const target = Math.min(
      getMaxScroll(),
      Math.max(0, index * step)
    );

    track.scrollTo({
      left: target,
      behavior: reducedMotion ? "instant" : "smooth"
    });
  }

  function moveCarousel(direction) {
    const nextIndex = getCurrentIndex() + direction;

    scrollToCard(
      Math.max(0, Math.min(cards.length - 1, nextIndex))
    );
  }

  prevBtn.addEventListener("click", () => {
    moveCarousel(-1);
  });

  nextBtn.addEventListener("click", () => {
    moveCarousel(1);
  });

  // =====================================
  // DRAG TO SCROLL (MOUSE)
  // =====================================

  let mouseDown = false;
  let isDragging = false;
  let suppressClick = false;

  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    mouseDown = true;
    isDragging = false;
    suppressClick = false;

    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
  });

  track.addEventListener("pointermove", (event) => {
    if (!mouseDown) return;

    const distance = event.clientX - startX;

    if (Math.abs(distance) > 6 && !isDragging) {
      isDragging = true;
      suppressClick = true;

      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    }

    if (!isDragging) return;

    event.preventDefault();

    track.scrollLeft = startScrollLeft - distance;
  });

  function endDrag() {
    if (!mouseDown) return;

    mouseDown = false;
    track.classList.remove("is-dragging");

    if (isDragging) {
      const nearest = getCurrentIndex();
      scrollToCard(nearest);
    }

    isDragging = false;
    updateControls();
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  window.addEventListener("pointerup", endDrag);

  // Hindari membuka link ketika foto sedang digeser
  track.addEventListener("click", (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  }, true);

  // =====================================
  // KEYBOARD ACCESSIBILITY
  // =====================================

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveCarousel(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveCarousel(-1);
    }
  });

  // =====================================
  // LIVE SCROLL TRACKING
  // =====================================

  let scrollFrame = null;

  track.addEventListener("scroll", () => {
    if (scrollFrame !== null) return;

    scrollFrame = requestAnimationFrame(() => {
      updateControls();
      scrollFrame = null;
    });
  }, { passive: true });

  window.addEventListener("resize", updateControls);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
  }

  updateControls();

})();
