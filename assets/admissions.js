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
  var isDesktop = window.innerWidth >= 992;

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
    hero.classList.add("animation-done");
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

    // ── bbt-fa-online-section: Bottom to top fade-in on viewport enter ──
    var onlineSection = document.querySelector(".bbt-fa-online-section");

    if (onlineSection) {
      var onlineAllItems = gsap.utils.toArray(
        ".bbt-fa-online-section .main-title, .bbt-fa-online-section .description, .bbt-fa-online-section .sub-title, .bbt-fa-online-section .table-wrapper",
      );

      if (onlineAllItems.length) {
        gsap.set(onlineAllItems, { autoAlpha: 0, y: 60 });
      }

      ScrollTrigger.create({
        trigger: onlineSection,
        start: "top 75%",
        once: true,
        onEnter: function () {
          if (onlineAllItems.length) {
            gsap.to(onlineAllItems, {
              autoAlpha: 1,
              y: 0,
              duration: 0.88,
              stagger: 0.14,
              ease: "power3.out",
            });
          }
        },
      });
    }

    // ── bbt-fa-pincode-section: Bottom to top fade-in on viewport enter ──
    var pincodeSection = document.querySelector(".bbt-fa-pincode-section");
    if (pincodeSection) {
      var pincodeAllItems = gsap.utils.toArray(
        ".bbt-fa-pincode-section .title, .bbt-fa-pincode-section .subtitle, .bbt-fa-pincode-section .tabs, .bbt-fa-pincode-section .tab-content.active",
      );

      if (pincodeAllItems.length)
        gsap.set(pincodeAllItems, { autoAlpha: 0, y: 60 });

      ScrollTrigger.create({
        trigger: pincodeSection,
        start: "top 78%",
        once: true,
        onEnter: function () {
          gsap.to(pincodeAllItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
          });
        },
      });
    }

    // ── bbt-fa-application-section: Bottom to top fade-in on viewport enter ──
    var appSection = document.querySelector(".bbt-fa-application-section");
    if (appSection) {
      var appAllItems = gsap.utils.toArray(
        ".bbt-fa-application-section h1, .bbt-fa-application-section .mandatory, .bbt-fa-application-section .optional",
      );

      if (appAllItems.length) gsap.set(appAllItems, { autoAlpha: 0, y: 60 });

      ScrollTrigger.create({
        trigger: appSection,
        start: "top 78%",
        once: true,
        onEnter: function () {
          gsap.to(appAllItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            stagger: 0.14,
            ease: "power3.out",
          });
        },
      });
    }

    // ── bbt-fa-abilities-section: Bottom to top fade-in on viewport enter ──
    var abilitiesSection = document.querySelector(".bbt-fa-abilities-section");
    if (abilitiesSection) {
      var abilitiesAllItems = gsap.utils.toArray(
        ".bbt-fa-abilities-section .hero-heading, .bbt-fa-abilities-section .cta-button",
      );

      if (abilitiesAllItems.length)
        gsap.set(abilitiesAllItems, { autoAlpha: 0, y: 60 });

      ScrollTrigger.create({
        trigger: abilitiesSection,
        start: "top 80%",
        once: true,
        onEnter: function () {
          gsap.to(abilitiesAllItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.88,
            stagger: 0.14,
            ease: "power3.out",
          });
        },
      });
    }

    // ── bbt-fa-notes-section: Bottom to top fade-in on viewport enter ──
    var notesSection = document.querySelector(".bbt-fa-notes-section");
    if (notesSection) {
      var notesAllItems = gsap.utils.toArray(
        ".bbt-fa-notes-section h2, .bbt-fa-notes-section .notes-wrapper p",
      );

      if (notesAllItems.length)
        gsap.set(notesAllItems, { autoAlpha: 0, y: 60 });

      ScrollTrigger.create({
        trigger: notesSection,
        start: "top 78%",
        once: true,
        onEnter: function () {
          gsap.to(notesAllItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            stagger: 0.14,
            ease: "power3.out",
          });
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
