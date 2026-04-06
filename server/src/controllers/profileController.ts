import { Response } from 'express';
import bcrypt from 'bcrypt';
import { profileQueries, userQueries } from '../models/queries';
import { encrypt, decrypt } from '../utils/encryption';
import { medicalProfileSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';
import cloudinary from '../config/cloudinary';

// Helper function to encrypt medical data
function encryptMedicalData(data: any): string | null {
    if (!data) return null;
    if (Array.isArray(data)) {
        return data.length > 0 ? encrypt(JSON.stringify(data)) : null;
    }
    return data ? encrypt(data.toString()) : null;
}

// Helper function to decrypt medical data
function decryptMedicalData(encryptedData: string | null): any {
    if (!encryptedData) return null;
    try {
        const decrypted = decrypt(encryptedData);
        // Try to parse as JSON (for arrays)
        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    } catch {
        return null;
    }
}

// Create medical profile
export async function createProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        // Check if profile already exists
        const existingProfile = await profileQueries.findProfileByUserId(userId);
        if (existingProfile) {
            res.status(409).json({ error: 'Profile already exists. Use update endpoint instead.' });
            return;
        }

        const validatedData = medicalProfileSchema.parse(req.body);

        // Encrypt sensitive medical data
        const bloodTypeEncrypted = encryptMedicalData(validatedData.bloodType);
        const medicalConditionsEncrypted = encryptMedicalData(validatedData.medicalConditions);
        const allergiesEncrypted = encryptMedicalData(validatedData.allergies);
        const currentMedicationsEncrypted = encryptMedicalData(validatedData.currentMedications);
        const medicalHistoryEncrypted = encryptMedicalData(validatedData.medicalHistory);
        // Use doctorNotes field to store firstAidInstructions (if provided) or doctorNotes
        const doctorNotesEncrypted = encryptMedicalData(validatedData.firstAidInstructions || validatedData.doctorNotes);

        // Hash PIN if provided
        let pinHash = null;
        if (validatedData.privacyLevel === 'pin_protected' && validatedData.pin) {
            pinHash = await bcrypt.hash(validatedData.pin, 10);
        }

        // Create profile
        const profile = await profileQueries.createProfile({
            userId,
            fullName: validatedData.fullName,
            dateOfBirth: validatedData.dateOfBirth,
            avatarUrl: validatedData.avatarUrl,
            bloodTypeEncrypted,
            medicalConditionsEncrypted,
            allergiesEncrypted,
            currentMedicationsEncrypted,
            medicalHistoryEncrypted,
            doctorNotesEncrypted,
            personalMessage: validatedData.personalMessage || null,
            privacyLevel: validatedData.privacyLevel,
            pinHash,
        });

        // Get user info for bio URL
        const user = await userQueries.findUserById(userId);

        res.status(201).json({
            message: 'Medical profile created successfully',
            profile: {
                id: profile.id,
                fullName: profile.full_name,
                bioUrl: `${process.env.FRONTEND_URL}/bio/${user?.bio_slug}`,
                privacyLevel: profile.privacy_level,
            },
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Create profile error:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
}

// Get own medical profile
export async function getOwnProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const profile = await profileQueries.findProfileByUserId(userId);
        if (!profile) {
            res.status(404).json({ error: 'Profile not found. Please create one first.' });
            return;
        }

        // Get user for bioSlug
        const user = await userQueries.findUserById(userId);

        // Decrypt medical data
        const decryptedProfile = {
            id: profile.id,
            fullName: profile.full_name,
            dateOfBirth: profile.date_of_birth,
            avatarUrl: profile.avatar_url,
            bloodType: decryptMedicalData(profile.blood_type_encrypted),
            medicalConditions: decryptMedicalData(profile.medical_conditions_encrypted) || [],
            allergies: decryptMedicalData(profile.allergies_encrypted) || [],
            currentMedications: decryptMedicalData(profile.current_medications_encrypted) || [],
            medicalHistory: decryptMedicalData(profile.medical_history_encrypted),
            doctorNotes: decryptMedicalData(profile.doctor_notes_encrypted),
            personalMessage: profile.personal_message || '',
            privacyLevel: profile.privacy_level,
            hasPinProtection: !!profile.pin_hash,
            bioSlug: user?.bio_slug,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at,
        };

        res.json({ profile: decryptedProfile });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
}

// Update medical profile
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const existingProfile = await profileQueries.findProfileByUserId(userId);
        if (!existingProfile) {
            res.status(404).json({ error: 'Profile not found. Please create one first.' });
            return;
        }

        const validatedData = medicalProfileSchema.partial().parse(req.body);

        const updateData: any = {};

        if (validatedData.fullName) updateData.fullName = validatedData.fullName;
        if (validatedData.dateOfBirth) updateData.dateOfBirth = validatedData.dateOfBirth;
        if (validatedData.bloodType !== undefined) {
            updateData.bloodTypeEncrypted = encryptMedicalData(validatedData.bloodType);
        }
        if (validatedData.medicalConditions !== undefined) {
            updateData.medicalConditionsEncrypted = encryptMedicalData(validatedData.medicalConditions);
        }
        if (validatedData.allergies !== undefined) {
            updateData.allergiesEncrypted = encryptMedicalData(validatedData.allergies);
        }
        if (validatedData.currentMedications !== undefined) {
            updateData.currentMedicationsEncrypted = encryptMedicalData(validatedData.currentMedications);
        }
        if (validatedData.medicalHistory !== undefined) {
            updateData.medicalHistoryEncrypted = encryptMedicalData(validatedData.medicalHistory);
        }
        // Use doctorNotes field to store firstAidInstructions (if provided) or doctorNotes
        if (validatedData.firstAidInstructions !== undefined) {
            updateData.doctorNotesEncrypted = encryptMedicalData(validatedData.firstAidInstructions);
        } else if (validatedData.doctorNotes !== undefined) {
            updateData.doctorNotesEncrypted = encryptMedicalData(validatedData.doctorNotes);
        }
        if (validatedData.privacyLevel) {
            updateData.privacyLevel = validatedData.privacyLevel;
        }
        if (validatedData.pin) {
            updateData.pinHash = await bcrypt.hash(validatedData.pin, 10);
        }
        if (validatedData.personalMessage !== undefined) {
            updateData.personalMessage = validatedData.personalMessage;
        }

        const updatedProfile = await profileQueries.updateProfile(userId, updateData);

        res.json({
            message: 'Profile updated successfully',
            profile: {
                id: updatedProfile.id,
                fullName: updatedProfile.full_name,
                privacyLevel: updatedProfile.privacy_level,
                updatedAt: updatedProfile.updated_at,
            },
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
}

// Delete medical profile
export async function deleteProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        await profileQueries.deleteProfile(userId);

        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({ error: 'Failed to delete profile' });
    }
}

// Upload avatar
export async function uploadAvatar(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'medibio/avatars',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file!.buffer);
        });

        // Update profile with avatar URL
        await profileQueries.updateProfile(userId, {
            avatarUrl: result.secure_url,
        });

        res.json({
            message: 'Avatar uploaded successfully',
            avatarUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
}
