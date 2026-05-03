// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    // Create the token with the user's ID and our secret key
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });

    // Send the token in an HTTP-only cookie for better security
    // This prevents cross-site scripting (XSS) attacks
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // HTTPS only in production
        sameSite: 'strict', // Prevents cross-site request forgery (CSRF)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
};

export default generateToken;