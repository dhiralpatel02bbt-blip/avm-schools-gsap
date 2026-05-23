gsap.config({ force3D: true });
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// HEADER (GSAP)
//
// Behavior:
//   • Page load pe hamesha visible
//   • Scroll DOWN → header slide up (hide)
//   • Scroll UP   → header slide down (show)
//   • Top of page → hamesha show
//
// Page-specific overrides:
//   • our-school-page: campus section ke andar hamesha visible rahega
//     (campus section apna inline style set karta hai — us dauraan
//      directional logic pause rahega)
//   • homepage (.bbt-dp-hero): hero section ke andar hamesha visible
// ============================================================
(function initDirectionalHeader() {
  var hdr = document.querySelector("header.header");
  if (!hdr) return;
  gsap.killTweensOf(hdr);
  gsap.set(hdr, { y: 0, opacity: 1, clearProps: "transform" });
  return;

  var lastScrollY = window.scrollY;
  var headerH = hdr.offsetHeight;
  var isHidden = false;
  var ticking = false;

  // Campus section reference (our-school-page pe hoga)
  var campusViewportEl = document.querySelector(".campus-viewport");
  // Homepage hero reference
  var homepageHero = document.querySelector(".bbt-dp-hero");

  // ── Helper: Campus section ke pin zone mein hain? ──────────────────
  // GSAP campusViewport ko pin karta hai 200vh ke liye.
  // Us dauraan header ko chhedna nahi chahiye.
  function insideCampusPin() {
    if (!campusViewportEl) return false;
    var rect = campusViewportEl.getBoundingClientRect();
    // Jab viewport sticky ho (rect.top === 0), campus pin active hai
    return rect.top <= 0 && rect.bottom >= window.innerHeight * 0.5;
  }

  // ── Helper: Homepage hero ke andar hain? ───────────────────────────
  function insideHomepageHero() {
    if (!homepageHero) return false;
    var heroBottom = homepageHero.offsetTop + homepageHero.offsetHeight;
    return window.scrollY <= heroBottom - 100;
  }

  // ── Show / Hide functions ───────────────────────────────────────────
  function showHeader() {
    if (!isHidden) return;
    isHidden = false;
    gsap.to(hdr, {
      y: 0,
      opacity: 1,
      duration: 0.38,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  function hideHeader() {
    if (isHidden) return;
    isHidden = true;
    gsap.to(hdr, {
      y: -headerH - 10,
      opacity: 0,
      duration: 0.28,
      ease: "power3.in",
      overwrite: "auto",
    });
  }

  // ── Scroll handler ──────────────────────────────────────────────────
  function onScroll() {
    var currentY = window.scrollY;
    var direction = currentY > lastScrollY ? "down" : "up"; // down ya up
    var delta = Math.abs(currentY - lastScrollY);

    // Top of page — hamesha show
    if (currentY <= 10) {
      showHeader();
      lastScrollY = currentY;
      return;
    }

    // Campus section pin zone — header ko GSAP campus code control karta hai
    // Hum yahan kuch nahi karte
    if (insideCampusPin()) {
      lastScrollY = currentY;
      return;
    }

    // Homepage hero zone — hamesha show
    if (insideHomepageHero()) {
      showHeader();
      lastScrollY = currentY;
      return;
    }

    // Very small scroll ignore karo (jitter prevention)
    if (delta < 4) {
      lastScrollY = currentY;
      return;
    }

    // Direction-based logic
    if (direction === "down") {
      hideHeader();
    } else {
      showHeader();
    }

    lastScrollY = currentY;
  }

  // rAF-throttled scroll listener
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  // Resize pe headerH update karo
  window.addEventListener("resize", function () {
    headerH = hdr.offsetHeight;
  });
})();

// Admissions hero + journey scroll animation
(function initAdmissionsAnimation() {
  if (!document.querySelector("body.admissions-page")) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  var hero = document.querySelector(".admission-hero");
  var heroCircle = document.querySelector(".admission-hero .blue-half-circle");
  var heroTitle = document.querySelector(".admission-hero .main-title");
  var circleSection = document.querySelector(".bbt-fa-circle-sec");
  var cards = gsap.utils.toArray(".bbt-fa-circle-sec .circle-card");
  var contents = gsap.utils.toArray(".bbt-fa-circle-sec .circle-card .content");
  var segments = gsap.utils.toArray(".bbt-fa-circle-sec .journey-line-segment");
  var aboutSection = document.querySelector(".bbt-fa-admissions-about-sec");
  var aboutItems = gsap.utils.toArray(
    ".bbt-fa-admissions-about-sec .avm-image-wrap, .bbt-fa-admissions-about-sec .avm-text, .bbt-fa-admissions-about-sec .avm-slider-controls",
  );

  if (!hero || !heroCircle || !heroTitle) return;

  var reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var isDesktop = window.innerWidth >= 768;

  if (reducedMotion || !isDesktop) {
    gsap.set([heroCircle, heroTitle, cards, contents, segments, aboutItems], {
      clearProps: "all",
    });
    return;
  }

  gsap.set(heroCircle, {
    xPercent: -34,
    autoAlpha: 1,
    scale: 1,
    transformOrigin: "50% 50%",
  });
  gsap.set(heroTitle, { autoAlpha: 0, x: -130 });

  if (cards.length) {
    gsap.set(cards, {
      autoAlpha: 0,
      scale: 0.42,
      y: 70,
      transformOrigin: "50% 50%",
    });
  }
  if (contents.length) {
    gsap.set(contents, { autoAlpha: 0, y: 24 });
  }
  if (segments.length) {
    gsap.set(segments, {
      autoAlpha: 1,
      scaleX: 0,
      transformOrigin: "left center",
    });
  }
  if (aboutItems.length) {
    gsap.set(aboutItems, { autoAlpha: 0, y: 80 });
  }

  function buildScrollAnimations() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=115%",
          pin: true,
          scrub: 1.05,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .to(
        heroTitle,
        {
          autoAlpha: 0,
          x: -160,
          duration: 0.35,
          ease: "power2.inOut",
        },
        0,
      )
      .to(
        heroCircle,
        {
          xPercent: -2,
          scale: 2.35,
          duration: 1,
          ease: "power2.inOut",
        },
        0,
      );

    if (circleSection && cards.length) {
      var journeyTL = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: circleSection,
          start: "top top",
          end: function () {
            return "+=" + window.innerHeight * 5.6;
          },
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      journeyTL
        .to(cards[0], { autoAlpha: 1, scale: 1, y: 0, duration: 0.75 })
        .to(contents[0], { autoAlpha: 1, y: 0, duration: 0.45 })
        .to(segments[0], { scaleX: 1, duration: 0.72, ease: "power1.inOut" })
        .to(cards[1], { autoAlpha: 1, scale: 1, y: 0, duration: 0.75 })
        .to(contents[1], { autoAlpha: 1, y: 0, duration: 0.45 })
        .to(segments[1], { scaleX: 1, duration: 0.72, ease: "power1.inOut" })
        .to(cards[2], { autoAlpha: 1, scale: 1, y: 0, duration: 0.75 })
        .to(contents[2], { autoAlpha: 1, y: 0, duration: 0.45 })
        .to({}, { duration: 0.45 });
    }

    if (aboutSection && aboutItems.length) {
      gsap.to(aboutItems, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutSection,
          start: "top 72%",
          once: true,
        },
      });
    }

    // ── bbt-fa-online-section: Left/Right slide-in on viewport enter ──
    var onlineSection = document.querySelector(".bbt-fa-online-section");

    if (onlineSection) {
      var onlineLeftItems = gsap.utils.toArray(
        ".bbt-fa-online-section .main-title, .bbt-fa-online-section .description",
      );
      var onlineRightItems = gsap.utils.toArray(
        ".bbt-fa-online-section .sub-title, .bbt-fa-online-section .table-wrapper",
      );

      if (onlineLeftItems.length) {
        gsap.set(onlineLeftItems, { autoAlpha: 0, x: -110 });
      }
      if (onlineRightItems.length) {
        gsap.set(onlineRightItems, { autoAlpha: 0, x: 110 });
      }

      ScrollTrigger.create({
        trigger: onlineSection,
        start: "top 75%",
        once: true,
        onEnter: function () {
          if (onlineLeftItems.length) {
            gsap.to(onlineLeftItems, {
              autoAlpha: 1,
              x: 0,
              duration: 0.88,
              stagger: 0.14,
              ease: "power3.out",
            });
          }
          if (onlineRightItems.length) {
            gsap.to(onlineRightItems, {
              autoAlpha: 1,
              x: 0,
              duration: 0.88,
              stagger: 0.14,
              delay: 0.12,
              ease: "power3.out",
            });
          }
        },
      });
    }

    // ── bbt-fa-pincode-section: title left, subtitle+tabs+content right ──
    var pincodeSection = document.querySelector(".bbt-fa-pincode-section");
    if (pincodeSection) {
      var pincodeLeft = gsap.utils.toArray(".bbt-fa-pincode-section .title");
      var pincodeRight = gsap.utils.toArray(
        ".bbt-fa-pincode-section .subtitle, .bbt-fa-pincode-section .tabs, .bbt-fa-pincode-section .tab-content.active",
      );

      if (pincodeLeft.length) gsap.set(pincodeLeft, { autoAlpha: 0, x: -100 });
      if (pincodeRight.length) gsap.set(pincodeRight, { autoAlpha: 0, x: 100 });

      ScrollTrigger.create({
        trigger: pincodeSection,
        start: "top 78%",
        once: true,
        onEnter: function () {
          gsap.to(pincodeLeft, {
            autoAlpha: 1,
            x: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
          });
          gsap.to(pincodeRight, {
            autoAlpha: 1,
            x: 0,
            duration: 0.85,
            stagger: 0.12,
            delay: 0.1,
            ease: "power3.out",
          });
        },
      });
    }

    // ── bbt-fa-application-section: h1 left, mandatory right, optional left ──
    var appSection = document.querySelector(".bbt-fa-application-section");
    if (appSection) {
      var appHeading = appSection.querySelector("h1");
      var appMandatory = appSection.querySelector(".mandatory");
      var appOptional = appSection.querySelector(".optional");

      if (appHeading) gsap.set(appHeading, { autoAlpha: 0, x: -110 });
      if (appMandatory) gsap.set(appMandatory, { autoAlpha: 0, x: 110 });
      if (appOptional) gsap.set(appOptional, { autoAlpha: 0, x: -110 });

      ScrollTrigger.create({
        trigger: appSection,
        start: "top 78%",
        once: true,
        onEnter: function () {
          if (appHeading)
            gsap.to(appHeading, {
              autoAlpha: 1,
              x: 0,
              duration: 0.82,
              ease: "power3.out",
            });
          if (appMandatory)
            gsap.to(appMandatory, {
              autoAlpha: 1,
              x: 0,
              duration: 0.82,
              delay: 0.12,
              ease: "power3.out",
            });
          if (appOptional)
            gsap.to(appOptional, {
              autoAlpha: 1,
              x: 0,
              duration: 0.82,
              delay: 0.22,
              ease: "power3.out",
            });
        },
      });
    }

    // ── bbt-fa-abilities-section: heading left, button right ──
    var abilitiesSection = document.querySelector(".bbt-fa-abilities-section");
    if (abilitiesSection) {
      var abilitiesHeading = abilitiesSection.querySelector(".hero-heading");
      var abilitiesBtn = abilitiesSection.querySelector(".cta-button");

      if (abilitiesHeading)
        gsap.set(abilitiesHeading, { autoAlpha: 0, x: -110 });
      if (abilitiesBtn) gsap.set(abilitiesBtn, { autoAlpha: 0, x: 110 });

      ScrollTrigger.create({
        trigger: abilitiesSection,
        start: "top 80%",
        once: true,
        onEnter: function () {
          if (abilitiesHeading)
            gsap.to(abilitiesHeading, {
              autoAlpha: 1,
              x: 0,
              duration: 0.88,
              ease: "power3.out",
            });
          if (abilitiesBtn)
            gsap.to(abilitiesBtn, {
              autoAlpha: 1,
              x: 0,
              duration: 0.88,
              delay: 0.15,
              ease: "power3.out",
            });
        },
      });
    }

    // ── bbt-fa-notes-section: h2 left, paragraphs stagger from right ──
    var notesSection = document.querySelector(".bbt-fa-notes-section");
    if (notesSection) {
      var notesHeading = notesSection.querySelector("h2");
      var notesParagraphs = gsap.utils.toArray(
        ".bbt-fa-notes-section .notes-wrapper p",
      );

      if (notesHeading) gsap.set(notesHeading, { autoAlpha: 0, x: -100 });
      if (notesParagraphs.length)
        gsap.set(notesParagraphs, { autoAlpha: 0, x: 100 });

      ScrollTrigger.create({
        trigger: notesSection,
        start: "top 78%",
        once: true,
        onEnter: function () {
          if (notesHeading)
            gsap.to(notesHeading, {
              autoAlpha: 1,
              x: 0,
              duration: 0.82,
              ease: "power3.out",
            });
          if (notesParagraphs.length) {
            gsap.to(notesParagraphs, {
              autoAlpha: 1,
              x: 0,
              duration: 0.78,
              stagger: 0.13,
              delay: 0.1,
              ease: "power3.out",
            });
          }
        },
      });
    }

    ScrollTrigger.refresh();
  }

  function playIntro() {
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        onComplete: buildScrollAnimations,
      })
      .to(heroCircle, { xPercent: 0, duration: 1.05 })
      .to(
        heroTitle,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.9,
        },
        "+=0.02",
      );
  }

  if (document.readyState === "complete") {
    window.setTimeout(playIntro, 120);
  } else {
    window.addEventListener(
      "load",
      function () {
        window.setTimeout(playIntro, 120);
      },
      { once: true },
    );
  }
})();

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

