// Browser refresh par previous scroll position restore hoti hai, jisse pinned
// ScrollTrigger sections ke beech page open ho sakta hai.
(function resetScrollOnPageRefresh() {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  var navEntry = performance.getEntriesByType("navigation")[0];
  var isReload = navEntry
    ? navEntry.type === "reload"
    : performance.navigation?.type === 1;

  if (!isReload) return;

  function scrollTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  scrollTop();

  window.addEventListener(
    "pageshow",
    function () {
      requestAnimationFrame(scrollTop);
    },
    { once: true },
  );

  window.addEventListener(
    "load",
    function () {
      scrollTop();
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    },
    { once: true },
  );
})();

gsap.ticker.lagSmoothing(0);

gsap.config({ force3D: true });
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// HEADER (GSAP)
//
// Behavior:
//   â¢ Page load pe hamesha visible
//   â¢ Scroll DOWN â†’ header slide up (hide)
//   â¢ Scroll UP   â†’ header slide down (show)
//   â¢ Top of page â†’ hamesha show
//
// Page-specific overrides:
//   â¢ our-school-page: campus section ke andar hamesha visible rahega
//     (campus section apna inline style set karta hai â” us dauraan
//      directional logic pause rahega)
//   â¢ homepage (.bbt-dp-hero): hero section ke andar hamesha visible
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

  //  Helper: Campus section ke pin zone mein hain?
  // GSAP campusViewport ko pin karta hai 200vh ke liye.
  // Us dauraan header ko chhedna nahi chahiye.
  function insideCampusPin() {
    if (!campusViewportEl) return false;
    var rect = campusViewportEl.getBoundingClientRect();
    // Jab viewport sticky ho (rect.top === 0), campus pin active hai
    return rect.top <= 0 && rect.bottom >= window.innerHeight * 0.5;
  }

  //  Helper: Homepage hero ke andar hain?
  function insideHomepageHero() {
    if (!homepageHero) return false;
    var heroBottom = homepageHero.offsetTop + homepageHero.offsetHeight;
    return window.scrollY <= heroBottom - 100;
  }

  //  Show / Hide functions
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

  //  Scroll handler
  function onScroll() {
    var currentY = window.scrollY;
    var direction = currentY > lastScrollY ? "down" : "up"; // down ya up
    var delta = Math.abs(currentY - lastScrollY);

    // Top of page â” hamesha show
    if (currentY <= 10) {
      showHeader();
      lastScrollY = currentY;
      return;
    }

    // Campus section pin zone â” header ko GSAP campus code control karta hai
    // Hum yahan kuch nahi karte
    if (insideCampusPin()) {
      lastScrollY = currentY;
      return;
    }

    // Homepage hero zone â” hamesha show
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

// ============================================================
// INITIAL STATES â” Page load pe yeh positions hongi
// ============================================================

// Burgundy BG â” adha left mein
gsap.set(".burgundy-bg", { x: -220 });

// Yellow circle â” aur neeche (screen ke bahar se thoda andar)
gsap.set(".yellow-circle", { y: 380 });

// Text â” spans ko individually hide karo
// Laal bars (|) ki position se start karo â” yaani text apni jagah se
// thoda left pe start ho aur wahan se slide in kare
// display:inline-block force karo â” GSAP x transform inline elements pe kaam nahi karta
gsap.set(".main-title .line1", { display: "inline-block", x: -80, opacity: 0 });
gsap.set(".main-title .line2", {
  display: "inline-block",
  x: -110,
  opacity: 0,
});
gsap.set(".main-title .line3", {
  display: "inline-block",
  x: -150,
  opacity: 0,
});

// ============================================================
// PAGE LOAD ANIMATION â” Scroll ki jagah ab page load pe play hoga
// ============================================================

const heroTL = gsap.timeline({
  delay: 0.3, // Thoda wait karo taaki page properly load ho jaye
});

heroTL
  // Burgundy BG â” left se right
  .to(
    ".burgundy-bg",
    {
      x: 0,
      duration: 1.2,
      ease: "power2.out",
    },
    0,
  )

  // Yellow circle â” neeche se upar (final: y:0)
  .to(
    ".yellow-circle",
    {
      y: 0,
      duration: 1.2,
      ease: "power2.out",
    },
    0,
  )

  // Teeno lines ek saath â” slow aur smooth
  .to(
    [".main-title .line1", ".main-title .line2", ".main-title .line3"],
    {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    },
    0,
  );

// ============================================================
// HERO STICKY + ABOUT PANEL OVERLAY
//
// Structure (HTML mein):
//   .hero-sticky-wrapper  [height: 200vh]
//     œ .bbt-dp-hero    [position: sticky; top: 0; height: 100vh]
//     ” .bbt-dp-about   [position: absolute; top: 0; width: 100%]
//
// Flow:
//   â¢ Page load: about translateY(100vh) â†’ screen ke bilkul neeche,
//     hero ke peeche (z-index kam)
//   â¢ Scroll: wrapper ke andar scroll hone se about y: 100vh â†’ 0
//     (GSAP scrub) â†’ hero ke upar slide karta hai
//   â¢ About fully visible: content (img + text) animate in
//
// Koi extra white space nahi â” about absolute hai wrapper mein.
// ============================================================

(function initHeroAboutPanelOverlay() {
  const aboutSection = document.querySelector(".bbt-dp-about");
  const heroSection = document.querySelector(".bbt-dp-hero");
  const heroWrapper = document.querySelector(".hero-sticky-wrapper");

  if (!aboutSection || !heroSection || !heroWrapper) return;

  let mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    heroWrapper.style.height = "auto";
    heroSection.style.clipPath = "";
    heroSection.style.willChange = "";
    gsap.set(aboutSection, { clearProps: "transform,opacity,visibility" });

    const aboutImg = aboutSection.querySelector(".about-img");
    const aboutParagraph = aboutSection.querySelector(".about-paragraph");
    const revealItems = [];

    if (aboutImg) {
      gsap.set(aboutImg, { autoAlpha: 0, x: -110 });
      revealItems.push(aboutImg);
    }

    if (aboutParagraph) {
      gsap.set(aboutParagraph, { autoAlpha: 0, x: 110 });
      revealItems.push(aboutParagraph);
    }

    if (revealItems.length) {
      ScrollTrigger.create({
        trigger: aboutSection,
        start: "top 72%",
        once: true,
        onEnter: function () {
          gsap.to(revealItems, {
            autoAlpha: 1,
            x: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            overwrite: true,
          });
        },
      });
    }

    const onLoadRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoadRefresh);

    return () => {
      window.removeEventListener("load", onLoadRefresh);
      gsap.set(aboutSection, { clearProps: "all" });
    };
  });
})();

