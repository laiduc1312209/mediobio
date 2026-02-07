import { Router } from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logout);

export default router;
