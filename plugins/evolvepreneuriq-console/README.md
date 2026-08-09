# Evolvepreneur iQ Console

A branded, connector-driven launcher for John North's businesses — Evolvepreneur, Evolve Systems, Get My Book, Healthy Life Network and LongevityLab. It regenerates the Evolvepreneur iQ Console (a single-page dashboard) and sets up the standing automations behind it.

## What you get

**A four-tab console:**

- **Workflows** — ready-made task cards across your businesses; each opens a builder that assembles a tailored prompt to paste back into Cowork.
- **Skills** — your installed Cowork skills, grouped by type.
- **EIQ Connector** — the real EIQ tools and modules (accounting, CRM, inbox, EvolveDocs, Page Builder, YouTube, SQL and more), each scoped to a business.
- **Personas** — the EIQ skill-library VA personas, filterable by business.

A brand filter sits over Workflows and Personas. Every card copies a ready-to-run prompt to your clipboard — paste it into Cowork and Claude does the work.

**Standing automations** (opt-in at setup): a weekday morning brief, a weekly prospect dig, and a weekly overdue-invoice sweep — created as scheduled tasks.

## How it works

The console is built from whatever EIQ connectors are attached — each connector is one business. When it's regenerated, it reads each tenant's live module map and persona library, so it always reflects reality. The rendered console can't call tools directly (it runs sandboxed); the bridge is copy-a-prompt then paste it into Cowork.

## Skills

- **console-setup** — run once on install: confirms your businesses, asks which automations to create, provisions them as scheduled tasks, then builds the console.
- **console-generator** — build or rebuild the console any time ("rebuild my console", "add an action for X", "refresh from live EIQ data").

## Requirements

See `CONNECTORS.md`. In short: attach the EIQ Manager connector for each business you want on the console. Nothing else is required.

## Updating

Published to a private marketplace, new versions sync automatically — no delete-and-reinstall. Between versions, the console artifact itself updates in place.
