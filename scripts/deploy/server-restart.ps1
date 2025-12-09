param(
  [switch]$NoLaunch
)

$repoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "`n=== Server Restart Utility ===" -ForegroundColor Cyan

Write-Host "`nStopping existing Node.js processes..." -ForegroundColor Yellow
try {
  Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
  Write-Host "All Node.js processes stopped." -ForegroundColor Green
} catch {
  Write-Warning "Failed to stop some processes: $_"
}

if ($NoLaunch) {
  Write-Host "`nNoLaunch flag specified. Servers were stopped but not restarted." -ForegroundColor Yellow
  exit 0
}

Write-Host "`nStarting Convex dev server..." -ForegroundColor Cyan
$convexProcess = Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$repoRoot`"; Write-Host 'Convex Dev Server' -ForegroundColor Cyan; npx convex dev"
) -WindowStyle Minimized -PassThru
Write-Host "Convex dev server starting (PID: $($convexProcess.Id))." -ForegroundColor Green

Start-Sleep -Seconds 2

Write-Host "`nStarting Next.js dev server..." -ForegroundColor Cyan
$nextProcess = Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$repoRoot`"; Write-Host 'Next.js Dev Server' -ForegroundColor Cyan; npm run dev"
) -WindowStyle Minimized -PassThru
Write-Host "Next.js dev server starting (PID: $($nextProcess.Id))." -ForegroundColor Green

Write-Host "`nServers are launching in minimized PowerShell windows. Use Ctrl+C inside those windows to stop them." -ForegroundColor Yellow

