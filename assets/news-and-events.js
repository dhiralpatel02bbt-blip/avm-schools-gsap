// News category dropdown
(function initNewsCategoryDropdown() {
  var dropdown = document.querySelector(".news-category-dropdown");
  if (!dropdown) return;

  var trigger = dropdown.querySelector(".news-category-trigger");
  var menu = dropdown.querySelector(".news-category-menu");
  var label = dropdown.querySelector(".news-category-label");
  var options = dropdown.querySelectorAll(".news-category-menu li");

  if (!trigger || !menu || !label || !options.length) return;

  function closeMenu() {
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  }

  function openMenu() {
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
  }

  function selectOption(option) {
    options.forEach(function (item) {
      item.setAttribute("aria-selected", "false");
    });
    option.setAttribute("aria-selected", "true");
    label.textContent = option.textContent.trim();
    closeMenu();
  }

  trigger.addEventListener("click", function (event) {
    event.stopPropagation();
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      selectOption(option);
    });
  });

  document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
})();

// Featured news location dropdown
(function initFeaturedLocationDropdown() {
  var dropdown = document.querySelector(".featured-location-dropdown");
  if (!dropdown) return;

  var trigger = dropdown.querySelector(".featured-campus-filter");
  var menu = dropdown.querySelector(".featured-location-menu");
  var label = dropdown.querySelector(".featured-campus-filter-label");
  var options = dropdown.querySelectorAll(".featured-location-menu li");

  if (!trigger || !menu || !label || !options.length) return;

  function closeMenu() {
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  }

  function openMenu() {
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
  }

  function selectOption(option) {
    options.forEach(function (item) {
      item.setAttribute("aria-selected", "false");
    });
    option.setAttribute("aria-selected", "true");
    label.textContent = option.textContent.trim();
    closeMenu();
  }

  trigger.addEventListener("click", function (event) {
    event.stopPropagation();
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      selectOption(option);
    });
  });

  document.addEventListener("click", function (event) {
    if (!dropdown.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
})();

// Featured News slider
(function initFeaturedNewsSlider() {
  var sliderEl = document.querySelector(".news-and-events-page .news-slider");
  if (!sliderEl || sliderEl.swiper || typeof Swiper === "undefined") return;

  var section = document.querySelector(".featured-news-sec");
  var isWheelTransitioning = false;
  var wheelUnlockTimer = null;
  var wheelSlideDuration = 900;
  var wheelUnlockDelay = 1000;

  function getContainerGutter() {
    var styles = getComputedStyle(document.body);
    var gutter = parseFloat(styles.getPropertyValue("--news-container-gutter"));

    if (!Number.isFinite(gutter)) {
      var container = document.querySelector(
        ".news-and-events-page .container-xxl"
      );
      gutter = container ? container.getBoundingClientRect().left : 0;
    }

    return Math.max(0, gutter);
  }

  function getTrailingOffset(swiper) {
    var lastSlide = swiper.slides && swiper.slides[swiper.slides.length - 1];
    var slideWidth = lastSlide ? lastSlide.offsetWidth : 0;
    var gutter = getContainerGutter();
    var sliderWidth = sliderEl.clientWidth;

    if (!slideWidth) return gutter;

    return Math.max(gutter, sliderWidth - slideWidth - gutter);
  }

  function refreshOffsets(swiper) {
    swiper.params.slidesOffsetBefore = getContainerGutter();
    swiper.params.slidesOffsetAfter = getTrailingOffset(swiper);
  }

  function getWheelDelta(event) {
    var delta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;

    if (event.deltaMode === 1) return delta * 16;
    if (event.deltaMode === 2) return delta * window.innerHeight;
    return delta;
  }

  function unlockWheelTransition() {
    window.clearTimeout(wheelUnlockTimer);
    isWheelTransitioning = false;
  }

  function goToSlide(swiper, index) {
    var nextIndex = Math.max(0, Math.min(index, swiper.slides.length - 1));
    if (nextIndex === swiper.activeIndex) return false;

    var targetSlide = swiper.slides[nextIndex];
    if (!targetSlide) return false;

    var targetLeft = targetSlide.getBoundingClientRect().left;
    var targetTranslate =
      swiper.getTranslate() + getContainerGutter() - targetLeft;

    isWheelTransitioning = true;
    swiper.activeIndex = nextIndex;
    swiper.realIndex = nextIndex;
    swiper.updateSlidesClasses();
    swiper.setTransition(wheelSlideDuration);
    swiper.setTranslate(targetTranslate);

    window.clearTimeout(wheelUnlockTimer);
    wheelUnlockTimer = window.setTimeout(function () {
      swiper.setTransition(0);
      swiper.setTranslate(targetTranslate);
      unlockWheelTransition();
    }, wheelUnlockDelay);

    return true;
  }

  function bindWheelSlide(swiper) {
    if (!section) return;

    section.addEventListener(
      "wheel",
      function (event) {
        if (window.matchMedia("(max-width: 767.9px)").matches) return;
        if (isWheelTransitioning) {
          event.preventDefault();
          return;
        }

        var delta = getWheelDelta(event);
        if (Math.abs(delta) < 8) return;

        var targetIndex = swiper.activeIndex + (delta > 0 ? 1 : -1);
        var didSlide = goToSlide(swiper, targetIndex);

        if (didSlide) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
  }

  var featuredSwiper = new Swiper(sliderEl, {
    slidesPerView: "auto",
    centeredSlides: false,
    loop: false,
    rewind: false,
    speed: 650,
    spaceBetween: 58,
    grabCursor: true,
    resistanceRatio: 0,
    slidesOffsetBefore: getContainerGutter(),
    slidesOffsetAfter: 0,
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
    on: {
      beforeInit: function (swiper) {
        refreshOffsets(swiper);
      },
      resize: function (swiper) {
        refreshOffsets(swiper);
      },
      breakpoint: function (swiper) {
        refreshOffsets(swiper);
      },
      imagesReady: function (swiper) {
        refreshOffsets(swiper);
        swiper.update();
      },
      slideChangeTransitionEnd: function (swiper) {
        unlockWheelTransition();
      },
    },
  });

  refreshOffsets(featuredSwiper);
  featuredSwiper.update();
  bindWheelSlide(featuredSwiper);

  window.addEventListener("resize", function () {
    refreshOffsets(featuredSwiper);
    featuredSwiper.update();
    featuredSwiper.slideTo(featuredSwiper.activeIndex, 0);
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
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reducedMotion) return;

  // ── news-top-bar: slide in from left ──
  var topBar = newsSection.querySelector(".news-top-bar");
  if (topBar) {
    // -YP start
    gsap.set(topBar, { autoAlpha: 0, x: -90, zIndex: 10 });
    // -YP end
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
          // -YP start
          zIndex: 10,
          // -YP end
        });
      },
    });
  }

  // News cards: subtle fade-up on entry.
  var cards = gsap.utils.toArray(".bbt-fa-news-sec .news-grid .card");
  cards.forEach(function (card, i) {
    gsap.set(card, { autoAlpha: 0, y: 36 });

    ScrollTrigger.create({
      trigger: card,
      start: "top 86%",
      once: true,
      onEnter: function () {
        gsap.to(card, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          delay: (i % 3) * 0.04,
          ease: "power2.out",
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
