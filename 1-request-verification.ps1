# Step 1: Request verification code for phone number
$PHONE_NUMBER_ID = "634000359806432"
$ACCESS_TOKEN = "EAAUFgRUbRc0BQip6ZCLZAVBcRpZBlo5di2JBpRWeDyC6BhidZC3fe5I9TcjKbh2ku0SvV5NdxCAio8HC4QRm7ZBLqj4nh15I9WvOZCvSAYV2B1ZB9ZAZBzF6BaV9IBDFwnv6AzNAdHzKOblFwBrDfDO1pkg7XzSfvpOKY9SFZCy5ZALckHDFecFA04cFvFSKmGYMAZDZD"

Write-Host "Requesting verification code for phone: $PHONE_NUMBER_ID" -ForegroundColor Cyan
Write-Host "Choose method: SMS or VOICE" -ForegroundColor Yellow
$method = Read-Host "Enter method (sms/voice)"

try {
    $response = Invoke-RestMethod `
        -Uri "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/request_code" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $ACCESS_TOKEN"
            "Content-Type" = "application/x-www-form-urlencoded"
        } `
        -Body @{
            "code_method" = $method.ToUpper()
        }
    
    Write-Host "`n✅ Verification code requested!" -ForegroundColor Green
    Write-Host "Check your phone for the code, then run 2-verify-code.ps1" -ForegroundColor Cyan
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "`n❌ Failed to request code" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "API Response: $errorBody" -ForegroundColor Yellow
    }
}
