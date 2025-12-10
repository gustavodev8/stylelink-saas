-- ===================================
-- MIGRATION 002: Adicionar Verificação de Email
-- ===================================

-- Adicionar campos de verificação de email
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code_expires TIMESTAMP;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);

-- Comentários
COMMENT ON COLUMN users.email_verified IS 'Flag indicando se o email foi verificado';
COMMENT ON COLUMN users.verification_code IS 'Código de 6 dígitos para verificação';
COMMENT ON COLUMN users.verification_code_expires IS 'Data de expiração do código (15 minutos)';
