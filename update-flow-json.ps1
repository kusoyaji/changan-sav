# Update Flow JSON to published Flow
$FLOW_ID = "1595070248222614"
$ACCESS_TOKEN = "EAAUFgRUbRc0BQip6ZCLZAVBcRpZBlo5di2JBpRWeDyC6BhidZC3fe5I9TcjKbh2ku0SvV5NdxCAio8HC4QRm7ZBLqj4nh15I9WvOZCvSAYV2B1ZB9ZAZBzF6BaV9IBDFwnv6AzNAdHzKOblFwBrDfDO1pkg7XzSfvpOKY9SFZCy5ZALckHDFecFA04cFvFSKmGYMAZDZD"

Write-Host "Updating Flow JSON..." -ForegroundColor Cyan

# Read the Flow JSON
$flowJson = Get-Content ".\whatsapp-sav-flow.json" -Raw

# Upload to WhatsApp
$body = @{
    "file_contents" = $flowJson
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "https://graph.facebook.com/v21.0/$FLOW_ID/assets" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $ACCESS_TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body $body
    
    Write-Host "✅ Flow JSON updated!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json) -ForegroundColor White
    Write-Host "`nNow publish the Flow in WhatsApp Manager to make it live" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd() -ForegroundColor Yellow
    }
}
