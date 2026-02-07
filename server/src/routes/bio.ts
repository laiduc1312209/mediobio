import { Router } from 'express';
import { getBioByUsername, verifyPinAndGetBio } from '../controllers/bioController';
import { pinLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes - no authentication required
router.get('/:username', getBioByUsername);
router.post('/:username/verify-pin', pinLimiter, verifyPinAndGetBio);

export default router;
