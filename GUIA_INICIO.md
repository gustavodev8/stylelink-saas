# 🚀 Guia de Início Rápido - StyleLink SaaS

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 16 ou superior)
- **PostgreSQL** (versão 14 ou superior)
- **Git**

## ⚙️ Configuração Inicial

### 1. Clone o repositório (se ainda não fez)

```bash
git clone https://github.com/seu-usuario/stylelink-saas.git
cd stylelink-saas
```

### 2. Configure o Banco de Dados

#### Criar o banco de dados PostgreSQL:

```bash
# Entre no PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE stylelink;

# Saia do psql
\q
```

#### Execute o schema para criar as tabelas:

```bash
psql -U postgres -d stylelink -f backend/src/database/migrations/001_schema_completo.sql
```

### 3. Configure as Variáveis de Ambiente

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` e preencha as informações:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:suasenha@localhost:5432/stylelink

# JWT Secret (gere uma chave forte)
JWT_SECRET=sua_chave_secreta_aqui

# Cloudinary (cadastre-se em https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Email (configure Gmail ou outro SMTP)
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app

# Mercado Pago (opcional para testes)
MERCADOPAGO_ACCESS_TOKEN=seu_token
```

### 4. Instale as Dependências

```bash
# Ainda na pasta backend
npm install
```

### 5. Inicie o Servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor estará rodando em: **http://localhost:3000**

### 6. Teste a API

Abra o navegador e acesse:
- http://localhost:3000 (deve mostrar mensagem de boas-vindas)
- http://localhost:3000/health (deve mostrar status ok)

## 🖥️ Frontend

### Admin Panel

```bash
# Em outro terminal, vá para a pasta do frontend admin
cd frontend/admin

# Sirva os arquivos (escolha um método)

# Opção 1: Python
python -m http.server 8080

# Opção 2: Node.js
npx http-server -p 8080

# Opção 3: VS Code Live Server
# Clique com botão direito em index.html > Open with Live Server
```

Acesse: **http://localhost:8080**

### Página Pública

```bash
# Em outro terminal
cd frontend/public
python -m http.server 8081
```

Acesse: **http://localhost:8081**

## 🧪 Testando o Sistema

### 1. Criar uma conta

1. Acesse http://localhost:8080
2. Clique em "Cadastre-se"
3. Preencha:
   - Email: teste@exemplo.com
   - Senha: 123456
   - Nome da Loja: Minha Loja
   - Link: minhaloja

### 2. Adicionar produtos

1. Faça login
2. Vá em "Produtos"
3. Clique em "Adicionar Produto"
4. Preencha as informações

### 3. Ver sua página pública

Acesse: http://localhost:8081/?slug=minhaloja

## 📚 Estrutura do Projeto

```
stylelink-saas/
├── backend/
│   ├── src/
│   │   ├── config/         # Configurações (DB, Cloudinary)
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── middleware/     # Autenticação, Upload, Validação
│   │   ├── models/         # Modelos do banco
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Serviços externos
│   │   ├── database/       # Migrations
│   │   ├── app.js          # Configuração Express
│   │   └── server.js       # Servidor
│   └── package.json
│
├── frontend/
│   ├── admin/             # Painel Administrativo
│   └── public/            # Página Pública
│
└── README.md
```

## 🔑 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Cadastrar
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil (requer token)
- `GET /api/auth/check-slug/:slug` - Verificar disponibilidade

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Loja
- `GET /api/store` - Obter informações
- `PUT /api/store` - Atualizar informações

### Redes Sociais
- `GET /api/social` - Listar links
- `POST /api/social` - Criar/atualizar link
- `DELETE /api/social/:platform` - Deletar link

### Página Pública
- `GET /api/page/:slug` - Obter página da loja

### Upload
- `POST /api/upload/single` - Upload de imagem
- `POST /api/upload/multiple` - Upload múltiplo

## 🐛 Troubleshooting

### Erro de conexão com o banco
- Verifique se o PostgreSQL está rodando
- Confira as credenciais no .env
- Teste a conexão: `psql -U postgres -d stylelink`

### Erro de CORS
- Verifique se as URLs no .env estão corretas
- Reinicie o servidor backend

### Erro de JWT
- Certifique-se de que JWT_SECRET está configurado
- Limpe o localStorage do navegador

## 📝 Próximos Passos

1. Configure o Cloudinary para upload de imagens
2. Configure o email (SMTP) para notificações
3. Configure o Mercado Pago para pagamentos
4. Customize os templates da página pública
5. Faça o deploy (Railway, Vercel, etc)

## 💡 Dicas

- Use o modo development (`npm run dev`) para ter hot reload
- Teste todas as rotas usando Postman ou Insomnia
- Leia a documentação dos serviços (Cloudinary, Mercado Pago)
- Mantenha suas chaves secretas seguras (.env não deve ir pro Git)

## 🆘 Precisa de Ajuda?

- Veja o README.md para mais informações
- Consulte a documentação das tecnologias usadas
- Abra uma issue no GitHub

---

**Feito com ❤️ por Gustavo**
