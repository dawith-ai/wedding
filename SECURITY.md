# Security Policy

## Data model

**wedding** has no backend. All invitation content a user enters (names, dates,
venue, greeting, photo URLs, bank account numbers, options) is encoded into the
share link itself — it is not stored on any server. Photos are hosted on
third-party services (e.g. Imgur) via URLs the user provides; only the URLs are
encoded.

Because everything lives in the link, the main security concerns are:
- Safe encoding/decoding of link data (no injection when rendering user content).
- Safe handling of third-party embeds (maps, image hosts, fonts).
- Not leaking user-entered data to any unintended destination.

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Use GitHub's
private vulnerability reporting (Security → Report a vulnerability) on this
repository, or contact the maintainer directly.

Include a description, reproduction steps, and the affected theme/flow if
relevant. We aim to acknowledge reports promptly and fix confirmed issues before
public disclosure.

## Scope

In scope: the share-link encode/decode path, rendering of user-provided content,
and third-party embed handling. Out of scope: issues requiring a compromised
local device or browser, and the security of external image/map hosts the user
chooses to link to.
