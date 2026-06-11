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
    { once: true }
  );

  window.addEventListener(
    "load",
    function () {
      scrollTop();
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    },
    { once: true }
  );
})();

gsap.ticker.lagSmoothing(0);

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
    { passive: true }
  );

  // Resize pe headerH update karo
  window.addEventListener("resize", function () {
    headerH = hdr.offsetHeight;
  });
})();

// ============================================================
// INITIAL STATES — Page load pe yeh positions hongi
// ============================================================

// Burgundy BG — adha left mein
gsap.set(".burgundy-bg", { x: -220 });

// Yellow circle — aur neeche (screen ke bahar se thoda andar)
gsap.set(".yellow-circle", { y: 380 });

// Text — spans ko individually hide karo
// Laal bars (|) ki position se start karo — yaani text apni jagah se
// thoda left pe start ho aur wahan se slide in kare
// display:inline-block force karo — GSAP x transform inline elements pe kaam nahi karta
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
    0
  )

  // Yellow circle — neeche se upar (final: y:0)
  .to(
    ".yellow-circle",
    {
      y: 0,
      duration: 1.2,
      ease: "power2.out",
    },
    0
  )

  // Students — right se left (final: x:0)
  .to(
    ".hero-student-img",
    {
      x: 0,
      duration: 1.2,
      ease: "power2.out",
    },
    0
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
    0.2
  )

  // Teeno lines ek saath — slow aur smooth
  .to(
    [".main-title .line1", ".main-title .line2", ".main-title .line3"],
    {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    },
    0
  );

// ============================================================
// HERO STICKY + ABOUT PANEL OVERLAY
//
// Structure (HTML mein):
//   .hero-sticky-wrapper  [height: 200vh]
//     ├── .bbt-dp-hero    [position: sticky; top: 0; height: 100vh]
//     └── .bbt-dp-about   [position: absolute; top: 0; width: 100%]
//
// Flow:
//   • Page load: about translateY(100vh) → screen ke bilkul neeche,
//     hero ke peeche (z-index kam)
//   • Scroll: wrapper ke andar scroll hone se about y: 100vh → 0
//     (GSAP scrub) → hero ke upar slide karta hai
//   • About fully visible: content (img + text) animate in
//
// Koi extra white space nahi — about absolute hai wrapper mein.
// ============================================================

