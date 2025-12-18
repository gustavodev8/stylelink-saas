# 📊 Resumo Rápido das Tabelas SQL

## 🎯 Visão Geral

```
StyleLink SaaS - PostgreSQL Database
├── 📋 7 Tabelas Principais
├── 🔍 17 Índices de Performance
├── ⚙️ 5 Triggers Automáticos
├── 📊 1 View Agregada
└── 🔗 6 Foreign Keys com CASCADE
```

---

## 🗂️ Estrutura das Tabelas

### 1️⃣ users - Lojas Cadastradas
```
┌─────────────────────────────────┐
│ 👤 USERS                        │
├─────────────────────────────────┤
│ id                    UUID PK   │
│ email                 UNIQUE    │
│ password_hash                   │
│ store_slug            UNIQUE    │
│ subscription_status   'trial'   │
│ subscription_end_date           │
│ trial_end_date                  │
│ email_verified        false     │
│ verification_code     (6 dig)   │
│ verification_code_expires       │
│ created_at            NOW       │
│ updated_at            NOW       │
│ last_login                      │
└─────────────────────────────────┘
         ↓
    (1 user)
         ↓
```

### 2️⃣ stores - Informações da Loja
```
┌─────────────────────────────────┐
│ 🏪 STORES                       │
├─────────────────────────────────┤
│ id                    UUID PK   │
│ user_id               UUID FK   │ → users.id (CASCADE)
│ store_name                      │
│ bio                   TEXT      │
│ logo_url              URL       │
│ banner_url            URL       │
│ phone                           │
│ whatsapp              DDD+num   │
│ address                         │
│ primary_color         #6366f1   │
│ secondary_color       #8b5cf6   │
│ background_color      #ffffff   │
│ template_id           1 ou 2    │
│ created_at            NOW       │
│ updated_at            NOW       │
└─────────────────────────────────┘
```

### 3️⃣ products - Catálogo de Produtos
```
┌─────────────────────────────────┐
│ 🛍️ PRODUCTS                     │
├─────────────────────────────────┤
│ id                    UUID PK   │
│ user_id               UUID FK   │ → users.id (CASCADE)
│ name                            │
│ description           TEXT      │
│ price                 DECIMAL   │
│ category                        │
│ images                JSONB []  │ ["url1", "url2"]
│ sizes                 JSONB []  │ ["P", "M", "G"]
│ colors                JSONB []  │ ["Preto", "Branco"]
│ is_available          true      │
│ is_featured           false     │
│ views_count           0         │
│ whatsapp_clicks       0         │
│ created_at            NOW       │
│ updated_at            NOW       │
└─────────────────────────────────┘
```

### 4️⃣ social_links - Redes Sociais
```
┌─────────────────────────────────┐
│ 📱 SOCIAL_LINKS                 │
├─────────────────────────────────┤
│ id                    UUID PK   │
│ user_id               UUID FK   │ → users.id (CASCADE)
│ platform              ENUM      │ instagram, facebook, etc
│ url                   TEXT      │
│ username              @user     │
│ is_active             true      │
│ clicks_count          0         │
│ created_at            NOW       │
│ updated_at            NOW       │
│                                 │
│ UNIQUE (user_id, platform)      │
└─────────────────────────────────┘

Platforms aceitas:
- instagram
- facebook
- tiktok
- youtube
- pinterest
- twitter
- whatsapp
```

### 5️⃣ highlights - Produtos em Destaque
```
┌─────────────────────────────────┐
│ ⭐ HIGHLIGHTS                   │
├─────────────────────────────────┤
│ id                    UUID PK   │
│ user_id               UUID FK   │ → users.id (CASCADE)
│ product_id            UUID FK   │ → products.id (CASCADE)
│ position              1-6       │
│ created_at            NOW       │
│                                 │
│ UNIQUE (user_id, position)      │
└─────────────────────────────────┘
```

### 6️⃣ subscriptions - Histórico de Pagamentos
```
┌─────────────────────────────────┐
│ 💳 SUBSCRIPTIONS                │
├─────────────────────────────────┤
│ id                    UUID PK   │
│ user_id               UUID FK   │ → users.id (CASCADE)
│ payment_id            MP ID     │
│ payment_method        pix/card  │
│ amount                DECIMAL   │ 29.90
│ currency              BRL       │
│ status                ENUM      │
│ payment_date                    │
│ period_start                    │
│ period_end            +30 dias  │
│ created_at            NOW       │
│ updated_at            NOW       │
└─────────────────────────────────┘

Status aceitos:
- pending
- approved
- rejected
- cancelled
- refunded
```

