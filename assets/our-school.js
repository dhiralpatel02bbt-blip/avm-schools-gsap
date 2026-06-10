// ============================================================
// CAMPUS SECTION — Our School Page
//
// The .campus-stage is tall (300vh). Inside it, .campus-viewport
// is position:sticky so it stays in view while the page scrolls.
//
// PHASE 1  (page load, scroll = 0)
//   – School image is visible
//   – Blue half-circle animates in from the left
//   – Body text slides in from the left, opacity 0 → 1
//
// PHASE 2  (user scrolls — first half of campus-stage)
//   – Body text slides left + fades out (scrubbed)
//   – Blue half-circle slides left + fades out (scrubbed)
//   – Only the school image remains
//
// PHASE 3  (user scrolls more — second half of campus-stage)
//   – Campus image slider becomes visible and starts running
//   – Each slide: yellow half-circle enters from bottom-left,
//     then text fades in after a short delay
// ============================================================

(function initCampusSection() {
  if (!document.querySelector("body.our-school-page")) return;

  var campusSection = document.querySelector(".campus-section");
  if (!campusSection) return;

  var campusViewport = campusSection.querySelector(".campus-viewport");
  var campusStaticMedia = campusSection.querySelector(".campus-static-media");
  var campusSliderShell = campusSection.querySelector(".campus-slider-shell");
  var campusScroller = campusSection.querySelector(".campus-sequence-swiper");
  var campusTrack = campusSection.querySelector(
    ".campus-sequence-swiper .swiper-wrapper",
  );
  var campusSlides = gsap.utils.toArray(
    ".campus-section .campus-sequence-slide",
  );
  var campusSlideVisuals = campusSlides.map(function (slide) {
    return slide.querySelector(".campus-slide-visual");
  });
  var campusText = campusSection.querySelector(".body-txt");
  var campusHalfCircle = campusSection.querySelector(".half-circle");

  var isDesktop = window.innerWidth >= 992;

  var loadTL = null;
  var horizontalTween = null;
  var sliderShown = false;
  var activeSlideIndex = -1;
  var introActive = false;
  var hasReachedSlider = false;
  var CAMPUS_MASK_DURATION = 1.35;
  var CAMPUS_CIRCLE_DELAY_AFTER_MASK = 0.08;
  var CAMPUS_TEXT_DELAY_AFTER_CIRCLE = 0.68;

  function animateSlide(index, immediate, delay) {
    if (!campusSlides.length) return;

    // campusSlides.forEach(function (slide, slideIndex) {
    //   var c = slide.querySelector(".campus-slide-circle");
    //   var t = slide.querySelector(".campus-slide-text");
    //   if (!c || !t) return;
    //   gsap.killTweensOf([c, t]);
    //   if (slideIndex !== index) {
    //     gsap.set(c, { x: -110, y: 110, autoAlpha: 0 });
    //     gsap.set(t, { y: 32, autoAlpha: 0 });
    //   }
    // });
    campusSlides.forEach(function (slide) {
      var c = slide.querySelector(".campus-slide-circle");
      var t = slide.querySelector(".campus-slide-text");

      if (c) gsap.set(c, { x: -110, y: 110, autoAlpha: 0 });
      if (t) gsap.set(t, { y: 32, autoAlpha: 0 });
    });

    var active = campusSlides[index];
    var c = active && active.querySelector(".campus-slide-circle");
    var t = active && active.querySelector(".campus-slide-text");
    if (!c || !t) return;

    var d = immediate ? 0 : delay || 0;
    gsap.to(c, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: "power3.out",
      delay: d + 0.3,
      overwrite: true,
    });
    gsap.to(t, {
      y: 0,
      autoAlpha: 1,
      duration: 0.75,
      ease: "power3.out",
      delay: d + 0.9,
      overwrite: true,
    });
  }

  // ─────────────────────────────────────────────────────────
  // Swiper init
  // ─────────────────────────────────────────────────────────
  function setActiveSlide(index, immediate, delay) {
    if (!campusSlides.length) return;
    var safeIndex = Math.max(0, Math.min(index, campusSlides.length - 1));
    if (safeIndex === activeSlideIndex && !immediate && index !== 0) return;
    activeSlideIndex = safeIndex;
    animateSlide(safeIndex, immediate, delay);
  }

  function buildHorizontalTween() {
    return null;
  }

  function resetHorizontalTrack() {
    if (horizontalTween) horizontalTween.progress(0);
    if (campusTrack) gsap.set(campusTrack, { y: 0 });
    if (campusScroller) campusScroller.scrollTop = 0;
    lastMaskedIndex = -1;
    revealSlideWithMask(0, true);
    setActiveSlide(0, true);
  }

  function updateHorizontalTrack(progress) {
    if (!campusSlides.length) return;
    // Scroll progress se slide index nikalo (0 to length-1)
    var nextIndex = Math.round(progress * (campusSlides.length - 1));
    revealSlideWithMask(nextIndex, false);
    setActiveSlide(
      nextIndex,
      false,
      CAMPUS_MASK_DURATION + CAMPUS_CIRCLE_DELAY_AFTER_MASK,
    );
  }
  var maskAnimating = false;
  var lastMaskedIndex = -1;

  function revealSlideWithMask(index, immediate) {
    if (!campusSlides.length) return;
    if (index === lastMaskedIndex && !immediate) return;
    lastMaskedIndex = index;

    campusSlides.forEach(function (slide, i) {
      var visual = campusSlideVisuals[i];
      if (!visual) return;
      if (i === index) {
        // Yeh slide visible rahega — top pe
        gsap.set(slide, { zIndex: 3 });
        if (immediate) {
          gsap.set(visual, { clipPath: "inset(0% 0% 0% 0%)" });
        } else {
          // Neeche se mask reveal: inset bottom 100% → 0%
          gsap.fromTo(
            visual,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.35,
              ease: "power3.inOut",
              overwrite: true,
            },
          );
        }
      } else if (i < index) {
        // Pichle slides — already revealed, neeche z-index
        gsap.set(slide, { zIndex: 1 });
        gsap.set(visual, { clipPath: "inset(0% 0% 0% 0%)" });
      } else {
        // Agle slides — abhi hidden
        gsap.set(slide, { zIndex: 2 });
        gsap.set(visual, { clipPath: "inset(100% 0% 0% 0%)" });
      }
    });
  }

  function showSlider() {
    if (sliderShown) return;
    sliderShown = true;
    campusSliderShell.style.pointerEvents = "auto";
    gsap.set(campusSliderShell, { autoAlpha: 1 });
    lastMaskedIndex = -1;
    revealSlideWithMask(0, true);
    setActiveSlide(0, true);
  }

  function hideSlider() {
    if (!sliderShown) return;
    sliderShown = false;
    campusSliderShell.style.pointerEvents = "none";
    gsap.to(campusSliderShell, {
      autoAlpha: 0,
      duration: 0.3,
      ease: "power2.in",
      overwrite: true,
    });
    resetHorizontalTrack();
  }
  if (!isDesktop) {
    if (campusText) gsap.set(campusText, { clearProps: "all" });
    if (campusHalfCircle) gsap.set(campusHalfCircle, { clearProps: "all" });
    if (campusTrack) gsap.set(campusTrack, { clearProps: "transform" });
    if (campusSliderShell) {
      campusSliderShell.style.opacity = "1";
      campusSliderShell.style.visibility = "visible";
      campusSliderShell.style.pointerEvents = "auto";
    }
    campusSlides.forEach(function (slide) {
      var visual = slide.querySelector(".campus-slide-visual");
      var c = slide.querySelector(".campus-slide-circle");
      var t = slide.querySelector(".campus-slide-text");
      if (c) gsap.set(c, { clearProps: "all" });
      if (t) gsap.set(t, { clearProps: "all" });
      if (visual) gsap.set(visual, { clearProps: "clipPath" });
      gsap.set(slide, { clearProps: "zIndex" });
    });
    return;
  }

  gsap.set(campusText, { autoAlpha: 0, x: -96, filter: "blur(14px)" });
  gsap.set(campusHalfCircle, { xPercent: -22 });
  gsap.set(campusSliderShell, { autoAlpha: 0 });
  campusSliderShell.style.pointerEvents = "none";
  if (campusTrack) gsap.set(campusTrack, { y: 0 });

  campusSlides.forEach(function (slide, i) {
    var visual = slide.querySelector(".campus-slide-visual");
    if (i === 0) {
      gsap.set(slide, { zIndex: 3 });
      if (visual) gsap.set(visual, { clipPath: "inset(0% 0% 0% 0%)" });
    } else {
      gsap.set(slide, { zIndex: 2 });
      if (visual) gsap.set(visual, { clipPath: "inset(100% 0% 0% 0%)" });
    }
  });
  lastMaskedIndex = 0;
  setActiveSlide(0, false, 0.2);

  function playLoadAnim(isReentry) {
    if (!campusText) return;
    if (loadTL) {
      loadTL.kill();
      loadTL = null;
    }

    introActive = true;

    gsap.killTweensOf([campusHalfCircle, campusText]);
    gsap.set(campusHalfCircle, { xPercent: -40, autoAlpha: 0 });
    gsap.set(campusText, { x: -96, autoAlpha: 0, filter: "blur(14px)" });

    loadTL = gsap.timeline({
      delay: isReentry ? 0 : 0.2,
      onComplete: function () {
        introActive = false;
      },
    });

    if (campusHalfCircle) {
      loadTL.to(
        campusHalfCircle,
        {
          xPercent: 0,
          autoAlpha: 1,
          duration: 1.3,
          ease: "power3.out",
        },
        0,
      );
    }
    loadTL.fromTo(
      campusText,
      { x: -96, autoAlpha: 0, filter: "blur(14px)" },
      {
        x: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.0,
        ease: "power3.out",
      },
      0.6,
    );
  }

  if (document.readyState === "complete") {
    requestAnimationFrame(function () {
      playLoadAnim(false);
    });
  } else {
    window.addEventListener(
      "load",
      function () {
        playLoadAnim(false);
      },
      { once: true },
    );
  }

  if (!campusViewport) return;

  // ─────────────────────────────────────────────────────────
  // PHASE 2 + 3 — GSAP pins the viewport for 200vh of scroll
  //
  // pin: true  → GSAP pins campusViewport in place and
  //              automatically adds a spacer so content below
  //              it flows correctly (no blank white screen).
  //
  // pinSpacing: true → GSAP inserts the spacer div.
  //
  // Total pinned scroll = 200vh (2 × viewport height).
  //
  // Progress 0.00 → 0.50 : exit text + circle (scrubbed)
  // Progress 0.50 → 1.00 : slider is visible + autoplay
  // ─────────────────────────────────────────────────────────

  // Build paused exit timeline (scrubbed manually via onUpdate)
  var exitTL = gsap.timeline({ paused: true });

  if (campusStaticMedia) {
    exitTL.to(campusStaticMedia, { scale: 1, ease: "none", duration: 1 }, 0);
  }
  if (campusHalfCircle) {
    exitTL.to(
      campusHalfCircle,
      { xPercent: -80, autoAlpha: 0, ease: "none", duration: 1 },
      0,
    );
  }
  if (campusText) {
    exitTL.to(
      campusText,
      {
        x: -180,
        autoAlpha: 0,
        filter: "blur(10px)",
        ease: "none",
        duration: 1,
      },
      0,
    );
  }

  // ─────────────────────────────────────────────────────────
  // PHASE 2 + 3: campusViewport ko pin karo 200vh ke liye
  // Phase 2 (0→0.50): text + circle exit
  // Phase 3 (0.50→1.00): slider slides change
  // Dev section ka apna alag ScrollTrigger hai (right→left horizontal)
  // ─────────────────────────────────────────────────────────

  // Header — campus pin zone mein hamesha visible rakho
  // Directional header code insideCampusPin() check se automatically ruk jata hai,
  // lekin yahan explicitly show karo taaki koi bhi hide state clear ho jaye
  var siteHeader = document.querySelector("header.header");
  if (siteHeader) {
    siteHeader.style.setProperty("z-index", "1000", "important");
    siteHeader.style.setProperty("opacity", "1", "important");
    siteHeader.style.setProperty("transform", "translateY(0)", "important");
    // opacity aur transform GSAP pe chhod do — inline override mat karo
    // taaki directional header code baad mein sahi se kaam kare
  }

  // campusViewport pin karo — 200vh scroll space
  ScrollTrigger.create({
    trigger: campusViewport,
    start: "top top",
    end: "+=200%",
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onRefresh: function () {
      horizontalTween = buildHorizontalTween();
    },
    onUpdate: function (self) {
      var p = self.progress;

      // ── Phase 2: scroll-driven exit (0 → 0.50) ──────────────
      // introActive ke dauran skip karo — playLoadAnim apne elements khud control karta hai
      if (!introActive) {
        var exitP = Math.min(p / 0.5, 1);
        exitTL.progress(exitP);
      }

      // ── Phase 3: slider (0.50 → 1.00) ───────────────────────
      if (p >= 0.03) {
        hasReachedSlider = true;
        showSlider();

        // 🔴 BLUE PART HIDE KARO (IMPORTANT)
        gsap.to(campusHalfCircle, {
          autoAlpha: 0,
          xPercent: -100,
          duration: 0.4,
          overwrite: true,
        });

        gsap.to(campusText, {
          autoAlpha: 0,
          x: -120,
          duration: 0.4,
          overwrite: true,
        });

        var sliderP = (p - 0.5) / 0.5;
        updateHorizontalTrack(Math.min(sliderP, 1));
      } else {
        hideSlider();
        if (hasReachedSlider && p < 0.03 && !introActive) {
          hasReachedSlider = false;
          exitTL.progress(0);
          playLoadAnim(true);
        }
      }
    },
    onLeave: function () {
      showSlider();
    },
  });
  window.addEventListener("resize", function () {
    horizontalTween = null;
    ScrollTrigger.refresh();
  });
})();

