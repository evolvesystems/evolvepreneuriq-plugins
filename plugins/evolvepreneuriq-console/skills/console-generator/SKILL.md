---
name: console-generator
description: Build or rebuild the Evolvepreneur iQ Console — the branded, connector-driven launcher dashboard for John North's businesses (Workflows, Cowork Skills, EIQ Connector tools, and the EIQ persona library). Use whenever the user says "open my console", "rebuild my console", "regenerate the Evolvepreneur console", "show my iQ dashboard", "add an action/card to my console", or asks to refresh it from live EIQ data. Delivers the console as an HTML file and persists it as a Cowork artifact.
---

# Console Generator

Regenerate the Evolvepreneur iQ Console and deliver it to the user.

## What the console is

A single self-contained HTML dashboard with four tabs:

- **Workflows** — ready-made task cards across the user's businesses; each opens a builder that assembles a tailored prompt to paste back into Cowork.
- **Skills** — the installed Cowork skills, grouped by type.
- **EIQ Connector** — the real EIQ connector tools/modules (from `eiq_about`): accounting, CRM, inbox, EvolveDocs, Page Builder, YouTube, SQL and the rest, each scoped to a business.
- **Personas** — the EIQ skill-library VA personas, filterable by business.

A brand filter (one chip per active business) sits over the Workflows and Personas tabs. Each card copies a ready-to-run prompt to the clipboard.

## Steps

1. **Start from the template.** Read `references/console-template.html` — it is the current, working console with all data, styling, the Evolvepreneur iQ SVG logo, and the blue→indigo→magenta palette baked in. This is the baseline you deliver unless the user asked for a change or a live refresh.

2. **Refresh from live EIQ data when asked** (or when the user wants it current). The console is connector-driven — regenerate its dynamic data from whatever EIQ connectors are attached:
   - Enumerate the connected EIQ tenants (one MCP server per business).
   - For each, call `eiq_about` for its module map and `eiq_skill_library` (action=search, limit 100) for its persona list.
   - Update the console's brand list, the per-business persona availability, and the EIQ Connector cards to match. Personas shared across every tenant show on all; tenant-specific ones show only on that business.
   - If a connector is not attached, drop that business rather than inventing it.

3. **Apply any requested edits** — new Workflow cards, renamed lanes, palette tweaks. The data lives in the `ACTIONS`, `SKILLS`, `CONNECTOR` and `LIBRARY` arrays in the template's script; add or edit entries there. Keep each card's `template` a function returning a ready-to-run prompt string.

4. **Validate before delivering.** Extract the main `<script>` and run it under Node with stubbed `document`/`navigator` to confirm the arrays parse and every card's `template({...})` returns a non-empty string. Fix any failure before shipping.

5. **Deliver and persist.**
   - Write the final HTML to a file and send it with `SendUserFile` (display: render).
   - Then persist it with `mcp__remote-devices__create_artifact` (or `update_artifact` if an artifact named `evolve-console` already exists) using the `file_uuid` from `SendUserFile`, so it lives in the user's artifact gallery and updates in place.

## Notes

- Keep it a single self-contained HTML file — inline all CSS and JS, no external assets, no browser storage (no localStorage/sessionStorage).
- The console cannot call MCP tools live from inside the sandbox; the bridge to real work is the copy-prompt-then-paste flow. Live data is baked in at generation time (step 2), not fetched by the page.
- Preserve the Evolvepreneur iQ branding: the inline SVG logo, the `Evolvepreneur®iQ` wordmark, and the blue (#17b0f3) → indigo (#6a24c8) → magenta (#e0189e) palette.
