# Contributing

Thanks for your interest in improving Site Time Tracker! Bug reports, ideas, and pull requests are all welcome.

## Getting set up

1. Fork and clone the repo.
2. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the project folder.
3. After editing code, click the reload icon on the extension card and refresh the page you're testing.

There is no build step or dependency install. The extension is plain JavaScript.

## Project layout

See the [Project structure](README.md#project-structure) section of the README.

## Making changes

- Open an issue first for larger changes so we can agree on the approach.
- Keep pull requests focused: one change per PR.
- Match the existing code style (2-space indent, double quotes, semicolons).
- Test manually on both YouTube and LinkedIn, in light and dark mode, and with the card both expanded and minimized.
- If you add a setting, update `DEFAULTS` in `src/content/config.js`, the settings page, and the README.
- If you add a site, add it to `SITES` in `src/content/config.js` **and** to `content_scripts.matches` in `manifest.json`.
- Add an entry under **Unreleased** in `CHANGELOG.md`.

## Pull requests

1. Create a branch from `main`.
2. Commit with clear messages.
3. Open a PR and fill in the template.

## Releasing (maintainers)

1. Move the **Unreleased** entries in `CHANGELOG.md` under a new `## [x.y.z]` heading.
2. Bump `version` in `manifest.json` to `x.y.z`.
3. Commit, then tag and push:
   ```bash
   git tag vx.y.z && git push origin vx.y.z
   ```
4. The **Release** workflow checks the tag matches the manifest, zips the extension, and publishes a GitHub Release using the changelog section as the notes.

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE) and that you will follow the [Code of Conduct](CODE_OF_CONDUCT.md).
