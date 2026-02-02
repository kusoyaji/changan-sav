# Changan SAV - Service Après-Vente WhatsApp Flow
## Complete Setup Guide

This is a **separate project** for Changan's after-sales satisfaction survey, using the same Voom Digital credentials but with its own webhook and database.

---

## 📋 Project Overview

**Purpose**: Collect customer satisfaction feedback after service visits via WhatsApp Flow

**Survey Questions**:
1. Accueil et courtoisie de l'équipe (with optional "pourquoi")
2. Respect des délais annoncés (Oui/Non)
3. Qualité du service rendu (with optional "pourquoi")
4. Note de recommandation (1-10)
5. Remarques et suggestions (optional)
6. Souhait d'être recontacté (Oui/Non)

**Total Pages**: 8 (6 main questions + 2 conditional "pourquoi" pages)

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd changan-sav
npm install
```

### Step 2: Generate Encryption Keys

```bash
node ../generate-keys.js
```

Save the output:
- **Private Key** → Use in environment variables
- **Public Key** → Upload to WhatsApp Flow settings
- **Passphrase** → Use in environment variables

### Step 3: Create WhatsApp Flow

1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to **WhatsApp Manager** → **Flows**
3. Click **Create Flow**
4. Name it: "Changan SAV Satisfaction Survey"
5. Upload `whatsapp-sav-flow.json`
6. In Flow Settings → **Endpoint Configuration**:
   - Set webhook URL (will be your Vercel URL + `/flow`)
   - Upload the **Public Key** from Step 2
7. **Publish the Flow**
8. Copy the **Flow ID** (you'll need this)

### Step 4: Create Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Click **Create Database**
3. Name: `changan-sav-surveys`
4. Region: Choose closest to your users
5. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Step 5: Configure Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# WhatsApp (Voom Digital - same as main project)
WHATSAPP_ACCESS_TOKEN=EAFgpN5lxPgUBOT9y6Uo9N0KA5rZBMYYDVvbBnHzBSBey430X1nx8f2HNrtM9C9qI4JyZAnhlcX06YpsZAjQPZBiZBdPiWorxIcIitKioGxFbPlkGvysNLnfjKNsaIULIq3u0CNpKN70ZCUZAHIMZCpUbmHOf7SkUH55b2KeyEEZCQMZAqAgQSy5G5KBJXvXjVxQAZDZD
PHONE_NUMBER_ID=978792171974983

# Your Flow ID from Step 3
SAV_FLOW_ID=YOUR_FLOW_ID_HERE

# Webhook token (use when setting up webhook)
WHATSAPP_VERIFY_TOKEN=changan_sav_webhook_verify_2026_secure

# Keys from Step 2
CHANGAN_PRIVATE_KEY=-----BEGIN ENCRYPTED PRIVATE KEY-----
...your key...
-----END ENCRYPTED PRIVATE KEY-----
CHANGAN_PASSPHRASE=your_passphrase

# Database from Step 4
CHANGAN_KV_REST_API_URL=https://xxxxx.upstash.io
CHANGAN_KV_REST_API_TOKEN=your_token
```

### Step 6: Test Locally

```bash
npm start
```

Server runs on `http://localhost:3001`

Test sending a survey:
```bash
node test-sav-flow.js +212600000000 "Ahmed"
```

### Step 7: Deploy to Vercel

```bash
# Login to Vercel
npx vercel login

# Deploy
npx vercel

# Set environment variables in Vercel dashboard
# Or use CLI:
npx vercel env add WHATSAPP_ACCESS_TOKEN
npx vercel env add PHONE_NUMBER_ID
npx vercel env add SAV_FLOW_ID
npx vercel env add CHANGAN_PRIVATE_KEY
npx vercel env add CHANGAN_PASSPHRASE
npx vercel env add WHATSAPP_VERIFY_TOKEN
npx vercel env add CHANGAN_KV_REST_API_URL
npx vercel env add CHANGAN_KV_REST_API_TOKEN

# Deploy to production
npx vercel --prod
```

