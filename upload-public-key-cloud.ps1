# Upload public key to WhatsApp Business Account using Cloud API
# This requires a token with Business Manager admin permissions

$PHONE_NUMBER_ID = "634000359806432"
$PUBLIC_KEY_PATH = "..\public.pem"
$ACCESS_TOKEN = "EAAUFgRUbRc0BQip6ZCLZAVBcRpZBlo5di2JBpRWeDyC6BhidZC3fe5I9TcjKbh2ku0SvV5NdxCAio8HC4QRm7ZBLqj4nh15I9WvOZCvSAYV2B1ZB9ZAZBzF6BaV9IBDFwnv6AzNAdHzKOblFwBrDfDO1pkg7XzSfvpOKY9SFZCy5ZALckHDFecFA04cFvFSKmGYMAZDZD"

# Read public key content
$publicKey = Get-Content $PUBLIC_KEY_PATH -Raw

Write-Host "Uploading public key to Phone Number ID: $PHONE_NUMBER_ID" -ForegroundColor Cyan
Write-Host "Public key length: $($publicKey.Length) characters" -ForegroundColor Gray

# URL encode the public key properly
Add-Type -AssemblyName System.Web
$encodedKey = [System.Web.HttpUtility]::UrlEncode($publicKey)

# Create form body manually
$body = "business_public_key=$encodedKey"

Write-Host "Sending request..." -ForegroundColor Gray

# Upload and sign public key
try {
    $response = Invoke-RestMethod `
        -Uri "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/whatsapp_business_encryption" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $ACCESS_TOKEN"
            "Content-Type" = "application/x-www-form-urlencoded"
        } `
        -Body $body

    Write-Host "`n✅ Public key uploaded and signed successfully!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor White
}
catch {
    Write-Host "`n❌ Failed to upload public key" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    
    # Try to get detailed error from response
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "API Response: $errorBody" -ForegroundColor Yellow
    }
}
