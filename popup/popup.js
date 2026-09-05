const STORAGE_KEYS = {
  SITES: "blockedSites",
  KEYWORDS: "blockedKeywords",
  THEME: "theme",
};

const siteForm = document.getElementById("site-form");
const siteInput = document.getElementById("site-input");
const siteList = document.getElementById("site-list");
const siteEmpty = document.getElementById("site-empty");

const keywordForm = document.getElementById("keyword-form");
const keywordInput = document.getElementById("keyword-input");
const keywordList = document.getElementById("keyword-list");
const keywordEmpty = document.getElementById("keyword-empty");

const themeToggle = document.getElementById("theme-toggle");

function normalizeSite(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
}

function normalizeKeyword(value) {
  return value.trim().toLowerCase();
}

function renderList(listEl, emptyEl, items, onRemove) {
  listEl.innerHTML = "";
  if (!items.length) {
    emptyEl.classList.add("visible");
    return;
  }
  emptyEl.classList.remove("visible");

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "entry-item";

    const label = document.createElement("span");
    label.textContent = item;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.type = "button";
    removeBtn.setAttribute("aria-label", `Remove ${item}`);
    removeBtn.textContent = "\u2715";
    removeBtn.addEventListener("click", () => onRemove(item));

    li.appendChild(label);
    li.appendChild(removeBtn);
    listEl.appendChild(li);
  });
}

async function getStoredList(key) {
  const stored = await browser.storage.local.get(key);
  return stored[key] || [];
}

async function addEntry(key, rawValue, normalizer) {
  const value = normalizer(rawValue);
  if (!value) return;
  const list = await getStoredList(key);
  if (list.includes(value)) return;
  list.push(value);
  await browser.storage.local.set({ [key]: list });
}

async function removeEntry(key, value) {
  const list = await getStoredList(key);
  const next = list.filter((item) => item !== value);
  await browser.storage.local.set({ [key]: next });
}

async function refreshSites() {
  const sites = await getStoredList(STORAGE_KEYS.SITES);
  renderList(siteList, siteEmpty, sites, async (value) => {
    await removeEntry(STORAGE_KEYS.SITES, value);
    refreshSites();
  });
}

async function refreshKeywords() {
  const keywords = await getStoredList(STORAGE_KEYS.KEYWORDS);
  renderList(keywordList, keywordEmpty, keywords, async (value) => {
    await removeEntry(STORAGE_KEYS.KEYWORDS, value);
    refreshKeywords();
  });
}

siteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await addEntry(STORAGE_KEYS.SITES, siteInput.value, normalizeSite);
  siteInput.value = "";
  refreshSites();
});

keywordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await addEntry(STORAGE_KEYS.KEYWORDS, keywordInput.value, normalizeKeyword);
  keywordInput.value = "";
  refreshKeywords();
});

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.checked = theme === "dark";
}

async function initTheme() {
  const stored = await browser.storage.local.get(STORAGE_KEYS.THEME);
  const theme = stored[STORAGE_KEYS.THEME] || "light";
  applyTheme(theme);
}

themeToggle.addEventListener("change", async () => {
  const theme = themeToggle.checked ? "dark" : "light";
  applyTheme(theme);
  await browser.storage.local.set({ [STORAGE_KEYS.THEME]: theme });
});

function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      panels.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

function init() {
  initTabs();
  initTheme();
  refreshSites();
  refreshKeywords();
}

init();
