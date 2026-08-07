/**
 * Request logger — never writes secrets (JWT, passwords, Authorization).
 */

const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const SENSITIVE_KEYS = new Set([
  'token',
  'access_token',
  'refresh_token',
  'password',
  'password_hash',
  'authorization',
  'cookie',
]);

function redact(value, depth = 0) {
  if (depth > 4 || value == null) return value;
  if (typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((v) => redact(v, depth + 1));
  }

  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      out[k] = '[REDACTED]';
    } else if (typeof v === 'object' && v !== null) {
      out[k] = redact(v, depth + 1);
    } else {
      out[k] = v;
    }
  }
  return out;
}

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const originalJson = res.json;

  res.json = function (data) {
    const duration = Date.now() - start;
    const safeData =
      res.statusCode >= 400 ? redact(data) : undefined;

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection?.remoteAddress,
      userId: req.user?.id || null,
      // Never log Authorization or Cookie headers
      query: redact(req.query),
      ...(safeData !== undefined && { responseData: safeData }),
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify(logEntry));
    }

    if (process.env.NODE_ENV === 'production') {
      const logFile = path.join(
        logsDir,
        `${new Date().toISOString().split('T')[0]}.log`
      );
      try {
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
      } catch (err) {
        console.error('Failed to write log:', err.message);
      }
    }

    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLogger;
