// Database connection and query utilities for Neon Postgres
import { neon } from '@neondatabase/serverless';

// Initialize Neon client with connection string from environment
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

/**
 * Calculate satisfaction score from survey responses
 * Returns 0.00 to 1.00 based on ratings
 */
function calculateSatisfactionScore(data) {
  const ratings = [];
  
  // Map ratings to scores
  const ratingMap = {
    'tres_satisfaisant': 1.0,
    'satisfaisant': 0.75,
    'peu_satisfaisant': 0.25,
    'pas_du_tout_satisfaisant': 0.0
  };
  
  if (data.accueil_courtoisie) {
    ratings.push(ratingMap[data.accueil_courtoisie] || 0.5);
  }
  if (data.qualite_service) {
    ratings.push(ratingMap[data.qualite_service] || 0.5);
  }
  if (data.delais_respectes) {
    ratings.push(data.delais_respectes === 'oui' ? 1.0 : 0.0);
  }
  if (data.note_recommandation !== undefined) {
    ratings.push(parseInt(data.note_recommandation) / 10);
  }
  
  if (ratings.length === 0) return 0.5;
  
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  return Math.round(avg * 100) / 100; // Round to 2 decimals
}

/**
 * Determine if customer needs follow-up
 */
function needsFollowup(data) {
  // Requested recontact
  if (data.recontact === 'oui') return true;
  
  // Negative ratings
  if (data.accueil_courtoisie === 'pas_du_tout_satisfaisant') return true;
  if (data.qualite_service === 'pas_du_tout_satisfaisant') return true;
  if (data.delais_respectes === 'non') return true;
  
  // Low recommendation score
  const note = parseInt(data.note_recommandation);
  if (!isNaN(note) && note <= 6) return true;
  
  return false;
}

/**
 * Calculate sentiment from responses
 */
function calculateSentiment(data) {
  const score = calculateSatisfactionScore(data);
  
  if (score >= 0.75) return 'positive';
  if (score >= 0.40) return 'neutral';
  return 'negative';
}

/**
 * Initialize database table (runs on first deployment)
 */
export async function initializeDatabase() {
  if (!sql) {
    console.log('⚠️  Database not configured - set DATABASE_URL environment variable');
    return false;
  }
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id SERIAL PRIMARY KEY,
        submission_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        flow_token VARCHAR(255),
        phone_number VARCHAR(50),
        accueil_courtoisie VARCHAR(50),
        accueil_courtoisie_raison TEXT,
        delais_respectes VARCHAR(10),
        qualite_service VARCHAR(50),
        qualite_service_raison TEXT,
        note_recommandation INTEGER CHECK (note_recommandation >= 0 AND note_recommandation <= 10),
        remarques TEXT,
        recontact VARCHAR(10),
        satisfaction_score DECIMAL(3,2),
        is_promoter BOOLEAN,
        is_detractor BOOLEAN,
        needs_followup BOOLEAN,
        sentiment VARCHAR(20),
        submission_date DATE,
        submission_hour INTEGER,
        day_of_week INTEGER,
        week_number INTEGER,
        month INTEGER,
        year INTEGER,
        raw_data JSONB,
        response_time_seconds INTEGER
      );
    `;
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_submission_date ON survey_responses(submission_date);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_satisfaction_score ON survey_responses(satisfaction_score);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_needs_followup ON survey_responses(needs_followup);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_created_at ON survey_responses(created_at DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_month_year ON survey_responses(year, month);`;
    
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return false;
  }
}

/**
 * Save survey response to database
 */
