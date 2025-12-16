-- ===================================
-- STYLELINK SAAS - SCHEMA DO BANCO DE DADOS
-- ===================================
-- PostgreSQL 14+
-- Execute este arquivo para criar todas as tabelas

-- ===================================
-- EXTENSÕES
-- ===================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- TABELA: users (Lojas cadastradas)
-- ===================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    store_slug VARCHAR(100) UNIQUE NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'inactive', 'cancelled')),
    subscription_end_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_store_slug ON users(store_slug);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);

-- ===================================
-- TABELA: stores (Informações da Loja)
-- ===================================
CREATE TABLE stores (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice
CREATE INDEX idx_stores_user_id ON stores(user_id);

-- ===================================
-- TABELA: products (Produtos)
-- ===================================
CREATE TABLE products (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_available ON products(is_available);
CREATE INDEX idx_products_category ON products(category);

-- ===================================
-- TABELA: social_links (Redes Sociais)
-- ===================================
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'twitter', 'whatsapp')),
    url TEXT NOT NULL,
    username VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    clicks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, platform)
);

-- Índice
CREATE INDEX idx_social_links_user_id ON social_links(user_id);

-- ===================================
-- TABELA: highlights (Destaques)
-- ===================================
CREATE TABLE highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, position)
);

-- Índices
CREATE INDEX idx_highlights_user_id ON highlights(user_id);
CREATE INDEX idx_highlights_product_id ON highlights(product_id);

-- ===================================
-- TABELA: subscriptions (Histórico de Pagamentos)
-- ===================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payment_id VARCHAR(255),
    payment_method VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded')),
    payment_date TIMESTAMP,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_payment_id ON subscriptions(payment_id);

-- ===================================
-- TABELA: analytics (Métricas Básicas)
-- ===================================
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    product_clicks INTEGER DEFAULT 0,
    whatsapp_clicks INTEGER DEFAULT 0,
    social_clicks INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Índices
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_date ON analytics(date);

-- ===================================
-- FUNÇÕES E TRIGGERS
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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- DADOS INICIAIS (OPCIONAL)
-- ===================================

-- Exemplo de usuário demo (senha: demo123)
-- INSERT INTO users (email, password_hash, store_slug, subscription_status, trial_end_date)
-- VALUES (
--     'demo@stylelink.com',
--     '$2a$10$XqJZ8Z9Z9Z9Z9Z9Z9Z9Z9euYourHashedPasswordHere',
--     'lojademo',
--     'trial',
--     CURRENT_TIMESTAMP + INTERVAL '7 days'
-- );

-- ===================================
-- VIEWS ÚTEIS
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
-- COMENTÁRIOS NAS TABELAS
-- ===================================
COMMENT ON TABLE users IS 'Lojas cadastradas no sistema';
COMMENT ON TABLE stores IS 'Informações detalhadas de cada loja';
COMMENT ON TABLE products IS 'Produtos cadastrados pelas lojas';
COMMENT ON TABLE social_links IS 'Links de redes sociais das lojas';
COMMENT ON TABLE highlights IS 'Produtos em destaque na página';
COMMENT ON TABLE subscriptions IS 'Histórico de pagamentos e assinaturas';
COMMENT ON TABLE analytics IS 'Métricas diárias de acesso e interação';

-- ===================================
-- FIM DO SCHEMA
-- ===================================
