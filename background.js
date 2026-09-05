/**
 * Site Blocker - background script
 *
 * Watches every top level navigation request and cancels/redirects it to
 * the extension's "blocked" page whenever the requested URL matches one of
 * the user's blocked sites or blocked keywords.
 *
 * Settings are stored in `browser.storage.local` under the following shape:
 * {
 *   blockedSites: string[],    // hostnames / partial hostnames, e.g. "youtube.com"
 *   blockedKeywords: string[], // arbitrary substrings to match against the full URL
 *   theme: "light" | "dark"
 * }
 */

const STORAGE_KEYS = {
  SITES: "blockedSites",
  KEYWORDS: "blockedKeywords",
  THEME: "theme",
};

// In-memory cache kept in sync with storage so the webRequest listener,
// which must respond synchronously, never has to wait on an async lookup.
let blockedSites = [];
let blockedKeywords = [];

const BLOCKED_PAGE_PATH = "blocked/blocked.html";
let blockedPageUrl = "";

function normalizeHost(host) {
  return (host || "").trim().toLowerCase().replace(/^www\./, "");
}

function normalizeKeyword(keyword) {
  return (keyword || "").trim().toLowerCase();
}

async function loadState() {
  const stored = await browser.storage.local.get([
    STORAGE_KEYS.SITES,
    STORAGE_KEYS.KEYWORDS,
  ]);
  blockedSites = (stored[STORAGE_KEYS.SITES] || []).map(normalizeHost).filter(Boolean);
  blockedKeywords = (stored[STORAGE_KEYS.KEYWORDS] || [])
    .map(normalizeKeyword)
    .filter(Boolean);
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes[STORAGE_KEYS.SITES]) {
    blockedSites = (changes[STORAGE_KEYS.SITES].newValue || [])
      .map(normalizeHost)
      .filter(Boolean);
  }
  if (changes[STORAGE_KEYS.KEYWORDS]) {
    blockedKeywords = (changes[STORAGE_KEYS.KEYWORDS].newValue || [])
      .map(normalizeKeyword)
      .filter(Boolean);
  }
});

function hostMatchesBlockedSite(hostname) {
  const normalizedHost = normalizeHost(hostname);
  return blockedSites.some((site) => {
    if (!site) return false;
    return normalizedHost === site || normalizedHost.endsWith(`.${site}`);
  });
}

function urlMatchesBlockedKeyword(fullUrl) {
  const lowerUrl = fullUrl.toLowerCase();
  return blockedKeywords.some((keyword) => keyword && lowerUrl.includes(keyword));
}

function isMatch(requestUrl) {
  let parsed;
  try {
    parsed = new URL(requestUrl);
  } catch (e) {
    return false;
  }

  // Never intercept our own extension pages (avoids redirect loops).
  if (parsed.protocol === "moz-extension:" || parsed.protocol === "chrome-extension:") {
    return false;
  }

  return hostMatchesBlockedSite(parsed.hostname) || urlMatchesBlockedKeyword(requestUrl);
}

function handleBeforeRequest(details) {
  if (!isMatch(details.url)) {
    return {};
  }

  const redirectUrl = `${blockedPageUrl}?url=${encodeURIComponent(details.url)}`;
  return { redirectUrl };
}

function init() {
  blockedPageUrl = browser.runtime.getURL(BLOCKED_PAGE_PATH);

  loadState().then(() => {
    browser.webRequest.onBeforeRequest.addListener(
      handleBeforeRequest,
      { urls: ["<all_urls>"], types: ["main_frame"] },
      ["blocking"]
    );
  });
}

init();
