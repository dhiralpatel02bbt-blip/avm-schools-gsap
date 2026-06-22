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
  var diagramTab = document.querySelector("section.diagram-tab");
  if (!stage || !campusSec || !diagramSec) return;

  var halfCircle = campusSec.querySelector(".half-circle");
  var panelKicker = campusSec.querySelector(".panel-kicker");
  var panelTitle = campusSec.querySelector(".panel-title");
  var panelBody = campusSec.querySelector(".panel-body");
  var heroImage = campusSec.querySelector(".img-full");
  var heroGlowCircle = campusSec.querySelector(".hero-glow-circle");
  var isTabDiagram = window.matchMedia("(max-width: 1023px)").matches;
  var isStaticHeroDiagram = window.matchMedia("(max-width: 991.98px)").matches;

  var nodes = [
    ".node2",
    ".node3",
    ".node4",
    ".node5",
    ".node7",
    ".node6",
    ".node1",
  ].map(function (s) {
    return diagramSec.querySelector(s);
  });
  var labels = [
    ".label.right-top",
    ".label.right-mid",
    ".label.bottom",
    ".label.left-bottom",
    ".label.left-lower",
    ".label.left-mid",
    ".label.top",
  ].map(function (s) {
    return diagramSec.querySelector(s);
  });
  var labelTitles = labels.map(function (label) {
    return label ? label.querySelector(".strong") : null;
  });
  var labelBodies = labels.map(function (label) {
    return label ? label.querySelector("p:not(.strong)") : null;
  });

  // ── Immediately hide text so there's no flash before init() ──
  if (isStaticHeroDiagram) {
    gsap.set([panelKicker, panelTitle, panelBody].filter(Boolean), {
      opacity: 1,
      x: 0,
      visibility: "visible",
      clearProps: "transform",
    });
    if (halfCircle) {
      gsap.set(halfCircle, {
        x: 0,
        scale: 1,
        opacity: 1,
        visibility: "visible",
        clearProps: "transform",
      });
    }
    if (heroGlowCircle) {
      gsap.set(heroGlowCircle, {
        opacity: 1,
        scale: 1,
        visibility: "visible",
        clearProps: "transform",
      });
    }
    gsap.set(diagramSec, {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
    });
    if (diagramTab) {
      gsap.set(diagramTab, {
        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",
        clearProps: "transform",
      });
      gsap.set(".diagram-tab .title-txt, .diagram-tab .circle-card", {
        opacity: 1,
        visibility: "visible",
        scale: 1,
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        clearProps: "transform",
      });
    }
    return;
  }

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
  if (isTabDiagram && diagramTab) {
    diagramTab.style.opacity = "0";
    diagramTab.style.visibility = "hidden";
    diagramTab.style.pointerEvents = "none";
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
    // Diagram center and orbit — hidden for scroll-reveal
    var diagramCenter = diagramSec.querySelector(".center");
    var diagramOrbit = diagramSec.querySelector(".orbit");
    if (diagramCenter)
      gsap.set(diagramCenter, {
        opacity: 0,
        scale: 0.6,
        transformOrigin: "50% 50%",
      });
    if (diagramOrbit)
      gsap.set(diagramOrbit, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: "50% 50%",
      });

    // Circle: fully off-screen left
    if (halfCircle) {
      gsap.set(halfCircle, {
        x: -(circleW * 0.5) - 300,
        scale: 1,
        transformOrigin: "center center",
        force3D: true,
      });
    }

    // Text elements: invisible + shifted left
    if (panelKicker)
      gsap.set(panelKicker, { opacity: 0, x: -60, visibility: "visible" });
    if (panelTitle)
      gsap.set(panelTitle, { opacity: 0, x: -60, visibility: "visible" });
    if (panelBody)
      gsap.set(panelBody, { opacity: 0, x: -60, visibility: "visible" });
    if (heroGlowCircle)
      gsap.set(heroGlowCircle, {
        opacity: 0,
        scale: 0.7,
        visibility: "visible",
      });

    if (isTabDiagram && diagramTab) {
      var tabCards = gsap.utils.toArray(".diagram-tab .circle-card");
      var tabTitle = diagramTab.querySelector(".title-txt");

      gsap.set(diagramSec, {
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
      });
      gsap.set(diagramTab, {
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
      });
      if (tabTitle) {
        gsap.set(tabTitle, { autoAlpha: 0, y: 24 });
      }
      gsap.set(tabCards, {
        autoAlpha: 0,
        scale: 0.22,
        xPercent: -50,
        yPercent: -50,
        y: 46,
        transformOrigin: "50% 50%",
      });

      var tabLoadTL = gsap.timeline({
        delay: 0.3,
        onComplete: function () {
          tabLoadTL = null;
        },
      });

      if (halfCircle) {
        tabLoadTL.to(
          halfCircle,
          {
            x: -(circleW * 0.5),
            duration: 1.1,
            ease: "power3.out",
            force3D: true,
          },
          0,
        );
      }
      if (heroGlowCircle) {
        tabLoadTL.to(
          heroGlowCircle,
          {
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.6)",
          },
          0.3,
        );
      }
      if (panelTitle) {
        tabLoadTL.to(
          panelTitle,
          { opacity: 1, x: 0, duration: 0.85, ease: "power3.out" },
          0.5,
        );
      }
      if (panelBody) {
        tabLoadTL.to(
          panelBody,
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          0.7,
        );
      }
      if (panelKicker) {
        tabLoadTL.to(
          panelKicker,
          { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
          0.9,
        );
      }

      var tabScrollTL = gsap.timeline({ paused: true });

      if (halfCircle) {
        tabScrollTL.fromTo(
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
            duration: 0.32,
            force3D: true,
          },
          0,
        );
      }

      if (heroGlowCircle)
        tabScrollTL.to(heroGlowCircle, { opacity: 0, duration: 0.18 }, 0.01);
      if (panelKicker)
        tabScrollTL.fromTo(
          panelKicker,
          { opacity: 1, x: 0 },
          { opacity: 0, x: -30, duration: 0.16 },
          0.02,
        );
      if (panelTitle)
        tabScrollTL.fromTo(
          panelTitle,
          { opacity: 1, x: 0 },
          { opacity: 0, x: -40, duration: 0.18 },
          0.05,
        );
      if (panelBody)
        tabScrollTL.fromTo(
          panelBody,
          { opacity: 1, x: 0 },
          { opacity: 0, x: -30, duration: 0.16 },
          0.08,
        );

      tabScrollTL
        .set(diagramTab, { visibility: "visible", pointerEvents: "auto" }, 0.36)
        .to(
          diagramTab,
          { opacity: 1, duration: 0.08, ease: "power2.out" },
          0.38,
        );

      if (tabTitle) {
        tabScrollTL.to(
          tabTitle,
          { autoAlpha: 1, y: 0, duration: 0.12, ease: "power3.out" },
          0.42,
        );
      }

      var cardStart = 0.48;
      var cardSlice = tabCards.length ? 0.48 / tabCards.length : 0;

      tabCards.forEach(function (card, index) {
        var start = cardStart + index * cardSlice;

        if (index > 0) {
          tabScrollTL.to(
            tabCards[index - 1],
            {
              autoAlpha: 0,
              scale: 0.86,
              y: -34,
              duration: cardSlice * 0.28,
              ease: "power2.in",
            },
            start,
          );
        }

        tabScrollTL.to(
          card,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: cardSlice * 0.55,
            ease: "back.out(1.45)",
          },
          start + cardSlice * 0.12,
        );
      });

      tabScrollTL.to({}, { duration: 0.12 });

      var tabSpacer = document.createElement("div");
      tabSpacer.style.height =
        window.innerHeight * (tabCards.length + 2) + "px";
      stage.parentNode.insertBefore(tabSpacer, stage.nextSibling);

      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: function () {
          return "+=" + window.innerHeight * (tabCards.length + 3);
        },
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        scrub: 1.05,
        animation: tabScrollTL,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (self.progress > 0.001 && tabLoadTL) {
            tabLoadTL.kill();
            tabLoadTL = null;
          }
        },
      });

      return;
    }

    // Diagram: hidden
    // -YP start
    gsap.set(diagramSec, {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
    });

    // Nodes dim (initially fully hidden)
    nodes.forEach(function (n) {
      if (n) {
        gsap.set(n, {
          width: 22,
          height: 22,
          opacity: 0,
          transformOrigin: "50% 50%",
          force3D: false,
        });
      }
    });
    labels.forEach(function (l) {
      if (l) gsap.set(l, { opacity: 0, y: 0 });
    });
    // -YP end
    labelTitles.forEach(function (title) {
      if (title) gsap.set(title, { opacity: 0 });
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

    var loadTL = gsap.timeline({
      delay: 0.3,
      onComplete: function () {
        loadTL = null;
      },
    });

    // 1. Blue half-circle slides in from fully off-screen left
    if (halfCircle) {
      loadTL.to(
        halfCircle,
        {
          x: -(circleW * 0.5),
          duration: 1.1,
          ease: "power3.out",
          force3D: true,
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
        0.3,
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
        0.5,
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
        0.7,
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
        0.9,
      );
    }

    // ── Step 3: Scroll timeline (paused, scrubbed) ───────
    //
    // 0.00→0.35  Circle scale:1 → scale:14  (floods full viewport)
    // 0.02→0.20  Hero image + glow + text fade out
    // 0.48       diagram-sec visibility:visible
    // 0.50→0.56  Diagram fades in over blue bg
    // 0.56→1.00  Nodes highlight one by one

    // -YP start
    var scrollTL = gsap.timeline({ paused: true });

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
          duration: 0.5,
          force3D: true,
        },
        0,
      );
    }

    if (heroGlowCircle)
      scrollTL.to(heroGlowCircle, { opacity: 0, duration: 0.2 }, 0.05);
    if (panelKicker)
      scrollTL.fromTo(
        panelKicker,
        { opacity: 1, x: 0 },
        { opacity: 0, x: -30, duration: 0.2 },
        0.05,
      );
    if (panelTitle)
      scrollTL.fromTo(
        panelTitle,
        { opacity: 1, x: 0 },
        { opacity: 0, x: -40, duration: 0.2 },
        0.1,
      );
    if (panelBody)
      scrollTL.fromTo(
        panelBody,
        { opacity: 1, x: 0 },
        { opacity: 0, x: -30, duration: 0.2 },
        0.1,
      );

    // Diagram reveal
    scrollTL.set(
      diagramSec,
      { visibility: "visible", pointerEvents: "auto" },
      0.5,
    );
    scrollTL.to(
      diagramSec,
      { opacity: 1, duration: 0.1, ease: "power2.out" },
      0.5,
    );
    // -YP start
    // 1. Center and Orbit grow FIRST (slowly on scroll)
    if (diagramCenter) {
      scrollTL.to(
        diagramCenter,
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
        0.5,
      );
    }
    if (diagramOrbit) {
      scrollTL.to(
        diagramOrbit,
        { opacity: 0.95, scale: 1, duration: 0.3, ease: "power2.out" },
        0.55,
      );
    }

    // 2. THEN Nodes and Labels appear as dim elements once center/orbit are fully grown
    // -YP start
    nodes.forEach(function (n) {
      if (n)
        scrollTL.to(
          n,
          { opacity: 1, duration: 0.05, ease: "power2.out" },
          0.85,
        );
    });
    // -YP end
    labels.forEach(function (l) {
      if (l)
        scrollTL.to(
          l,
          { opacity: 1, duration: 0.05, ease: "power2.out" },
          0.85,
        );
    });
    labelTitles.forEach(function (t) {
      if (t)
        scrollTL.to(
          t,
          { opacity: 0.35, duration: 0.05, ease: "power2.out" },
          0.85,
        );
    });

    var SMALL = 22,
      BIG = 44,
      TOTAL = nodes.length;
    var slice = 0.55 / TOTAL; // 0.90 to 1.45 is 0.55
    // -YP end

    for (var i = 0; i < TOTAL; i++) {
      var s = 0.9 + i * slice;
      var mid = s + slice * 0.15;
      var end = s + slice * 0.85;

      if (i > 0 && nodes[i - 1]) {
        // -YP start
        scrollTL.to(
          nodes[i - 1],
          {
            width: SMALL,
            height: SMALL,
            opacity: 1,
            boxShadow: "none",
            duration: slice * 0.28,
            ease: "power2.in",
          },
          s,
        );
        // -YP end
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
            boxShadow: "none",
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
          { boxShadow: "none", duration: slice * 0.3, ease: "power2.in" },
          end - slice * 0.2,
        );
      }
    }

    scrollTL.to({}, { duration: 0.333 });
    // -YP end

    // ── Inject bottom fade div (shown only after last node animates) ──
    var fadeDiv = document.createElement("div");
    fadeDiv.className = "diagram-bottom-fade";
    stage.appendChild(fadeDiv);

    var desktopSpacer = document.createElement("div");
    desktopSpacer.style.height = "500vh";
    stage.parentNode.insertBefore(desktopSpacer, stage.nextSibling);

    // ── Pin stage + scrub ────────────────────────────────
    ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "+=600%",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      scrub: 0.8,
      animation: scrollTL,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        if (self.progress > 0.001 && loadTL) {
          loadTL.kill();
          loadTL = null;
        }
        // Show fade only after last node has animated
        if (self.progress >= 0.81) {
          fadeDiv.classList.add("visible");
        } else {
          fadeDiv.classList.remove("visible");
        }
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

