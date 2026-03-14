gsap.config({ force3D: true });
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// HEADER — Sirf hero section mein dikh ta hai, baad mein hide
// ============================================================
const header = document.querySelector("header");
const heroSection = document.querySelector(".bbt-dp-hero");

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

// ============================================================
// INITIAL STATES — Page load pe yeh positions hongi
// ============================================================

// Burgundy BG — adha left mein
gsap.set(".burgundy-bg", { x: -220 });

// Yellow circle — aur neeche (screen ke bahar se thoda andar)
gsap.set(".yellow-circle", { y: 380 });

// Text — spans ko individually hide karo, hero overflow ke andar
// Opacity 0 + translateX se animate hoga, clip nahi hoga
gsap.set(".main-title .line1", { xPercent: -150, opacity: 0 });
gsap.set(".main-title .line2", { xPercent: -150, opacity: 0 });
gsap.set(".main-title .line3", { xPercent: -150, opacity: 0 });

// Orange bar — hidden
gsap.set(".orange-bg-element", { x: -300, opacity: 0 });

// Students — right side mein, thoda cut hoga (x: +200)
gsap.set(".hero-student-img", { x: 200 });

// ============================================================
// SCROLL ANIMATION — Hero section pin + scrub
// ============================================================

const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".bbt-dp-hero",
    start: "top top",
    end: "+=900",
    scrub: 1.2,
    pin: true,
    anticipatePin: 1,
  },
});

heroTL
  // Burgundy BG — left se right
  .to(
    ".burgundy-bg",
    {
      x: 0,
      duration: 3,
      ease: "power2.out",
    },
    0,
  )

  // Yellow circle — neeche se upar (final: y:0)
  .to(
    ".yellow-circle",
    {
      y: 0,
      duration: 3,
      ease: "power2.out",
    },
    0,
  )

  // Students — right se left (final: x:0)
  .to(
    ".hero-student-img",
    {
      x: 0,
      duration: 3,
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
      duration: 2,
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
      duration: 2,
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
      duration: 2,
      ease: "power3.out",
    },
    0.6,
  )

  // Line 3 "for the world."
  .to(
    ".main-title .line3",
    {
      xPercent: 0,
      opacity: 1,
      duration: 2,
      ease: "power3.out",
    },
    0.9,
  );

// ============================================================
// ABOUT SECTION
// ============================================================
gsap.fromTo(
  ".orange-circle",
  { y: 0 },
  {
    y: -200,
    ease: "none",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  },
);

gsap.fromTo(
  ".yellow-shape",
  { y: 0 },
  {
    y: 120,
    ease: "none",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
  },
);

gsap.fromTo(
  ".about-img",
  { y: 0 },
  {
    y: -200,
    ease: "none",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  },
);

gsap.fromTo(
  ".bbt-dp-about .row",
  { "--purpleMove": "200px" },
  {
    "--purpleMove": "0px",
    ease: "none",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
  },
);

gsap.fromTo(
  ".about-paragraph p",
  { y: 50, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top 75%",
      toggleActions: "play none none none",
    },
  },
);

gsap.fromTo(
  ".about-paragraph .secondary-btn",
  { y: 30, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.3,
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top 75%",
      toggleActions: "play none none none",
    },
  },
);

gsap.fromTo(
  ".bbt-dp-about .about-img img.kid",
  { y: 60, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  },
);

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

// ── Cursor-following play button ─────────────────────────────────
videoWrapper.addEventListener("mousemove", (e) => {
  const rect = document
    .querySelector(".video-container")
    .getBoundingClientRect();
  const overlayOpacity = parseFloat(
    getComputedStyle(document.querySelector(".video-section .overlay")).opacity,
  );
  if (overlayOpacity < 0.3) return;
  const x = e.clientX - rect.left - 45;
  const y = e.clientY - rect.top - 45;
  gsap.to(playBtn, {
    left: x,
    top: y,
    xPercent: 0,
    yPercent: 0,
    duration: 0.35,
    ease: "power2.out",
    overwrite: "auto",
  });
});

videoWrapper.addEventListener("mouseleave", () => {
  gsap.to(playBtn, {
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    duration: 0.5,
    ease: "power3.out",
  });
});

// ── PHASE 1: Square → Rectangle (BEFORE reaching viewport) ───────
gsap.fromTo(
  ".video-container",
  { clipPath: "inset(40% 44% 40% 44%)" },
  {
    clipPath: "inset(10% 3% 0% 3%)",
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