// â•
// VIDEO SECTION â” 3-Phase Scroll Animation
//
// PHASE 1: Small square â†’ wide rectangle   (before viewport, no pin)
//   Starts as section enters viewport bottom, ends when it hits top.
//
// PHASE 2: Overlay + text + play btn reveal (pinned at top)
//   Opacity stays fixed after reveal â” no further darkening.
//
// PHASE 3: Upward wipe exit                (after pin releases)
//   Fires as you scroll to the next section. Content fades instantly.
// â•

const videoWrapper = document.querySelector(".video-wrapper");
const video = document.getElementById("mainVideo");
const playBtn = document.getElementById("playBtn");

if (videoWrapper && video && playBtn) {
  //  Click: play / pause toggle
  videoWrapper.addEventListener("click", () => {
    if (video.paused) {
      video.defaultMuted = false;
      video.muted = false;
      video.volume = 1;
      video.play();
      playBtn.innerHTML = `<span class="pause-icon"></span>`;
      videoWrapper.classList.add("is-playing");
    } else {
      video.pause();
      playBtn.innerHTML = `<span class="triangle"></span>`;
      videoWrapper.classList.remove("is-playing");
    }
  });

  // Set up matchMedia for responsive animations
  let mm = gsap.matchMedia();

  // Desktop Animation: 3-Phase Scroll Animation (Mask, Parallax, and Scrub-Reveal)
  mm.add("(min-width: 768px)", () => {
    const startMask = {
      "--video-mask-x": "41%",
      "--video-mask-y": "34%",
      "--video-mask-radius": "18px",
    };

    gsap.set(".video-container", startMask);

    const videoMaskTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".video-section",
        start: "top bottom",
        end: "top 20%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    videoMaskTL
      .to(
        ".video-wrapper",
        {
          paddingTop: "0px",
          paddingBottom: "0px",
          ease: "none",
          duration: 1,
        },
        0,
      )
      .to(
        ".video-container",
        {
          "--video-mask-x": "0%",
          "--video-mask-y": "0%",
          "--video-mask-radius": "0px",
          ease: "none",
          duration: 1,
        },
        0,
      );

    // Parallax
    gsap.fromTo(
      ".bg-video",
      { y: "8%" },
      {
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: ".video-section",
          start: "top bottom",
          end: "top 20%",
          scrub: true,
        },
      },
    );

    // Phase 2: overlay + content + play btn reveal
    gsap.set(".video-wrapper", { clipPath: "inset(0% 0% 0% 0%)" });

    const videoRevealTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".video-section",
        start: "top 80%",
        end: "top top",
        scrub: 0.8,
      },
    });

    videoRevealTL
      .fromTo(
        ".video-section .overlay",
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: 1 },
      )
      .fromTo(
        ".video-section .content",
        { opacity: 0, yPercent: -40, y: 60 },
        { opacity: 1, yPercent: -50, y: 0, ease: "power2.out", duration: 0.8 },
        0.2,
      )
      .fromTo(
        "#playBtn",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.6 },
        0.2,
      );
  });

  // Mobile Animation: Simple Fade In Up Transition on entering viewport
  mm.add("(max-width: 767.9px)", () => {
    // Reset any potential inline mask values (though clip-path: none is handled by CSS)
    gsap.set(".video-container", { clearProps: "transform" });
    gsap.set(".bg-video", { y: "0%" });

    const videoMobileTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".video-section",
        start: "top 75%",
        once: true,
      },
    });

    videoMobileTL
      .fromTo(
        ".video-container",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      )
      .fromTo(
        ".video-section .overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.6",
      )
      .fromTo(
        ".video-section .content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4",
      )
      .fromTo(
        "#playBtn",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4",
      );
  });
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

// â­ Contact Section â” slide up overlap + content animations
// Sab kuch viewport mein aane ke baad hi chalta hai
(function initContactSection() {
  var contactSec = document.querySelector(".contact-sec");
  if (!contactSec) return;

  var content = contactSec.querySelector(".content");
  var imageContainer = contactSec.querySelector(".image-container");
  var h3 = contactSec.querySelector(".inner-content h3");
  var h2 = contactSec.querySelector(".inner-content h2");
  var formActions = contactSec.querySelector(".form-actions");

  ScrollTrigger.create({
    trigger: contactSec,
    start: "top 70%", // jab section thoda andar aa jaaye
    once: true,
    onEnter: function () {
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (content) {
        tl.to(content, { opacity: 1, x: 0, duration: 0.85 }, 0);
      }
      if (imageContainer) {
        tl.to(imageContainer, { opacity: 1, x: 0, duration: 0.85 }, 0.15);
      }
      if (h3) {
        tl.from(h3, { x: -80, opacity: 0, duration: 0.7 }, 0.1);
      }
      if (h2) {
        tl.from(h2, { x: -80, opacity: 0, duration: 0.7 }, 0.3);
      }
      if (formActions) {
        tl.from(
          formActions,
          { y: 30, opacity: 0, duration: 0.6, ease: "back.out(1.7)" },
          0.55,
        );
      }
    },
  });
})();

