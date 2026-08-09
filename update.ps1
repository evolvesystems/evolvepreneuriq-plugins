# Bump the console plugin's patch version, commit, and push.
# Usage:  .\update.ps1 "what changed"
param([string]$msg = "update")
$pj = "plugins/evolvepreneuriq-console/.claude-plugin/plugin.json"
$c  = Get-Content $pj -Raw
if ($c -match '"version":\s*"(\d+)\.(\d+)\.(\d+)"') {
  $new = "$($Matches[1]).$($Matches[2]).$([int]$Matches[3] + 1)"
  $c = $c -replace '("version":\s*")\d+\.\d+\.\d+(")', "`${1}$new`${2}"
  Set-Content -NoNewline -Path $pj -Value $c
  git add -A
  git commit -m "$new - $msg"
  git push
  Write-Host "Pushed version $new"
} else {
  Write-Host "Could not find version in $pj"
}
