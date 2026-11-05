# Security Policy

## Supported versions

Only the latest release receives fixes.

## Reporting a vulnerability

Please do not open a public issue for security problems. Use GitHub's
**Security → Report a vulnerability** form on this repository so the report stays
private until a fix is available.

Include the steps to reproduce and the affected version. You can expect an initial
response within a few days.

## Data handling

The extension stores time totals in `chrome.storage.local` and settings in
`chrome.storage.sync`. It makes no network requests and requests no host
permissions beyond running its content script on the tracked sites.
