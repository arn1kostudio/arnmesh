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

function inferGitHubRepoUrl() {
  const override = window.ARNMESH_GITHUB_REPO_URL;
  if (typeof override === "string" && override.trim()) {
    return override.trim().replace(/\/$/, "");
  }

  const host = window.location.hostname;
  const pathRepo = window.location.pathname.split("/").filter(Boolean)[0];
  if (host.endsWith(".github.io") && pathRepo) {
    const owner = host.slice(0, -".github.io".length);
    return `https://github.com/${owner}/${pathRepo}`;
  }

  return "https://github.com/arn1kostudio/arnmesh";
}

function resolveReleaseAssetUrl(assetName, localFallback) {
  if (!assetName) {
    return null;
  }

  const base = inferGitHubReleaseBase();
  if (base === "downloads/" && localFallback) {
    return localFallback;
  }
  return `${base}${assetName}`;
}

function configureGitHubLink() {
  const githubLink = document.querySelector("[data-github-link]");
  if (!githubLink) {
    return;
  }

  githubLink.href = inferGitHubRepoUrl();
}

function initSmoothAnchorScroll() {
  const header = document.querySelector(".site-header");
  const internalLinks = [...document.querySelectorAll('a[href^="#"]')];
  if (!internalLinks.length) {
    return;
  }

  let scrollFrame = 0;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function getTargetTop(target) {
    const headerOffset = header ? header.getBoundingClientRect().height + 24 : 24;
    return Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset);
  }

  function animateScroll(targetTop) {
    if (prefersReducedMotion.matches) {
      window.scrollTo(0, targetTop);
      return;
    }

    const startTop = window.scrollY;
    const distance = targetTop - startTop;
    const duration = Math.min(820, Math.max(420, Math.abs(distance) * 0.6));
    const startedAt = performance.now();

    window.cancelAnimationFrame(scrollFrame);

    function step(now) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startTop + distance * eased);
      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(step);
      }
    }

    scrollFrame = window.requestAnimationFrame(step);
  }

  function scrollToTarget(targetId) {
    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    animateScroll(getTargetTop(target));
  }

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const { hash } = link;
      if (!hash || hash === "#") {
        return;
      }

      event.preventDefault();
      history.replaceState(null, "", hash);
      scrollToTarget(hash);
    });
  });
}

function initDownloadRedirect() {
  const assetName = document.body.dataset.releaseAsset;
  if (!assetName) {
    return;
  }

  const releaseBase = inferGitHubReleaseBase();
  const localFallback = document.body.dataset.localFallback || "";
  const fallbackLink = document.querySelector("[data-fallback-link]");
  const status = document.querySelector("[data-redirect-status]");
  const releaseUrl = resolveReleaseAssetUrl(assetName, localFallback);
  const usingLocalFallback = releaseBase === "downloads/" && Boolean(localFallback);

  if (fallbackLink) {
    fallbackLink.href = releaseUrl;
  }

  if (status) {
    if (usingLocalFallback) {
      status.textContent =
        "Local preview mode detected. This page will use the local downloads folder unless a GitHub Release base is configured.";
    } else {
      status.textContent = "Redirecting to the latest GitHub Release asset...";
    }
  }

  window.setTimeout(() => {
    window.location.replace(releaseUrl);
  }, 220);
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
  let lastFrame = performance.now();

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

  function draw(now = performance.now()) {
    const delta = Math.min((now - lastFrame) / 16.67, 2);
    const motionScale = prefersReducedMotion.matches ? 0.35 : 1;
    lastFrame = now;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0b1013";
    ctx.fillRect(0, 0, width, height);
    drawGrid();

    for (const node of nodes) {
      node.x += node.vx * delta * motionScale;
      node.y += node.vy * delta * motionScale;
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

    requestAnimationFrame(draw);
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

configureGitHubLink();
initSmoothAnchorScroll();
revealOnScroll();
initMeshCanvas();
initDownloadRedirect();

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      "stroke-width": 2,
    },
  });
}
