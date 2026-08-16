---
description: Pull live numbers from every connected EIQ tenant and rebuild the Dashboard tab
---

Refresh my Evolvepreneur iQ dashboard from live EIQ data. For each connected EIQ tenant, pull only what its connector actually returns (revenue, customers, finance, pipeline, subscriptions, royalties, analytics) — don't invent figures for anything a module returns nothing for. Auto-detect whether a legacy EP v1 store database is attached and include that source only if it is. Stamp the fresh "Data as of" date, rebuild the console from the newest template, validate it, then deliver the HTML and update the `evolve-console` artifact in place.

Use the `evolvepreneuriq-console:console-generator` skill for this — follow "The Dashboard tab" section.
