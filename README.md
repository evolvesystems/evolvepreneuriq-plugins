# Evolvepreneur iQ — private plugin marketplace

Private marketplace for Evolvepreneur iQ plugins.

## Add it (Claude Code / interactive)
```
/plugin marketplace add <your-private-git-url-or-path>
/plugin install evolvepreneuriq-console@evolvepreneuriq
```
Update later with `/plugin marketplace update`.

## Add it (Cowork desktop, org-wide)
Organization Settings → Capabilities → Plugins → add a custom marketplace:
- **GitHub sync** — point it at this repo; bump the plugin version and merge to the
  default branch and installs re-sync automatically, or
- **Manual upload** — upload the plugin ZIP (overwriting with the same name updates it).

Then set the console plugin to "Available for install", "Installed by default", or "Required".
