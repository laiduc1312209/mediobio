import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminMiddleware';
import {
    getStats,
    getAllUsers,
    getAllProfiles,
    deleteUser,
    deleteProfile,
    generateKeys,
    getKeys,
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication + admin check
router.use(authMiddleware);
router.use(requireAdmin);

// Dashboard
router.get('/stats', getStats);

// Users management
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);

// Profiles management
router.get('/profiles', getAllProfiles);
router.delete('/profiles/:profileId', deleteProfile);

// Keys management
router.post('/keys/generate', generateKeys);
router.get('/keys', getKeys);

export default router;
