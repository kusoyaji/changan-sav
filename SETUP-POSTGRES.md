# 🗄️ Neon PostgreSQL Database Setup - ZERO Manual Intervention

## What You Get

A fully managed PostgreSQL database with:
- ✅ **Auto-calculated analytics** (NPS, satisfaction scores, sentiment)
- ✅ **Smart columns** for Excel export (week numbers, day of week, needs followup)
- ✅ **Automatic table creation** (no SQL knowledge needed)
- ✅ **Free tier** (3 GB storage, 0.5 GB data transfer/month)
- ✅ **No maintenance** required
- ✅ **Serverless autoscaling**

## Setup (5 Minutes)

### Step 1: Create Neon Database

1. **Go to**: https://neon.tech/
2. **Sign up** (free, use GitHub/Google)
3. **Create Project**:
   - Name: `changan-sav`
   - Region: **Europe (Frankfurt)** - closest to Morocco
   - Postgres version: 16 (default)
4. **Click** "Create Project"

### Step 2: Get Connection String

After creating, you'll see a connection string like:
```
postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Copy this entire string!**

### Step 3: Add to Vercel

#### Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select project: `y`
3. **Settings** → **Environment Variables**
4. Add ONE variable:

```
Name: DATABASE_URL
Value: postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
Environment: ✅ Production ✅ Preview ✅ Development
```

5. Click **Save**

#### Using CLI (Alternative)

```powershell
vercel env add DATABASE_URL
# Paste your connection string, press Enter
# Select: Production, Preview, Development (all)
```

### Step 4: Deploy

```powershell
vercel --prod
```

That's it! The table will be created automatically on first survey submission.

## Database Schema

The system automatically creates this table with **24 columns**:

### Core Fields
- `id` - Auto-incrementing primary key
- `submission_timestamp` - When submitted
- `created_at` - Server timestamp
- `flow_token` - WhatsApp identifier
- `phone_number` - Customer phone (if available)

### Survey Responses (8 fields)
- `accueil_courtoisie` - Reception/courtesy rating
- `accueil_courtoisie_raison` - Reason if not satisfied
- `delais_respectes` - Deadlines respected (yes/no)
- `qualite_service` - Service quality rating
- `qualite_service_raison` - Reason if not satisfied
- `note_recommandation` - Recommendation score (0-10)
- `remarques` - Comments/remarks
- `recontact` - Wants to be contacted (yes/no)

### Analytics (Auto-Calculated - 5 fields)
- `satisfaction_score` - Overall satisfaction (0.00 to 1.00)
- `is_promoter` - NPS: true if score ≥ 9
- `is_detractor` - NPS: true if score ≤ 6
- `needs_followup` - Flagged if recontact=yes OR negative feedback
- `sentiment` - positive/neutral/negative

### Time Analytics (6 fields)
- `submission_date` - Date only
- `submission_hour` - Hour of day (0-23)
- `day_of_week` - 0=Sunday to 6=Saturday
- `week_number` - ISO week number
- `month` - Month (1-12)
- `year` - Year

## Analytics Calculations

### Satisfaction Score
Averages all ratings converted to 0-1 scale:
- Très Satisfaisant = 1.0
- Satisfaisant = 0.75
- Peu Satisfaisant = 0.25
- Pas du Tout Satisfaisant = 0.0
- Délais: Oui = 1.0, Non = 0.0
- Note: 0-10 divided by 10

### NPS (Net Promoter Score)
- **Promoters**: note_recommandation ≥ 9
- **Passives**: note_recommandation = 7-8
- **Detractors**: note_recommandation ≤ 6
- **NPS = (Promoters % - Detractors %)**

### Needs Followup
Automatically flagged if:
- `recontact` = "oui"
- Any "Pas du Tout Satisfaisant" rating
- `delais_respectes` = "non"
- `note_recommandation` ≤ 6

### Sentiment
- **Positive**: satisfaction_score ≥ 0.75
- **Neutral**: 0.40 ≤ satisfaction_score < 0.75
- **Negative**: satisfaction_score < 0.40

## Excel Export Columns

The CSV export includes 22 columns:

**Basic Info:**
1. ID
2. Date et Heure
3. Token/Téléphone

**Survey Responses:**
4. Accueil et Courtoisie
5. Raison (Accueil)
6. Délais Respectés
7. Qualité du Service
8. Raison (Qualité)
9. Note Recommandation (0-10)
10. Remarques
11. Recontact

**Analytics:**
12. Score Satisfaction (%)
13. Sentiment
14. Promoteur NPS
15. Détracteur NPS
16. Nécessite Suivi

**Time Data:**
17. Date
18. Heure
19. Jour Semaine
20. Semaine N°
21. Mois
22. Année

## Dashboard Stats

The UI now shows 6 key metrics:

1. **Total Réponses** - All time count
2. **Aujourd'hui** - Today's submissions
3. **Score NPS** - Net Promoter Score (-100 to +100)
4. **Satisfaction Moy.** - Average satisfaction %
5. **À Recontacter** - Count needing followup
6. **Dernière réponse** - Time of last submission

## Verifying It Works

After deployment:

1. **Send test survey** via WhatsApp
2. **Check Vercel logs**:
   ```powershell
   vercel logs --prod
   ```
3. **Look for**:
   - ✅ Database initialized successfully
   - ✅ Saved to database: ID 1, Satisfaction: 0.75, Sentiment: positive

4. **Check UI**: https://y-gamma-six-62.vercel.app/
5. **Export data**: Click "📊 Exporter Excel"

## Database Queries (Optional)

If you want to query the database directly:

```sql
-- Get all responses
SELECT * FROM survey_responses ORDER BY created_at DESC;

