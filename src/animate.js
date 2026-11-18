document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ========================================================================
     1. Scroll Reveal (Intersection Observer)
     ======================================================================== */
  const animatedElements = document.querySelectorAll(
    ".feature-card, .reveal"
  );

  if (animatedElements.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          el.classList.add("is-visible");

          // Clear initial stagger delay once the card has entered
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
     1b. FAQ Dynamic Stack-In
     ======================================================================== */
  const faqContainer = document.querySelector(".faq-container");
  const faqItems = faqContainer ? faqContainer.querySelectorAll(".faq") : [];

  if (faqContainer && faqItems.length && "IntersectionObserver" in window) {
    faqItems.forEach((item, index) => {
      item.style.setProperty("--faq-index", index);
    });

    faqContainer.classList.add("faq-stack-ready");

    const faqObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          faqContainer.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    faqObserver.observe(faqContainer);
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

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopRotation();
      } else {
        startRotation();
      }
    });

    startRotation();
  }
});