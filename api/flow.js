// Changan SAV Flow Data Exchange Endpoint
const crypto = require('crypto');
const storage = require('./storage');
import { saveSurveyResponse, initializeDatabase } from './db/postgres.js';

// Private key from environment
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.CHANGAN_PRIVATE_KEY;
const PASSPHRASE = process.env.PASSPHRASE || '';

// Initialize database on first load
let dbInitialized = false;

function decryptRequest(body) {
  const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;
  
  // Decrypt AES key
  const decryptedAesKey = crypto.privateDecrypt(
    {
      key: PRIVATE_KEY,
      passphrase: PASSPHRASE,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encrypted_aes_key, 'base64')
  );
  
  // Decrypt flow data
  const flowDataBuffer = Buffer.from(encrypted_flow_data, 'base64');
  const initialVectorBuffer = Buffer.from(initial_vector, 'base64');
  const TAG_LENGTH = 16;
  const encrypted_flow_data_body = flowDataBuffer.subarray(0, -TAG_LENGTH);
  const encrypted_flow_data_tag = flowDataBuffer.subarray(-TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv('aes-128-gcm', decryptedAesKey, initialVectorBuffer);
  decipher.setAuthTag(encrypted_flow_data_tag);
  
  const decryptedData = Buffer.concat([
    decipher.update(encrypted_flow_data_body),
    decipher.final(),
  ]);
  
  return {
    data: JSON.parse(decryptedData.toString('utf-8')),
    aesKey: decryptedAesKey,
    iv: initialVectorBuffer
  };
}

function encryptResponse(response, aesKey, initialVector) {
  // Flip IV
  const flipped_iv = Buffer.from(initialVector).map(b => ~b);
  
  const cipher = crypto.createCipheriv('aes-128-gcm', aesKey, Buffer.from(flipped_iv));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(response), 'utf-8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  
  return Buffer.concat([encrypted, tag]).toString('base64');
}

module.exports = async (req, res) => {
  console.log('📥 Flow endpoint request', req.method);
  
  try {
    // Handle ping action (can be plain JSON)
    if (req.body && req.body.action === 'ping') {
      console.log('🏥 Health check (ping)');
      return res.status(200).json({ data: { status: 'active' } });
    }
    
    // Validate encrypted request format
    if (!req.body || !req.body.encrypted_aes_key || !req.body.encrypted_flow_data || !req.body.initial_vector) {
      console.log('⚠️  Invalid request format - missing encryption fields');
      return res.status(400).json({ error: 'Invalid request: missing encryption fields' });
    }
    
    // Check private key
    if (!PRIVATE_KEY) {
      console.error('❌ No private key configured');
      return res.status(500).json({ error: 'Encryption not configured' });
    }
    
    const { data: decryptedData, aesKey, iv } = decryptRequest(req.body);
    console.log('🔓 Decrypted:', JSON.stringify(decryptedData, null, 2));
    
    const { action, screen, data } = decryptedData;
    
    // Handle encrypted ping (health check)
    if (action === 'ping') {
      console.log('🏥 Encrypted health check (ping)');
      const response = { data: { status: 'active' } };
      const encrypted = encryptResponse(response, aesKey, iv);
      return res.status(200).send(encrypted);
    }
    
    // Handle final submission
    if (action === 'data_exchange') {
      console.log('✅✅✅ SURVEY SUBMITTED ✅✅✅');
      console.log('DATA:', JSON.stringify(data, null, 2));
      
      // Initialize database on first use
      if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
      }
      
      // Store data
      const surveyData = {
        phone: decryptedData.flow_token || 'unknown',
        responses: data,
        timestamp: new Date().toISOString()
      };
      
      // Store in memory (fallback)
      storage.add(surveyData);
      
      // Store in Postgres (persistent with analytics)
      const dbResult = await saveSurveyResponse(data, decryptedData.flow_token);
      
      // Log prominently
      console.log('========================================');
      console.log('📊 SURVEY DATA SAVED');
      console.log('Phone/Token:', surveyData.phone);
      console.log('Timestamp:', surveyData.timestamp);
      console.log('Database ID:', dbResult.id || 'fallback mode');
      console.log('Responses:', JSON.stringify(data, null, 2));
      console.log('========================================');
      
      const response = {
        screen: 'SUCCESS',
        data: {
          extension_message_response: {
            params: {
              flow_token: decryptedData.flow_token,
              confirmation: 'Merci pour votre retour!',
              ...data
            }
          }
        }
      };
      
      const encrypted = encryptResponse(response, aesKey, iv);
      return res.status(200).send(encrypted);
    }
    
    // Default: return same screen
    const response = {
      screen: screen || 'QUESTION_ONE',
      data: data || {}
    };
    
    const encrypted = encryptResponse(response, aesKey, iv);
    return res.status(200).send(encrypted);
    
  } catch (error) {
    console.error('❌ Flow error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
