# Upload public key to WhatsApp Business Account using WABA ID
# Using system user permanent token

$WABA_ID = "1415511567255794"
$PUBLIC_KEY_PATH = "..\public.pem"
$ACCESS_TOKEN = "EAFgpN5lxPgUBQgEbMplWOgKwzOmU6zQGfGVRRL01JIqXqsUyWqC9y52Nmsa18vxOxtvXzMsZBOZAEWyGw7XMmjkfiDcyqsW6ZAqS2yvgQitgsohCFsZBkjo69CZCZCKzHd61CKNulrP6AJYOdqsVandJtUN9tEWiCg0TZCQHbJapwUcXLjiqqNjTGpi2UotBZAGpgwZDZD"

# Read public key content
$publicKey = Get-Content $PUBLIC_KEY_PATH -Raw

Write-Host "Uploading public key to WABA ID: $WABA_ID" -ForegroundColor Cyan

# Upload and sign public key to WABA
try {
    $response = Invoke-RestMethod `
        -Uri "https://graph.facebook.com/v21.0/$WABA_ID/whatsapp_business_encryption" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $ACCESS_TOKEN"
            "Content-Type" = "application/x-www-form-urlencoded"
        } `
        -Body @{
            "business_public_key" = $publicKey
        }

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
