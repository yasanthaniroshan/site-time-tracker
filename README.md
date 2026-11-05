# Site Time Tracker

A small Chrome extension (Manifest V3) that shows a floating card with how much time you've spent **today** on YouTube and LinkedIn, with a progress bar that fills every 5 minutes.

## Features

- Floating card with total time today, a 5-minute progress bar, a block counter and a countdown to the next block
- Bar colour shifts from green to orange (10 min) to red (20 min) as the day's total grows
- Time is saved per site and per day, so it survives page refreshes, new tabs and browser restarts
- Only counts time while the tab is visible
- Resets automatically at local midnight
- Click the card to minimize or expand it
- Light and dark mode (follows your system setting)
- All data stays on your machine in `chrome.storage.local`. Nothing is sent anywhere.

## Install (from source)

1. Clone this repo:
   ```bash
   git clone <your-repo-url>
   ```
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder (the one containing `manifest.json`).
5. Open YouTube or LinkedIn. The card appears in the top-right corner.

After changing code, click the reload icon on the extension's card in `chrome://extensions`, then refresh the page you're testing on.

## Project structure

```
.
├── manifest.json          # Extension manifest (MV3)
├── README.md
├── icons/                 # Extension icons (icon.svg is the source)
└── src/
    └── content/
        ├── config.js      # Tracked sites and block length
        ├── widget.js      # Floating card UI (shadow DOM)
        └── tracker.js     # Time tracking and storage logic
```

The three content scripts share one global scope and are loaded in the order listed in `manifest.json`. They communicate through a `SiteTimer` namespace.

## Customize

**Change the block length:** edit `BLOCK_MS` in `src/content/config.js`.

**Track another site:**
1. Add `{ name: "Reddit", domain: "reddit.com" }` to `SITES` in `src/content/config.js`.
2. Add `"*://*.reddit.com/*"` to `content_scripts.matches` in `manifest.json`.
3. Reload the extension.

## Known limitations

- If the same site is visible in two windows at once (for example side by side), both add time, so it double counts.
- Tabs that were open before you reloaded the extension keep running the old script until refreshed.

## License

Add a license of your choice (for example MIT) before publishing.
