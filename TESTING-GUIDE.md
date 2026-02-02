# Testing Guide - Changan SAV

## Test Scenarios

### Test 1: Complete Happy Path (All Satisfied)

**Expected Flow**: QUESTION_1 → QUESTION_2 → QUESTION_3 → QUESTION_4 → QUESTION_5 → QUESTION_6 → SUCCESS

**User Selections**:
1. Accueil: "Très satisfaisant" ✅
2. Délais: "Oui" ✅
3. Qualité: "Très satisfaisant" ✅
4. Note: "10" ⭐⭐⭐⭐⭐
5. Remarques: "Excellent service !" 💬
6. Recontact: "Non" ❌

**Expected Result**: 6 pages (no "pourquoi" pages)

---

### Test 2: Dissatisfied Path (All Unsatisfied)

**Expected Flow**: QUESTION_1 → POURQUOI_1 → QUESTION_2 → QUESTION_3 → POURQUOI_3 → QUESTION_4 → QUESTION_5 → QUESTION_6 → SUCCESS

**User Selections**:
1. Accueil: "Pas du tout satisfaisant" ❌
   - Pourquoi: "Personnel désagréable"
2. Délais: "Non" ❌
3. Qualité: "Peu satisfaisant" ⚠️
   - Pourquoi: "Problème non résolu"
4. Note: "3" ⭐
5. Remarques: "Très déçu du service" 💬
6. Recontact: "Oui" ✅

**Expected Result**: 8 pages (all pages including both "pourquoi")

---

### Test 3: Mixed Path

**Expected Flow**: QUESTION_1 → POURQUOI_1 → QUESTION_2 → QUESTION_3 → QUESTION_4 → QUESTION_5 → QUESTION_6 → SUCCESS

**User Selections**:
1. Accueil: "Peu satisfaisant" ⚠️
   - Pourquoi: "Temps d'attente trop long"
2. Délais: "Oui" ✅
3. Qualité: "Satisfaisant" ✅
4. Note: "7" ⭐⭐⭐
5. Remarques: (left blank)
6. Recontact: "Non" ❌

**Expected Result**: 7 pages (only first "pourquoi")

---

## Automated Testing

### Test Script 1: Send Survey Flow

```bash
# Test with phone number
node test-sav-flow.js +212600123456 "Ahmed"

# Expected output:
# 🚀 Changan SAV Survey Flow Test
# ================================
# 📱 Recipient: +212600123456
# 👤 Name: Ahmed
# 🔑 Flow ID: 1234567890
# 
# 📤 Sending SAV Survey Flow to +212600123456...
# ✅ Survey Flow sent successfully!
# Message ID: wamid.XXX
```

### Test Script 2: API Send Survey

```bash
curl -X POST http://localhost:3001/api/send-survey \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+212600123456",
    "name": "Ahmed"
  }'

# Expected response:
# {
#   "messages": [{"id": "wamid.XXX"}]
# }
```

### Test Script 3: Health Check

```bash
curl http://localhost:3001/

# Expected response:
# {
#   "status": "ok",
#   "service": "Changan SAV Survey Webhook",
#   "version": "1.0.0",
#   "timestamp": "2026-02-02T14:30:00.000Z",
#   "database": "connected"
# }
```

### Test Script 4: View Surveys

```bash
curl http://localhost:3001/admin/surveys

# Expected response:
# {
#   "total": 3,
#   "surveys": [
#     {
#       "data": {
#         "accueil_courtoisie": "satisfaisant",
#         ...
#       },
#       "submitted_at": "2026-02-02T14:30:00.000Z"
#     }
#   ]
# }
```

---

## Manual Testing Checklist

### Pre-Flight Checks

- [ ] Encryption keys generated
- [ ] Flow created on Facebook
- [ ] Flow ID configured
- [ ] Webhook deployed
- [ ] Database connected
- [ ] Access token valid

### Flow Testing

- [ ] **Send flow** to test number
- [ ] Flow message **received** in WhatsApp
- [ ] Click **"Commencer"** button
- [ ] Flow **opens** correctly
- [ ] All **questions display** properly
- [ ] **Navigation works** (continue buttons)
- [ ] **Conditional logic** works (pourquoi pages)
- [ ] **Data validation** works (required fields)
- [ ] **Submit button** works
- [ ] **Success message** appears
- [ ] Data **saved to database**

### Edge Cases

- [ ] Skip optional fields (remarques)
- [ ] Test all satisfaction levels
- [ ] Test all note values (1-10)
- [ ] Test both recontact options
- [ ] Test French special characters (é, à, ç)
- [ ] Test long text in remarques
- [ ] Test rapid submission
- [ ] Test multiple submissions

### Error Testing

- [ ] Invalid phone number
- [ ] Missing Flow ID
- [ ] Wrong access token
- [ ] Database connection failure
- [ ] Decryption error
- [ ] Network timeout

---

## Production Testing

### Before Go-Live

```bash
# 1. Test production webhook
curl https://your-project.vercel.app/

# 2. Send test survey
node test-sav-flow.js +212600000000 "Production Test"

# 3. Complete full flow on mobile device

# 4. Verify data in database
curl https://your-project.vercel.app/admin/surveys

# 5. Check Vercel logs
vercel logs
```

### After Go-Live

- [ ] Monitor first 10 real submissions
- [ ] Check error rate in logs
- [ ] Verify all data fields captured
- [ ] Test admin panel access
- [ ] Verify database quota usage
- [ ] Check response times

---

## Load Testing

### Simulate Multiple Users

```javascript
// load-test.js
const phones = [
  '+212600000001',
  '+212600000002',
  '+212600000003',
  // ... add more
];

async function loadTest() {
  for (const phone of phones) {
    await sendSurveyFlow(phone, `User ${phone.slice(-4)}`);
    await new Promise(r => setTimeout(r, 1000)); // 1 second delay
  }
}

loadTest();
```

