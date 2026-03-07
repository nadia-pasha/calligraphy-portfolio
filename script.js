const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const categoryButtons = document.querySelectorAll(".filter-btn");
const yearNode = document.querySelector("#year");
const galleryGrid = document.querySelector("#galleryGrid");
const processGrid = document.querySelector("#processGrid");
const trustLogos = document.querySelector("#trustLogos");
const testimonialGrid = document.querySelector("#testimonialGrid");
const pressList = document.querySelector("#pressList");
const siteHeader = document.querySelector(".site-header");
const textureOverlay = document.querySelector(".texture-overlay");
const heroSection = document.querySelector(".hero");

const lightbox = document.querySelector("#lightbox");
const lightboxClose = document.querySelector("#lightboxClose");
const lightboxPrev = document.querySelector("#lightboxPrev");
const lightboxNext = document.querySelector("#lightboxNext");
const lightboxImageWrap = document.querySelector("#lightboxImageWrap");
const lightboxImage = document.querySelector("#lightboxImage");

const state = {
  galleryItems: [],
  activeCategory: "all",
  lightboxIndex: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
  pinchStartDistance: 0,
  pinchStartZoom: 1,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0
};

function setText(id, value) {
  const node = document.getElementById(id);
  if (node && typeof value === "string") node.textContent = value;
}

function setLink(id, href, label) {
  const node = document.getElementById(id);
  if (!node) return;
  if (typeof href === "string") node.href = href;
  if (typeof label === "string") node.textContent = label;
}

function setHref(id, href) {
  const node = document.getElementById(id);
  if (!node) return;
  if (typeof href === "string") node.href = href;
}

function setMeta(selector, value) {
  if (typeof value !== "string") return;
  const node = document.querySelector(selector);
  if (node) node.setAttribute("content", value);
}

function renderList(id, items) {
  const list = document.getElementById(id);
  if (!list || !Array.isArray(items)) return;
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderFacts(items) {
  const factList = document.getElementById("factList");
  if (!factList || !Array.isArray(items)) return;
  factList.innerHTML = "";
  items.forEach((item) => {
    const wrap = document.createElement("div");
    const label = document.createElement("span");
    const value = document.createElement("strong");
    label.textContent = item.label;
    value.textContent = item.value;
    wrap.appendChild(label);
    wrap.appendChild(value);
    factList.appendChild(wrap);
  });
}

function createResponsivePicture(item, eager = false) {
  const picture = document.createElement("picture");

  if (item.imageAvif) {
    const avifSource = document.createElement("source");
    avifSource.type = "image/avif";
    avifSource.srcset = item.imageAvif;
    picture.appendChild(avifSource);
  }

  if (item.imageWebp) {
    const webpSource = document.createElement("source");
    webpSource.type = "image/webp";
    webpSource.srcset = item.imageWebp;
    picture.appendChild(webpSource);
  }

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.alt || item.title || "Calligraphy piece";
  image.loading = eager ? "eager" : "lazy";
  image.fetchPriority = eager ? "high" : "auto";
  image.decoding = "async";
  if (typeof item.focalPoint === "string" && item.focalPoint.trim()) {
    image.style.objectPosition = item.focalPoint;
  }

  picture.appendChild(image);
  return { picture, image };
}

function createAvailabilityBadge(status = "available") {
  const badge = document.createElement("span");
  badge.className = `availability-badge ${status}`;
  const label = status === "available"
    ? "Available"
    : status === "commissioned"
      ? "Commissioned"
      : "Sold";
  badge.textContent = label;
  return badge;
}

function renderGallery(items) {
  if (!galleryGrid || !Array.isArray(items)) return;
  state.galleryItems = items;
  galleryGrid.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "card reveal";
    card.dataset.category = item.category || "flourish";
    card.dataset.status = item.status || "available";
    card.dataset.index = String(index);

    const { picture } = createResponsivePicture(item, index < 2);

    const meta = document.createElement("div");
    meta.className = "card-meta";

    const metaTop = document.createElement("div");
    metaTop.className = "card-meta-top";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const badge = createAvailabilityBadge(item.status || "available");

    const medium = document.createElement("p");
    medium.textContent = item.medium;

    metaTop.appendChild(title);
    metaTop.appendChild(badge);
    meta.appendChild(metaTop);
    meta.appendChild(medium);

    card.appendChild(picture);
    card.appendChild(meta);
    card.tabIndex = 0;
    card.addEventListener("click", () => openLightbox(index));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });

    galleryGrid.appendChild(card);
  });

  updatePreloads(items);
  applyFilters();
}

function updatePreloads(items) {
  const preload1 = document.querySelector("#preloadImage1");
  const preload2 = document.querySelector("#preloadImage2");
  const first = items[0];
  const second = items[1];

  if (preload1 && first) preload1.setAttribute("href", first.imageAvif || first.imageWebp || first.image);
  if (preload2 && second) preload2.setAttribute("href", second.imageAvif || second.imageWebp || second.image);
}

