// The floating card UI. Rendered inside a closed shadow root so the host
// page's CSS can't affect it (and vice versa).
SiteTimer.createWidget = function (siteName) {
  const host = document.createElement("div");
  host.style.cssText =
    "all:initial; position:fixed; top:20px; right:20px; z-index:2147483647;";
  const root = host.attachShadow({ mode: "closed" });

  root.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .card {
        width: 280px; padding: 16px 18px 18px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        color: #1f2937;
        background: rgba(255,255,255,.92);
        backdrop-filter: blur(14px);
        border: 1px solid rgba(0,0,0,.06);
        border-radius: 18px;
        box-shadow: 0 10px 30px rgba(17,24,39,.18), 0 2px 6px rgba(17,24,39,.08);
        cursor: pointer; user-select: none;
        transition: transform .2s ease;
      }
      .card:hover { transform: translateY(-2px); }
      .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
      .title { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #6b7280; }
      .badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 999px; background: #e0f2fe; color: #0369a1; }
      .time { font-size: 36px; font-weight: 700; letter-spacing: -.02em; margin: 6px 0 14px; font-variant-numeric: tabular-nums; }
      .track { height: 12px; border-radius: 999px; background: #e5e7eb; overflow: hidden; }
      .fill { height: 100%; width: 0%; border-radius: 999px; transition: width .9s linear, background .4s; }
      .meta { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #6b7280; font-variant-numeric: tabular-nums; }
      .card.mini { width: auto; padding: 10px 14px; }
      .card.mini .top, .card.mini .track, .card.mini .meta { display: none; }
      .card.mini .time { font-size: 18px; margin: 0; }
      @media (prefers-color-scheme: dark) {
        .card { background: rgba(31,41,55,.92); color: #f9fafb; border-color: rgba(255,255,255,.08); }
        .title, .meta { color: #9ca3af; }
        .track { background: #374151; }
        .badge { background: #0c4a6e; color: #bae6fd; }
      }
    </style>
    <div class="card" title="Click to minimize / expand">
      <div class="top"><span class="title"></span><span class="badge"></span></div>
      <div class="time"></div>
      <div class="track"><div class="fill"></div></div>
      <div class="meta"><span class="next"></span><span class="pct"></span></div>
    </div>`;

  const $ = (selector) => root.querySelector(selector);
  const card = $(".card");
  const el = {
    title: $(".title"),
    badge: $(".badge"),
    time: $(".time"),
    fill: $(".fill"),
    next: $(".next"),
    pct: $(".pct"),
  };

  el.title.textContent = `${siteName} today`;
  card.addEventListener("click", () => card.classList.toggle("mini"));
  document.documentElement.appendChild(host);

  const formatDuration = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = String(s % 60).padStart(2, "0");
    return h ? `${h}h ${String(m).padStart(2, "0")}m ${sec}s` : `${m}m ${sec}s`;
  };

  // Bar colour shifts as more blocks pass: green -> orange -> red.
  const fillColor = (blocksDone) =>
    blocksDone >= 4 ? "linear-gradient(90deg,#f87171,#ef4444)"
    : blocksDone >= 2 ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
    : "linear-gradient(90deg,#34d399,#10b981)";

  return {
    /** Redraw the card for the total time (ms) spent today. */
    render(elapsedMs) {
      const { BLOCK_MS } = SiteTimer;
      const inBlock = elapsedMs % BLOCK_MS;
      const blocksDone = Math.floor(elapsedMs / BLOCK_MS);
      const secondsLeft = Math.ceil((BLOCK_MS - inBlock) / 1000);

      el.time.textContent = formatDuration(elapsedMs);
      el.badge.textContent = `Block ${blocksDone + 1}`;
      el.fill.style.width = `${(inBlock / BLOCK_MS) * 100}%`;
      el.fill.style.background = fillColor(blocksDone);
      el.next.textContent =
        `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")} until next block`;
      el.pct.textContent = `${Math.floor((inBlock / BLOCK_MS) * 100)}%`;
    },
  };
};
