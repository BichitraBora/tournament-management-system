import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();
connectDB();

const app = express();

// --- Middlewares ---
// Security headers
app.use(helmet()); 
// Allow cross-origin requests from your frontend
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); 
// Parse incoming JSON payloads 
app.use(express.json({ limit: '5mb' })); 
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
// Request logging
app.use(morgan('dev')); 

// --- Routes ---
// A basic health check route to verify the server is running
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Tournament API is running smoothly.',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);

// Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// --- Server Setup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});