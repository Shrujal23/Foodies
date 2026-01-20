/**
 * Request logging middleware
 * Logs all incoming requests with timing and response status
 */

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capture the original res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || null,
      query: req.query,
      ...(res.statusCode >= 400 && { responseData: data })
    };

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify(logEntry));
    }

    // Log to file in production
    if (process.env.NODE_ENV === 'production') {
      const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) console.error('Failed to write log:', err);
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLogger;
