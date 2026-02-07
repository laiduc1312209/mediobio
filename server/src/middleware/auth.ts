import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
        // Get token from Authorization header or cookie
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : req.cookies?.token;

        if (!token) {
            res.status(401).json({ error: 'No token provided. Please log in.' });
            return;
        }

        // Verify token
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : req.cookies?.token;

        if (token) {
            const decoded = verifyToken(token);
            req.user = decoded;
        }
        next();
    } catch {
        // Invalid token, but continue without auth
        next();
    }
}
