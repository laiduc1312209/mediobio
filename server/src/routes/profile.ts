import { Router } from 'express';
import multer from 'multer';
import { createProfile, getOwnProfile, updateProfile, deleteProfile, uploadAvatar } from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// All routes require authentication
router.use(authMiddleware);

// Profile CRUD
router.post('/', createProfile);
router.get('/', getOwnProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

// Avatar upload
router.post('/avatar', upload.single('avatar'), uploadAvatar);

export default router;
