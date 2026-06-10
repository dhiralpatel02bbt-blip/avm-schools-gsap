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
