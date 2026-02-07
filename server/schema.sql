-- Medical Bio Web App - Database Schema
-- PostgreSQL Database Initialization

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    bio_slug VARCHAR(100) UNIQUE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Medical Profiles Table
CREATE TABLE IF NOT EXISTS medical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Info
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    avatar_url TEXT,
    
    -- Medical Data (Encrypted)
    blood_type_encrypted TEXT,
    medical_conditions_encrypted TEXT,
    allergies_encrypted TEXT,
    current_medications_encrypted TEXT,
    medical_history_encrypted TEXT,
    doctor_notes_encrypted TEXT,
    personal_message TEXT,
    
    -- Privacy Settings
    privacy_level VARCHAR(20) DEFAULT 'link_only' CHECK (privacy_level IN ('public', 'link_only', 'pin_protected')),
    pin_hash VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_profile_id UUID REFERENCES medical_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Access Logs Table (for security audit)
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_profile_id UUID REFERENCES medical_profiles(id) ON DELETE CASCADE,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    access_granted BOOLEAN
);

-- Invitation Keys Table
CREATE TABLE IF NOT EXISTS invitation_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_code VARCHAR(50) UNIQUE NOT NULL,
    created_by UUID REFERENCES users(id),
    used_by UUID REFERENCES users(id),
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP
);
-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_invitation_keys_code ON invitation_keys(key_code);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_bio_slug ON users(bio_slug);
CREATE INDEX IF NOT EXISTS idx_medical_profiles_user_id ON medical_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_profile ON emergency_contacts(medical_profile_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_profile ON access_logs(medical_profile_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_time ON access_logs(accessed_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_profiles_updated_at BEFORE UPDATE ON medical_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE '📊 Tables created: users, medical_profiles, emergency_contacts, access_logs';
    RAISE NOTICE '🔐 Encryption ready for medical data';
END $$;
