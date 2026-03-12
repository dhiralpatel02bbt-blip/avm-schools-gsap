ScrollTrigger.refresh();
gsap.config({
  force3D: true,
});
gsap.registerPlugin(ScrollTrigger);
// page load animation
gsap.fromTo(
  [".burgundy-bg", ".yellow-circle"],
  { scale: 0.8 },
  {
    scale: 1.1,
    duration: 1,
    ease: "power3.out",
  },
);

// TEXT PAGE LOAD (left → right)
gsap.fromTo(
  ".main-title",
  { x: -150, opacity: 0 },
  {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
  },
);

// ORANGE BAR PAGE LOAD (left → right)
gsap.fromTo(
  ".orange-bg-element",
  { x: -200 },
  {
    x: 0,
    duration: 1,
    ease: "power3.out",
  },
);

// ABOUT ORANGE CIRCLE PAGE LOAD
gsap.fromTo(
  ".orange-circle",
  { y: 120 },
  {
    y: 0,
    duration: 1,
    ease: "power3.out",
  },
);

// ABOUT ORANGE CIRCLE SCROLL
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

// SCROLL ANIMATION
// SCROLL ANIMATION (smooth + responsive safe)
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top bottom",
      end: "top top",
      scrub: 1,
    },
  })
  .fromTo(
    ".burgundy-bg",
    { scale: 1.1 },
    { scale: 0.9, ease: "none" }, // small change instead of 0.4
  )
  .fromTo(".yellow-circle", { y: 250 }, { y: -200, ease: "none" }, 0);

// TEXT SCROLL ANIMATION
gsap.fromTo(
  ".main-title",
  { x: 0 },
  {
    x: -40, // smaller movement
    ease: "none",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
  },
);

// ORANGE BAR SCROLL
gsap.fromTo(
  ".orange-bg-element",
  { x: 0 },
  {
    x: -200,
    ease: "none",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
  },
);

// ABOUT YELLOW SHAPE SCROLL
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

// ABOUT ORANGE CIRCLE SCROLL (rise effect)
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

// PURPLE BAR PAGE LOAD (right → left)
gsap.fromTo(
  ".bbt-dp-about .row",
  { "--purpleMove": "200px" },
  {
    "--purpleMove": "0px",
    duration: 1,
    ease: "power3.out",
  },
);

// PURPLE BAR SCROLL
gsap.fromTo(
  ".bbt-dp-about .row",
  { "--purpleMove": "0px" },
  {
    "--purpleMove": "200px",
    ease: "none",
    scrollTrigger: {
      trigger: ".bbt-dp-about",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
  },
);

// PINNED PANELS EFFECT

// gsap.utils.toArray(".panel").forEach((panel, i) => {
//   if (i === 0) return; // hero skip

//   ScrollTrigger.create({
//     trigger: panel,
//     start: "top top",
//     pin: true,
//     pinSpacing: false,
//   });
// });

// VIDEO SECTION INTERACTION
const videoWrapper = document.querySelector(".video-wrapper");
const video = document.getElementById("mainVideo");
const playBtn = document.getElementById("playBtn");

// Click to play/pause — toggle icon
videoWrapper.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playBtn.innerHTML = `<span class="pause-icon"></span>`;
  } else {
    video.pause();
    playBtn.innerHTML = `<span class="triangle"></span>`;
  }
});

// Cursor follow on hover
videoWrapper.addEventListener("mousemove", (e) => {
  const rect = videoWrapper.getBoundingClientRect();
  const x = e.clientX - rect.left - 40;
  const y = e.clientY - rect.top - 40;
  gsap.to(playBtn, {
    left: x,
    top: y,
    xPercent: 0,
    yPercent: 0,
    duration: 0.4,
    ease: "power2.out",
    overwrite: "auto",
  });
});

// Reset to center when mouse leaves
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

// ── VIDEO REVEAL: pill → full screen ─────────────────────────────────────
// 1. Pin the wrapper for 200vh of scroll
ScrollTrigger.create({
  trigger: ".video-section",
  start: "top top",
  end: "+=200%",
  pin: ".video-wrapper",
  pinSpacing: false,
  anticipatePin: 1,
});

// 2. Expand clip-path from small pill to full screen
gsap.fromTo(
  ".video-container",
  { clipPath: "inset(35% 25% 35% 25% round 0px)" },
  {
    clipPath: "inset(0% 0% 0% 0% round 0px)",
    ease: "none",
    scrollTrigger: {
      trigger: ".video-section",
      start: "top top",
      end: "+=200%",
      scrub: 1.5,
    },
  },
);

// 3. Parallax on the video itself (moves up as clip expands)
gsap.fromTo(
  ".bg-video",
  { y: "8%" },
  {
    y: "-8%",
    ease: "none",
    scrollTrigger: {
      trigger: ".video-section",
      start: "top top",
      end: "+=200%",
      scrub: 2,
    },
  },
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
