// About page animations
(function initAboutUsAnimations() {
  var aboutBody = document.querySelector("body.about-us-page");
  if (!aboutBody) return;

  var initialHeroLocked = aboutBody.classList.contains("about-hero-loading");
  var scrollKeys = {
    ArrowDown: true,
    ArrowLeft: true,
    ArrowRight: true,
    ArrowUp: true,
    End: true,
    Home: true,
    PageDown: true,
    PageUp: true,
    " ": true,
  };

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function keepAtHeroTop() {
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  }

  function stopInitialHeroScroll(event) {
    if (!initialHeroLocked) return;
    if (event.type === "keydown" && !scrollKeys[event.key]) return;
    event.preventDefault();
    keepAtHeroTop();
  }

  function lockInitialHeroScroll() {
    initialHeroLocked = true;
    if (window.lenis) window.lenis.stop();
    keepAtHeroTop();
    window.addEventListener("wheel", stopInitialHeroScroll, { passive: false });
    window.addEventListener("touchmove", stopInitialHeroScroll, {
      passive: false,
    });
    window.addEventListener("keydown", stopInitialHeroScroll, false);
    window.addEventListener("scroll", keepAtHeroTop, { passive: true });
  }

  function unlockInitialHeroScroll() {
    if (!initialHeroLocked) return;
    initialHeroLocked = false;
    if (window.lenis) window.lenis.start();
    window.removeEventListener("wheel", stopInitialHeroScroll);
    window.removeEventListener("touchmove", stopInitialHeroScroll);
    window.removeEventListener("keydown", stopInitialHeroScroll, false);
    window.removeEventListener("scroll", keepAtHeroTop);
    aboutBody.classList.remove("about-hero-loading");
    keepAtHeroTop();
  }

  if (window.innerWidth >= 768) {
    lockInitialHeroScroll();
  } else {
    unlockInitialHeroScroll();
  }

  function initMobileStickyButton() {
    var wrapper = document.querySelector(".main-content-wrapper");
    var stickyButton = document.querySelector(".mob-sticky-btn");
    if (!wrapper || !stickyButton) return;

    function updateMobileStickyButton() {
      if (window.innerWidth > 767) {
        aboutBody.classList.remove("about-hide-mob-sticky");
        return;
      }

      var wrapperBottom = wrapper.getBoundingClientRect().bottom;
      aboutBody.classList.toggle(
        "about-hide-mob-sticky",
        wrapperBottom <= window.innerHeight
      );
    }

    updateMobileStickyButton();
    window.addEventListener("scroll", updateMobileStickyButton, {
      passive: true,
    });
    window.addEventListener("resize", updateMobileStickyButton);
  }

  initMobileStickyButton();

  function initNativeAboutFallback() {
    var fallbackHero = document.querySelector(".bbt-yp-hero");
    var fallbackCircle = fallbackHero
      ? fallbackHero.querySelector(".blue-circle")
      : null;
    var fallbackTitle = fallbackHero
      ? fallbackHero.querySelector(".main-title")
      : null;
    var fallbackYellow = fallbackHero
      ? fallbackHero.querySelector(".yellow-circle")
      : null;
    var fallbackStudent = fallbackHero
      ? fallbackHero.querySelector(".about-student-img")
      : null;
    var fallbackAwareness = document.querySelector(".awareness-about-sec");
    var fallbackAwarenessImage = fallbackAwareness
      ? fallbackAwareness.querySelector(".avm-image-wrap")
      : null;
    var fallbackAwarenessText = fallbackAwareness
      ? fallbackAwareness.querySelector(".avm-text")
      : null;
    var fallbackCommitment = document.querySelector(".commitment-sec");
    var fallbackCommitmentText = fallbackCommitment
      ? fallbackCommitment.querySelector(".content-sec")
      : null;
    var fallbackCommitmentImage = fallbackCommitment
      ? fallbackCommitment.querySelector(".image-wrapper")
      : null;
    var fallbackGovernance = document.querySelector(".governance-sec");
    var fallbackGovernanceText = fallbackGovernance
      ? fallbackGovernance.querySelector(".content-sec")
      : null;
    var fallbackGovernanceImage = fallbackGovernance
      ? fallbackGovernance.querySelector(".image-wrapper")
      : null;
    var introDone = false;
    var awarenessShown = false;
    var commitmentShown = false;
    var governanceShown = false;

    if (!fallbackHero || !fallbackCircle) return;

    fallbackHero.style.position = "sticky";
    fallbackHero.style.top = "0";
    fallbackHero.style.zIndex = "5";

    if (fallbackAwarenessImage && fallbackAwarenessText) {
      fallbackAwareness.style.opacity = "0";
      fallbackAwarenessImage.style.opacity = "0";
      fallbackAwarenessImage.style.transform = "translateY(90px)";
      fallbackAwarenessImage.style.transition =
        "opacity 1.1s ease, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)";





      fallbackAwarenessText.style.opacity = "0";
      fallbackAwarenessText.style.transform = "translateY(90px)";
      fallbackAwarenessText.style.transition =
        "opacity 1.1s ease 0.18s, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.18s";
    }

    if (fallbackCommitmentText && fallbackCommitmentImage) {
      fallbackCommitmentText.style.opacity = "0";
      fallbackCommitmentText.style.transform = "translateY(100px)";
      fallbackCommitmentText.style.transition =
        "opacity 1.05s ease, transform 1.05s cubic-bezier(0.16, 1, 0.3, 1)";
      fallbackCommitmentImage.style.opacity = "0";
      fallbackCommitmentImage.style.transform = "translateY(100px)";
      fallbackCommitmentImage.style.transition =
        "opacity 1.05s ease 0.15s, transform 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.15s";
    }

    if (fallbackGovernanceText && fallbackGovernanceImage) {
      fallbackGovernanceImage.style.opacity = "1";
      fallbackGovernanceImage.style.transform = "none";
      fallbackGovernanceImage.style.transition = "none";
      fallbackGovernanceText.style.opacity = "0";
      fallbackGovernanceText.style.transform = "translateY(100px)";
      fallbackGovernanceText.style.transition =
        "opacity 1.35s ease 0.16s, transform 1.35s cubic-bezier(0.16, 1, 0.3, 1) 0.16s";
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function getFallbackMeasurements() {
      var circleW =
        fallbackCircle.offsetWidth > 10 ? fallbackCircle.offsetWidth : 1200;
      var circleLeft = fallbackCircle.offsetLeft;
      var circleCenterX = circleLeft + circleW / 2;
      var centeredCircleX = window.innerWidth / 2 - circleCenterX;
      var viewportDiagonal = Math.hypot(window.innerWidth, window.innerHeight);
      var coverScale = Math.max(1.35, (viewportDiagonal / circleW) * 1.18);

      return {
        centeredCircleX: centeredCircleX,
        coverScale: coverScale,
      };
    }

    function updateFallbackScroll() {
      if (!introDone) return;

      var measurements = getFallbackMeasurements();
      var progress = clamp(window.scrollY / window.innerHeight, 0, 1);
      var stepProgress = Math.floor(progress * 4) / 4;
      var smoothProgress = Math.max(progress, stepProgress);
      var circleX = measurements.centeredCircleX * smoothProgress;
      var circleScale = 1 + (measurements.coverScale - 1) * smoothProgress;
      var fadeProgress = clamp((progress - 0.04) / 0.34, 0, 1);

      fallbackHero.style.visibility = progress >= 1 ? "hidden" : "visible";
      fallbackHero.style.zIndex = progress >= 1 ? "0" : "5";
      fallbackCircle.style.transform =
        "translate3d(" + circleX + "px, 0, 0) scale(" + circleScale + ")";

      if (fallbackTitle) {
        fallbackTitle.style.opacity = 1 - fadeProgress;
        fallbackTitle.style.transform =
          "translateX(" + -60 * fadeProgress + "px) translateY(30%)";
      }
      if (fallbackYellow) {
        fallbackYellow.style.opacity = "1";
        fallbackYellow.style.transform = "none";
      }
      if (fallbackStudent) {
        fallbackStudent.style.opacity = "1";
        fallbackStudent.style.transform = "none";
      }

      if (
        !awarenessShown &&
        fallbackAwareness &&
        fallbackAwareness.getBoundingClientRect().top <=
          window.innerHeight * 0.98
      ) {
        awarenessShown = true;
        if (fallbackAwarenessImage && fallbackAwarenessText) {
          fallbackAwareness.style.opacity = "1";
          fallbackAwarenessImage.style.opacity = "1";
          fallbackAwarenessImage.style.transform = "translateY(0)";
          fallbackAwarenessText.style.opacity = "1";
          fallbackAwarenessText.style.transform = "translateY(0)";
        }
      }

      if (
        fallbackCommitment &&
        fallbackCommitment.getBoundingClientRect().top <=
          window.innerHeight * 0.72
      ) {
        if (
          !commitmentShown &&
          fallbackCommitmentText &&
          fallbackCommitmentImage
        ) {
          commitmentShown = true;
          fallbackCommitmentText.style.opacity = "1";
          fallbackCommitmentText.style.transform = "translateY(0)";
          fallbackCommitmentImage.style.opacity = "1";
          fallbackCommitmentImage.style.transform = "translateY(0)";
        }
      } else if (
        commitmentShown &&
        fallbackCommitment &&
        fallbackCommitment.getBoundingClientRect().top >
          window.innerHeight * 0.78
      ) {
        commitmentShown = false;
        if (fallbackCommitmentText && fallbackCommitmentImage) {
          fallbackCommitmentText.style.opacity = "0";
          fallbackCommitmentText.style.transform = "translateY(100px)";
          fallbackCommitmentImage.style.opacity = "0";
          fallbackCommitmentImage.style.transform = "translateY(100px)";
        }
      }

      if (
        fallbackGovernance &&
        fallbackGovernance.getBoundingClientRect().top <=
          window.innerHeight * 0.72
      ) {
        if (
          !governanceShown &&
          fallbackGovernanceText &&
          fallbackGovernanceImage
        ) {
          governanceShown = true;
          fallbackGovernanceText.style.opacity = "1";
          fallbackGovernanceText.style.transform = "translateY(0)";
        }
      } else if (
        governanceShown &&
        fallbackGovernance &&
        fallbackGovernance.getBoundingClientRect().top >
          window.innerHeight * 0.78
      ) {
        governanceShown = false;
        if (fallbackGovernanceText && fallbackGovernanceImage) {
          fallbackGovernanceText.style.opacity = "0";
          fallbackGovernanceText.style.transform = "translateY(100px)";
        }
      }
    }

    window.setTimeout(function () {
      introDone = true;
      unlockInitialHeroScroll();
      updateFallbackScroll();
    }, 2750);

    window.addEventListener("scroll", updateFallbackScroll, { passive: true });
    window.addEventListener("resize", updateFallbackScroll);
  }

  if (typeof gsap === "undefined") {
    initNativeAboutFallback();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var hero = document.querySelector(".bbt-yp-hero");
  var circle = hero ? hero.querySelector(".blue-circle") : null;
  var title = hero ? hero.querySelector(".main-title") : null;
  var titleHeading = title ? title.querySelector(".hero-txt") : null;
  var titleBody = title ? title.querySelector(".panel-body") : null;
  var yellowCircle = hero ? hero.querySelector(".yellow-circle") : null;
  var studentImage = hero ? hero.querySelector(".about-student-img") : null;
  var awarenessSection = document.querySelector(".awareness-about-sec");
  var awarenessImage = awarenessSection
    ? awarenessSection.querySelector(".avm-image-wrap")
    : null;
  var awarenessText = awarenessSection
    ? awarenessSection.querySelector(".avm-text")
    : null;
  var visionSection = document.querySelector(".our-vision-sec");
  var visionLeft = visionSection
    ? visionSection.querySelector(".left-semicircle")
    : null;
  var visionRight = visionSection
    ? visionSection.querySelector(".right-semicircle")
    : null;
  var visionTitle = visionSection
    ? visionSection.querySelector(".heading-title")
    : null;
  var visionPara = visionSection
    ? visionSection.querySelector(".para-text")
    : null;
  var commitmentSection = document.querySelector(".commitment-sec");
  var commitmentText = commitmentSection
    ? commitmentSection.querySelector(".content-sec")
    : null;
  var commitmentImage = commitmentSection
    ? commitmentSection.querySelector(".image-wrapper")
    : null;
  var governanceSection = document.querySelector(".governance-sec");
  var governanceText = governanceSection
    ? governanceSection.querySelector(".content-sec")
    : null;
  var governanceImage = governanceSection
    ? governanceSection.querySelector(".image-wrapper")
    : null;



  var heroScrollTrigger;
  var awarenessTrigger;
  var visionSplitTrigger;
  var visionRadialTrigger;
  var coreValuesTrigger;
  var commitmentTrigger;
  var governanceTrigger;
  var mobileTriggers = [];
  var resizeTimer;

  if (!hero || !circle || typeof ScrollTrigger === "undefined") return;

  function killTriggers() {
    if (heroScrollTrigger) heroScrollTrigger.kill();
    if (awarenessTrigger) awarenessTrigger.kill();
    if (visionSplitTrigger) visionSplitTrigger.kill();
    if (visionRadialTrigger) visionRadialTrigger.kill();
    if (coreValuesTrigger) coreValuesTrigger.kill();
    if (commitmentTrigger) commitmentTrigger.kill();
    if (governanceTrigger) governanceTrigger.kill();

    if (mobileTriggers.length > 0) {
      mobileTriggers.forEach(function (t) {
        t.kill();
      });
      mobileTriggers = [];
    }

    // Clean up commitment section properties modified for desktop overlap
    var commitmentSection = document.querySelector(".commitment-sec");
    if (commitmentSection) {
      gsap.set(commitmentSection, { clearProps: "marginTop,zIndex,clipPath,backgroundColor" });
    }
    
    var governanceSection = document.querySelector(".governance-sec");
    if (governanceSection) {
      gsap.set(governanceSection, { clearProps: "marginTop,position,zIndex" });
    }

    heroScrollTrigger = null;
    awarenessTrigger = null;
    visionSplitTrigger = null;
    visionRadialTrigger = null;
    coreValuesTrigger = null;
    commitmentTrigger = null;
    governanceTrigger = null;
  }

  function getHeroMeasurements() {
    var circleW = circle.offsetWidth > 10 ? circle.offsetWidth : 1200;
    var circleLeft = circle.offsetLeft;
    var circleCenterX = circleLeft + circleW / 2;
    var centeredCircleX = window.innerWidth / 2 - circleCenterX;
    var viewportDiagonal = Math.hypot(window.innerWidth, window.innerHeight);
    var coverScale = Math.max(1.35, (viewportDiagonal / circleW) * 1.18);

    return {
      centeredCircleX: centeredCircleX,
      coverScale: coverScale,
      hiddenCircleX: -(circleW * 0.55),
    };
  }

  function createHeroScrollAnimation(measurements) {
    var coverTL = gsap.timeline({ paused: true });
    var stepOneScale = 1 + (measurements.coverScale - 1) * 0.22;
    var stepTwoScale = 1 + (measurements.coverScale - 1) * 0.46;
    var stepThreeScale = 1 + (measurements.coverScale - 1) * 0.7;

    coverTL
      .set(circle, {
        x: 0,
        scale: 1,
        transformOrigin: "center center",
      })
      .to(circle, {
        x: measurements.centeredCircleX * 0.18,
        scale: stepOneScale,
        duration: 0.24,
        ease: "none",
      })
      .to(circle, {
        x: measurements.centeredCircleX * 0.42,
        scale: stepTwoScale,
        duration: 0.24,
        ease: "none",
      })
      .to(circle, {
        x: measurements.centeredCircleX * 0.68,
        scale: stepThreeScale,
        duration: 0.24,
        ease: "none",
      })
      .to(circle, {
        x: measurements.centeredCircleX,
        scale: measurements.coverScale,
        duration: 0.2,
        ease: "none",
      });

    if (title) {
      coverTL.to(
        title,
        {
          opacity: 0,
          x: -60,
          duration: 0.35,
          ease: "none",
        },
        0.06
      );
    }

    heroScrollTrigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: false,

      scrub: 0.35,
      invalidateOnRefresh: true,
      animation: coverTL,
      onEnter: function () {
        gsap.set(hero, { zIndex: 5 });
      },
      onLeave: function () {
        gsap.set(hero, { zIndex: 0 });
      },
      onEnterBack: function () {
        gsap.set(hero, { zIndex: 5 });
      },
    });
  }

  function initHero() {
    var measurements = getHeroMeasurements();

    gsap.killTweensOf([
      circle,
      title,
      titleHeading,
      titleBody,
      yellowCircle,
      studentImage,
    ]);

    gsap.set(circle, {
      x: 0,
      scale: 1,
      autoAlpha: 1,
      transformOrigin: "center center",
      force3D: true,
    });
    gsap.set(title, { x: 0, opacity: 1 });
    if (yellowCircle) {
      gsap.set(yellowCircle, { opacity: 1, clearProps: "transform" });
    }
    if (studentImage) {
      gsap.set(studentImage, { opacity: 1, clearProps: "transform" });
    }

    window.setTimeout(function () {
      unlockInitialHeroScroll();
      if (titleHeading) gsap.set(titleHeading, { x: 0, autoAlpha: 1 });
      if (titleBody) gsap.set(titleBody, { x: 0, autoAlpha: 1 });
      gsap.set(circle, { x: 0, scale: 1 });
      if (yellowCircle) {
        gsap.set(yellowCircle, { opacity: 1, clearProps: "transform" });
      }
      createHeroScrollAnimation(measurements);
      ScrollTrigger.refresh();
    }, 2750);
  }

  function initAwareness() {
    if (!awarenessSection || !awarenessImage || !awarenessText) return;

    gsap.killTweensOf([awarenessImage, awarenessText]);

    gsap.set(awarenessSection, { autoAlpha: 1 });
    gsap.set([awarenessImage, awarenessText], { x: 0, y: 90, autoAlpha: 0 });

    var awarenessTL = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    awarenessTL
      .to(awarenessImage, { y: 0, autoAlpha: 1, duration: 0.85 }, 0)
      .to(awarenessText, { y: 0, autoAlpha: 1, duration: 0.85 }, 0.12)
      .to({}, { duration: 0.34 })
      .to(
        [awarenessImage, awarenessText],
        {
          x: 0,
          y: -90,
          autoAlpha: 1,
          duration: 1.05,
          ease: "power2.out",
        },
        ">"
      )
      .to([awarenessImage, awarenessText], {
        y: -120,
        autoAlpha: 0,
        duration: 0.55,
        ease: "power2.inOut",
      })
      .to({}, { duration: 0.16 });

    awarenessTrigger = ScrollTrigger.create({
      trigger: awarenessSection,
      start: "top top",
      end: "+=150%",
      pin: true,
      pinSpacing: true,

      scrub: 0.8,
      animation: awarenessTL,
      invalidateOnRefresh: true,
    });
  }

  function initVision() {
    if (!visionSection || !visionLeft || !visionRight || !visionTitle) return;

    gsap.killTweensOf([
      visionLeft,
      visionRight,
      visionTitle,
      visionPara,
      visionSection,
    ]);

    // Measure how far each semicircle needs to travel inward to meet at center.
    // Each semicircle sits at x:0 naturally. We push them toward each other
    // so left moves RIGHT (positive x) and right moves LEFT (negative x),
    // meeting in the middle to form a full circle.
    // attachedOffset = half the title width + the 15px gap defined in CSS.
    var titleWidth = visionTitle.getBoundingClientRect().width;
    var attachedOffset = titleWidth / 2 + 15;

    // START: plain blue section. Radial lines and vision content appear later.
    gsap.set(visionLeft, { x: attachedOffset, autoAlpha: 0 });
    gsap.set(visionRight, { x: -attachedOffset, autoAlpha: 0 });
    gsap.set(visionTitle, { autoAlpha: 0 });
    gsap.set(visionPara, { y: 18, autoAlpha: 0 });
    gsap.set(visionSection, {
      "--vision-radial-scale": 0,
      "--vision-radial-opacity": 0,
      "--vision-radial-reveal": "0%",
    });

    var visionPinnedTL = gsap.timeline({
      defaults: { ease: "none" },
    });

    visionPinnedTL
      .to(visionSection, {
        "--vision-radial-scale": 1,
        "--vision-radial-opacity": 0.95,
        "--vision-radial-reveal": "85%",
        duration: 0.72,
      })
      .to(visionLeft, {
        x: 0,
        autoAlpha: 1,
        duration: 0.65,
        ease: "power3.out",
      }, "-=0.35")
      .to(
        visionRight,
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.65,
          ease: "power3.out",
        },
        "<"
      )
      .to(
        visionTitle,
        {
          autoAlpha: 1,
          duration: 0.38,
          ease: "power2.out",
        },
        "-=0.34"
      )
      .to(
        visionPara,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.48,
          ease: "power2.out",
        },
        "-=0.12"
      )
      .to({}, { duration: 0.45 })
      .to(
        [visionLeft, visionRight, visionTitle, visionPara],
        {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.inOut",
        }
      )
      .to(
        visionSection,
        {
          "--vision-radial-opacity": 0,
          duration: 0.4,
          ease: "power2.inOut",
        },
        "<"
      );

    visionRadialTrigger = ScrollTrigger.create({
      trigger: visionSection,
      start: "top top",
      end: "+=130%",
      pin: visionSection,
      pinSpacing: true,

      scrub: 1,
      animation: visionPinnedTL,
      invalidateOnRefresh: true,
      onEnter: function () {
        gsap.set(visionSection, { zIndex: 2 });
      },
      onEnterBack: function () {
        gsap.set(visionSection, { zIndex: 2 });
      },
      onLeave: function () {
        gsap.set(visionSection, { zIndex: 0 });
      },
      onLeaveBack: function () {
        gsap.set(visionSection, { zIndex: 0 });
        gsap.set(visionSection, {
          "--vision-radial-scale": 0,
          "--vision-radial-opacity": 0,
          "--vision-radial-reveal": "0%",
        });
      },
    });
  }

  function initCoreValues() {
    var coreSection = document.querySelector(".core-value-sec");
    if (!coreSection) return;

    // Pull the section up to remove the scroll delay after the Vision section
    gsap.set(coreSection, { marginTop: "-100vh" });

    var whiteCircle = coreSection.querySelector(".white-circle");
    var circleHeading = whiteCircle ? whiteCircle.querySelector("h2") : null;
    var circleSubtitle = whiteCircle ? whiteCircle.querySelector("p") : null;
    var textWrapper = coreSection.querySelector(".text-wrapper");
    if (!textWrapper) return;

    var items = Array.prototype.slice
      .call(textWrapper.querySelectorAll(".core-para"))
      .map(function (item) {
        return {
          dot: item.querySelector(".timeline-dot"),
          text: item,
        };
      });
    if (!items.length) return;

    function showCoreValuesStatic() {
      var oldLine = textWrapper.querySelector(".avm-cv-anim-line");
      if (oldLine) oldLine.remove();

      textWrapper.classList.remove("is-core-values-animated");
      if (whiteCircle) whiteCircle.removeAttribute("style");
      if (circleHeading) circleHeading.removeAttribute("style");
      if (circleSubtitle) circleSubtitle.removeAttribute("style");

      textWrapper.removeAttribute("style");
      items.forEach(function (item) {
        if (item.dot) item.dot.removeAttribute("style");
        item.text.querySelectorAll("h3, p").forEach(function (textNode) {
          textNode.removeAttribute("style");
        });
      });
    }

    if (typeof ScrollTrigger === "undefined") {
      showCoreValuesStatic();
      return;
    }

    // The yellow vertical line is a ::before pseudo-element on .text-wrapper.
    // We replicate it as a real element so GSAP can animate its height.
    var oldAnimLine = textWrapper.querySelector(".avm-cv-anim-line");
    if (oldAnimLine) oldAnimLine.remove();
    textWrapper.classList.add("is-core-values-animated");

    // Inject an animated line overlay (sits on top of the CSS pseudo ::before)
    var animLine = document.createElement("span");
    animLine.className = "avm-cv-anim-line";
    var timelineStyles = window.getComputedStyle(textWrapper);
    var timelineLeft =
      timelineStyles.getPropertyValue("--core-timeline-x").trim() || "-87px";
    var contentIndent =
      timelineStyles.getPropertyValue("--core-content-indent").trim() || "0px";
    animLine.style.cssText =
      "position:absolute;left:calc(" +
      contentIndent +
      " + " +
      timelineLeft +
      ");top:14px;width:1px;height:1px;background:#f7df00;z-index:2;pointer-events:none;transform:scaleY(0);transform-origin:top center;";
    textWrapper.style.position = "relative";
    textWrapper.insertBefore(animLine, textWrapper.firstChild);

    // ── Initial states ──────────────────────────────────────────────────────

    // White circle: start collapsed, text hidden
    if (whiteCircle) {
      gsap.set(whiteCircle, {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: "center center",
      });
    }
    if (circleHeading) gsap.set(circleHeading, { autoAlpha: 0, y: 20 });
    if (circleSubtitle) gsap.set(circleSubtitle, { autoAlpha: 0, y: 14 });

    // Dots and texts: all hidden
    items.forEach(function (item) {
      if (item.dot)
        gsap.set(item.dot, {
          scale: 0,
          autoAlpha: 0,
          transformOrigin: "center center",
        });
      if (item.text) {
        // hide just the h3 and p inside, not the container (which has position)
        gsap.set(item.text.querySelectorAll("h3, p"), { autoAlpha: 0 });
      }
    });

    // ── Helper: get the full line height (distance from top to last dot bottom)
    function getDotCenter(index) {
      if (!items[index] || !items[index].dot) return 0;
      var wrapperRect = textWrapper.getBoundingClientRect();
      var dotRect = items[index].dot.getBoundingClientRect();
      return dotRect.top + dotRect.height / 2 - wrapperRect.top;
    }

    function getWrapperY(index) {
      var sectionRect = coreSection.getBoundingClientRect();
      var wrapperRect = textWrapper.getBoundingClientRect();
      var itemRect = items[index].text.getBoundingClientRect();
      var itemCenter = itemRect.top + itemRect.height / 2 - wrapperRect.top;
      var targetCenter = sectionRect.height * 0.52;
      var wrapperOffset = wrapperRect.top - sectionRect.top;
      return targetCenter - wrapperOffset - itemCenter;
    }

    // ── Build the master scrub timeline ─────────────────────────────────────
    // Each "phase" occupies a fraction of the scroll distance.
    // Section is pinned for the duration of the scroll.

    var masterTL = gsap.timeline({ paused: true });
    var firstDotCenter = getDotCenter(0);
    var lastDotCenter = getDotCenter(items.length - 1);
    var lineFullHeight = Math.max(1, lastDotCenter - firstDotCenter);
    var itemPositions = items.map(function (_item, index) {
      return {
        y: getWrapperY(index),
        lineProgress:
          lineFullHeight > 0
            ? (getDotCenter(index) - firstDotCenter) / lineFullHeight
            : 0,
      };
    });
    var startY = itemPositions[0].y;

    gsap.set(textWrapper, { y: startY });
    gsap.set(animLine, {
      top: firstDotCenter,
      height: lineFullHeight,
      scaleY: 1,
      autoAlpha: 0,
      transformOrigin: "top center",
    });

    // Phase 0: white circle grows in smoothly with scroll
    var circleGrowDuration = 0.28;

    masterTL.to(
      whiteCircle,
      { scale: 1, autoAlpha: 1, duration: circleGrowDuration, ease: "none" },
      0
    );
    if (circleHeading) {
      masterTL.to(
        circleHeading,
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.18
      );
    }
    if (circleSubtitle) {
      masterTL.to(
        circleSubtitle,
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.22
      );
    }

    masterTL.to(
      animLine,
      { autoAlpha: 1, duration: 0.15, ease: "power1.out" },
      0.1
    );

    // Fade in all dots and text at once
    items.forEach(function (item) {
      if (item.dot) {
        masterTL.to(
          item.dot,
          { scale: 1, autoAlpha: 1, duration: 0.15, ease: "power2.out" },
          0.1
        );
      }
      masterTL.to(
        item.text.querySelectorAll("h3, p"),
        { autoAlpha: 1, duration: 0.15, ease: "power1.out" },
        0.1
      );
    });

    // Scroll through the list (translate Y)
    masterTL.to(
      textWrapper,
      {
        y: itemPositions[itemPositions.length - 1].y,
        duration: 1.5,
        ease: "none",
      },
      0.3
    );

    // ── ScrollTrigger: pin the section, scrub the timeline ──────────────────
    // Extra scroll space = 3× viewport heights so each phase gets room
    // Let the final line settle before ScrollTrigger releases the pinned section.
    masterTL.to({}, { duration: 0.18 })
            .to(whiteCircle, { y: -500, autoAlpha: 0, duration: 0.5, ease: "power1.inOut" }, ">")
            .to(textWrapper, { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: "power1.inOut" }, "<");

    coreValuesTrigger = ScrollTrigger.create({
      trigger: coreSection,
      start: "top top",
      end: "+=" + Math.max(300, items.length * 90) + "%",
      pin: true,
      pinSpacing: true,

      scrub: true,
      invalidateOnRefresh: true,
      animation: masterTL,
    });

    function ensureCoreValuesAnimationReady() {
      if (typeof ScrollTrigger === "undefined" || !coreValuesTrigger) {
        showCoreValuesStatic();
      }
    }

    window.setTimeout(ensureCoreValuesAnimationReady, 1200);
    window.setTimeout(ensureCoreValuesAnimationReady, 3600);
  }

  function initCoreValuesMobile() {
    var mobileSection = document.querySelector(".core-value-mob");
    if (!mobileSection) return;

    // Pull the section up to remove the scroll delay after the Vision section
    gsap.set(mobileSection, { marginTop: "-100vh" });

    var textWrapper = mobileSection.querySelector(".text-wrapper");
    var animLine = mobileSection.querySelector(".avm-cv-anim-line");
    if (!textWrapper || !animLine) return;

    var items = Array.prototype.slice.call(
      textWrapper.querySelectorAll(".core-para")
    );
    if (!items.length) return;

    var dots = items
      .map(function (item) {
        return item.querySelector(".timeline-dot");
      })
      .filter(Boolean);
    var textNodes = items.reduce(function (nodes, item) {
      return nodes.concat(
        Array.prototype.slice.call(
          item.querySelectorAll(".value-para h3, .value-para p")
        )
      );
    }, []);

    gsap.killTweensOf([textWrapper, animLine].concat(dots, textNodes));
    gsap.set(textWrapper, { clearProps: "all" });
    gsap.set(animLine, { clearProps: "all" });
    gsap.set(dots, { clearProps: "all" });
    gsap.set(textNodes, { clearProps: "all" });

    function getDotCenter(index) {
      var dot = items[index]
        ? items[index].querySelector(".timeline-dot")
        : null;
      if (!dot) return 0;
      var wrapperRect = textWrapper.getBoundingClientRect();
      var dotRect = dot.getBoundingClientRect();
      return dotRect.top + dotRect.height / 2 - wrapperRect.top;
    }

    function getWrapperY(index) {
      var sectionRect = mobileSection.getBoundingClientRect();
      var wrapperRect = textWrapper.getBoundingClientRect();
      var heading = mobileSection.querySelector(".main-heading");
      var headingStyle = heading ? window.getComputedStyle(heading) : null;
      var headingBottom = heading
        ? heading.getBoundingClientRect().bottom - sectionRect.top
        : sectionRect.height * 0.22;
      var headingGap = headingStyle
        ? parseFloat(headingStyle.marginBottom)
        : 44;
      mobileSection.style.setProperty(
        "--core-mob-mask-height",
        headingBottom + headingGap + "px"
      );
      var anchorIndex = index > 0 ? index - 1 : index;
      var anchorRect = items[anchorIndex].getBoundingClientRect();
      var anchorTop = anchorRect.top - wrapperRect.top;
      var targetTop = headingBottom + headingGap;
      var wrapperOffset = wrapperRect.top - sectionRect.top;
      return targetTop - wrapperOffset - anchorTop;
    }

    var firstDotCenter = getDotCenter(0);
    var lastDotCenter = getDotCenter(items.length - 1);
    var lineFullHeight = Math.max(1, lastDotCenter - firstDotCenter);
    var itemPositions = items.map(function (_item, index) {
      return {
        y: getWrapperY(index),
        lineProgress:
          lineFullHeight > 0
            ? (getDotCenter(index) - firstDotCenter) / lineFullHeight
            : 0,
      };
    });

    gsap.set(textWrapper, { y: itemPositions[0].y });
    gsap.set(animLine, {
      top: firstDotCenter,
      height: lineFullHeight,
      scaleY: 1,
      autoAlpha: 0,
      transformOrigin: "top center",
    });
    gsap.set(dots, {
      scale: 1,
      autoAlpha: 0,
      transformOrigin: "center center",
    });
    gsap.set(textNodes, { autoAlpha: 0, x: 0 });

    var mobileTL = gsap.timeline({ paused: true });

    // Fade in line, dots, and text
    mobileTL.to(
      animLine,
      { autoAlpha: 1, duration: 0.15, ease: "power1.out" },
      0
    );
    mobileTL.to(dots, { autoAlpha: 1, duration: 0.15, ease: "power2.out" }, 0);
    mobileTL.to(
      textNodes,
      { autoAlpha: 1, duration: 0.15, ease: "power1.out" },
      0
    );

    // Scroll through the list (translate Y)
    mobileTL.to(
      textWrapper,
      {
        y: itemPositions[itemPositions.length - 1].y,
        duration: 1.5,
        ease: "none",
      },
      0.2
    );

    mobileTL.to({}, { duration: 0.16 })
            .to(mobileSection.querySelector(".main-heading"), { y: -400, autoAlpha: 0, duration: 0.5, ease: "power1.inOut" }, ">")
            .to(textWrapper, { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: "power1.inOut" }, "<");

    coreValuesTrigger = ScrollTrigger.create({
      trigger: mobileSection,
      start: "top top",
      end: "+=" + Math.max(320, items.length * 95) + "%",
      pin: true,
      pinSpacing: true,

      scrub: true,
      invalidateOnRefresh: true,
      animation: mobileTL,
    });
  }

  function initCommitment() {
    var commitmentSection = document.querySelector(".commitment-sec");
    var commitmentText = commitmentSection ? commitmentSection.querySelector(".content-sec") : null;
    var commitmentImage = commitmentSection ? commitmentSection.querySelector(".image-wrapper") : null;

    if (!commitmentSection || !commitmentText || !commitmentImage) return;

    gsap.killTweensOf([commitmentSection, commitmentText, commitmentImage]);

    // Pull commitment section up to overlap the pinned Values section during its final scroll phase
    gsap.set(commitmentSection, { 
      marginTop: "-100vh",
      position: "relative",
      zIndex: 5,
      backgroundColor: "#ffffff"
    });

    // Initial state: image fades in up, text slides in from left
    gsap.set(commitmentImage, {
      y: 100,
      autoAlpha: 0,
      force3D: true,
      willChange: "transform, opacity",
    });

    gsap.set(commitmentText, {
      y: 100,
      autoAlpha: 0,
      force3D: true,
      willChange: "transform, opacity",
    });

    var commitmentTL = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: commitmentSection,
        start: "top 50%", // Starts when it reaches 50% of the viewport
        end: "top 20%",
        scrub: 1.15,
        invalidateOnRefresh: true
      }
    });

    commitmentTL
      .to([commitmentText, commitmentImage], { x: 0, y: 0, autoAlpha: 1, duration: 1.35 }, 0.16)
      .set([commitmentText, commitmentImage], { clearProps: "willChange" });

  }

  function initGovernance() {
    if (!governanceSection || !governanceText || !governanceImage) return;

    gsap.killTweensOf([governanceImage, governanceText, governanceSection]);

    // Pull governance section up to reduce white space and scroll delay
    gsap.set(governanceSection, { 
      marginTop: "-25vh",
      position: "relative",
      zIndex: 6
    });

    // Initial state: image fades in up, text slides in from right
    gsap.set(governanceImage, {
      y: 100,
      autoAlpha: 0,
      force3D: true,
      willChange: "transform, opacity",
    });

    gsap.set(governanceText, {
      y: 100,
      autoAlpha: 0,
      force3D: true,
      willChange: "transform, opacity",
    });

    var governanceTL = gsap.timeline({
      defaults: { ease: "power3.out" },
    });
    governanceTL
      .to([governanceText, governanceImage], { x: 0, y: 0, autoAlpha: 1, duration: 1.35 }, 0.16)
      .set([governanceText, governanceImage], { clearProps: "willChange" });

    // -YP start
    ScrollTrigger.create({
      trigger: governanceSection,
      start: "top 50%",
      end: "top 20%",
      animation: governanceTL,
      scrub: 1.15,
      invalidateOnRefresh: true,
    });

    governanceTrigger = ScrollTrigger.create({
      trigger: governanceSection,
      start: "top top",
      end: "+=" + window.innerHeight,
      pin: true,
      pinSpacing: true,

      scrub: 1.15,
      invalidateOnRefresh: true,
    });
    // -YP end
  }

  function init() {
    killTriggers();

    if (window.innerWidth < 768) {
      unlockInitialHeroScroll();
      // Bypass initCoreValuesMobile so the content just stacks naturally
      ScrollTrigger.refresh();
      return;
    }

    initHero();
    initAwareness();
    initVision();
    initCoreValues();
    initCommitment();
    initGovernance();
    ScrollTrigger.refresh();
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init, { once: true });
  }

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      killTriggers();
      ScrollTrigger.refresh();
      init();
    }, 180);
  });
})();