// ============================================================
// INITIAL STATES — Page load pe yeh positions hongi
// ============================================================

// Burgundy BG — adha left mein
gsap.set(".burgundy-bg", { x: -220 });

// Yellow circle — aur neeche (screen ke bahar se thoda andar)
gsap.set(".yellow-circle", { y: 380 });

// Text — spans ko individually hide karo
gsap.set(".main-title .line1", { xPercent: -150, opacity: 0 });
gsap.set(".main-title .line2", { xPercent: -150, opacity: 0 });
gsap.set(".main-title .line3", { xPercent: -150, opacity: 0 });

// Orange bar — hidden
gsap.set(".orange-bg-element", { x: -300, opacity: 0 });

// Students — right side mein
gsap.set(".hero-student-img", { x: 200 });

// ============================================================
// PAGE LOAD ANIMATION — Scroll ki jagah ab page load pe play hoga
// ============================================================

const heroTL = gsap.timeline({
  delay: 0.3, // Thoda wait karo taaki page properly load ho jaye
});

heroTL
  // Burgundy BG — left se right
  .to(
    ".burgundy-bg",
    {
      x: 0,
      duration: 1.2,
      ease: "power2.out",
    },
    0,
  )

  // Yellow circle — neeche se upar (final: y:0)
  .to(
    ".yellow-circle",
    {
      y: 0,
      duration: 1.2,
      ease: "power2.out",
    },
    0,
  )

  // Students — right se left (final: x:0)
  .to(
    ".hero-student-img",
    {
      x: 0,
      duration: 1.2,
      ease: "power2.out",
    },
    0,
  )

  // Orange bar
  .to(
    ".orange-bg-element",
    {
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
    },
    0.2,
  )

  // Line 1 "Shaping"
  .to(
    ".main-title .line1",
    {
      xPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    },
    0.3,
  )

  // Line 2 "Indian leaders"
  .to(
    ".main-title .line2",
    {
      xPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    },
    0.5,
  )

  // Line 3 "for the world."
  .to(
    ".main-title .line3",
    {
      xPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    },
    0.7,
  );

