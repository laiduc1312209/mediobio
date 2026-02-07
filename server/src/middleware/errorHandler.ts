import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', err);

    // Zod validation errors
    if (err.name === 'ZodError') {
        res.status(400).json({
            error: 'Validation error',
            details: err.errors,
        });
        return;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        res.status(401).json({
            error: 'Invalid or expired token',
        });
        return;
    }

    // Database errors
    if (err.code === '23505') { // Unique constraint violation
        res.status(409).json({
            error: 'Resource already exists',
            detail: err.detail,
        });
        return;
    }

    // Default error
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
}