// ============================================================
// HORIZONTAL SECTION
// Phase 1 (scrub)       : yellow circle fills, then title slides in
// Phase 2 (wheel-snap)  : panels slide Râ†’L / Lâ†’R one per tick
//   â¢ html overflow:hidden freezes the page (no spacer tricks)
//   â¢ After last panel â†’ overflow restored, page scrolls freely
// ============================================================
(function initHorizontalSection() {
  if (window.matchMedia("(max-width: 767.98px)").matches) return;
  var hSec = document.querySelector(".horizontal-section");
  var horizontal = document.querySelector(".horizontal-wrapper");
  if (!hSec || !horizontal) return;

  var panels = Array.from(hSec.querySelectorAll(".panel"));
  if (!panels.length) return;

  var n = panels.length;
  var hTrigger;
  // -YP start
  var currentStep = -1;
  var isWheelTransitioning = false;
  var wheelUnlockTimer = null;
  var wheelSlideDuration = 1150;
  var wheelUnlockDelay = 1250;
  var featuredNewsEase = function (progress) {
    var x1 = 0.25;
    var y1 = 0.1;
    var x2 = 0.25;
    var y2 = 1;
    var t = progress;

    for (var i = 0; i < 5; i++) {
      var invT = 1 - t;
      var x = 3 * invT * invT * t * x1 + 3 * invT * t * t * x2 + t * t * t;
      var dx =
        3 * invT * invT * x1 + 6 * invT * t * (x2 - x1) + 3 * t * t * (1 - x2);

      if (!dx) break;
      t -= (x - progress) / dx;
      t = Math.max(0, Math.min(1, t));
    }

    var invT = 1 - t;
    return 3 * invT * invT * t * y1 + 3 * invT * t * t * y2 + t * t * t;
  };
  // -YP end

  var getFillScale = function () {
    if (window.innerWidth <= 767) return;
    var circle = hSec.querySelector(".lavender-circle");
    if (!circle) return 4;
    var sW = hSec.offsetWidth,
      sH = hSec.offsetHeight;
    var cW = circle.offsetWidth,
      cH = circle.offsetHeight;
    return Math.max(sW / (cW * 0.5), sH / cH) * 1.1;
  };

  //  Initial states
  gsap.set(".horizontal-section .yellow h2", { x: -160, autoAlpha: 0 });
  gsap.set(".lavender-circle", {
    scale: 0.22,
    transformOrigin: "bottom right",
  });
  gsap.set(horizontal, { overflow: "hidden" });
  gsap.set(".pedagogy-btn", { autoAlpha: 0, y: 30 });

  panels.forEach(function (p, i) {
    gsap.set(p, {
      autoAlpha: 0,
      xPercent: 100,
      zIndex: n - i,
      position: "absolute",
      top: 0,
      left: "var(--horizontal-container-gutter)",
      width: "calc(100% - var(--horizontal-container-gutter))",
      height: "100%",
    });
  });

  var phase1Distance = window.innerHeight * 1.5;

  // Reveal sequence: Circle -> Heading -> Panel 0 -> CTA
  var introTL = gsap.timeline({
    scrollTrigger: {
      trigger: hSec,
      start: "top 20%",
      end: "+=" + (window.innerHeight * 0.2 + phase1Distance),
      scrub: 1.5,
    },
  });

  // Circle appears from right bottom and fills on scroll
  introTL.to(
    ".lavender-circle",
    {
      scale: getFillScale(),
      ease: "none",
    },
    0,
  );

  // Heading slides and fades in from left
  introTL.to(
    ".horizontal-section .yellow h2",
    {
      x: 0,
      autoAlpha: 1,
      ease: "power3.out",
    },
    0.2,
  );

  // Swiper slider (panel 0) slides and fades in a little from left
  introTL.fromTo(
    panels[0],
    { xPercent: 15, autoAlpha: 0 },
    { xPercent: 0, autoAlpha: 1, ease: "power3.out" },
    0.4,
  );

  // CTA appears
  introTL.to(
    ".pedagogy-btn",
    {
      autoAlpha: 1,
      y: 0,
      ease: "power3.out",
    },
    0.6,
  );

  //  Master scrub timeline
  // Structure (all durations in timeline "units"):
  //   title phase  : heading slides in after the circle finishes
  //   panels       : Panel 0 slides in, then panel-to-panel transitions
  //   ... etc
  // Total duration units = circle phase + n panel steps

  var masterTL = gsap.timeline({ paused: true });
  // -YP start
  var circleFillDuration = 0;
  var introTimelineDuration = circleFillDuration;
  var panelStart = introTimelineDuration;
  // -YP end
  var panelEnterDuration = 0;
  var panelHold = 0;
  var panelTransitionDuration = 1.2; // duration of each panel slide inside masterTL
  // -YP start
  var firstStepDuration = 2.6;
  var panelStepDuration = wheelSlideDuration / 1000; // match featured-news-sec wheel timing
  // -YP end

  // Phase 1 segment: circle fill only. Title and Panel 0 are revealed via early ScrollTrigger.

  // Panel transitions
  for (var i = 1; i < n; i++) {
    var startTime =
      panelStart +
      panelEnterDuration +
      panelHold +
      (i - 1) * panelTransitionDuration;
    var outPanel = panels[i - 1];
    var inPanel = panels[i];

    masterTL.set(inPanel, { autoAlpha: 1, zIndex: n + 2 }, startTime);
    masterTL.set(outPanel, { zIndex: n + 1 }, startTime);

    masterTL.to(
      outPanel,
      {
        xPercent: -100,
        // -YP start
        ease: "none",
        // -YP end
        duration: panelTransitionDuration,
      },
      startTime,
    );
    masterTL.fromTo(
      inPanel,
      { xPercent: 100 },
      {
        xPercent: 0,
        // -YP start
        ease: "none",
        // -YP end
        duration: panelTransitionDuration,
      },
      startTime,
    );
  }

  //  ScrollTrigger â” one big pin for everything
  // Total scroll distance: PHASE1_PX + (n panels * PX_PER_PANEL)
  function getPhase1Px() {
    return phase1Distance; // Allow native scroll to handle the scrubbed introTL before hijacking wheel
  }

  var PX_PER_PANEL = 1050; // scroll pixels per panel movement
  function getTotalPx() {
    return getPhase1Px() + n * PX_PER_PANEL;
  }
  var lastSlideBgActive = false;
  // stepTimes[i] = the timeline position where panel i has FULLY arrived.
  // step 0: panel 0 finishes its long enter animation
  // step i>0: panel i finishes its transition (start + full duration)
  var stepTimes = panels.map(function (_, index) {
    if (index === 0) {
      // -YP start
      // Park panel 0 at the same boundary where the first slide-to-slide
      // transition starts, so forward and reverse motion stay smooth.
      return panelStart + panelEnterDuration + panelHold;
      // -YP end
    }
    // Panel i transition starts at panelStart+panelEnterDuration+panelHold+(i-1)*panelTransitionDuration
    // and takes panelTransitionDuration to complete
    return (
      panelStart +
      panelEnterDuration +
      panelHold +
      (index - 1) * panelTransitionDuration +
      panelTransitionDuration
    );
  });
  var maxStep = stepTimes.length - 1;

  function setLastSlideBackground(step) {
    var shouldBeWhite = step >= maxStep;
    if (shouldBeWhite === lastSlideBgActive) return;
    lastSlideBgActive = shouldBeWhite;
    // gsap.to(".lavender-circle", {
    //   backgroundColor: shouldBeWhite ? "#ffffff" : "#FFEA2C",
    //   duration: 0.8,
    //   ease: "power2.inOut",
    //   overwrite: true,
    // });
  }

  // -YP start
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

  function goToStep(step, immediate) {
    step = gsap.utils.clamp(0, maxStep, step);
    var previousStep = currentStep;
    currentStep = step;
    setLastSlideBackground(step);

    var dur = immediate
      ? 0
      : previousStep < 0 && step === 0
        ? firstStepDuration
        : panelStepDuration;

    if (!immediate) isWheelTransitioning = true;

    gsap.to(masterTL, {
      time: stepTimes[step],
      duration: dur,
      ease: featuredNewsEase,
      overwrite: true,
      onComplete: function () {
        unlockWheelTransition();
      },
    });

    window.clearTimeout(wheelUnlockTimer);
    if (!immediate) {
      wheelUnlockTimer = window.setTimeout(function () {
        masterTL.time(stepTimes[step]);
        unlockWheelTransition();
      }, wheelUnlockDelay);
    }

    // Pedagogy button is now handled by the entrance animation
    if (step === 0 && !immediate) {
      // Pedagogy button already visible
    }
  }
  // -YP end

  function releaseHorizontal(direction) {
    if (!hTrigger) return;
    var target =
      direction > 0 ? hTrigger.end + 2 : Math.max(hTrigger.start - 2, 0);
    window.scrollTo({ top: target, behavior: "auto" });
  }

  // -YP start
  function onHorizontalWheel(event) {
    if (!hTrigger || !hTrigger.isActive) return;

    var introDistance = window.pageYOffset - hTrigger.start;
    if (introDistance < getPhase1Px() - 2) return;

    if (isWheelTransitioning) {
      event.preventDefault();
      return;
    }

    var delta = getWheelDelta(event);
    if (Math.abs(delta) < 8) return;

    var direction = delta > 0 ? 1 : -1;
    var nextStep = currentStep + direction;

    if (nextStep < 0 || nextStep > maxStep) {
      releaseHorizontal(direction);
      return;
    }

    event.preventDefault();
    goToStep(nextStep, false);
  }
  // -YP end

  hTrigger = ScrollTrigger.create({
    trigger: hSec,
    start: "top top",
    end: function () {
      return "+=" + getTotalPx();
    },
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    id: "hSecMaster",
    invalidateOnRefresh: true,
    onUpdate: function (self) {
      var phase1 = getPhase1Px();
      var introProgress =
        phase1 > 0
          ? gsap.utils.clamp(0, 1, (window.pageYOffset - self.start) / phase1)
          : 1;

      if (introProgress < 1) {
        currentStep = -1;
        unlockWheelTransition();
        setLastSlideBackground(-1);
        gsap.to(masterTL, {
          time: introTimelineDuration * introProgress,
          duration: 0.22,
          ease: "power3.out",
          overwrite: true,
        });
      } else if (currentStep < 0) {
        gsap.killTweensOf(masterTL);
        masterTL.time(introTimelineDuration);
        goToStep(0, true);
      }
    },
    onEnter: function () {
      // -YP start
      currentStep = -1;
      unlockWheelTransition();
      setLastSlideBackground(-1);
      masterTL.pause(0);
      // -YP end
    },
    onEnterBack: function () {
      // -YP start
      unlockWheelTransition();
      goToStep(maxStep, true);
      // -YP end
    },
    onLeaveBack: function () {
      // -YP start
      currentStep = -1;
      unlockWheelTransition();
      setLastSlideBackground(-1);
      masterTL.pause(0);
      // -YP end
    },
  });

  window.addEventListener("wheel", onHorizontalWheel, { passive: false });

  window.addEventListener("resize", function () {
    ScrollTrigger.refresh();
  });
})();

