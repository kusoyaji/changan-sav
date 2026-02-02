# Step 2: Verify the code you received
$PHONE_NUMBER_ID = "634000359806432"
$ACCESS_TOKEN = "EAAUFgRUbRc0BQip6ZCLZAVBcRpZBlo5di2JBpRWeDyC6BhidZC3fe5I9TcjKbh2ku0SvV5NdxCAio8HC4QRm7ZBLqj4nh15I9WvOZCvSAYV2B1ZB9ZAZBzF6BaV9IBDFwnv6AzNAdHzKOblFwBrDfDO1pkg7XzSfvpOKY9SFZCy5ZALckHDFecFA04cFvFSKmGYMAZDZD"

Write-Host "Enter the 6-digit code you received:" -ForegroundColor Yellow
$code = Read-Host "Code"

try {
    $response = Invoke-RestMethod `
        -Uri "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/verify_code" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $ACCESS_TOKEN"
            "Content-Type" = "application/x-www-form-urlencoded"
        } `
        -Body @{
            "code" = $code
        }
    
    Write-Host "`n✅ Phone number verified!" -ForegroundColor Green
    Write-Host "Now run 3-upload-public-key.ps1 to upload encryption key" -ForegroundColor Cyan
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "`n❌ Verification failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "API Response: $errorBody" -ForegroundColor Yellow
    }
}