export async function saveSurveyResponse(data, flowToken = null) {
  if (!sql) {
    console.log('⚠️  Database not configured');
    return { success: false, error: 'Database not configured' };
  }
  
  try {
    const timestamp = new Date();
    const note = parseInt(data.note_recommandation) || 0;
    
    // Calculate analytics
    const satisfactionScore = calculateSatisfactionScore(data);
    const isPromoter = note >= 9;
    const isDetractor = note <= 6;
    const needsFollowupFlag = needsFollowup(data);
    const sentiment = calculateSentiment(data);
    
    // Extract time-based fields
    const submissionDate = timestamp.toISOString().split('T')[0];
    const submissionHour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    const weekNumber = getWeekNumber(timestamp);
    const month = timestamp.getMonth() + 1;
    const year = timestamp.getFullYear();
    
    const result = await sql`
      INSERT INTO survey_responses (
        submission_timestamp,
        flow_token,
        accueil_courtoisie,
        accueil_courtoisie_raison,
        delais_respectes,
        qualite_service,
        qualite_service_raison,
        note_recommandation,
        remarques,
        recontact,
        satisfaction_score,
        is_promoter,
        is_detractor,
        needs_followup,
        sentiment,
        submission_date,
        submission_hour,
        day_of_week,
        week_number,
        month,
        year,
        raw_data
      ) VALUES (
        ${timestamp.toISOString()},
        ${flowToken},
        ${data.accueil_courtoisie || null},
        ${data.accueil_courtoisie_raison || null},
        ${data.delais_respectes || null},
        ${data.qualite_service || null},
        ${data.qualite_service_raison || null},
        ${note},
        ${data.remarques || null},
        ${data.recontact || null},
        ${satisfactionScore},
        ${isPromoter},
        ${isDetractor},
        ${needsFollowupFlag},
        ${sentiment},
        ${submissionDate},
        ${submissionHour},
        ${dayOfWeek},
        ${weekNumber},
        ${month},
        ${year},
        ${JSON.stringify(data)}
      )
      RETURNING id;
    `;
    
    const responseId = result[0]?.id;
    console.log(`✅ Saved to database: ID ${responseId}, Satisfaction: ${satisfactionScore}, Sentiment: ${sentiment}`);
    
    return { success: true, id: responseId };
  } catch (error) {
    console.error('❌ Database save error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get recent survey responses
 */
export async function getRecentResponses(limit = 50) {
  if (!sql) {
    console.log('⚠️  Database not configured');
    return [];
  }
  
  try {
    const result = await sql`
      SELECT 
        id,
        submission_timestamp,
        flow_token,
        accueil_courtoisie,
        accueil_courtoisie_raison,
        delais_respectes,
        qualite_service,
        qualite_service_raison,
        note_recommandation,
        remarques,
        recontact,
        satisfaction_score,
        is_promoter,
        is_detractor,
        needs_followup,
        sentiment,
        submission_date
      FROM survey_responses
      ORDER BY created_at DESC
      LIMIT ${limit};
    `;
    
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    return [];
  }
}

/**
 * Get all responses for export
 */
export async function getAllResponses() {
  if (!sql) {
    console.log('⚠️  Database not configured');
    return [];
  }
  
  try {
    const result = await sql`
      SELECT *
      FROM survey_responses
      ORDER BY created_at DESC;
    `;
    
    return result;
  } catch (error) {
    console.error('❌ Database export error:', error);
    return [];
  }
}

/**
 * Get statistics
 */
export async function getStats() {
  if (!sql) {
    return {
      total: 0,
      today: 0,
      lastResponse: null,
      npsScore: 0,
      avgSatisfaction: 0,
      needsFollowup: 0
    };
  }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalResult = await sql`SELECT COUNT(*) as count FROM survey_responses;`;
    const todayResult = await sql`SELECT COUNT(*) as count FROM survey_responses WHERE submission_date = ${today};`;
    const lastResult = await sql`SELECT submission_timestamp FROM survey_responses ORDER BY created_at DESC LIMIT 1;`;
    const npsResult = await sql`
      SELECT 
        SUM(CASE WHEN is_promoter THEN 1 ELSE 0 END) as promoters,
        SUM(CASE WHEN is_detractor THEN 1 ELSE 0 END) as detractors,
        COUNT(*) as total,
        AVG(satisfaction_score) as avg_satisfaction
      FROM survey_responses;
    `;
    const followupResult = await sql`SELECT COUNT(*) as count FROM survey_responses WHERE needs_followup = true;`;
    
    const total = parseInt(totalResult[0]?.count || 0);
    const today_count = parseInt(todayResult[0]?.count || 0);
    const lastResponse = lastResult[0]?.submission_timestamp;
    
    const nps = npsResult[0];
    const promoters = parseInt(nps?.promoters || 0);
    const detractors = parseInt(nps?.detractors || 0);
    const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
    const avgSatisfaction = parseFloat(nps?.avg_satisfaction || 0);
    
    const needsFollowup = parseInt(followupResult[0]?.count || 0);
    
    return {
      total,
      today: today_count,
      lastResponse,
      npsScore,
      avgSatisfaction: Math.round(avgSatisfaction * 100),
      needsFollowup
    };
  } catch (error) {
    console.error('❌ Stats query error:', error);
    return {
      total: 0,
      today: 0,
      lastResponse: null,
      npsScore: 0,
      avgSatisfaction: 0,
      needsFollowup: 0
    };
  }
}

/**
 * Helper: Get ISO week number
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