const aboutSection = document.querySelector(".bbt-dp-about");

if (aboutSection) {
  gsap.set(".bbt-dp-about .about-img", {
    y: 90,
    opacity: 0,
  });

  gsap.set(".bbt-dp-about .about-paragraph", {
    x: 100,
    opacity: 0,
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 78%",
        toggleActions: "play none none none",
        once: true,
      },
    })
    .to(".bbt-dp-about .about-img", {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    })
    .to(
      ".bbt-dp-about .about-paragraph",
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      },
      "-=1.1",
    );
}

// ══════════════════════════════════════════════════════════════════
// VIDEO SECTION — 3-Phase Scroll Animation
//
// PHASE 1: Small square → wide rectangle   (before viewport, no pin)
//   Starts as section enters viewport bottom, ends when it hits top.
//
// PHASE 2: Overlay + text + play btn reveal (pinned at top)
//   Opacity stays fixed after reveal — no further darkening.
//
// PHASE 3: Upward wipe exit                (after pin releases)
//   Fires as you scroll to the next section. Content fades instantly.
// ══════════════════════════════════════════════════════════════════

const videoWrapper = document.querySelector(".video-wrapper");
const video = document.getElementById("mainVideo");
const playBtn = document.getElementById("playBtn");

if (videoWrapper && video && playBtn) {
  // ── Click: play / pause toggle ───────────────────────────────────
  videoWrapper.addEventListener("click", () => {
    if (video.paused) {
      video.defaultMuted = false;
      video.muted = false;
      video.volume = 1;
      video.play();
      playBtn.innerHTML = `<span class="pause-icon"></span>`;
    } else {
      video.pause();
      playBtn.innerHTML = `<span class="triangle"></span>`;
    }
  });

  // ── PHASE 1: Square → Rectangle (BEFORE reaching viewport) ───────
  gsap.fromTo(
    ".video-container",
    { clipPath: "inset(40% 44% 40% 44%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "none",
      scrollTrigger: {
        trigger: ".video-section",
        start: "top bottom", // fires as section enters viewport bottom
        end: "top top", // done by the time section reaches viewport top
        scrub: 1,
      },
    },
  );

  // Parallax on video during Phase 1
  gsap.fromTo(
    ".bg-video",
    { y: "8%" },
    {
      y: "0%",
      ease: "none",
      scrollTrigger: {
        trigger: ".video-section",
        start: "top bottom",
        end: "top top",
        scrub: 1,
      },
    },
  );

  // ── PHASE 2 + 3: Pinned reveal → hold → cut-upside exit ──────────
  // Everything lives inside ONE pinned timeline so the exit is
  // perfectly in sync with scroll — no separate trigger needed.
  //
  // Timeline breakdown (total = 4 units of scroll):
  //   0 → 1.5  : overlay fades in
  //   0.4 → 1.4: content + play btn rise in
  //   1.5 → 2.5: hold (viewer reads the text)
  //   2.5 → 4  : cut-upside — wrapper clips from bottom→top (video exits upward)

  gsap.set(".video-wrapper", { clipPath: "inset(0% 0% 0% 0%)" });

  const videoTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".video-section",
      start: "top top",
      end: "+=400%", // 4× viewport of scroll room
      scrub: 1.5,
      pin: ".video-wrapper",
      anticipatePin: 1,
      pinSpacing: true, // true so scroll space is reserved for all 4 phases
    },
  });

  videoTL
    // Reveal overlay
    .fromTo(
      ".video-section .overlay",
      { opacity: 0 },
      { opacity: 1, ease: "none", duration: 1.5 },
    )
    // Reveal text
    .fromTo(
      ".video-section .content",
      { opacity: 0, yPercent: -40, y: 60 },
      { opacity: 1, yPercent: -50, y: 0, ease: "power2.out", duration: 1 },
      0.4,
    )
    // Reveal play btn
    .fromTo(
      "#playBtn",
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.8 },
      0.4,
    )
    // Hold — pause at full reveal so user can read
    .to({}, { duration: 1 })

    // ── PHASE 3: Cut-upside exit ─────────────────────────────────
    // Fade out content instantly as wipe begins
    .to([".video-section .content", "#playBtn"], {
      opacity: 0,
      ease: "none",
      duration: 0.2,
    })
    // Clip the wrapper downward: inset(bottom) 0%→100% wipes video off screen downward
    .fromTo(
      ".video-wrapper",
      { clipPath: "inset(0% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 100% 0%)", ease: "none", duration: 1.5 },
      "<", // starts at the same time as the fade
    );
}

// Register plugin
gsap.registerPlugin(ScrollTrigger);

gsap.from(".award .leaf", {
  scale: 0.7,
  rotation: -10,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: ".recognition-sec",
    start: "top 75%",
  },
});

// ⭐ Contact Section Animation (Clean version)
const contactTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".contact-sec",
    start: "top 75%",
    toggleActions: "play none none none",
  },
});

contactTL
  .from(".contact-sec .inner-content h3", {
    x: -120,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  })

  .from(
    ".contact-sec .inner-content h2",
    {
      x: -120,
      opacity: 0,
      duration: 0.8,
    },
    "-=0.5",
  )

  .from(
    ".contact-sec .form-group",
    {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    },
    "-=0.4",
  )

  .from(
    ".contact-sec .form-actions",
    {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
    },
    "-=0.3",
  );

// ============================================================
// HORIZONTAL SECTION — Unified Pinned Timeline
// Phase 1: text slides in from left        (1 unit)
// Phase 2: lavender circle grows           (1 unit)
// Phase 3: panels enter + scroll through  (5 units)
// Everything fully reverses on scroll up
// ============================================================
const horizontal = document.querySelector(".horizontal-wrapper");
if (horizontal) {
  const panelScrollWidth = () => horizontal.scrollWidth - window.innerWidth;

  // Initial states — panels start completely off-screen to the right
  gsap.set(".horizontal-section .yellow h2", { x: -160, opacity: 0 });
  gsap.set(".lavender-circle", { scale: 0.2, transformOrigin: "bottom right" });
  gsap.set(horizontal, { x: () => window.innerWidth }); // hidden off-screen right

  const hTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".horizontal-section",
      start: "top top",
      // Total scroll = enough room for text+circle phases (600px each) + full panel travel
      end: () => "+=" + (window.innerWidth + panelScrollWidth() + 600),
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
    },
  });

  hTL
    // Phase 1a — heading slides in from left  ↘ both run at
    .to(".horizontal-section .yellow h2", {
      //   the same time
      x: 0,
      opacity: 1,
      ease: "power3.out",
      duration: 1,
    })
    // Phase 1b — lavender circle grows simultaneously with text
    .to(
      ".lavender-circle",
      {
        scale: 1,
        ease: "power2.out",
        duration: 1,
      },
      "<",
    ) // "<" = start at same time as previous tween
    // Phase 2 — ONLY after both above finish: panels slide in + scroll
    .to(horizontal, {
      x: () => -panelScrollWidth(),
      ease: "none",
      duration: 5,
    });
}

