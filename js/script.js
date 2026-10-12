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



  // ===== Circular carousel 3D (Outras soluções) =====
  (function () {
    var root = document.getElementById("outrasCarousel");
    if (!root) return;
    var ring = root.querySelector(".cc-ring");
    var cards = root.querySelectorAll(".cc-card");
    var prev = root.querySelector(".cc-prev");
    var next = root.querySelector(".cc-next");
    if (!ring || !cards.length) return;

    var n = cards.length;
    var step = 360 / n;
    var cardW = window.innerWidth <= 720 ? 170 : 200;
    var radius = Math.max(360, (cardW + 80) / (2 * Math.sin(Math.PI / n)));
    var angle = 0;
    var speed = 0.045; // bem lento para dar tempo de ler
    var paused = false;
    var dragging = false;
    var lastX = 0;
    var vel = 0;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function layout() {
      cardW = window.innerWidth <= 720 ? 170 : 200;
      radius = Math.max(360, (cardW + 80) / (2 * Math.sin(Math.PI / Math.max(n, 3))));
      for (var i = 0; i < n; i++) {
        var a = i * step;
        cards[i].style.transform =
          "rotateY(" + a + "deg) translateZ(" + radius + "px)";
      }
    }

    function render() {
      ring.style.transform = "translateZ(" + (-radius * 0.2) + "px) rotateY(" + angle + "deg)";
    }

    function tick() {
      if (!reduced && !paused && !dragging) {
        angle += speed + vel;
        vel *= 0.95;
        if (Math.abs(vel) < 0.01) vel = 0;
      } else if (!dragging) {
        vel *= 0.92;
        angle += vel;
      }
      render();
      requestAnimationFrame(tick);
    }

    layout();
    render();
    if (!reduced) requestAnimationFrame(tick);
    else render();

    window.addEventListener("resize", function () {
      layout();
      render();
    }, { passive: true });

    root.addEventListener("mouseenter", function () { paused = true; });
    root.addEventListener("mouseleave", function () { paused = false; });

    // Drag
    ring.style.cursor = "grab";
    function onDown(e) {
      dragging = true;
      lastX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      vel = 0;
      ring.style.cursor = "grabbing";
    }
    function onMove(e) {
      if (!dragging) return;
      var x = e.clientX != null ? e.clientX : (e.touches && e.touches[0].clientX);
      if (x == null) return;
      var dx = x - lastX;
      lastX = x;
      var delta = dx * 0.25;
      angle += delta;
      vel = delta;
    }
    function onUp() {
      dragging = false;
      ring.style.cursor = "grab";
    }
    ring.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    ring.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    function stepBy(dir) {
      paused = true;
      angle += dir * step;
      render();
      setTimeout(function () { paused = false; }, 1200);
    }
    if (next) next.addEventListener("click", function () { stepBy(-1); });
    if (prev) prev.addEventListener("click", function () { stepBy(1); });
  })();

  // ===== Hero role word cycle =====
  (function () {
    var el = document.getElementById("heroRole");
    if (!el) return;
    var words = ["entregam", "escalam", "resolvem", "conectam"];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % words.length;
      el.classList.remove("is-swap");
      void el.offsetWidth;
      el.textContent = words[i];
      el.classList.add("is-swap");
    }, 2200);
  })();



  // ===== Hero TechText (efeito letras interativas) =====
  (function () {
    var host = document.getElementById("heroTitle");
    var canvas = document.getElementById("heroTechCanvas");
    if (!host || !canvas) return;

    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    host.classList.add("is-tech");

    var LINE1 = "Deixa que a gente";
    var GRAD = "programa";
    var LINE2_REST = " pra você";
    var ACCENT = "#22d3ee";
    var COLOR = "#f1f5f9";

    var dpr = 1;
    var W = 1;
    var H = 1;
    var glyphs = [];
    var pointer = { x: 0, y: 0, inside: false };
    var focus = -1;
    var frame = { x1: 0, y1: 0, x2: 0, y2: 0, a: 0 };
    var sweepT = 0;
    var raf = 0;

    function fontSize() {
      var s = getComputedStyle(host);
      return parseFloat(s.fontSize) || 40;
    }

    function fontFamily() {
      return getComputedStyle(host).fontFamily || "sans-serif";
    }

    function measure() {
      var rect = host.getBoundingClientRect();
      W = Math.max(1, rect.width);
      // two lines of text
      var fs = fontSize();
      H = Math.max(fs * 2.15, fs * 2.15);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.height = H + "px";
      host.style.minHeight = H + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var size = fs;
      var weight = "700";
      var fam = fontFamily();
      ctx.font = weight + " " + size + "px " + fam;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";

      var lineGap = size * 1.12;
      var y1 = size * 0.92;
      var y2 = y1 + lineGap;
      var align = getComputedStyle(host.parentElement || host).textAlign || "left";

      glyphs = [];
      function addLine(str, y, gradientFrom) {
        var total = ctx.measureText(str).width;
        var x = align === "center" ? (W - total) / 2 : 0;
        var acc = "";
        for (var i = 0; i < str.length; i++) {
          var ch = str[i];
          var before = ctx.measureText(acc).width;
          acc += ch;
          if (!ch.trim()) continue;
          var m = ctx.measureText(ch);
          var gx = x + before;
          var isGrad =
            gradientFrom != null &&
            i >= gradientFrom &&
            i < gradientFrom + GRAD.length;
          glyphs.push({
            ch: ch,
            x: gx,
            y: y,
            w: m.width,
            h: size,
            left: gx,
            top: y - size * 0.85,
            right: gx + m.width,
            bottom: y + size * 0.2,
            gradient: isGrad,
            outline: 0
          });
        }
      }

      addLine(LINE1, y1, null);
      addLine(GRAD + LINE2_REST, y2, 0);
    }

    function nearest(px, py) {
      var best = -1;
      var bestD = 1e9;
      for (var i = 0; i < glyphs.length; i++) {
        var g = glyphs[i];
        var cx = (g.left + g.right) / 2;
        var cy = (g.top + g.bottom) / 2;
        var dx = px - cx;
        var dy = py - cy;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return bestD < 80 ? best : -1;
    }

    function drawGlyph(g, strokeOnly) {
      ctx.font = "700 " + fontSize() + "px " + fontFamily();
      ctx.textBaseline = "alphabetic";
      if (strokeOnly) {
        ctx.lineJoin = "round";
        ctx.lineWidth = 1.6;
        /* seleção: sempre ciano do tema (não preto/branco) */
        ctx.strokeStyle = ACCENT;
        ctx.setLineDash([4, 2]);
        ctx.strokeText(g.ch, g.x, g.y);
        ctx.setLineDash([]);
        return;
      }
      if (g.gradient) {
        var grd = ctx.createLinearGradient(g.left, g.top, g.right + 40, g.bottom);
        grd.addColorStop(0, "#22d3ee");
        grd.addColorStop(0.5, "#34d399");
        grd.addColorStop(1, "#a78bfa");
        ctx.fillStyle = grd;
      } else {
        ctx.fillStyle = COLOR;
      }
      ctx.fillText(g.ch, g.x, g.y);
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      var active = pointer.inside ? nearest(pointer.x, pointer.y) : -1;

      // idle sweep when pointer away
      if (!pointer.inside && glyphs.length) {
        sweepT += 0.0022;
        var idx = Math.floor((Math.sin(sweepT) * 0.5 + 0.5) * (glyphs.length - 0.01));
        active = idx;
      }
      focus = active;

      for (var i = 0; i < glyphs.length; i++) {
        var g = glyphs[i];
        var target = i === focus ? 1 : 0;
        g.outline += (target - g.outline) * 0.18;
        if (g.outline < 0.85) {
          ctx.globalAlpha = 1 - g.outline * 0.85;
          drawGlyph(g, false);
        }
        if (g.outline > 0.05) {
          ctx.globalAlpha = g.outline;
          drawGlyph(g, true);
        }
        ctx.globalAlpha = 1;
      }

      // selection frame
      if (focus >= 0) {
        var fg = glyphs[focus];
        var pad = 6;
        var tx1 = fg.left - pad;
        var ty1 = fg.top - pad;
        var tx2 = fg.right + pad;
        var ty2 = fg.bottom + pad;
        frame.x1 += (tx1 - frame.x1) * 0.25;
        frame.y1 += (ty1 - frame.y1) * 0.25;
        frame.x2 += (tx2 - frame.x2) * 0.25;
        frame.y2 += (ty2 - frame.y2) * 0.25;
        frame.a += (1 - frame.a) * 0.2;

        var a = frame.a;
        ctx.strokeStyle = "rgba(34, 211, 238," + 0.55 * a + ")";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.strokeRect(frame.x1, frame.y1, frame.x2 - frame.x1, frame.y2 - frame.y1);

        // corners
        var cs = 4;
        ctx.fillStyle = "rgba(34, 211, 238," + 0.9 * a + ")";
        [
          [frame.x1, frame.y1],
          [frame.x2, frame.y1],
          [frame.x2, frame.y2],
          [frame.x1, frame.y2]
        ].forEach(function (p) {
          ctx.fillRect(p[0] - 2, p[1] - 2, cs, cs);
        });

        // tiny specks
        for (var k = 0; k < 8; k++) {
          var t = performance.now() / 1000 + k;
          var ox = Math.cos(t * 1.7 + k) * 10;
          var oy = Math.sin(t * 2.1 + k * 0.7) * 8;
          var sx = (frame.x1 + frame.x2) / 2 + ox + ((k % 2) * 14 - 7);
          var sy = frame.y1 - 8 + oy * 0.3;
          ctx.fillStyle = "rgba(34, 211, 238," + 0.35 * a + ")";
          ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
        }

        // label
        ctx.font = "10px ui-monospace, Menlo, Consolas, monospace";
        ctx.fillStyle = "rgba(34, 211, 238," + 0.65 * a + ")";
        ctx.textBaseline = "bottom";
        ctx.fillText(
          fg.ch + " " + Math.round(fg.right - fg.left) + "×" + Math.round(fg.bottom - fg.top),
          frame.x1,
          frame.y1 - 6
        );
      } else {
        frame.a += (0 - frame.a) * 0.15;
      }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.inside = true;
    }
    function onLeave() {
      pointer.inside = false;
    }

    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerenter", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave, { passive: true });

    window.addEventListener(
      "resize",
      function () {
        measure();
      },
      { passive: true }
    );

    // wait fonts then start
    function boot() {
      measure();
      if (!raf) raf = requestAnimationFrame(draw);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(boot);
    } else {
      setTimeout(boot, 100);
    }
    // after hero fade-in layout is stable
    setTimeout(boot, 600);
  })();



  // ===== Partículas densas nos benefit cards (mouse repulsion) =====
  (function () {
    var hosts = document.querySelectorAll(".benefit-card, .services-cta, .partners-card");
    if (!hosts.length) return;
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    hosts.forEach(function (card) {
      var canvas =
        card.querySelector(".benefit-particles") ||
        card.querySelector(".cta-particles") ||
        card.querySelector(".partners-particles");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      if (!ctx) return;

      var particles = [];
      var mouse = { x: -9999, y: -9999, inside: false };
      var w = 0, h = 0, dpr = 1;
      var COUNT = card.classList.contains("benefit-card") ? 55 : 40;

      function resize() {
        var rect = card.getBoundingClientRect();
        w = Math.max(1, rect.width);
        h = Math.max(1, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!particles.length) spawn();
      }

      function spawn() {
        particles = [];
        for (var i = 0; i < COUNT; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            a: Math.random() * 0.45 + 0.2
          });
        }
      }

      function tick() {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          if (mouse.inside) {
            var dx = p.x - mouse.x;
            var dy = p.y - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 90) {
              var force = (90 - dist) / 90;
              p.vx += (dx / dist) * force * 0.55;
              p.vy += (dy / dist) * force * 0.55;
            }
          }
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.x += p.vx + (Math.random() - 0.5) * 0.05;
          p.y += p.vy + (Math.random() - 0.5) * 0.05;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(34, 211, 238," + p.a + ")";
          ctx.fill();
        }
        // connections denser
        for (var a = 0; a < particles.length; a++) {
          for (var b = a + 1; b < particles.length; b++) {
            var pa = particles[a], pb = particles[b];
            var ddx = pa.x - pb.x;
            var ddy = pa.y - pb.y;
            var d = Math.sqrt(ddx * ddx + ddy * ddy);
            if (d < 70) {
              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.strokeStyle = "rgba(34, 211, 238," + (0.12 * (1 - d / 70)) + ")";
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(tick);
      }

      card.addEventListener(
        "pointermove",
        function (e) {
          var rect = card.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
          mouse.inside = true;
        },
        { passive: true }
      );
      card.addEventListener(
        "pointerleave",
        function () {
          mouse.inside = false;
          mouse.x = -9999;
          mouse.y = -9999;
        },
        { passive: true }
      );

      resize();
      window.addEventListener("resize", resize, { passive: true });
      if (!reduced) requestAnimationFrame(tick);
    });
  })();



  // ===== Holo steps (tilt + brilho no mouse) =====
  (function () {
    var cards = document.querySelectorAll(".holo-step");
    if (!cards.length) return;
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    var MAX = 10; // graus

    cards.forEach(function (card) {
      card.addEventListener(
        "pointermove",
        function (e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width;
          var y = (e.clientY - r.top) / r.height;
          var px = Math.max(0, Math.min(1, x));
          var py = Math.max(0, Math.min(1, y));
          var tiltY = (px - 0.5) * 2 * MAX;
          var tiltX = (0.5 - py) * 2 * MAX;
          card.style.setProperty("--tilt-x", tiltX.toFixed(2) + "deg");
          card.style.setProperty("--tilt-y", tiltY.toFixed(2) + "deg");
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        },
        { passive: true }
      );
      card.addEventListener(
        "pointerleave",
        function () {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
          card.style.setProperty("--mx", "50%");
          card.style.setProperty("--my", "40%");
        },
        { passive: true }
      );
    });
  })();

})();