### 7️⃣ analytics - Métricas Diárias
```
┌─────────────────────────────────┐
│ 📈 ANALYTICS                    │
├─────────────────────────────────┤
│ id                    UUID PK   │
│ user_id               UUID FK   │ → users.id (CASCADE)
│ page_views            0         │
│ unique_visitors       0         │
│ product_clicks        0         │
│ whatsapp_clicks       0         │
│ social_clicks         0         │
│ date                  DATE      │
│ created_at            NOW       │
│                                 │
│ UNIQUE (user_id, date)          │
└─────────────────────────────────┘
```

---

## 🔗 Relacionamentos

```
┌──────────┐
│  USERS   │ (1 loja)
└─────┬────┘
      │
      ├─────→ (1:1)  STORES          (informações visuais)
      │
      ├─────→ (1:N)  PRODUCTS        (catálogo)
      │               └─→ (N:M) HIGHLIGHTS (destaques)
      │
      ├─────→ (1:N)  SOCIAL_LINKS   (redes sociais)
      │
      ├─────→ (1:N)  SUBSCRIPTIONS  (pagamentos)
      │
      └─────→ (1:N)  ANALYTICS       (métricas diárias)
```

---

## 📋 Índices (17 total)

| Tabela | Índice | Coluna(s) | Motivo |
|--------|--------|-----------|--------|
| users | idx_users_email | email | Login rápido |
| users | idx_users_store_slug | store_slug | Página pública |
| users | idx_users_subscription_status | subscription_status | Filtro assinaturas |
| users | idx_users_verification_code | verification_code | Validação email |
| stores | idx_stores_user_id | user_id | JOIN rápido |
| products | idx_products_user_id | user_id | Filtro por loja |
| products | idx_products_is_featured | is_featured | Produtos destaque |
| products | idx_products_is_available | is_available | Produtos ativos |
| products | idx_products_category | category | Filtro categoria |
| social_links | idx_social_links_user_id | user_id | JOIN rápido |
| highlights | idx_highlights_user_id | user_id | Filtro por loja |
| highlights | idx_highlights_product_id | product_id | JOIN rápido |
| subscriptions | idx_subscriptions_user_id | user_id | Histórico |
| subscriptions | idx_subscriptions_status | status | Filtro status |
| subscriptions | idx_subscriptions_payment_id | payment_id | Webhook MP |
| analytics | idx_analytics_user_id | user_id | Dashboard |
| analytics | idx_analytics_date | date | Período |

---

## ⚙️ Triggers (5 total)

Todos para atualizar `updated_at` automaticamente:

1. `update_users_updated_at` → users
2. `update_stores_updated_at` → stores
3. `update_products_updated_at` → products
4. `update_social_links_updated_at` → social_links
5. `update_subscriptions_updated_at` → subscriptions

**Função:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## 📊 View Agregada

### user_dashboard_stats

Dashboard com estatísticas agregadas:

```sql
SELECT * FROM user_dashboard_stats WHERE user_id = 'uuid-aqui';
```

**Retorna:**
```json
{
  "user_id": "uuid",
  "email": "loja@exemplo.com",
  "store_slug": "minhaloja",
  "subscription_status": "active",
  "total_products": 42,
  "featured_products": 6,
  "total_social_links": 5,
  "total_product_views": 1523,
  "total_page_views_30d": 3847
}
```

---

## 📦 Dados JSONB

### products.images
```json
[
  "https://res.cloudinary.com/.../img1.jpg",
  "https://res.cloudinary.com/.../img2.jpg",
  "https://res.cloudinary.com/.../img3.jpg"
]
```

### products.sizes
```json
["PP", "P", "M", "G", "GG"]
```

### products.colors
```json
["Preto", "Branco", "Azul Marinho", "Vermelho"]
```

**Buscar produtos com tamanho específico:**
```sql
SELECT * FROM products
WHERE sizes @> '["M"]'::jsonb;
```

**Buscar produtos com cor específica:**
```sql
SELECT * FROM products
WHERE colors @> '["Preto"]'::jsonb;
```

---

## 🔐 Constraints Importantes

