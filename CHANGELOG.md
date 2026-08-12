# Changelog

All notable changes to the **Evolvepreneur®iQ Workplace** plugin.

## v0.4.4 — 2026-08-11

### Changed
- **EP v1 is now connector-detected.** The dashboard's optional legacy EP v1 source (the EPCLUB
  store database) is included automatically when the EiQ connector has that store DB attached — the
  refresh checks for it rather than assuming. Tenants without it simply see EiQ only.

### Fixed
- Removed a duplicate **"Group"** row that appeared when a data source carried its own `group` key;
  `group` is now reserved for the consolidated view.

## v0.4.3 — 2026-08-11

### Added
- **Freshness on the Dashboard.** Every Dashboard view now carries a **"Data as of &lt;date&gt;"**
  stamp plus a reminder to say **"refresh my dashboard from EIQ"** for current numbers. The date is
  set when the data is pulled (a `DASH_ASOF` value), so the snapshot's age and the refresh command
  are visible right on the page — no need to remember either.

## v0.4.2 — 2026-08-11

### Fixed
- **"Rebuild my console" now fetches the newest template from the CDN.** The generator's
  fetch URL was missing the `skills/console-generator/` path segment, so the fetch silently
  404'd and every rebuild fell back to the template *bundled in the installed plugin* — which
  only updates after a sync **and** a restart. With the path corrected, a rebuild pulls the
  latest published template directly, so updates reach the console without a restart. (This is
  why a rebuild could still show the old console right after an update.)

## v0.4.1 — 2026-08-11

### Added
- **Persistent update prompt.** When a newer version is published, the console now shows a
  dismissable **"Update ready"** bar (bottom-right) as well as the amber version pill, and it
  **re-checks the version feed while open** — every 20 minutes and whenever the tab is refocused —
  so an update that ships mid-session still surfaces. Both the bar and the pill open a card with
  the release notes and the exact steps to apply (sync → restart → rebuild → refresh). Dismissing
  the bar hides it until a *newer* version appears.

## v0.4.0 — 2026-08-11

### Added
- **Dashboard tab.** A live business dashboard built connector-driven from your EIQ tenants:
  revenue, customers & LTV, finance & P&L, sales pipeline, subscriptions, royalties, and website
  traffic — plus a consolidated **Group** view across every connected business. Brands and
  sections render only where a tenant's connector returns data; it ships empty and fills in on
  request.
- **"Dashboard & Data" prompt-card lane** in Workflows (refresh the dashboard, finance review,
  pipeline review, top customers, traffic audit, group board snapshot).
- **Actionable update prompt.** When a newer version is published, the in-console version pill
  turns amber and opens a card explaining what's new and the exact steps to apply it
  (sync → restart → rebuild → refresh).
- Bundled Chart.js v4 (MIT) inline so the console stays self-contained.

### How to get it
Update the plugin (Settings → Plugins → the `evolvepreneuriq-plugins` marketplace → Sync
automatically → Check for updates), quit and reopen Claude, then say **"rebuild my console"** and
**"refresh my dashboard from EIQ"**.

### Data safety
The Dashboard is generic in this repo and contains **no** business data. Real figures, customer
names and emails live only in your own delivered console artifact — never in the marketplace.

## v0.3.0 — 2026-08-10

### Added
- Business Brain and Train & Improve workflow lanes.
- Safe-by-default guardrails and an in-console update check.
- First-run `console-setup` skill for standing automations (morning brief, weekly prospect dig,
  overdue-invoice sweep).
