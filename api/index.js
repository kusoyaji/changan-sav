// Changan SAV Health Check Endpoint
module.exports = (req, res) => {
  res.status(200).json({
    status: 'active',
    service: 'Changan SAV Survey Webhook',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
