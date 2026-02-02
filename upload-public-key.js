/**
 * Upload and Sign Public Key to WhatsApp Flow
 * Cloud API method - automatically signs the key
 */

const fs = require('fs');
const https = require('https');

// Configuration - CRITICAL: Public key upload requires WABA ID, NOT Phone Number ID!
// WABA ID = WhatsApp Business Account ID (found in API Setup page)
// Phone Number ID is different and won't work for key upload
const WABA_ID = '1415511567255794'; // WhatsApp Business Account ID from screenshot 3
const ACCESS_TOKEN = 'EAANQ1WlW6ZBcBQrdwAH7zw88d6PzzgCBsfEwcncXDvCDe7JZAtf1quWHcrOR8jGAZCZBOK01FSIsbtMSfBWRIPJWgH5J412X85jjS27XkCJTdzoQWOAGDJZA083Xty6AEFTbVFJYMHMpIsZAbZATxm6pWKj5IZCHEJYO5t6b9wbVK5Fm436jQ9Ule1yeXWYhx6GkakcHHZB3jdM5xm4AqnzaFMejYPb7MimvNAV8ZC'; // Voom Digital permanent system user token
const PUBLIC_KEY_PATH = '../public.pem';

// Read the public key
const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');

console.log('📤 Uploading public key to WhatsApp...\n');
console.log('WABA ID (WhatsApp Business Account):', WABA_ID);
console.log('Public Key Preview:', publicKey.substring(0, 80) + '...\n');

// Prepare the request
const postData = JSON.stringify({
  business_public_key: publicKey
});

const options = {
  hostname: 'graph.facebook.com',
  port: 443,
  path: `/v21.0/${WABA_ID}/whatsapp_business_encryption`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS! Public key uploaded and signed automatically by WhatsApp.');
      console.log('\nNext steps:');
      console.log('1. Add CHANGAN_PRIVATE_KEY to Vercel environment variables');
      console.log('2. Test the health check endpoint');
      console.log('3. Upload the flow JSON to WhatsApp Manager');
    } else {
      console.log('\n❌ ERROR uploading public key');
      try {
        const errorObj = JSON.parse(data);
        console.log('Error details:', JSON.stringify(errorObj, null, 2));
      } catch (e) {
        console.log('Raw error:', data);
      }
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.write(postData);
req.end();
