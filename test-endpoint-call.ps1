# Test data submission directly to endpoint
$body = @'
{
  "encrypted_flow_data": "test_data_placeholder",
  "encrypted_aes_key": "test_key_placeholder",
  "initial_vector": "test_iv_placeholder"
}
'@

Write-Host "Testing if endpoint logs data when called..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "https://y-gamma-six-62.vercel.app/api/flow" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd() -ForegroundColor Yellow
    }
}

Write-Host "`nNow check Vercel logs to see if the request was logged" -ForegroundColor Cyan
