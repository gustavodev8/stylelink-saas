# 🚀 StyleLink SaaS - Plataforma Link in Bio

**Sistema completo de "Link in Bio" com painel administrativo profissional**

---

## 📋 Sobre o Projeto

StyleLink é uma plataforma SaaS que permite criar páginas personalizadas "link in bio" para exibir:
- ✅ Catálogo de produtos com fotos e preços
- ✅ Página pública moderna e responsiva
- ✅ Links para redes sociais
- ✅ Analytics e métricas de acesso
- ✅ Integração direta com WhatsApp
- ✅ Dashboard completo para gerenciar tudo
- ✅ Sistema de registro e autenticação

**Diferencial:** O cliente gerencia tudo através de um painel administrativo intuitivo, sem precisar de conhecimento técnico. Cada cliente tem seu próprio link único (ex: `stylelink.com/seu-slug`).

---

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- PostgreSQL
- JWT (Autenticação)
- Cloudinary (Upload de imagens)
- SendGrid (Emails)
- Mercado Pago (Pagamentos)

### Frontend
- HTML5 + CSS3 + JavaScript Vanilla
- Design responsivo
- Templates personalizáveis

### Hospedagem
- Railway (Backend + PostgreSQL)
- Cloudinary (Imagens)

---

## 📁 Estrutura do Projeto

```
stylelink-saas/
├── backend/              # API Node.js
│   ├── src/
│   │   ├── config/       # Configurações (DB, Cloudinary, etc)
│   │   ├── controllers/  # Lógica de negócio
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── storeController.js
│   │   │   ├── socialController.js
│   │   │   └── pageController.js
│   │   ├── middleware/   # Middlewares (auth, upload, validação)
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   └── validator.js
│   │   ├── models/       # Modelos do banco
│   │   │   ├── User.js
│   │   │   ├── Store.js
│   │   │   ├── Product.js
│   │   │   └── SocialLink.js
│   │   ├── routes/       # Rotas da API
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── store.js
│   │   │   ├── social.js
│   │   │   ├── page.js
│   │   │   └── upload.js
│   │   ├── services/     # Serviços externos
│   │   │   ├── cloudinaryService.js
│   │   │   ├── emailService.js
│   │   │   └── paymentService.js
│   │   ├── database/     # Migrations
│   │   │   └── migrations/
│   │   │       └── 001_schema_completo.sql
│   │   ├── app.js        # Configuração Express
│   │   └── server.js     # Servidor
│   ├── .env.example      # Exemplo de variáveis de ambiente
│   └── package.json
│
├── frontend/
│   ├── admin/            # Painel Administrativo
│   │   ├── css/
│   │   ├── js/
│   │   ├── pages/
│   │   └── index.html
│   └── public/           # Página Pública
│       ├── css/
│       ├── js/
│       └── index.html
│
├── README.md
└── GUIA_INICIO.md        # Guia de início rápido
```

---

## 🚀 Como Começar

**Veja o [GUIA_INICIO.md](GUIA_INICIO.md) para instruções detalhadas passo a passo!**

### Resumo Rápido

1. Clone o repositório
2. Configure o PostgreSQL e execute o schema
3. Configure o arquivo `.env` (copie de `.env.example`)
4. Instale dependências: `npm install`
5. Inicie o servidor: `npm run dev`
6. Acesse: `http://localhost:3000`

Para frontend:
- Admin: `http://localhost:8080`
- Public: `http://localhost:8081`

---

## 📊 Banco de Dados

### Tabelas Principais:
- **users** - Lojas cadastradas
- **stores** - Informações das lojas
- **products** - Produtos cadastrados
- **social_links** - Links de redes sociais
- **highlights** - Produtos em destaque
- **subscriptions** - Histórico de pagamentos
- **analytics** - Métricas de acesso

Veja o schema completo em: `backend/src/database/migrations/001_schema_completo.sql`

---

## 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=sua_chave_secreta

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# SendGrid
SENDGRID_API_KEY=...

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=...
```

---

## 📡 API Endpoints

### Autenticação
- ✅ `POST /api/auth/register` - Cadastrar nova loja
- ✅ `POST /api/auth/login` - Login
- ✅ `GET /api/auth/profile` - Obter perfil do usuário
- ✅ `GET /api/auth/check-slug/:slug` - Verificar disponibilidade de slug

### Produtos
- ✅ `GET /api/products` - Listar produtos (com filtros)
- ✅ `GET /api/products/:id` - Buscar produto por ID
- ✅ `POST /api/products` - Criar produto
- ✅ `PUT /api/products/:id` - Atualizar produto
- ✅ `DELETE /api/products/:id` - Deletar produto

### Loja
- ✅ `GET /api/store` - Obter informações da loja
- ✅ `PUT /api/store` - Atualizar informações da loja

### Redes Sociais
- ✅ `GET /api/social` - Listar links sociais
- ✅ `POST /api/social` - Criar/atualizar link social
- ✅ `DELETE /api/social/:platform` - Deletar link social

### Página Pública
- ✅ `GET /api/page/:slug` - Obter página pública da loja
- ✅ `POST /api/page/track/product/:productId` - Registrar visualização
- ✅ `POST /api/page/track/whatsapp/:productId` - Registrar clique WhatsApp
- ✅ `POST /api/page/track/social/:slug/:platform` - Registrar clique social

### Upload
- ✅ `POST /api/upload/single` - Upload de uma imagem
- ✅ `POST /api/upload/multiple` - Upload de múltiplas imagens

---

## 💰 Modelo de Negócio

**Plano Único:** R$ 79,90/mês
- Produtos ilimitados
- Templates personalizáveis
- Analytics básico
- Suporte via WhatsApp

---

## 🎯 Roadmap

### Fase 1 - MVP ✅
- [x] Estrutura do projeto
- [x] Backend API completo
  - [x] Autenticação (JWT)
  - [x] CRUD de produtos
  - [x] Gerenciamento de loja
  - [x] Links sociais
  - [x] Página pública
  - [x] Upload de imagens
- [x] Models e banco de dados
- [x] Middlewares (auth, upload, validação)
- [x] Services (Cloudinary, Email, Pagamento)
- [x] Estrutura básica do frontend
  - [x] Admin panel (login, dashboard)
  - [x] Página pública (template 1)

### Fase 2 - Implementações Pendentes
- [ ] Completar todas as páginas do admin
  - [ ] Gerenciamento de produtos
  - [ ] Edição da loja
  - [ ] Configurações
- [ ] Sistema de pagamento (Mercado Pago)
- [ ] Envio de emails
- [ ] Deploy inicial

### Fase 3 - Melhorias Futuras
- [ ] Analytics avançado
- [ ] Múltiplos templates
- [ ] Domínio personalizado
- [ ] Sistema de cupons
- [ ] App mobile

---

## 👨‍💻 Desenvolvedor

**Gustavo**
- GitHub: [seu-github]
- Email: [seu-email]

---

## 📄 Licença

MIT License - Veja LICENSE para mais detalhes

---

## 🙏 Agradecimentos

Projeto desenvolvido como parte da Situação de Aprendizagem SA 01 - SENAI
- Turma: G96379
- Docente: Marcos Vinicius
- Unidade Curricular: Programação de Apps

---

**🚀 Vamos transformar lojas de roupa em negócios digitais de sucesso!**
