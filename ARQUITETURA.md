# 🏗️ Arquitetura do StyleLink SaaS

## 📊 Resumo Estatístico

- **25 arquivos** JavaScript no backend
- **6 arquivos** HTML/CSS/JS no frontend
- **7 tabelas** no banco de dados
- **6 rotas** principais da API
- **30+ endpoints** REST

## 🗂️ Estrutura de Pastas

```
stylelink-saas/
│
├── 📁 backend/                    # Backend Node.js + Express
│   ├── 📁 src/
│   │   ├── 📁 config/             # Configurações
│   │   │   ├── database.js        # Pool do PostgreSQL
│   │   │   └── cloudinary.js      # Config do Cloudinary
│   │   │
│   │   ├── 📁 models/             # Modelos de Dados
│   │   │   ├── User.js            # Usuários/Lojas
│   │   │   ├── Store.js           # Informações da loja
│   │   │   ├── Product.js         # Produtos
│   │   │   └── SocialLink.js      # Redes sociais
│   │   │
│   │   ├── 📁 controllers/        # Lógica de Negócio
│   │   │   ├── authController.js  # Registro, Login, JWT
│   │   │   ├── productController.js  # CRUD de produtos
│   │   │   ├── storeController.js    # Gerenciar loja
│   │   │   ├── socialController.js   # Links sociais
│   │   │   └── pageController.js     # Página pública
│   │   │
│   │   ├── 📁 middleware/         # Middlewares
│   │   │   ├── auth.js            # Autenticação JWT
│   │   │   ├── upload.js          # Multer para upload
│   │   │   └── validator.js       # Validação de dados
│   │   │
│   │   ├── 📁 routes/             # Rotas da API
│   │   │   ├── auth.js            # /api/auth/*
│   │   │   ├── products.js        # /api/products/*
│   │   │   ├── store.js           # /api/store/*
│   │   │   ├── social.js          # /api/social/*
│   │   │   ├── page.js            # /api/page/*
│   │   │   └── upload.js          # /api/upload/*
│   │   │
│   │   ├── 📁 services/           # Serviços Externos
│   │   │   ├── cloudinaryService.js  # Upload de imagens
│   │   │   ├── emailService.js       # Envio de emails
│   │   │   └── paymentService.js     # Mercado Pago
│   │   │
│   │   ├── 📁 database/           # Migrations
│   │   │   └── migrations/
│   │   │       └── 001_schema_completo.sql
│   │   │
│   │   ├── app.js                 # Express config
│   │   └── server.js              # Servidor HTTP
│   │
│   ├── .env.example               # Template de variáveis
│   └── package.json               # Dependências
│
├── 📁 frontend/                   # Frontend (HTML/CSS/JS)
│   ├── 📁 admin/                  # Painel Admin
│   │   ├── 📁 css/
│   │   │   └── style.css          # Estilos globais
│   │   ├── 📁 js/
│   │   │   └── api.js             # Cliente API
│   │   ├── 📁 pages/
│   │   │   └── dashboard.html     # Dashboard
│   │   └── index.html             # Login
│   │
│   └── 📁 public/                 # Página Pública
│       ├── 📁 css/
│       │   └── template1.css      # Template da loja
│       └── index.html             # Página da loja
│
├── README.md                      # Documentação principal
├── GUIA_INICIO.md                 # Guia de setup
└── ARQUITETURA.md                 # Este arquivo
```

## 🔄 Fluxo de Dados

### 1. Registro de Usuário
```
Frontend (register)
  → POST /api/auth/register
    → authController.register()
      → User.create() → PostgreSQL
        → Store.create() → PostgreSQL
          ← JWT Token
        ← User data
      ← Response
    ← Login automático
```

### 2. Adicionar Produto
```
Frontend (product form)
  → Upload imagem
    → POST /api/upload/single
      → Cloudinary
        ← URL da imagem
      ← Image URL

  → POST /api/products
    → [auth middleware] verifica JWT
      → productController.create()
        → Product.create() → PostgreSQL
          ← Produto criado
        ← Response
      ← Produto salvo
```

