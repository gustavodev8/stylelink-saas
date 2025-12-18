# 📊 StyleLink SaaS - Estrutura do Banco de Dados

## 🗃️ Resumo Geral

**Banco Atual:** PostgreSQL 14+ (Neon)
**Banco Destino:** PostgreSQL 15+ (Supabase)
**Total de Tabelas:** 7 principais + 1 view
**Extensões:** uuid-ossp
**Migrations:** 3 arquivos

---

## 📋 Tabelas Principais

### 1. **users** (Lojas Cadastradas)
Armazena informações de autenticação e assinatura de cada loja.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID único da loja |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email de login |
| `password_hash` | VARCHAR(255) | NOT NULL | Senha criptografada (bcrypt) |
| `store_slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL amigável (ex: minhaloja) |
| `subscription_status` | VARCHAR(20) | DEFAULT 'trial' | Status: trial, active, inactive, cancelled |
| `subscription_end_date` | TIMESTAMP | NULL | Data de fim da assinatura |
| `trial_end_date` | TIMESTAMP | NULL | Data de fim do trial (7 dias) |
| `email_verified` | BOOLEAN | DEFAULT false | Email foi verificado? |
| `verification_code` | VARCHAR(6) | NULL | Código de 6 dígitos |
| `verification_code_expires` | TIMESTAMP | NULL | Expiração do código (15min) |
| `created_at` | TIMESTAMP | DEFAULT NOW | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Última atualização |
| `last_login` | TIMESTAMP | NULL | Último login |

**Índices:**
- `idx_users_email` - Email (busca rápida login)
- `idx_users_store_slug` - Store slug (página pública)
- `idx_users_subscription_status` - Status assinatura
- `idx_users_verification_code` - Código verificação

**Constraints:**
- `CHECK (subscription_status IN ('trial', 'active', 'inactive', 'cancelled'))`

---

### 2. **stores** (Informações da Loja)
Dados visuais e configurações de personalização da loja.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID único |
| `user_id` | UUID | UNIQUE, NOT NULL, FK → users(id) | Dono da loja (1:1) |
| `store_name` | VARCHAR(255) | NOT NULL | Nome da loja |
| `bio` | TEXT | NULL | Biografia/descrição curta |
| `logo_url` | TEXT | NULL | URL do logo (Cloudinary) |
| `banner_url` | TEXT | NULL | URL do banner |
| `phone` | VARCHAR(20) | NULL | Telefone |
| `whatsapp` | VARCHAR(20) | NULL | WhatsApp (DDD + número) |
| `address` | TEXT | NULL | Endereço completo |
| `primary_color` | VARCHAR(7) | DEFAULT '#6366f1' | Cor primária (hex) |
| `secondary_color` | VARCHAR(7) | DEFAULT '#8b5cf6' | Cor secundária (hex) |
| `background_color` | VARCHAR(7) | DEFAULT '#ffffff' | Cor de fundo (hex) |
| `template_id` | INTEGER | DEFAULT 1 | Template 1 ou 2 |
| `created_at` | TIMESTAMP | DEFAULT NOW | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Última atualização |

**Índices:**
- `idx_stores_user_id` - User ID (JOIN rápido)

**Constraints:**
- `CHECK (template_id IN (1, 2))`
- `ON DELETE CASCADE` - Se user deletado, store também

---

### 3. **products** (Produtos)
Catálogo de produtos de cada loja.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID único do produto |
| `user_id` | UUID | NOT NULL, FK → users(id) | Dono do produto |
| `name` | VARCHAR(255) | NOT NULL | Nome do produto |
| `description` | TEXT | NULL | Descrição detalhada |
| `price` | DECIMAL(10, 2) | NOT NULL | Preço (ex: 99.90) |
| `category` | VARCHAR(100) | NULL | Categoria (roupas, acessórios) |
| `images` | JSONB | DEFAULT '[]' | Array de URLs Cloudinary |
| `sizes` | JSONB | DEFAULT '[]' | Array de tamanhos ['P', 'M', 'G'] |
| `colors` | JSONB | DEFAULT '[]' | Array de cores ['Preto', 'Branco'] |
| `is_available` | BOOLEAN | DEFAULT true | Disponível para compra? |
| `is_featured` | BOOLEAN | DEFAULT false | Produto em destaque? |
| `views_count` | INTEGER | DEFAULT 0 | Visualizações do produto |
| `whatsapp_clicks` | INTEGER | DEFAULT 0 | Cliques no WhatsApp |
| `created_at` | TIMESTAMP | DEFAULT NOW | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Última atualização |

**Índices:**
- `idx_products_user_id` - User ID (filtro por loja)
- `idx_products_is_featured` - Produtos destacados
- `idx_products_is_available` - Produtos disponíveis
- `idx_products_category` - Busca por categoria

**Constraints:**
- `ON DELETE CASCADE` - Se user deletado, produtos também

**Exemplo JSONB:**
```json
{
  "images": ["https://res.cloudinary.com/.../img1.jpg", "..."],
  "sizes": ["P", "M", "G", "GG"],
  "colors": ["Preto", "Branco", "Azul Marinho"]
}
```

---

### 4. **social_links** (Redes Sociais)
Links de redes sociais da loja.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID único |
| `user_id` | UUID | NOT NULL, FK → users(id) | Dono dos links |
| `platform` | VARCHAR(50) | NOT NULL | instagram, facebook, tiktok, etc |
| `url` | TEXT | NOT NULL | URL completa da rede |
| `username` | VARCHAR(255) | NULL | @ do usuário |
| `is_active` | BOOLEAN | DEFAULT true | Link ativo? |
| `clicks_count` | INTEGER | DEFAULT 0 | Cliques no link |
| `created_at` | TIMESTAMP | DEFAULT NOW | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Última atualização |

**Índices:**
- `idx_social_links_user_id` - User ID (filtro por loja)

**Constraints:**
- `UNIQUE(user_id, platform)` - 1 link por plataforma
- `CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'twitter', 'whatsapp'))`
- `ON DELETE CASCADE` - Se user deletado, links também

---

### 5. **highlights** (Destaques)
Produtos destacados na página inicial da loja (máximo 6).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID único |
| `user_id` | UUID | NOT NULL, FK → users(id) | Dono do destaque |
| `product_id` | UUID | NOT NULL, FK → products(id) | Produto destacado |
| `position` | INTEGER | NOT NULL | Posição (1-6) |
| `created_at` | TIMESTAMP | DEFAULT NOW | Data de criação |

**Índices:**
- `idx_highlights_user_id` - User ID
- `idx_highlights_product_id` - Product ID

**Constraints:**
- `UNIQUE(user_id, position)` - Cada posição única por loja
- `ON DELETE CASCADE` - Se product deletado, destaque também

---

### 6. **subscriptions** (Histórico de Pagamentos)
Histórico completo de pagamentos e assinaturas.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID único |
| `user_id` | UUID | NOT NULL, FK → users(id) | Cliente que pagou |
| `payment_id` | VARCHAR(255) | NULL | ID do Mercado Pago |
| `payment_method` | VARCHAR(50) | NULL | pix, credit_card, boleto |
| `amount` | DECIMAL(10, 2) | NOT NULL | Valor pago (ex: 29.90) |
| `currency` | VARCHAR(3) | DEFAULT 'BRL' | Moeda (BRL, USD) |
| `status` | VARCHAR(50) | NOT NULL | pending, approved, rejected, etc |
| `payment_date` | TIMESTAMP | NULL | Data do pagamento aprovado |
| `period_start` | TIMESTAMP | NOT NULL | Início do período |
| `period_end` | TIMESTAMP | NOT NULL | Fim do período (30 dias) |
| `created_at` | TIMESTAMP | DEFAULT NOW | Data de criação |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Última atualização |

**Índices:**
- `idx_subscriptions_user_id` - User ID
- `idx_subscriptions_status` - Status pagamento
- `idx_subscriptions_payment_id` - ID Mercado Pago

**Constraints:**
- `CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded'))`
- `ON DELETE CASCADE` - Se user deletado, histórico também

