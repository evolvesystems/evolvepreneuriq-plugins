# Evolvepreneur iQ — plugin marketplace

The marketplace for the **Evolvepreneur iQ Console** — a branded, connector-driven launcher for your businesses (Workflows, Cowork Skills, EIQ Connector tools, and the EIQ persona library), plus first-run setup that provisions your standing automations.

## 1. Connect your EIQ data first

The console is built from your **EIQ Manager** connector(s) — each connected business becomes a brand on the console. Attach the connector in Claude before using it:

- Open **Claude -> Settings -> Connectors** (under **Customize**).
- Add the **EIQ Manager** connector and authorise it. It signs in to your Evolvepreneur account (evolvepreneuriq.app) via OAuth — you approve it in the popup; there are no keys to paste.
- Add one connector per business you want on the console (Evolvepreneur, Evolve Systems, Get My Book, and so on).

Without a connector attached the console still opens, but the EIQ Connector and Personas tabs and the data actions have nothing to read.

## 2. Install the plugin

**On Claude desktop / claude.ai — no terminal:**

1. Open **Settings -> Customize -> Plugins**.
2. Top right, click **Add -> Add marketplace -> Add from a repository**.
3. In the URL box, type **evolvesystems/evolvepreneuriq-plugins** and pick it from the list (a GitHub `owner/repo` or a full git URL both work). Leave **Sync automatically** on and click **Sync**.
4. In the directory that opens, on the **Personal** tab, click the **+** on the **Evolvepreneuriq console** card to install it.
5. If a banner asks to grant the Claude GitHub App access to the repo, click **Grant access** and approve — that's what keeps it auto-updating.

**In Claude Code — terminal:**

```
/plugin marketplace add https://github.com/evolvesystems/evolvepreneuriq-plugins.git
/plugin install evolvepreneuriq-console@evolvepreneuriq
```

## 3. Build your console

Say **"set up my console"** — that confirms your businesses, sets up your automations, and builds the console. Reopen it any time from your artifact gallery, or say **"rebuild my console"** to refresh it from live EIQ data.

## Updating

With **Sync automatically** on, new versions flow through when the repo's version is bumped — no reinstall. You can also refresh manually from the Plugins page.

## What's inside

- `plugins/evolvepreneuriq-console/` — the plugin: a console-generator skill and a first-run console-setup skill
- `.claude-plugin/marketplace.json` — the marketplace catalog
