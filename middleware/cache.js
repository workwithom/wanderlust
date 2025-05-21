const setCacheHeaders = (req, res, next) => {
    // Cache static assets for 1 week
    if (req.url.match(/\.(css|jpg|jpeg|png|gif|ico|woff2|js)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=604800'); // 1 week
    } else {
        // Set no-cache for dynamic content
        res.setHeader('Cache-Control', 'no-cache, no-store');
    }
    next();
};

module.exports = setCacheHeaders;