(function initHeroAboutPanelOverlay() {
  const aboutSection = document.querySelector(".bbt-dp-about");
  const heroSection = document.querySelector(".bbt-dp-hero");
  const heroWrapper = document.querySelector(".hero-sticky-wrapper");

  if (!aboutSection || !heroSection || !heroWrapper) return;

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

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });

  return;

  // ── Strategy ────────────────────────────────────────────────────
  // Wrapper height = 100vh (hero) + about ki poori height
  // Hero: position sticky, top:0, height:100vh  → apni jagah fixed
  // About: position absolute, top:0             → hero ke upar layer
  // JS: about translateY(100vh → 0) scrub       → slide up effect
  // Wrapper overflow:hidden                     → about clip nahi hoga
  //   kyunki wrapper khud itna lamba hai
  // Baad mein: video section wrapper ke theek baad — no gap
  // ────────────────────────────────────────────────────────────────

  function setWrapperHeight() {
    // Wrapper = hero (100vh) + about poori height
    // Taaki about fully visible ho sake aur clip na ho
    const aboutH = aboutSection.offsetHeight;
    heroWrapper.style.height = window.innerHeight + aboutH + "px";
  }

  // About ki height pehle measure karo (display block chahiye)
  // aboutSection position:absolute hai, toh offsetHeight sahi aayega
  setWrapperHeight();

  // ── Hero: page load pe fully visible ────────────────────────────
  heroSection.style.clipPath = "inset(0 0 0% 0)";
  heroSection.style.willChange = "clip-path";

  // ── About: shuru mein viewport ke neeche ────────────────────────
  gsap.set(aboutSection, {
    y: window.innerHeight,
    autoAlpha: 1,
    willChange: "transform",
  });

  // ── Scrub: first 100vh scroll mein about y:100vh→0 ──────────────
  // end: "+=100vh" matlab sirf 100vh scroll mein animation complete
  // Uske baad wrapper ka remaining scroll space = about ki height
  // jo naturally consume hoti hai jab user about padh raha hota hai
  gsap.to(aboutSection, {
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: heroWrapper,
      start: "top top",
      end: () => "+=" + window.innerHeight, // 100vh mein slide complete
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate(self) {
        // Hero ko neeche se clip karo jitna about aaya
        const pct = Math.round(self.progress * 100);
        heroSection.style.clipPath = `inset(0 0 ${pct}% 0)`;
      },
      onRefresh() {
        setWrapperHeight();
        if (this.progress === 0) {
          gsap.set(aboutSection, { y: window.innerHeight });
          heroSection.style.clipPath = "inset(0 0 0% 0)";
        }
      },
    },
  });

  gsap.set(".bbt-dp-about .about-img", { clearProps: "all" });
  gsap.set(".bbt-dp-about .about-paragraph", { clearProps: "all" });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setWrapperHeight();
      ScrollTrigger.refresh();
    }, 150);
  });
})();

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

  // ── PHASE 1: Square → Rectangle ─────────────────────────────────
  // Video expand: wrapper padding 0 tak animate → container-xxl se full viewport
  gsap.to(".video-wrapper", {
    padding: "0px",
    ease: "none",
    scrollTrigger: {
      trigger: ".video-section",
      start: "top 80%",
      end: "top 30%",
      scrub: 1,
    },
  });

  // Parallax
  gsap.fromTo(
    ".bg-video",
    { y: "8%" },
    {
      y: "0%",
      ease: "none",
      scrollTrigger: {
        trigger: ".video-section",
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
    }
  );

  // Phase 2: overlay + content + play btn reveal
  gsap.set(".video-wrapper", { clipPath: "inset(0% 0% 0% 0%)" });

  const videoRevealTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".video-section",
      start: "top 80%", // pehle 60% tha — ab thoda pehle shuru
      end: "top top",
      scrub: 0.8,
    },
  });

  videoRevealTL
    .fromTo(
      ".video-section .overlay",
      { opacity: 0 },
      { opacity: 1, ease: "none", duration: 1 }
    )
    .fromTo(
      ".video-section .content",
      { opacity: 0, yPercent: -40, y: 60 },
      { opacity: 1, yPercent: -50, y: 0, ease: "power2.out", duration: 0.8 },
      0.2
    )
    .fromTo(
      "#playBtn",
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.6 },
      0.2
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

// ⭐ Contact Section — slide up overlap + content animations
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
          0.55
        );
      }
    },
  });
})();

