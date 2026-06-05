const DEFAULT_APP_URL = "https://all-in-one-resume-builder-job-assis.vercel.app";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-job-link",
    title: "Save job link",
    contexts: ["link"]
  });
  chrome.contextMenus.create({
    id: "save-job-page",
    title: "Save current job page",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  const settings = await chrome.storage.sync.get(["appUrl"]);
  const appUrl = settings.appUrl || DEFAULT_APP_URL;
  const pageUrl = info.linkUrl || info.pageUrl || tab.url || "";
  let scraped = {};

  if (info.menuItemId === "save-job-page") {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeVisibleJobDetails
    });
    scraped = result?.result || {};
  }

  const payload = normalizePayload({
    ...scraped,
    url: pageUrl
  });

  try {
    const response = await fetch(`${appUrl.replace(/\/$/, "")}/api/jobs/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    await chrome.storage.local.set({
      lastSavedJob: data.job || payload,
      lastSavedAt: new Date().toISOString()
    });
  } catch (error) {
    await chrome.storage.local.set({
      lastSaveError: error instanceof Error ? error.message : "Unable to save job",
      lastSavedAt: new Date().toISOString()
    });
  }
});

function normalizePayload(payload) {
  return {
    title: payload.title || "Saved job",
    company: payload.company || "Unknown company",
    location: payload.location || "",
    url: payload.url || "",
    description: payload.description || "",
    notes: "Saved from Chrome extension",
    stage: "Saved"
  };
}

function scrapeVisibleJobDetails() {
  const title =
    document.querySelector("[data-testid*='job-title' i]")?.textContent ||
    document.querySelector("h1")?.textContent ||
    document.title;
  const company =
    document.querySelector("[data-testid*='company' i]")?.textContent ||
    document.querySelector("[class*='company' i]")?.textContent ||
    "";
  const location =
    document.querySelector("[data-testid*='location' i]")?.textContent ||
    document.querySelector("[class*='location' i]")?.textContent ||
    "";
  const description =
    document.querySelector("[data-testid*='description' i]")?.textContent ||
    document.querySelector("[class*='description' i]")?.textContent ||
    document.querySelector("main")?.textContent ||
    document.body?.innerText ||
    "";

  return {
    title: clean(title).slice(0, 180),
    company: clean(company).slice(0, 120),
    location: clean(location).slice(0, 120),
    description: clean(description).slice(0, 8000)
  };
}

function clean(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}
