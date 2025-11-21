# PowerShell script to systematically replace 'as any' with proper type helpers
# This helps maintain type safety across the codebase

$files = Get-ChildItem -Path "app/api" -Recurse -Filter "*.ts" | Where-Object { $_.FullName -notmatch "node_modules" }

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

Write-Host "Found $($files.Count) API route files to review" -ForegroundColor Cyan

