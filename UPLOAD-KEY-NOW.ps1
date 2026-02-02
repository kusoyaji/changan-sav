# QUICK PUBLIC KEY UPLOAD - Run this NOW
# Step 1: Go to https://developers.facebook.com/tools/explorer/
# Step 2: Select app "Voom Digital"
# Step 3: Add permissions: whatsapp_business_management
# Step 4: Click "Generate Access Token" 
# Step 5: COPY THE TOKEN and paste below

Write-Host "🔑 CHANGAN PUBLIC KEY UPLOAD TOOL" -ForegroundColor Cyan
Write-Host ""

$publicKey = @"
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2d7EqiSkN0WT3vhMxWk+
o5fy7KpImtgXbjpKWetCJce0qIH6b/n2mDLxxBidSC5OgCO6d848a/QUwkcYytbA
hO7VEX94cqSG20i3iu/1GDkfiLFpf4ScuP2yJk7PrxyHQYiXo8jtAKwcGkYYCNou
qsmM4LPVpO2jGwc7LkTz5Q62hC1mlsbr6u5an1Eozj7iYdrNxcMjSnZkQpRqM7rm
5twe0lIieVSWiEA+Q7Kj2GHnp1UqnVtIr5cxC0guh+LnAvsfNwyUCOO3Mhs7A62G
kydTu91+RI5+NCUxqKM0EbjivfL7rO6TqAWt7p7gLbmyEnOVD1r1l1pNDTH4bLro
DQIDAQAB
-----END PUBLIC KEY-----
"@

$wabaId = "1415511567255794"

Write-Host "📋 Public Key Preview:" -ForegroundColor Yellow
Write-Host $publicKey.Substring(0, 100) + "..."
Write-Host ""
Write-Host "WABA ID: $wabaId" -ForegroundColor Green
Write-Host ""

# Ask for access token
$token = Read-Host "Paste your access token from Graph Explorer (or press Enter to use default)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "⚠️  Using default token (may not work)" -ForegroundColor Yellow
    $token = "EAANQ1WlW6ZBcBQT6YBI8kR4UtZAg9FFVYA2kAygZCC4U2fx4BJXHpZC3QG3fgqvOplUi2QvilWNQO6eC3AZBn0HmDtsVVYpZCE6fhCxTkc317a93GovOo1DgFWlTqaZB0KCs29VVFkUIyScZBLwruRw9KgBzJfpF8o0RypMaZCEr41h5Krs0wSZAYKHDKQiTnRCwZDZD"
}

Write-Host ""
Write-Host "📤 Uploading public key..." -ForegroundColor Cyan

$body = @{
    business_public_key = $publicKey
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://graph.facebook.com/v21.0/$wabaId/whatsapp_business_encryption" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        } `
        -Body $body
    
    Write-Host ""
    Write-Host "✅ SUCCESS! Public key uploaded and signed!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎉 Now refresh the Flow page - 'Sign public key' should be checked!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "🔧 TO FIX:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://developers.facebook.com/tools/explorer/" -ForegroundColor White
    Write-Host "2. Select 'Voom Digital' app" -ForegroundColor White
    Write-Host "3. Click 'Get User Access Token'" -ForegroundColor White
    Write-Host "4. Add permission: whatsapp_business_management" -ForegroundColor White
    Write-Host "5. Click 'Generate Access Token'" -ForegroundColor White
    Write-Host "6. Copy token and run this script again" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
