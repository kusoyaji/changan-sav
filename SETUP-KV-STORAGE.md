# Setup Upstash Redis (Vercel KV)

## Create Upstash Redis Database

1. Go to https://upstash.com/
2. Sign up or login (can use GitHub account)
3. Click "Create Database"
4. Choose settings:
   - Name: `changan-survey`
   - Type: `Regional` (cheaper)
   - Region: Choose closest to your users (Europe recommended)
   - TLS: Enabled
5. Click "Create"

## Get Connection Details

After creating, you'll see:
- **UPSTASH_REDIS_REST_URL**: `https://xxx.upstash.io`
- **UPSTASH_REDIS_REST_TOKEN**: `AXXXxxx...`

Copy both values.

## Add to Vercel Environment Variables

### Option 1: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project (`y` / `y-gamma-six-62.vercel.app`)
3. Go to **Settings** → **Environment Variables**
4. Add TWO variables:

```
Name: KV_REST_API_URL
Value: https://your-redis-url.upstash.io
```

```
Name: KV_REST_API_TOKEN
Value: AXXXxxxxxxxxxxxxxxxxxx
```

5. Check all environments: ✅ Production ✅ Preview ✅ Development
6. Click **Save**

### Option 2: Using Vercel CLI

```powershell
# Set production environment variables
vercel env add KV_REST_API_URL
# Paste your UPSTASH_REDIS_REST_URL, press Enter
# Select: Production, Preview, Development (all)

vercel env add KV_REST_API_TOKEN
# Paste your UPSTASH_REDIS_REST_TOKEN, press Enter
# Select: Production, Preview, Development (all)
```

## Redeploy

After adding environment variables:

```powershell
vercel --prod
```

## Verify

1. Send a test survey via WhatsApp
2. Check https://y-gamma-six-62.vercel.app/
3. Data should now persist!
4. Click "📊 Exporter Excel" to download CSV

## Test Export

The export creates a CSV file with:
- UTF-8 BOM for Excel compatibility
- French headers
- All responses with timestamps
- Can be opened directly in Excel

## Troubleshooting

**Data not persisting?**
- Check Vercel logs: `vercel logs --prod`
- Look for "✅ Stored in KV" messages
- If you see "⚠️ KV not configured", env vars are missing

**Export shows no data?**
- Verify KV_REST_API_URL and KV_REST_API_TOKEN are set
- Redeploy after adding environment variables
- Submit a new survey to test

**Excel encoding issues?**
- File includes UTF-8 BOM for Excel
- If characters look wrong, open in Excel (not Notepad)
- Or use "Import Data" → "From Text/CSV" in Excel

## Cost

Upstash Free Tier:
- ✅ 10,000 commands/day
- ✅ 256 MB storage
- ✅ More than enough for surveys

Your usage:
- ~3 commands per survey submission
- Can handle 3,000+ surveys/day on free tier
