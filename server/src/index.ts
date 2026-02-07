import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import bioRoutes from './routes/bio';
import contactsRoutes from './routes/contacts';
import adminRoutes from './routes/admin';

// Admin setup
import bcrypt from 'bcrypt';
import { adminQueries } from './models/queries';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - Required for Render/production deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Medical Bio API is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/bio', bioRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Create default admin account on startup
async function initializeAdmin() {
    try {
        const adminEmail = 'admin@medibio.local';
        const adminUsername = 'admin1312';
        const adminPassword = 'admin2009';
        const adminBioSlug = 'admin-1312';

        const passwordHash = await bcrypt.hash(adminPassword, 12);
        await adminQueries.createOrUpdateAdmin(adminEmail, passwordHash, adminUsername, adminBioSlug);
        console.log('✅ Admin account ready (admin1312)');
    } catch (error) {
        console.error('Failed to initialize admin:', error);
    }
}

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}`);
    console.log(`🏥 Medical Bio API ready for requests`);
    await initializeAdmin();
});

export default app;
