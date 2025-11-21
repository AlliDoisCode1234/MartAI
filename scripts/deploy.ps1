# MartAI Deployment Script
# Usage: .\scripts\deploy.ps1 "Commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "MartAI Deployment Script" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "Error: Not a git repository" -ForegroundColor Red
    exit 1
}

# Build the project first
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "Checking git status..." -ForegroundColor Yellow
$status = git status --short

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to commit." -ForegroundColor Blue
    exit 0
}

Write-Host "Changes to commit:" -ForegroundColor Cyan
Write-Host $status
Write-Host ""

# Add all changes
Write-Host "Staging changes..." -ForegroundColor Yellow
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to stage changes" -ForegroundColor Red
    exit 1
}

# Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $CommitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to commit changes" -ForegroundColor Red
    exit 1
}

Write-Host "Committed: $CommitMessage" -ForegroundColor Green
Write-Host ""

# Push to main
Write-Host "Pushing to main..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push to remote" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Successfully deployed to main!" -ForegroundColor Green
Write-Host ""

# Show latest commit
$latestCommit = git log -1 --oneline
Write-Host "Latest commit: $latestCommit" -ForegroundColor Cyan

