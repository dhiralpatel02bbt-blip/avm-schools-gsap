const fs = require('fs');

const path = 'd:/Aspire-Designs/AVM/AVM-final-website/avm-final-v3/avm/assets/script.js';
const lines = fs.readFileSync(path, 'utf8').split('\n');

// Find the start of initFooterReveal
const startIndex = lines.findIndex(line => line.includes('(function initFooterReveal() {'));

if (startIndex === -1) {
  console.error("Could not find initFooterReveal");
  process.exit(1);
}

// Keep everything before initFooterReveal
const goodLines = lines.slice(0, startIndex);

const newLines = `(function initFooterReveal() {
  var wrapper = document.querySelector(".main-content-wrapper");
  var overlapFooter = document.querySelector(".overlap-footer");

  if (!wrapper || !overlapFooter) return;

  let mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    Object.assign(wrapper.style, {
      position: "relative",
      zIndex: "10",
    });

    Object.assign(overlapFooter.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      zIndex: "-1",
      transform: "none",
    });

    function updateFooterMargin() {
      wrapper.style.marginBottom = overlapFooter.offsetHeight + "px";
    }

    window.addEventListener("resize", updateFooterMargin);
    window.addEventListener("load", updateFooterMargin);

    updateFooterMargin();
    setTimeout(updateFooterMargin, 500);

    // Parallax effect: moves footer upwards while becoming visible
    gsap.fromTo(overlapFooter,
      { yPercent: 80 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "bottom bottom",
          end: "max",
          scrub: true
        }
      }
    );

    // Animate each column one after the other
    const footerColumns = overlapFooter.querySelectorAll(".contact-sec .content, .contact-sec .image-container, .mob-contact-sec .content, .mob-contact-sec .contact-img, .bbt-FA-main-footer .ft-col-logo, .bbt-FA-main-footer .ft-col-menu, .bbt-FA-main-footer .footer-text");

    if (footerColumns.length) {
      gsap.fromTo(footerColumns,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "bottom 95%",
            once: true
          }
        }
      );
    }

    return () => {
      window.removeEventListener("resize", updateFooterMargin);
      window.removeEventListener("load", updateFooterMargin);
      wrapper.style.marginBottom = "";
      Object.assign(wrapper.style, { position: "", zIndex: "" });
      Object.assign(overlapFooter.style, {
        position: "",
        bottom: "",
        left: "",
        width: "",
        zIndex: "",
        transform: "",
      });
    };
  });
})();

// ============================================================
// MOBILE SCHOOL INFO SECTION (bbt-FA-img-sec-mobile)
// ============================================================
(function initMobileSchoolInfo() {
  const mobileSec = document.querySelector(".bbt-FA-img-sec-mobile");
  if (!mobileSec) return;

  gsap.set(mobileSec, { autoAlpha: 0, y: 30 });

  ScrollTrigger.create({
    trigger: mobileSec,
    start: "top 75%",
    once: true,
    onEnter: () => {
      gsap.to(mobileSec, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  });
})();

// ============================================================
// PARALLAX OVERLAP BETWEEN BUBBLE SEC AND IMG SEC
// ============================================================
(function initImgSecParallax() {
  const imgSec = document.querySelector(".bbt-FA-img-sec");
  const circleSec = document.querySelector(".bbt-FA-circle-sec");

  if (!circleSec || !imgSec) return;

  let mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    const track = circleSec.querySelector(".slides-track");
    if (track) {
      gsap.to(track, {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: imgSec,
          start: "top bottom",
          end: "top 30%",
          scrub: true,
        }
      });
    }

    gsap.fromTo(imgSec,
      { y: 150 },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: imgSec,
          start: "top bottom",
          end: "top 30%",
          scrub: true,
        }
      }
    );

    return () => {
      if (track) gsap.set(track, { clearProps: "y" });
      gsap.set(imgSec, { clearProps: "y" });
    };
  });
})();

// ============================================================
// PARALLAX AND CLIP-MASK FOR RECOGNITION SECTION
// ============================================================
(function initRecognitionParallax() {
  const recSec = document.querySelector(".recognition-sec");
  const imgSec = document.querySelector(".bbt-FA-img-sec");
  const imgSecMobile = document.querySelector(".bbt-FA-img-sec-mobile");
  const newsSec = document.querySelector(".news-section");

  if (!recSec) return;

  const recContent = recSec.querySelector(".container-xxl");

  let mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    gsap.set(recSec, {
      marginTop: "-100vh", 
      "--rec-mask-top": "100%",
      clipPath: "inset(var(--rec-mask-top) 0% 0% 0%)",
      zIndex: 10
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: recSec,
        start: "top top",
        end: "+=2000",
        pin: true,
        scrub: true,
      }
    });

    tl.to(recSec, {
      "--rec-mask-top": "0%",
      ease: "none",
      duration: 0.3
    }, 0);

    if (recContent) {
      tl.fromTo(recContent, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.15 }, 0);
      tl.fromTo(recContent, { y: 400 }, { y: 0, ease: "none", duration: 0.3 }, 0);
    }

    if (imgSec) {
      tl.to(imgSec, { y: -400, ease: "none", duration: 0.25 }, 0.05);
    }
    if (imgSecMobile) {
      tl.to(imgSecMobile, { y: -400, ease: "none", duration: 0.25 }, 0.05);
    }
    if (newsSec) {
      tl.to(newsSec, { y: -400, ease: "none", duration: 0.25 }, 0.05);
    }
    
    tl.to({}, { duration: 0.7 });

    return () => {
      gsap.set(recSec, { clearProps: "marginTop,clipPath,zIndex,--rec-mask-top" });
      if (imgSec) gsap.set(imgSec, { clearProps: "y" });
      if (imgSecMobile) gsap.set(imgSecMobile, { clearProps: "y" });
      if (newsSec) gsap.set(newsSec, { clearProps: "y" });
      if (recContent) gsap.set(recContent, { clearProps: "y" });
    };
  });
})();

// ============================================================
// MOBILE HORIZONTAL SECTION FADE IN UP
// ============================================================
(function initMobileHorizontalFadeInUp() {
  let mm = gsap.matchMedia();
  mm.add("(max-width: 767.98px)", () => {
    const mobileSec = document.querySelector(".horizontal-section-mobile");
    if (!mobileSec) return;

    const heading = mobileSec.querySelector(".yellow h2");
    const swiper = mobileSec.querySelector(".horizontal-swiper");
    const cta = mobileSec.querySelector(".pedagogy-btn");

    const elementsToAnimate = [];
    if (heading) elementsToAnimate.push(heading);
    if (swiper) elementsToAnimate.push(swiper);
    if (cta) elementsToAnimate.push(cta);

    if (elementsToAnimate.length === 0) return;

    gsap.set(elementsToAnimate, { y: 50, autoAlpha: 0 });

    ScrollTrigger.create({
      trigger: mobileSec,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(elementsToAnimate, {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          overwrite: "auto"
        });
      }
    });
  });
})();

// Footer Dropdown Toggle Logic
(function initFooterDropdown() {
  const toggles = document.querySelectorAll(".loginDropdownToggle");
  
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const body = toggle.nextElementSibling;
      if (body && body.classList.contains("loginDropdownBody")) {
        toggle.classList.toggle("active");
        body.classList.toggle("open");
      }
    });
  });
})();
`;

fs.writeFileSync(path, goodLines.join('\\n') + '\\n' + newLines);
console.log("Fixed script.js");