-- Get responses needing followup
SELECT * FROM survey_responses WHERE needs_followup = true;

-- Calculate NPS
SELECT 
  ROUND(((SUM(CASE WHEN is_promoter THEN 1 ELSE 0 END) - 
          SUM(CASE WHEN is_detractor THEN 1 ELSE 0 END)) * 100.0 / COUNT(*)), 2) as nps
FROM survey_responses;

-- Daily statistics
SELECT 
  submission_date,
  COUNT(*) as total,
  ROUND(AVG(satisfaction_score) * 100, 2) as avg_satisfaction,
  SUM(CASE WHEN needs_followup THEN 1 ELSE 0 END) as needs_followup
FROM survey_responses
GROUP BY submission_date
ORDER BY submission_date DESC;
```

## Cost & Limits

**Neon Free Tier:**
- ✅ 3 GB storage
- ✅ 0.5 GB data transfer/month  
- ✅ Unlimited databases
- ✅ Autoscaling (0-0.25 compute units)
- ✅ 24/7 availability

**Estimated Usage:**
- ~1 KB per response = **3 million responses** on free tier
- Data transfer: ~500 MB = **500,000 responses/month** exports

**If you exceed free tier:**
- Pro plan: $19/month
- Includes 10 GB storage + more compute
- Still very cheap for your use case

## Troubleshooting

**"Database not configured" error?**
- Make sure you created the Vercel Postgres database
- Redeploy after creating: `vercel --prod`
- Environment variables are auto-added

**Table not created?**
- Submit one survey - table auto-creates
- Check logs for "✅ Database initialized"
- If issues, check Vercel logs

**Excel export empty?**
- Database needs at least 1 survey response
- Send test survey first
- Check `/api/responses` endpoint

**Performance slow?**
- Free tier has connection limits
- Upgrade to Pro for connection pooling
- Or use `POSTGRES_URL_NON_POOLING` for simple queries

## Advanced: Manual Migration

If you want to create the table manually (optional):

```powershell
# Install psql or use Vercel dashboard SQL editor
# Copy content from api/db/schema.sql and run it
```

## Next Steps

After setup is complete:
1. ✅ Send test survey
2. ✅ Verify data in UI
3. ✅ Export to Excel
4. ✅ Check analytics (NPS, sentiment, followup flags)
5. 🎉 **Done!** System runs automatically with zero intervention