gsap.registerPlugin(ScrollTrigger);

const schoolInfoSection = document.querySelector(".bbt-FA-img-sec");

if (schoolInfoSection) {
  const schoolCircle = schoolInfoSection.querySelector(".purple-circle");
  const schoolCircleText = schoolInfoSection.querySelector(".main-title");
  const schoolHeading = schoolInfoSection.querySelector(".img-text");
  const schoolTextItems = [schoolCircleText, schoolHeading].filter(Boolean);

  if (schoolCircle && schoolCircleText) {
    const initSchoolInfoAnimation = () => {
      gsap.set(schoolCircle, {
        autoAlpha: 0,
        scale: 0.35,
        transformOrigin: "50% 50%",
      });
      gsap.set(schoolTextItems, {
        autoAlpha: 0,
        y: 24,
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: schoolInfoSection,
            start: "top 70%",
            once: true,
          },
        })
        .to(schoolCircle, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.85,
          ease: "back.out(1.25)",
        })
        .to(
          schoolTextItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            stagger: 0.08,
          },
          "-=0.18",
        );

      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      initSchoolInfoAnimation();
    } else {
      window.addEventListener("load", initSchoolInfoAnimation, { once: true });
    }
  }
}

const track = document.querySelector("#bubbleTrack");
const circles = gsap.utils.toArray(".circle");
let tl;

if (track) {
  // total horizontal width
  const totalWidth = track.scrollWidth - window.innerWidth;

  // MAIN TIMELINE
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".bbt-FA-circle-sec",
      start: "top top",
      end: "+=3000",
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
    },
  });

  // 👉 Horizontal movement
  tl.to(
    track,
    {
      x: -totalWidth,
      ease: "none",
    },
    0,
  );

  // 👉 EACH CIRCLE ANIMATION
  circles.forEach((circle, i) => {
    const label = `circle-${i}`;

    // Phase 1: appear (no text)
    tl.to(
      circle,
      {
        scale: 0.8,
        opacity: 0.6,
        duration: 0.5,
      },
      i * 0.8,
    );

    // Phase 2: text fade in (light)
    tl.to(
      circle.querySelector("h2"),
      {
        opacity: 0.5,
        duration: 0.3,
      },
      i * 0.8 + 0.2,
    );

    tl.to(
      circle.querySelector("p"),
      {
        opacity: 0.5,
        duration: 0.3,
      },
      i * 0.8 + 0.25,
    );

    // Phase 3: center → grow + full text
    tl.to(
      circle,
      {
        scale: 1.4,
        opacity: 1,
        duration: 0.6,
      },
      i * 0.8 + 0.4,
    );

    tl.to(
      circle.querySelector("h2"),
      {
        opacity: 1,
        duration: 0.3,
      },
      i * 0.8 + 0.5,
    );

    tl.to(
      circle.querySelector("p"),
      {
        opacity: 1,
        duration: 0.3,
      },
      i * 0.8 + 0.55,
    );
  });
}

// Bubble section override: center-based overlapping scroll animation
if (tl) {
  tl.scrollTrigger?.kill();
  tl.kill();
  gsap.set(track, { clearProps: "x" });
}

(function initBubbleSectionV2() {
  const section = document.querySelector(".bbt-FA-circle-sec");
  const stickyViewport = section?.querySelector(".sticky-viewport");
  const bubbleTrack = document.getElementById("bubbleTrack");
  const cluster = document.getElementById("circleCluster");
  const connectorsSvg = cluster?.querySelector("svg.connectors");
  const bubbleCircles = gsap.utils.toArray(".bbt-FA-circle-sec .circle");
  const connectorSegments = gsap.utils.toArray(
    ".bbt-FA-circle-sec .connector-segment",
  );

  if (
    !section ||
    !stickyViewport ||
    !bubbleTrack ||
    !cluster ||
    !connectorsSvg ||
    !bubbleCircles.length
  ) {
    return;
  }

  let bubbleTimeline;
  let resizeTimer;

  function buildBubbleTimeline() {
    if (bubbleTimeline) {
      bubbleTimeline.scrollTrigger?.kill();
      bubbleTimeline.kill();
    }

    gsap.killTweensOf([bubbleTrack, ...bubbleCircles, ...connectorSegments]);
    gsap.set(bubbleTrack, { clearProps: "x" });

    const clusterWidth =
      Math.max(
        cluster.offsetWidth,
        ...bubbleCircles.map(
          (circle) => circle.offsetLeft + circle.offsetWidth,
        ),
      ) + 40;
    const clusterHeight =
      Math.max(
        cluster.offsetHeight,
        ...bubbleCircles.map(
          (circle) => circle.offsetTop + circle.offsetHeight,
        ),
      ) + 20;

    gsap.set(cluster, {
      width: clusterWidth,
      height: clusterHeight,
    });

    connectorsSvg.setAttribute(
      "viewBox",
      `0 0 ${clusterWidth} ${clusterHeight}`,
    );

    const viewportWidth = window.innerWidth;
    const viewportCenter = viewportWidth / 2;
    const clusterOffset = cluster.offsetLeft;
    const firstCircleCenter =
      clusterOffset +
      bubbleCircles[0].offsetLeft +
      bubbleCircles[0].offsetWidth / 2;
    const lastCircle = bubbleCircles[bubbleCircles.length - 1];
    const lastCircleCenter =
      clusterOffset + lastCircle.offsetLeft + lastCircle.offsetWidth / 2;

    const startX = viewportWidth * 0.72 - firstCircleCenter;
    const endX = viewportWidth * 0.22 - lastCircleCenter;
    const travelDistance = Math.max(startX - endX, viewportWidth * 1.8);
    const scrollDistance = Math.max(travelDistance * 1.15, viewportWidth * 2.8);

    gsap.set(bubbleCircles, {
      scale: 0.12,
      autoAlpha: 0,
      zIndex: 1,
      transformOrigin: "50% 50%",
    });

    connectorSegments.forEach((segment, index) => {
      const fromCircle = bubbleCircles[index];
      const toCircle = bubbleCircles[index + 1];

      if (!fromCircle || !toCircle) return;

      const x1 = fromCircle.offsetLeft + fromCircle.offsetWidth / 2;
      const y1 = fromCircle.offsetTop + fromCircle.offsetHeight / 2;
      const x2 = toCircle.offsetLeft + toCircle.offsetWidth / 2;
      const y2 = toCircle.offsetTop + toCircle.offsetHeight / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.hypot(dx, dy) || 1;
      const ux = dx / length;
      const uy = dy / length;
      const startRadius = fromCircle.offsetWidth / 2;
      const endRadius = toCircle.offsetWidth / 2;
      const edgeOverlap = 0;
      const startX = x1 + ux * (startRadius - edgeOverlap);
      const startY = y1 + uy * (startRadius - edgeOverlap);
      const endX = x2 - ux * (endRadius - edgeOverlap);
      const endY = y2 - uy * (endRadius - edgeOverlap);

      segment.setAttribute(
        "d",
        `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`,
      );

      gsap.set(segment, {
        autoAlpha: 0,
      });
    });

    bubbleCircles.forEach((circle) => {
      const heading = circle.querySelector("h2");
      const body = circle.querySelector("p");

      if (heading) {
        gsap.set(heading, {
          autoAlpha: 0,
          y: 16,
        });
      }

      if (body) {
        gsap.set(body, {
          autoAlpha: 0,
          y: 20,
        });
      }
    });

    bubbleTimeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1.2,
        pin: stickyViewport,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    bubbleTimeline.fromTo(
      bubbleTrack,
      { x: startX },
      { x: endX, duration: travelDistance },
      0,
    );

    bubbleCircles.forEach((circle, index) => {
      const heading = circle.querySelector("h2");
      const body = circle.querySelector("p");
      const circleCenter =
        clusterOffset + circle.offsetLeft + circle.offsetWidth / 2;
      const connector = index > 0 ? connectorSegments[index - 1] : null;
      const focusTime = gsap.utils.clamp(
        0,
        travelDistance,
        startX + circleCenter - viewportCenter,
      );

      const phaseOneStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.28,
      );
      const phaseTwoStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.16,
      );
      const titleStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.14,
      );
      const bodyStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.1,
      );
      const activeStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.07,
      );
      const activeEnd = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime + viewportWidth * 0.07,
      );

      bubbleTimeline.to(
        circle,
        {
          scale: 0.94,
          autoAlpha: 0.7,
          duration: Math.max(phaseTwoStart - phaseOneStart, 0.01),
        },
        phaseOneStart,
      );

      if (heading) {
        bubbleTimeline.to(
          heading,
          {
            autoAlpha: 0.45,
            y: 0,
            duration: Math.max(bodyStart - titleStart, 0.01),
          },
          titleStart,
        );
      }

      if (body) {
        bubbleTimeline.to(
          body,
          {
            autoAlpha: 0.3,
            y: 0,
            duration: Math.max(activeStart - bodyStart, 0.01),
          },
          bodyStart,
        );
      }

      bubbleTimeline.to(
        circle,
        {
          scale: 1.22,
          autoAlpha: 1,
          zIndex: 5,
          duration: Math.max(activeEnd - activeStart, 0.01),
        },
        activeStart,
      );

      if (heading) {
        bubbleTimeline.to(
          heading,
          {
            autoAlpha: 1,
            duration: Math.max(activeEnd - activeStart, 0.01),
          },
          activeStart,
        );
      }

      if (body) {
        bubbleTimeline.to(
          body,
          {
            autoAlpha: 1,
            duration: Math.max(activeEnd - activeStart, 0.01),
          },
          activeStart + viewportWidth * 0.01,
        );
      }

      if (connector) {
        bubbleTimeline.to(
          connector,
          {
            autoAlpha: 0.92,
            duration: Math.max(activeStart - phaseOneStart, 0.01),
          },
          phaseOneStart,
        );
      }
    });
  }

  buildBubbleTimeline();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildBubbleTimeline, 150);
  });
})();