// ============================================================
// HORIZONTAL SECTION
// Phase 1 (scrub 1250px) : title slides in + yellow circle fills
// Phase 2 (wheel-snap)  : panels slide R→L / L→R one per tick
//   • html overflow:hidden freezes the page (no spacer tricks)
//   • After last panel → overflow restored, page scrolls freely
// ============================================================
(function initHorizontalSection() {
  var hSec = document.querySelector(".horizontal-section");
  var horizontal = document.querySelector(".horizontal-wrapper");
  if (!hSec || !horizontal) return;

  var panels = Array.from(hSec.querySelectorAll(".panel"));
  if (!panels.length) return;

  var n = panels.length;
  var hTrigger;
  var currentStep = -1;
  var isStepAnimating = false;
  var wheelCooldownUntil = 0;

  var getFillScale = function () {
    var circle = hSec.querySelector(".lavender-circle");
    if (!circle) return 4;
    var sW = hSec.offsetWidth,
      sH = hSec.offsetHeight;
    var cW = circle.offsetWidth,
      cH = circle.offsetHeight;
    return Math.max(sW / (cW * 0.5), sH / cH) * 1.1;
  };

  // ── Initial states ──────────────────────────────────────────
  gsap.set(".horizontal-section .yellow h2", { x: -160, autoAlpha: 0 });
  gsap.set(".lavender-circle", {
    scale: 0.22,
    transformOrigin: "bottom right",
  });
  gsap.set(horizontal, { overflow: "hidden" });
  gsap.set(".pedagogy-btn", { autoAlpha: 0, y: 30 });

  // All panels stacked: panel[0] on top, rest off-screen to the right
  panels.forEach(function (p, i) {
    gsap.set(p, {
      autoAlpha: i === 0 ? 0 : 0,
      xPercent: 100,
      zIndex: n - i,
      position: "absolute",
      top: 0,
      left: "var(--horizontal-container-gutter)",
      width: "calc(100% - var(--horizontal-container-gutter))",
      height: "100%",
    });
  });

  // ── Master scrub timeline ───────────────────────────────────
  // Structure (all durations in timeline "units"):
  //   0 → 0.5  : title slides in + circle grows from bottom-right
  //   0.5 → 1.3: circle expands until it fills the section
  //   1.3 → 2.3: Panel 0 slides in from right
  //   2.3 → 3.3: Panel 0 → Panel 1 (0 exits left, 1 enters right)
  //   3.3 → 4.3: Panel 1 → Panel 2 (1 exits left, 2 enters right)
  //   ... etc
  // Total duration units = circle phase + n panel steps

  var masterTL = gsap.timeline({ paused: true });
  var panelStart = 2.8;
  var panelEnterDuration = 2.8;
  var panelHold = 0.7;
  var panelTransitionDuration = 2.45;
  var firstStepDuration = 1.2;
  var panelStepDuration = 0.75;

  // Phase 1 segment
  masterTL.to(
    ".horizontal-section .yellow h2",
    {
      x: 0,
      autoAlpha: 1,
      ease: "power3.out",
      duration: 2.9,
    },
    0
  );
  masterTL.to(
    ".lavender-circle",
    {
      scale: 2,
      ease: "power3.out",
      duration: 3.2,
    },
    0
  );
  // masterTL.to(
  //   ".lavender-circle",
  //   {
  //     scale: getFillScale,
  //     ease: "power2.inOut",
  //     duration: 0.8,
  //   },
  //   0.5,
  // );

  // Panel 0 also enters from the right, but gets its own scroll segment so it
  // arrives smoothly instead of snapping into place.
  masterTL.set(panels[0], { autoAlpha: 1, xPercent: 100 }, panelStart);
  masterTL.to(
    panels[0],
    {
      xPercent: 0,
      ease: "power2.out",
      duration: panelEnterDuration,
    },
    panelStart
  );
  masterTL.to({}, { duration: panelHold }, panelStart + panelEnterDuration);

  // Panel transitions: each subsequent panel enters from right,
  // previous exits to left, simultaneously
  for (var i = 1; i < n; i++) {
    var startTime =
      panelStart +
      panelEnterDuration +
      panelHold +
      (i - 1) * panelTransitionDuration;
    var outPanel = panels[i - 1];
    var inPanel = panels[i];

    // Bring inPanel to front and make visible
    masterTL.set(inPanel, { autoAlpha: 1, zIndex: n + 2 }, startTime);
    masterTL.set(outPanel, { zIndex: n + 1 }, startTime);

    // Out panel slides left, in panel slides in from right — simultaneously
    masterTL.to(
      outPanel,
      {
        xPercent: -100,
        ease: "power2.out",
        duration: panelTransitionDuration,
      },
      startTime
    );
    masterTL.fromTo(
      inPanel,
      { xPercent: 100 },
      {
        xPercent: 0,
        ease: "power2.out",
        duration: panelTransitionDuration,
      },
      startTime
    );
  }

  // ── ScrollTrigger — one big pin for everything ─────────────
  // Total scroll distance: PHASE1_PX + (n panels * PX_PER_PANEL)
  var PHASE1_PX = 1250;
  var PX_PER_PANEL = 1050; // scroll pixels per panel movement
  var totalPx = PHASE1_PX + n * PX_PER_PANEL;
  var lastSlideBgActive = false;
  var stepTimes = panels.map(function (_, index) {
    return (
      panelStart +
      panelEnterDuration +
      panelHold +
      index * panelTransitionDuration
    );
  });
  stepTimes[0] = panelStart + panelEnterDuration + panelHold;
  var maxStep = stepTimes.length - 1;

  function setLastSlideBackground(step) {
    var shouldBeWhite = step >= maxStep;
    if (shouldBeWhite === lastSlideBgActive) return;
    lastSlideBgActive = shouldBeWhite;
    // gsap.to(".lavender-circle", {
    //   backgroundColor: shouldBeWhite ? "#ffffff" : "#f7df00",
    //   duration: 0.8,
    //   ease: "power2.inOut",
    //   overwrite: true,
    // });
  }

  function goToStep(step, immediate) {
    step = gsap.utils.clamp(0, maxStep, step);
    var previousStep = currentStep;
    currentStep = step;
    isStepAnimating = !immediate;
    setLastSlideBackground(step);

    gsap.to(masterTL, {
      time: stepTimes[step],
      duration: immediate
        ? 0
        : previousStep < 0 && step === 0
        ? firstStepDuration
        : panelStepDuration,
      ease: "power2.out",
      overwrite: true,
      onComplete: function () {
        isStepAnimating = false;
      },
    });

    // Pedagogy button — panel 0 ke saath hi aaye, independently
    if (step === 0 && !immediate) {
      gsap.to(".pedagogy-btn", {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
      });
    }
  }

  function releaseHorizontal(direction) {
    if (!hTrigger) return;
    isStepAnimating = true;
    var target =
      direction > 0 ? hTrigger.end + 2 : Math.max(hTrigger.start - 2, 0);
    window.scrollTo({ top: target, behavior: "auto" });
    window.setTimeout(function () {
      isStepAnimating = false;
    }, 120);
  }

  function onHorizontalWheel(event) {
    if (!hTrigger || !hTrigger.isActive) return;
    if (Math.abs(event.deltaY) < 12) return;

    event.preventDefault();

    var now = Date.now();
    if (isStepAnimating || now < wheelCooldownUntil) return;
    wheelCooldownUntil = now + 900;

    var direction = event.deltaY > 0 ? 1 : -1;
    var nextStep = currentStep + direction;

    if (nextStep < 0 || nextStep > maxStep) {
      releaseHorizontal(direction);
      return;
    }

    goToStep(nextStep, false);
  }

  hTrigger = ScrollTrigger.create({
    trigger: hSec,
    start: "top top",
    end: "+=" + totalPx,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    id: "hSecMaster",
    invalidateOnRefresh: true,
    onEnter: function () {
      currentStep = -1;
      isStepAnimating = false;
      setLastSlideBackground(-1);
      masterTL.pause(0);
      goToStep(0, false);
    },
    onEnterBack: function () {
      goToStep(maxStep, true);
    },
    onLeaveBack: function () {
      currentStep = -1;
      isStepAnimating = false;
      setLastSlideBackground(-1);
      masterTL.pause(0);
      gsap.set(".pedagogy-btn", { autoAlpha: 0, y: 30 });
    },
  });

  window.addEventListener("wheel", onHorizontalWheel, { passive: false });

  window.addEventListener("resize", function () {
    ScrollTrigger.refresh();
  });
})();

