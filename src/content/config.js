// Shared configuration. Content scripts listed in manifest.json share one
// global scope, so everything is attached to a single `SiteTimer` namespace.
//
// NOTE: when adding a site here, also add its URL pattern to
// "content_scripts.matches" in manifest.json.
globalThis.SiteTimer = {
  // One progress-bar cycle.
  BLOCK_MS: 5 * 60 * 1000,

  SITES: [
    { name: "YouTube", domain: "youtube.com" },
    { name: "LinkedIn", domain: "linkedin.com" },
  ],

  /** Returns the tracked site matching a hostname, or undefined. */
  findSite(hostname) {
    return this.SITES.find(
      (s) => hostname === s.domain || hostname.endsWith(`.${s.domain}`)
    );
  },
};