function applyFilters() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const categoryMatch = state.activeCategory === "all" || card.dataset.category === state.activeCategory;
    card.hidden = !categoryMatch;
  });
}

function initFilters() {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.filter || "all";
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyFilters();
    });
  });
}

function renderProcessSteps(steps) {
  if (!processGrid || !Array.isArray(steps)) return;
  processGrid.innerHTML = "";

  steps.forEach((step) => {
    const card = document.createElement("article");
    card.className = "process-card reveal";

    const image = document.createElement("img");
    image.src = step.image;
    image.alt = step.title;
    image.loading = "lazy";
    image.decoding = "async";
    if (step.focalPoint) image.style.objectPosition = step.focalPoint;

    const meta = document.createElement("div");
    meta.className = "process-card-meta";

    const title = document.createElement("h3");
    title.textContent = step.title;

    const description = document.createElement("p");
    description.textContent = step.description;

    meta.appendChild(title);
    meta.appendChild(description);
    card.appendChild(image);
    card.appendChild(meta);
    processGrid.appendChild(card);
  });
}

function renderTrust(site) {
  if (trustLogos && Array.isArray(site.trustLogos)) {
    trustLogos.innerHTML = "";
    site.trustLogos.forEach((logo) => {
      const item = document.createElement("div");
      item.className = "logo-pill reveal";
      item.textContent = logo;
      trustLogos.appendChild(item);
    });
  }

  if (testimonialGrid && Array.isArray(site.testimonials)) {
    testimonialGrid.innerHTML = "";
    site.testimonials.forEach((t) => {
      const card = document.createElement("article");
      card.className = "testimonial-card reveal";
      const quote = document.createElement("p");
      quote.textContent = `"${t.quote}"`;
      const cite = document.createElement("cite");
      cite.textContent = t.name;
      card.appendChild(quote);
      card.appendChild(cite);
      testimonialGrid.appendChild(card);
    });
  }

  if (pressList && Array.isArray(site.pressMentions)) {
    pressList.innerHTML = "";
    site.pressMentions.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      pressList.appendChild(li);
    });
  }
}

function applySiteContent(site) {
  if (!site) return;
  if (typeof site.siteTitle === "string") document.title = site.siteTitle;

  setText("logoText", site.logoText);
  setText("heroEyebrow", site.heroEyebrow);
  setText("heroHeading", site.heroHeading);
  setText("heroCopy", site.heroCopy);

  setLink("primaryButton", site.primaryButtonLink, site.primaryButtonText);
  setLink("secondaryButton", site.secondaryButtonLink, site.secondaryButtonText);

  setText("workEyebrow", site.workEyebrow);
  setText("workHeading", site.workHeading);

  setText("statementEyebrow", site.statementEyebrow);
  setText("statementHeading", site.statementHeading);
  setText("statementParagraph1", site.statementParagraph1);
  setText("statementParagraph2", site.statementParagraph2);
  setText("exhibitionsHeading", site.exhibitionsHeading);
  renderList("exhibitionsList", site.exhibitions);
  setText("commissionHeading", site.commissionHeading);
  setText("commissionText", site.commissionText);

  setText("aboutEyebrow", site.aboutEyebrow);
  setText("aboutHeading", site.aboutHeading);
  setText("aboutBio", site.aboutBio);
  renderFacts(site.facts);

  setText("processEyebrow", site.processEyebrow);
  setText("processHeading", site.processHeading);
  setText("processIntro", site.processIntro);
  renderProcessSteps(site.processSteps);

  setText("trustEyebrow", site.trustEyebrow);
  setText("trustHeading", site.trustHeading);
  setText("pressQuote", site.pressQuote);
  renderTrust(site);


  setText("contactEyebrow", site.contactEyebrow);
  setText("contactHeading", site.contactHeading);
  setText("contactIntro", site.contactIntro);

  if (typeof site.contactEmail === "string") {
    setLink("contactEmail", `mailto:${site.contactEmail}`, site.contactEmail);
  }
  setHref("instagramLink", site.instagramUrl);
  setHref("heroInstagramLink", site.instagramUrl);
  setLink("behanceLink", site.behanceUrl, "Behance");
  setText("footerStudioName", site.footerStudioName);

  if (typeof site.metaDescription === "string") {
    setMeta('meta[name="description"]', site.metaDescription);
    setMeta('meta[property="og:description"]', site.metaDescription);
    setMeta('meta[name="twitter:description"]', site.metaDescription);
  }

  if (typeof site.siteTitle === "string") {
    setMeta('meta[property="og:title"]', site.siteTitle);
    setMeta('meta[name="twitter:title"]', site.siteTitle);
  }

  if (typeof site.ogImage === "string") {
    setMeta('meta[property="og:image"]', site.ogImage);
    setMeta('meta[name="twitter:image"]', site.ogImage);
  }
}