### 3. Visualizar Página Pública
```
Browser
  → GET /api/page/:slug
    → pageController.getPublicPage()
      → User.findBySlug()
        → Store.findByUserId()
          → Product.findByUserId()
            → SocialLink.findActiveByUserId()
              ← Dados completos da loja
            ← Todos os dados
          ← Response JSON
        ← Renderiza página
```

## 🗄️ Banco de Dados

### Modelo Relacional

```
users (lojas cadastradas)
  ├── id (UUID, PK)
  ├── email (unique)
  ├── password_hash
  ├── store_slug (unique)
  ├── subscription_status
  └── trial_end_date

stores (1:1 com users)
  ├── id (UUID, PK)
  ├── user_id (FK → users.id)
  ├── store_name
  ├── bio
  ├── logo_url
  ├── banner_url
  ├── whatsapp
  ├── primary_color
  └── template_id

products (N:1 com users)
  ├── id (UUID, PK)
  ├── user_id (FK → users.id)
  ├── name
  ├── description
  ├── price
  ├── images (JSONB array)
  ├── sizes (JSONB array)
  ├── colors (JSONB array)
  ├── is_available
  └── is_featured

social_links (N:1 com users)
  ├── id (UUID, PK)
  ├── user_id (FK → users.id)
  ├── platform (instagram, facebook...)
  ├── url
  ├── username
  └── is_active

analytics (métricas diárias)
  ├── id (UUID, PK)
  ├── user_id (FK → users.id)
  ├── page_views
  ├── product_clicks
  ├── whatsapp_clicks
  └── date
```

## 🔐 Segurança

### Autenticação
- **JWT (JSON Web Token)** com expiração de 30 dias
- Senhas hashadas com **bcrypt** (10 rounds)
- Middleware de autenticação em rotas protegidas

### Proteções
- **Helmet.js** - Headers de segurança HTTP
- **CORS** configurado com whitelist de origins
- **Rate Limiting** - 100 requisições por 15 minutos
- **Validação de dados** com express-validator
- **Upload de arquivos** limitado a 5MB e tipos específicos

## 🚀 Tecnologias

### Backend
- **Node.js** 16+
- **Express.js** - Framework web
- **PostgreSQL** - Banco relacional
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos
- **Cloudinary** - Armazenamento de imagens
- **Nodemailer** - Envio de emails
- **Mercado Pago SDK** - Pagamentos

### Frontend
- **HTML5 + CSS3** - Estrutura e estilo
- **JavaScript Vanilla** - Lógica do cliente
- **Fetch API** - Requisições HTTP
- **LocalStorage** - Armazenamento de token

## 📡 API REST

### Padrão de Resposta

**Sucesso:**
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [ ... ]  // opcional
}
```

### Códigos HTTP
- `200` - OK
- `201` - Created
- `400` - Bad Request (validação)
- `401` - Unauthorized (sem/token inválido)
- `403` - Forbidden (sem permissão)
- `404` - Not Found
- `500` - Internal Server Error

## 🎨 Frontend

### Admin Panel
- **SPA** (Single Page Application)
- Autenticação via JWT (LocalStorage)
- Design responsivo (mobile-first)
- Comunicação com API via Fetch

### Página Pública
- **SSR** (renderização no cliente)
- Carregamento dinâmico via API
- Templates personalizáveis por cores
- Integração com WhatsApp

## 🔄 Próximas Melhorias

### Curto Prazo
1. Completar páginas do admin (products, store, social)
2. Implementar sistema de pagamento
3. Adicionar envio de emails transacionais
4. Sistema de analytics

### Médio Prazo
1. Múltiplos templates
2. Editor visual de temas
3. Dashboard de métricas
4. Sistema de notificações

### Longo Prazo
1. App mobile (React Native)
2. Domínio personalizado
3. Sistema de cupons/descontos
4. Integração com marketplaces

---

**Documentação criada em:** 05/12/2024
**Versão:** 1.0.0
**Autor:** Gustavo