// ============================================================
// MOBILE HORIZONTAL SWIPER
// ============================================================
(function initMobileHorizontalSwiper() {
  var swiperEl = document.querySelector(
    ".horizontal-section-mobile .horizontal-swiper",
  );
  if (!swiperEl) return;

  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false,
    // autoplay: {
    //   delay: 3500,
    //   disableOnInteraction: false,
    // },
    grabCursor: true,
  });
})();

// ============================================================
// PANEL VIDEO LIGHTBOX â” Global handler (all pages)
// Play button click pe video lightbox mein open hoga
// ============================================================
(function initPanelVideoLightbox() {
  function attachLightbox(wrap) {
    const playBtn = wrap.querySelector(".panel-video-play");
    const video = wrap.querySelector(".panel-video");
    if (!playBtn || !video) return;

    playBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      var src = video.querySelector("source")
        ? video.querySelector("source").src
        : video.src;

      // Lightbox overlay
      var lb = document.createElement("div");
      lb.style.cssText =
        "position:fixed;inset:0;background:rgba(0,0,0,0.92);" +
        "display:flex;align-items:center;justify-content:center;" +
        "z-index:99999;cursor:pointer;";

      // Video element inside lightbox
      var lbVideo = document.createElement("video");
      lbVideo.src = src;
      lbVideo.controls = true;
      lbVideo.autoplay = true;
      lbVideo.playsInline = true;
      lbVideo.style.cssText =
        "max-width:90vw;max-height:85vh;border-radius:8px;cursor:default;";

      // Close button
      var closeBtn = document.createElement("button");
      closeBtn.innerHTML = "&#x2715;";
      closeBtn.setAttribute("aria-label", "Close video");
      closeBtn.style.cssText =
        "position:absolute;top:24px;right:32px;" +
        "background:none;border:none;color:#fff;" +
        "font-size:32px;cursor:pointer;line-height:1;z-index:1;";

      lb.appendChild(lbVideo);
      lb.appendChild(closeBtn);
      document.body.appendChild(lb);
      document.body.style.overflow = "hidden";

      function close() {
        lbVideo.pause();
        lb.remove();
        document.body.style.overflow = "";
      }

      closeBtn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        close();
      });
      lb.addEventListener("click", function (ev) {
        if (ev.target === lb) close();
      });
      document.addEventListener(
        "keydown",
        function (ev) {
          if (ev.key === "Escape") close();
        },
        { once: true },
      );
    });
  }

  // Attach to all existing wraps
  document.querySelectorAll(".panel-video-wrap").forEach(attachLightbox);
})();