function initMenu() {
  if (!menuToggle || !navLinks) return;
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initReveals() {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 40}ms`;
    observer.observe(item);
  });
}

function resetZoom() {
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  applyZoomTransform();
}

function applyZoomTransform() {
  if (!lightboxImage) return;
  lightboxImage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
}

function renderLightboxItem(index) {
  const item = state.galleryItems[index];
  if (!item || !lightboxImage) return;

  lightboxImage.src = item.image;
  lightboxImage.alt = item.alt || item.title;
  if (item.focalPoint) lightboxImage.style.objectPosition = item.focalPoint;

  setText("lightboxStatus", (item.status || "available").toUpperCase());
  setText("lightboxTitle", item.title);
  setText("lightboxMedium", item.medium || "");
  setText("lightboxYear", item.year ? `Year: ${item.year}` : "");
  setText("lightboxDimensions", item.dimensions ? `Dimensions: ${item.dimensions}` : "");
  setText("lightboxStory", item.story || "");

  resetZoom();
}

function openLightbox(index) {
  if (!lightbox) return;
  state.lightboxIndex = index;
  renderLightboxItem(index);
  lightbox.hidden = false;
  requestAnimationFrame(() => {
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.hidden = true;
  document.body.style.overflow = "";
  resetZoom();
}

function nextLightbox(step) {
  if (!state.galleryItems.length) return;
  state.lightboxIndex = (state.lightboxIndex + step + state.galleryItems.length) % state.galleryItems.length;
  renderLightboxItem(state.lightboxIndex);
}

function distanceBetweenTouches(t1, t2) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.hypot(dx, dy);
}

function initLightbox() {
  if (!lightbox || !lightboxImageWrap || !lightboxImage) return;
  lightbox.hidden = true;

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => nextLightbox(-1));
  lightboxNext?.addEventListener("click", () => nextLightbox(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") nextLightbox(1);
    if (event.key === "ArrowLeft") nextLightbox(-1);
  });

  lightboxImageWrap.addEventListener("wheel", (event) => {
    if (!lightbox.classList.contains("open")) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.15 : 0.15;
    state.zoom = Math.min(4, Math.max(1, state.zoom + delta));
    if (state.zoom === 1) {
      state.panX = 0;
      state.panY = 0;
    }
    applyZoomTransform();
  }, { passive: false });

  lightboxImageWrap.addEventListener("dblclick", () => {
    state.zoom = state.zoom > 1 ? 1 : 2;
    if (state.zoom === 1) {
      state.panX = 0;
      state.panY = 0;
    }
    applyZoomTransform();
  });

  lightboxImageWrap.addEventListener("touchstart", (event) => {
    if (event.touches.length === 2) {
      state.pinchStartDistance = distanceBetweenTouches(event.touches[0], event.touches[1]);
      state.pinchStartZoom = state.zoom;
      return;
    }

    if (event.touches.length === 1 && state.zoom > 1) {
      state.isDragging = true;
      state.dragStartX = event.touches[0].clientX - state.panX;
      state.dragStartY = event.touches[0].clientY - state.panY;
    }
  }, { passive: true });

  lightboxImageWrap.addEventListener("touchmove", (event) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      const distance = distanceBetweenTouches(event.touches[0], event.touches[1]);
      if (state.pinchStartDistance > 0) {
        const ratio = distance / state.pinchStartDistance;
        state.zoom = Math.min(4, Math.max(1, state.pinchStartZoom * ratio));
        applyZoomTransform();
      }
      return;
    }

    if (event.touches.length === 1 && state.isDragging && state.zoom > 1) {
      state.panX = event.touches[0].clientX - state.dragStartX;
      state.panY = event.touches[0].clientY - state.dragStartY;
      applyZoomTransform();
    }
  }, { passive: false });

  lightboxImageWrap.addEventListener("touchend", () => {
    state.isDragging = false;
    state.pinchStartDistance = 0;
  });
}

function initModernMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector(".nav");
  if (!nav) return;

  if (reduceMotion) {
    nav.classList.remove("scrolled");
    return;
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      const heroShift = Math.max(-16, Math.min(4, y * -0.01));
      document.body.style.setProperty("--hero-shift", `${heroShift.toFixed(2)}px`);
      nav.classList.toggle("scrolled", y > 20);
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}


async function loadContent() {
  try {
    const [siteResponse, galleryResponse] = await Promise.all([
      fetch("content/site.json", { cache: "no-store" }),
      fetch("content/gallery.json", { cache: "no-store" })
    ]);

    if (!siteResponse.ok || !galleryResponse.ok) return;

    const site = await siteResponse.json();
    const gallery = await galleryResponse.json();

    applySiteContent(site);
    renderGallery(gallery.items || []);
    initReveals();
  } catch (_error) {
    // Keep fallback content when JSON files are unavailable.
  }
}

if (yearNode) yearNode.textContent = new Date().getFullYear();

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

initMenu();
initFilters();
initLightbox();
initModernMotion();
loadContent();
