-- ===================================
-- MIGRATION 002: Adicionar background_color
-- ===================================

-- Adicionar coluna background_color à tabela stores
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS background_color VARCHAR(7) DEFAULT '#ffffff';

-- Comentário explicativo
COMMENT ON COLUMN stores.background_color IS 'Cor de fundo da página pública (hex color)';
