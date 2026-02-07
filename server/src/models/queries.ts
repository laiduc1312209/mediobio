import pool from '../config/database';

export interface User {
    id: string;
    email: string;
    password_hash: string;
    username: string;
    bio_slug: string;
    is_admin: boolean;
    created_at: Date;
    updated_at: Date;
    last_login: Date | null;
}

export interface MedicalProfile {
    id: string;
    user_id: string;
    full_name: string;
    date_of_birth: Date;
    avatar_url: string | null;
    blood_type_encrypted: string | null;
    medical_conditions_encrypted: string | null;
    allergies_encrypted: string | null;
    current_medications_encrypted: string | null;
    medical_history_encrypted: string | null;
    doctor_notes_encrypted: string | null;
    personal_message: string | null;
    privacy_level: 'public' | 'link_only' | 'pin_protected';
    pin_hash: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface EmergencyContact {
    id: string;
    medical_profile_id: string;
    name: string;
    relationship: string | null;
    phone: string;
    email: string | null;
    priority: number;
    created_at: Date;
}

export interface InvitationKey {
    id: string;
    key_code: string;
    created_by: string | null;
    used_by: string | null;
    is_used: boolean;
    created_at: Date;
    used_at: Date | null;
}

// User Queries
export const userQueries = {
    async createUser(email: string, passwordHash: string, username: string, bioSlug: string): Promise<User> {
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, username, bio_slug)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [email, passwordHash, username, bioSlug]
        );
        return result.rows[0];
    },

    async findUserByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    },

    async findUserByUsername(username: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0] || null;
    },

    async findUserByBioSlug(bioSlug: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE bio_slug = $1',
            [bioSlug]
        );
        return result.rows[0] || null;
    },

    async findUserById(userId: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );
        return result.rows[0] || null;
    },

    async updateLastLogin(userId: string): Promise<void> {
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [userId]
        );
    },

    async deleteUser(userId: string): Promise<void> {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    },
};

// Medical Profile Queries
export const profileQueries = {
    async createProfile(data: {
        userId: string;
        fullName: string;
        dateOfBirth: string;
        avatarUrl?: string;
        bloodTypeEncrypted?: string;
        medicalConditionsEncrypted?: string;
        allergiesEncrypted?: string;
        currentMedicationsEncrypted?: string;
        medicalHistoryEncrypted?: string;
        doctorNotesEncrypted?: string;
        personalMessage?: string;
        privacyLevel: string;
        pinHash?: string;
    }): Promise<MedicalProfile> {
        const result = await pool.query(
            `INSERT INTO medical_profiles (
        user_id, full_name, date_of_birth, avatar_url,
        blood_type_encrypted, medical_conditions_encrypted,
        allergies_encrypted, current_medications_encrypted,
        medical_history_encrypted, doctor_notes_encrypted,
        personal_message, privacy_level, pin_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
            [
                data.userId, data.fullName, data.dateOfBirth, data.avatarUrl || null,
                data.bloodTypeEncrypted || null, data.medicalConditionsEncrypted || null,
                data.allergiesEncrypted || null, data.currentMedicationsEncrypted || null,
                data.medicalHistoryEncrypted || null, data.doctorNotesEncrypted || null,
                data.personalMessage || null, data.privacyLevel, data.pinHash || null,
            ]
        );
        return result.rows[0];
    },

    async findProfileByUserId(userId: string): Promise<MedicalProfile | null> {
        const result = await pool.query(
            'SELECT * FROM medical_profiles WHERE user_id = $1',
            [userId]
        );
        return result.rows[0] || null;
    },

    async updateProfile(userId: string, data: Partial<{
        fullName: string;
        dateOfBirth: string;
        avatarUrl: string;
        bloodTypeEncrypted: string;
        medicalConditionsEncrypted: string;
        allergiesEncrypted: string;
        currentMedicationsEncrypted: string;
        medicalHistoryEncrypted: string;
        doctorNotesEncrypted: string;
        personalMessage: string;
        privacyLevel: string;
        pinHash: string;
    }>): Promise<MedicalProfile> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
                fields.push(`${snakeKey} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        });

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(userId);

        const result = await pool.query(
            `UPDATE medical_profiles SET ${fields.join(', ')}
       WHERE user_id = $${paramIndex}
       RETURNING *`,
            values
        );
        return result.rows[0];
    },

    async deleteProfile(userId: string): Promise<void> {
        await pool.query('DELETE FROM medical_profiles WHERE user_id = $1', [userId]);
    },
};

