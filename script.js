/* ==========================================================================
   Cennzo Robotix — site behaviour
   --------------------------------------------------------------------------
   1.  Helpers
   2.  Content data
   3.  Navigation (scrolled state, mobile menu, progress bar)
   4.  Hero slider
   5.  Marquees and reveal-on-scroll
   6.  Applications list
   7.  WAFEE elements explorer (tabs + particle effects)
   8.  System diagram
   9.  Animated page background
   10. Start-up
   ========================================================================== */

"use strict";

/* ==========================================================================
   1. Helpers
   ========================================================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const prefersReducedMotion = matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const TAU = Math.PI * 2;

/** Restart a CSS animation on an element by toggling its class. */
function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth; // force reflow
  element.classList.add(className);
}

/** Size a canvas to its on-screen box, scaled for high-DPI screens. */
function fitCanvas(canvas, context, width, height) {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

/* ==========================================================================
   2. Content data
   ========================================================================== */

/** Hero slides: [eyebrow, headline, paragraph] */
const HERO_SLIDES = [
  [
    "01 — HUMANOID PLATFORM",
    "WAFEE",
    "Unified multi-environment humanoid platform, engineered for demanding operations.",
  ],
  [
    "02 — BEYOND THE HARD PLACES",
    "Into daily life",
    "Capable machines, built for industrial environments and beyond.",
  ],
  [
    "03 — INFRASTRUCTURE",
    "Inspect. Act.",
    "Intelligent inspection for complex industrial environments.",
  ],
];

const MARQUEE_WORDS = [
  "PERCEIVE",
  "MOVE",
  "DECIDE",
  "ACT",
  "INTEGRATED",
  "MODULAR",
  "INTELLIGENT",
  "RESILIENT",
];

/** Application domains: [title, image variable defined in style.css] */
const APPLICATIONS = [
  ["Emergency Support", "f"],
  ["Infrastructure Inspection", "i2"],
  ["Offshore & Marine Operations", "w"],
  ["Search & Reconnaissance", "a"],
  ["Remote Maintenance", "i1"],
  ["Space & Planetary Robotics", "s"],
];

/**
 * The five WAFEE elements.
 *   letter / name  – tab label
 *   color          – accent colour
 *   image          – image variable defined in style.css
 *   tag            – caption on the image
 *   title / text   – heading and description
 *   specs          – [value, label] pairs
 *   features       – short feature chips
 */
const ELEMENTS = [
  {
    letter: "W",
    name: "Water",
    color: "#0a8fe0",
    image: "w",
    tag: "Subsea · Marine",
    title: "Subsea inspection & maintenance",
    text: "Marine and offshore operations: inspection, cleaning and repair of submerged structures in wet, corrosive, low-visibility conditions, powered and linked by tether.",
    specs: [
      ["Inspect", "Submerged structures"],
      ["Clean", "Fouled surfaces"],
      ["Light", "Onboard LEDs"],
      ["Tools", "Hands & cutters"],
      ["Tether", "Power & comms"],
      ["Fins", "Underwater mobility"],
    ],
    features: ["Offshore assets", "Pipelines", "Hull & pier checks"],
  },
  {
    letter: "A",
    name: "Air",
    color: "#4fb8e0",
    image: "a",
    tag: "Jetpack · Aerial",
    title: "Humanoid flight with jetpack",
    text: "Freedom to move, power to reach. AI balance control and a lightweight aerodynamic frame give the platform vertical take-off, stable hover and fast aerial response.",
    specs: [
      ["4 × 40 kgf", "Jet engines"],
      ["160 kgf", "Max thrust"],
      ["60 km/h", "Max speed"],
      ["1000 m", "Max altitude"],
      ["15–20 min", "Flight time"],
      ["120 kg", "Max take-off"],
    ],
    features: ["Search & rescue", "High-rise maintenance", "Reconnaissance"],
  },
  {
    letter: "F",
    name: "Fire",
    color: "#ff6a2b",
    image: "f",
    tag: "X1-Fire · Response",
    title: "Humanoid fire response robot",
    text: "Built to protect, engineered to endure. Detects, assesses and suppresses fires in extreme heat with thermal imaging, smoke navigation and a modular water/foam system.",
    specs: [
      ["500 °C", "Max operating temp"],
      ["50 L", "Water / foam tank"],
      ["120 LPM", "Max flow rate"],
      ["IP69K", "Protection"],
      ["3–4 h", "Operating time"],
      ["50 kg", "Payload"],
    ],
    features: ["Fire suppression", "Thermal imaging", "Hazard detection"],
  },
  {
    letter: "E",
    name: "Earth",
    color: "#c28a4e",
    image: "e",
    tag: "X1 · Land",
    title: "Humanoid for Earth",
    text: "Engineered to live and work alongside humans. Walks with you, understands you, and handles errands, delivery, guidance and public-service support.",
    specs: [
      ["180 cm", "Height"],
      ["95 kg", "Weight"],
      ["20 kg", "Payload"],
      ["0–15 km/h", "Running speed"],
      ["4–6 h", "Operating time"],
      ["IP65", "Protection"],
    ],
    features: [
      "Walking assistant",
      "Delivery & courier",
      "Guide & information",
    ],
  },
  {
    letter: "E",
    name: "Ether",
    color: "#8a73ff",
    image: "s",
    tag: "Space · Orbital",
    title: "Space humanoid",
    text: "Designed for orbital operations, satellite servicing, station maintenance and deep-space missions, with free-fly, surface and manipulation modes.",
    specs: [
      ["180 cm", "Height"],
      ["100 kg", "Weight"],
      ["42+", "Degrees of freedom"],
      ["48 V DC", "Power system"],
      ["−20 to 120 °C", "Operating temp"],
      ["12–16×", "RCS thrusters"],
    ],
    features: ["Free-fly mode", "Surface mode", "Satellite servicing"],
  },
];

/** The eight subsystems drawn around the WAFEE core. */
const SYSTEM_NODES = [
  "Mechanical",
  "Actuation",
  "Power",
  "Thermal",
  "Sensing",
  "Control",
  "AI",
  
];
/* ==========================================================================
   3. Navigation
   ========================================================================== */

function initNavigation() {
  const nav = $("#nv");
  const links = $(".lk");
  const menuButton = $("#mb");
  const progressBar = $("#sp");

// Solid background once the page has scrolled.
  addEventListener("scroll", () => nav.classList.toggle("s", scrollY > 60));

  // Reading progress bar along the top edge.
  addEventListener(
    "scroll",
    () => {
      const scrollable = document.body.scrollHeight - innerHeight;
      progressBar.style.width = (scrollY / scrollable) * 100 + "%";
    },
    { passive: true },
  );

  // Mobile menu.
  const closeMenu = () => {
    links.classList.remove("o");
    nav.classList.remove("open");
  };
  menuButton.onclick = () => {
    links.classList.toggle("o");
    nav.classList.toggle("open");
  };
  links.onclick = (event) => {
    if (event.target.tagName === "A") closeMenu();
  };
}

/* ==========================================================================
   4. Hero slider
   ========================================================================== */

function initHeroSlider() {
  const AUTOPLAY_MS = 6000;
  const slides = $$(".sl");
  const dots = $$("#pg button");
  const content = $("#hc");
  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
    const [eyebrow, headline, paragraph] = HERO_SLIDES[current];

    slides.forEach((slide, i) => slide.classList.toggle("on", i === current));
    dots.forEach((dot, i) => {
      dot.classList.remove("on");
      void dot.offsetWidth;
      dot.classList.toggle("on", i === current);
    });

    content.classList.remove("in");
    void content.offsetWidth;
    $("#hk").textContent = eyebrow;
    $("#ht").textContent = headline;
    $("#hp").textContent = paragraph;
    content.classList.add("in");

    clearTimeout(timer);
    timer = setTimeout(() => showSlide(current + 1), AUTOPLAY_MS);
  }

  dots.forEach((dot, i) => (dot.onclick = () => showSlide(i)));
  showSlide(0);
}

