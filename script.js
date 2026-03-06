const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const filterButtons = document.querySelectorAll(".filter-btn");
const yearNode = document.querySelector("#year");
const galleryGrid = document.querySelector("#galleryGrid");

function setText(id, value) {
  const node = document.getElementById(id);
  if (node && typeof value === "string") {
    node.textContent = value;
  }
}

function setLink(id, href, label) {
  const node = document.getElementById(id);
  if (!node) return;
  if (typeof href === "string") node.href = href;
  if (typeof label === "string") node.textContent = label;
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

function renderGallery(items) {
  if (!galleryGrid || !Array.isArray(items)) return;
  galleryGrid.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card reveal";
    card.dataset.category = item.category || "flourish";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.alt || item.title || "Calligraphy piece";

    const meta = document.createElement("div");
    meta.className = "card-meta";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const medium = document.createElement("p");
    medium.textContent = item.medium;

    meta.appendChild(title);
    meta.appendChild(medium);
    card.appendChild(image);
    card.appendChild(meta);
    galleryGrid.appendChild(card);
  });
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

function initFilters() {
  const cards = document.querySelectorAll(".card");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      cards.forEach((card) => {
        const isMatch = target === "all" || card.dataset.category === target;
        card.hidden = !isMatch;
      });
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
    item.style.transitionDelay = `${index * 45}ms`;
    observer.observe(item);
  });
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

  setText("contactEyebrow", site.contactEyebrow);
  setText("contactHeading", site.contactHeading);
  setText("contactIntro", site.contactIntro);

  if (typeof site.contactEmail === "string") {
    setLink("contactEmail", `mailto:${site.contactEmail}`, site.contactEmail);
  }
  setLink("instagramLink", site.instagramUrl, "Instagram");
  setLink("behanceLink", site.behanceUrl, "Behance");
  setText("footerStudioName", site.footerStudioName);
}

async function loadCmsContent() {
  try {
    const [siteResponse, galleryResponse] = await Promise.all([
      fetch("content/site.json", { cache: "no-store" }),
      fetch("content/gallery.json", { cache: "no-store" })
    ]);

    if (!siteResponse.ok || !galleryResponse.ok) return;

    const site = await siteResponse.json();
    const gallery = await galleryResponse.json();

    applySiteContent(site);
    renderGallery(gallery.items);
  } catch (_error) {
    // Keep built-in fallback content if content files are unavailable.
  }
}

if (yearNode) yearNode.textContent = new Date().getFullYear();

initMenu();
loadCmsContent().finally(() => {
  initFilters();
  initReveals();
});
