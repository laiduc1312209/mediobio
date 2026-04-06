import { z } from 'zod';

// User registration validation
export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be less than 50 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
});

// User login validation
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// Medical profile validation
export const medicalProfileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
    medicalConditions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    currentMedications: z.array(z.string()).optional(),
    medicalHistory: z.string().optional(),
    doctorNotes: z.string().optional(),
    firstAidInstructions: z.string().optional(),
    personalMessage: z.string().optional(),
    privacyLevel: z.enum(['public', 'link_only', 'pin_protected']).default('link_only'),
    pin: z.string().length(4, 'PIN must be 4 digits').regex(/^\d+$/, 'PIN must contain only numbers').optional(),
});

// Emergency contact validation
export const emergencyContactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    relationship: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    priority: z.number().int().min(1).default(1),
});

// PIN verification validation
export const pinVerificationSchema = z.object({
    pin: z.string().length(4, 'PIN must be 4 digits'),
});
