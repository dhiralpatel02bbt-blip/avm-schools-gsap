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

gsap.utils.toArray(".panel").forEach((panel, i) => {
  if (i === 0) return; // hero skip

  ScrollTrigger.create({
    trigger: panel,
    start: "top top",
    pin: true,
    pinSpacing: false,
  });
});

// VIDEO SECTION INTERACTION
const videoWrapper = document.querySelector(".video-wrapper");
const video = document.getElementById("mainVideo");
const playBtn = document.getElementById("playBtn");

// show play button
videoWrapper.addEventListener("mouseenter", () => {
  playBtn.classList.add("visible");
});

// hide play button
videoWrapper.addEventListener("mouseleave", () => {
  playBtn.classList.remove("visible");
});

// follow cursor
videoWrapper.addEventListener("mousemove", (e) => {
  const rect = videoWrapper.getBoundingClientRect();

  const x = e.clientX - rect.left - playBtn.clientWidth / 2;
  const y = e.clientY - rect.top - playBtn.clientHeight / 2;

  playBtn.style.left = x + "px";
  playBtn.style.top = y + "px";
});

// play / pause video
videoWrapper.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playBtn.style.opacity = "0";
  } else {
    video.pause();
    playBtn.style.opacity = "1";
  }
});

// ⭐ VIDEO SMOOTH SCROLL ZOOM
gsap.to(".video-wrapper", {
  scale: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".video-section",
    start: "top center",
    end: "bottom top",
    scrub: true,
  },
});

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
