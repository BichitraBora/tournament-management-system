// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Protect routes - Verifies the JWT token
export const protect = async (req, res, next) => {
    let token;

    // We stored the token in an HTTP-only cookie named 'jwt'
    token = req.cookies.jwt;

    if (token) {
        try {
            // Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user in the database, but DON'T return the password
            req.user = await User.findById(decoded.userId).select('-password');

            next(); // Move on to the next piece of middleware or the controller
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 2. Role Authorization - Checks if the user is an Organizer
export const organizerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Organizer') {
        next(); // They are an organizer, let them pass
    } else {
        res.status(403).json({ message: 'Not authorized as an Organizer' });
    }
};