Your webhook URL will be: `https://your-project.vercel.app`

### Step 8: Configure WhatsApp Webhook

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select **Voom Digital** app
3. Go to **WhatsApp** → **Configuration**
4. Click **Edit** on Webhook
5. Enter:
   - **Callback URL**: `https://your-project.vercel.app/webhook`
   - **Verify Token**: `changan_sav_webhook_verify_2026_secure`
6. Click **Verify and Save**
7. Subscribe to **messages** webhook field

### Step 9: Update Flow Endpoint

1. Go back to your Flow in WhatsApp Manager
2. Settings → **Endpoint Configuration**
3. Update endpoint URL to: `https://your-project.vercel.app/flow`
4. Save and **Re-publish** the flow

---

## 🧪 Testing

### Test 1: Send Survey Flow
```bash
node test-sav-flow.js +212600123456 "Test User"
```

### Test 2: Check Webhook Health
```bash
curl https://your-project.vercel.app/
```

### Test 3: View Submissions
```bash
curl https://your-project.vercel.app/admin/surveys
```

### Test 4: Manual Survey Trigger
```bash
curl -X POST https://your-project.vercel.app/api/send-survey \
  -H "Content-Type: application/json" \
  -d '{"phone": "+212600123456", "name": "Ahmed"}'
```

---

## 📊 Monitoring

### View All Survey Responses
Open: `https://your-project.vercel.app/admin/surveys`

### Check Database
Go to Upstash Console → Select your database → Data Browser

### Vercel Logs
```bash
npx vercel logs
```

---

## 🔐 Security Notes

1. **Never commit `.env` file**
2. **Use different Redis database** than main project
3. **Rotate access tokens** regularly
4. **Keep private keys secure**
5. **Use strong passphrases**

---

## 🆘 Troubleshooting

### Flow not sending?
- Check SAV_FLOW_ID is correct
- Verify Flow is published
- Check access token is valid

### Webhook not receiving data?
- Verify webhook URL in Facebook settings
- Check Vercel deployment logs
- Ensure private key matches public key uploaded to Flow

### Database not saving?
- Check Redis credentials
- Verify Upstash database is active
- Check Vercel environment variables

### Decryption errors?
- Ensure private key format is correct
- Check passphrase matches
- Verify public key uploaded to Flow

---

## 📞 Support

For issues or questions:
- Check Vercel logs: `npx vercel logs`
- Check Upstash database status
- Verify all environment variables are set

---

## 📁 File Structure

```
changan-sav/
├── webhook-server.js          # Main webhook server
├── whatsapp-sav-flow.json    # Flow definition (8 pages)
├── test-sav-flow.js          # Test script
├── package.json              # Dependencies
├── vercel.json               # Vercel deployment config
├── .env.example              # Environment variables template
└── README.md                 # This file
```

---

## 🔄 Workflow

1. Customer receives WhatsApp message with Flow button
2. Customer clicks "Commencer"
3. Flow displays 6 questions (+ 2 conditional)
4. Customer submits survey
5. Data sent to `/flow` endpoint (encrypted)
6. Webhook decrypts and saves to Redis
7. Success message shown to customer
8. Admin can view responses at `/admin/surveys`

---

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Encryption keys generated
- [ ] WhatsApp Flow created and published
- [ ] Flow ID obtained
- [ ] Upstash Redis database created
- [ ] Environment variables configured
- [ ] Local testing successful
- [ ] Deployed to Vercel
- [ ] Webhook configured in Facebook
- [ ] Flow endpoint updated
- [ ] End-to-end test completed

---

## 📝 Notes

- This project is **separate** from enseignement/prepa flows
- Uses **same Voom Digital credentials** (access token, phone number)
- Uses **different port** (3001 vs 3000)
- Uses **separate Redis database**
- Can be deployed to **different Vercel project**
- Compatible with Changan's WhatsApp Business Account (once they provide access)
