// Featured News slider
(function initFeaturedNewsSlider() {
  var sliderEl = document.querySelector(".news-and-events-page .news-slider");
  if (!sliderEl || sliderEl.swiper || typeof Swiper === "undefined") return;

  new Swiper(sliderEl, {
    slidesPerView: "auto",
    centeredSlides: false,
    loop: false,
    rewind: true,
    speed: 650,
    spaceBetween: 58,
    grabCursor: true,
    navigation: {
      nextEl: ".news-slider-next",
    },
    breakpoints: {
      0: {
        spaceBetween: 22,
      },
      768: {
        spaceBetween: 36,
      },
      1200: {
        spaceBetween: 58,
      },
    },
  });
})();
// ============================================================
// bbt-fa-news-sec — Viewport-triggered left/right animations
// ============================================================
(function initNewsSectionAnimation() {
  var newsSection = document.querySelector(".bbt-fa-news-sec");
  if (!newsSection) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  var reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return;

  // ── news-top-bar: slide in from left ──
  var topBar = newsSection.querySelector(".news-top-bar");
  if (topBar) {
    gsap.set(topBar, { autoAlpha: 0, x: -90 });
    ScrollTrigger.create({
      trigger: topBar,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(topBar, {
          autoAlpha: 1,
          x: 0,
          duration: 0.82,
          ease: "power3.out",
        });
      },
    });
  }

  // ── news cards: alternating left/right per column position ──
  var cards = gsap.utils.toArray(".bbt-fa-news-sec .news-grid .card");
  cards.forEach(function (card, i) {
    // 3-column grid: col 0 = left, col 1 = centre→right, col 2 = right
    // Simple rule: even index → from left, odd index → from right
    var fromX = i % 2 === 0 ? -100 : 100;
    gsap.set(card, { autoAlpha: 0, x: fromX });

    ScrollTrigger.create({
      trigger: card,
      start: "top 88%",
      once: true,
      onEnter: function () {
        gsap.to(card, {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          delay: (i % 3) * 0.08, // slight stagger within each row
          ease: "power3.out",
        });
      },
    });
  });

  // ── load-more: fade up from bottom ──
  var loadMore = newsSection.querySelector(".load-more-wrapper");
  if (loadMore) {
    gsap.set(loadMore, { autoAlpha: 0, y: 40 });
    ScrollTrigger.create({
      trigger: loadMore,
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to(loadMore, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
        });
      },
    });
  }
})();
