import { Redis } from '@upstash/redis';

// Initialize Redis client with environment variables
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null;

const RESPONSES_KEY = 'survey:responses';
const STATS_KEY = 'survey:stats';

/**
 * Add a survey response to KV storage
 */
export async function addResponse(data) {
  if (!redis) {
    console.log('⚠️  KV not configured, using in-memory storage');
    return null;
  }

  try {
    const response = {
      id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      data
    };

    // Add to list
    await redis.lpush(RESPONSES_KEY, JSON.stringify(response));
    
    // Update stats
    await redis.incr(`${STATS_KEY}:total`);
    await redis.set(`${STATS_KEY}:last`, JSON.stringify(response));

    console.log(`✅ Stored in KV: ${response.id}`);
    return response;
  } catch (error) {
    console.error('❌ KV storage error:', error);
    return null;
  }
}

/**
 * Get recent responses (limited count)
 */
export async function getResponses(limit = 50) {
  if (!redis) {
    console.log('⚠️  KV not configured');
    return [];
  }

  try {
    const responses = await redis.lrange(RESPONSES_KEY, 0, limit - 1);
    return responses.map(r => JSON.parse(r));
  } catch (error) {
    console.error('❌ KV fetch error:', error);
    return [];
  }
}

/**
 * Get statistics
 */
export async function getStats() {
  if (!redis) {
    return {
      total: 0,
      today: 0,
      lastResponse: null
    };
  }

  try {
    const total = await redis.get(`${STATS_KEY}:total`) || 0;
    const lastResponseStr = await redis.get(`${STATS_KEY}:last`);
    const lastResponse = lastResponseStr ? JSON.parse(lastResponseStr) : null;

    // Calculate today's count
    const responses = await getResponses(100);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const today = responses.filter(r => 
      new Date(r.timestamp) >= todayStart
    ).length;

    return {
      total: parseInt(total, 10),
      today,
      lastResponse
    };
  } catch (error) {
    console.error('❌ KV stats error:', error);
    return {
      total: 0,
      today: 0,
      lastResponse: null
    };
  }
}

/**
 * Get all responses for export
 */
export async function getAllResponses() {
  if (!redis) {
    return [];
  }

  try {
    // Get total count first
    const total = await redis.get(`${STATS_KEY}:total`) || 0;
    // Fetch all responses
    const responses = await redis.lrange(RESPONSES_KEY, 0, parseInt(total, 10));
    return responses.map(r => JSON.parse(r));
  } catch (error) {
    console.error('❌ KV fetch all error:', error);
    return [];
  }
}
