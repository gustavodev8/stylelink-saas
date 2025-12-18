# 🚀 Guia de Migração: Neon → Supabase

## 📋 Índice
1. [Diferenças entre Neon e Supabase](#diferenças)
2. [Preparação](#preparação)
3. [Passo a Passo da Migração](#migração)
4. [Atualizar Código do Backend](#backend)
5. [Migração de Dados (se existirem)](#dados)
6. [Testes](#testes)
7. [Troubleshooting](#troubleshooting)

---

## 🔍 Diferenças entre Neon e Supabase {#diferenças}

| Feature | Neon | Supabase |
|---------|------|----------|
| **PostgreSQL** | 14+ | 15+ |
| **Conexão** | Pooling automático | Connection pooling (pgBouncer) |
| **Storage** | ❌ Não | ✅ Sim (S3-compatible) |
| **Auth** | ❌ Não | ✅ Sim (Supabase Auth) |
| **Realtime** | ❌ Não | ✅ Sim (WebSocket subscriptions) |
| **REST API** | ❌ Não | ✅ Sim (PostgREST) |
| **Dashboard** | Simples | Completo (SQL Editor, Table Editor) |
| **Backups** | Automático | Automático + Point-in-time recovery |
| **Row Level Security** | Suportado | Recomendado + integrado |
| **Free Tier** | 3 GB | 500 MB (mas com mais features) |
| **Latency** | Baixa (edge compute) | Média (depende da região) |

### ✅ Vantagens do Supabase
- **Dashboard mais completo** - SQL Editor visual, Table Editor drag-and-drop
- **Storage integrado** - Perfeito para logo/banner (elimina Cloudinary)
- **Auth nativo** - Pode substituir JWT manual (opcional)
- **Realtime** - Atualizar analytics em tempo real (futuro)
- **REST API automática** - PostgREST gera APIs automaticamente
- **Melhor comunidade** - Mais tutoriais e suporte

### ⚠️ Desvantagens do Supabase
- **Free tier menor** - 500 MB vs 3 GB (Neon)
- **Latency maior** - Neon tem edge compute mais rápido
- **Lock-in maior** - Mais features proprietárias

---

## 🛠️ Preparação {#preparação}

### 1. Criar Conta no Supabase
1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Login com GitHub (recomendado)

### 2. Criar Novo Projeto
1. Clique em **"New Project"**
2. Preencha:
   - **Name:** stylelink-saas
   - **Database Password:** [senha forte - SALVE!]
   - **Region:** South America (São Paulo) - `sa-east-1`
   - **Pricing Plan:** Free
3. Clique em **"Create new project"**
4. Aguarde 2-3 minutos (provisioning)

### 3. Obter Connection String
1. No projeto criado, vá em **Settings** → **Database**
2. Na seção **Connection string**, copie:
   - **Connection pooling** (recomendado para produção)
   - **Direct connection** (para migrations/development)

#### Formato Connection Pooling (use este):
```
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

#### Formato Direct Connection:
```
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
```

### 4. Backup dos Dados Atuais (Neon)

⚠️ **IMPORTANTE:** Faça backup antes de migrar!

#### Opção 1: pg_dump (se tiver dados)
```bash
# Instale PostgreSQL client se não tiver
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql

# Backup do schema + dados
pg_dump "postgresql://user:pass@neon.tech/dbname" > backup_neon.sql

# OU apenas dados (sem schema)
pg_dump --data-only "postgresql://user:pass@neon.tech/dbname" > backup_data.sql
```

#### Opção 2: Via Neon Dashboard
1. Acesse Neon Console
2. Vá em **Backups**
3. Faça download manual (se disponível no plano)

---

## 🔄 Passo a Passo da Migração {#migração}

### PASSO 1: Executar Migration no Supabase

1. **Abra o SQL Editor:**
   - Supabase Dashboard → **SQL Editor** (menu lateral)

2. **Cole o arquivo `SUPABASE-MIGRATION.sql`:**
   - Copie todo o conteúdo de `SUPABASE-MIGRATION.sql`
   - Cole no editor SQL
   - Clique em **"Run"** (ou Ctrl+Enter)

3. **Verifique os resultados:**
   - Você deve ver mensagens de sucesso
   - No final, aparecerá: `✅ Migração concluída com sucesso!`

4. **Confirme as tabelas criadas:**
   - Vá em **Table Editor** (menu lateral)
   - Você deve ver: `users`, `stores`, `products`, etc.

### PASSO 2: Verificar Índices e Triggers

No SQL Editor, execute:

```sql
-- Ver tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Ver índices
SELECT
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Ver triggers
SELECT
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

**Resultado esperado:**
- 7 tabelas (users, stores, products, social_links, highlights, subscriptions, analytics)
- 17 índices
- 5 triggers (update_*_updated_at)

### PASSO 3: Testar Insert Manual

No SQL Editor, execute:

```sql
-- Criar usuário de teste
INSERT INTO users (email, password_hash, store_slug, email_verified)
VALUES (
    'teste@stylelink.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- senha: demo123
    'lojadeteste',
    true
)
RETURNING *;

-- Copie o UUID retornado
-- Criar store para o usuário
INSERT INTO stores (user_id, store_name, bio)
VALUES (
    'COLE-O-UUID-AQUI',
    'Loja de Teste',
    'Testando migração'
)
RETURNING *;

-- Verificar
SELECT u.email, u.store_slug, s.store_name
FROM users u
JOIN stores s ON s.user_id = u.id
WHERE u.email = 'teste@stylelink.com';
```

Se retornar dados, **migração OK!** ✅

---

## 💻 Atualizar Código do Backend {#backend}

### PASSO 1: Atualizar `.env`

```env
# ANTES (Neon)
DATABASE_URL=postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb

# DEPOIS (Supabase - Connection Pooling)
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres

# Adicionar (opcional - para Supabase Storage)
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  # Pegar em Settings → API
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Pegar em Settings → API
```

### PASSO 2: Atualizar Configuração do PostgreSQL

**Arquivo:** `backend/src/database/connection.js` (se existir)

Adicione SSL para produção:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Supabase usa SSL
  },
  max: 20, // Conexões máximas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
```

### PASSO 3: Atualizar Sistema de Migrations

**Arquivo:** `backend/src/database/migrate.js`

Certifique-se de que ele detecta Supabase:

```javascript
// Verificar se já foi migrado
const checkMigration = async (filename) => {
  const result = await pool.query(
    'SELECT 1 FROM information_schema.tables WHERE table_name = $1',
    ['users']
  );
  return result.rows.length > 0;
};
```

### PASSO 4: Testar Conexão

```bash
cd backend
node -e "const pool = require('./src/database/connection'); pool.query('SELECT NOW()').then(r => console.log('✅ Conectado:', r.rows[0])).catch(e => console.error('❌ Erro:', e.message))"
```

Esperado: `✅ Conectado: { now: '2025-12-18T...' }`

---

## 📦 Migração de Dados (se existirem) {#dados}

### Se você tem dados no Neon:

#### Opção 1: Dump SQL

```bash
# 1. Exportar dados do Neon (apenas dados, sem schema)
pg_dump --data-only --column-inserts \
  "postgresql://user:pass@neon-host/db" \
  > data_only.sql

# 2. Importar no Supabase
psql "postgresql://postgres:pass@supabase-host/db" < data_only.sql
```

#### Opção 2: Script Node.js (mais seguro)

```javascript
// migrate-data.js
const { Pool } = require('pg');

const neonPool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL
});

const supabasePool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateTable(tableName) {
  console.log(`Migrando ${tableName}...`);

  // 1. Buscar dados do Neon
  const { rows } = await neonPool.query(`SELECT * FROM ${tableName}`);
  console.log(`  Encontrados ${rows.length} registros`);

  // 2. Inserir no Supabase
  for (const row of rows) {
    const columns = Object.keys(row);
    const values = Object.values(row);
    const placeholders = columns.map((_, i) => `$${i + 1}`);

    await supabasePool.query(
      `INSERT INTO ${tableName} (${columns.join(', ')})
       VALUES (${placeholders.join(', ')})
       ON CONFLICT DO NOTHING`,
      values
    );
  }

  console.log(`  ✅ ${tableName} migrado!`);
}

async function migrate() {
  const tables = [
    'users',
    'stores',
    'products',
    'social_links',
    'highlights',
    'subscriptions',
    'analytics'
  ];

  for (const table of tables) {
    await migrateTable(table);
  }

  console.log('🎉 Migração concluída!');
  process.exit(0);
}

migrate().catch(console.error);
```

Executar:
```bash
NEON_DATABASE_URL="..." SUPABASE_DATABASE_URL="..." node migrate-data.js
```

#### Opção 3: Via Supabase Dashboard

1. Vá em **Table Editor**
2. Selecione a tabela (ex: `users`)
3. Clique em **Insert row**
4. Preencha manualmente (só para poucos dados)

---

## 🧪 Testes {#testes}

### 1. Teste de Conexão
```bash
cd backend
npm start
```

Verifique logs:
```
✅ Conectado ao PostgreSQL
✅ Migrations executadas com sucesso
✅ Servidor rodando na porta 3000
```

### 2. Teste de Autenticação

```bash
# Registrar novo usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste2@stylelink.com",
    "password": "senha123",
    "storeSlug": "lojateste2"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste2@stylelink.com",
    "password": "senha123"
  }'
```

Esperado: Token JWT retornado

### 3. Teste de CRUD

```bash
# Criar produto (substitua TOKEN pelo JWT)
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "price": 99.90,
    "description": "Testando Supabase"
  }'

# Listar produtos
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer TOKEN"
```

### 4. Verificar no Supabase Dashboard

1. **Table Editor** → `products`
2. Você deve ver o produto criado
3. `created_at` e `updated_at` devem estar preenchidos automaticamente

---

## 🐛 Troubleshooting {#troubleshooting}

### Erro: "password authentication failed"

**Causa:** Senha incorreta ou connection string errada

**Solução:**
1. Vá em Supabase → Settings → Database
2. Clique em **Reset Database Password**
3. Copie a nova connection string
4. Atualize `.env`

### Erro: "SSL connection required"

**Causa:** Supabase exige SSL

**Solução:** Adicione SSL na config:
```javascript
ssl: { rejectUnauthorized: false }
```

### Erro: "relation 'users' does not exist"

**Causa:** Migration não foi executada

**Solução:**
1. Execute `SUPABASE-MIGRATION.sql` no SQL Editor
2. Verifique se as tabelas existem: `\dt` (psql) ou Table Editor

### Erro: "too many connections"

**Causa:** Pool de conexões saturado

**Solução:** Use Connection Pooling (porta 6543):
```
...pooler.supabase.com:6543/postgres
```

### Erro: "column 'background_color' does not exist"

**Causa:** Migration 003 não foi executada

**Solução:** Execute manualmente:
```sql
ALTER TABLE stores ADD COLUMN background_color VARCHAR(7) DEFAULT '#ffffff';
```

### Performance lenta em queries

**Causa:** Região errada ou índices faltando

**Solução:**
1. Verifique se criou projeto em `sa-east-1` (São Paulo)
2. Confirme índices: `SELECT * FROM pg_indexes WHERE schemaname = 'public'`
3. Se faltando, re-execute `SUPABASE-MIGRATION.sql`

---

## 🎯 Checklist Final

Antes de ir para produção:

- [ ] ✅ Backup do Neon feito
- [ ] ✅ Projeto Supabase criado (região correta)
- [ ] ✅ `SUPABASE-MIGRATION.sql` executado sem erros
- [ ] ✅ 7 tabelas criadas
- [ ] ✅ 17 índices criados
- [ ] ✅ 5 triggers criados
- [ ] ✅ Dados migrados (se existiam)
- [ ] ✅ `.env` atualizado com nova DATABASE_URL
- [ ] ✅ SSL configurado no Pool
- [ ] ✅ Teste de conexão OK
- [ ] ✅ Teste de registro OK
- [ ] ✅ Teste de login OK
- [ ] ✅ Teste de CRUD OK
- [ ] ✅ Verificado no Table Editor
- [ ] ✅ Variáveis de ambiente em produção atualizadas (Railway/Vercel)

---

## 📚 Próximos Passos (Opcional)

### 1. Migrar Upload de Imagens para Supabase Storage

**Vantagens:**
- Elimina Cloudinary (custo)
- Tudo centralizado
- Transformações de imagem nativas

**Como fazer:**
1. Supabase Dashboard → **Storage**
2. Criar bucket: `product-images` (public)
3. Atualizar código de upload:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadImage(file, userId) {
  const fileName = `${userId}/${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return publicUrl;
}
```

### 2. Usar Supabase Auth (opcional)

Substituir JWT manual por Supabase Auth:

**Vantagens:**
- Email verification automático
- Password reset automático
- OAuth (Google, GitHub) fácil

**Desvantagens:**
- Lock-in maior
- Precisa refatorar autenticação

### 3. Habilitar Realtime (futuro)

Para atualizar analytics em tempo real:

```javascript
const channel = supabase
  .channel('analytics-updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'analytics'
  }, payload => {
    console.log('Nova métrica:', payload.new);
  })
  .subscribe();
```

---

## 📞 Suporte

- **Supabase Docs:** https://supabase.com/docs
- **Discord Supabase:** https://discord.supabase.com
- **Stack Overflow:** [tag: supabase]

---

**Criado em:** 2025-12-18
**Versão:** 1.0
**Testado com:** PostgreSQL 15 (Supabase)