// ============================================================
// PANEL VIDEO LIGHTBOX — Global handler (all pages)
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
        { once: true }
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

  // 👉 Horizontal movement
  tl.to(
    track,
    {
      x: -totalWidth,
      ease: "none",
    },
    0
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
      i * 0.8
    );

    // Phase 2: text fade in (light)
    tl.to(
      circle.querySelector("h2"),
      {
        opacity: 0.5,
        duration: 0.3,
      },
      i * 0.8 + 0.2
    );

    tl.to(
      circle.querySelector("p"),
      {
        opacity: 0.5,
        duration: 0.3,
      },
      i * 0.8 + 0.25
    );

    // Phase 3: center → grow + full text
    tl.to(
      circle,
      {
        scale: 1.4,
        opacity: 1,
        duration: 0.6,
      },
      i * 0.8 + 0.4
    );

    tl.to(
      circle.querySelector("h2"),
      {
        opacity: 1,
        duration: 0.3,
      },
      i * 0.8 + 0.5
    );

    tl.to(
      circle.querySelector("p"),
      {
        opacity: 1,
        duration: 0.3,
      },
      i * 0.8 + 0.55
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
    ".bbt-FA-circle-sec .connector-segment"
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
  let c1RevealTrigger;
  let resizeTimer;

  function drawBubbleConnectors() {
    const clusterWidth =
      Math.max(
        cluster.offsetWidth,
        ...bubbleCircles.map((circle) => circle.offsetLeft + circle.offsetWidth)
      ) + 20;
    const clusterHeight =
      Math.max(
        cluster.offsetHeight,
        ...bubbleCircles.map((circle) => circle.offsetTop + circle.offsetHeight)
      ) + 20;

    gsap.set(cluster, {
      width: clusterWidth,
      height: clusterHeight,
    });

    connectorsSvg.setAttribute(
      "viewBox",
      `0 0 ${clusterWidth} ${clusterHeight}`
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
          1
        )} ${endY.toFixed(1)}`
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
        1
      )} L ${currentX.toFixed(1)} ${currentY.toFixed(1)}`
    );
  }

  function buildMobileBubbleTimeline() {
    if (bubbleTimeline) {
      bubbleTimeline.scrollTrigger?.kill();
      bubbleTimeline.kill();
      bubbleTimeline = null;
    }

    gsap.killTweensOf([bubbleTrack, ...bubbleCircles, ...connectorSegments]);
    if (c1RevealTrigger) {
      c1RevealTrigger.kill();
      c1RevealTrigger = null;
    }
    drawBubbleConnectors();

    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const focusY = bubbleCircles.map((circle) => {
      return viewportCenter - (circle.offsetTop + circle.offsetHeight / 2);
    });

    gsap.set(bubbleTrack, {
      x: 0,
      y: focusY[0] || 0,
    });
    gsap.set(bubbleCircles, {
      scale: 0.72,
      autoAlpha: 0,
      zIndex: 2,
      transformOrigin: "50% 50%",
    });
    gsap.set(".bbt-FA-circle-sec .circle h2, .bbt-FA-circle-sec .circle p", {
      autoAlpha: 0,
      y: 16,
    });
    gsap.set(bubbleCircles[0], { scale: 0.82, autoAlpha: 0, y: 80, zIndex: 5 });

    const firstHeading = bubbleCircles[0].querySelector("h2");
    const firstBody = bubbleCircles[0].querySelector("p");
    c1RevealTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 92%",
      once: true,
      onEnter: () => {
        gsap.to(bubbleCircles[0], {
          scale: 1,
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          ease: "power3.out",
          overwrite: true,
        });
        gsap.to([firstHeading, firstBody].filter(Boolean), {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          delay: 0.16,
          ease: "power2.out",
          overwrite: true,
        });
      },
    });

    connectorSegments.forEach((segment) => {
      setConnectorDrawProgress(segment, 0);
      gsap.set(segment, {
        autoAlpha: 0,
        strokeDasharray: "0 8",
        strokeDashoffset: 0,
      });
    });

    const segmentDuration = 1;
    const scrollDistance = Math.max(
      bubbleCircles.length * viewportHeight * 1.05,
      viewportHeight * 7
    );
    bubbleTimeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: 1,
        pin: stickyViewport,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.set([section, stickyViewport], { backgroundColor: "#ffffff" });

    bubbleCircles.forEach((circle, index) => {
      if (index === 0) return;

      const heading = circle.querySelector("h2");
      const body = circle.querySelector("p");
      const connector = connectorSegments[index];
      const at = index * segmentDuration;

      if (index > 0) {
        bubbleTimeline.to(
          bubbleTrack,
          {
            y: focusY[index],
            duration: 0.24,
            ease: "power2.inOut",
          },
          at
        );
      }

      bubbleTimeline.to(
        circle,
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.18,
          ease: "back.out(1.45)",
        },
        at + 0.08
      );

      if (heading) {
        bubbleTimeline.to(
          heading,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.16,
            ease: "power2.out",
          },
          at + 0.28
        );
      }

      if (body) {
        bubbleTimeline.to(
          body,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.16,
            ease: "power2.out",
          },
          at + 0.46
        );
      }

      if (connector && index < bubbleCircles.length - 1) {
        const lineDraw = { progress: 0 };
        bubbleTimeline.to(
          lineDraw,
          {
            progress: 1,
            duration: 0.28,
            ease: "power2.inOut",
            onStart: () => {
              gsap.set(connector, { autoAlpha: 0.92 });
            },
            onUpdate: () => {
              setConnectorDrawProgress(connector, lineDraw.progress);
            },
          },
          at + 0.68
        );
      }
    });

    bubbleTimeline.to({}, { duration: 0.2 });
  }

  function buildBubbleTimeline() {
    if (bubbleTimeline) {
      bubbleTimeline.scrollTrigger?.kill();
      bubbleTimeline.kill();
    }
    if (c1RevealTrigger) {
      c1RevealTrigger.kill();
      c1RevealTrigger = null;
    }

    gsap.killTweensOf([bubbleTrack, ...bubbleCircles, ...connectorSegments]);
    gsap.set(bubbleTrack, { clearProps: "transform" });

    if (window.matchMedia("(max-width: 767.98px)").matches) {
      buildMobileBubbleTimeline();
      return;
    }

    const clusterWidth =
      Math.max(
        cluster.offsetWidth,
        ...bubbleCircles.map((circle) => circle.offsetLeft + circle.offsetWidth)
      ) + 40;
    const clusterHeight =
      Math.max(
        cluster.offsetHeight,
        ...bubbleCircles.map((circle) => circle.offsetTop + circle.offsetHeight)
      ) + 20;

    gsap.set(cluster, {
      width: clusterWidth,
      height: clusterHeight,
    });

    connectorsSvg.setAttribute(
      "viewBox",
      `0 0 ${clusterWidth} ${clusterHeight}`
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
      viewportWidth * 3.75
    );
    gsap.set(bubbleCircles, {
      scale: 0.12,
      autoAlpha: 0,
      x: 80, // right se enter karenge
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
        `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${endX.toFixed(
          1
        )} ${endY.toFixed(1)}`
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
      0
    );

    // c1 (index=0) phaseOneStart = max(0, startX + c1Center - viewportCenter - viewportWidth*0.28)
    // bg fade should complete just before c1 becomes visible
    // We use a small fixed window at the very start of scroll (before track moves much)
    const c1 = bubbleCircles[0];
    const c1Center = clusterOffset + c1.offsetLeft + c1.offsetWidth / 2;
    const c1FocusTime = gsap.utils.clamp(
      0,
      travelDistance,
      startX + c1Center - viewportCenter
    );
    const c1PhaseOne = gsap.utils.clamp(
      0,
      travelDistance,
      c1FocusTime - viewportWidth * 0.28
    );
    const bgFadeEnd = Math.max(c1PhaseOne - viewportWidth * 0.05, 0);
    const bgFadeDuration = Math.max(viewportWidth * 0.2, 100);
    const bgFadeStart = Math.max(bgFadeEnd - bgFadeDuration, 0);

    gsap.set([section, stickyViewport], { backgroundColor: "#ffffff" });

    bubbleCircles.forEach((circle, index) => {
      const heading = circle.querySelector("h2");
      const body = circle.querySelector("p");
      const circleCenter =
        clusterOffset + circle.offsetLeft + circle.offsetWidth / 2;
      const connector = index > 0 ? connectorSegments[index - 1] : null;

      const rawFocusTime = startX + circleCenter - viewportCenter;
      // c1 ka rawFocusTime ~0 hota hai (already centered).
      // 300px fix kiya — c2 ka rawFocusTime ~513px hai, toh c1 usse pehle aayega.
      const focusTime = gsap.utils.clamp(
        0,
        travelDistance,
        index === 0 ? 300 : rawFocusTime
      );

      const phaseOneStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.28
      );
      const phaseTwoStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.16
      );
      const titleStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.14
      );
      const bodyStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.1
      );
      const activeStart = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime - viewportWidth * 0.07
      );
      const activeEnd = gsap.utils.clamp(
        0,
        travelDistance,
        focusTime + viewportWidth * 0.07
      );

      bubbleTimeline.to(
        circle,
        {
          scale: 0.94,
          autoAlpha: 0.7,
          x: 0, // right se center tak slide in
          duration: Math.max(phaseTwoStart - phaseOneStart, 0.01),
        },
        phaseOneStart
      );

      if (heading) {
        bubbleTimeline.to(
          heading,
          {
            autoAlpha: 0.45,
            y: 0,
            duration: Math.max(bodyStart - titleStart, 0.01),
          },
          titleStart
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
          bodyStart
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
        activeStart
      );

      if (heading) {
        bubbleTimeline.to(
          heading,
          {
            autoAlpha: 1,
            duration: Math.max(activeEnd - activeStart, 0.01),
          },
          activeStart
        );
      }

      if (body) {
        bubbleTimeline.to(
          body,
          {
            autoAlpha: 1,
            duration: Math.max(activeEnd - activeStart, 0.01),
          },
          activeStart + viewportWidth * 0.01
        );
      }

      if (connector) {
        bubbleTimeline.to(
          connector,
          {
            autoAlpha: 0.92,
            duration: Math.max(activeStart - phaseOneStart, 0.01),
          },
          phaseOneStart
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
//   → bbt-FA-img-sec fixed rahegi viewport mein (curtain opens)
//
// Jab bbt-FA-circle-sec poori tarah chali jaaye:
//   → bbt-FA-img-sec ko normal flow mein wapas laao
//
// Glitch fix: horizontal-section z-index:0 CSS mein set hai
// taaki woh fixed img-sec (z-index:1) ke neeche rahe.
// ============================================================
(function initCurtainEffect() {
  const circleSec = document.querySelector(".bbt-FA-circle-sec");
  const imgSec = document.querySelector(".bbt-FA-img-sec");
  if (!circleSec || !imgSec) return;

  let imgSecLeft = 0;
  let imgSecWidth = 0;
  let imgSecHeight = 0;
  let isPinned = false;

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
      zIndex: 1,
    });
  }

  function unpin() {
    if (!isPinned) return;
    isPinned = false;
    placeholder.style.display = "none";
    gsap.set(imgSec, { clearProps: "position,top,left,width,zIndex" });
  }

  // circle-sec khud z-index 2 pe hai (CSS mein set) — image ke upar rehta hai
  // Jab circle section viewport mein enter kare → pin imgSec
  // Jab circle section POORI tarah viewport se upar jaye → unpin
  ScrollTrigger.create({
    trigger: circleSec,
    start: "top top", // horizontal section complete hone ke baad hi pin kare
    end: "bottom top", // jab circle section poori tarah upar jaye
    onEnter: pin,
    onEnterBack: pin,
    onLeave: unpin, // circle section gaya — image ko normal karo
    onLeaveBack: unpin,
    invalidateOnRefresh: true,
  });

  window.addEventListener("load", () => {
    measure();
    ScrollTrigger.refresh();
  });
  window.addEventListener("resize", () => {
    measure();
    ScrollTrigger.refresh();
  });
})();

