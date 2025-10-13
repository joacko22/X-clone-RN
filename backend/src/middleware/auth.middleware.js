export const protectRoute = (req, res, next) => {
    // Middleware logic to protect routes
    // For example, check if user is authenticated
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}