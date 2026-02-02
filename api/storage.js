// Simple in-memory storage for survey responses
// In production, replace with a database like Upstash Redis

const responses = [];

module.exports = {
  add: (data) => {
    const response = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data
    };
    responses.unshift(response); // Add to beginning
    // Keep only last 100 responses in memory
    if (responses.length > 100) responses.pop();
    return response;
  },
  
  getAll: () => responses,
  
  getRecent: (limit = 20) => responses.slice(0, limit),
  
  count: () => responses.length
};
