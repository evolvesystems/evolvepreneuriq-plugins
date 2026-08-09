# Security & secret hygiene

This marketplace ships **no secrets**. The console plugin uses account-level EIQ
OAuth connectors — no API keys, tokens, or credentials are embedded, and none
should ever be added to these files.

## Keep it that way
- **Keep the repo private.** Org sync supports a private github.com repo under the
  same owner; there is no need to make it public.
- **Never commit credentials.** No `.env`, PATs, connector secrets, or `.mcp.json`
  with inline tokens. The `.gitignore` blocks the common ones — do not override it.
- **If you ever add an MCP server**, reference paths with `${CLAUDE_PLUGIN_ROOT}`
  and read credentials from environment variables — never inline them.
- **Ship structure, not data.** The console template contains capability metadata
  only. When it is regenerated it pulls each tenant's live persona/module lists at
  generation time; do not commit a console that has live customer data, revenue
  figures, contacts, or document bodies baked in.

## GitHub protections to turn on (repo → Settings)
- **Secret scanning + Push protection** (Code security) — blocks a secret from
  ever being pushed.
- **Branch protection on `main`** — require a pull request + review before merge.
- **Limit collaborators** to the people who need write access; everyone else
  installs from the marketplace, they don't need repo access.
- Optional: **CODEOWNERS** so plugin changes need your review; Dependabot alerts.

## Auto-update token (only if you use HTTPS background sync)
Use a **fine-grained personal access token or deploy token scoped to this one repo,
read-only (Contents: Read)**. Never commit it — configure it via a git URL rewrite
or credential helper. Prefer **SSH** remotes, which need no token in a file.

## If a secret is ever leaked
Rotate/revoke it immediately at the source (it is compromised the moment it lands
in git history), then purge it from history. Do not just delete the file in a new
commit — the old commit still holds it.
