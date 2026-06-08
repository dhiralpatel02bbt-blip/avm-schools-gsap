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
    window.removeEventListener("wheel", stopInitialHeroScroll);
    window.removeEventListener("touchmove", stopInitialHeroScroll);
    window.removeEventListener("keydown", stopInitialHeroScroll, false);
    window.removeEventListener("scroll", keepAtHeroTop);
    aboutBody.classList.remove("about-hero-loading");
    keepAtHeroTop();
  }

  lockInitialHeroScroll();

  function initMobileStickyButton() {
    var contactSection = document.querySelector(".contact-sec");
    var stickyButton = document.querySelector(".mob-sticky-btn");
    if (!contactSection || !stickyButton) return;

    function updateMobileStickyButton() {
      if (window.innerWidth > 767) {
        aboutBody.classList.remove("about-hide-mob-sticky");
        return;
      }

      var contactTop = contactSection.getBoundingClientRect().top;
      aboutBody.classList.toggle(
        "about-hide-mob-sticky",
        contactTop <= window.innerHeight
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
      fallbackCommitmentText.style.transform = "translateX(-130px)";
      fallbackCommitmentText.style.transition =
        "opacity 1.05s ease, transform 1.05s cubic-bezier(0.16, 1, 0.3, 1)";
      fallbackCommitmentImage.style.opacity = "0";
      fallbackCommitmentImage.style.transform = "translateX(150px)";
      fallbackCommitmentImage.style.transition =
        "opacity 1.05s ease 0.12s, transform 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.12s";
    }

    if (fallbackGovernanceText && fallbackGovernanceImage) {
      fallbackGovernanceImage.style.opacity = "0";
      fallbackGovernanceImage.style.transform = "translateX(-150px)";
      fallbackGovernanceImage.style.transition =
        "opacity 1.35s ease, transform 1.35s cubic-bezier(0.16, 1, 0.3, 1)";
      fallbackGovernanceText.style.opacity = "0";
      fallbackGovernanceText.style.transform = "translateX(130px)";
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
        fallbackYellow.style.transform = "translateY(0) scale(0.96)";
      }
      if (fallbackStudent) {
        fallbackStudent.style.opacity = "1";
        fallbackStudent.style.transform = "translateX(0)";
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
          fallbackCommitmentText.style.transform = "translateX(0)";
          fallbackCommitmentImage.style.opacity = "1";
          fallbackCommitmentImage.style.transform = "translateX(0)";
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
          fallbackCommitmentText.style.transform = "translateX(-130px)";
          fallbackCommitmentImage.style.opacity = "0";
          fallbackCommitmentImage.style.transform = "translateX(150px)";
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
          fallbackGovernanceImage.style.opacity = "1";
          fallbackGovernanceImage.style.transform = "translateX(0)";
          fallbackGovernanceText.style.opacity = "1";
          fallbackGovernanceText.style.transform = "translateX(0)";
        }
      } else if (
        governanceShown &&
        fallbackGovernance &&
        fallbackGovernance.getBoundingClientRect().top >
          window.innerHeight * 0.78
      ) {
        governanceShown = false;
        if (fallbackGovernanceText && fallbackGovernanceImage) {
          fallbackGovernanceImage.style.opacity = "0";
          fallbackGovernanceImage.style.transform = "translateX(-150px)";
          fallbackGovernanceText.style.opacity = "0";
          fallbackGovernanceText.style.transform = "translateX(130px)";
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
      anticipatePin: 1,
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
    if (yellowCircle) gsap.set(yellowCircle, { y: 0, scale: 0.96, opacity: 1 });
    if (studentImage) gsap.set(studentImage, { x: 0, opacity: 1 });

    window.setTimeout(function () {
      unlockInitialHeroScroll();
      if (titleHeading) gsap.set(titleHeading, { x: 0, autoAlpha: 1 });
      if (titleBody) gsap.set(titleBody, { x: 0, autoAlpha: 1 });
      gsap.set(circle, { x: 0, scale: 1 });
      if (yellowCircle) gsap.set(yellowCircle, { y: 0, scale: 0.96, opacity: 1 });
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
      .to(
        awarenessImage,
        { y: 0, autoAlpha: 1, duration: 0.85 },
        0
      )
      .to(
        awarenessText,
        { y: 0, autoAlpha: 1, duration: 0.85 },
        0.12
      )
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
      anticipatePin: 1,
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
        duration: 1.45,
      })
      .to(visionLeft, {
        x: 0,
        autoAlpha: 1,
        duration: 0.65,
        ease: "power3.out",
      })
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
      .to({}, { duration: 0.45 });

    visionRadialTrigger = ScrollTrigger.create({
      trigger: visionSection,
      start: "top top",
      end: "+=260%",
      pin: visionSection,
      pinSpacing: true,
      anticipatePin: 1,
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
        gsap.set(item.text.querySelectorAll("h3, p"), { autoAlpha: 0, x: 40 });
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
      scaleY: 0,
      transformOrigin: "top center",
    });

    // Phase 0 (0–0.12): white circle grows in
    masterTL.to(
      whiteCircle,
      { scale: 1, autoAlpha: 1, duration: 0.12, ease: "back.out(1.4)" },
      0
    );
    if (circleHeading) {
      masterTL.to(
        circleHeading,
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.08
      );
    }
    if (circleSubtitle) {
      masterTL.to(
        circleSubtitle,
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.11
      );
    }

    // Phase 1 (0.14–0.22): dot 1 pops + text 1 slides in
    items.forEach(function (item, index) {
      var itemStart = 0.08 + index * 0.18;
      var itemY = itemPositions[index].y;
      var lineProgress = itemPositions[index].lineProgress;

      masterTL.to(
        textWrapper,
        {
          y: itemY,
          duration: index === 0 ? 0.01 : 0.1,
          ease: "power1.inOut",
        },
        itemStart - 0.03
      );

      masterTL.to(
        animLine,
        {
          scaleY: Math.max(0, Math.min(1, lineProgress)),
          duration: index === 0 ? 0.01 : 0.12,
          ease: "power1.inOut",
        },
        itemStart
      );

      if (item.dot) {
        masterTL.to(
          item.dot,
          { scale: 1, autoAlpha: 1, duration: 0.06, ease: "back.out(2)" },
          itemStart + 0.03
        );
      }

      masterTL.to(
        item.text.querySelectorAll("h3, p"),
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.08,
          ease: "power3.out",
          stagger: 0.02,
        },
        itemStart + 0.06
      );
    });

    // ── ScrollTrigger: pin the section, scrub the timeline ──────────────────
    // Extra scroll space = 3× viewport heights so each phase gets room
    masterTL.to(animLine, {
      scaleY: 1,
      duration: 0.1,
      ease: "power1.inOut",
    });

    // Let the final line settle before ScrollTrigger releases the pinned section.
    masterTL.to({}, { duration: 0.18 });

    coreValuesTrigger = ScrollTrigger.create({
      trigger: coreSection,
      start: "top top",
      end: "+=" + Math.max(300, items.length * 90) + "%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
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
      scaleY: 0,
      transformOrigin: "top center",
    });
    gsap.set(dots, {
      scale: 0,
      autoAlpha: 0,
      transformOrigin: "center center",
    });
    gsap.set(textNodes, { autoAlpha: 0, x: 28 });

    var mobileTL = gsap.timeline({ paused: true });

    items.forEach(function (item, index) {
      var itemStart = index * 0.18;
      var itemText = item.querySelectorAll(".value-para h3, .value-para p");
      var dot = item.querySelector(".timeline-dot");

      mobileTL.to(
        textWrapper,
        {
          y: itemPositions[index].y,
          duration: index === 0 ? 0.01 : 0.1,
          ease: "power1.inOut",
        },
        itemStart
      );

      mobileTL.to(
        animLine,
        {
          scaleY: Math.max(0, Math.min(1, itemPositions[index].lineProgress)),
          duration: index === 0 ? 0.01 : 0.12,
          ease: "power1.inOut",
        },
        itemStart + 0.01
      );

      if (dot) {
        mobileTL.to(
          dot,
          { scale: 1, autoAlpha: 1, duration: 0.06, ease: "back.out(2)" },
          itemStart + 0.03
        );
      }

      mobileTL.to(
        itemText,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.08,
          ease: "power3.out",
          stagger: 0.02,
        },
        itemStart + 0.05
      );

      if (index > 0) {
        var previousText = items[index - 1].querySelectorAll(
          ".value-para h3, .value-para p"
        );
        mobileTL.to(
          previousText,
          {
            autoAlpha: 1,
            duration: 0.08,
            ease: "power1.out",
          },
          itemStart
        );
      }

      if (index > 1) {
        var olderText = items[index - 2].querySelectorAll(
          ".value-para h3, .value-para p"
        );
        mobileTL.to(
          olderText,
          {
            autoAlpha: 0,
            duration: 0.08,
            ease: "power1.out",
          },
          itemStart
        );
      }
    });

    mobileTL.to(animLine, {
      scaleY: 1,
      duration: 0.1,
      ease: "power1.inOut",
    });
    mobileTL.to({}, { duration: 0.16 });

    coreValuesTrigger = ScrollTrigger.create({
      trigger: mobileSection,
      start: "top top",
      end: "+=" + Math.max(320, items.length * 95) + "%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: true,
      invalidateOnRefresh: true,
      animation: mobileTL,
    });
  }

  function initCommitment() {
    if (!commitmentSection || !commitmentText || !commitmentImage) return;

    gsap.killTweensOf([commitmentSection, commitmentText, commitmentImage]);

    // Cross-fade: section background fades from blue to white as it enters
    gsap.set(commitmentSection, { backgroundColor: "#0a3d9c" });

    // Image wipe: clip-path reveal left-to-right
    gsap.set(commitmentImage, {
      clipPath: "inset(0 100% 0 0)",
      force3D: true,
      willChange: "clip-path",
    });

    // Text: slide in from left
    gsap.set(commitmentText, {
      x: -130,
      autoAlpha: 0,
      force3D: true,
      willChange: "transform, opacity",
    });

    var commitmentTL = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    commitmentTL
      // Cross-fade background blue → white over the first half of the scrub
      .to(
        commitmentSection,
        { backgroundColor: "#ffffff", duration: 0.5, ease: "none" },
        0
      )
      // Text slides in
      .to(commitmentText, { x: 0, autoAlpha: 1, duration: 1.05 }, 0.15)
      // Image wipes in left → right, slightly after text
      .to(
        commitmentImage,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          ease: "power2.inOut",
        },
        0.25
      )
      .set([commitmentText, commitmentImage], { clearProps: "willChange" });

    commitmentTrigger = ScrollTrigger.create({
      trigger: commitmentSection,
      start: "top 15%", // ← was "top 72%", now waits until section is near top
      end: "top -20%", // ← was "top 42%"
      animation: commitmentTL,
      scrub: 0.7,
      invalidateOnRefresh: true,
    });
  }

  function initGovernance() {
    if (!governanceSection || !governanceText || !governanceImage) return;

    gsap.killTweensOf([governanceImage, governanceText]);

    // Image wipe: reveal right-to-left (since image is on the left side)
    gsap.set(governanceImage, {
      clipPath: "inset(0 0 0 100%)",
      force3D: true,
      willChange: "clip-path",
    });

    gsap.set(governanceText, {
      x: 130,
      autoAlpha: 0,
      force3D: true,
      willChange: "transform, opacity",
    });

    var governanceTL = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    governanceTL
      // Image wipes in right → left
      .to(
        governanceImage,
        {
          clipPath: "inset(0 0 0 0%)",
          duration: 1.1,
          ease: "power2.inOut",
        },
        0
      )
      // Text slides in from right
      .to(governanceText, { x: 0, autoAlpha: 1, duration: 1.35 }, 0.16)
      .set([governanceImage, governanceText], { clearProps: "willChange" });

    governanceTrigger = ScrollTrigger.create({
      trigger: governanceSection,
      start: "top 15%",
      end: "top -20%",
      animation: governanceTL,
      scrub: 1.15,
      invalidateOnRefresh: true,
    });
  }

  function init() {
    killTriggers();

    if (window.innerWidth < 768) {
      window.setTimeout(unlockInitialHeroScroll, 2750);
      initCoreValuesMobile();
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
