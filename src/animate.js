document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ========================================================================
     1. Scroll Reveal (Intersection Observer)
     ======================================================================== */
  const animatedElements = document.querySelectorAll(
    ".feature-card, .faq, .reveal"
  );

  if (animatedElements.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          el.classList.add("is-visible");

          // Clear stagger transition-delay after entrance finishes so hover/active states respond instantly
          el.addEventListener(
            "transitionend",
            () => el.classList.add("has-entered"),
            { once: true }
          );

          obs.unobserve(el);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    animatedElements.forEach((el) => {
      el.classList.add("animate-ready");
      observer.observe(el);
    });
  }

  /* ========================================================================
     2. Smooth Anchor Scrolling
     ======================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  /* ========================================================================
     3. Feature Cards Auto-Rotation (3s Loop)
     ======================================================================== */
  const cardsContainer = document.querySelector(".feature-cards");
  const cards = document.querySelectorAll(".feature-card");

  if (cards.length) {
    let currentIndex = Array.from(cards).findIndex((card) =>
      card.classList.contains("active")
    );
    if (currentIndex === -1) currentIndex = 0;

    let timer = null;
    let isPaused = false;

    const setActiveCard = (index) => {
      cards.forEach((card) => card.classList.remove("active"));
      cards[index].classList.add("active");
      currentIndex = index;
    };

    const stopRotation = () => {
      clearInterval(timer);
      timer = null;
    };

    const startRotation = () => {
      stopRotation();
      if (!isPaused && !document.hidden) {
        timer = setInterval(() => {
          setActiveCard((currentIndex + 1) % cards.length);
        }, 3000);
      }
    };

    if (cardsContainer) {
      cardsContainer.addEventListener("mouseenter", () => {
        isPaused = true;
        stopRotation();
      });

      cardsContainer.addEventListener("mouseleave", () => {
        isPaused = false;
        startRotation();
      });
    }

    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        setActiveCard(index);
        startRotation();
      });
    });

    // Pause timer when tab is hidden to prevent queued jumps
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopRotation();
      } else {
        startRotation();
      }
    });

    startRotation();
  }

  /* ========================================================================
     4. Hero Student Cutout Scroll Parallax
     ======================================================================== */
  const heroStudents = document.querySelector(".hero--inner-feature");

  if (heroStudents && !prefersReducedMotion) {
    // Release CSS keyframe fill-mode lock after entrance so inline transform works
    heroStudents.addEventListener(
      "animationend",
      () => {
        heroStudents.style.animation = "none";
      },
      { once: true }
    );

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;

        window.requestAnimationFrame(() => {
          const offset = Math.min(window.scrollY * 0.08, 30);
          heroStudents.style.transform = `translateY(-${offset}px)`;
          ticking = false;
        });
      },
      { passive: true }
    );
  }
});