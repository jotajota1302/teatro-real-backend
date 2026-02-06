-- ===============================
-- V13: Fix password hashes with correct BCrypt
-- ===============================

-- Update all dev users with correct BCrypt hash for 'password123'
UPDATE usuarios SET password_hash = '$2a$10$hEn68EyPUSHQ8uKlMgBj2eZyMXL/jAicrUKjU/1bvYHyns/MJa73G'
WHERE email IN ('admin@teatroreal.es', 'tempo@teatroreal.es', 'tops@teatroreal.es');