// ============================================================
// DEVELOPMENT SECTION — pinned horizontal gallery
// Each mouse-wheel gesture advances one slide while pinned.
// Scrolling up/down at the ends releases the page naturally.
// ============================================================
(function initDevSection() {
  if (!document.querySelector("body.our-school-page")) return;

  var devTween = null;
  var devTrigger = null;
  var resizeTimer = null;
  var cleanupFns = [];

  function clearDevSection() {
    cleanupFns.forEach(function (fn) {
      fn();
    });
    cleanupFns = [];

    if (devTrigger) {
      devTrigger.kill();
      devTrigger = null;
    }
    if (devTween) {
      devTween.kill();
      devTween = null;
    }
  }

  function buildDevSection() {
    clearDevSection();

    var devSec = document.querySelector(".development-sec");
    var devTrack = document.querySelector(".dev-track");
    if (!devSec || !devTrack) return;

    gsap.set(devTrack, { clearProps: "x" });

    if (window.innerWidth < 992) return;

    var slides = Array.from(devTrack.querySelectorAll(".dev-slide"));
    if (!slides.length) return;

    var viewportWidth = window.innerWidth;
    var headingContainer = devSec.querySelector(".container-xxl");
    var sectionLeftEdge = headingContainer
      ? headingContainer.getBoundingClientRect().left
      : Math.min(Math.max(viewportWidth * 0.04, 16), 48);
    var sectionRightGap = headingContainer
      ? Math.max(
          viewportWidth - headingContainer.getBoundingClientRect().right,
          48,
        )
      : Math.min(Math.max(viewportWidth * 0.06, 48), 110);
    var currentSlide = 0;
    var isAnimating = false;
    var wheelCooldownUntil = 0;
    var touchStartY = 0;

    function getSlideOffset(index) {
      var slide = slides[index];
      if (!slide) return 0;

      // Sabhi slides left-aligned — left edge se sectionLeftEdge pe aayenge
      return sectionLeftEdge - slide.offsetLeft;
    }

    var slideOffsets = slides.map(function (_, index) {
      return getSlideOffset(index);
    });

    function goToSlide(index, immediate) {
      if (index < 0 || index >= slides.length) return;
      currentSlide = index;

      if (devTween) {
        devTween.kill();
        devTween = null;
      }

      if (immediate) {
        gsap.set(devTrack, { x: slideOffsets[index] });
        isAnimating = false;
        return;
      }

      isAnimating = true;
      devTween = gsap.to(devTrack, {
        x: slideOffsets[index],
        duration: 0.6,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: function () {
          isAnimating = false;
          devTween = null;
        },
      });
    }

    function releaseScroll(direction) {
      if (!devTrigger) return;
      var targetScroll =
        direction > 0 ? devTrigger.end + 2 : Math.max(devTrigger.start - 2, 0);
      window.scrollTo({ top: targetScroll, behavior: "auto" });
    }

    goToSlide(0, true);

    devTrigger = ScrollTrigger.create({
      trigger: devSec,
      start: "top top",
      end: function () {
        return "+=" + Math.max(viewportWidth * 0.9, window.innerHeight * 1.2);
      },
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    function onWheel(e) {
      if (!devTrigger || !devTrigger.isActive) return;

      var now = Date.now();
      if (now < wheelCooldownUntil) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 10) return;

      var direction = e.deltaY > 0 ? 1 : -1;
      var nextSlide = currentSlide + direction;

      e.preventDefault();

      if (isAnimating) return;

      wheelCooldownUntil = now + 650;

      if (nextSlide < 0 || nextSlide >= slides.length) {
        releaseScroll(direction);
        return;
      }

      goToSlide(nextSlide, false);
    }

    function onKeyDown(e) {
      if (!devTrigger || !devTrigger.isActive || isAnimating) return;

      var direction = 0;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") direction = 1;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") direction = -1;
      if (!direction) return;

      e.preventDefault();
      var nextSlide = currentSlide + direction;
      if (nextSlide < 0 || nextSlide >= slides.length) {
        releaseScroll(direction);
        return;
      }

      goToSlide(nextSlide, false);
    }

    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
      if (!devTrigger || !devTrigger.isActive || isAnimating) return;

      var diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 36) return;

      var direction = diff > 0 ? 1 : -1;
      var nextSlide = currentSlide + direction;
      if (nextSlide < 0 || nextSlide >= slides.length) {
        releaseScroll(direction);
        return;
      }

      goToSlide(nextSlide, false);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    devSec.addEventListener("touchstart", onTouchStart, { passive: true });
    devSec.addEventListener("touchend", onTouchEnd, { passive: true });

    cleanupFns.push(function () {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      devSec.removeEventListener("touchstart", onTouchStart);
      devSec.removeEventListener("touchend", onTouchEnd);
    });
  }

  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      buildDevSection();
      ScrollTrigger.refresh();
    }, 120);
  }

  if (document.readyState === "complete") {
    buildDevSection();
  } else {
    window.addEventListener("load", buildDevSection, { once: true });
  }

  window.addEventListener("resize", handleResize);
})();

