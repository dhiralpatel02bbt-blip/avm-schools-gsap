// Careers application popup
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.querySelector(".careers-page .model-popup");
  if (!popup) return;

  const openButtons = document.querySelectorAll(".careers-page .apply-now");
  const closeButton = popup.querySelector(".model-popup-close");
  const positionSelect = popup.querySelector(".position-select");

  function syncPositionOptions() {
    if (!positionSelect) return;

    document
      .querySelectorAll(".careers-page .bbt-fa-careers-openings-sec .card h3")
      .forEach(function (heading) {
        const title = heading.textContent.trim().replace(/\s+/g, " ");
        const exists = Array.from(positionSelect.options).some(function (
          option
        ) {
          return option.textContent.trim() === title;
        });

        if (!exists) {
          const option = document.createElement("option");
          option.textContent = title;
          positionSelect.appendChild(option);
        }
      });
  }

  function openPopup(jobTitle) {
    syncPositionOptions();

    if (positionSelect && jobTitle) {
      Array.from(positionSelect.options).forEach(function (option) {
        option.selected = option.textContent.trim() === jobTitle;
      });
    }

    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");
    if (positionSelect) positionSelect.focus();
  }

  function closePopup() {
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");
  }

  openButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const card = button.closest(".card");
      const heading = card ? card.querySelector("h3") : null;
      const jobTitle = heading
        ? heading.textContent.trim().replace(/\s+/g, " ")
        : "";
      openPopup(jobTitle);
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", closePopup);
  }

  popup.addEventListener("click", function (event) {
    if (event.target === popup) closePopup();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && popup.classList.contains("is-open")) {
      closePopup();
    }
  });

  // File input change handler to show file name
  const fileInputs = document.querySelectorAll(".file-input");
  fileInputs.forEach(input => {
    input.addEventListener("change", function(e) {
      const fileName = e.target.files[0] ? e.target.files[0].name : "Upload";
      const label = document.querySelector(`label.upload-btn[for="${input.id}"]`);
      if (label) {
        label.textContent = fileName;
      }
    });
  });

  // Form submission and validation
  const applicationForm = document.getElementById("applicationForm");
  const formMessage = document.getElementById("form-message");

  if (applicationForm) {
    applicationForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Reset message
      formMessage.style.display = "none";
      formMessage.textContent = "";
      formMessage.className = "form-message";

      // Basic validation
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const position = document.getElementById("position").value;

      if (!position || position === "Position applying for") {
        showMessage("Please select a position.", "error");
        return;
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        showMessage("Please enter a valid 10-digit phone number.", "error");
        return;
      }

      // Simple but effective regex for email @ . and TLD validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }

      // Prepare form data
      const formData = new FormData(applicationForm);
      
      // Update button to show loading
      const submitBtn = applicationForm.querySelector(".submit-btn");
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      fetch("submit_careers.php", {
        method: "POST",
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

        if (data.success) {
          showMessage(data.message, "success");
          applicationForm.reset();
        } else {
          showMessage(data.message, "error");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        showMessage("An error occurred while submitting the form. Please try again later.", "error");
      });
    });

    function showMessage(msg, type) {
      formMessage.textContent = msg;
      formMessage.style.display = "block";
      if (type === "success") {
        formMessage.style.backgroundColor = "#d4edda";
        formMessage.style.color = "#155724";
        formMessage.style.border = "1px solid #c3e6cb";
      } else {
        formMessage.style.backgroundColor = "#f8d7da";
        formMessage.style.color = "#721c24";
        formMessage.style.border = "1px solid #f5c6cb";
      }
    }
  }
});

