import { Request, Response } from 'express';
import { adminQueries, keyQueries } from '../models/queries';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

// Get admin dashboard statistics
export async function getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
        const stats = await adminQueries.getStats();
        res.json({ stats });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
}

// Get all users with pagination
export async function getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const { users, total } = await adminQueries.getAllUsers(limit, offset);
        res.json({ users, total, limit, offset });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
}

// Get all profiles with pagination
export async function getAllProfiles(req: AuthRequest, res: Response): Promise<void> {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const { profiles, total } = await adminQueries.getAllProfiles(limit, offset);
        res.json({ profiles, total, limit, offset });
    } catch (error) {
        console.error('Get all profiles error:', error);
        res.status(500).json({ error: 'Failed to get profiles' });
    }
}

// Delete a user
export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { userId } = req.params;

        // Prevent self-deletion
        if (userId === req.user?.userId) {
            res.status(400).json({ error: 'Cannot delete your own account' });
            return;
        }

        await adminQueries.deleteUserById(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

// Delete a profile
export async function deleteProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { profileId } = req.params;
        await adminQueries.deleteProfileById(profileId);
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({ error: 'Failed to delete profile' });
    }
}

// Generate invitation keys
export async function generateKeys(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { amount } = req.body;
        const count = parseInt(amount) || 1;
        const adminId = req.user?.userId;

        if (!adminId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const keys: string[] = [];
        for (let i = 0; i < count; i++) {
            const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
            keys.push(`medi_${randomString}`);
        }

        await keyQueries.createKeys(keys, adminId);
        res.json({ message: `${count} keys generated successfully`, keys });
    } catch (error) {
        console.error('Generate keys error:', error);
        res.status(500).json({ error: 'Failed to generate keys' });
    }
}

// Get all keys
export async function getKeys(req: AuthRequest, res: Response): Promise<void> {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const { keys, total } = await keyQueries.getAllKeys(limit, offset);
        res.json({ keys, total, limit, offset });
    } catch (error) {
        console.error('Get keys error:', error);
        res.status(500).json({ error: 'Failed to get keys' });
    }
}