### CHECK Constraints
```sql
-- users
CHECK (subscription_status IN ('trial', 'active', 'inactive', 'cancelled'))

-- stores
CHECK (template_id IN (1, 2))

-- social_links
CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'twitter', 'whatsapp'))

-- subscriptions
CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded'))
```

### UNIQUE Constraints
```sql
-- users
UNIQUE (email)
UNIQUE (store_slug)

-- social_links
UNIQUE (user_id, platform) -- 1 Instagram por loja

-- highlights
UNIQUE (user_id, position) -- Posições 1-6 únicas

-- analytics
UNIQUE (user_id, date) -- 1 registro por dia
```

### CASCADE Deletes
```sql
-- Se deletar USER:
users → stores (CASCADE)
users → products (CASCADE)
users → social_links (CASCADE)
users → highlights (CASCADE)
users → subscriptions (CASCADE)
users → analytics (CASCADE)

-- Se deletar PRODUCT:
products → highlights (CASCADE)
```

⚠️ **CUIDADO:** Deletar um usuário remove TUDO relacionado!

---

## 📏 Limites e Validações

| Campo | Limite | Validação |
|-------|--------|-----------|
| email | 255 chars | NOT NULL, UNIQUE |
| store_slug | 100 chars | NOT NULL, UNIQUE, lowercase |
| store_name | 255 chars | NOT NULL |
| bio | Ilimitado | TEXT |
| password_hash | 255 chars | bcrypt $2a$ |
| verification_code | 6 chars | 6 dígitos |
| phone/whatsapp | 20 chars | DDD + número |
| colors (hex) | 7 chars | #RRGGBB |
| price | 10,2 decimal | Max: 99999999.99 |
| JSONB arrays | 1 MB | Postgres limit |

---

## 🚀 Queries de Exemplo

### 1. Dashboard de uma loja
```sql
SELECT * FROM user_dashboard_stats WHERE user_id = 'uuid';
```

### 2. Produtos em destaque
```sql
SELECT p.*
FROM products p
JOIN highlights h ON h.product_id = p.id
WHERE h.user_id = 'uuid'
ORDER BY h.position ASC;
```

### 3. Analytics últimos 7 dias
```sql
SELECT
  date,
  page_views,
  unique_visitors,
  whatsapp_clicks
FROM analytics
WHERE user_id = 'uuid'
  AND date >= CURRENT_DATE - 7
ORDER BY date DESC;
```

### 4. Lojas com trial expirando hoje
```sql
SELECT email, store_slug, trial_end_date
FROM users
WHERE subscription_status = 'trial'
  AND trial_end_date::date = CURRENT_DATE;
```

### 5. Top 10 produtos mais vistos
```sql
SELECT name, views_count, whatsapp_clicks
FROM products
WHERE user_id = 'uuid'
ORDER BY views_count DESC
LIMIT 10;
```

### 6. Receita total de uma loja
```sql
SELECT
  COUNT(*) as total_payments,
  SUM(amount) as total_revenue
FROM subscriptions
WHERE user_id = 'uuid'
  AND status = 'approved';
```

---

## 📊 Tamanho Estimado

### Por Loja (1 ano)
- Users: ~500 bytes
- Stores: ~1 KB
- Products (50): ~100 KB
- Social Links (5): ~2 KB
- Highlights (6): ~1 KB
- Subscriptions (12): ~5 KB
- Analytics (365): ~50 KB

**Total:** ~160 KB/loja/ano

### Projeções
- **1.000 lojas:** ~160 MB/ano
- **10.000 lojas:** ~1.6 GB/ano
- **100.000 lojas:** ~16 GB/ano

---

## ✅ Checklist de Migração

- [ ] Backup do banco atual
- [ ] Executar `SUPABASE-MIGRATION.sql`
- [ ] Verificar 7 tabelas criadas
- [ ] Verificar 17 índices criados
- [ ] Verificar 5 triggers criados
- [ ] Testar INSERT em users
- [ ] Testar INSERT em stores (FK)
- [ ] Testar INSERT em products
- [ ] Testar VIEW user_dashboard_stats
- [ ] Migrar dados antigos (se existem)
- [ ] Atualizar DATABASE_URL no .env
- [ ] Testar conexão backend
- [ ] Testar registro/login
- [ ] Testar CRUD de produtos

---

**Criado em:** 2025-12-18
**Schema Version:** 1.0.3
**PostgreSQL:** 14+ (Neon) / 15+ (Supabase)
