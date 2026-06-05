const input = document.querySelector("#appUrl");
const status = document.querySelector("#status");
const save = document.querySelector("#save");

chrome.storage.sync.get(["appUrl"]).then((settings) => {
  input.value =
    settings.appUrl ||
    "https://all-in-one-resume-builder-job-assis.vercel.app";
});

save.addEventListener("click", async () => {
  const value = input.value.trim().replace(/\/$/, "");
  await chrome.storage.sync.set({ appUrl: value });
  status.textContent = "Saved.";
});
