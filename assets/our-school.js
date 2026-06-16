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
//   – Each slide: yellow half-circle is present with the slide,
//     then text fades in after a short delay
// ============================================================

(function initCampusSection() {
  if (!document.querySelector("body.our-school-page")) return;

  var campusSection = document.querySelector(".campus-section");
  if (!campusSection) return;

  var campusViewport = campusSection.querySelector(".campus-viewport");
  var campusStaticMedia = campusSection.querySelector(".campus-static-media");
  var campusStack = campusSection.querySelector(".campus-stack");
  var slide1 = campusSection.querySelector(".campus-slide.slide-1");
  var slide2 = campusSection.querySelector(".campus-slide.slide-2");
  var slide3 = campusSection.querySelector(".campus-slide.slide-3");
  var campusText = campusSection.querySelector(".body-txt");
  var campusHalfCircle = campusSection.querySelector(".half-circle");
  var siteHeader = document.querySelector("header.header");

  var isDesktop = window.innerWidth >= 992;
  var loadTL = null;
  var CAMPUS_PIN_DISTANCE = "400%";

  function releaseCampusHeader() {
    if (!siteHeader) return;
    gsap.killTweensOf(siteHeader);
    gsap.set(siteHeader, { clearProps: "transform,opacity,visibility" });
    siteHeader.style.removeProperty("position");
    siteHeader.style.removeProperty("top");
    siteHeader.style.removeProperty("z-index");
  }

  // Initial resets
  if (!isDesktop) {
    if (campusText) gsap.set(campusText, { clearProps: "all" });
    if (campusHalfCircle) gsap.set(campusHalfCircle, { clearProps: "all" });
    if (campusStack) gsap.set(campusStack, { clearProps: "all" });
    if (slide1) gsap.set(slide1, { clearProps: "all" });
    if (slide2) gsap.set(slide2, { clearProps: "all" });
    if (slide3) gsap.set(slide3, { clearProps: "all" });
    return;
  }

  gsap.set(campusText, { autoAlpha: 0, x: -96, filter: "none" });
  gsap.set(campusHalfCircle, { xPercent: -22 });
  gsap.set(campusStack, { autoAlpha: 0 });

  function playLoadAnim(isReentry) {
    if (!campusText) return;
    if (loadTL) {
      loadTL.kill();
      loadTL = null;
    }

    // Do not kill all tweens, as it kills the masterTL scrub tweens
    // gsap.killTweensOf([campusHalfCircle, campusText]);

    if (isReentry) {
      if (siteHeader) {
        gsap.killTweensOf(siteHeader);
        siteHeader.style.setProperty("position", "fixed");
        siteHeader.style.setProperty("top", "0");
        siteHeader.style.setProperty("z-index", "1000");
        gsap.set(siteHeader, {
          y: -siteHeader.offsetHeight - 16,
          autoAlpha: 0,
        });
      }
    }
    gsap.set(campusHalfCircle, { xPercent: -40, autoAlpha: 0 });
    gsap.set(campusText, { x: -96, autoAlpha: 0, filter: "none" });

    loadTL = gsap.timeline({
      delay: isReentry ? 0 : 0.2,
    });

    if (isReentry && siteHeader) {
      loadTL.to(
        siteHeader,
        { y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out" },
        0,
      );
    }

    if (campusHalfCircle) {
      loadTL.to(
        campusHalfCircle,
        { xPercent: 0, autoAlpha: 1, duration: 2.2, ease: "power3.out" },
        0,
      );
    }
    loadTL.fromTo(
      campusText,
      { x: -96, autoAlpha: 0, filter: "none" },
      { x: 0, autoAlpha: 1, filter: "none", duration: 1.6, ease: "power3.out" },
      0.55,
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

  if (siteHeader) {
    siteHeader.style.setProperty("z-index", "1000", "important");
  }

  ScrollTrigger.create({
    trigger: campusViewport,
    start: "top top",
    end: "+=" + CAMPUS_PIN_DISTANCE,
    onLeaveBack: releaseCampusHeader,
    onLeave: releaseCampusHeader,
  });

  // To make the next section overlap, we pin the viewport for 500%
  // but use pinSpacing: false, manually adding 400vh padding to the stage.
  // This makes the next section start overlapping during the last 100vh of the pin.
  if (isDesktop) {
    var campusStage = campusSection.querySelector(".campus-stage");
    if (campusStage) {
      gsap.set(campusStage, { paddingBottom: "400vh" });
    }
  }

  var slide1Circle = slide1.querySelector(".campus-slide-circle");
  var slide1Text = slide1.querySelector(".campus-slide-text");
  var slide2Circle = slide2.querySelector(".campus-slide-circle");
  var slide2Text = slide2.querySelector(".campus-slide-text");
  var slide3Circle = slide3.querySelector(".campus-slide-circle");
  var slide3Text = slide3.querySelector(".campus-slide-text");

  if (isDesktop) {
    gsap.set([slide1Circle, slide2Circle, slide3Circle], { x: -60, autoAlpha: 0 });
    gsap.set([slide1Text, slide2Text, slide3Text], { x: -60, autoAlpha: 0 });
  }

  // Master timeline for scrubbing the pinned section
  var masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: campusViewport,
      start: "top top",
      end: "+=500%",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        if (self.progress > 0 && loadTL && loadTL.isActive()) {
          loadTL.progress(1);
        }
      },
      onLeaveBack: function () {
        playLoadAnim(true);
      }
    }
  });

  // Phase 2: Fade out initial elements (Blue Circle & Text)
  // Duration of 10 units for a smoother exit
  masterTL.fromTo(campusHalfCircle, { xPercent: 0, autoAlpha: 1 }, { xPercent: -100, autoAlpha: 0, ease: "none", duration: 10, immediateRender: false }, 0.1);
  masterTL.fromTo(campusText, { x: 0, autoAlpha: 1 }, { x: -180, autoAlpha: 0, filter: "none", ease: "none", duration: 10, immediateRender: false }, 0.1);
  masterTL.to(campusStaticMedia, { scale: 1, ease: "none", duration: 10 }, 0);

  // Bring in the stacked images cleanly
  masterTL.to(campusStack, { autoAlpha: 1, duration: 0.1, ease: "none" }, 10);

  // Phase 3: Reveal Slide 1 Details (Yellow Circle & Text)
  masterTL.to(slide1Circle, { x: 0, autoAlpha: 1, duration: 5, ease: "power1.out" }, 10.1);
  masterTL.to(slide1Text, { x: 0, autoAlpha: 1, duration: 5, ease: "power1.out" }, 10.1);

  // Pause to look at slide 1
  masterTL.to({}, { duration: 15 }, 15.1);

  // Slide 1 up to reveal slide 2
  masterTL.to(slide1, { yPercent: -100, ease: "power1.inOut", duration: 15 }, 30.1);

  // Reveal Slide 2 Details
  masterTL.to(slide2Circle, { x: 0, autoAlpha: 1, duration: 5, ease: "power1.out" }, 45.1);
  masterTL.to(slide2Text, { x: 0, autoAlpha: 1, duration: 5, ease: "power1.out" }, 45.1);

  // Pause to look at slide 2
  masterTL.to({}, { duration: 15 }, 50.1);

  // Slide 2 up to reveal slide 3
  masterTL.to(slide2, { yPercent: -100, ease: "power1.inOut", duration: 15 }, 65.1);

  // Reveal Slide 3 Details
  masterTL.to(slide3Circle, { x: 0, autoAlpha: 1, duration: 5, ease: "power1.out" }, 80.1);
  masterTL.to(slide3Text, { x: 0, autoAlpha: 1, duration: 5, ease: "power1.out" }, 80.1);

  // Pause on slide 3 at the end
  masterTL.to({}, { duration: 15 }, 85.1);

  // Add empty space to the timeline so the animation finishes at exactly 80% (400vh out of 500vh)
  // This gives the remaining 20% (100vh) of scroll for the next section to slide up and overlap.
  masterTL.to({}, { duration: 25 }, 100.1);

})();

