gsap.config({ force3D: true });
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// HEADER — Sirf hero section mein dikhta hai, baad mein hide
// ============================================================
const header = document.querySelector("header");
const heroSection = document.querySelector(".bbt-dp-hero");

if (header && heroSection) {
  window.addEventListener("scroll", () => {
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.scrollY > heroBottom - 100) {
      gsap.to(header, {
        opacity: 0,
        y: -80,
        duration: 0.4,
        ease: "power2.in",
        overwrite: "auto",
      });
    } else {
      gsap.to(header, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  });
}

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
  var campusText = campusSection.querySelector(".body-txt");
  var campusHalfCircle = campusSection.querySelector(".half-circle");

  var isDesktop = window.innerWidth >= 768;

  var loadTL = null;
  var horizontalTween = null;
  var sliderShown = false;
  var activeSlideIndex = -1;

  // ─────────────────────────────────────────────────────────
  // Slide caption animation
  // Yellow circle comes from bottom-left, text fades in after
  // ─────────────────────────────────────────────────────────
  function animateSlide(index, immediate) {
    if (!campusSlides.length) return;

    campusSlides.forEach(function (slide, slideIndex) {
      var c = slide.querySelector(".campus-slide-circle");
      var t = slide.querySelector(".campus-slide-text");
      if (!c || !t) return;
      gsap.killTweensOf([c, t]);
      if (slideIndex !== index) {
        gsap.set(c, { x: -110, y: 110, autoAlpha: 0 });
        gsap.set(t, { x: -28, autoAlpha: 0 });
      }
    });

    var active = campusSlides[index];
    var c = active && active.querySelector(".campus-slide-circle");
    var t = active && active.querySelector(".campus-slide-text");
    if (!c || !t) return;

    var d = immediate ? 0 : 0.1;
    gsap.to(c, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: "power3.out",
      delay: d,
      overwrite: true,
    });
    gsap.to(t, {
      x: 0,
      autoAlpha: 1,
      duration: 0.75,
      ease: "power3.out",
      delay: d + 0.7,
      overwrite: true,
    });
  }

  // ─────────────────────────────────────────────────────────
  // Swiper init
  // ─────────────────────────────────────────────────────────
  function setActiveSlide(index, immediate) {
    if (!campusSlides.length) return;
    var safeIndex = Math.max(0, Math.min(index, campusSlides.length - 1));
    if (safeIndex === activeSlideIndex && !immediate) return;
    activeSlideIndex = safeIndex;
    animateSlide(safeIndex, immediate);
  }

  function buildHorizontalTween() {
    if (!campusTrack || !campusViewport) return null;

    var maxShift = Math.max(
      campusTrack.scrollHeight - campusViewport.offsetHeight,
      0,
    );
    return gsap.to(campusTrack, {
      y: -maxShift,
      ease: "none",
      paused: true,
      overwrite: true,
    });
  }

  function resetHorizontalTrack() {
    if (horizontalTween) horizontalTween.progress(0);
    if (campusTrack) gsap.set(campusTrack, { y: 0 });
    if (campusScroller) campusScroller.scrollTop = 0;
    setActiveSlide(0, true);
  }

  function updateHorizontalTrack(progress) {
    if (!campusTrack || !campusSlides.length) return;
    if (!horizontalTween) horizontalTween = buildHorizontalTween();
    if (!horizontalTween) return;

    horizontalTween.progress(progress);
    var nextIndex = Math.round(progress * (campusSlides.length - 1));
    setActiveSlide(nextIndex, false);
  }

  // ─────────────────────────────────────────────────────────
  // Show / hide slider
  // ─────────────────────────────────────────────────────────
  function showSlider() {
    if (sliderShown) return;
    sliderShown = true;
    campusSliderShell.style.pointerEvents = "auto";
    gsap.to(campusSliderShell, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
    });
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

  // ─────────────────────────────────────────────────────────
  // MOBILE — no scroll magic, show everything flat
  // ─────────────────────────────────────────────────────────
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
      var c = slide.querySelector(".campus-slide-circle");
      var t = slide.querySelector(".campus-slide-text");
      if (c) gsap.set(c, { clearProps: "all" });
      if (t) gsap.set(t, { clearProps: "all" });
    });
    return;
  }

  // ─────────────────────────────────────────────────────────
  // DESKTOP — initial hidden states
  // ─────────────────────────────────────────────────────────
  gsap.set(campusText, { autoAlpha: 0, x: -96, filter: "blur(14px)" });
  gsap.set(campusHalfCircle, { xPercent: -22 });
  gsap.set(campusSliderShell, { autoAlpha: 0 });
  campusSliderShell.style.pointerEvents = "none";
  if (campusTrack) gsap.set(campusTrack, { y: 0 });
  setActiveSlide(0, true);

  // ─────────────────────────────────────────────────────────
  // PHASE 1 — page load: circle slides in, then text slides in
  // ─────────────────────────────────────────────────────────
  function playLoadAnim() {
    if (!campusText || loadTL) return;
    loadTL = gsap.timeline({ delay: 0.2 });

    if (campusHalfCircle) {
      loadTL.to(
        campusHalfCircle,
        {
          xPercent: 0,
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
      0.4,
    );
  }

  if (document.readyState === "complete") {
    requestAnimationFrame(playLoadAnim);
  } else {
    window.addEventListener("load", playLoadAnim, { once: true });
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
  // PHASE 2 + 3: campusViewport ko pin karo 300vh ke liye
  // Phase 2 (0→0.33): text + circle exit
  // Phase 3 (0.33→0.67): slider slides change
  // Phase 4 (0.67→1.00): dev section fixed position se neeche se slide up
  // ─────────────────────────────────────────────────────────

  var SLIDER_THRESHOLD = 0.5;

  // Development section dhundho
  var devSec = document.querySelector(".development-sec");

  // Dev section ko position:fixed karke screen ke bilkul neeche rakho
  // taaki pin ke dauran smooth slide ho sake
  function setDevFixed() {
    if (!devSec) return;
    devSec.style.position = "fixed";
    devSec.style.bottom = "0";
    devSec.style.left = "0";
    devSec.style.width = "100%";
    devSec.style.zIndex = "10";
    devSec.style.top = "auto";
    gsap.set(devSec, { y: "100%" });
  }

  function setDevNormal() {
    if (!devSec) return;
    devSec.style.position = "relative";
    devSec.style.bottom = "auto";
    devSec.style.top = "auto";
    devSec.style.left = "auto";
    devSec.style.width = "";
    gsap.set(devSec, { y: 0 });
  }

  if (devSec) {
    setDevFixed();
  }

  // Dev section ke liye placeholder — taaki neeche ka content sahi jagah rahe
  var devPlaceholder = null;
  if (devSec && devSec.parentNode) {
    devPlaceholder = document.createElement("div");
    devPlaceholder.style.height = devSec.offsetHeight + "px";
    devPlaceholder.style.display = "none"; // initially hidden
    devSec.parentNode.insertBefore(devPlaceholder, devSec);
  }

  // Header fixed rakho
  var siteHeader = document.querySelector("header.header");
  if (siteHeader) {
    siteHeader.style.setProperty("z-index", "1000", "important");
    siteHeader.style.setProperty("position", "fixed", "important");
    siteHeader.style.setProperty("top", "0", "important");
    siteHeader.style.setProperty("left", "0", "important");
    siteHeader.style.setProperty("width", "100%", "important");
    siteHeader.style.setProperty("opacity", "1", "important");
    siteHeader.style.setProperty("visibility", "visible", "important");
    siteHeader.style.setProperty("transform", "none", "important");
  }

  var pinActive = true; // track karo pin chal raha hai ya nahi

  // campusViewport pin karo — 300vh scroll space
  ScrollTrigger.create({
    trigger: campusViewport,
    start: "top top",
    end: "+=300%",
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onRefresh: function () {
      horizontalTween = buildHorizontalTween();
      if (devSec && pinActive) {
        devSec.style.position = "fixed";
      }
    },
    onUpdate: function (self) {
      var p = self.progress;

      // Phase 2 (0 → 0.33): exit text + circle
      var exitP = Math.min(p / 0.33, 1);
      exitTL.progress(exitP);

      // Phase 3 (0.33 → 0.67): slider slides
      if (p >= 0.33 && p < 0.67) {
        showSlider();
        var sliderP = (p - 0.33) / 0.34;
        updateHorizontalTrack(Math.min(sliderP, 1));
      } else if (p < 0.33) {
        hideSlider();
      }

      // Phase 4 (0.67 → 1.0): dev section neeche se slide up
      if (devSec) {
        if (p >= 0.67) {
          var slideP = (p - 0.67) / 0.33; // 0 → 1
          // y: 100% (pura neeche) → y: 0% (apni jagah)
          var yPct = (1 - Math.min(slideP, 1)) * 100;
          gsap.set(devSec, { yPercent: yPct });
        } else {
          gsap.set(devSec, { yPercent: 100 });
        }
      }
    },
    onLeave: function () {
      pinActive = false;
      // Pin khatam — dev section ko normal flow mein wapas laao
      if (devSec && devPlaceholder) {
        devPlaceholder.style.display = "block";
        devPlaceholder.style.height = devSec.offsetHeight + "px";
        setDevNormal();
      }
      showSlider();
    },
    onEnterBack: function () {
      pinActive = true;
      // Wapis scroll pe dev section fixed karo
      if (devSec && devPlaceholder) {
        devPlaceholder.style.display = "none";
        setDevFixed();
      }
    },
  });

  window.addEventListener("resize", function () {
    horizontalTween = null;
    if (devPlaceholder && devSec) {
      devPlaceholder.style.height = devSec.offsetHeight + "px";
    }
    ScrollTrigger.refresh();
  });
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
      clipPath: "inset(10% 11% 0% 11%)",
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

// Recognition section
gsap.from(".section-title", {
  y: -80,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".recognition-sec",
    start: "top 80%",
  },
});

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

// Image parallax
gsap.to(".contact-sec .image-container", {
  y: -80,
  ease: "none",
  scrollTrigger: {
    trigger: ".contact-sec",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

// Form validation
const form = document.querySelector(".apply-form");

form.addEventListener("submit", function (e) {
  const name = form.querySelector('input[name="name"]').value;
  const phone = form.querySelector('input[name="phone"]').value;
  const email = form.querySelector('input[name="email"]').value;

  if (!name || !phone || !email) {
    e.preventDefault();
    alert("Please fill all fields");
  }
});

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

// // bubble section
// (function initBubbleSection() {
//   const section = document.querySelector(".bbt-FA-circle-sec");
//   if (!section) return;

//   const track = document.getElementById("bubbleTrack");
//   const cluster = document.getElementById("circleCluster");

//   function updateScroll() {
//     const rect = section.getBoundingClientRect();
//     const sectionH = section.offsetHeight;
//     const viewH = window.innerHeight;

//     // progress 0→1 as we scroll through the section
//     const scrolled = -rect.top;
//     const scrollMax = sectionH - viewH;
//     const progress = Math.min(Math.max(scrolled / scrollMax, 0), 1);

//     // Start: cluster center aligned to right edge of screen
//     // End: cluster center aligned to left edge of screen
//     const clusterW = cluster.offsetWidth; // ~980px
//     const startX = window.innerWidth; // fully off-screen right
//     const endX = -clusterW; // fully off-screen left
//     const currentX = startX + (endX - startX) * progress;

//     track.style.transform = `translateX(${currentX}px)`;
//   }

//   window.addEventListener("scroll", updateScroll, { passive: true });
//   window.addEventListener("resize", updateScroll);
//   updateScroll();
// })();
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

// ------------------- Our school page hero section

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

  var nodes = [".node1", ".node2", ".node3", ".node4", ".node5", ".node6"].map(
    function (s) {
      return diagramSec.querySelector(s);
    },
  );
  var labels = [
    ".label.top",
    ".label.right-top",
    ".label.right-mid",
    ".label.bottom",
    ".label.left-bottom",
    ".label.left-mid",
  ].map(function (s) {
    return diagramSec.querySelector(s);
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
      if (l) gsap.set(l, { opacity: 0.25 });
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
        if (labels[i - 1])
          scrollTL.to(
            labels[i - 1],
            { opacity: 0.22, y: 0, duration: slice * 0.22 },
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
      if (labels[i]) {
        scrollTL.to(
          labels[i],
          { opacity: 1, y: -8, duration: slice * 0.38, ease: "power3.out" },
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