// ------------------- Our school page dev section
// ScrollTrigger initDevSection() function mein handle hota hai (line ~372)

// ============================================================
// PEDAGOGY PAGE
//
// Phase 1 — page load:
//   Half-circle slides in from left, text fades in
//
// Phase 2 — on scroll (GSAP pins stage for 300vh):
//   0%  → 40% : blue circle expands to fill viewport, content fades out
//   50% → 100%: diagram fades in, nodes highlight one by one
// ============================================================

(function initPedagogyPage() {
  if (!document.querySelector("body.pedagogy-page")) return;

  var stage = document.querySelector(".pedagogy-hero-stage");
  var campusSec = document.querySelector(".campus-section");
  var diagramSec = document.querySelector("section.diagram-sec");
  if (!stage || !campusSec || !diagramSec) return;

  var halfCircle = campusSec.querySelector(".half-circle");
  var panelKicker = campusSec.querySelector(".panel-kicker");
  var panelTitle = campusSec.querySelector(".panel-title");
  var panelBody = campusSec.querySelector(".panel-body");
  var heroImage = campusSec.querySelector(".img-full");
  var heroGlowCircle = campusSec.querySelector(".hero-glow-circle");

  var nodes = [
    ".node1",
    ".node2",
    ".node3",
    ".node4",
    ".node5",
    ".node7",
    ".node6",
  ].map(function (s) {
    return diagramSec.querySelector(s);
  });
  var labels = [
    ".label.top",
    ".label.right-top",
    ".label.right-mid",
    ".label.bottom",
    ".label.left-bottom",
    ".label.left-lower",
    ".label.left-mid",
  ].map(function (s) {
    return diagramSec.querySelector(s);
  });
  var labelTitles = labels.map(function (label) {
    return label ? label.querySelector(".strong") : null;
  });
  var labelBodies = labels.map(function (label) {
    return label ? label.querySelector("p:not(.strong)") : null;
  });

  // ── MOBILE: flat, no animation ──────────────────────────
  if (window.innerWidth < 768) {
    [panelKicker, panelTitle, panelBody].forEach(function (el) {
      if (!el) return;
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
    });
    return;
  }

  // ── Immediately hide text so there's no flash before init() ──
  if (panelKicker) {
    panelKicker.style.opacity = "0";
    panelKicker.style.visibility = "hidden";
  }
  if (panelTitle) {
    panelTitle.style.opacity = "0";
    panelTitle.style.visibility = "hidden";
  }
  if (panelBody) {
    panelBody.style.opacity = "0";
    panelBody.style.visibility = "hidden";
  }
  if (heroGlowCircle) {
    heroGlowCircle.style.opacity = "0";
    heroGlowCircle.style.visibility = "hidden";
  }

  // ── DESKTOP ─────────────────────────────────────────────
  function init() {
    var circleW = halfCircle
      ? halfCircle.offsetWidth > 10
        ? halfCircle.offsetWidth
        : 2000
      : 2000;
    var circleLeft = halfCircle ? halfCircle.getBoundingClientRect().left : 0;
    var centeredCircleX = halfCircle
      ? window.innerWidth / 2 - (circleLeft + circleW / 2)
      : 0;

    // ── Step 1: Set all initial states ───────────────────
    // Circle: fully off-screen left
    if (halfCircle) {
      gsap.set(halfCircle, {
        x: -circleW,
        scale: 1,
        transformOrigin: "center center",
      });
    }

    // Text elements: invisible + shifted left
    if (panelKicker)
      gsap.set(panelKicker, { opacity: 0, x: -70, visibility: "visible" });
    if (panelTitle)
      gsap.set(panelTitle, { opacity: 0, x: -90, visibility: "visible" });
    if (panelBody)
      gsap.set(panelBody, { opacity: 0, x: -90, visibility: "visible" });
    if (heroGlowCircle)
      gsap.set(heroGlowCircle, {
        opacity: 0,
        scale: 0.7,
        visibility: "visible",
      });

    // Diagram: hidden
    gsap.set(diagramSec, {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
    });

    // Nodes dim
    nodes.forEach(function (n) {
      if (n) gsap.set(n, { width: 22, height: 22, opacity: 0.35 });
    });
    labels.forEach(function (l) {
      if (l) gsap.set(l, { opacity: 1, y: 0 });
    });
    labelTitles.forEach(function (title) {
      if (title) gsap.set(title, { opacity: 0.35 });
    });
    labelBodies.forEach(function (body) {
      if (body) gsap.set(body, { opacity: 0, y: 12 });
    });

    // ── Step 2: Page-load animation ──────────────────────
    //
    // t=0.00  Blue half-circle slides in from left  → half visible
    // t=0.60  Yellow glow circle pops in (scale 0.7 → 1)
    // t=0.85  Title (h2) slides in from left, opacity 0→1
    // t=1.45  Paragraph slides in from left, opacity 0→1
    // t=1.55  Kicker fades in (subtle, last)

    var loadTL = gsap.timeline({ delay: 0.3 });

    // 1. Blue half-circle slides in from fully off-screen left
    if (halfCircle) {
      loadTL.to(
        halfCircle,
        {
          x: -(circleW * 0.5),
          duration: 1.1,
          ease: "power3.out",
        },
        0,
      );
    }

    // 2. Yellow glow circle pops in
    if (heroGlowCircle) {
      loadTL.to(
        heroGlowCircle,
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.6)",
        },
        0.6,
      );
    }

    // 3. Title slides in from left
    if (panelTitle) {
      loadTL.to(
        panelTitle,
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        0.85,
      );
    }

    // 4. Paragraph slides in from left
    if (panelBody) {
      loadTL.to(
        panelBody,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        1.45,
      );
    }

    // 5. Kicker fades in last (subtle)
    if (panelKicker) {
      loadTL.to(
        panelKicker,
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        1.55,
      );
    }

    // ── Step 3: Scroll timeline (paused, scrubbed) ───────
    //
    // 0.00→0.35  Circle scale:1 → scale:14  (floods full viewport)
    // 0.02→0.20  Hero image + glow + text fade out
    // 0.48       diagram-sec visibility:visible
    // 0.50→0.56  Diagram fades in over blue bg
    // 0.56→1.00  Nodes highlight one by one

    var scrollTL = gsap.timeline({ paused: true });

    // Circle floods viewport — starts from its loaded resting position -(circleW*0.5)
    // so there is no jump when scroll begins.
    if (halfCircle) {
      scrollTL.fromTo(
        halfCircle,
        {
          x: -(circleW * 0.5),
          scale: 1,
          transformOrigin: "center center",
        },
        {
          x: centeredCircleX,
          scale: 14,
          transformOrigin: "center center",
          ease: "power2.inOut",
          duration: 0.35,
        },
        0,
      );
    }

    // Keep the hero image crisp while the blue panel expands.
    if (heroGlowCircle)
      scrollTL.to(heroGlowCircle, { opacity: 0, duration: 0.18 }, 0.01);
    if (panelKicker)
      scrollTL.fromTo(
        panelKicker,
        { opacity: 1, x: 0 },
        { opacity: 0, x: -30, duration: 0.16 },
        0.02,
      );
    if (panelTitle)
      scrollTL.fromTo(
        panelTitle,
        { opacity: 1, x: 0 },
        { opacity: 0, x: -40, duration: 0.18 },
        0.05,
      );
    if (panelBody)
      scrollTL.fromTo(
        panelBody,
        { opacity: 1, x: 0 },
        { opacity: 0, x: -30, duration: 0.16 },
        0.08,
      );

    // Diagram reveal
    scrollTL.set(
      diagramSec,
      { visibility: "visible", pointerEvents: "auto" },
      0.48,
    );
    scrollTL.to(
      diagramSec,
      { opacity: 1, duration: 0.06, ease: "power2.out" },
      0.5,
    );

    // Nodes highlight one by one
    var SMALL = 22,
      BIG = 74,
      TOTAL = nodes.length;
    var slice = 0.44 / TOTAL;

    for (var i = 0; i < TOTAL; i++) {
      var s = 0.56 + i * slice;
      var mid = s + slice * 0.15;
      var end = s + slice * 0.85;

      if (i > 0 && nodes[i - 1]) {
        scrollTL.to(
          nodes[i - 1],
          {
            width: SMALL,
            height: SMALL,
            opacity: 0.32,
            boxShadow: "none",
            duration: slice * 0.28,
            ease: "power2.in",
          },
          s,
        );
        if (labelTitles[i - 1])
          scrollTL.to(
            labelTitles[i - 1],
            { opacity: 0.35, duration: slice * 0.2 },
            s,
          );
        if (labelBodies[i - 1])
          scrollTL.to(
            labelBodies[i - 1],
            { opacity: 0, y: 12, duration: slice * 0.22 },
            s,
          );
      }
      if (nodes[i]) {
        scrollTL.to(
          nodes[i],
          {
            width: BIG,
            height: BIG,
            opacity: 1,
            boxShadow:
              "0 0 0 16px rgba(255,138,91,0.22), 0 0 0 34px rgba(255,138,91,0.09)",
            duration: slice * 0.38,
            ease: "back.out(1.7)",
          },
          mid,
        );
      }
      if (labelTitles[i]) {
        scrollTL.to(
          labelTitles[i],
          { opacity: 1, duration: slice * 0.28, ease: "power3.out" },
          mid,
        );
      }
      if (labelBodies[i]) {
        scrollTL.to(
          labelBodies[i],
          { opacity: 1, y: 0, duration: slice * 0.38, ease: "power3.out" },
          mid,
        );
      }
      if (nodes[i]) {
        scrollTL.to(
          nodes[i],
          {
            boxShadow: "0 0 0 0px rgba(255,138,91,0)",
            duration: slice * 0.3,
            ease: "power2.in",
          },
          end - slice * 0.2,
        );
      }
    }

    // ── Pin stage + scrub ────────────────────────────────
    ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "+=300%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        scrollTL.progress(self.progress);
      },
    });
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init, { once: true });
  }

  window.addEventListener("resize", function () {
    ScrollTrigger.refresh();
  });
})();

