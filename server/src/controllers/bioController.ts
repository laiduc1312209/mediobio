import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userQueries, profileQueries, contactQueries, accessLogQueries } from '../models/queries';
import { decrypt } from '../utils/encryption';
import { pinVerificationSchema } from '../utils/validation';

// Helper function to decrypt medical data
function decryptMedicalData(encryptedData: string | null): any {
    if (!encryptedData) return null;
    try {
        const decrypted = decrypt(encryptedData);
        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    } catch {
        return null;
    }
}

// Get public bio page by username
export async function getBioByUsername(req: Request, res: Response): Promise<void> {
    try {
        const { username } = req.params;

        // Find user
        const user = await userQueries.findUserByBioSlug(username);
        if (!user) {
            res.status(404).json({ error: 'Bio page not found' });
            return;
        }

        // Find medical profile
        const profile = await profileQueries.findProfileByUserId(user.id);
        if (!profile) {
            res.status(404).json({ error: 'Medical profile not found' });
            return;
        }

        // Check privacy level
        if (profile.privacy_level === 'pin_protected') {
            res.status(403).json({
                error: 'PIN required',
                requiresPin: true,
                message: 'This bio page is protected by a PIN',
            });
            return;
        }

        // Get emergency contacts
        const contacts = await contactQueries.findContactsByProfileId(profile.id);

        // Log access
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.get('user-agent') || 'unknown';
        await accessLogQueries.logAccess(profile.id, ipAddress, userAgent, true);

        // Decrypt and return profile data
        const bioData = {
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
            emergencyContacts: contacts.map(c => ({
                name: c.name,
                relationship: c.relationship,
                phone: c.phone,
                email: c.email,
                priority: c.priority,
            })),
            privacyLevel: profile.privacy_level,
        };

        res.json({ bio: bioData });
    } catch (error) {
        console.error('Get bio error:', error);
        res.status(500).json({ error: 'Failed to load bio page' });
    }
}

// Verify PIN and get protected bio
export async function verifyPinAndGetBio(req: Request, res: Response): Promise<void> {
    try {
        const { username } = req.params;
        const validatedData = pinVerificationSchema.parse(req.body);

        // Find user
        const user = await userQueries.findUserByBioSlug(username);
        if (!user) {
            res.status(404).json({ error: 'Bio page not found' });
            return;
        }

        // Find medical profile
        const profile = await profileQueries.findProfileByUserId(user.id);
        if (!profile) {
            res.status(404).json({ error: 'Medical profile not found' });
            return;
        }

        // Check if PIN protected
        if (profile.privacy_level !== 'pin_protected' || !profile.pin_hash) {
            res.status(400).json({ error: 'This bio page is not PIN protected' });
            return;
        }

        // Verify PIN
        const isValidPin = await bcrypt.compare(validatedData.pin, profile.pin_hash);

        // Log access attempt
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.get('user-agent') || 'unknown';
        await accessLogQueries.logAccess(profile.id, ipAddress, userAgent, isValidPin);

        if (!isValidPin) {
            res.status(401).json({ error: 'Invalid PIN' });
            return;
        }

        // Get emergency contacts
        const contacts = await contactQueries.findContactsByProfileId(profile.id);

        // Decrypt and return profile data
        const bioData = {
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
            emergencyContacts: contacts.map(c => ({
                name: c.name,
                relationship: c.relationship,
                phone: c.phone,
                email: c.email,
                priority: c.priority,
            })),
            privacyLevel: profile.privacy_level,
        };

        res.json({
            message: 'PIN verified successfully',
            bio: bioData,
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('Verify PIN error:', error);
        res.status(500).json({ error: 'Failed to verify PIN' });
    }
}