// Careers hero + about scroll animation
(function initCareersHeroAnimation() {
  if (!document.querySelector("body.careers-page")) return;

  const hero = document.querySelector(".careers-page .hero");
  const heroCircle = document.querySelector(".careers-page .hero-circle");
  const heroContent = document.querySelector(".careers-page .hero-content");
  const about = document.querySelector(
    ".careers-page .bbt-fa-careers-about-sec"
  );
  const aboutWrapper = document.querySelector(
    ".careers-page .bbt-fa-careers-about-sec .career-wrapper"
  );
  const aboutImage = document.querySelector(
    ".careers-page .bbt-fa-careers-about-sec .avm-image-wrap"
  );
  const aboutText = document.querySelector(
    ".careers-page .bbt-fa-careers-about-sec .avm-text"
  );
  const openingsSec = document.querySelector(
    ".careers-page .bbt-fa-careers-openings-sec"
  );

  if (!hero || !heroCircle || !heroContent || typeof gsap === "undefined") {
    return;
  }

  function init() {
    if (window.innerWidth < 992) {
      gsap.set([heroCircle, heroContent, aboutWrapper, aboutImage, aboutText], {
        clearProps: "all",
      });
      if (openingsSec) gsap.set(openingsSec, { clearProps: "all" });
      return;
    }

    gsap.set(heroCircle, {
      x: "-54vw",
      scale: 1,
      transformOrigin: "50% 50%",
    });
    gsap.set(heroContent, { autoAlpha: 0, x: -180 });

    if (about && aboutWrapper && aboutImage && aboutText) {
      gsap.set(aboutWrapper, { opacity: 1 });
      gsap.set(aboutImage, { autoAlpha: 0, x: -120 });
      gsap.set(aboutText, { autoAlpha: 0, x: 120 });
    }

    function initScrollAnimations() {
      if (typeof ScrollTrigger === "undefined") return;

      if (openingsSec) {
        gsap.set(openingsSec, {
          marginTop: "110vh",
          position: "relative",
          zIndex: 5,
          backgroundColor: "#fff",
        });
      }

      const deskFooter = document.querySelector(
        ".bbt-FA-main-footer.desk-footer"
      );
      if (deskFooter && openingsSec) {
        // Ensure hero covers the fixed footer
        gsap.set(hero, { zIndex: 4, position: "relative" });
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=210%",
            pin: true,
            pinSpacing: false,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(
          heroContent,
          { autoAlpha: 0, x: -180, duration: 0.34, ease: "power2.inOut" },
          0.12
        )
        .to(
          heroCircle,
          {
            scale: 2.45,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          aboutImage,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.42,
            ease: "power3.out",
          },
          0.72
        )
        .to(
          aboutText,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.42,
            ease: "power3.out",
          },
          0.8
        )
        .set({}, {}, 2.33);
    }

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        onComplete: initScrollAnimations,
      })
      .to(heroCircle, { x: 0, duration: 1.15 })
      .fromTo(
        heroContent,
        { autoAlpha: 0, x: -180 },
        { autoAlpha: 1, x: 0, duration: 0.95 },
        "+=0.02"
      );
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init, { once: true });
  }
})();

// Footer Reveal Effect Setup
(function initFooterReveal() {
  var deskFooter = document.querySelector(
    ".careers-page .bbt-FA-main-footer.desk-footer"
  );
  var openingsSec = document.querySelector(
    ".careers-page .bbt-fa-careers-openings-sec"
  );
  var hero = document.querySelector(".careers-page .hero");

  if (!deskFooter || !openingsSec) return;

  function updateFooterMargin() {
    if (window.innerWidth >= 992) {
      gsap.set(deskFooter, {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: -1,
      });
      if (hero) gsap.set(hero, { zIndex: 4, position: "relative" });
      gsap.set(openingsSec, {
        marginBottom: deskFooter.offsetHeight,
        backgroundColor: "#fff",
      });
    } else {
      gsap.set(deskFooter, { clearProps: "all" });
      if (hero) gsap.set(hero, { clearProps: "zIndex,position" });
      gsap.set(openingsSec, { marginBottom: 0, backgroundColor: "" });
    }
  }

  window.addEventListener("resize", updateFooterMargin);
  window.addEventListener("load", updateFooterMargin);

  updateFooterMargin();
  setTimeout(updateFooterMargin, 500);
})();
