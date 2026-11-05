// Entry point: tracks time spent today on the current site and persists it
// in chrome.storage.local so it survives refreshes, new tabs and restarts.
(async () => {
  const site = SiteTimer.findSite(location.hostname);
  if (!site) return; // Safety guard: only run on tracked sites.

  const widget = SiteTimer.createWidget(site.name);

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

  // Pick up time added by other tabs of the same site.
  chrome.storage.onChanged.addListener((changes) => {
    const change = changes[key];
    if (change && change.newValue > elapsed) elapsed = change.newValue;
  });

  const tick = () => {
    const now = Date.now();

    if (storageKey() !== key) { // midnight passed: start a fresh day
      key = storageKey();
      elapsed = 0;
    }

    if (!document.hidden) { // only count time while the tab is visible
      elapsed += now - last;
      try {
        chrome.storage.local.set({ [key]: elapsed });
      } catch {
        // Extension was reloaded and this script is orphaned; refresh the page.
      }
    }

    last = now;
    widget.render(elapsed);
  };

  tick();
  setInterval(tick, 1000);
})();
