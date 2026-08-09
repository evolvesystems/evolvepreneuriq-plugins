# Evolvepreneur iQ — plugin marketplace

The marketplace for the **Evolvepreneur iQ Console** — a branded, connector-driven launcher for your businesses (Workflows, Cowork Skills, EIQ Connector tools, and the EIQ persona library), plus first-run setup that provisions your standing automations.

## 1. Connect your EIQ data first

The console is built from your **EIQ Manager** connector(s) — each connected business becomes a brand on the console. Attach the connector in Claude before installing:

- Open **Claude -> Settings -> Connectors**.
- Add the **EIQ Manager** connector and authorise it. It signs in to your Evolvepreneur account (evolvepreneuriq.app) via OAuth — you approve it in the popup; there are no keys to paste.
- Add one connector per business you want on the console (Evolvepreneur, Evolve Systems, Get My Book, and so on).

Without a connector attached the console still opens, but the EIQ Connector and Personas tabs and the data actions have nothing to read.

## 2. Install the plugin

In an interactive Claude Code session, run:

```
/plugin marketplace add https://github.com/evolvesystems/evolvepreneuriq-plugins.git
/plugin install evolvepreneuriq-console@evolvepreneuriq
```

## 3. Build your console

Say **"set up my console"** — that confirms your businesses, sets up your automations, and builds the console. Reopen it any time from your artifact gallery, or say **"rebuild my console"** to refresh it from live EIQ data.

> Team or Enterprise plan: add this repo under **Organization Settings -> Capabilities -> Plugins -> GitHub sync** and set the plugin to *Installed by default* for the whole team.

## Updating

New versions sync on a version bump — refresh with `/plugin marketplace update`. No delete-and-reinstall.

## What's inside

- `plugins/evolvepreneuriq-console/` — the plugin: a console-generator skill and a first-run console-setup skill
- `.claude-plugin/marketplace.json` — the marketplace catalog
- `plugins/evolvepreneuriq-console/CONNECTORS.md` — connector details
