import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { seedAdmin } from './utils/seedAdmin.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { errorHandler, notFoundHandler, sanitizeInput, securityHeadersMiddleware } from './middleware/errorHandler.js';

// Hlaða inn env breytum
dotenv.config();

// Búa til Express app
const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityHeadersMiddleware);
app.use(sanitizeInput);

// CORS uppsetning
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Skilgreina __filename og __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Búa til möppu fyrir myndaupphleðslu ef hún er ekki til
const uploadsDir = join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// 404 meðhöndlun fyrir óskilgreind routes
app.use(notFoundHandler);

// Víðvær villumelding
app.use(errorHandler);
  
// Grunnstilla admin notanda þegar netþjónn er keyrður
seedAdmin().catch(err => {
    console.error('Ekki gekk að seeda admin notanda:', err);
});

export default app;