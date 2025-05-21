const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default TTL

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        // Skip caching for non-GET requests or if user is logged in
        if (req.method !== 'GET' || req.user) {
            return next();
        }

        const key = req.originalUrl;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            return res.send(cachedResponse);
        }

        // Store original send
        res.originalSend = res.send;
        res.send = function(body) {
            // Only cache successful responses
            if (res.statusCode === 200) {
                cache.set(key, body, duration);
            }
            res.originalSend(body);
        };
        next();
    };
};

module.exports = {
    cache,
    cacheMiddleware
};