// ============================================================
// FOOTER REVEAL SECTION
// ============================================================
(function initFooterReveal() {
  if (!document.querySelector("body.about-us-page")) return;

  var wrapper = document.querySelector(".main-content-wrapper");
  var footerWrap = document.querySelector(".footer-reveal-wrapper");
  if (!wrapper || !footerWrap) return;

  function updateFooterMargin() {
    var h = footerWrap.offsetHeight;
    wrapper.style.marginBottom = h + "px";
  }

  // Initial update
  updateFooterMargin();

  // Update on resize
  window.addEventListener("resize", updateFooterMargin);
  window.addEventListener("load", updateFooterMargin);

  // Set CSS for fixed footer to prevent jerking on scroll
  gsap.set(footerWrap, {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 0,
  });

  // Make sure body doesn't overlap if it has background
  gsap.set(document.body, { backgroundColor: "transparent" });
})();

// ============================================================
// MOBILE ABOUT-US ELEMENTS FADE IN UP
// ============================================================
(function initMobileFadeInUp() {
  if (!document.querySelector("body.about-us-page")) return;
  
  let mm = gsap.matchMedia();
  mm.add("(max-width: 767.98px)", () => {
    var sections = document.querySelectorAll(
      ".mob-hero, .awareness-about-sec, .our-vision-sec, .core-value-mob, .commitment-sec, .governance-sec"
    );

    sections.forEach(function (sec) {
      if (sec.classList.contains("mob-hero")) {
        // slideUp animation to the blue circle (.mob-content), no fade, no image animation
        var mobContent = sec.querySelector(".mob-content");
        if (mobContent) {
          gsap.set(mobContent, { y: 50 });
          ScrollTrigger.create({
            trigger: sec,
            start: "top 85%",
            once: true,
            onEnter: function () {
              gsap.to(mobContent, {
                y: 0,
                duration: 1.0,
                ease: "power3.out",
                overwrite: "auto"
              });
            }
          });
        }
        return; // skip the rest of the loop for mob-hero
      }

      var targetSelector = "";
      if (sec.classList.contains("awareness-about-sec")) {
          targetSelector = ".avm-image-wrap, .avm-text";
      } else if (sec.classList.contains("our-vision-sec")) {
          targetSelector = ".vision-text-area, .para-text";
      } else if (sec.classList.contains("core-value-mob")) {
          var coreHeading = sec.querySelector(".main-heading");
          var coreItems = sec.querySelectorAll(".core-para");

          if (coreHeading) {
            gsap.set(coreHeading, { autoAlpha: 0, y: 70 });
            ScrollTrigger.create({
              trigger: sec,
              start: "top 85%",
              once: true,
              onEnter: function () {
                gsap.to(coreHeading, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power3.out",
                  overwrite: "auto"
                });
              }
            });
          }

          gsap.set(coreItems, { autoAlpha: 0, y: 70 });
          coreItems.forEach(function (item) {
            ScrollTrigger.create({
              trigger: item,
              start: "top 82%",
              once: true,
              onEnter: function () {
                gsap.to(item, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.72,
                  ease: "power3.out",
                  overwrite: "auto"
                });
              }
            });
          });

          return;
      } else if (sec.classList.contains("commitment-sec") || sec.classList.contains("governance-sec")) {
          targetSelector = ".image-wrapper, .content-sec";
      }
      
      var targets = sec.querySelectorAll(targetSelector);
      if (targets.length === 0) targets = [sec];

      // More vertical offset for prominent fadeInUp
      gsap.set(targets, { autoAlpha: 0, y: 100 });

      ScrollTrigger.create({
        trigger: sec,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(targets, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      });
    });
  });
})();
