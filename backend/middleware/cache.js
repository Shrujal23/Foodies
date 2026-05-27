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

    const key = `${req.originalUrl}${req.user ? `|user: ${req.user.id}` : ''}`;
    const cachedData = cache.get(key);

    if (cachedData) {
      const age = Date.now() - cachedData.timestamp;
      if (age < duration) {
        res.set('X-Cache', 'HIT');
        return res.json(cachedData.data);
      } else {
        cache.delete(key); //Expired
      }
    }

    // Override res.json only once
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      if(cache.size >= MAX_CACHE_SIZE) {
        cache.delete(cache.keys().next().value); 
      }
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
};

const clearCache = (pattern = null) => {
  if (!pattern) {
    cache.clear();
    return;
  } 
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
}; 

module.exports = { cacheMiddleware, clearCache };
