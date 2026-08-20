(function () {
  "use strict";

  document.documentElement.classList.add("has-js");

  const content = window.portfolioContent || {};
  const getValue = (path) =>
    path.split(".").reduce((value, key) => value && value[key], content);

  document.querySelectorAll("[data-content]").forEach((element) => {
    const value = getValue(element.dataset.content);
    if (typeof value === "string") element.textContent = value;
  });

  const projectKey = document.body.dataset.project;
  if (projectKey && content.projects && content.projects[projectKey]) {
    const project = content.projects[projectKey];
    document.querySelectorAll("[data-project-field]").forEach((element) => {
      const value = project[element.dataset.projectField];
      if (typeof value === "string") element.textContent = value;
    });
  }

  document.querySelectorAll("[data-project-preview]").forEach((preview) => {
    const project = content.projects && content.projects[preview.dataset.projectPreview];
    if (!project) return;
    preview.querySelectorAll("[data-preview-field]").forEach((element) => {
      const value = project[element.dataset.previewField];
      if (typeof value === "string") element.textContent = value;
    });
  });

  const capabilities = content.about && content.about.capabilities;
  const capabilityList = document.querySelector("[data-capabilities]");
  if (capabilityList && Array.isArray(capabilities)) {
    capabilityList.replaceChildren(
      ...capabilities.map((capability, index) => {
        const item = document.createElement("li");
        const label = document.createElement("span");
        const number = document.createElement("span");
        label.textContent = capability;
        number.textContent = `0${index + 1}`;
        number.setAttribute("aria-hidden", "true");
        item.append(label, number);
        return item;
      })
    );
  }

  ["email", "linkedin", "github"].forEach((name) => {
    const link = document.querySelector(`[data-contact-link="${name}"]`);
    if (!link || !content.contact) return;
    const label = content.contact[name];
    const url = content.contact[`${name}Url`];
    if (label) link.querySelector("span").textContent = label;
    if (url) link.href = url;
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const progressBar = document.querySelector(".scroll-progress span");
  if (progressBar) {
    let progressFrame = 0;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
      progressFrame = 0;
    };
    const requestProgressUpdate = () => {
      if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);
  }

  const navSections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  if ("IntersectionObserver" in window && navSections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${visible.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-25% 0px -60%", threshold: [0, 0.15, 0.5] }
    );
    navSections.forEach((section) => navObserver.observe(section));
  }

  const projectTiles = document.querySelectorAll(".project-tile");
  projectTiles.forEach((tile) => {
    const activate = () => tile.classList.add("is-active");
    const deactivate = () => tile.classList.remove("is-active");
    tile.addEventListener("pointerenter", activate);
    tile.addEventListener("pointerleave", deactivate);
    tile.addEventListener("focusin", activate);
    tile.addEventListener("focusout", deactivate);
  });

  const spiralSection = document.querySelector(".project-links-section");
  if (spiralSection && projectTiles.length && !reduceMotion.matches) {
    spiralSection.classList.add("spiral-ready");
    let spiralFrame = 0;
    const updateSpiral = () => {
      const bounds = spiralSection.getBoundingClientRect();
      const start = window.innerHeight * 0.95;
      const finish = window.innerHeight * 0.18;
      const rawProgress = (start - bounds.top) / (start - finish);
      const progress = Math.max(0, Math.min(1, rawProgress));
      const eased = 1 - Math.pow(1 - progress, 3);
      const remaining = 1 - eased;
      const radius = Math.min(window.innerWidth * 0.22, 280) * remaining;

      projectTiles.forEach((tile, index) => {
        const offset = (index / projectTiles.length) * Math.PI * 2;
        const angle = offset + remaining * Math.PI * (2.2 + index * 0.16);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.72;
        const rotation = remaining * (420 + index * 48);
        const scale = 0.72 + eased * 0.28;
        tile.style.setProperty("--spiral-x", `${x.toFixed(2)}px`);
        tile.style.setProperty("--spiral-y", `${y.toFixed(2)}px`);
        tile.style.setProperty("--spiral-rotation", `${rotation.toFixed(2)}deg`);
        tile.style.setProperty("--spiral-scale", scale.toFixed(3));
      });
      spiralFrame = 0;
    };
    const requestSpiralUpdate = () => {
      if (!spiralFrame) spiralFrame = window.requestAnimationFrame(updateSpiral);
    };
    updateSpiral();
    window.addEventListener("scroll", requestSpiralUpdate, { passive: true });
    window.addEventListener("resize", requestSpiralUpdate);
  }

  const addPointerDrift = (container, propertyMap) => {
    if (!container || reduceMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;
    container.addEventListener("pointermove", (event) => {
      const bounds = container.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      Object.entries(propertyMap).forEach(([property, formatter]) => {
        container.style.setProperty(property, formatter(x, y));
      });
    });
    container.addEventListener("pointerleave", () => {
      Object.keys(propertyMap).forEach((property) => container.style.removeProperty(property));
    });
  };

  addPointerDrift(document.querySelector(".identity-film"), {
    "--film-x": (x) => `${x * -1.2}%`,
    "--film-y": (_x, y) => `${y * -1.2}%`
  });

  addPointerDrift(document.querySelector(".resume-ingredients .ingredients-image"), {
    "--decorative-x": (x) => `${x * 12}px`,
    "--decorative-y": (_x, y) => `${y * 12}px`,
    "--decorative-rotate": (x) => `${x * 2.4}deg`
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const videos = document.querySelectorAll("video[data-lazy-video]");
  const loadVideo = (video) => {
    video.querySelectorAll("source[data-src]").forEach((source) => {
      source.src = source.dataset.src;
      source.removeAttribute("data-src");
    });
    video.load();
    if (video.dataset.autoplay === "true" && !reduceMotion.matches) {
      video.play().catch(() => {});
    }
  };

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadVideo(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "350px" }
    );
    videos.forEach((video) => videoObserver.observe(video));
  } else {
    videos.forEach(loadVideo);
  }
})();
