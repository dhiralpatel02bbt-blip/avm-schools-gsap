gsap.config({ force3D: true });
gsap.registerPlugin(ScrollTrigger);

// ============================================================
// HEADER — Sirf hero section mein dikhta hai, baad mein hide
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

// total horizontal width
const totalWidth = track.scrollWidth - window.innerWidth;

// MAIN TIMELINE
const tl = gsap.timeline({
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

// Bubble section override: center-based overlapping scroll animation
if (typeof tl !== "undefined") {
  tl.scrollTrigger?.kill();
  tl.kill();
  gsap.set(track, { clearProps: "x" });
}

(function initBubbleSectionV2() {
  const section = document.querySelector(".bbt-FA-circle-sec");
  const stickyViewport = section?.querySelector(".sticky-viewport");
  const bubbleTrack = document.getElementById("bubbleTrack");
  const cluster = document.getElementById("circleCluster");
  const bubbleCircles = gsap.utils.toArray(".bbt-FA-circle-sec .circle");
  const connectorSegments = gsap.utils.toArray(
    ".bbt-FA-circle-sec .connector-segment",
  );

  if (
    !section ||
    !stickyViewport ||
    !bubbleTrack ||
    !cluster ||
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
      scale: 0.82,
      autoAlpha: 0.38,
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
      const startInset = fromCircle.offsetWidth / 2 - 4;
      const endInset = toCircle.offsetWidth / 2 - 4;
      const startX = x1 + ux * startInset;
      const startY = y1 + uy * startInset;
      const endX = x2 - ux * endInset;
      const endY = y2 - uy * endInset;

      segment.setAttribute(
        "d",
        `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`,
      );

      const segmentLength = segment.getTotalLength();

      gsap.set(segment, {
        autoAlpha: 0,
        strokeDasharray: segmentLength,
        strokeDashoffset: segmentLength,
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
            strokeDashoffset: 0,
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
