const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, continue to the next middleware
    }
    res.status(401).json({ error: "Unauthorized. Please log in." }); // Redirect or send error
};

module.exports = ensureAuth;
