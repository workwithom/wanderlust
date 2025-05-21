const logger = (req, res, next) => {
    // Only log in development environment
    if (process.env.NODE_ENV !== 'production') {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
        });
    }
    next();
};

module.exports = logger;