### Expected Performance

- **Response time**: < 2 seconds
- **Success rate**: > 99%
- **Database writes**: < 500ms

---

## Debugging Tools

### View Decrypted Flow Data

Add to webhook-server.js temporarily:

```javascript
app.post('/flow', async (req, res) => {
  const decrypted = decryptRequest(req.body, PRIVATE_KEY, PASSPHRASE);
  console.log('🔍 DEBUG:', JSON.stringify(decrypted, null, 2));
  // ... rest of code
});
```

### Test Encryption/Decryption

```javascript
// test-crypto.js
const crypto = require('crypto');

const testData = { test: 'hello' };
const aesKey = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);

// Encrypt
const cipher = crypto.createCipheriv('aes-128-gcm', aesKey, iv);
const encrypted = Buffer.concat([
  cipher.update(JSON.stringify(testData), 'utf-8'),
  cipher.final()
]);
const tag = cipher.getAuthTag();
const encryptedWithTag = Buffer.concat([encrypted, tag]);

console.log('Encrypted:', encryptedWithTag.toString('base64'));

// Decrypt
const decipher = crypto.createDecipheriv('aes-128-gcm', aesKey, iv);
const encrypted_body = encryptedWithTag.subarray(0, -16);
const auth_tag = encryptedWithTag.subarray(-16);
decipher.setAuthTag(auth_tag);
const decrypted = Buffer.concat([
  decipher.update(encrypted_body),
  decipher.final()
]);

console.log('Decrypted:', JSON.parse(decrypted.toString('utf-8')));
```

### Monitor Database

```javascript
// monitor-db.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.CHANGAN_KV_REST_API_URL,
  token: process.env.CHANGAN_KV_REST_API_TOKEN
});

setInterval(async () => {
  const count = await redis.zcard('sav_surveys:index');
  console.log(`📊 Total surveys: ${count}`);
}, 5000); // Every 5 seconds
```

---

## Common Issues & Solutions

### Issue: Flow Not Sending

**Symptoms**: No message received on WhatsApp

**Debug**:
```bash
# Check Flow ID
echo $SAV_FLOW_ID

# Test API directly
curl -X POST "https://graph.facebook.com/v21.0/978792171974983/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "+212600000000",
    "type": "text",
    "text": {"body": "Test"}
  }'
```

**Solutions**:
- Verify Flow ID is correct
- Check Flow is published
- Ensure access token is valid
- Verify phone number format

---

### Issue: Data Not Saving

**Symptoms**: Surveys complete but not in database

**Debug**:
```bash
# Check Redis connection
curl -X GET "$CHANGAN_KV_REST_API_URL/ping" \
  -H "Authorization: Bearer $CHANGAN_KV_REST_API_TOKEN"

# Check Vercel logs
vercel logs
```

**Solutions**:
- Verify Redis credentials
- Check environment variables in Vercel
- Look for errors in logs

---

### Issue: Decryption Error

**Symptoms**: Flow shows error on submission

**Debug**:
```bash
# Check private key format
echo "$CHANGAN_PRIVATE_KEY" | head -1
# Should show: -----BEGIN ENCRYPTED PRIVATE KEY-----

# Verify passphrase
echo "$CHANGAN_PASSPHRASE"
```

**Solutions**:
- Regenerate keys if needed
- Ensure public key uploaded to Flow matches
- Check passphrase is correct

---

## Test Data Examples

### Sample Survey Responses

```json
// Happy customer
{
  "accueil_courtoisie": "tres_satisfaisant",
  "delais_respectes": "oui",
  "qualite_service": "tres_satisfaisant",
  "note_recommandation": "10",
  "remarques": "Excellent service, très professionnel",
  "recontact": "non"
}

// Unhappy customer
{
  "accueil_courtoisie": "pas_du_tout_satisfaisant",
  "accueil_courtoisie_raison": "Personnel impoli et non professionnel",
  "delais_respectes": "non",
  "qualite_service": "peu_satisfaisant",
  "qualite_service_raison": "Problème non résolu, doit revenir",
  "note_recommandation": "2",
  "remarques": "Très déçu, je ne reviendrai pas",
  "recontact": "oui"
}

// Neutral customer
{
  "accueil_courtoisie": "satisfaisant",
  "delais_respectes": "oui",
  "qualite_service": "satisfaisant",
  "note_recommandation": "7",
  "remarques": "",
  "recontact": "non"
}
```

---

## Reporting

### Generate Test Report

```bash
# Run all tests and save output
{
  echo "=== Health Check ==="
  curl http://localhost:3001/
  
  echo -e "\n\n=== Send Survey ==="
  node test-sav-flow.js +212600000000 "Test"
  
  echo -e "\n\n=== View Surveys ==="
  curl http://localhost:3001/admin/surveys
  
  echo -e "\n\n=== Logs ==="
  vercel logs | tail -20
} > test-report.txt

cat test-report.txt
```

---

## Success Criteria

✅ **Flow sends successfully** to WhatsApp  
✅ **All 8 pages display** correctly  
✅ **Conditional logic works** (pourquoi pages)  
✅ **Data saves to database**  
✅ **Success message appears**  
✅ **No errors in logs**  
✅ **Response time < 2 seconds**  
✅ **Admin panel shows data**

---

## Next Steps After Testing

1. ✅ All tests pass
2. ✅ Production deployment verified
3. ✅ Documentation complete
4. 🚀 **Ready for production use**
5. 📊 Set up monitoring and analytics
6. 🔔 Configure alerts for errors
7. 📈 Track usage metrics
