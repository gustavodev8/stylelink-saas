# 🚀 StyleLink SaaS - Plataforma para Lojas de Roupa

**Sistema completo de "Link na Bio" para lojas de roupa com painel administrativo**

---

## 📋 Sobre o Projeto

StyleLink é uma plataforma SaaS que permite lojas de roupa criarem sua própria página personalizada (link na bio) para exibir:
- ✅ Catálogo de produtos com fotos
- ✅ Informações de contato e localização
- ✅ Links para redes sociais
- ✅ Destaques e produtos mais vendidos
- ✅ Integração direta com WhatsApp

**Diferencial:** O lojista gerencia tudo através de um painel administrativo intuitivo, sem precisar de conhecimento técnico.

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
│   │   ├── middleware/   # Middlewares (auth, upload, etc)
│   │   ├── models/       # Modelos do banco
│   │   ├── routes/       # Rotas da API
│   │   ├── services/     # Serviços externos
│   │   ├── utils/        # Utilitários
│   │   └── database/     # Migrations e Seeds
│   └── package.json
│
├── frontend/
│   ├── admin/            # Painel Administrativo
│   └── public/           # Páginas Públicas
│
└── docs/                 # Documentação
```

---

## 🚀 Como Começar

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/stylelink-saas.git
cd stylelink-saas
```

### 2. Instale as dependências
```bash
cd backend
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### 4. Configure o banco de dados
```bash
# Execute o schema SQL
psql -U seu_usuario -d stylelink -f src/database/migrations/001_schema_completo.sql

# Ou use o script de setup
npm run migrate
```

### 5. Inicie o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará rodando em: `http://localhost:3000`

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

## 📡 API Endpoints (a serem implementados)

### Autenticação
- `POST /api/auth/register` - Cadastrar nova loja
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Recuperar senha

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Loja
- `GET /api/store` - Obter informações da loja
- `PUT /api/store` - Atualizar informações da loja

### Página Pública
- `GET /api/page/:slug` - Obter página pública da loja

---

## 💰 Modelo de Negócio

**Plano Único:** R$ 79,90/mês
- Produtos ilimitados
- Templates personalizáveis
- Analytics básico
- Suporte via WhatsApp

---

## 🎯 Roadmap

### Fase 1 - MVP (12 dias) ✅
- [x] Estrutura do projeto
- [ ] Backend API completo
- [ ] Painel administrativo
- [ ] Página pública
- [ ] Sistema de pagamento
- [ ] Deploy inicial

### Fase 2 - Melhorias
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
