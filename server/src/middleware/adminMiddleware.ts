import { Request, Response, NextFunction } from 'express';
import { userQueries } from '../models/queries';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const user = await userQueries.findUserById(userId);

        if (!user || !user.is_admin) {
            res.status(403).json({ error: 'Access denied. Admin privileges required.' });
            return;
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
