# Evolvepreneur iQ — plugin marketplace

This repo hosts the **Evolvepreneur®iQ Workplace** plugin — a white-label, connector-driven AI operator console. It's a single-page dashboard with five tabs (Workflows, your Cowork Skills, the live EIQ Connector tools, your EIQ persona library, and a live **Dashboard**), plus a first-run setup skill that can create standing automations (morning brief, weekly prospect dig, overdue-invoice sweep).

> A visual step-by-step guide with screenshots is provided separately (`install-guide.html`). This README is the written version.

---

## What's new in v0.4.0

A live **Dashboard** tab. It reads your EIQ tenants and shows revenue, customers, finance & P&L, sales pipeline, subscriptions, royalties and website traffic, with a consolidated **Group** view across every connected business. It's **connector-driven** — a section only appears for a tenant when that tenant's connector actually returns the data — and it ships empty, then fills in when you ask.

To get it after updating: **"rebuild my console"**, then **"refresh my dashboard from EIQ"**. (See *Update the plugin* below.) No business data is stored in this repo — the Dashboard is built into your own private console artifact only. Full history in [`CHANGELOG.md`](./CHANGELOG.md).

---

## What you need

- **A Claude account.** Required for every method below.
- **The EIQ Manager connector** attached for each business you want on the console (see *Connect your EIQ data*). Without it the console still opens, but the EIQ Connector, Personas and data tabs have nothing to read.
- **A GitHub login is only needed for Method A (the marketplace).** Method B (uploading the file) needs no GitHub at all.

---

## Install — pick ONE method

### Method A — Add the marketplace from GitHub  (recommended — auto-updates)

Best for almost everyone: the plugin keeps itself up to date when a new version is published, and the console will prompt you when there's an update.

1. In Claude, open **Settings -> Plugins**.
2. Top right, click **Add -> Add marketplace -> Add from a repository**.
3. **The first time, Claude asks you to connect / sign in to GitHub.** This is required for this method (even though the repo is public).
4. Type **evolvesystems/evolvepreneuriq-plugins** (or paste `https://github.com/evolvesystems/evolvepreneuriq-plugins`), select it, leave **Sync automatically** on, and click **Sync**.
5. In the directory that opens, on the **Personal** tab, click the **+** on the **Evolvepreneuriq console** card.

*Updates:* automatic — a version bump on GitHub syncs to you. See **Updating — step by step** below.

### Method B — Upload the plugin file  (no GitHub required)

Best if you can't or don't want to connect GitHub.

1. Get the plugin file from whoever shared it: **`evolvepreneuriq-console.zip`**.
2. In Claude, open **Settings -> Plugins**.
3. Top right, click **Add -> Upload plugin**.
4. Choose the `evolvepreneuriq-console.zip` file. It installs right away.

*Updates:* none automatically with this method — to move to a newer version, upload the new zip the same way.

### Method C — Claude Code (terminal)

For developers who prefer the command line:

```
/plugin marketplace add https://github.com/evolvesystems/evolvepreneuriq-plugins.git
/plugin install evolvepreneuriq-console@evolvepreneuriq
```

---

## Connect your EIQ data  (once, for any method)

The console is built from your **EIQ Manager** connector(s) — each connected business becomes a brand on the console.

1. In Claude, open **Settings -> Connectors**.
2. Add the **EIQ Manager** connector and authorise it. It signs in to your Evolvepreneur account (evolvepreneuriq.app) via OAuth — you approve it in a popup; there are no keys to paste.
3. Add one connector per business you want on the console.

---

## Use it

After installing and connecting, say **"set up my console"** in a chat. It confirms your businesses, sets up any automations you choose, and builds the console. Reopen it any time from your **Artifacts**, or say **"rebuild my console"** to refresh it from live EIQ data.

### Quick commands

Once the plugin is installed, these slash commands are shortcuts for the phrases above — type `/` in a chat to see them:

| Command | Same as saying | What it does |
|---|---|---|
| `/rebuild` | "rebuild my console" | Re-applies the newest template and your settings; keeps existing Dashboard data as-is. |
| `/refresh` | "refresh my dashboard from EIQ" | Pulls fresh numbers from every connected EIQ tenant and rebuilds the Dashboard. |
| `/push-plugin` | "push the plugin to github" | Maintainer only — bumps the version and pushes changed plugin files to this repo. |

