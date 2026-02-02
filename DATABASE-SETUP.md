# Database Setup Guide for Changan SAV

## Overview
This project uses **Upstash Redis** as a serverless database to store survey responses. It's separate from the main enseignement/prepa database.

---

## Why Upstash Redis?

✅ **Serverless** - No servers to manage  
✅ **Free tier** - 10,000 commands/day  
✅ **Fast** - Sub-millisecond latency  
✅ **Easy integration** - Works with Vercel  
✅ **Scalable** - Automatically scales with your needs

---

## Step-by-Step Setup

### 1. Create Upstash Account

1. Go to [https://console.upstash.com/](https://console.upstash.com/)
2. Sign up (free - no credit card required)
3. Verify your email

### 2. Create Redis Database

1. Click **"Create Database"**
2. Configure:
   - **Name**: `changan-sav-surveys`
   - **Type**: Regional
   - **Region**: Europe (Ireland) or closest to your users
   - **TLS**: Enabled (recommended)
3. Click **"Create"**

### 3. Get Database Credentials

After creation, you'll see:

```
Endpoint: xxxxx-xxxxx.upstash.io
Port: 6379
Password: AXXXXxxxxxxxxxxxxxxxxxxxx
```

You need the **REST API** credentials:

1. Click on your database
2. Scroll to **"REST API"** section
3. Copy:
   - **UPSTASH_REDIS_REST_URL**: `https://xxxxx-xxxxx.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: `AXXXXxxxxxxxxxxxxxxxxxxxx`

### 4. Add to Environment Variables

**Local Development** (`.env`):
```env
CHANGAN_KV_REST_API_URL=https://xxxxx-xxxxx.upstash.io
CHANGAN_KV_REST_API_TOKEN=AXXXXxxxxxxxxxxxxxxxxxxxx
```

**Vercel** (Production):
```bash
npx vercel env add CHANGAN_KV_REST_API_URL
# Paste your URL when prompted

npx vercel env add CHANGAN_KV_REST_API_TOKEN
# Paste your token when prompted
```

Or use Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add both variables for **Production, Preview, Development**

---

## Database Schema

### Survey Responses

**Key Pattern**: `sav_survey:{timestamp}`

**Example**:
```json
{
  "data": {
    "accueil_courtoisie": "satisfaisant",
    "accueil_courtoisie_raison": "",
    "delais_respectes": "oui",
    "qualite_service": "tres_satisfaisant",
    "qualite_service_raison": "",
    "note_recommandation": "9",
    "remarques": "Service excellent !",
    "recontact": "non"
  },
  "screen": "QUESTION_6",
  "flow_token": "sav-1738540800000",
  "submitted_at": "2026-02-02T14:30:00.000Z",
  "timestamp": "2026-02-02T14:30:00.000Z",
  "survey_type": "changan_sav"
}
```

### Index

**Sorted Set**: `sav_surveys:index`
- Stores all survey keys sorted by timestamp
- Used for retrieving surveys chronologically

---

## Querying Data

### View All Surveys (Admin Endpoint)

```bash
curl https://your-project.vercel.app/admin/surveys
```

Response:
```json
{
  "total": 5,
  "surveys": [
    {
      "data": { ... },
      "submitted_at": "2026-02-02T14:30:00.000Z",
      "survey_type": "changan_sav"
    }
  ]
}
```

### Using Upstash Console

1. Go to [Upstash Console](https://console.upstash.com/)
2. Select `changan-sav-surveys` database
3. Click **"Data Browser"**
4. Commands:
   ```redis
   # Get all survey keys
   ZRANGE sav_surveys:index 0 -1 REV
   
   # Get specific survey
   GET sav_survey:1738540800000
   
   # Count total surveys
   ZCARD sav_surveys:index
   
   # Get latest 10 surveys
   ZRANGE sav_surveys:index 0 9 REV
   ```

### Using Redis CLI

Install Redis CLI:
```bash
npm install -g redis-cli
```

Connect:
```bash
redis-cli -h xxxxx-xxxxx.upstash.io -p 6379 -a your_password --tls
```

---

## Data Analysis

### Export Survey Data

Create a script to export to CSV:

```javascript
// export-surveys.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.CHANGAN_KV_REST_API_URL,
  token: process.env.CHANGAN_KV_REST_API_TOKEN
});

