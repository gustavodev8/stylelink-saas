# 🚀 Deploy do StyleLink no Railway

Guia completo para fazer deploy do StyleLink SaaS no Railway (hospedagem gratuita que nunca dorme).

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

1. ✅ Conta no GitHub (para conectar o repositório)
2. ✅ Conta no Railway (https://railway.app)
3. ✅ Conta no Cloudinary (upload de imagens - GRÁTIS)
4. ✅ Conta de email Gmail (para enviar emails)

---

## 🎯 Passo a Passo Completo

### 1️⃣ Preparar o Código no GitHub

**1.1 - Commit e Push do código:**

```bash
git add .
git commit -m "feat: Preparar projeto para deploy no Railway"
git push origin main
```

Se você ainda não tem um repositório no GitHub:

```bash
# Criar repositório no GitHub primeiro (https://github.com/new)
# Depois:
git remote add origin https://github.com/SEU_USUARIO/stylelink-saas.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Criar Conta no Cloudinary (Upload de Imagens)

**2.1 - Criar conta gratuita:**
- Acesse: https://cloudinary.com/users/register/free
- Preencha os dados e crie sua conta
- Após login, você verá o **Dashboard**

**2.2 - Copiar credenciais:**
No Dashboard, você verá:
```
Cloud Name: seu_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnop
```

**Guarde essas 3 informações!** Você vai precisar delas no Railway.

---

### 3️⃣ Configurar Gmail para Enviar Emails

**3.1 - Ativar verificação em 2 etapas:**
- Acesse: https://myaccount.google.com/security
- Ative "Verificação em duas etapas"

**3.2 - Criar senha de app:**
- Acesse: https://myaccount.google.com/apppasswords
- Escolha "Outro (nome personalizado)"
- Digite: "StyleLink SaaS"
- Clique em "Gerar"
- **Copie a senha de 16 dígitos** (exemplo: `abcd efgh ijkl mnop`)

**Guarde essa senha!** Você vai usar no Railway.

---

### 4️⃣ Deploy no Railway

**4.1 - Acessar Railway:**
- Acesse: https://railway.app
- Clique em "Login" e conecte com GitHub
- Autorize o Railway a acessar seus repositórios

**4.2 - Criar novo projeto:**
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório **stylelink-saas**
4. O Railway vai detectar automaticamente que é um projeto Node.js

**4.3 - Adicionar PostgreSQL:**
1. No projeto, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. Aguarde a criação (leva ~30 segundos)

**4.4 - Configurar Variáveis de Ambiente:**

1. Clique no serviço principal (não no PostgreSQL)
2. Vá na aba **"Variables"**
3. Clique em **"+ New Variable"** e adicione TODAS as variáveis abaixo:

```bash
# Servidor
PORT=3000
NODE_ENV=production

# JWT Secret (gere um aqui: https://generate-secret.vercel.app/32)
JWT_SECRET=sua_chave_secreta_forte_64_caracteres

# Cloudinary (copie do dashboard do Cloudinary)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Email Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop

# Mercado Pago (OPCIONAL - pode deixar em branco por enquanto)
MERCADOPAGO_ACCESS_TOKEN=
```

**IMPORTANTE:**
- A variável `DATABASE_URL` será criada **automaticamente** pelo Railway quando você adicionar o PostgreSQL
- Para gerar JWT_SECRET forte: https://generate-secret.vercel.app/32

**4.5 - Conectar o Banco de Dados:**

1. Clique no serviço do PostgreSQL
2. Vá na aba **"Variables"**
3. Copie o valor de `DATABASE_URL`
4. Volte no serviço principal
5. Cole em uma nova variável chamada `DATABASE_URL`

**OU (mais fácil):**

1. Clique no serviço principal
2. Vá em **"Variables"**
3. Clique em **"Reference from Service"**
4. Selecione o PostgreSQL
5. Escolha a variável `DATABASE_URL`

**4.6 - Deploy Automático:**

Após adicionar as variáveis:
1. O Railway vai fazer deploy automaticamente
2. Acompanhe os logs na aba **"Deployments"**
3. Aguarde aparecer "Build completed" e "Deployment live"

**4.7 - Obter URL do seu app:**

1. Clique no serviço principal
2. Vá na aba **"Settings"**
3. Role até **"Domains"**
4. Clique em **"Generate Domain"**
5. Copie a URL: `https://seu-app.up.railway.app`

---

### 5️⃣ Configurar URLs no Código

**5.1 - Atualizar variáveis de ambiente no Railway:**

Volte nas variáveis e atualize:

```bash
FRONTEND_ADMIN_URL=https://seu-app.up.railway.app
FRONTEND_PUBLIC_URL=https://seu-app.up.railway.app
BACKEND_URL=https://seu-app.up.railway.app
```

Substitua `seu-app` pelo domínio que o Railway gerou.

**5.2 - Fazer deploy novamente:**

O Railway vai fazer redeploy automaticamente após salvar as variáveis.

---

### 6️⃣ Configurar CORS no Backend (se necessário)

Se você tiver problemas de CORS, vamos adicionar o domínio do Railway:

**Editar localmente e fazer push:**

```bash
# Edite backend/src/app.js
# Adicione o domínio Railway na configuração do CORS
git add .
git commit -m "fix: Adicionar domínio Railway ao CORS"
git push
```

O Railway vai fazer deploy automático a cada push no GitHub!

---

### 7️⃣ Testar o Sistema

**7.1 - Acessar o Admin Panel:**
```
https://seu-app.up.railway.app/admin/
```

**7.2 - Criar uma conta:**
- Acesse o registro
- Preencha email, senha e **slug** (exemplo: `minha-loja`)
- Você vai receber um email de verificação

**7.3 - Verificar email:**
- Abra seu email
- Clique no link de verificação
- Faça login

**7.4 - Adicionar produtos:**
- Vá em "Produtos"
- Adicione alguns produtos com imagens

**7.5 - Acessar sua página pública:**
```
https://seu-app.up.railway.app/public/?slug=minha-loja
```

---

## 🎉 Pronto! Seu SaaS está no ar!

Agora você tem:
- ✅ Backend rodando 24/7 (nunca dorme)
- ✅ PostgreSQL gratuito
- ✅ Upload de imagens funcionando
- ✅ Email de verificação funcionando
- ✅ SSL automático (HTTPS)
- ✅ Deploy automático a cada push no GitHub

---

## 📊 Monitoramento

**Ver logs em tempo real:**
1. Acesse o projeto no Railway
2. Clique no serviço
3. Vá na aba **"Deployments"**
4. Clique no deployment ativo
5. Role para ver os logs

**Ver uso de recursos:**
- Railway mostra CPU, RAM e tráfego
- Você tem **$5/mês grátis** de crédito
- Geralmente suficiente para ~500GB de tráfego

---

## 🔧 Troubleshooting

### ❌ Build falhou

**Erro: "Cannot find module"**
```bash
# Verifique se backend/package.json tem todas as dependências
# Faça commit e push novamente
```

**Erro: "ECONNREFUSED database"**
```bash
# Verifique se a variável DATABASE_URL está configurada
# Deve apontar para o PostgreSQL do Railway
```

### ❌ App não abre

**Erro 502 Bad Gateway:**
```bash
# Verifique os logs no Railway
# Provavelmente erro de PORT ou DATABASE_URL
```

### ❌ Upload de imagem não funciona

**Erro ao fazer upload:**
```bash
# Verifique as credenciais do Cloudinary
# CLOUDINARY_CLOUD_NAME, API_KEY e API_SECRET devem estar corretos
```

### ❌ Email não envia

**Erro SMTP:**
```bash
# Verifique se ativou "verificação em 2 etapas" no Gmail
# Verifique se criou uma "senha de app"
# Use a senha de app (16 dígitos), NÃO a senha normal do Gmail
```

---

## 🆙 Próximos Passos

**1. Domínio Personalizado:**
- Railway permite adicionar domínio customizado
- Exemplo: `stylelink.com.br`
- Vá em Settings > Domains > Custom Domain

**2. Backup do Banco:**
- Railway faz backup automático do PostgreSQL
- Você pode exportar manualmente em Database > Data > Export

**3. Monitorar Erros:**
- Integre com Sentry (gratuito): https://sentry.io
- Receba alertas de erros em tempo real

**4. Analytics:**
- Adicione Google Analytics
- Integre com Plausible (alternativa privada)

---

## 💰 Custos

**Plano Gratuito Railway:**
- ✅ $5 em créditos/mês
- ✅ ~500GB de tráfego
- ✅ PostgreSQL incluído
- ✅ SSL grátis
- ✅ Deploy ilimitados

**Se precisar mais:**
- Plano Hobby: $5/mês (mais créditos)
- Plano Pro: $20/mês (recursos dedicados)

Para começar, o plano gratuito é suficiente!

---

## 🆘 Precisa de Ajuda?

**Documentação Railway:**
- https://docs.railway.app

**Discord Railway:**
- https://discord.gg/railway

**Suporte StyleLink:**
- Abra uma issue no GitHub do projeto

---

## ✅ Checklist Final

Antes de compartilhar seu app, verifique:

- [ ] App abrindo em `https://seu-app.railway.app/admin/`
- [ ] Consegue criar conta
- [ ] Email de verificação chegando
- [ ] Consegue fazer login
- [ ] Consegue adicionar produtos
- [ ] Upload de imagens funcionando
- [ ] Página pública abrindo: `/public/?slug=seu-slug`
- [ ] Produtos aparecendo na página pública
- [ ] Links de WhatsApp funcionando
- [ ] Design responsivo no celular

---

🎊 **Parabéns! Seu SaaS StyleLink está no ar!** 🎊

Agora você pode compartilhar o link com seus clientes e começar a vender!
