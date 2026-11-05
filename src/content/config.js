// Shared configuration + settings access. Content scripts listed in
// manifest.json (and the options page) share one global scope, so everything
// hangs off a single `SiteTimer` namespace.
//
// NOTE: when adding a site here, also add its URL pattern to
// "content_scripts.matches" in manifest.json.
globalThis.SiteTimer = {
  SETTINGS_KEY: "settings",

  SITES: [
    { name: "YouTube", domain: "youtube.com" },
    { name: "LinkedIn", domain: "linkedin.com" },
  ],

  POSITIONS: {
    "top-right": "Top right",
    "top-left": "Top left",
    "bottom-right": "Bottom right",
    "bottom-left": "Bottom left",
  },

  /** Default settings. `sites` maps site name -> tracking enabled. */
  get DEFAULTS() {
    return {
      blockMinutes: 5, // length of one progress-bar cycle
      warnAfterBlocks: 2, // bar/compact card turns orange after this many blocks
      dangerAfterBlocks: 4, // ...and red after this many
      position: "top-right",
      startMinimized: false,
      sites: Object.fromEntries(this.SITES.map((s) => [s.name, true])),
    };
  },

  /** Fill in anything missing from a stored settings object. */
  normalize(stored) {
    const d = this.DEFAULTS;
    return { ...d, ...stored, sites: { ...d.sites, ...(stored && stored.sites) } };
  },

  async loadSettings() {
    const result = await chrome.storage.sync.get(this.SETTINGS_KEY);
    return this.normalize(result[this.SETTINGS_KEY]);
  },

  saveSettings(settings) {
    return chrome.storage.sync.set({ [this.SETTINGS_KEY]: settings });
  },

  /** Returns the tracked site matching a hostname, or undefined. */
  findSite(hostname) {
    return this.SITES.find(
      (s) => hostname === s.domain || hostname.endsWith(`.${s.domain}`)
    );
  },
};
