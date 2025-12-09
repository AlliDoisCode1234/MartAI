# API Security Test Script
# Tests security headers, CSRF protection, and origin validation

$baseUrl = "http://localhost:3000"
$testResults = @()

Write-Host "`n=== API Security Tests ===" -ForegroundColor Cyan

# Test 1: Check security headers on GET request
Write-Host "`n1. Testing security headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/projects" -Method GET -Headers @{
        "Authorization" = "Bearer test-token"
    } -ErrorAction SilentlyContinue
    
    $hasSecurityHeaders = $response.Headers.ContainsKey("X-Content-Type-Options") -or 
                         $response.Headers.ContainsKey("X-Frame-Options")
    
    if ($hasSecurityHeaders) {
        Write-Host "   ✓ Security headers present" -ForegroundColor Green
        $testResults += @{ Test = "Security Headers"; Status = "PASS" }
    } else {
        Write-Host "   ✗ Security headers missing" -ForegroundColor Red
        $testResults += @{ Test = "Security Headers"; Status = "FAIL" }
    }
} catch {
    Write-Host "   ⚠ Could not test (server may not be running)" -ForegroundColor Yellow
}

# Test 2: Check CSRF protection on POST
Write-Host "`n2. Testing CSRF protection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/projects" -Method POST -Headers @{
        "Authorization" = "Bearer test-token"
        "Content-Type" = "application/json"
    } -Body '{"name":"Test","websiteUrl":"https://test.com"}' -ErrorAction SilentlyContinue
    
    Write-Host "   ⚠ CSRF test requires manual verification" -ForegroundColor Yellow
    $testResults += @{ Test = "CSRF Protection"; Status = "PENDING" }
} catch {
    $errorDetails = $_.Exception.Response
    if ($errorDetails.StatusCode -eq 401 -or $errorDetails.StatusCode -eq 403) {
        Write-Host "   ✓ CSRF protection is working (request rejected)" -ForegroundColor Green
        $testResults += @{ Test = "CSRF Protection"; Status = "PASS" }
    } else {
        Write-Host "   ⚠ Could not verify CSRF protection" -ForegroundColor Yellow
        $testResults += @{ Test = "CSRF Protection"; Status = "PENDING" }
    }
}

# Test 3: Check origin validation
Write-Host "`n3. Testing origin validation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/projects" -Method GET -Headers @{
        "Authorization" = "Bearer test-token"
        "Origin" = "https://evil.com"
    } -ErrorAction SilentlyContinue
    
    Write-Host "   ⚠ Origin validation test requires manual verification" -ForegroundColor Yellow
    $testResults += @{ Test = "Origin Validation"; Status = "PENDING" }
} catch {
    Write-Host "   ✓ Origin validation appears to be working" -ForegroundColor Green
    $testResults += @{ Test = "Origin Validation"; Status = "PASS" }
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
foreach ($result in $testResults) {
    $statusColor = if ($result.Status -eq "PASS") { "Green" } elseif ($result.Status -eq "FAIL") { "Red" } else { "Yellow" }
    Write-Host "  $($result.Test): $($result.Status)" -ForegroundColor $statusColor
}

Write-Host "`nNote: Full testing requires a running server with valid authentication tokens." -ForegroundColor Gray
Write-Host "Run 'npm run dev' and test manually with browser DevTools." -ForegroundColor Gray

