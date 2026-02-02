-- ===============================
-- V11: Add password_hash column to usuarios
-- ===============================

-- Add password_hash column to usuarios table
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Update existing admin user with password (password123)
UPDATE usuarios SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'admin@teatroreal.es';
