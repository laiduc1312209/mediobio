import pool from '../config/database';

async function migrate() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS invitation_keys (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                key_code VARCHAR(50) UNIQUE NOT NULL,
                created_by UUID REFERENCES users(id),
                used_by UUID REFERENCES users(id),
                is_used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                used_at TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_invitation_keys_code ON invitation_keys(key_code);
        `);
        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