---

## Update, refresh & reconnect

### Updating — step by step

When a new version is published, your console shows an amber **"Update ready"** bar (bottom-right) and an **"↑ Update available"** link in the footer — click either for the notes. To apply it:

1. **Update the plugin.** **Settings -> Plugins**, open the **evolvepreneuriq-plugins** marketplace, make sure **Sync automatically** is on, and click **Check for updates**.
2. **Restart Claude.** Fully quit and reopen — this is the step people skip, and it's the usual reason an update "doesn't take."
3. In a chat, say **"rebuild my console."**
4. Then say **"refresh my dashboard from EIQ."**
5. Open the console from **Artifacts** — the update is applied and the Dashboard shows your numbers.

*Prerequisite for the data:* the **EIQ Manager** connector must be attached for the businesses you want on the console (see *Connect your EIQ data*). Without it the console still builds, but the Dashboard and Connector tabs have nothing to read.

### If an update is slow to appear

A version bump should sync on its own. If the plugin still shows an old version or "Last updated" date:

1. Fully **quit and reopen Claude** — a cold start forces a fresh fetch from GitHub. This clears most cases.
2. If it still hasn't updated, the marketplace fetch is cached on Claude's side. Install the new version manually to bypass the cache: **Settings -> Plugins**, open **Evolvepreneuriq console**, **⋮ -> Uninstall**, then **Add -> Upload plugin** and choose the new `evolvepreneuriq-console.zip`.

### Refresh the console & skills

Say **"rebuild my console"** in a chat. It regenerates the dashboard from your live EIQ data and the current skills — do this after you connect a new business, update the plugin, or change your EIQ setup. The console artifact updates in place in your **Artifacts**.

### Add another business

1. **Settings -> Connectors -> Add**, add another **EIQ Manager** connector and authorise it (one per business).
2. Say **"rebuild my console"** — the new business appears in the header switcher and in every command's Business field.

### Reconnect a connector

If a connector shows disconnected, or the EIQ Connector / Personas / data tabs stop returning anything:

1. **Settings -> Connectors**, find **EIQ Manager**.
2. **Reconnect / re-authorise** it — sign in again through the popup (evolvepreneuriq.app). No keys to paste.
3. Say **"rebuild my console"** to refresh from the reconnected data.

### Troubleshooting

**"Rebuild my console" fetches an old template, or images/CDN content won't load.**
The generator pulls the newest template from `cdn.jsdelivr.net`. On a **Team or Enterprise** plan, an admin may need to allow that domain: **Admin settings -> Capabilities -> Network access**, add `cdn.jsdelivr.net` (and `raw.githubusercontent.com`, used for the version-check feed) to the allowlist. Without it, the fetch silently fails and the generator falls back to whatever template shipped with the installed plugin — which only updates after a sync **and** a restart, so a rebuild can look like it "didn't work."

**A new slash command (e.g. `/refresh`) says "Unknown skill" even after Settings -> Plugins -> Sync.**
A sync alone pulls new files into an already-installed plugin but doesn't always rebuild its command index. Uninstall the plugin, fully quit and reopen Claude, then reinstall it fresh from the marketplace — that forces the command list to rebuild.

**The Dashboard tab says "not built yet" even right after "refresh my dashboard from EIQ."**
Fixed in v0.4.8. Persisted Cowork artifacts run under a Content-Security-Policy that blocks `eval()`; the dashboard engine used to read its injected data with `eval`, so the lookup silently failed there even though the data was present — the tab looked empty in the artifact while working fine in a plain downloaded copy. The engine now reads its data directly off `window` instead. If you're still on an older version, update the plugin (see above) and rebuild.

---

## What's in this repo

- `plugins/evolvepreneuriq-console/` — the plugin: a console-generator skill, a first-run console-setup skill, and the console template.
- `.claude-plugin/marketplace.json` — the marketplace catalog.
- `SECURITY.md` — secret-hygiene notes (this repo contains no credentials).