---

### 7. **analytics** (Métricas Diárias)
Métricas agregadas por dia para cada loja.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | ID único |
| `user_id` | UUID | NOT NULL, FK → users(id) | Loja |
| `page_views` | INTEGER | DEFAULT 0 | Visualizações de página |
| `unique_visitors` | INTEGER | DEFAULT 0 | Visitantes únicos (IP) |
| `product_clicks` | INTEGER | DEFAULT 0 | Cliques em produtos |
| `whatsapp_clicks` | INTEGER | DEFAULT 0 | Cliques no WhatsApp |
| `social_clicks` | INTEGER | DEFAULT 0 | Cliques em redes sociais |
| `date` | DATE | NOT NULL | Data das métricas |
| `created_at` | TIMESTAMP | DEFAULT NOW | Data de criação |

**Índices:**
- `idx_analytics_user_id` - User ID
- `idx_analytics_date` - Data (filtro período)

**Constraints:**
- `UNIQUE(user_id, date)` - 1 registro por dia por loja
- `ON DELETE CASCADE` - Se user deletado, analytics também

---

## 🔧 Funções e Triggers

### Função: `update_updated_at_column()`
Atualiza automaticamente o campo `updated_at` quando um registro é modificado.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### Triggers
Aplicados em todas as tabelas com `updated_at`:
- `update_users_updated_at` → users
- `update_stores_updated_at` → stores
- `update_products_updated_at` → products
- `update_social_links_updated_at` → social_links
- `update_subscriptions_updated_at` → subscriptions

