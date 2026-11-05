const $ = (id) => document.getElementById(id);
const status = $("status");
let statusTimer;

function say(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
  clearTimeout(statusTimer);
  if (!isError) statusTimer = setTimeout(() => (status.textContent = ""), 2000);
}

// Build the per-site checkboxes and position dropdown from config.
for (const site of SiteTimer.SITES) {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<label for="site-${site.name}">${site.name}<small>${site.domain}</small></label>
                   <input id="site-${site.name}" type="checkbox">`;
  $("sites").appendChild(row);
}
for (const [value, label] of Object.entries(SiteTimer.POSITIONS)) {
  $("position").add(new Option(label, value));
}

function fill(settings) {
  $("blockMinutes").value = settings.blockMinutes;
  $("warnAfterBlocks").value = settings.warnAfterBlocks;
  $("dangerAfterBlocks").value = settings.dangerAfterBlocks;
  $("position").value = settings.position;
  $("startMinimized").checked = settings.startMinimized;
  for (const site of SiteTimer.SITES) {
    $(`site-${site.name}`).checked = settings.sites[site.name];
  }
}

function read() {
  return {
    blockMinutes: Number($("blockMinutes").value),
    warnAfterBlocks: Number($("warnAfterBlocks").value),
    dangerAfterBlocks: Number($("dangerAfterBlocks").value),
    position: $("position").value,
    startMinimized: $("startMinimized").checked,
    sites: Object.fromEntries(
      SiteTimer.SITES.map((s) => [s.name, $(`site-${s.name}`).checked])
    ),
  };
}

function validate(s) {
  const whole = (n) => Number.isInteger(n) && n >= 1;
  if (!whole(s.blockMinutes) || s.blockMinutes > 120) return "Block length must be 1–120 minutes.";
  if (!whole(s.warnAfterBlocks)) return "Orange threshold must be a whole number of at least 1.";
  if (!whole(s.dangerAfterBlocks)) return "Red threshold must be a whole number of at least 1.";
  if (s.dangerAfterBlocks <= s.warnAfterBlocks) return "Red must come after orange.";
  return null;
}

$("save").addEventListener("click", async () => {
  const settings = read();
  const error = validate(settings);
  if (error) return say(error, true);
  await SiteTimer.saveSettings(settings);
  say("Saved ✓");
});

$("reset").addEventListener("click", async () => {
  const defaults = SiteTimer.DEFAULTS;
  fill(defaults);
  await SiteTimer.saveSettings(defaults);
  say("Reset to defaults ✓");
});

SiteTimer.loadSettings().then(fill);
