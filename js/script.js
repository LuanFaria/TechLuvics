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
    const isMobile = window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
    const COUNT = isMobile ? 28 : 55;

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
    var mobile = window.innerWidth <= 768;
    var cardW = mobile ? 160 : 200;
    var radius = Math.max(mobile ? 280 : 360, (cardW + (mobile ? 40 : 80)) / (2 * Math.sin(Math.PI / n)));
    var angle = 0;
    // mobile: mais rápido (menos “travado”); desktop continua legível
    var speed = mobile ? 0.14 : 0.05;
    var paused = false;
    var dragging = false;
    var lastX = 0;
    var vel = 0;
    var onScreen = true;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function layout() {
      mobile = window.innerWidth <= 768;
      cardW = mobile ? 160 : 200;
      radius = Math.max(mobile ? 280 : 360, (cardW + (mobile ? 40 : 80)) / (2 * Math.sin(Math.PI / Math.max(n, 3))));
      speed = mobile ? 0.14 : 0.05;
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
      if (!onScreen) {
        requestAnimationFrame(tick);
        return;
      }
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

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          onScreen = entries[0] && entries[0].isIntersecting;
        },
        { threshold: 0.05 }
      );
      io.observe(root);
    }

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
    var isMobile =
      (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
    // No celular: título HTML estático (muito mais leve)
    if (reduced || isMobile) return;

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
        ctx.fillStyle = ACCENT; /* ciano sólido, mesmo tom do badge */
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
      var mobileP =
        window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
      var COUNT = mobileP
        ? card.classList.contains("benefit-card")
          ? 22
          : 16
        : card.classList.contains("benefit-card")
          ? 55
          : 40;

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


  // ===== Bounce cards (sites) — 3 em cima + 2 embaixo, dentro do card =====
  (function () {
    var root = document.querySelector("[data-bounce]");
    if (!root) return;
    var els = Array.prototype.slice.call(root.querySelectorAll(".bounce-cards__card"));
    if (!els.length) return;

    var PATTERN = [1, 0.5, -0.3, -1, 0.2];
    var count = els.length;
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var hoverScale = 1.04;
    var bounciness = 0.55;
    var delay = 0.35;
    var stagger = 0.06;
    var pushDistance = 12; // menor no mobile para não sair do card

    function layoutSlots() {
      var w = root.clientWidth || window.innerWidth;
      // Escala pelo espaço real do container — evita cortar no celular
      var cardSize = Math.round(Math.min(150, Math.max(78, w * 0.28)));
      var gapX = Math.round(Math.min(cardSize * 0.72, (w - cardSize) * 0.38));
      var gapY = Math.round(cardSize * 0.72);
      var topY = -gapY * 0.52;
      var botY = gapY * 0.52;
      var half = cardSize / 2;
      var maxX = Math.max(0, w / 2 - half - 6);
      if (gapX > maxX) gapX = maxX;
      var positions = [
        { x: -gapX, y: topY },
        { x: 0, y: topY },
        { x: gapX, y: topY },
        { x: -gapX * 0.55, y: botY },
        { x: gapX * 0.55, y: botY }
      ];
      root.style.setProperty("--bounce-cards-size", cardSize + "px");
      root.style.height = Math.round(cardSize * 2.15 + 24) + "px";
      return positions.map(function (p, i) {
        return {
          x: p.x,
          y: p.y,
          rotate: 6 * PATTERN[i % PATTERN.length],
          size: cardSize
        };
      });
    }

    var slots = layoutSlots();
    var cardSize = slots[0].size;

    var bodies = els.map(function (_, i) {
      return {
        x: slots[i].x,
        y: slots[i].y,
        rotate: slots[i].rotate,
        scale: reduce ? 1 : 0,
        vx: 0,
        vy: 0,
        vr: 0,
        vs: 0,
        born: 0
      };
    });

    var state = { hovered: -1, time: 0, layer: -1 };
    var raf = 0;
    var last = performance.now();
    var alive = true;

    function step(value, velocity, target, stiffness, damping, dt) {
      var next = velocity + ((target - value) * stiffness - velocity * damping) * dt;
      return [value + next * dt, next];
    }

    function frame(now) {
      raf = 0;
      if (!alive) return;
      var dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
      last = now;
      state.time += dt;

      var hovered = state.hovered;
      var popStiffness = 170;
      var popDamping = 2 * (1 - 0.85 * bounciness) * Math.sqrt(popStiffness);
      var moveStiffness = 220;
      var moveDamping = 2 * (reduce ? 1 : 0.72) * Math.sqrt(moveStiffness);
      var substeps = Math.ceil(dt / (1 / 240));
      var h = dt / substeps;
      var moving = 0;

      for (var i = 0; i < count; i++) {
        var el = els[i];
        var card = bodies[i];
        var slot = slots[i];
        var appeared = reduce || state.time - card.born >= delay + i * stagger;
        var targetX = slot.x;
        var targetY = slot.y;
        var targetRotate = slot.rotate;
        var targetScale = appeared ? 1 : 0;
        if (hovered >= 0 && appeared) {
          if (i === hovered) {
            targetY = slot.y - 10;
            targetRotate = 0;
            targetScale = hoverScale;
          } else {
            // leve afastamento sem sair do card
            var dx = slot.x - slots[hovered].x;
            var dy = slot.y - slots[hovered].y;
            var len = Math.sqrt(dx * dx + dy * dy) || 1;
            targetX = slot.x + (dx / len) * pushDistance;
            targetY = slot.y + (dy / len) * (pushDistance * 0.35);
          }
        }
        for (var k = 0; k < substeps; k++) {
          var sx = step(card.x, card.vx, targetX, moveStiffness, moveDamping, h);
          card.x = sx[0];
          card.vx = sx[1];
          var sy = step(card.y, card.vy, targetY, moveStiffness, moveDamping, h);
          card.y = sy[0];
          card.vy = sy[1];
          var sr = step(card.rotate, card.vr, targetRotate, moveStiffness, moveDamping, h);
          card.rotate = sr[0];
          card.vr = sr[1];
          if (reduce) {
            card.scale = targetScale;
            card.vs = 0;
          } else {
            var ss = step(card.scale, card.vs, targetScale, popStiffness, popDamping, h);
            card.scale = ss[0];
            card.vs = ss[1];
          }
        }
        moving +=
          Math.abs(card.vx) +
          Math.abs(card.vy) +
          Math.abs(card.vr) +
          Math.abs(card.vs) * 100 +
          Math.abs(targetX - card.x) +
          Math.abs(targetY - card.y) +
          (appeared ? 0 : 1);
        el.style.transform =
          "translate(-50%, -50%) translate3d(" +
          card.x.toFixed(2) +
          "px, " +
          card.y.toFixed(2) +
          "px, 0) rotate(" +
          card.rotate.toFixed(3) +
          "deg) scale(" +
          Math.max(0, card.scale).toFixed(4) +
          ")";
      }

      if (state.layer !== hovered) {
        state.layer = hovered;
        els.forEach(function (el, i) {
          el.style.zIndex = i === hovered ? String(count + 1) : String(i + 1);
          if (i === hovered) el.setAttribute("data-active", "");
          else el.removeAttribute("data-active");
        });
      }

      if (moving > 0.02) raf = requestAnimationFrame(frame);
    }

    function wake() {
      if (raf || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function pick(event) {
      var rect = root.getBoundingClientRect();
      var px = event.clientX - rect.left - rect.width / 2;
      var py = event.clientY - rect.top - rect.height / 2;
      var best = -1;
      var bestDist = Infinity;
      slots.forEach(function (slot, i) {
        var dx = px - slot.x;
        var dy = py - slot.y;
        var d = dx * dx + dy * dy;
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best < 0) return -1;
      var half = cardSize * 0.55;
      if (Math.sqrt(bestDist) > half) return -1;
      return best;
    }

    root.addEventListener("pointermove", function (e) {
      var next = pick(e);
      if (next !== state.hovered) {
        state.hovered = next;
        wake();
      }
    });
    root.addEventListener("pointerleave", function () {
      if (state.hovered !== -1) {
        state.hovered = -1;
        wake();
      }
    });

    window.addEventListener(
      "resize",
      function () {
        slots = layoutSlots();
        cardSize = slots[0].size;
        wake();
      },
      { passive: true }
    );

    if ("IntersectionObserver" in window) {
      var seen = false;
      var io = new IntersectionObserver(
        function (entries) {
          if (entries[0] && entries[0].isIntersecting && !seen) {
            seen = true;
            bodies.forEach(function (b) {
              b.born = state.time;
            });
            wake();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(root);
    } else {
      wake();
    }
  })();


  // ===== Specular rim — highlight follows the cursor =====
  (function () {
    var buttons = document.querySelectorAll(".btn:not(.btn-cyan)");
    if (!buttons.length) return;
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setAngle(btn, deg) {
      btn.style.setProperty("--sb-angle", deg.toFixed(1) + "deg");
    }

    buttons.forEach(function (btn) {
      setAngle(btn, 28);
    });

    if (reduce) return;

    window.addEventListener(
      "pointermove",
      function (e) {
        for (var i = 0; i < buttons.length; i++) {
          var btn = buttons[i];
          var r = btn.getBoundingClientRect();
          var cx = r.left + r.width / 2;
          var cy = r.top + r.height / 2;
          var dx = e.clientX - cx;
          var dy = e.clientY - cy;
          var dist = Math.hypot(dx, dy);
          var reach = 250 + Math.max(r.width, r.height) * 0.5;
          if (dist > reach) continue;
          var pointer = (Math.atan2(dx, -dy) * 180) / Math.PI;
          setAngle(btn, pointer - 110);
        }
      },
      { passive: true }
    );
  })();
