/**
 * Simple in-memory caching middleware
 * Caches GET requests to improve performance
 */

const cache = new Map();

const cacheMiddleware = (duration = 60000) => { // 60 seconds default
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl}`;
    const cachedData = cache.get(key);

    if (cachedData) {
      const age = Date.now() - cachedData.timestamp;
      if (age < duration) {
        res.set('X-Cache', 'HIT');
        return res.json(cachedData.data);
      } else {
        cache.delete(key);
      }
    }

    // Capture original res.json
    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      res.set('X-Cache', 'MISS');
      return originalJson.call(this, data);
    };

    next();
  };
};

const clearCache = (pattern) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

module.exports = { cacheMiddleware, clearCache };
