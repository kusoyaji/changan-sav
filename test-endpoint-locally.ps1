# Test the Flow endpoint locally to verify it works before WhatsApp health check

$ENDPOINT_URL = "https://y-gamma-six-62.vercel.app/api/flow"

Write-Host "Testing Flow Endpoint: $ENDPOINT_URL" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check (ping)
Write-Host "1. Testing Health Check (ping)..." -ForegroundColor Yellow
try {
    $pingPayload = '{"action":"ping","version":"3.0"}'
    
    $response = Invoke-WebRequest -Uri $ENDPOINT_URL -Method POST -ContentType "application/json" -Body $pingPayload -UseBasicParsing
    Write-Host "✅ Endpoint responded with status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "❌ Health check failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Response body: $errorBody" -ForegroundColor Gray
    }
}

Write-Host ""

# Test 2: Simple GET request
Write-Host "2. Testing GET request..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $ENDPOINT_URL -Method GET -UseBasicParsing
    Write-Host "✅ GET responded with status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "⚠️  GET request failed (expected if endpoint only accepts POST)" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test 3: Health endpoint
Write-Host "3. Testing health check endpoint at /api..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://y-gamma-six-62.vercel.app/api"
    Write-Host "✅ Health endpoint working!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "❌ Health endpoint failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Endpoint testing complete!" -ForegroundColor Cyan