// ------------------- Our school page dev section
// ScrollTrigger initDevSection() function mein handle hota hai (line ~372)

// section fade animation on home page
document.addEventListener("DOMContentLoaded", function () {
  const newsSection = document.querySelector(".news-section");
  const animatedSections = document.querySelectorAll(".recognition-sec");
  const recognitionSection = document.querySelector(".recognition-sec");
  document.body.classList.add("reveal-animations-ready");

  const isInRevealRange = (section, offset) => {
    if (!section) return false;
    const rect = section.getBoundingClientRect();
    return rect.top < window.innerHeight * offset && rect.bottom > 0;
  };

  const revealVisibleSections = () => {
    animatedSections.forEach((section) => {
      if (isInRevealRange(section, 0.25)) {
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
      rootMargin: "0px 0px -75% 0px",
      threshold: 0,
    }
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

    // -YP start
    gsap.set(newsSection, { backgroundColor: "#ffffff" });
    gsap.set(recognitionSection, { backgroundColor: "#ffffff" });

    if (
      recognitionSection &&
      typeof gsap !== "undefined" &&
      typeof ScrollTrigger !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.to([newsSection, recognitionSection], {
        backgroundColor: "#f7df00",
        ease: "none",
        scrollTrigger: {
          trigger: newsGrid || newsSection,
          start: "bottom 25%", // keep News & Events white until the cards reach the reference position
          end: "bottom top",
          scrub: 0,
          invalidateOnRefresh: true,
        },
      });
    }
    // -YP end

    newsSection.classList.add("is-waiting");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip animation entirely for users who prefer reduced motion
      newsSection.classList.remove("is-waiting");
      newsHeader?.classList.add("animate");
      newsGrid
        ?.querySelectorAll(".card")
        .forEach((c) => c.classList.add("card-visible"));
      return;
    }

    const revealNews = () => {
      if (newsRevealed) return;
      newsRevealed = true;
      newsSection.classList.remove("is-waiting");
      newsHeader?.classList.add("animate");

      // Stagger cards in one by one as section enters viewport
      const cards = newsGrid
        ? Array.from(newsGrid.querySelectorAll(".card"))
        : [];
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add("card-visible"), i * 280);
      });
    };

    // GSAP ScrollTrigger path — most reliable
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      // -YP start
      ScrollTrigger.create({
        trigger: newsGrid || newsSection,
        start: "bottom 25%", // wait until the news cards reach the viewport position shown in the reference
        once: true,
        onEnter: revealNews,
      });
      // -YP end
    } else {
      // Fallback: plain IntersectionObserver
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealNews();
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(newsSection);
    }
  }
});