/* ==========================================================================
   5. Marquees and reveal-on-scroll
   ========================================================================== */

/** Fill both scrolling word strips (above "The Mission" and above the footer). */
function initMarquees() {
  const strip = MARQUEE_WORDS.map((word) => `<span>${word}</span>`).join("");
  $$("#mq, #mq2").forEach((element) => (element.innerHTML = strip + strip));
}

/** Count a number up from 0 to its data-n value. */
function countUp(element) {
  const target = +element.dataset.n;
  let value = 0;
  const timer = setInterval(
    () => {
      value++;
      element.textContent = value;
      if (value >= target) clearInterval(timer);
    },
    Math.max(30, 900 / target),
  );
}

function initScrollEffects() {
  // Split big paragraphs into words so they can light up one by one.
  $$(".words").forEach((paragraph) => {
    paragraph.innerHTML = paragraph.textContent
      .split(" ")
      .map((word) => `<span class="w">${word}</span>`)
      .join(" ");
  });

  // Fade elements in the first time they enter the viewport.
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("on");
        const counter = entry.target.querySelector("[data-n]");
        if (counter) countUp(counter);
        revealObserver.unobserve(entry.target);
      }),
    { threshold: 0.25 },
  );
  $$(".rv").forEach((element, index) => {
    element.style.transitionDelay = (index % 3) * 0.12 + "s";
    revealObserver.observe(element);
  });

  // Highlight words above 78% of the viewport and parallax the panel images.
  function onScroll() {
    $$(".w").forEach((word) =>
      word.classList.toggle(
        "on",
        word.getBoundingClientRect().top < innerHeight * 0.78,
      ),
    );
    $$("[data-p]").forEach((image) => {
      const box = image.parentNode.getBoundingClientRect();
      image.style.transform = `translateY(${(box.top / innerHeight) * -9}%) scale(1.04)`;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   6. Applications list
   ========================================================================== */

function initApplications() {
  const list = $("#al");
  const preview = $("#pv");

  function selectApplication(index) {
    [...list.children].forEach((item, i) =>
      item.classList.toggle("on", i === index),
    );
    preview.style.opacity = 0;
    preview.style.transform = "scale(.97)";
    setTimeout(() => {
      preview.style.backgroundImage = `var(--${APPLICATIONS[index][1]})`;
      preview.style.opacity = 1;
      preview.style.transform = "none";
    }, 300);
  }

  APPLICATIONS.forEach(([title], index) => {
    const item = document.createElement("li");
    item.innerHTML = `${title.replace("&", "&amp;")}<span>0${index + 1}</span>`;
    item.onmouseenter = item.onclick = () => selectApplication(index);
    list.appendChild(item);
  });

  selectApplication(1);
}

/* ==========================================================================
   7. WAFEE elements explorer
   --------------------------------------------------------------------------
   Each element has a tab, a description panel and its own particle effect
   drawn on a canvas over the image.
   ========================================================================== */

/**
 * Particle effects, one per element (same order as ELEMENTS).
 *   count  – particles kept alive
 *   spawn  – create one particle for a canvas of size (w, h)
 *   draw   – move + draw one particle, return false to remove it
 *   after  – optional extra drawing each frame
 */
const rand = Math.random;

const PARTICLE_EFFECTS = [
  // Water: rising bubbles
  {
    count: 60,
    spawn: (w, h) => ({
      x: rand() * w,
      y: h + 10,
      vx: 0,
      vy: -(0.6 + rand() * 1.4),
      r: 2 + rand() * 7,
      a: 0.6,
      s: rand() * 6,
    }),
    draw(ctx, p, t) {
      p.x += p.vx + Math.sin(t / 600 + p.s) * 0.5;
      p.y += p.vy;
      ctx.strokeStyle = `rgba(180,235,255,${p.a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.1)";
      ctx.fill();
      return p.y > -20;
    },
  },

  // Air: horizontal wind streaks
  {
    count: 24,
    spawn: (w, h) => ({
      x: w + 20,
      y: rand() * h,
      vx: -(8 + rand() * 14),
      vy: 0,
      r: 30 + rand() * 90,
      a: 0.5,
    }),
    draw(ctx, p) {
      p.x += p.vx;
      const gradient = ctx.createLinearGradient(p.x, 0, p.x + p.r, 0);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(1, `rgba(255,255,255,${p.a * 0.5})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(p.x, p.y, p.r, 1.5);
      return p.x + p.r > 0;
    },
  },

  // Fire: glowing embers
  {
    count: 80,
    spawn: (w, h) => ({
      x: w * 0.2 + rand() * w * 0.6,
      y: h + 6,
      vx: (rand() - 0.5) * 0.8,
      vy: -(0.8 + rand() * 2),
      r: 1 + rand() * 3.5,
      a: 1,
      s: rand() * 6,
    }),
    draw(ctx, p, t) {
      p.x += p.vx + Math.sin(t / 300 + p.s);
      p.y += p.vy;
      p.a -= 0.006;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      gradient.addColorStop(0, `rgba(255,200,90,${Math.max(p.a, 0)})`);
      gradient.addColorStop(0.4, `rgba(255,100,30,${Math.max(p.a * 0.5, 0)})`);
      gradient.addColorStop(1, "rgba(255,60,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, 7);
      ctx.fill();
      return p.a > 0 && p.y > -10;
    },
  },

  // Earth: drifting dust plus a ground pulse
  {
    count: 70,
    spawn: (w, h) => ({
      x: rand() * w,
      y: h * 0.7 + rand() * h * 0.3,
      vx: 0.6 + rand() * 1.4,
      vy: -(0.1 + rand() * 0.4),
      r: 1 + rand() * 3,
      a: 0.6,
    }),
    draw(ctx, p, t, w) {
      p.x += p.vx;
      p.y += p.vy;
      p.a -= 0.002;
      ctx.fillStyle = `rgba(215,175,120,${Math.max(p.a, 0)})`;
      ctx.fillRect(p.x, p.y, p.r, p.r);
      return p.a > 0 && p.x < w;
    },
    after(ctx, t, w, h) {
      const phase = (t % 1400) / 1400;
      ctx.strokeStyle = `rgba(255,220,170,${0.5 * (1 - phase)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.94, phase * w * 0.45, phase * 26, 0, 0, 7);
      ctx.stroke();
    },
  },

  // Ether: twinkling stars plus an orbiting satellite
  {
    count: 130,
    spawn: (w, h) => ({
      x: rand() * w,
      y: rand() * h,
      vx: 0,
      vy: 0,
      r: 0.5 + rand() * 1.6,
      a: rand(),
      s: rand() * 6,
    }),
    draw(ctx, p, t) {
      p.a = 0.3 + 0.7 * Math.abs(Math.sin(t / 700 + p.s));
      ctx.fillStyle = `rgba(200,210,255,${p.a})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fill();
      return true;
    },
    after(ctx, t, w, h) {
      const tilt = 0.5;
      const radiusX = w * 0.42;
      const radiusY = h * 0.17;
      ctx.strokeStyle = "rgba(160,140,255,.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, radiusX, radiusY, tilt, 0, 7);
      ctx.stroke();

      const angle = t / 1500;
      const ex = radiusX * Math.cos(angle);
      const ey = radiusY * Math.sin(angle);
      ctx.fillStyle = "#b9a9ff";
      ctx.beginPath();
      ctx.arc(
        w / 2 + ex * Math.cos(tilt) - ey * Math.sin(tilt),
        h / 2 + ex * Math.sin(tilt) + ey * Math.cos(tilt),
        4,
        0,
        7,
      );
      ctx.fill();
    },
  },
];

function initElementsExplorer() {
  const AUTOPLAY_MS = 9000;
  const section = $(".wx");
  const canvas = $("#cv");
  const ctx = canvas.getContext("2d");
  const photo = $("#ph");
  const tabsContainer = $("#tabs");

  let current = 0;
  let particles = [];
  let width = 1;
  let height = 1;
  let visible = false;
  let timer;

  // --- Tabs -----------------------------------------------------------------
  ELEMENTS.forEach((element, index) => {
    const tab = document.createElement("button");
    tab.className = "tb";
    tab.type = "button";
    tab.setAttribute("aria-pressed", "false");
    tab.style.setProperty("--c0", element.color);
    tab.innerHTML = `<b>${element.letter}</b><span>${element.name}</span>`;
    tab.onclick = () => showElement(index);
    tabsContainer.appendChild(tab);
  });

  // --- Detail panel -----------------------------------------------------------
  function renderDetails(element) {
    const specs = element.specs
      .map(
        ([value, label], i) =>
          `<div style="animation-delay:${i * 0.08}s"><b>${value}</b><small>${label}</small></div>`,
      )
      .join("");
    const features = element.features
      .map(
        (text, i) =>
          `<span style="animation-delay:${0.4 + i * 0.08}s">${text}</span>`,
      )
      .join("");

    $("#inf").innerHTML = `
      <div class="lb" style="color:var(--c0)">${element.letter} — ${element.name.toUpperCase()}</div>
      <h3>${element.title}</h3>
      <p class="d">${element.text}</p>
      <div class="sp">${specs}</div>
      <div class="ft">${features}</div>`;
  }

  function showElement(index) {
    const element = ELEMENTS[index];
    current = index;
    particles = [];

    section.style.setProperty("--c0", element.color);

    // Cross-fade the photo; the blurred backdrop (--fill) uses the same image.
    photo.style.opacity = 0;
    setTimeout(() => {
      photo.className = "ph fx" + index;
      photo.parentNode.style.setProperty("--fill", `var(--${element.image})`);
      photo.style.backgroundImage = `var(--${element.image})`;
      photo.style.opacity = 1;
    }, 250);

    $$(".tb").forEach((tab, i) => {
      tab.classList.remove("on");
      tab.setAttribute("aria-pressed", String(i === index));
      if (i === index) {
        void tab.offsetWidth;
        tab.classList.add("on");
      }
    });

    $("#tg").textContent = element.tag.toUpperCase();
    renderDetails(element);

    clearTimeout(timer);
    timer = setTimeout(
      () => showElement((index + 1) % ELEMENTS.length),
      AUTOPLAY_MS,
    );
  }

  // --- Particle canvas ---------------------------------------------------------
  function resizeCanvas() {
    const box = canvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    fitCanvas(canvas, ctx, width, height);
  }

  function drawFrame(time) {
    requestAnimationFrame(drawFrame);
    if (!visible) return;

    const effect = PARTICLE_EFFECTS[current];
    ctx.clearRect(0, 0, width, height);

    while (particles.length < effect.count)
      particles.push(effect.spawn(width, height));
    particles = particles.filter((particle) =>
      effect.draw(ctx, particle, time, width),
    );
    if (effect.after) effect.after(ctx, time, width, height);
  }

  // Only animate while the section is on screen.
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) resizeCanvas();
  }).observe(section);
  addEventListener("resize", resizeCanvas);

  resizeCanvas();
  showElement(0);
  if (!prefersReducedMotion) requestAnimationFrame(drawFrame);
}

/* ==========================================================================
   8. System diagram
   ========================================================================== */

function initSystemDiagram() {
  const RADIUS = 250;

  let svg = `<svg viewBox="-320 -320 640 640">
    <g class="rg"><circle r="${RADIUS}" fill="none" stroke="var(--line)" stroke-dasharray="4 10" stroke-width="2"/></g>
    <g class="rg r2"><circle r="170" fill="none" stroke="var(--blue)" stroke-opacity=".35" stroke-dasharray="40 14" stroke-width="2"/></g>`;

  SYSTEM_NODES.forEach((label, index) => {
    const angle = (index / SYSTEM_NODES.length) * TAU - Math.PI / 2;
    const x = Math.round(Math.cos(angle) * RADIUS);
    const y = Math.round(Math.sin(angle) * RADIUS);

    svg += `
      <line x1="0" y1="0" x2="${x}" y2="${y}" stroke="var(--blue)" stroke-opacity=".4" stroke-dasharray="6 8" class="ln"/>
      <circle r="4" fill="var(--blue)">
        <animateMotion dur="${2 + index * 0.3}s" repeatCount="indefinite" path="M0 0L${x} ${y}"/>
      </circle>
      <g class="nd" transform="translate(${x} ${y})">
        <g class="nb2">
          <circle r="38" fill="var(--bg)" stroke="var(--blue)" stroke-width="2"/>
          <text text-anchor="middle" y="4" font-size="11" font-weight="600" fill="var(--ink)">${label}</text>
        </g>
      </g>`;
  });

  svg += `
    <circle r="62" fill="var(--blue)" class="core"/>
    <text text-anchor="middle" y="6" font-size="19" font-weight="700" fill="#fff" letter-spacing="3">WAFEE</text>
  </svg>`;

  $("#orb").innerHTML = svg;
}

/* ==========================================================================
   9. Animated page background
   --------------------------------------------------------------------------
   A fixed canvas behind the page: light-blue → white gradient, drifting
   soft blobs, a floating particle network and click ripples. The gradient
   and particles shift slowly as the page scrolls.
   ========================================================================== */

function initBackground() {
  const canvas = $("#bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Soft blob colours (RGB), all light blues.
  const BLOB_COLORS = [
    [125, 200, 250],
    [170, 222, 252],
    [100, 185, 245],
    [200, 233, 253],
    [140, 210, 250],
    [185, 228, 252],
  ];
  const LINK_DISTANCE = 130;
  const SCROLL_PARALLAX = 180;

  let width = 0;
  let height = 0;
  let time = 0;
  let running = true;
  let scrollTarget = 0;
  let scrollCurrent = 0; // eased toward scrollTarget
  let particles = [];
  const ripples = [];

  const blobs = BLOB_COLORS.map((color) => ({
    color,
    x: rand(),
    y: rand(),
    radius: 0.22 + rand() * 0.22,
    angle: rand() * 6.28,
    speed: 0.12 + rand() * 0.18,
  }));

  function resize() {
    width = innerWidth;
    height = innerHeight;
    fitCanvas(canvas, ctx, width, height);

    const count = Math.round(
      Math.min(110, Math.max(36, (width * height) / 14000)),
    );
    particles = Array.from({ length: count }, () => ({
      x: rand() * width,
      y: rand() * height,
      vx: (rand() - 0.5) * 0.3,
      vy: (rand() - 0.5) * 0.3,
      r: 1.2 + rand() * 2.2,
      depth: 0.3 + rand() * 0.9,
    }));
  }

  // A click sends out a ripple and pushes nearby particles away.
  function onPointerDown(event) {
    ripples.push({ x: event.clientX, y: event.clientY, r: 0, a: 0.5 });
    particles.forEach((p) => {
      const dx = p.x - event.clientX;
      const dy = p.y - event.clientY;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < 320) {
        const force = (1 - distance / 320) * 9;
        p.vx += (dx / distance) * force;
        p.vy += (dy / distance) * force;
      }
    });
  }

  function drawGradient() {
    const shift = scrollCurrent * 0.5;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#bfe2fb");
    gradient.addColorStop(
      Math.min(0.9, Math.max(0.15, 0.45 + shift * 0.6)),
      "#e3f2fd",
    );
    gradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawBlobs() {
    blobs.forEach((blob, i) => {
      blob.angle += blob.speed * 0.01;
      const x = (blob.x + Math.cos(blob.angle + i) * 0.12) * width;
      const y =
        (blob.y + Math.sin(blob.angle * 1.3 + i) * 0.12) * height -
        scrollCurrent * height * 0.25 * ((i % 3) + 1) * 0.3;
      const radius =
        blob.radius *
        Math.max(width, height) *
        (1 + Math.sin(time * 2 + i) * 0.05);
      const [r, g, b] = blob.color;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(${r},${g},${b},.38)`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    });
  }

  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.r += 6;
      ripple.a *= 0.965;
      if (ripple.a < 0.02) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.r, 0, TAU);
      ctx.strokeStyle = `rgba(10,143,224,${ripple.a})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.r * 0.7, 0, TAU);
      ctx.strokeStyle = `rgba(255,255,255,${ripple.a})`;
      ctx.lineWidth = 6;
      ctx.stroke();
    }
  }

  function moveParticles() {
    for (const p of particles) {
      p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.15 * p.depth;
      p.y += p.vy + Math.cos(time + p.x * 0.01) * 0.15 * p.depth;
      p.vx *= 0.985;
      p.vy *= 0.985;
      // Wrap around the screen edges.
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    }
  }

  function drawParticles() {
    const screenY = (p) => p.y - scrollCurrent * SCROLL_PARALLAX * p.depth;

    // Links between nearby particles.
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      const ay = screenY(a);
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const by = screenY(b);
        const dx = a.x - b.x;
        const dy = ay - by;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < LINK_DISTANCE * LINK_DISTANCE) {
          const alpha = (1 - Math.sqrt(distanceSquared) / LINK_DISTANCE) * 0.28;
          ctx.strokeStyle = `rgba(10,143,224,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, ay);
          ctx.lineTo(b.x, by);
          ctx.stroke();
        }
      }
    }

    // The particles themselves.
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, screenY(p), p.r, 0, TAU);
      ctx.fillStyle = "rgba(20,140,225,.35)";
      ctx.fill();
    }
  }

  function frame() {
    if (!running) return;
    time += prefersReducedMotion ? 0.002 : 0.008;
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.06;

    drawGradient();
    drawBlobs();
    drawRipples();
    moveParticles();
    drawParticles();

    requestAnimationFrame(frame);
  }

  addEventListener("resize", resize);
  addEventListener("pointerdown", onPointerDown, { passive: true });
  addEventListener(
    "scroll",
    () => {
      const scrollable = Math.max(
        1,
        document.documentElement.scrollHeight - innerHeight,
      );
      scrollTarget = scrollY / scrollable;
    },
    { passive: true },
  );
  // Pause when the tab is hidden.
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  resize();
  requestAnimationFrame(frame);
}

/* ==========================================================================
   10. Start-up
   ========================================================================== */

initNavigation();
initHeroSlider();
initMarquees();
initScrollEffects();
initApplications();
initElementsExplorer();
initSystemDiagram();
initBackground();
