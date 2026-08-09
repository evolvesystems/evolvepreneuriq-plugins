# Evolvepreneur iQ — plugin marketplace

This repo hosts the **Evolvepreneur iQ Console** plugin — a branded, connector-driven launcher for your businesses. It's a single-page dashboard with four tabs (Workflows, your Cowork Skills, the live EIQ Connector tools, and your EIQ persona library), plus a first-run setup skill that can create standing automations (morning brief, weekly prospect dig, overdue-invoice sweep).

> A visual step-by-step guide with screenshots is provided separately (`install-guide.html`). This README is the written version.

---

## What you need

- **A Claude account.** Required for every method below.
- **The EIQ Manager connector** attached for each business you want on the console (see *Connect your EIQ data*). Without it the console still opens, but the EIQ Connector, Personas and data tabs have nothing to read.
- **A GitHub login is ONLY needed for Method B (the marketplace).** Method A (uploading the file) needs no GitHub at all.

---

## Install — pick ONE method

### Method A — Upload the plugin file  (simplest, no GitHub)

Best for non-technical users, or anyone who doesn't want to connect GitHub.

1. Get the plugin file from whoever shared it: **`evolvepreneuriq-console.zip`**.
2. In Claude, open **Settings -> Plugins**.
3. Top right, click **Add -> Upload plugin**.
4. Choose the `evolvepreneuriq-console.zip` file. It installs right away.

*Updates:* to move to a newer version, upload the new zip the same way. (No automatic updates with this method.)

### Method B — Add the marketplace from GitHub  (auto-updates, needs GitHub)

Best if you want the plugin to update itself when a new version is published.

1. In Claude, open **Settings -> Plugins**.
2. Top right, click **Add -> Add marketplace -> Add from a repository**.
3. **The first time, Claude asks you to connect / sign in to GitHub.** This is required for this method (even though the repo is public).
4. Type **evolvesystems/evolvepreneuriq-plugins** (or paste `https://github.com/evolvesystems/evolvepreneuriq-plugins`), select it, leave **Sync automatically** on, and click **Sync**.
5. In the directory that opens, on the **Personal** tab, click the **+** on the **Evolvepreneuriq console** card.

*Updates:* automatic — a version bump on GitHub syncs to you on its own.

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

---

## What's in this repo

- `plugins/evolvepreneuriq-console/` — the plugin: a console-generator skill, a first-run console-setup skill, and the console template.
- `.claude-plugin/marketplace.json` — the marketplace catalog.
- `SECURITY.md` — secret-hygiene notes (this repo contains no credentials).