gsap.registerPlugin(ScrollTrigger);

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
      // end: "+=3000",
      end: "+=180%",
      scrub: 1.5,
      pin: true,
      anticipatePin: 1,
    },
  });

  // ðŸ‘‰ Horizontal movement
  tl.to(
    track,
    {
      x: -totalWidth,
      ease: "none",
    },
    0,
  );

  // ðŸ‘‰ EACH CIRCLE ANIMATION
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

    // Phase 3: center â†’ grow + full text
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

  // Curtain: jab GSAP stickyViewport ko position:fixed kare,
  // tab bhi woh img-sec (z-index:1) ke upar rahe
  stickyViewport.style.zIndex = "2";

  let bubbleTimeline;
  let resizeTimer;

  function drawBubbleConnectors() {
    const clusterWidth =
      Math.max(
        cluster.offsetWidth,
        ...bubbleCircles.map(
          (circle) => circle.offsetLeft + circle.offsetWidth,
        ),
      ) + 20;
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
      const startX = x1 + ux * startRadius;
      const startY = y1 + uy * startRadius;
      const endX = x2 - ux * endRadius;
      const endY = y2 - uy * endRadius;

      segment.setAttribute(
        "d",
        `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${endX.toFixed(
          1,
        )} ${endY.toFixed(1)}`,
      );
      segment._bubbleConnector = { startX, startY, endX, endY };
    });
  }

  function setConnectorDrawProgress(segment, progress) {
    const line = segment._bubbleConnector;
    if (!line) return;

    const currentX = line.startX + (line.endX - line.startX) * progress;
    const currentY = line.startY + (line.endY - line.startY) * progress;

    segment.setAttribute(
      "d",
      `M ${line.startX.toFixed(1)} ${line.startY.toFixed(
        1,
      )} L ${currentX.toFixed(1)} ${currentY.toFixed(1)}`,
    );
  }

  function buildMobileBubbleTimeline() {
    if (bubbleTimeline) {
      bubbleTimeline.scrollTrigger?.kill();
      bubbleTimeline.kill();
      bubbleTimeline = null;
    }

    gsap.killTweensOf([
      section,
      stickyViewport,
      bubbleTrack,
      ...bubbleCircles,
      ...connectorSegments,
    ]);

    // Clear previous GSAP styles that might interfere
    gsap.set(
      [
        section,
        stickyViewport,
        bubbleTrack,
        ...bubbleCircles,
        ...connectorSegments,
      ],
      { clearProps: "all" },
    );

    // Allow native scrolling on mobile by overriding CSS pinning rules
    gsap.set(section, {
      overflow: "visible",
      backgroundColor: "#ffffff",
      minHeight: "auto",
    });
    gsap.set(stickyViewport, {
      height: "auto",
      minHeight: "auto",
      overflow: "visible",
      backgroundColor: "#ffffff",
    });
    gsap.set(bubbleTrack, { position: "relative", height: "auto" });

    // Dynamically calculate the tightest height for the cluster based on the last circle's bottom edge
    let maxBottom = 0;
    bubbleCircles.forEach((circle) => {
      const bottom = circle.offsetTop + circle.offsetHeight;
      if (bottom > maxBottom) maxBottom = bottom;
    });
    // Apply the exact height plus a small 80px padding at the bottom
    gsap.set(cluster, { height: maxBottom + 80 });

    // Draw connectors at native positions
    drawBubbleConnectors();

    // Show connectors fully
    connectorSegments.forEach((segment) => {
      setConnectorDrawProgress(segment, 1);
      gsap.set(segment, { autoAlpha: 1 });
    });

    // Set initial state for circles: hidden and slightly scaled down (15% smaller)
    gsap.set(bubbleCircles, {
      autoAlpha: 0,
      scale: 0.85,
      zIndex: 2,
    });

    // Ensure text inside is fully visible when the circle fades in
    gsap.set(".bbt-FA-circle-sec .circle h2, .bbt-FA-circle-sec .circle p", {
      autoAlpha: 1,
      y: 0,
    });

    // Create simple ScrollTriggers for each bubble
    bubbleCircles.forEach((circle, index) => {
      gsap.to(circle, {
        scrollTrigger: {
          trigger: circle,
          start: "top 85%",
        },
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  }

  function buildBubbleTimeline() {
    if (bubbleTimeline) {
      bubbleTimeline.scrollTrigger?.kill();
      bubbleTimeline.kill();
    }
    gsap.killTweensOf([
      section,
      stickyViewport,
      bubbleTrack,
      ...bubbleCircles,
      ...connectorSegments,
    ]);
    gsap.set(bubbleTrack, { clearProps: "transform" });

    if (window.matchMedia("(max-width: 767.98px)").matches) {
      buildMobileBubbleTimeline();
      return;
    }

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

    // First circle is already visible when the previous horizontal pin releases.
    const startX = viewportCenter - firstCircleCenter;
    const endX = viewportWidth * 0.75 - lastCircleCenter;
    const travelDistance = Math.max(startX - endX, viewportWidth * 1.8);
    const scrollDistance = Math.max(
      travelDistance * 1.35,
      viewportWidth * 3.75,
    );
    const firstBubbleIntro = Math.min(
      travelDistance * 0.16,
      viewportWidth * 0.42,
    );
    const backgroundRevealDuration = firstBubbleIntro * 0.34;
    gsap.set(bubbleCircles, {
      scale: 0.12,
      autoAlpha: 0,
      x: 80, // right se enter karenge
      zIndex: 1,
      transformOrigin: "50% 50%",
    });
    gsap.set(bubbleCircles[0], { scale: 0.34, x: 0 });

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
        `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${endX.toFixed(
          1,
        )} ${endY.toFixed(1)}`,
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
      firstBubbleIntro,
    );

    gsap.set([section, stickyViewport], { backgroundColor: "#FFEA2C" });
    bubbleTimeline.to(
      [section, stickyViewport],
      {
        backgroundColor: "#ffffff",
        duration: backgroundRevealDuration,
      },
      0,
    );

    bubbleCircles.forEach((circle, index) => {
      const heading = circle.querySelector("h2");
      const body = circle.querySelector("p");
      const circleCenter =
        clusterOffset + circle.offsetLeft + circle.offsetWidth / 2;
      const connector = index > 0 ? connectorSegments[index - 1] : null;

      const rawFocusTime = startX + circleCenter - viewportCenter;
      // c1 ka rawFocusTime ~0 hota hai (already centered).
      // 300px fix kiya â” c2 ka rawFocusTime ~513px hai, toh c1 usse pehle aayega.
      const focusTime = gsap.utils.clamp(0, travelDistance, rawFocusTime);

      let phaseOneStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.28,
      );
      let phaseTwoStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.16,
      );
      let titleStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.14,
      );
      let bodyStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.1,
      );
      let activeStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.07,
      );
      let activeEnd = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime + viewportWidth * 0.07,
      );

      if (index === 0) {
        phaseOneStart = backgroundRevealDuration;
        phaseTwoStart = backgroundRevealDuration + firstBubbleIntro * 0.42;
        titleStart = backgroundRevealDuration + firstBubbleIntro * 0.28;
        bodyStart = backgroundRevealDuration + firstBubbleIntro * 0.46;
        activeStart = backgroundRevealDuration + firstBubbleIntro * 0.62;
        activeEnd = backgroundRevealDuration + firstBubbleIntro * 0.9;
      } else {
        phaseOneStart += firstBubbleIntro;
        phaseTwoStart += firstBubbleIntro;
        titleStart += firstBubbleIntro;
        bodyStart += firstBubbleIntro;
        activeStart += firstBubbleIntro;
        activeEnd += firstBubbleIntro;
      }

      bubbleTimeline.to(
        circle,
        {
          scale: 0.94,
          autoAlpha: 0.7,
          x: 0, // right se center tak slide in
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

// ============================================================
// CURTAIN EFFECT
//
// Jab bbt-FA-circle-sec scroll hoke upar jaaye:
//   â†’ bbt-FA-img-sec fixed rahegi viewport mein (curtain opens)
//
// Jab bbt-FA-circle-sec poori tarah chali jaaye:
//   â†’ bbt-FA-img-sec ko normal flow mein wapas laao
//
// Glitch fix: horizontal-section z-index:0 CSS mein set hai
// taaki woh fixed img-sec (z-index:1) ke neeche rahe.
// ============================================================
(function initCurtainEffect() {
  if (window.innerWidth <= 767) return; // Mobile me disable
  const circleSec = document.querySelector(".bbt-FA-circle-sec");
  const imgSec = document.querySelector(".bbt-FA-img-sec");
  if (!circleSec || !imgSec) return;

  let imgSecLeft = 0;
  let imgSecWidth = 0;
  let imgSecHeight = 0;
  let isPinned = false;

  const newsSec = document.querySelector(".news-section");
  if (newsSec) {
    if (window.innerWidth <= 767) return; // Mobile me disable
    gsap.set(newsSec, { position: "relative", zIndex: 2 });

    const scrollPauseSpacer = document.createElement("div");
    scrollPauseSpacer.style.height = "150vh";
    scrollPauseSpacer.style.width = "100%";
    scrollPauseSpacer.style.pointerEvents = "none";
    newsSec.parentNode.insertBefore(scrollPauseSpacer, newsSec);
  }

  ScrollTrigger.create({
    trigger: circleSec,
    start: "top top",
    endTrigger: newsSec,
    end: "top top", // Pin stays until news section fully overlaps
    onEnter: pin,
    onEnterBack: pin,
    onLeave: unpin,
    onLeaveBack: unpin,
    invalidateOnRefresh: true,
  });

  const imgText = imgSec.querySelector(".img-text");
  const purpleCircle = imgSec.querySelector(".purple-circle");
  const mainTitle = imgSec.querySelector(".main-title");

  if (imgText && purpleCircle && mainTitle) {
    // Initial states: slide DOWN instead of UP
    gsap.set([imgText, mainTitle], { autoAlpha: 0, y: -40 });
    gsap.set(purpleCircle, { autoAlpha: 0, scale: 0.8 });

    // Entrance animation: plays when circleSec finishes overlapping
    const tl = gsap.timeline({ paused: true });
    tl.to(imgText, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .to(
        purpleCircle,
        { autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6",
      )
      .to(
        mainTitle,
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      );

    ScrollTrigger.create({
      trigger: circleSec,
      start: "bottom top",
      animation: tl,
      toggleActions: "play none none reverse",
    });

    // Exit animation: scrubs dynamically as newsSec overlaps the pinned image
    const exitTl = gsap.timeline({ paused: true });
    exitTl.fromTo(
      [imgText, purpleCircle, mainTitle],
      { autoAlpha: 1, y: 0 },
      { autoAlpha: 0, y: -150, stagger: 0.1, immediateRender: false },
    );

    ScrollTrigger.create({
      trigger: newsSec,
      start: "top 85%", // Starts fading out when newsSec enters 15% from bottom
      end: "top 30%", // Finishes before newsSec reaches the middle
      animation: exitTl,
      scrub: 1,
    });
  }

  // Placeholder taaki layout shift na ho jab imgSec fixed ho
  const placeholder = document.createElement("div");
  placeholder.style.cssText =
    "display:none; pointer-events:none; visibility:hidden;";
  imgSec.parentNode.insertBefore(placeholder, imgSec);

  function measure() {
    // Temporarily unpin to get natural dimensions
    const wasFixed = isPinned;
    if (wasFixed) {
      imgSec.style.position = "";
      placeholder.style.display = "none";
    }
    const rect = imgSec.getBoundingClientRect();
    imgSecLeft = rect.left + window.scrollX;
    imgSecWidth = imgSec.offsetWidth;
    imgSecHeight = imgSec.offsetHeight;
    placeholder.style.height = imgSecHeight + "px";
    if (wasFixed) {
      imgSec.style.position = "fixed";
      placeholder.style.display = "block";
    }
  }

  function pin() {
    if (isPinned) return;
    isPinned = true;
    measure();
    placeholder.style.display = "block";
    gsap.set(imgSec, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      zIndex: 1,
    });
  }

  function unpin() {
    if (!isPinned) return;
    isPinned = false;
    placeholder.style.display = "none";
    gsap.set(imgSec, { clearProps: "position,top,left,width,height,zIndex" });
  }

  window.addEventListener("load", () => {
    measure();
    ScrollTrigger.refresh();
  });
  window.addEventListener("resize", () => {
    measure();
    ScrollTrigger.refresh();
  });
})();

// ============================================================
// NEWS SECTION ANIMATION
// ============================================================
(function initNewsSectionAnimation() {
  const newsSec = document.querySelector(".news-section");
  if (!newsSec) return;

  const newsHeader = newsSec.querySelector(".news-header");
  const newsCards = newsSec.querySelectorAll(".news-grid .card");

  gsap.set([newsHeader, ...newsCards], { autoAlpha: 0, y: 50 });

  ScrollTrigger.create({
    trigger: newsSec,
    start: "top 50%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (newsHeader) {
        tl.to(newsHeader, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
      if (newsCards.length > 0) {
        tl.to(
          newsCards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
          },
          "-=0.6",
        );
      }
    },
  });
})();

// ============================================================
// RECOGNITION SECTION ANIMATION
// ============================================================
(function initRecognitionSectionAnimation() {
  const recSec = document.querySelector(".recognition-sec");
  if (window.innerWidth <= 767) return;
  if (!recSec) return;

  const heading = recSec.querySelector(".section-title");
  const awards = recSec.querySelectorAll(".awards-grid .award");

  gsap.set(heading, { autoAlpha: 0, y: 50 });
  gsap.set(awards, { autoAlpha: 0, y: 50 });

  ScrollTrigger.create({
    trigger: recSec,
    start: "top 30%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (heading) {
        tl.to(heading, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
      if (awards.length > 0) {
        tl.to(
          awards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
          },
          "-=0.4",
        );
      }
    },
  });
})();

// ============================================================
// BACKGROUND COLOR TRANSITION
// ============================================================
(function initBackgroundColorTransition() {
  const newsSection = document.querySelector(".news-section");
  const recognitionSection = document.querySelector(".recognition-sec");
  if (!newsSection || !recognitionSection) return;

  const newsGrid = newsSection.querySelector(".news-grid");

  gsap.set(newsSection, { backgroundColor: "#ffffff" });
  gsap.set(recognitionSection, { backgroundColor: "#ffffff" });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.to([newsSection, recognitionSection], {
      backgroundColor: "#FFEA2C",
      ease: "none",
      scrollTrigger: {
        trigger: newsGrid || newsSection,
        start: "bottom 25%",
        end: "bottom top",
        scrub: 0,
        invalidateOnRefresh: true,
      },
    });
  }
})();

