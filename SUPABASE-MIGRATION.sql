-- =====================================================
-- STYLELINK SAAS - MIGRAÇÃO COMPLETA PARA SUPABASE
-- =====================================================
-- PostgreSQL 15+ (Supabase)
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- ===================================
-- PASSO 1: EXTENSÕES
-- ===================================

-- UUID (já vem habilitada no Supabase, mas garantindo)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- PASSO 2: CRIAR TABELAS
-- ===================================

-- -----------------------------
-- TABELA: users
-- -----------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    store_slug VARCHAR(100) UNIQUE NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'inactive', 'cancelled')),
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    trial_end_date TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    verification_code VARCHAR(6),
    verification_code_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_store_slug ON users(store_slug);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);

-- Comentários
COMMENT ON TABLE users IS 'Lojas cadastradas no sistema';
COMMENT ON COLUMN users.email_verified IS 'Flag indicando se o email foi verificado';
COMMENT ON COLUMN users.verification_code IS 'Código de 6 dígitos para verificação';
COMMENT ON COLUMN users.verification_code_expires IS 'Data de expiração do código (15 minutos)';

-- -----------------------------
-- TABELA: stores
-- -----------------------------
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_name VARCHAR(255) NOT NULL,
    bio TEXT,
    logo_url TEXT,
    banner_url TEXT,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    address TEXT,
    primary_color VARCHAR(7) DEFAULT '#6366f1',
    secondary_color VARCHAR(7) DEFAULT '#8b5cf6',
    background_color VARCHAR(7) DEFAULT '#ffffff',
    template_id INTEGER DEFAULT 1 CHECK (template_id IN (1, 2)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);

-- Comentários
COMMENT ON TABLE stores IS 'Informações detalhadas de cada loja';
COMMENT ON COLUMN stores.background_color IS 'Cor de fundo da página pública (hex color)';

-- -----------------------------
-- TABELA: products
-- -----------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    images JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    whatsapp_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Comentário
COMMENT ON TABLE products IS 'Produtos cadastrados pelas lojas';

-- -----------------------------
-- TABELA: social_links
-- -----------------------------
CREATE TABLE IF NOT EXISTS social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'twitter', 'whatsapp')),
    url TEXT NOT NULL,
    username VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    clicks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, platform)
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON social_links(user_id);

-- Comentário
COMMENT ON TABLE social_links IS 'Links de redes sociais das lojas';

-- -----------------------------
-- TABELA: highlights
-- -----------------------------
CREATE TABLE IF NOT EXISTS highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, position)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_highlights_user_id ON highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_highlights_product_id ON highlights(product_id);

-- Comentário
COMMENT ON TABLE highlights IS 'Produtos em destaque na página';

-- -----------------------------
-- TABELA: subscriptions
-- -----------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payment_id VARCHAR(255),
    payment_method VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded')),
    payment_date TIMESTAMP WITH TIME ZONE,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_id ON subscriptions(payment_id);

-- Comentário
COMMENT ON TABLE subscriptions IS 'Histórico de pagamentos e assinaturas';

-- -----------------------------
-- TABELA: analytics
-- -----------------------------
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    product_clicks INTEGER DEFAULT 0,
    whatsapp_clicks INTEGER DEFAULT 0,
    social_clicks INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- Comentário
COMMENT ON TABLE analytics IS 'Métricas diárias de acesso e interação';

-- ===================================
-- PASSO 3: FUNÇÕES E TRIGGERS
-- ===================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_links_updated_at ON social_links;
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- PASSO 4: VIEWS
-- ===================================

-- View para dashboard: estatísticas do usuário
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT
    u.id AS user_id,
    u.email,
    u.store_slug,
    u.subscription_status,
    COUNT(DISTINCT p.id) AS total_products,
    COUNT(DISTINCT CASE WHEN p.is_featured THEN p.id END) AS featured_products,
    COUNT(DISTINCT sl.id) AS total_social_links,
    COALESCE(SUM(p.views_count), 0) AS total_product_views,
    COALESCE(SUM(a.page_views), 0) AS total_page_views_30d
FROM users u
LEFT JOIN products p ON p.user_id = u.id
LEFT JOIN social_links sl ON sl.user_id = u.id AND sl.is_active = true
LEFT JOIN analytics a ON a.user_id = u.id AND a.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.email, u.store_slug, u.subscription_status;

-- ===================================
-- PASSO 5: ROW LEVEL SECURITY (RLS)
-- ===================================

-- IMPORTANTE: Supabase recomenda RLS para segurança
-- Ative apenas se você usar autenticação Supabase Auth
-- Se usar JWT próprio, pode desabilitar

-- Desabilitar RLS (use autenticação via backend Node.js)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE social_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE highlights DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics DISABLE ROW LEVEL SECURITY;

-- OU, se quiser usar RLS (autenticação Supabase Auth):
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Users can only see their own data" ON users
--   FOR ALL
--   USING (auth.uid() = id);
--
-- (Crie policies similares para outras tabelas)

-- ===================================
-- PASSO 6: GRANTS (PERMISSÕES)
-- ===================================

-- Garantir que o usuário postgres tem acesso total
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Se usar service_role (backend Node.js), garantir acesso
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ===================================
-- PASSO 7: VERIFICAÇÃO
-- ===================================

-- Query para verificar se tudo foi criado
SELECT
    'Tables' as type,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'

UNION ALL

SELECT
    'Indexes' as type,
    COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public'

UNION ALL

SELECT
    'Triggers' as type,
    COUNT(*) as count
FROM information_schema.triggers
WHERE trigger_schema = 'public'

UNION ALL

SELECT
    'Views' as type,
    COUNT(*) as count
FROM information_schema.views
WHERE table_schema = 'public';

-- ===================================
-- PASSO 8: DADOS DE TESTE (OPCIONAL)
-- ===================================

-- Usuário demo (senha: demo123)
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
/*
INSERT INTO users (email, password_hash, store_slug, subscription_status, trial_end_date, email_verified)
VALUES (
    'demo@stylelink.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'lojademo',
    'trial',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    true
)
RETURNING id;

-- Copie o UUID retornado e use abaixo
INSERT INTO stores (user_id, store_name, bio, whatsapp)
VALUES (
    'UUID-COPIADO-AQUI',
    'Loja Demo',
    'Moda feminina de qualidade',
    '5511999999999'
);
*/

-- ===================================
-- FIM DA MIGRAÇÃO
-- ===================================

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Migração concluída com sucesso!';
    RAISE NOTICE 'Total de tabelas: 7';
    RAISE NOTICE 'Total de índices: 17';
    RAISE NOTICE 'Total de triggers: 5';
    RAISE NOTICE 'Total de views: 1';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximos passos:';
    RAISE NOTICE '1. Copie a connection string do Supabase';
    RAISE NOTICE '2. Atualize DATABASE_URL no .env';
    RAISE NOTICE '3. Teste a conexão: npm run test:db (se tiver)';
    RAISE NOTICE '4. Migre dados antigos (se necessário)';
END $$;
