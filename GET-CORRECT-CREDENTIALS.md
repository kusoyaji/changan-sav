# How to Get Correct WhatsApp Credentials for Changan SAV

## Problem
Error 100 subcode 33 means: **The access token cannot access phone number ID 930151243516923**

This happens when:
- The phone number belongs to a different WhatsApp Business Account
- The access token is from a different Meta App
- Missing permissions

## Solution: Get Correct Credentials from Meta Business Suite

### Step 1: Go to Meta Business Suite
1. Open: https://business.facebook.com/
2. Select **Changan** business account (not La Residence/Voom Digital)

### Step 2: Find WhatsApp Phone Number ID
1. Go to **WhatsApp Manager**: https://business.facebook.com/wa/manage/
2. Click on your Changan phone number
3. Look for **Phone Number ID** in settings
4. Copy this ID (it should be the one that belongs to Changan)

### Step 3: Get Access Token
1. Go to **Meta App Settings**: https://developers.facebook.com/apps/
2. Select the Meta App connected to **Changan** (NOT the Voom Digital app)
3. Go to **WhatsApp > API Setup**
4. Find **Temporary Access Token** or **Permanent Access Token**
5. Copy this token

### Step 4: Verify Flow ID
1. In WhatsApp Manager, go to **Flows**
2. Find your **Changan SAV** flow
3. Copy the **Flow ID** (should be 1595070248222614)

### Step 5: Update upload-public-key.js
Replace these values:
```javascript
const PHONE_NUMBER_ID = 'YOUR_CHANGAN_PHONE_NUMBER_ID';
const ACCESS_TOKEN = 'YOUR_CHANGAN_ACCESS_TOKEN';
```

## Alternative: Manual Upload via WhatsApp Manager

If you can't get API access, upload manually:

1. Go to WhatsApp Manager > Flows
2. Click on **Changan SAV** flow (1595070248222614)
3. Click **Edit Flow**
4. Go to **Endpoint** settings
5. Click **Upload Public Key**
6. Paste this public key:

\`\`\`
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2d7EqiSkN0WT3vhMxWk+
o5fy7KpImtgXbjpKWetCJce0qIH6b/n2mDLxxBidSC5OgCO6d848a/QUwkcYytbA
hO7VEX94cqSG20i3iu/1GDkfiLFpf4ScuP2yJk7PrxyHQYiXo8jtAKwcGkYYCNou
qsmM4LPVpO2jGwc7LkTz5Q62hC1mlsbr6u5an1Eozj7iYdrNxcMjSnZkQpRqM7rm
5twe0lIieVSWiEA+Q7Kj2GHnp1UqnVtIr5cxC0guh+LnAvsfNwyUCOO3Mhs7A62G
kydTu91+RI5+NCUxqKM0EbjivfL7rO6TqAWt7p7gLbmyEnOVD1r1l1pNDTH4bLro
DQIDAQAB
-----END PUBLIC KEY-----
\`\`\`

7. Set **Endpoint URL**: `https://y-gamma-six-62.vercel.app`
8. Save

Then add the private key to Vercel:
```powershell
vercel env add CHANGAN_PRIVATE_KEY production
```

Paste the private key from `c:\Users\meehd\OneDrive\Bureau\WhatsappFlow_CHangan\private.pem`

## Quick Check: Which Account Owns This Phone Number?

Run this command to check which phone numbers your current token can access:

```bash
curl -X GET "https://graph.facebook.com/v21.0/me/phone_numbers?access_token=YOUR_ACCESS_TOKEN"
```

This will show you all phone numbers this token has access to.
