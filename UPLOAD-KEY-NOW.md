# UPLOAD PUBLIC KEY NOW - 3 Steps

## Step 1: Get Access Token
1. Open: https://developers.facebook.com/tools/explorer/
2. Select: **Voom Digital** app
3. Click "Get User Access Token"
4. Check permissions: `whatsapp_business_management`
5. Click "Generate Access Token"
6. **COPY THE TOKEN**

## Step 2: Run Upload Command

Open PowerShell in changan-sav folder and run:

```powershell
$token = "PASTE_TOKEN_HERE"
$publicKey = Get-Content "..\public.pem" -Raw
$body = @{ business_public_key = $publicKey } | ConvertTo-Json
Invoke-RestMethod -Uri "https://graph.facebook.com/v21.0/1415511567255794/whatsapp_business_encryption" -Method POST -Headers @{Authorization="Bearer $token"} -ContentType "application/json" -Body $body
```

## Step 3: Verify
If you see `{"success":true}` - DONE! Key is uploaded and signed.

---

## Alternative: Use This Script

Replace YOUR_TOKEN_HERE with the token from step 1, then run:
