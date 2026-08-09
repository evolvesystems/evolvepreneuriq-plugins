---
name: console-setup
description: First-run setup for the Evolvepreneur iQ Console plugin. Use when the user installs the plugin, or says "set up my console", "configure the Evolvepreneur console", "run console setup", or "set up my automations". Asks which businesses are active and which standing automations to create (morning brief, weekly prospect dig, overdue-invoice sweep), provisions them as scheduled tasks, then builds the console.
---

# Console Setup

Run once when the plugin is installed. Configure the console to the user's businesses and provision their standing automations.

## Steps

1. **Confirm the connected businesses.** Check which EIQ connectors are attached (one per business). List them back and confirm which should appear on the console's brand filter. Use `AskUserQuestion` if any are ambiguous. Do not invent a business whose connector is not attached.

2. **Ask which automations to create.** Use `AskUserQuestion` (multi-select) to offer the standing tasks — each is opt-in:
   - **Morning brief** — a styled daily brief every weekday morning.
   - **Weekly prospect dig** — mine EIQ for re-engagement leads each week and surface a shortlist.
   - **Overdue-invoice sweep** — a weekly Overdue Invoice Chaser run that drafts (never sends) follow-ups.
   Confirm the times in the user's timezone before creating anything.

3. **Provision the scheduled tasks.** For each automation the user picked, create a scheduled task with the Claude Code Remote scheduled-task tool (`mcp__claude-code-remote__create_trigger`) — never the local cron tools, which do not survive the session. Write each task's prompt as a complete standalone instruction (a fresh session runs it), naming the business and the desired output. Report back the schedule you set for each.
   - Morning brief: a weekday-morning cron in the user's timezone (convert to UTC).
   - Weekly prospect dig: a weekly cron (e.g. Monday morning).
   - Overdue-invoice sweep: a weekly cron.

4. **Build the console.** Invoke the `console-generator` skill to generate the console from live EIQ data, deliver it with `SendUserFile`, and persist it as the `evolve-console` artifact.

5. **Confirm.** Tell the user, in plain language, which businesses are on the console, which automations are now running and when, and that they can reopen the console any time from their artifact gallery or by asking to rebuild it.

## Guardrails

- Only reads and drafts run unattended. Any automation that would send, publish, or spend must draft for review, not act.
- Confirm every schedule and business selection with the user before provisioning; do not assume defaults for the automations.
