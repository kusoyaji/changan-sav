# Deployment Guide - Changan SAV to Vercel

## Prerequisites

- ✅ Node.js installed
- ✅ Vercel CLI installed: `npm install -g vercel`
- ✅ Vercel account created
- ✅ All environment variables ready
- ✅ WhatsApp Flow created with Flow ID
- ✅ Upstash Redis database created

---

## Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Choose your preferred login method (GitHub, GitLab, Email)

### Step 3: Navigate to Project

```bash
cd changan-sav
```

### Step 4: Initial Deployment

```bash
vercel
```

You'll be prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account/team
- **Link to existing project?** → No
- **What's your project's name?** → `changan-sav` (or custom name)
- **In which directory is your code located?** → `./`
- **Want to override settings?** → No

This creates a **preview deployment**.

### Step 5: Add Environment Variables

```bash
# WhatsApp credentials
vercel env add WHATSAPP_ACCESS_TOKEN production
# Paste: EAFgpN5lxPgUBOT9y6Uo9N0KA5rZBMYYDVvbBnHzBSBey430X1nx8f2HNrtM9C9qI4JyZAnhlcX06YpsZAjQPZBiZBdPiWorxIcIitKioGxFbPlkGvysNLnfjKNsaIULIq3u0CNpKN70ZCUZAHIMZCpUbmHOf7SkUH55b2KeyEEZCQMZAqAgQSy5G5KBJXvXjVxQAZDZD

vercel env add PHONE_NUMBER_ID production
# Paste: 978792171974983

vercel env add SAV_FLOW_ID production
# Paste: YOUR_FLOW_ID_FROM_FACEBOOK

vercel env add WHATSAPP_VERIFY_TOKEN production
# Paste: changan_sav_webhook_verify_2026_secure

# Encryption keys
vercel env add CHANGAN_PRIVATE_KEY production
# Paste your private key (including BEGIN/END lines)

vercel env add CHANGAN_PASSPHRASE production
# Paste your passphrase

# Database
vercel env add CHANGAN_KV_REST_API_URL production
# Paste your Upstash URL

vercel env add CHANGAN_KV_REST_API_TOKEN production
# Paste your Upstash token
```

Repeat for `preview` and `development` environments:
```bash
vercel env pull # Download all env vars to .env.local
```

### Step 6: Deploy to Production

```bash
vercel --prod
```

Your production URL: `https://changan-sav.vercel.app` (or similar)

### Step 7: Test Deployment

```bash
curl https://your-project.vercel.app/
```

Expected response:
```json
{
  "status": "ok",
  "service": "Changan SAV Survey Webhook",
  "version": "1.0.0",
  "database": "connected"
}
```

---

## Method 2: Deploy via Vercel Dashboard

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial Changan SAV project"
git remote add origin https://github.com/your-username/changan-sav.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your `changan-sav` repository
4. Configure:
   - **Project Name**: `changan-sav`
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

### Step 3: Add Environment Variables

In the **Environment Variables** section, add:

| Name | Value |
|------|-------|
| WHATSAPP_ACCESS_TOKEN | EAFgpN5lxPgUBOT9y6Uo9N0KA5rZBMYYDVvbBnHzBSBey430X1nx8f2HNrtM9C9qI4JyZAnhlcX06YpsZAjQPZBiZBdPiWorxIcIitKioGxFbPlkGvysNLnfjKNsaIULIq3u0CNpKN70ZCUZAHIMZCpUbmHOf7SkUH55b2KeyEEZCQMZAqAgQSy5G5KBJXvXjVxQAZDZD |
| PHONE_NUMBER_ID | 978792171974983 |
| SAV_FLOW_ID | (your Flow ID) |
| WHATSAPP_VERIFY_TOKEN | changan_sav_webhook_verify_2026_secure |
| CHANGAN_PRIVATE_KEY | (your private key) |
| CHANGAN_PASSPHRASE | (your passphrase) |
| CHANGAN_KV_REST_API_URL | (Upstash URL) |
| CHANGAN_KV_REST_API_TOKEN | (Upstash token) |

Select **Production, Preview, Development** for each.

### Step 4: Deploy

Click **Deploy** button.

---

## Post-Deployment Configuration

### 1. Update WhatsApp Webhook

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select **Voom Digital** app
3. Navigate to **WhatsApp → Configuration**
4. Edit webhook:
   - **Callback URL**: `https://your-project.vercel.app/webhook`
   - **Verify Token**: `changan_sav_webhook_verify_2026_secure`
5. Click **Verify and Save**
6. Subscribe to **messages** field

### 2. Update Flow Endpoint