// Featured News slider
(function initFeaturedNewsSlider() {
  var sliderEl = document.querySelector(".news-and-events-page .news-slider");
  if (!sliderEl || sliderEl.swiper || typeof Swiper === "undefined") return;

  new Swiper(sliderEl, {
    slidesPerView: "auto",
    centeredSlides: false,
    loop: true,
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

// --------- tabbing section
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    // Add active class to clicked tab
    tab.classList.add("active");

    // Show corresponding content
    const target = tab.getAttribute("data-tab");
    document.getElementById(target).classList.add("active");
  });
});

// AYM diagram section
(function initAymDiagram() {
  const section = document.querySelector(".aym-diagram-sec");
  const diagram = document.querySelector(".aym-diagram");
  const center = document.getElementById("c");
  const satellites = ["s1", "s2", "s3", "s4", "s5"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  let trigger;
  let resizeTimer;

  if (!section || !diagram || !center || !satellites.length) {
    return;
  }

  const lineImages = [
    ".aym-line-136",
    ".aym-line-137",
    ".aym-line-138",
    ".aym-line-141",
    ".aym-line-140",
  ].map((selector) => diagram.querySelector(selector));

  if (lineImages.some((line) => !line)) {
    return;
  }

  function buildAymDiagram() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    if (trigger) trigger.kill();
    diagram.classList.add("is-scroll-animated");

    if (window.innerWidth < 768) {
      gsap.set([center, satellites, lineImages], { clearProps: "all" });
      return;
    }

    gsap.set(center, {
      scale: 0.72,
      autoAlpha: 0,
      transformOrigin: "50% 50%",
    });
    gsap.set(satellites, {
      autoAlpha: 0,
      scale: 0.94,
      transformOrigin: "50% 50%",
      "--line-opacity": 0,
    });

    function getLineState(index) {
      if (index === 0) {
        return {
          clipStart: "inset(100% 0% 0% 0%)",
          clipEnd: "inset(0% 0% 0% 0%)",
        };
      }

      if (index === 1 || index === 2) {
        return {
          clipStart: "inset(0% 100% 0% 0%)",
          clipEnd: "inset(0% 0% 0% 0%)",
        };
      }

      return {
        clipStart: "inset(0% 0% 0% 100%)",
        clipEnd: "inset(0% 0% 0% 0%)",
      };
    }

    const arms = lineImages.map((line, index) => {
      const lineState = getLineState(index);
      const satellite = satellites[index];

      gsap.set(line, {
        autoAlpha: 0,
        clipPath: lineState.clipStart,
      });

      return { line, satellite, lineState };
    });

    const timeline = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    timeline.fromTo(
      center,
      { autoAlpha: 0, scale: 0.72 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
      },
    );

    arms.forEach(({ line, satellite, lineState }) => {
      timeline
        .to(line, {
          autoAlpha: 1,
          clipPath: lineState.clipEnd,
          duration: 0.75,
          ease: "power1.inOut",
        })
        .to(
          satellite,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          ">-0.12",
        );
    });

    trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * (arms.length + 1)}`,
      pin: true,
      scrub: 0.7,
      animation: timeline,
      invalidateOnRefresh: true,
    });
  }

  function queueBuild(delay) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildAymDiagram();
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, delay);
  }

  queueBuild(700);
  window.addEventListener("load", () => queueBuild(500));
  window.addEventListener("resize", () => {
    queueBuild(180);
  });
})();

// developer diagram section
(function initTeacherDevDiagram() {
  const section = document.querySelector(".teacher-dev");
  const wrapper = document.querySelector(".teacher-dev .circle-wrapper");
  const path = document.querySelector("#arcPath");
  const dots = Array.from(document.querySelectorAll(".teacher-dev .dot"));
  const centerCircle = document.querySelector(".teacher-dev .center-circle");
  const contentByDot = [
    document.querySelector(".teacher-dev .content.left-bottom"),
    document.querySelector(".teacher-dev .content.left-top"),
    document.querySelector(".teacher-dev .content.top"),
    document.querySelector(".teacher-dev .content.right-top"),
    document.querySelector(".teacher-dev .content.right-bottom"),
  ].filter(Boolean);
  let teacherDevTrigger;
  let teacherResizeTimer;

  if (
    !section ||
    !wrapper ||
    !path ||
    !dots.length ||
    !centerCircle ||
    !contentByDot.length
  ) {
    return;
  }

  function positionTeacherDots() {
    const length = path.getTotalLength();

    dots.forEach((dot, index) => {
      const point = path.getPointAtLength((index / (dots.length - 1)) * length);
      dot.style.left = `${point.x}px`;
      dot.style.top = `${point.y}px`;
    });
  }

  function buildTeacherDevDiagram() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    if (teacherDevTrigger) teacherDevTrigger.kill();
    positionTeacherDots();

    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    gsap.set(centerCircle, {
      autoAlpha: 0,
      scale: 0.72,
      transformOrigin: "50% 50%",
    });
    gsap.set(dots, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: "50% 50%",
    });
    gsap.set(contentByDot, {
      autoAlpha: 0,
      y: 18,
    });

    const timeline = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    timeline
      .to(centerCircle, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
      })
      .to(path, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power1.inOut",
      });

    dots.forEach((dot, index) => {
      timeline
        .to(dot, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.8)",
        })
        .to(contentByDot[index], {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
    });

    teacherDevTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * (dots.length + 2)}`,
      pin: true,
      scrub: 0.7,
      animation: timeline,
      invalidateOnRefresh: true,
      onRefresh: positionTeacherDots,
    });
  }

  function queueTeacherDevBuild(delay) {
    clearTimeout(teacherResizeTimer);
    teacherResizeTimer = setTimeout(() => {
      buildTeacherDevDiagram();
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, delay);
  }

  positionTeacherDots();
  queueTeacherDevBuild(700);
  window.addEventListener("load", () => queueTeacherDevBuild(500));
  window.addEventListener("resize", () => queueTeacherDevBuild(180));
})();

