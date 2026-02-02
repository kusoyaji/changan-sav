// API endpoint to get survey responses from Postgres
import { getRecentResponses, getStats } from './db/postgres.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const responses = await getRecentResponses(50);
    const stats = await getStats();
    
    res.status(200).json({ 
      stats, 
      responses: responses.map(r => ({
        id: r.id,
        timestamp: r.submission_timestamp,
        phone: r.flow_token,
        responses: {
          accueil_courtoisie: r.accueil_courtoisie,
          accueil_courtoisie_raison: r.accueil_courtoisie_raison,
          delais_respectes: r.delais_respectes,
          qualite_service: r.qualite_service,
          qualite_service_raison: r.qualite_service_raison,
          note_recommandation: r.note_recommandation,
          remarques: r.remarques,
          recontact: r.recontact
        },
        analytics: {
          satisfaction_score: r.satisfaction_score,
          sentiment: r.sentiment,
          is_promoter: r.is_promoter,
          is_detractor: r.is_detractor,
          needs_followup: r.needs_followup
        }
      }))
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};
