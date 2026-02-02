# Quick Reference - Changan SAV

## Important Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Upstash Console**: https://console.upstash.com/
- **Facebook Developers**: https://developers.facebook.com/apps/24815116724813317
- **WhatsApp Manager**: https://business.facebook.com/wa/manage/flows/

## Credentials

### WhatsApp (Voom Digital)
- **App ID**: 24815116724813317
- **Phone Number ID**: 978792171974983
- **Access Token**: `EAFgpN5lxPgUBOT9y6Uo9N0KA5rZBMYYDVvbBnHzBSBey430X1nx8f2HNrtM9C9qI4JyZAnhlcX06YpsZAjQPZBiZBdPiWorxIcIitKioGxFbPlkGvysNLnfjKNsaIULIq3u0CNpKN70ZCUZAHIMZCpUbmHOf7SkUH55b2KeyEEZCQMZAqAgQSy5G5KBJXvXjVxQAZDZD`

### Flow IDs
- **Enseignement Flow**: 901432542403753
- **Prepa Flow**: 1414098980315997
- **SAV Flow**: (to be created)

### Verify Token
```
changan_sav_webhook_verify_2026_secure
```

## Common Commands

### Development
```bash
cd changan-sav
npm install
npm start
```

### Testing
```bash
# Send test survey
node test-sav-flow.js +212600000000 "Ahmed"

# Check health
curl http://localhost:3001/

# View surveys
curl http://localhost:3001/admin/surveys
```

### Deployment
```bash
# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs

# View logs (live)
vercel logs --follow
```

### Environment Variables
```bash
# Add variable
vercel env add VARIABLE_NAME production

# List variables
vercel env ls

# Pull to .env.local
vercel env pull
```

## API Endpoints

### Production URLs
Replace `your-project.vercel.app` with your actual URL:

- **Health**: `https://your-project.vercel.app/`
- **Webhook**: `https://your-project.vercel.app/webhook`
- **Flow**: `https://your-project.vercel.app/flow`
- **Admin**: `https://your-project.vercel.app/admin/surveys`
- **Send Survey**: `POST https://your-project.vercel.app/api/send-survey`

### Send Survey API

```bash
curl -X POST https://your-project.vercel.app/api/send-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212600000000",
    "name": "Ahmed"
  }'
```

## Flow Structure

```
QUESTION_1 (Accueil)
├─ peu/pas satisfait → QUESTION_1_POURQUOI
└─ satisfait → QUESTION_2

QUESTION_2 (Délais)
└─ → QUESTION_3

QUESTION_3 (Qualité)
├─ peu/pas satisfait → QUESTION_3_POURQUOI
└─ satisfait → QUESTION_4

QUESTION_4 (Note 1-10)
└─ → QUESTION_5

QUESTION_5 (Remarques)
└─ → QUESTION_6

QUESTION_6 (Recontact)
└─ data_exchange → SUCCESS_SCREEN
```

## Survey Data Fields

```javascript
{
  accueil_courtoisie: "tres_satisfaisant" | "satisfaisant" | "peu_satisfaisant" | "pas_du_tout_satisfaisant",
  accueil_courtoisie_raison: "string (optional)",
  delais_respectes: "oui" | "non",
  qualite_service: "tres_satisfaisant" | "satisfaisant" | "peu_satisfaisant" | "pas_du_tout_satisfaisant",
  qualite_service_raison: "string (optional)",
  note_recommandation: "1" to "10",
  remarques: "string (optional)",
  recontact: "oui" | "non"
}
```

## Setup Checklist

- [ ] Generate encryption keys: `node ../generate-keys.js`
- [ ] Create WhatsApp Flow and get Flow ID
- [ ] Create Upstash Redis database
- [ ] Copy `.env.example` to `.env` and fill values
- [ ] Install dependencies: `npm install`
- [ ] Test locally: `npm start`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Configure webhook in Facebook
- [ ] Update Flow endpoint URL
- [ ] Test end-to-end

## Troubleshooting Quick Fixes

### Flow not sending
```bash
# Check Flow ID
echo $SAV_FLOW_ID

# Verify access token
curl -X GET "https://graph.facebook.com/v21.0/me?access_token=$WHATSAPP_ACCESS_TOKEN"
```

### Webhook not working
```bash
# Check Vercel deployment
vercel ls

# View logs
vercel logs

# Test webhook locally with ngrok
npx ngrok http 3001
```

### Database not saving
```bash
# Test Redis connection
curl -X GET "$CHANGAN_KV_REST_API_URL/get/test" \
  -H "Authorization: Bearer $CHANGAN_KV_REST_API_TOKEN"
```

## Support Contacts

- **Voom Digital**: [contact info]
- **Changan**: [contact info]
- **Technical Support**: [your contact]

## Notes

- This is a **separate project** from enseignement/prepa
- Uses **same WhatsApp credentials** (Voom Digital)
- Uses **different database** (Upstash Redis)
- Deploys to **separate Vercel project**
- Port 3001 (vs 3000 for main project)
