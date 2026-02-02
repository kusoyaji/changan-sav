$PHONE_NUMBER_ID = "634000359806432"
$ACCESS_TOKEN = "EAAUFgRUbRc0BQip6ZCLZAVBcRpZBlo5di2JBpRWeDyC6BhidZC3fe5I9TcjKbh2ku0SvV5NdxCAio8HC4QRm7ZBLqj4nh15I9WvOZCvSAYV2B1ZB9ZAZBzF6BaV9IBDFwnv6AzNAdHzKOblFwBrDfDO1pkg7XzSfvpOKY9SFZCy5ZALckHDFecFA04cFvFSKmGYMAZDZD"
$publicKey = Get-Content "..\public.pem" -Raw
Add-Type -AssemblyName System.Web
$encodedKey = [System.Web.HttpUtility]::UrlEncode($publicKey)
$body = "business_public_key=$encodedKey"
Invoke-RestMethod -Uri "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/whatsapp_business_encryption" -Method POST -Headers @{"Authorization"="Bearer $ACCESS_TOKEN";"Content-Type"="application/x-www-form-urlencoded"} -Body $body