// --------- tabbing section sticky tabs (JS-driven, CSS sticky unreliable with GSAP pinning)
(function initStickyTabs() {
  if (!document.querySelector("body.pedagogy-page")) return;

  var tabbingSec = document.querySelector(".tabbing-sec");
  var stickyBar = document.querySelector(".tabs-sticky-bar");
  if (!tabbingSec || !stickyBar) return;

  var barHeight = 0;
  var placeholder = document.createElement("div");
  placeholder.style.display = "none";
  stickyBar.parentNode.insertBefore(placeholder, stickyBar.nextSibling);

  function update() {
    barHeight = stickyBar.offsetHeight;
    if (stickyBar.style.position !== "fixed") {
      barOffsetInSection =
        stickyBar.getBoundingClientRect().top -
        tabbingSec.getBoundingClientRect().top;
    }

    var sectionTop = tabbingSec.offsetTop;
    var sectionBottom = sectionTop + tabbingSec.offsetHeight;
    var barTop = sectionTop + barOffsetInSection;

    // Stick only after the tab bar reaches the top in its natural flow.
    // This prevents pinning while the tabbing section is still entering.
    var shouldBeSticky =
      window.scrollY >= barTop - 8 &&
      window.scrollY < sectionBottom - barHeight;

    if (shouldBeSticky) {
      if (stickyBar.style.position !== "fixed") {
        placeholder.style.display = "block";
        placeholder.style.height = barHeight + "px";

        stickyBar.style.position = "fixed";
        stickyBar.style.top = "0";
        stickyBar.style.left = "0";
        stickyBar.style.width = "100%";
        stickyBar.style.zIndex = "200";
      }
    } else {
      // Reset to normal flow — covers both:
      // (a) scrolled back UP above the section (secTop > 0)
      // (b) scrolled past the bottom of the section
      if (stickyBar.style.position === "fixed") {
        placeholder.style.display = "none";
        stickyBar.style.position = "";
        stickyBar.style.top = "";
        stickyBar.style.left = "";
        stickyBar.style.width = "";
        stickyBar.style.zIndex = "";
      }
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
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
    const targetContent = document.getElementById(target);
    targetContent.classList.add("active");

    requestAnimationFrame(() => {
      const stickyBar = document.querySelector(".tabs-sticky-bar");
      const stickyOffset = stickyBar ? stickyBar.offsetHeight : 0;
      const contentTop =
        targetContent.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, contentTop - stickyOffset),
        behavior: "auto",
      });
    });
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

    if (window.innerWidth < 992) {
      diagram.classList.remove("is-scroll-animated");
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
    const svg = path.ownerSVGElement;
    const viewBox = svg.viewBox.baseVal;
    const svgRect = svg.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const scale = Math.min(
      svgRect.width / viewBox.width,
      svgRect.height / viewBox.height,
    );
    const renderedWidth = viewBox.width * scale;
    const renderedHeight = viewBox.height * scale;
    const offsetX =
      svgRect.left - wrapperRect.left + (svgRect.width - renderedWidth) / 2;
    const offsetY =
      svgRect.top - wrapperRect.top + (svgRect.height - renderedHeight) / 2;

    dots.forEach((dot, index) => {
      const point = path.getPointAtLength((index / (dots.length - 1)) * length);
      dot.style.left = `${offsetX + (point.x - viewBox.x) * scale}px`;
      dot.style.top = `${offsetY + (point.y - viewBox.y) * scale}px`;
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
      xPercent: -50,
      yPercent: -50,
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
// PEDAGOGY — Wipe Mask Reveal  (AYM + AVM image columns)
//
// WHY PREVIOUS ATTEMPTS FAILED:
//   • CSS had opacity:0 + translateX on .aym-img-col / .avm-img-col
//     but we kept overriding them with opacity:1 !important which
//     made images instantly visible — wipe had nothing to reveal.
//   • IntersectionObserver that adds .in-view never actually fires
//     (DOMContentLoaded already passed when script.js loads at
//     bottom of <body>), so those columns stay opacity:0 via CSS.
//
// CORRECT FLOW:
//   1. Immediately wrap <img> in a clip-path mask div (sync,
//      at parse time) — before anything else can show the image.
//   2. After window.load + 300ms, register ScrollTrigger.
//   3. On enter: gsap.set col to opacity:1, then wipe mask open.
//   NO !important overrides. NO touching the CSS opacity rules.
// ============================================================

(function initPedagogyWipeMasks() {
  if (!document.querySelector("body.pedagogy-page")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function wrapNow(colSelector, maskClass, direction) {
    var col = document.querySelector(colSelector);
    if (!col) return;
    var img = col.querySelector("img");
    if (!img || col.querySelector("." + maskClass)) return;

    var transformOrigin = direction === "rtl" ? "right center" : "left center";

    var mask = document.createElement("div");
    mask.className = maskClass;
    // Hide synchronously with visibility to prevent flash, GSAP will reveal it
    mask.style.cssText =
      "display:block;overflow:hidden;visibility:hidden;will-change:clip-path;";
    img.style.cssText +=
      ";transform-origin:" + transformOrigin + ";will-change:transform;";
    img.parentNode.insertBefore(mask, img);
    mask.appendChild(img);

    // Disable CSS transition on col immediately so it doesn't fight GSAP
    col.style.transition = "none";
    col.style.opacity = "1";
    col.style.transform = "none";
  }

  wrapNow(".aym-section .aym-img-col", "aym-img-mask", "ltr");
  wrapNow(".avm-section .avm-img-col", "avm-img-mask", "rtl");

  function registerWipe(colSelector, maskClass, direction) {
    var col = document.querySelector(colSelector);
    if (
      !col ||
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined"
    )
      return;

    var mask = col.querySelector("." + maskClass);
    if (!mask) return;
    var img = mask.querySelector("img");

    var startClip =
      direction === "rtl" ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";

    // Foolproof fromTo pattern guarantees start and end states
    gsap.fromTo(
      mask,
      { clipPath: startClip, autoAlpha: 1 }, // autoAlpha removes visibility:hidden
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: col,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      },
    );

    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.06 },
        {
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: col,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        },
      );
    }
  }

  function init() {
    registerWipe(".aym-section .aym-img-col", "aym-img-mask", "ltr");
    registerWipe(".avm-section .avm-img-col", "avm-img-mask", "rtl");
    if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
  }

  if (document.readyState === "complete") {
    setTimeout(init, 300);
  } else {
    window.addEventListener(
      "load",
      function () {
        setTimeout(init, 300);
      },
      { once: true },
    );
  }
})();

(function initExtraScrollSlider() {
  function build() {
    if (!document.querySelector("body.pedagogy-page")) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    var extraSec = document.querySelector(".extra-section");
    var extraTrack = document.querySelector(".extra-track");
    if (!extraSec || !extraTrack) return;

    var textContent = extraSec.querySelector(".text-content");
    var extraHorizontal = extraSec.querySelector(".extra-horizontal");
    if (textContent && extraHorizontal) {
      gsap.set([textContent, extraHorizontal], { autoAlpha: 0, y: 40 });
      ScrollTrigger.create({
        trigger: extraSec,
        start: "top top",
        once: true,
        onEnter: function () {
          gsap.to([textContent, extraHorizontal], {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: "power3.out",
          });
        },
      });
    }

    var slides = Array.from(extraTrack.querySelectorAll(".extra-slide"));
    if (!slides.length) return;

    var mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", function () {
      function getScrollAmount() {
        var lastSlide = slides[slides.length - 1];
        var firstSlide = slides[0];
        return -(lastSlide.offsetLeft - firstSlide.offsetLeft);
      }

      gsap.to(extraTrack, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: extraSec,
          start: "top top",
          end: () => "+=" + Math.abs(getScrollAmount()) * 0.35,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return function () {
        gsap.set(extraTrack, { clearProps: "x" });
      };
    });
  }

  if (document.readyState === "complete") {
    setTimeout(build, 300);
  } else {
    window.addEventListener("load", function () {
      setTimeout(build, 300);
    });
  }
})();