---

## 📊 Views

### View: `user_dashboard_stats`
Estatísticas agregadas para o dashboard do usuário.

**Colunas:**
- `user_id` - UUID do usuário
- `email` - Email
- `store_slug` - Slug da loja
- `subscription_status` - Status da assinatura
- `total_products` - Total de produtos
- `featured_products` - Produtos em destaque
- `total_social_links` - Total de redes sociais ativas
- `total_product_views` - Soma de visualizações de produtos
- `total_page_views_30d` - Visualizações dos últimos 30 dias

**Uso:**
```sql
SELECT * FROM user_dashboard_stats WHERE user_id = 'uuid-aqui';
```

---

## 🔐 Extensões Necessárias

### uuid-ossp
Gera UUIDs automaticamente.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**Uso:**
```sql
uuid_generate_v4() -- Gera UUID aleatório
```

---

## 📂 Migrations

### Migration 001: Schema Completo
**Arquivo:** `001_schema_completo.sql`
**Cria:**
- 7 tabelas principais
- Índices de performance
- Função `update_updated_at_column()`
- 5 triggers para `updated_at`
- View `user_dashboard_stats`
- Comentários nas tabelas

### Migration 002: Email Verification
**Arquivo:** `002_add_email_verification.sql`
**Adiciona em `users`:**
- `email_verified` BOOLEAN
- `verification_code` VARCHAR(6)
- `verification_code_expires` TIMESTAMP
- Índice `idx_users_verification_code`

### Migration 003: Background Color
**Arquivo:** `003_add_background_color.sql`
**Adiciona em `stores`:**
- `background_color` VARCHAR(7) DEFAULT '#ffffff'

---

## 🔄 Relacionamentos (Foreign Keys)

```
users (1) ←→ (1) stores
  ↓
  └─→ (1:N) products
  └─→ (1:N) social_links
  └─→ (1:N) highlights
  └─→ (1:N) subscriptions
  └─→ (1:N) analytics

products (1) ←→ (N) highlights
```

