const releaseAssets = {
  windows: "ArnMeshSetup.exe",
  android: "ArnMesh-Android-release.apk",
};

function inferGitHubReleaseBase() {
  const override = window.ARNMESH_RELEASE_BASE;
  if (typeof override === "string" && override.trim()) {
    return override.trim().replace(/\/?$/, "/");
  }

  const host = window.location.hostname;
  const pathRepo = window.location.pathname.split("/").filter(Boolean)[0];
  if (host.endsWith(".github.io") && pathRepo) {
    const owner = host.slice(0, -".github.io".length);
    return `https://github.com/${owner}/${pathRepo}/releases/latest/download/`;
  }

  return "downloads/";
}

function configureDownloads() {
  const base = inferGitHubReleaseBase();
  document.querySelectorAll("[data-download]").forEach((link) => {
    const asset = link.dataset.download;
    link.href = `${base}${asset}`;
    link.setAttribute("download", asset);
  });

  const host = window.location.hostname;
  const pathRepo = window.location.pathname.split("/").filter(Boolean)[0];
  const githubLink = document.querySelector("[data-github-link]");
  if (githubLink && host.endsWith(".github.io") && pathRepo) {
    const owner = host.slice(0, -".github.io".length);
    githubLink.href = `https://github.com/${owner}/${pathRepo}`;
  } else if (githubLink) {
    githubLink.href = "#downloads";
  }
}

function revealOnScroll() {
  const items = [...document.querySelectorAll(".reveal")];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14 },
  );

  items.forEach((item) => observer.observe(item));
}

function initMeshCanvas() {
  const canvas = document.getElementById("mesh-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const nodes = [];
  const pointer = { x: -1000, y: -1000 };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0;
  let height = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    nodes.length = 0;
    const count = Math.max(24, Math.floor((width * height) / 36000));
    for (let index = 0; index < count; index += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        r: 2 + Math.random() * 2.4,
      });
    }
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.055)";
    ctx.lineWidth = 1;
    const grid = 76;
    for (let x = 0; x < width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(205,166,255,0.13)";
    ctx.lineWidth = 1.5;
    for (let x = -height; x < width + height; x += 310) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + height, 0);
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0b1013";
    ctx.fillRect(0, 0, width, height);
    drawGrid();

    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;
    }

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 175) {
          const alpha = (1 - distance / 175) * 0.36;
          ctx.strokeStyle = `rgba(119,242,208,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const node of nodes) {
      const distanceToPointer = Math.hypot(node.x - pointer.x, node.y - pointer.y);
      const active = distanceToPointer < 150;
      ctx.fillStyle = active ? "#ffb36f" : "#77f2d0";
      ctx.globalAlpha = active ? 0.95 : 0.68;
      ctx.beginPath();
      ctx.arc(node.x, node.y, active ? node.r + 2 : node.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (!prefersReducedMotion.matches) {
      requestAnimationFrame(draw);
    }
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  });
  canvas.addEventListener("pointerleave", () => {
    pointer.x = -1000;
    pointer.y = -1000;
  });
  window.addEventListener("resize", resize);
  resize();
  draw();
}

configureDownloads();
revealOnScroll();
initMeshCanvas();

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      "stroke-width": 2,
    },
  });
}