1. Go to [WhatsApp Manager](https://business.facebook.com/wa/manage/flows/)
2. Select your SAV Flow
3. Go to **Settings → Endpoint**
4. Update endpoint URL: `https://your-project.vercel.app/flow`
5. Verify the connection
6. **Publish** the updated flow

---

## Testing Production Deployment

### Test 1: Health Check
```bash
curl https://your-project.vercel.app/
```

### Test 2: Send Survey
```bash
node test-sav-flow.js +212600000000 "Test User"
```

Check WhatsApp to receive the flow.

### Test 3: Check Database
```bash
curl https://your-project.vercel.app/admin/surveys
```

### Test 4: View Logs
```bash
vercel logs
```

Or in Vercel Dashboard → Your Project → **Deployments** → Select deployment → **Logs**

---

## Continuous Deployment

### Auto-Deploy on Git Push

If you used Method 2 (GitHub integration):

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update survey flow"
   git push
   ```
3. Vercel automatically deploys (preview for branches, production for main)

### Manual Redeploy

```bash
vercel --prod
```

---

## Managing Deployments

### List Deployments
```bash
vercel ls
```

### View Specific Deployment
```bash
vercel inspect <deployment-url>
```

### Rollback to Previous Deployment

1. Go to Vercel Dashboard
2. Select project → **Deployments**
3. Find previous working deployment
4. Click **⋮** → **Promote to Production**

Or via CLI:
```bash
vercel rollback
```

---

## Environment Management

### View Current Variables
```bash
vercel env ls
```

### Update Variable
```bash
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production
```

### Pull Variables Locally
```bash
vercel env pull .env.local
```

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Click **Settings → Domains**
3. Add domain: `sav.changan.ma`
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

Update webhook URLs to use custom domain:
- Webhook: `https://sav.changan.ma/webhook`
- Flow: `https://sav.changan.ma/flow`

---

## Monitoring & Debugging

### View Real-time Logs
```bash
vercel logs --follow
```

### Download Logs
```bash
vercel logs > logs.txt
```

### Check Function Performance

Vercel Dashboard → Project → **Analytics**

### Set Up Alerts

Vercel Dashboard → Project → **Settings → Notifications**

Configure alerts for:
- Deployment failures
- Function errors
- High response times

---

## Security Best Practices

### 1. Secure Environment Variables
- ✅ Never commit `.env` files
- ✅ Use Vercel's encrypted storage
- ✅ Rotate tokens regularly

### 2. Enable HTTPS
- ✅ Automatic with Vercel
- ✅ SSL certificates auto-renewed

### 3. Rate Limiting (Optional)

Add to `webhook-server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/webhook', limiter);
```

### 4. IP Whitelisting (Advanced)

Whitelist Facebook's webhook IPs:
```javascript
const FACEBOOK_IPS = [
  '173.252.88.0/21',
  '69.63.176.0/20',
  // ... add all Facebook IP ranges
];

app.use('/webhook', (req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // Check if IP is in whitelist
  // ...
  next();
});
```

---

## Costs

### Vercel Pricing

**Hobby (Free)**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Edge Network
- ❌ No team collaboration

**Pro ($20/month)**:
- ✅ Everything in Hobby
- ✅ Team collaboration
- ✅ Analytics
- ✅ Priority support

For this project, **Hobby plan is sufficient**.

### Upstash Pricing

**Free Tier**:
- ✅ 10,000 commands/day
- ✅ 256 MB storage

Enough for ~5,000 surveys/day.

---

## Troubleshooting

### Deployment Fails

**Error**: Build failed

**Solution**:
```bash
# Check package.json is valid
npm install

# Try deploying with verbose logs
vercel --debug
```

### Environment Variables Not Working

**Error**: `PRIVATE_KEY not set`

**Solution**:
1. Verify variables in Vercel Dashboard
2. Ensure they're set for "Production"
3. Redeploy after adding variables

### Webhook Not Receiving Messages

**Error**: No logs when sending message

**Solution**:
1. Check webhook URL is correct
2. Verify verify_token matches
3. Ensure "messages" subscription is active
4. Check Vercel logs: `vercel logs`

### Function Timeout

**Error**: Function execution timed out

**Solution**:
Vercel Hobby has 10s timeout limit. Optimize:
```javascript
// Use Promise.all for parallel operations
await Promise.all([
  saveSurveyResponse(data),
  sendConfirmation(phone)
]);
```

---

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
git commit -am "Update dependencies"
vercel --prod
```

### Monitor Usage

Check monthly:
1. Vercel bandwidth usage
2. Upstash command count
3. Error rates in logs

---

## Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## Deployment Checklist

- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] All environment variables added
- [ ] Health check passes
- [ ] Webhook verified in Facebook
- [ ] Flow endpoint updated
- [ ] Test message sent successfully
- [ ] Survey submission works end-to-end
- [ ] Database saving confirmed
- [ ] Logs are clean (no errors)
- [ ] Admin panel accessible
- [ ] Documentation updated with URLs

✅ **Deployment Complete!**