### Cascading Deletes
**Quando um `user` é deletado:**
- ✅ Store é deletada (CASCADE)
- ✅ Todos os products são deletados (CASCADE)
- ✅ Todos os social_links são deletados (CASCADE)
- ✅ Todos os highlights são deletados (CASCADE)
- ✅ Todos os subscriptions são deletados (CASCADE)
- ✅ Todos os analytics são deletados (CASCADE)

**Quando um `product` é deletado:**
- ✅ Highlights relacionados são deletados (CASCADE)

---

## 📊 Tamanho Estimado dos Dados

### Por Loja (média)
- **Users:** 1 registro (~500 bytes)
- **Stores:** 1 registro (~1 KB)
- **Products:** 50 produtos (~100 KB com JSONB)
- **Social Links:** 5 links (~2 KB)
- **Highlights:** 6 destaques (~1 KB)
- **Subscriptions:** 12/ano (~5 KB)
- **Analytics:** 365/ano (~50 KB)

**Total por loja/ano:** ~160 KB

**Para 1000 lojas:** ~160 MB/ano
**Para 10.000 lojas:** ~1.6 GB/ano

---

## 🔍 Queries Úteis

### Buscar loja por slug
```sql
SELECT u.*, s.*
FROM users u
JOIN stores s ON s.user_id = u.id
WHERE u.store_slug = 'minhaloja';
```

### Produtos em destaque de uma loja
```sql
SELECT p.*
FROM products p
JOIN highlights h ON h.product_id = p.id
WHERE h.user_id = 'uuid-aqui'
ORDER BY h.position ASC
LIMIT 6;
```

### Analytics dos últimos 30 dias
```sql
SELECT
  SUM(page_views) as total_views,
  SUM(unique_visitors) as total_visitors,
  SUM(whatsapp_clicks) as total_whatsapp
FROM analytics
WHERE user_id = 'uuid-aqui'
  AND date >= CURRENT_DATE - INTERVAL '30 days';
```

### Lojas com trial expirando em 3 dias
```sql
SELECT email, store_slug, trial_end_date
FROM users
WHERE subscription_status = 'trial'
  AND trial_end_date BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '3 days'
ORDER BY trial_end_date ASC;
```

---

## ⚡ Performance

### Índices Críticos (já criados)
- ✅ Users: email, store_slug, subscription_status
- ✅ Products: user_id, is_featured, is_available, category
- ✅ Social Links: user_id
- ✅ Highlights: user_id, product_id
- ✅ Subscriptions: user_id, status, payment_id
- ✅ Analytics: user_id, date

### Otimizações Futuras (se necessário)
- Particionamento de `analytics` por mês/ano
- Índice GIN em colunas JSONB (`products.images`, `products.sizes`)
- Materialized view para `user_dashboard_stats`
- Cache Redis para página pública (store_slug → dados)

---

## 🎯 Resumo Técnico

| Item | Valor |
|------|-------|
| **Tabelas** | 7 |
| **Views** | 1 |
| **Índices** | 17 |
| **Triggers** | 5 |
| **Foreign Keys** | 6 |
| **Extensões** | uuid-ossp |
| **PostgreSQL Versão** | 14+ |
| **Tipo de Dados JSONB** | Sim (products) |
| **Auto-increment** | UUID v4 |
| **Soft Deletes** | Não (hard deletes) |
| **Timestamps** | created_at, updated_at |

---

## 📝 Notas Importantes

1. **UUIDs:** Todos os IDs usam UUID v4 para segurança e distribuição
2. **JSONB:** Arrays de imagens, tamanhos e cores em formato JSON (flexível)
3. **Cascading:** Deleção de user remove TUDO relacionado (cuidado!)
4. **Timestamps:** Automáticos via triggers (não precisa atualizar manualmente)
5. **Validation:** CHECK constraints em status, platform, template_id
6. **Unique Constraints:** Email, store_slug, social_links por platform
7. **Decimal Precision:** 10,2 para valores monetários (ex: 99999999.99)

---

**Criado em:** 2025-12-18
**Última atualização:** 2025-12-18
**Versão do Schema:** 1.0.3 (3 migrations)