// section fade animation on home page
document.addEventListener("DOMContentLoaded", function () {
  const newsSection = document.querySelector(".news-section");
  const animatedSections = document.querySelectorAll(
    ".recognition-sec, .contact-sec",
  );

  document.body.classList.add("reveal-animations-ready");

  const isInRevealRange = (section, offset) => {
    if (!section) return false;
    const rect = section.getBoundingClientRect();
    return rect.top < window.innerHeight * offset && rect.bottom > 0;
  };

  const revealVisibleSections = () => {
    animatedSections.forEach((section) => {
      if (isInRevealRange(section, 0.86)) {
        section.classList.add("animate");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  animatedSections.forEach((section) => {
    observer.observe(section);
  });

  revealVisibleSections();
  window.addEventListener("load", revealVisibleSections, { once: true });
  window.addEventListener("scroll", revealVisibleSections, { passive: true });
  window.addEventListener("resize", revealVisibleSections);

  if (newsSection) {
    const newsHeader = newsSection.querySelector(".news-header");
    const newsGrid = newsSection.querySelector(".news-grid");
    let newsRevealed = false;

    const revealNews = () => {
      if (newsRevealed) return;
      newsRevealed = true;
      newsSection.classList.remove("is-waiting");
      newsHeader?.classList.add("animate");
      newsGrid?.classList.add("animate");
    };

    const shouldRevealNews = () => {
      return isInRevealRange(newsSection, 0.86);
    };

    newsSection.classList.add("is-waiting");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealNews();
      return;
    }

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: newsSection,
        start: "top 86%",
        once: true,
        onEnter: revealNews,
      });

      window.setTimeout(() => {
        ScrollTrigger.refresh();
        if (shouldRevealNews()) revealNews();
      }, 120);
    }

    const newsObserver = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          revealNews();
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -14% 0px",
      },
    );

    const checkNewsReveal = () => {
      if (!newsSection.classList.contains("is-waiting")) return;
      if (!shouldRevealNews()) return;

      revealNews();
      newsObserver.unobserve(newsSection);
      window.removeEventListener("scroll", checkNewsReveal);
      window.removeEventListener("resize", checkNewsReveal);
    };

    if (shouldRevealNews()) {
      revealNews();
    } else {
      newsObserver.observe(newsSection);
      window.addEventListener("scroll", checkNewsReveal, { passive: true });
      window.addEventListener("resize", checkNewsReveal);
    }
  }
});

// Careers application popup
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.querySelector(".careers-page .model-popup");
  if (!popup) return;

  const openButtons = document.querySelectorAll(".careers-page .apply-now");
  const closeButton = popup.querySelector(".model-popup-close");
  const positionSelect = popup.querySelector(".position-select");

  function syncPositionOptions() {
    if (!positionSelect) return;

    document
      .querySelectorAll(".careers-page .bbt-fa-careers-openings-sec .card h3")
      .forEach(function (heading) {
        const title = heading.textContent.trim().replace(/\s+/g, " ");
        const exists = Array.from(positionSelect.options).some(
          function (option) {
            return option.textContent.trim() === title;
          },
        );

        if (!exists) {
          const option = document.createElement("option");
          option.textContent = title;
          positionSelect.appendChild(option);
        }
      });
  }

  function openPopup(jobTitle) {
    syncPositionOptions();

    if (positionSelect && jobTitle) {
      Array.from(positionSelect.options).forEach(function (option) {
        option.selected = option.textContent.trim() === jobTitle;
      });
    }

    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");
    if (positionSelect) positionSelect.focus();
  }

  function closePopup() {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");
  }

  openButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const card = button.closest(".card");
      const heading = card ? card.querySelector("h3") : null;
      const jobTitle = heading
        ? heading.textContent.trim().replace(/\s+/g, " ")
        : "";
      openPopup(jobTitle);
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", closePopup);
  }

  popup.addEventListener("click", function (event) {
    if (event.target === popup) closePopup();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && popup.classList.contains("is-open")) {
      closePopup();
    }
  });
});

