# Changelog

All notable changes to the **Evolvepreneur®iQ Workplace** plugin.

## v0.4.12 — 2026-08-20

### Added
- **Royalties & Books now shows a lot more than gross-by-year.** New KPI row (gross, author/supplier
  royalty, publisher's share, approved vs. pending transactions), a gross-vs-author-royalty-by-year
  chart, units-sold-by-year chart, a per-platform breakdown table (units/gross/author royalty), and
  a top-titles-by-royalty table. The `console-generator` skill now pulls `eiq_royalty` summary/
  by_platform plus a product-joined top-titles query for every EP v1 brand with royalty data.
- **New "Ops & Support" section for EP v1 brands.** Support ticket volume by month, tickets by
  department, contractor timesheet hours and pay, and an internal-task overdue rate — data the
  connector already had (ticket/timesheet/task tables) but the dashboard never surfaced.

## v0.4.11 — 2026-08-20

### Fixed
- **EP v1 course/enrolment counts included internal, non-course records.** The legacy platform's
  `courses_course` table is a generic structured-content container, not just training courses —
  it also holds internal staff training, sales proposals, launch blueprints, podcast guest
  workflows and onboarding surveys. Counting every row overstated a tenant's course and enrolment
  KPIs (one tenant showed 42 courses / 2,450 enrolments when only 30 / 2,188 were genuine
  courses). The `console-generator` skill now excludes `STAFF:`, `PROPOSAL:`, and `BLUEPRINT:`
  prefixed records before computing these KPIs for any EP v1 brand.

## v0.4.10 — 2026-08-20

### Fixed
- **The legacy EP v1 source (and its EiQ/EP v1 switcher) could go completely invisible even when
  correctly populated.** The v0.4.8 fix that reads dashboard data off `window` (to work around
  artifact viewers blocking `eval`) only works for globals declared with `var` — a top-level
  `const`/`let` in a classic script tag never attaches to `window`, so the lookup silently returned
  `undefined`. If a client's `GROUP`/`BR`/`TR`/`ESGX` blocks were written with `const`, EP v1 data
  was fully injected but the dashboard engine could never see it: no error, no switcher, EP v1
  simply didn't exist as far as the page was concerned. `EIQ`/`EIQGROUP` happened to keep working
  in the affected console because they were declared with `var`, which masked the problem.
- The `console-generator` skill's data-injection instructions now say explicitly: every injected
  dashboard global (`EIQ`, `EIQGROUP`, `GROUP`, `BR`, `TR`, `ESGX`, `DASH_ASOF`) must be declared
  with `var`, never `const`/`let`, so this can't recur in a future console build.

## v0.4.9 — 2026-08-20

### Added
- **Monthly revenue, sourced from real orders — not QuickBooks.** The `finance` block (Finance &
  P&L tab) still comes from QuickBooks `pnl`, but the monthly revenue trend and the headline
  YTD/last-month KPIs are now built from each tenant's own `orders` table: real transaction
  dates, real statuses, no currency-mixing. This works identically whether or not a tenant has
  QuickBooks or formal invoicing connected, so every tenant with real sales gets a real trend —
  including ones previously shown as having no finance data at all.
- **Monthly revenue chart is now a bar chart with full history**, not a capped trailing window —
  matching the existing "Annual paid revenue" chart's style and going back to each tenant's first
  completed order (the pull is chunked by calendar year to stay under the connector's per-call
  row cap).
- **Per-tenant "data as of" stamps.** Each tenant's own refresh date now shows on its Dashboard
  view, falling back to the console-wide date, so a partial refresh doesn't make the whole
  console look uniformly fresh.
- **One-click refresh link inside the Dashboard tab.** The "Data as of" line now includes a
  clickable "refresh my dashboard from EIQ" link that jumps straight to the existing refresh
  workflow card — no need to remember the phrase or hunt for the right tab.
- **"Connect another business" workflow card**, for adding a new EIQ tenant to an existing
  console without a full rebuild conversation.

### Fixed
- **Finance/pipeline/subscription/royalty detection could get stuck stale in either direction.**
  Previously, once a tenant was marked as not having, say, finance data, that could persist even
  after QuickBooks was connected later. Every refresh now re-derives each `has.*` flag fresh from
  what the connectors actually return that pull, rather than trusting a prior refresh's value.
- **Template version constant was out of step with the published plugin version**, which could
  cause the in-console update indicator to misreport. It now tracks the plugin version on every
  release.

## v0.4.8 — 2026-08-16

### Fixed
- **Dashboard showed "not built yet" inside a persisted Cowork artifact, even with data injected.**
  The engine was reading its `EIQ`/`EIQGROUP`/`GROUP`/`BR`/`TR`/`ESGX` data globals with `eval()`.
  Artifact viewers run under a Content-Security-Policy that blocks `eval`, so the lookup silently
  failed there (while working fine in a plain downloaded/previewed file), making a fully-populated
  console look empty. The engine now reads these globals directly off `window` instead — no `eval`
  anywhere in the dashboard tab.

## v0.4.7 — 2026-08-16

### Fixed
- **Dashboard crashes and `$NaN` on incomplete data.** If a live refresh pulled a figure that was
  missing, `null`, or in an unexpected shape, the affected KPI could throw a JS error (blanking the
  tab) or print a literal "$NaN". The engine now normalizes every tenant's data on load: a flag like
  "has finance data" is only trusted if the numbers behind it are actually usable, so the UI falls
  back to the next-best KPI (e.g. YTD revenue instead of FY P&L) instead of breaking. Every money/
  percentage calculation is now division-by-zero and non-finite safe, and a last-resort guard shows
  a friendly "couldn't render this view" message rather than a blank tab for anything unforeseen.

## v0.4.6 — 2026-08-16

### Added
- **Quick slash commands.** `/rebuild`, `/refresh` and `/push-plugin` now appear in the `/` menu once
  the plugin is installed — shortcuts for "rebuild my console", "refresh my dashboard from EIQ",
  and the maintainer's GitHub push flow, with no need to type the full phrase.

## v0.4.5 — 2026-08-16

### Fixed
- **EP v1 brand names and colors were leaking in from the EiQ source.** When a tenant used the
  same key for both a client's EiQ connector and their legacy EP v1 record, the Dashboard's brand
  list always showed the EiQ label — so switching to EP v1 didn't visually distinguish the two
  data sources. Brand names and colors are now looked up from whichever source is currently
  selected.

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
