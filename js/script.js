(function () {
  "use strict";

  // ===== WhatsApp (single source of truth) =====
  const WA_PRIMARY = "5514996536743";
  const WA_DEFAULT_MSG = "Olá! Vim pelo site da TechLuvics e quero saber mais.";

  document.querySelectorAll("[data-wa]").forEach((el) => {
    const phone = el.getAttribute("data-wa-phone") || WA_PRIMARY;
    const hasMsg = el.hasAttribute("data-wa-msg");
    const msg = hasMsg ? el.getAttribute("data-wa-msg") : WA_DEFAULT_MSG;
    let url = `https://wa.me/${phone}`;
    if (msg) url += `?text=${encodeURIComponent(msg)}`;
    el.setAttribute("href", url);
    if (!el.getAttribute("target")) el.setAttribute("target", "_blank");
    if (!el.getAttribute("rel")) el.setAttribute("rel", "noopener");
  });

  // ===== Loader =====
  const loader = document.getElementById("loader");
  const hideLoader = () => {
    if (!loader || loader.classList.contains("done")) return;
    loader.classList.add("done");
  };
  window.addEventListener("load", () => setTimeout(hideLoader, 2200));
  if (document.readyState === "complete") setTimeout(hideLoader, 2200);
  // Safety: never block the page
  setTimeout(hideLoader, 4000);

  // ===== Particles =====
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, particles = [];
    const COUNT = 55;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function create() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          a: Math.random() * 0.5 + 0.15,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.a})`;
        ctx.fill();
      }

      // subtle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    resize();
    create();
    draw();
    window.addEventListener("resize", () => {
      resize();
      create();
    }, { passive: true });
  }

  // ===== Navbar scroll =====
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== Mobile menu =====
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

  // ===== Expandable service cards =====
  document.querySelectorAll(".service-card.featured").forEach((card) => {
    const btn = card.querySelector(".expand-btn");
    const detail = card.querySelector(".service-detail");
    if (!btn || !detail) return;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (open) {
        detail.classList.remove("open");
      } else {
        detail.classList.add("open");
      }
    });
  });

  // ===== FAQ accordion =====
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const open = btn.getAttribute("aria-expanded") === "true";

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

  // ===== Scroll reveal (staggered by parent group) =====
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    // Assign stagger index within each parent container
    const parents = new Map();
    reveals.forEach((el) => {
      const p = el.parentElement;
      const idx = parents.get(p) || 0;
      parents.set(p, idx + 1);
      const d = Math.min(idx, 5);
      if (d > 0) el.setAttribute("data-d", String(d));
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // ===== Soft card hover (lift + glow only — no aggressive tilt) =====
  // Handled purely by CSS for smoother performance
})();
