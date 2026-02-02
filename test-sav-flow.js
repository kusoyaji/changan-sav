// Test script to send SAV Survey Flow to a WhatsApp number
// Usage: node test-sav-flow.js +212XXXXXXXXX

const WHATSAPP_ACCESS_TOKEN = 'EAFgpN5lxPgUBOT9y6Uo9N0KA5rZBMYYDVvbBnHzBSBey430X1nx8f2HNrtM9C9qI4JyZAnhlcX06YpsZAjQPZBiZBdPiWorxIcIitKioGxFbPlkGvysNLnfjKNsaIULIq3u0CNpKN70ZCUZAHIMZCpUbmHOf7SkUH55b2KeyEEZCQMZAqAgQSy5G5KBJXvXjVxQAZDZD';
const PHONE_NUMBER_ID = '930151243516923'; // CHANGAN phone number ID
const SAV_FLOW_ID = process.env.SAV_FLOW_ID || '1595070248222614'; // CHANGAN SAV Flow ID

async function sendSurveyFlow(recipientPhone, userName = '') {
  try {
    console.log(`📤 Sending SAV Survey Flow to ${recipientPhone}...`);
    console.log(`🔑 Phone Number ID: ${PHONE_NUMBER_ID}`);
    console.log(`🔑 Flow ID: ${SAV_FLOW_ID}`);
    console.log(`🔑 Access Token: ${WHATSAPP_ACCESS_TOKEN.substring(0, 20)}...`);
    
    const bodyText = userName 
      ? `Bonjour ${userName}, Merci d'avoir choisi notre Service Après-Vente. Votre avis compte beaucoup pour nous et nous aide à améliorer continuellement votre expérience. Nous vous invitons à répondre à 5 courtes questions sur votre récente visite`
      : "Bonjour, Merci d'avoir choisi notre Service Après-Vente. Votre avis compte beaucoup pour nous et nous aide à améliorer continuellement votre expérience. Nous vous invitons à répondre à 5 courtes questions sur votre récente visite";
    
    const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    console.log(`📍 API URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'interactive',
        interactive: {
          type: 'flow',
          header: {
            type: 'text',
            text: 'Enquête de Satisfaction SAV'
          },
          body: {
            text: bodyText
          },
          footer: {
            text: 'Changan Maroc'
          },
          action: {
            name: 'flow',
            parameters: {
              flow_message_version: '3',
              flow_token: 'sav-' + Date.now(),
              flow_id: SAV_FLOW_ID,
              flow_cta: 'Commencer'
            }
          }
        }
      })
    });
    
    const result = await response.json();
    
    console.log('');
    console.log(`📨 Response Status: ${response.status}`);
    console.log(`📨 Response Body:`, JSON.stringify(result, null, 2));
    console.log('');
    
    if (result.error) {
      console.error('❌ Error sending survey flow:');
      console.error('   Error Code:', result.error.code);
      console.error('   Error Type:', result.error.type);
      console.error('   Error Message:', result.error.message);
      console.error(JSON.stringify(result.error, null, 2));
      console.error('');
      
      // Specific error hints
      if (result.error.code === 100) {
        console.error('💡 This is usually an ACCESS TOKEN problem');
        console.error('   - Check if token is valid and not expired');
        console.error('   - Verify token has correct permissions');
      } else if (result.error.code === 131009) {
        console.error('💡 This is a PHONE NUMBER ID problem');
        console.error('   - Verify Phone Number ID:', PHONE_NUMBER_ID);
        console.error('   - Check if this phone number is registered to the app');
      } else if (result.error.code === 131047) {
        console.error('💡 This is a FLOW ID problem');
        console.error('   - Verify Flow ID:', SAV_FLOW_ID);
        console.error('   - Check if flow is published');
        console.error('   - Verify flow is associated with this phone number');
      } else if (result.error.code === 131026) {
        console.error('💡 This is a RECIPIENT NUMBER problem');
        console.error('   - Check if recipient number is valid:', recipientPhone);
        console.error('   - Verify recipient is registered on WhatsApp');
      }
      
      return false;
    } else {
      console.log('✅ Survey Flow sent successfully!');
      console.log('📬 Message ID:', result.messages?.[0]?.id);
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to send survey flow:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    return false;
  }
}

// Main execution
const recipientPhone = process.argv[2];
const userName = process.argv[3] || '';

if (!recipientPhone) {
  console.log('❌ Please provide a phone number');
  console.log('Usage: node test-sav-flow.js +212XXXXXXXXX [Name]');
  console.log('Example: node test-sav-flow.js +212600000000 "Ahmed"');
  process.exit(1);
}

if (SAV_FLOW_ID === '1595070248222614') {
  console.log('✅ Using CHANGAN SAV Flow ID');
} else {
  console.log('⚠️  WARNING: Custom SAV_FLOW_ID set:', SAV_FLOW_ID);
}

console.log('🚀 Changan SAV Survey Flow Test');
console.log('================================');
console.log('📱 Recipient:', recipientPhone);
console.log('👤 Name:', userName || '(not provided)');
console.log('🔑 Flow ID:', SAV_FLOW_ID);
console.log('');

sendSurveyFlow(recipientPhone, userName);