// ============================================================
// DEVELOPMENT SECTION — pinned horizontal gallery
// ============================================================
(function initDevSection() {
  if (!document.querySelector("body.our-school-page")) return;

  var devSec = document.querySelector(".development-sec");
  var devTrack = document.querySelector(".dev-track");
  if (!devSec || !devTrack) return;

  var slides = Array.from(devTrack.querySelectorAll(".dev-slide"));
  if (!slides.length) return;

  var mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", function () {
    function getScrollAmount() {
      var lastSlide = slides[slides.length - 1];
      var firstSlide = slides[0];
      return -(lastSlide.offsetLeft - firstSlide.offsetLeft);
    }

    gsap.to(devTrack, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: devSec,
        start: "top top",
        end: () => "+=" + Math.abs(getScrollAmount()),
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (slides.length - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.05,
          ease: "power2.inOut"
        },
        invalidateOnRefresh: true,
      }
    });

    return function () {
      gsap.set(devTrack, { clearProps: "x" });
    };
  });
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

  var devSec = document.querySelector(".development-sec");

  gsap.fromTo([section, devSec],
    { backgroundColor: "#ffffff" },
    {
      backgroundColor: "#f7df00",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true
      }
    }
  );

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

// ============================================================
// FOOTER REVEAL SECTION
// ============================================================
(function initFooterReveal() {
  if (!document.querySelector("body.our-school-page")) return;
  
  var footerWrap = document.querySelector(".footer-reveal-wrapper");
  var locationSec = document.querySelector(".location-section");
  if (!footerWrap || !locationSec) return;

  function updateFooter() {
    var h = footerWrap.offsetHeight;
    // Set margin-bottom on location section to create scroll space
    locationSec.style.marginBottom = h + "px";
  }

  // Initial update
  updateFooter();

  // Update on resize
  window.addEventListener("resize", updateFooter);

  // Set CSS for fixed footer to prevent jerking on scroll
  gsap.set(footerWrap, {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 0
  });

  // Make sure body doesn't overlap if it has background
  gsap.set(document.body, { backgroundColor: "transparent" });
})();
