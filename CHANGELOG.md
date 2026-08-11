# Changelog

All notable changes to the **Evolvepreneur®iQ Workplace** plugin.

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