// Careers hero + about scroll animation
(function initCareersHeroAnimation() {
  if (!document.querySelector("body.careers-page")) return;

  const hero = document.querySelector(".careers-page .hero");
  const heroCircle = document.querySelector(".careers-page .hero-circle");
  const heroContent = document.querySelector(".careers-page .hero-content");
  const about = document.querySelector(
    ".careers-page .bbt-fa-careers-about-sec",
  );
  const aboutWrapper = document.querySelector(
    ".careers-page .bbt-fa-careers-about-sec .career-wrapper",
  );
  const aboutImage = document.querySelector(
    ".careers-page .bbt-fa-careers-about-sec .avm-image-wrap",
  );
  const aboutText = document.querySelector(
    ".careers-page .bbt-fa-careers-about-sec .avm-text",
  );

  if (!hero || !heroCircle || !heroContent || typeof gsap === "undefined") {
    return;
  }

  function init() {
    if (window.innerWidth < 768) {
      gsap.set([heroCircle, heroContent, aboutWrapper, aboutImage, aboutText], {
        clearProps: "all",
      });
      return;
    }

    gsap.set(heroCircle, {
      x: "-54vw",
      scale: 1,
      transformOrigin: "50% 50%",
    });
    gsap.set(heroContent, { autoAlpha: 0, x: -180 });

    if (about && aboutWrapper && aboutImage && aboutText) {
      gsap.set(aboutWrapper, { opacity: 1 });
      gsap.set(aboutImage, { autoAlpha: 0, x: -120 });
      gsap.set(aboutText, { autoAlpha: 0, x: 120 });
    }

    function initScrollAnimations() {
      if (typeof ScrollTrigger === "undefined") return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(
          heroContent,
          { autoAlpha: 0, x: -180, duration: 0.34, ease: "power2.inOut" },
          0.12,
        )
        .to(
          heroCircle,
          {
            scale: 2.45,
            duration: 1,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          aboutImage,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.42,
            ease: "power3.out",
          },
          0.72,
        )
        .to(
          aboutText,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.42,
            ease: "power3.out",
          },
          0.8,
        );
    }

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        onComplete: initScrollAnimations,
      })
      .to(heroCircle, { x: 0, duration: 1.15 })
      .fromTo(
        heroContent,
        { autoAlpha: 0, x: -180 },
        { autoAlpha: 1, x: 0, duration: 0.95 },
        "+=0.02",
      );
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init, { once: true });
  }
})();

// ============================================================
// EXTRA SECTION - Sticky Pin + one wheel step per slide
// ============================================================
(function () {
  var section = document.querySelector(".extra-section");
  var swiperEl = document.querySelector(".extra-swiper");
  if (!section || !swiperEl || typeof Swiper === "undefined") return;

  var swiper = new Swiper(".extra-swiper", {
    slidesPerView: "auto",
    spaceBetween: 30,
    loop: false,
    speed: 650,
    allowTouchMove: true,
    grabCursor: true,
    breakpoints: {
      0: { spaceBetween: 20 },
      768: { spaceBetween: 24 },
      1200: { spaceBetween: 30 },
    },
  });

  var pinST = null;
  var wheelLocked = false;
  var syncingScroll = false;

  function getMaxIndex() {
    if (!swiper || !swiper.snapGrid) return 0;
    return Math.max(0, swiper.snapGrid.length - 1);
  }

  function getTargetScroll(index) {
    var maxIndex = getMaxIndex();
    if (!pinST || !maxIndex) return window.scrollY;
    return pinST.start + (pinST.end - pinST.start) * (index / maxIndex);
  }

  function syncScrollToSlide(index) {
    if (!pinST) return;
    syncingScroll = true;
    window.scrollTo({ top: getTargetScroll(index), behavior: "auto" });
    requestAnimationFrame(function () {
      syncingScroll = false;
    });
  }

  function goToSlide(index) {
    var maxIndex = getMaxIndex();
    var nextIndex = Math.max(0, Math.min(index, maxIndex));
    if (nextIndex === swiper.activeIndex) return;

    wheelLocked = true;
    swiper.slideTo(nextIndex, 650);
    syncScrollToSlide(nextIndex);

    window.setTimeout(function () {
      wheelLocked = false;
    }, 720);
  }

  function buildPin() {
    if (pinST) pinST.kill();

    pinST = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: function () {
        return "+=" + Math.max(1, getMaxIndex()) * window.innerHeight;
      },
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: function () {
        wheelLocked = false;
        swiper.slideTo(0, 0);
      },
      onEnterBack: function () {
        wheelLocked = false;
        swiper.slideTo(getMaxIndex(), 0);
      },
      onUpdate: function (self) {
        if (!self.isActive || syncingScroll || wheelLocked) return;
        var maxIndex = getMaxIndex();
        var nextIndex = Math.round(self.progress * maxIndex);
        if (swiper.activeIndex !== nextIndex) {
          swiper.slideTo(nextIndex, 650);
        }
      },
    });
  }

  function onWheel(event) {
    if (!pinST || wheelLocked) return;

    var inPinnedRange =
      window.scrollY >= pinST.start - 1 && window.scrollY <= pinST.end + 1;
    if (!inPinnedRange) return;

    var direction = event.deltaY > 0 ? 1 : -1;
    var maxIndex = getMaxIndex();
    var atFirst = swiper.activeIndex <= 0;
    var atLast = swiper.activeIndex >= maxIndex;

    if ((direction < 0 && atFirst) || (direction > 0 && atLast)) return;

    event.preventDefault();
    goToSlide(swiper.activeIndex + direction);
  }

  function initPin() {
    buildPin();
    ScrollTrigger.refresh();
  }

  if (document.readyState === "complete") {
    window.setTimeout(initPin, 120);
  } else {
    window.addEventListener(
      "load",
      function () {
        window.setTimeout(initPin, 120);
      },
      { once: true },
    );
  }

  var wheelOptions = { passive: false, capture: true };
  window.addEventListener("wheel", onWheel, wheelOptions);
  document.addEventListener("wheel", onWheel, wheelOptions);
  section.addEventListener("wheel", onWheel, wheelOptions);
  swiper.on("slideChange", function () {
    syncScrollToSlide(swiper.activeIndex);
  });
  swiper.on("breakpoint resize", function () {
    ScrollTrigger.refresh();
  });
})();

// ── Feature Block Scroll Animation ──────────────────────────
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("fb-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  function observeBlocks() {
    document
      .querySelectorAll("section.tabbing-sec .feature-block")
      .forEach(function (block) {
        observer.observe(block);
      });
  }

  document.addEventListener("DOMContentLoaded", observeBlocks);

  // Tab switch hone pe naye blocks bhi observe ho
  document.addEventListener("click", function (e) {
    if (e.target.closest("section.tabbing-sec .tab")) {
      setTimeout(observeBlocks, 80);
    }
  });

  // AYM + AVM section observer
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  document.addEventListener("DOMContentLoaded", function () {
    document
      .querySelectorAll(".aym-section, .avm-section")
      .forEach(function (sec) {
        sectionObserver.observe(sec);
      });
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
