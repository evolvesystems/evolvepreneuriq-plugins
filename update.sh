#!/usr/bin/env bash
# Bump the console plugin's patch version, commit, and push.
# Usage:  ./update.sh "what changed"
set -e
msg="${1:-update}"
pj="plugins/evolvepreneuriq-console/.claude-plugin/plugin.json"
cur=$(grep -oE '"version":[[:space:]]*"[0-9]+\.[0-9]+\.[0-9]+"' "$pj" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
IFS='.' read -r a b p <<< "$cur"; new="$a.$b.$((p+1))"
sed -i.bak -E "s/(\"version\":[[:space:]]*\")[0-9]+\.[0-9]+\.[0-9]+(\")/\1$new\2/" "$pj" && rm -f "$pj.bak"
git add -A
git commit -m "$new - $msg"
git push
echo "Pushed version $new"
