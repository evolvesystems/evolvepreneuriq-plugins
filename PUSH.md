# Push this marketplace to GitHub (repo already created: evolvesystems/evolvepreneuriq-plugins)

Open a terminal IN this folder:
  File Explorer -> this folder -> Shift+Right-click -> "Open in Terminal" (or "Git Bash Here")

Then run:
```
git init
git add .
git commit -m "Evolvepreneur iQ marketplace v0.1.0"
git branch -M main
git remote add origin https://github.com/evolvesystems/evolvepreneuriq-plugins.git
git push -u origin main
```
The first push opens a GitHub sign-in window (that's your login, not shared with anyone). Done.

## No git installed?
Install "Git for Windows" (gitforwindows.org) or use GitHub Desktop:
  Add -> Add existing repository -> pick this folder -> Publish.

## Shipping an update later
Edit plugins/evolvepreneuriq-console/.claude-plugin/plugin.json (bump "version"),
then: git add . && git commit -m "vX.Y.Z" && git push
