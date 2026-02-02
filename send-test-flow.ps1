# Send test Flow message to verify data storage
$PHONE_NUMBER_ID = "634000359806432"
$FLOW_ID = "1595070248222614"
$ACCESS_TOKEN = "EAAUFgRUbRc0BQip6ZCLZAVBcRpZBlo5di2JBpRWeDyC6BhidZC3fe5I9TcjKbh2ku0SvV5NdxCAio8HC4QRm7ZBLqj4nh15I9WvOZCvSAYV2B1ZB9ZAZBzF6BaV9IBDFwnv6AzNAdHzKOblFwBrDfDO1pkg7XzSfvpOKY9SFZCy5ZALckHDFecFA04cFvFSKmGYMAZDZD"
$TEST_PHONE = "+212610059159"  # Change to your test WhatsApp number

Write-Host "Sending Flow test message..." -ForegroundColor Cyan
Write-Host "Phone: $TEST_PHONE" -ForegroundColor Gray
Write-Host "Flow ID: $FLOW_ID" -ForegroundColor Gray

$body = @{
    messaging_product = "whatsapp"
    to = $TEST_PHONE
    type = "interactive"
    interactive = @{
        type = "flow"
        header = @{
            type = "text"
            text = "Enquête SAV Changan"
        }
        body = @{
            text = "Merci pour votre visite! Nous aimerions connaître votre avis sur votre expérience."
        }
        footer = @{
            text = "Cela prend moins de 2 minutes"
        }
        action = @{
            name = "flow"
            parameters = @{
                flow_message_version = "3"
                flow_token = "test-" + (Get-Date -Format "yyyyMMdd-HHmmss")
                flow_id = $FLOW_ID
                flow_cta = "Commencer l'enquête"
                flow_action = "navigate"
                flow_action_payload = @{
                    screen = "QUESTION_ONE"
                }
            }
        }
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod `
        -Uri "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/messages" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $ACCESS_TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body $body
    
    Write-Host "`n✅ Flow message sent!" -ForegroundColor Green
    Write-Host "Message ID: $($response.messages[0].id)" -ForegroundColor White
    Write-Host "`nNow:" -ForegroundColor Yellow
    Write-Host "1. Open WhatsApp on $TEST_PHONE" -ForegroundColor White
    Write-Host "2. Complete the survey" -ForegroundColor White
    Write-Host "3. Watch logs with: vercel logs https://y-gamma-six-62.vercel.app --follow" -ForegroundColor White
} catch {
    Write-Host "`n❌ Failed to send message" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Yellow
    }
    Write-Host "`nRequest body:" -ForegroundColor Gray
    Write-Host $body -ForegroundColor Gray
}
