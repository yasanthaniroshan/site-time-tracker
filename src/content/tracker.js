// Entry point: tracks time spent today on the current site and persists it
// in chrome.storage.local so it survives refreshes, new tabs and restarts.
// User settings live in chrome.storage.sync (edited on the options page).
(async () => {
  const site = SiteTimer.findSite(location.hostname);
  if (!site) return; // Safety guard: only run on tracked sites.

  let settings = await SiteTimer.loadSettings();
  const widget = SiteTimer.createWidget(site.name, settings);
  widget.applySettings(settings);

  // Local date, so the total resets at local midnight.
  const storageKey = () => {
    const d = new Date();
    const day = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
      .map((n) => String(n).padStart(2, "0"))
      .join("-");
    return `time:${day}:${site.name}`;
  };

  let key = storageKey();
  let elapsed = (await chrome.storage.local.get(key))[key] || 0;
  let last = Date.now();

  chrome.storage.onChanged.addListener((changes, area) => {
    // Settings edited on the options page: apply instantly.
    if (area === "sync" && changes[SiteTimer.SETTINGS_KEY]) {
      settings = SiteTimer.normalize(changes[SiteTimer.SETTINGS_KEY].newValue);
      widget.applySettings(settings);
      widget.render(elapsed, settings);
    }
    // Time added by another tab of the same site.
    if (area === "local" && changes[key] && changes[key].newValue > elapsed) {
      elapsed = changes[key].newValue;
    }
  });

  const tick = () => {
    const now = Date.now();

    if (storageKey() !== key) { // midnight passed: start a fresh day
      key = storageKey();
      elapsed = 0;
    }

    // Count only while this site is enabled and the tab is visible.
    if (settings.sites[site.name] && !document.hidden) {
      elapsed += now - last;
      try {
        chrome.storage.local.set({ [key]: elapsed });
      } catch {
        // Extension was reloaded and this script is orphaned; refresh the page.
      }
    }

    last = now;
    widget.render(elapsed, settings);
  };

  tick();
  setInterval(tick, 1000);
})();
