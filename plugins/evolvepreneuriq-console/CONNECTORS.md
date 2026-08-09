# Connectors

This plugin is connector-driven: the console is built from whatever **EIQ Manager** connectors are attached to the account. Each connector is one business.

## Required

| Connector | Business | Notes |
| --- | --- | --- |
| EIQ Manager (evolvepreneuriq.app) | one per tenant | The console reads each connected tenant's module map (`eiq_about`) and skill library (`eiq_skill_library`) at generation time, and drives the EIQ Connector and Personas tabs from them. |

The plugin does not embed connector credentials. The EIQ connectors are authorised at the account level (OAuth), and every call is automatically scoped to that tenant. Attach a business's EIQ connector to have it appear on the console; remove it and it drops off. No other connectors are required.

## Optional

- **Claude in Chrome** — used by some Workflow/Skills actions that drive the EP dashboard (blog poster, proposal builder, page designer, LinkedSavvy). Not required to build or open the console.