async function exportSurveys() {
  const keys = await redis.zrange('sav_surveys:index', 0, -1, { rev: true });
  
  const surveys = await Promise.all(
    keys.map(async (key) => {
      const data = await redis.get(key);
      return typeof data === 'string' ? JSON.parse(data) : data;
    })
  );
  
  // Convert to CSV
  console.log('timestamp,accueil,delais,qualite,note,recontact');
  surveys.forEach(s => {
    console.log([
      s.timestamp,
      s.data.accueil_courtoisie,
      s.data.delais_respectes,
      s.data.qualite_service,
      s.data.note_recommandation,
      s.data.recontact
    ].join(','));
  });
}

exportSurveys();
```

Run:
```bash
node export-surveys.js > surveys.csv
```

---

## Monitoring

### Check Database Status

```javascript
// check-db.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.CHANGAN_KV_REST_API_URL,
  token: process.env.CHANGAN_KV_REST_API_TOKEN
});

async function checkStatus() {
  try {
    const count = await redis.zcard('sav_surveys:index');
    console.log(`✅ Database connected`);
    console.log(`📊 Total surveys: ${count}`);
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

checkStatus();
```

---

## Cost & Limits

### Free Tier
- **10,000 commands/day**
- **256 MB storage**
- **TLS encryption**
- **Unlimited databases**

### Estimated Usage
- Save 1 survey ≈ 2 commands (SET + ZADD)
- **~5,000 surveys/day** within free tier

### Upgrade
If you exceed free tier:
- **Pay as you go**: $0.2 per 100K commands
- **Pro plan**: $10/month for 1M commands

---

## Backup & Recovery

### Manual Backup

Export all data:
```bash
# Get all keys
redis-cli -h xxxxx.upstash.io --tls -a password KEYS "*" > keys.txt

# Export each key
while read key; do
  redis-cli -h xxxxx.upstash.io --tls -a password GET "$key" > "backup_$key.json"
done < keys.txt
```

### Automated Backup

Use Upstash's **Daily Backup** feature (available in paid plans)

---

## Security

### Best Practices

1. ✅ **Never commit credentials** to Git
2. ✅ **Use environment variables** for tokens
3. ✅ **Enable TLS** for encryption in transit
4. ✅ **Rotate tokens** periodically
5. ✅ **Limit access** to production database

### Token Rotation

1. Go to Upstash Console
2. Select database → **Settings**
3. Click **"Rotate Password"**
4. Update environment variables everywhere

---

## Migration

### From Another Database

If you need to migrate from another system:

```javascript
// migrate.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.CHANGAN_KV_REST_API_URL,
  token: process.env.CHANGAN_KV_REST_API_TOKEN
});

async function migrate(surveys) {
  for (const survey of surveys) {
    const timestamp = new Date(survey.submitted_at).getTime();
    const key = `sav_survey:${timestamp}`;
    
    await redis.set(key, JSON.stringify(survey));
    await redis.zadd('sav_surveys:index', { score: timestamp, member: key });
    
    console.log(`Migrated: ${key}`);
  }
  console.log(`✅ Migrated ${surveys.length} surveys`);
}

// Example: migrate([...your data...]);
```

---

## Troubleshooting

### Connection Errors

**Issue**: Cannot connect to Redis

**Solution**:
1. Check URL format: `https://xxxxx.upstash.io` (with https)
2. Verify token is correct
3. Check database is active in Upstash Console

### Data Not Saving

**Issue**: Surveys not appearing in database

**Solution**:
1. Check environment variables are set in Vercel
2. Verify Redis credentials in `.env` locally
3. Check Vercel logs for errors: `npx vercel logs`

### Quota Exceeded

**Issue**: "Daily command limit exceeded"

**Solution**:
1. Check usage in Upstash Console
2. Upgrade to paid plan
3. Optimize queries (reduce redundant commands)

---

## Contact

For Upstash support:
- [Documentation](https://docs.upstash.com/)
- [Discord](https://discord.gg/upstash)
- [Email](mailto:support@upstash.com)