// Emergency Contact Queries
export const contactQueries = {
    async createContact(data: {
        medicalProfileId: string;
        name: string;
        relationship?: string;
        phone: string;
        email?: string;
        priority: number;
    }): Promise<EmergencyContact> {
        const result = await pool.query(
            `INSERT INTO emergency_contacts (medical_profile_id, name, relationship, phone, email, priority)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [data.medicalProfileId, data.name, data.relationship || null, data.phone, data.email || null, data.priority]
        );
        return result.rows[0];
    },

    async findContactsByProfileId(medicalProfileId: string): Promise<EmergencyContact[]> {
        const result = await pool.query(
            'SELECT * FROM emergency_contacts WHERE medical_profile_id = $1 ORDER BY priority ASC',
            [medicalProfileId]
        );
        return result.rows;
    },

    async updateContact(contactId: string, data: Partial<{
        name: string;
        relationship: string;
        phone: string;
        email: string;
        priority: number;
    }>): Promise<EmergencyContact> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        });

        values.push(contactId);

        const result = await pool.query(
            `UPDATE emergency_contacts SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
            values
        );
        return result.rows[0];
    },

    async deleteContact(contactId: string): Promise<void> {
        await pool.query('DELETE FROM emergency_contacts WHERE id = $1', [contactId]);
    },

    async deleteContactsByProfileId(medicalProfileId: string): Promise<void> {
        await pool.query('DELETE FROM emergency_contacts WHERE medical_profile_id = $1', [medicalProfileId]);
    },
};

// Access Log Queries (optional)
export const accessLogQueries = {
    async logAccess(medicalProfileId: string, ipAddress: string, userAgent: string, accessGranted: boolean): Promise<void> {
        await pool.query(
            `INSERT INTO access_logs (medical_profile_id, ip_address, user_agent, access_granted)
       VALUES ($1, $2, $3, $4)`,
            [medicalProfileId, ipAddress, userAgent, accessGranted]
        );
    },
};

// Admin Queries
export const adminQueries = {
    async getAllUsers(limit: number = 50, offset: number = 0): Promise<{ users: User[]; total: number }> {
        const countResult = await pool.query('SELECT COUNT(*) FROM users');
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT id, email, username, bio_slug, is_admin, created_at, last_login 
             FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return { users: result.rows, total };
    },

    async getAllProfiles(limit: number = 50, offset: number = 0): Promise<{ profiles: any[]; total: number }> {
        const countResult = await pool.query('SELECT COUNT(*) FROM medical_profiles');
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT mp.id, mp.full_name, mp.date_of_birth, mp.avatar_url, mp.privacy_level, mp.created_at,
                    u.username, u.email
             FROM medical_profiles mp
             JOIN users u ON mp.user_id = u.id
             ORDER BY mp.created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return { profiles: result.rows, total };
    },

    async getStats(): Promise<{ userCount: number; profileCount: number; contactCount: number }> {
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        const profileCount = await pool.query('SELECT COUNT(*) FROM medical_profiles');
        const contactCount = await pool.query('SELECT COUNT(*) FROM emergency_contacts');

        return {
            userCount: parseInt(userCount.rows[0].count),
            profileCount: parseInt(profileCount.rows[0].count),
            contactCount: parseInt(contactCount.rows[0].count),
        };
    },

    async createOrUpdateAdmin(email: string, passwordHash: string, username: string, bioSlug: string): Promise<User> {
        // Check if admin exists
        const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (existing.rows[0]) {
            // Update password if exists
            await pool.query(
                'UPDATE users SET password_hash = $1, is_admin = true WHERE username = $2',
                [passwordHash, username]
            );
            return existing.rows[0];
        }

        // Create new admin
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, username, bio_slug, is_admin)
             VALUES ($1, $2, $3, $4, true)
             RETURNING *`,
            [email, passwordHash, username, bioSlug]
        );
        return result.rows[0];
    },

    async deleteUserById(userId: string): Promise<void> {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    },

    async deleteProfileById(profileId: string): Promise<void> {
        await pool.query('DELETE FROM medical_profiles WHERE id = $1', [profileId]);
    },
};

// Invitation Key Queries
export const keyQueries = {
    async createKeys(keys: string[], adminId: string): Promise<void> {
        if (keys.length === 0) return;

        // Insert keys one by one to avoid parameter mismatch
        for (const keyCode of keys) {
            await pool.query(
                `INSERT INTO invitation_keys (key_code, created_by) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [keyCode, adminId]
            );
        }
    },

    async getKey(keyCode: string): Promise<InvitationKey | null> {
        const result = await pool.query(
            'SELECT * FROM invitation_keys WHERE key_code = $1',
            [keyCode]
        );
        return result.rows[0] || null;
    },

    async markKeyAsUsed(keyCode: string, userId: string): Promise<void> {
        await pool.query(
            'UPDATE invitation_keys SET is_used = TRUE, used_by = $1, used_at = CURRENT_TIMESTAMP WHERE key_code = $2',
            [userId, keyCode]
        );
    },

    async getAllKeys(limit: number = 50, offset: number = 0): Promise<{ keys: any[]; total: number }> {
        const countResult = await pool.query('SELECT COUNT(*) FROM invitation_keys');
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            `SELECT k.*, 
                    creator.username as creator_name,
                    user_used.username as user_used_name
             FROM invitation_keys k
             LEFT JOIN users creator ON k.created_by = creator.id
             LEFT JOIN users user_used ON k.used_by = user_used.id
             ORDER BY k.created_at DESC 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return { keys: result.rows, total };
    },
};