// ============================================================
// NEWS SECTION ANIMATION
// ============================================================
(function initNewsSectionAnimation() {
  const newsSec = document.querySelector(".news-section");
  if (!newsSec) return;

  const newsHeader = newsSec.querySelector(".news-header");
  const newsCards = newsSec.querySelectorAll(".news-grid .card");

  gsap.set([newsHeader, ...newsCards], { autoAlpha: 0, y: 50 });

  ScrollTrigger.create({
    trigger: newsSec,
    start: "top 50%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (newsHeader) {
        tl.to(newsHeader, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
      if (newsCards.length > 0) {
        tl.to(
          newsCards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
          },
          "-=0.6",
        );
      }
    },
  });
})();

// ============================================================
// RECOGNITION SECTION ANIMATION
// ============================================================
(function initRecognitionSectionAnimation() {
  const recSec = document.querySelector(".recognition-sec");
  if (!recSec) return;

  const heading = recSec.querySelector(".section-title");
  const awards = recSec.querySelectorAll(".awards-grid .award");

  gsap.set(heading, { autoAlpha: 0, y: 50 });
  gsap.set(awards, { autoAlpha: 0, y: 50 });

  ScrollTrigger.create({
    trigger: recSec,
    start: "top 30%",
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (heading) {
        tl.to(heading, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
      if (awards.length > 0) {
        tl.to(
          awards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
          },
          "-=0.4",
        );
      }
    },
  });
})();

