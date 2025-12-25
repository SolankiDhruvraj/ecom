import { protect } from './auth.middleware.js';

// Admin middleware - check if user has admin privileges
// The protect middleware should be called before this in the route chain
export const admin = async (req, res, next) => {
    try {
        // Check if user exists (protect middleware should have already verified the token)
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if user has admin privileges
        // The userType should be available from the JWT token
        if (req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error' });
        }
    }
}; 