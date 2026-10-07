(function () {
  "use strict";

  // Navbar scroll
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Expandable service cards
  document.querySelectorAll(".service-card.featured").forEach((card) => {
    const btn = card.querySelector(".expand-btn");
    const detail = card.querySelector(".service-detail");
    if (!btn || !detail) return;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (open) {
        detail.hidden = true;
      } else {
        detail.hidden = false;
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const open = btn.getAttribute("aria-expanded") === "true";

      // Close others
      document.querySelectorAll(".faq-question").forEach((other) => {
        if (other === btn) return;
        other.setAttribute("aria-expanded", "false");
        const a = other.closest(".faq-item").querySelector(".faq-answer");
        if (a) a.hidden = true;
      });

      btn.setAttribute("aria-expanded", String(!open));
      answer.hidden = open;
    });
  });
})();
