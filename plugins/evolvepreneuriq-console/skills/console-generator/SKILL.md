---
name: console-generator
description: Build or rebuild the Evolvepreneur®iQ Workplace — the white-label, connector-driven AI operator console (Workflows, Cowork Skills, all EIQ Connector tools, and the EIQ persona library), personalised to whichever businesses are connected. Use whenever the user says "open my console", "rebuild my console", "regenerate the Evolvepreneur console", "show my iQ dashboard", "add an action/card to my console", or asks to refresh it from live EIQ data. Delivers the console as an HTML file and persists it as a Cowork artifact.
---

# Console Generator

Regenerate the Evolvepreneur iQ Console and deliver it to the user.

## What the console is

A single self-contained HTML dashboard with five tabs:

- **Workflows** — ready-made task cards across the user's businesses; each opens a builder that assembles a tailored prompt to paste back into Cowork.
- **Skills** — the installed Cowork skills, grouped by type.
- **EIQ Connector** — the real EIQ connector tools/modules (from `eiq_about`): accounting, CRM, inbox, EvolveDocs, Page Builder, YouTube, SQL and the rest, each scoped to a business.
- **Personas** — the EIQ skill-library VA personas, filterable by business.
- **Dashboard** — a live business dashboard (revenue, customers, finance & P&L, sales pipeline, subscriptions, royalties, website traffic) built connector-driven from the EIQ tenants, with a consolidated Group view. Ships empty; populated on request (see "The Dashboard tab" below).

A brand filter (one chip per active business) sits over the Workflows and Personas tabs. Each card copies a ready-to-run prompt to the clipboard.

## Steps

1. **Start from the newest template.** First try to fetch the latest published template from the CDN so a rebuild is always current even if this installed plugin's cached copy is older:
   `https://cdn.jsdelivr.net/gh/evolvesystems/evolvepreneuriq-plugins@main/plugins/evolvepreneuriq-console/skills/console-generator/references/console-template.html`
   Use WebFetch or a shell download. **If that succeeds, use it.** If the fetch fails (offline, blocked), fall back to the bundled `references/console-template.html`. Either way it's the white-label console (two-panel Workplace layout, the Evolvepreneur®iQ app icon, the blue→indigo→magenta palette, the Workflows / Skills / Connector / Personas / **Dashboard** tabs incl. the **Business Brain** and **Train & Improve** workflow lanes, the safe-by-default guardrails, the update check + persistent update bar, and the 84-tool EIQ Connector catalogue). It is generic by design: **all per-client values live in one `CONFIG` block at the top of the script.** Set them from what setup gathered / what the connectors report:
   - `ownerName` — the person's first name, for the greeting ("Hello, Tony"). Read it from the connected user.
   - `businessName` — the primary/active business (shown as the operator identity).
   - `businesses` — one entry per connected EIQ tenant (drives the switcher and every command's Business field).
   Do not hardcode client data anywhere else; the rest of the template stays generic.

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

## The Dashboard tab (v0.4.0+)

The template ships a fifth tab, **Dashboard**, plus a "Dashboard & Data" prompt-card lane in Workflows. The Dashboard renders charts and KPIs from a small set of data globals; the engine (`references/dash_engine.js`, already inlined in the template) is fully data-driven and connector-driven. With no data present it shows a "Dashboard not built yet" empty state — which is the correct state for the shipped template.

To populate it for a client, when they ask to "refresh my dashboard from EIQ":

1. For each connected EIQ tenant, pull only what its connector returns: `get_revenue_summary`, `get_customer_analytics`, `eiq_accounting` (pnl + ar_aging), `eiq_deal` (pipeline_summary), `get_subscription_health`, `eiq_royalty` (summary + by_platform), `eiq_analytics`. Do not invent figures; if a module returns nothing, omit that section for that tenant.
2. Assemble the data globals and inject them into the delivered HTML, immediately **before** the dashboard engine block:
   - `EIQ` — `{ tenantKey: { name, color, has:{finance,pipeline,subs,royalties}, rev:{fyRev,fyExp,fyNet,ytd,ytdOrders,lastMonth,lastMonthOrders}, cust:{total,avgLtv,oneOff,oneOffPct,totalLtv,top:[[name,orders,lifetime]],newByYear:{l,v},nvr:{l,nw,rt},ltvBuckets:{l,v},ordBuckets:{l,v}}, finance:{ar,arCount,revTop:[[label,amt]],expTop:[[label,amt]]}, pipeline:{total,pipelineValue,openCount,openValue,wonValue,lostValue,winRateVal,stages:[[stage,count,value]]}, subs:{active,mrr,ccy,churn,note}, roy:{gross,supplier,units,txns,payTotal,payCount,platforms:[[name,gross,units]]} } }`
   - `EIQGROUP` — `{ brands:[[key,label,lifetimeAUD,customers,color]], totalCust, totalLtv }` (consolidated roll-up).
   - Money is settled AUD from customer-analytics; where a tenant's `last_month.aud_total` is 0 because FX hasn't synced, set `lastMonth:0` (the engine shows an order count instead of a misleading $0). Keep `totalLtv` equal to the sum of the per-tenant bars.
   - **Auto-detect the legacy EP v1 source — let the connector decide.** The EiQ connector can tell whether a legacy **EP v1 store database** (the EPCLUB MariaDB) is attached: check `eiq_data_health` / the tenant's integrations list, or run a quick `mariadb_describe`. **If a store DB is present**, also pull its metrics (via `mariadb_query`) and inject the `GROUP`/`BR`/`TR`/`ESGX` globals so the **EP v1** source toggle appears automatically alongside EiQ. **If it isn't**, omit them and only EiQ shows. Never invent an EP v1 dataset — presence is determined by the connector, not assumed. (Reserved brand key: `group` is used for the consolidated view, so never name a tenant `group`.)
   - **Stamp the freshness.** Also inject `var DASH_ASOF='<D Mon YYYY>';` (the date you pulled the data — e.g. `'11 Aug 2026'`) so every Dashboard view shows a "Data as of …" line plus the "say 'refresh my dashboard from EIQ' for current numbers" hint. Update it each time you refresh.
3. Sections appear only where the data exists — the engine derives the brand list and section list from what you inject. Validate (below), then deliver.

**Data safety — non-negotiable.** Real client figures, customer names and emails live **only** in the client's delivered artifact, never in this plugin repo. Never commit populated data globals, a filled-in `console_dash.html`, or any client numbers back to the marketplace repo. The repo template must always ship with the empty-state Dashboard and zero client data.

## Notes

- Keep it a single self-contained HTML file — inline all CSS and JS, no external assets, no browser storage (no localStorage/sessionStorage).
- The console cannot call MCP tools live from inside the sandbox; the bridge to real work is the copy-prompt-then-paste flow. Live data is baked in at generation time (step 2), not fetched by the page.
- Preserve the Evolvepreneur iQ branding: the inline SVG logo, the `Evolvepreneur®iQ` wordmark, and the blue (#17b0f3) → indigo (#6a24c8) → magenta (#e0189e) palette.
