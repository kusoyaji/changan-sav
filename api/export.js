// Export responses as CSV for Excel with all analytics columns
import { getAllResponses } from './db/postgres.js';

const FIELD_LABELS = {
  // Survey fields
  accueil_courtoisie: 'Accueil et Courtoisie',
  accueil_courtoisie_raison: 'Raison (Accueil)',
  delais_respectes: 'Délais Respectés',
  qualite_service: 'Qualité du Service',
  qualite_service_raison: 'Raison (Qualité)',
  note_recommandation: 'Note de Recommandation (0-10)',
  remarques: 'Remarques',
  recontact: 'Souhaite être Recontacté',
  
  // Analytics fields
  satisfaction_score: 'Score de Satisfaction (%)',
  sentiment: 'Sentiment Global',
  is_promoter: 'Promoteur (NPS)',
  is_detractor: 'Détracteur (NPS)',
  needs_followup: 'Nécessite Suivi',
  
  // Time analytics
  submission_date: 'Date',
  submission_hour: 'Heure de Soumission',
  day_of_week: 'Jour de la Semaine',
  week_number: 'Numéro de Semaine',
  month: 'Mois',
  year: 'Année'
};

const VALUE_LABELS = {
  'tres_satisfaisant': 'Très Satisfaisant',
  'satisfaisant': 'Satisfaisant',
  'peu_satisfaisant': 'Peu Satisfaisant',
  'pas_du_tout_satisfaisant': 'Pas du Tout Satisfaisant',
  'oui': 'Oui',
  'non': 'Non',
  'positive': 'Positif',
  'neutral': 'Neutre',
  'negative': 'Négatif'
};

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

function formatValue(value, fieldName) {
  if (value === null || value === undefined) return '';
  
  // Boolean fields
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }
  
  // Day of week
  if (fieldName === 'day_of_week') {
    return DAY_NAMES[value] || value;
  }
  
  // Satisfaction score (convert to percentage)
  if (fieldName === 'satisfaction_score') {
    return Math.round(value * 100) + '%';
  }
  
  // String values
  return VALUE_LABELS[value] || value;
}

function convertToCSV(responses) {
  // Header row with all fields
  const headers = [
    'ID',
    'Date et Heure',
    'Token/Téléphone',
    
    // Survey responses
    'Accueil et Courtoisie',
    'Raison (Accueil)',
    'Délais Respectés',
    'Qualité du Service',
    'Raison (Qualité)',
    'Note Recommandation (0-10)',
    'Remarques',
    'Recontact',
    
    // Analytics
    'Score Satisfaction (%)',
    'Sentiment',
    'Promoteur NPS',
    'Détracteur NPS',
    'Nécessite Suivi',
    
    // Time data
    'Date',
    'Heure',
    'Jour Semaine',
    'Semaine N°',
    'Mois',
    'Année'
  ];
  
  // Data rows
  const rows = responses.map(r => {
    const date = new Date(r.submission_timestamp);
    const dateStr = date.toLocaleDateString('fr-FR');
    const timeStr = date.toLocaleTimeString('fr-FR');
    const dateTimeStr = `${dateStr} ${timeStr}`;
    
    return [
      r.id,
      dateTimeStr,
      r.flow_token || r.phone_number || 'Anonyme',
      
      // Survey fields
      formatValue(r.accueil_courtoisie, 'accueil_courtoisie'),
      r.accueil_courtoisie_raison || '',
      formatValue(r.delais_respectes, 'delais_respectes'),
      formatValue(r.qualite_service, 'qualite_service'),
      r.qualite_service_raison || '',
      r.note_recommandation || '',
      r.remarques || '',
      formatValue(r.recontact, 'recontact'),
      
      // Analytics
      formatValue(r.satisfaction_score, 'satisfaction_score'),
      formatValue(r.sentiment, 'sentiment'),
      formatValue(r.is_promoter),
      formatValue(r.is_detractor),
      formatValue(r.needs_followup),
      
      // Time fields
      r.submission_date || '',
      r.submission_hour !== null ? r.submission_hour + 'h' : '',
      formatValue(r.day_of_week, 'day_of_week'),
      r.week_number || '',
      r.month || '',
      r.year || ''
    ];
  });
  
  // Convert to CSV
  const csvRows = [headers, ...rows].map(row => 
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',')
  );
  
  return csvRows.join('\r\n');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const responses = await getAllResponses();
    
    // Return as CSV
    const csv = convertToCSV(responses);
    const filename = `changan-sav-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Add BOM for Excel UTF-8 support
    return res.status(200).send('\uFEFF' + csv);
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Failed to export data' });
  }
}
