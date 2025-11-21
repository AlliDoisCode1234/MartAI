# Script to systematically replace 'as any' with type-safe helpers
param(
    [string]$FilePath = ""
)

$replacements = @{
    'projectId as any' = 'requireProjectId(projectId)'
    'briefId as any' = 'requireBriefId(briefId)'
    'draftId as any' = 'requireDraftId(draftId)'
    'clusterId as any' = 'requireClusterId(clusterId)'
    'planId as any' = 'requirePlanId(planId)'
    'userId as any' = 'requireUserId(userId)'
    'clientId as any' = 'requireClientId(clientId)'
    'insightId as any' = 'requireInsightId(insightId)'
    'competitorId as any' = 'requireCompetitorId(competitorId)'
    'versionId as any' = 'requireBriefVersionId(versionId)'
    'postId as any' = 'requireScheduledPostId(postId)'
}

if ($FilePath) {
    $files = @($FilePath)
} else {
    $files = Get-ChildItem -Path "app/api" -Recurse -Filter "*.ts" | Where-Object { $_.FullName -notmatch "node_modules" }
}

$totalReplacements = 0
foreach ($file in $files) {
    $path = if ($file -is [System.IO.FileInfo]) { $file.FullName } else { $file }
    if (-not (Test-Path $path)) { continue }
    
    $content = Get-Content $path -Raw
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        if ($content -match $pattern) {
            $content = $content -replace [regex]::Escape($pattern), $replacement
            $count = ([regex]::Matches($originalContent, [regex]::Escape($pattern))).Count
            $fileReplacements += $count
        }
    }
    
    if ($fileReplacements -gt 0) {
        # Add import if needed
        if ($content -match 'requireProjectId|requireBriefId|requireDraftId' -and $content -notmatch "from '@/lib/types'") {
            $content = $content -replace "(import.*from '@/lib/convexClient';)", "`$1`nimport { requireProjectId, requireBriefId, requireDraftId, requireClusterId, requirePlanId, requireUserId, requireClientId, requireInsightId, requireCompetitorId, requireBriefVersionId, requireScheduledPostId } from '@/lib/types';"
        }
        
        Write-Host "Updated $path : $fileReplacements replacements" -ForegroundColor Green
        $totalReplacements += $fileReplacements
    }
}

Write-Host "`nTotal replacements: $totalReplacements" -ForegroundColor Cyan