// Footer Reveal Effect Setup
(function initFooterReveal() {
  var wrapper = document.querySelector(".pedagogy-page .main-content-wrapper");
  if (!wrapper) return;

  var revealWrapper = document.querySelector(
    ".pedagogy-page .footer-reveal-wrapper",
  );

  function updateFooterMargin() {
    if (revealWrapper) {
      if (window.innerWidth <= 991) {
        wrapper.style.marginBottom = "0px";
      } else {
        wrapper.style.marginBottom = revealWrapper.offsetHeight + "px";
      }
    }
  }

  window.addEventListener("resize", updateFooterMargin);
  window.addEventListener("load", updateFooterMargin);

  // Initial check
  updateFooterMargin();
  // Double check after fonts and images might have loaded
  setTimeout(updateFooterMargin, 500);
})();

// Background transition between tabbing-sec and extra-section
(function initBgTransition() {
  const tabbingSec = document.querySelector(".tabbing-sec");
  const extraSec = document.querySelector(".extra-section");

  if (!tabbingSec || !extraSec) return;

  // We want the transition to happen when the extra section enters from 50% to 100% of the viewport.
  // "top center" means the top of extra-section hits the center of the viewport (50% in).
  // "top top" means the top of extra-section hits the top of the viewport (100% in).
  ScrollTrigger.create({
    trigger: extraSec,
    start: "top center",
    end: "top top",
    scrub: true,
    animation: gsap
      .timeline()
      .to(tabbingSec, { backgroundColor: "#0a3d9c", ease: "none" }, 0)
      .fromTo(
        extraSec,
        { backgroundColor: "#ffffff" },
        { backgroundColor: "#0a3d9c", ease: "none" },
        0,
      ),
  });
})();