// Our School page location section: short opposite-side reveal.
(function initLocationSectionReveal() {
  if (!document.querySelector("body.our-school-page")) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  var section = document.querySelector(".location-section");
  var leftColumn = document.querySelector(".location-section .campus-heading");
  var rightColumn = document.querySelector(".location-section .campus-grid");

  if (!section || !leftColumn || !rightColumn) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set([leftColumn, rightColumn], { clearProps: "all" });
    return;
  }

  var hasRevealed = false;

  gsap.set(leftColumn, { autoAlpha: 0, x: -28 });
  gsap.set(rightColumn, { autoAlpha: 0, x: 28 });

  function revealLocationSection() {
    if (hasRevealed) return;
    hasRevealed = true;

    gsap
      .timeline({
        defaults: {
          duration: 0.8,
          ease: "power3.out",
        },
      })
      .to(leftColumn, { autoAlpha: 1, x: 0 })
      .to(rightColumn, { autoAlpha: 1, x: 0 }, "-=0.58");
  }

  // FIX: refresh() pehle karo taaki campus + dev section ke pins ki
  // wajah se scroll height sahi ho, phir trigger register karo.
  // Pehle create() baad mein refresh() karna galat hai — "once:true" trigger
  // galat position pe register hota hai aur onEnter kabhi fire nahi hota.
  if (document.readyState === "complete") {
    ScrollTrigger.refresh();
    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      once: true,
      onEnter: revealLocationSection,
      invalidateOnRefresh: true,
    });
  } else {
    window.addEventListener(
      "load",
      function () {
        ScrollTrigger.refresh();
        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          once: true,
          onEnter: revealLocationSection,
          invalidateOnRefresh: true,
        });
      },
      { once: true },
    );
  }
})();

if (
  typeof Swiper !== "undefined" &&
  document.querySelector(".development-swiper")
) {
  new Swiper(".development-swiper", {
    loop: true,
    speed: 900,
    slidesPerView: 1.62,
    spaceBetween: 230,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
      768: {
        slidesPerView: 1.25,
        spaceBetween: 80,
      },
      1200: {
        slidesPerView: 1.62,
        spaceBetween: 230,
      },
    },
  });
}
