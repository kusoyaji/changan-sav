-- Changan SAV Survey Responses Database Schema
-- This table stores all survey responses with analytics-ready columns

CREATE TABLE IF NOT EXISTS survey_responses (
    -- Primary key
    id SERIAL PRIMARY KEY,
    
    -- Timestamps
    submission_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- WhatsApp metadata
    flow_token VARCHAR(255),
    phone_number VARCHAR(50),
    
    -- Survey responses (original fields)
    accueil_courtoisie VARCHAR(50),
    accueil_courtoisie_raison TEXT,
    delais_respectes VARCHAR(10),
    qualite_service VARCHAR(50),
    qualite_service_raison TEXT,
    note_recommandation INTEGER CHECK (note_recommandation >= 0 AND note_recommandation <= 10),
    remarques TEXT,
    recontact VARCHAR(10),
    
    -- Analytics columns (auto-calculated)
    satisfaction_score DECIMAL(3,2),  -- Overall satisfaction (0.00 to 1.00)
    is_promoter BOOLEAN,               -- NPS: true if note >= 9
    is_detractor BOOLEAN,              -- NPS: true if note <= 6
    needs_followup BOOLEAN,            -- true if recontact=oui OR negative feedback
    sentiment VARCHAR(20),             -- 'positive', 'neutral', 'negative'
    
    -- Time-based analytics
    submission_date DATE,
    submission_hour INTEGER,
    day_of_week INTEGER,
    week_number INTEGER,
    month INTEGER,
    year INTEGER,
    
    -- Additional metadata
    raw_data JSONB,                    -- Full original payload for backup
    response_time_seconds INTEGER      -- Time to complete (if available)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_submission_date ON survey_responses(submission_date);
CREATE INDEX IF NOT EXISTS idx_satisfaction_score ON survey_responses(satisfaction_score);
CREATE INDEX IF NOT EXISTS idx_needs_followup ON survey_responses(needs_followup);
CREATE INDEX IF NOT EXISTS idx_created_at ON survey_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_month_year ON survey_responses(year, month);

-- Comments for documentation
COMMENT ON TABLE survey_responses IS 'Stores all Changan SAV satisfaction survey responses from WhatsApp Flow';
COMMENT ON COLUMN survey_responses.satisfaction_score IS 'Calculated average satisfaction from multiple rating fields (0.00-1.00)';
COMMENT ON COLUMN survey_responses.is_promoter IS 'NPS category: customers who rated 9-10 for recommendation';
COMMENT ON COLUMN survey_responses.is_detractor IS 'NPS category: customers who rated 0-6 for recommendation';
COMMENT ON COLUMN survey_responses.needs_followup IS 'Flagged for follow-up if requested recontact or gave negative feedback';
COMMENT ON COLUMN survey_responses.sentiment IS 'Overall sentiment: positive, neutral, or negative';
