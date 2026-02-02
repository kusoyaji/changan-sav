module.exports = (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Test endpoint working!' });
};
