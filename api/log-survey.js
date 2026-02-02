// Log endpoint to save survey data to console and return it
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body;
    console.log('📊 SURVEY DATA RECEIVED:', JSON.stringify(data, null, 2));
    return res.status(200).json({ saved: true, timestamp: new Date().toISOString() });
  }
  
  res.status(200).json({ message: 'Survey logger endpoint' });
};
