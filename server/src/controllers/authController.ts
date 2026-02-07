import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userQueries, keyQueries } from '../models/queries';
import { generateToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../utils/validation';

// Helper function to generate bio slug from username
function generateBioSlug(username: string): string {
    return username.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
}



// Register new user
export async function register(req: Request, res: Response): Promise<void> {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { email, password, username } = validatedData;
        const invitationKey = req.body.invitationKey; // Expect invitationKey in body

        // 1. Validate Invitation Key
        if (!invitationKey) {
            res.status(400).json({ error: 'Invitation key is required' });
            return;
        }

        const key = await keyQueries.getKey(invitationKey);
        if (!key) {
            res.status(400).json({ error: 'Invalid invitation key' });
            return;
        }

        if (key.is_used) {
            res.status(400).json({ error: 'Invitation key has already been used' });
            return;
        }

        // Check if email already exists
        const existingEmail = await userQueries.findUserByEmail(email);
        if (existingEmail) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }

        // Check if username already exists
        const existingUsername = await userQueries.findUserByUsername(username);
        if (existingUsername) {
            res.status(409).json({ error: 'Username already taken' });
            return;
        }

        // Generate bio slug
        const bioSlug = generateBioSlug(username);
        const existingSlug = await userQueries.findUserByBioSlug(bioSlug);
        if (existingSlug) {
            res.status(409).json({ error: 'Bio URL already exists. Please choose a different username.' });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await userQueries.createUser(email, passwordHash, username, bioSlug);

        // Mark key as used
        await keyQueries.markKeyAsUsed(invitationKey, user.id);

        // Generate JWT token
        const token = generateToken({ userId: user.id, email: user.email });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                bioSlug: user.bio_slug,
                bioUrl: `${process.env.FRONTEND_URL}/bio/${user.bio_slug}`,
            },
            token,
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
}

// Login user
export async function login(req: Request, res: Response): Promise<void> {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        // Find user by email
        const user = await userQueries.findUserByEmail(email);
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Update last login
        await userQueries.updateLastLogin(user.id);

        // Generate JWT token
        const token = generateToken({ userId: user.id, email: user.email });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                bioSlug: user.bio_slug,
                bioUrl: `${process.env.FRONTEND_URL}/bio/${user.bio_slug}`,
            },
            token,
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
}

// Get current user info
export async function getCurrentUser(req: any, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const user = await userQueries.findUserById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                bioSlug: user.bio_slug,
                bioUrl: `${process.env.FRONTEND_URL}/bio/${user.bio_slug}`,
                createdAt: user.created_at,
                lastLogin: user.last_login,
            },
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
}

// Logout (client-side token removal, but we can add to blacklist in future)
export async function logout(req: Request, res: Response): Promise<void> {
    res.json({ message: 'Logout successful. Please remove token from client.' });
}