// ─── Recognition Section Scroll Effect (removed — background fixed as yellow) ───

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
    { threshold: 0.15 }
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
    { threshold: 0.2 }
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
// MOB STICKY BTN — contact-sec ke andar enter hone pe hide karo
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

// ============================================================
// BBT-FA-IMG-SEC — Purple circle (right se) + Title (left se) animation
// ============================================================
(function initImgSecAnimation() {
  const imgSec = document.querySelector(".bbt-FA-img-sec");
  if (!imgSec) return;

  const purpleCircle = imgSec.querySelector(".purple-circle");
  const imgText = imgSec.querySelector(".img-text");
  const mainTitle = imgSec.querySelector(".main-title");

  // Initial states — sab hidden
  if (purpleCircle) {
    gsap.set(purpleCircle, { x: 220, opacity: 0 });
  }
  if (imgText) {
    gsap.set(imgText, { x: -100, opacity: 0 });
  }
  if (mainTitle) {
    gsap.set(mainTitle, { x: -80, opacity: 0 });
  }

  ScrollTrigger.create({
    trigger: imgSec,
    start: "top 75%",
    once: true,
    onEnter: function () {
      // Purple circle — right se slide in + fade in
      if (purpleCircle) {
        gsap.to(purpleCircle, {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
        });
      }
      // img-text heading — left se slide in + fade in
      if (imgText) {
        gsap.to(imgText, {
          x: 0,
          opacity: 1,
          duration: 1.0,
          delay: 0.15,
          ease: "power3.out",
        });
      }
      // main-title paragraph — left se thoda baad mein
      if (mainTitle) {
        gsap.to(mainTitle, {
          x: 0,
          opacity: 1,
          duration: 1.0,
          delay: 0.3,
          ease: "power3.out",
        });
      }
    },
  });
})();
