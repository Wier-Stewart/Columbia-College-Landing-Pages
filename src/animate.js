document.addEventListener("DOMContentLoaded", () => {
  // Select any elements you want to animate on scroll
  const animatedElements = document.querySelectorAll(".feature-card, .faq, .reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // Play animation only once
        }
      });
    },
    {
      threshold: 0.15, // Trigger when 15% of the element is visible
      rootMargin: "0px 0px -40px 0px" // Trigger slightly after crossing the bottom edge
    }
  );

  animatedElements.forEach((el) => {
    el.classList.add("animate-ready");
    observer.observe(el);
  });
});