// ============================================================
// BACKGROUND COLOR TRANSITION
// ============================================================
(function initBackgroundColorTransition() {
  const newsSection = document.querySelector(".news-section");
  const recognitionSection = document.querySelector(".recognition-sec");
  if (!newsSection || !recognitionSection) return;

  const newsGrid = newsSection.querySelector(".news-grid");

  gsap.set(newsSection, { backgroundColor: "#ffffff" });
  gsap.set(recognitionSection, { backgroundColor: "#ffffff" });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.to([newsSection, recognitionSection], {
      backgroundColor: "#FFEA2C",
      ease: "none",
      scrollTrigger: {
        trigger: newsGrid || newsSection,
        start: "bottom 25%",
        end: "bottom top",
        scrub: 0,
        invalidateOnRefresh: true,
      },
    });
  }
})();

//  Feature Block Scroll Animation
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
// MOB STICKY BTN â” contact-sec ke andar enter hone pe hide karo
// ============================================================
(function initMobStickyBtn() {
  var stickyBtn = document.querySelector(".mob-sticky-btn");
  var contactSec = document.querySelector(".contact-sec");
  if (!stickyBtn || !contactSec) return;

  function updateStickyBtn() {
    var rect = contactSec.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      stickyBtn.style.opacity = "0";
      stickyBtn.style.pointerEvents = "none";
      stickyBtn.style.transform = "translateY(20px)";
    } else {
      stickyBtn.style.opacity = "1";
      stickyBtn.style.pointerEvents = "auto";
      stickyBtn.style.transform = "translateY(0)";
    }
  }

  stickyBtn.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  window.addEventListener("scroll", updateStickyBtn, { passive: true });
  window.addEventListener("resize", updateStickyBtn);
  updateStickyBtn();
})();

