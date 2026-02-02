# Upload Public Key to WhatsApp - FAST METHOD
# 1. Get token from: https://developers.facebook.com/tools/explorer/
# 2. Replace YOUR_TOKEN_HERE below
# 3. Run this script

$accessToken = "YOUR_TOKEN_HERE"  # PASTE TOKEN HERE
$publicKey = Get-Content "..\public.pem" -Raw
$wabaId = "1415511567255794"

Write-Host "📤 Uploading public key to WABA $wabaId..." -ForegroundColor Cyan

$body = @{
    business_public_key = $publicKey
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "https://graph.facebook.com/v21.0/$wabaId/whatsapp_business_encryption" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $accessToken" } `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "✅ SUCCESS! Public key uploaded and signed!" -ForegroundColor Green
    Write-Host $result | ConvertTo-Json
} catch {
    Write-Host "❌ ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host "Response:" $_.ErrorDetails.Message
}