(function initFooterReveal() {
  var wrapper = document.querySelector(".main-content-wrapper");
  var overlapFooter = document.querySelector(".overlap-footer");

  if (!wrapper || !overlapFooter) return;

  let mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    Object.assign(wrapper.style, {
      position: "relative",
      zIndex: "10",
    });

    Object.assign(overlapFooter.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      zIndex: "-1",
      transform: "none",
    });

    function updateFooterMargin() {
      wrapper.style.marginBottom = overlapFooter.offsetHeight + "px";
    }

    window.addEventListener("resize", updateFooterMargin);
    window.addEventListener("load", updateFooterMargin);

    updateFooterMargin();
    setTimeout(updateFooterMargin, 500);

    return () => {
      window.removeEventListener("resize", updateFooterMargin);
      window.removeEventListener("load", updateFooterMargin);
      wrapper.style.marginBottom = "";
      Object.assign(wrapper.style, { position: "", zIndex: "" });
      Object.assign(overlapFooter.style, {
        position: "",
        bottom: "",
        left: "",
        width: "",
        zIndex: "",
        transform: "",
      });
    };
  });
})();
// ============================================================
// MOBILE SCHOOL INFO SECTION (bbt-FA-img-sec-mobile)
// ============================================================
(function initMobileSchoolInfo() {
  const mobileSec = document.querySelector(".bbt-FA-img-sec-mobile");
  if (!mobileSec) return;

  // The mobile version utilizes CSS `vw` and Flexbox to remain perfectly
  // scaled and centered across all devices, eliminating manual positioning.
  // Any mobile-specific interactive logic or dynamic adjustments
  // for this section should be implemented here to keep it decoupled
  // from the desktop logic.
})();
