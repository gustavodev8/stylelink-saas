# 🎯 Como Usar o StyleLink SaaS

## 📍 Início Rápido

### 1. Iniciar Todos os Servidores

Execute o arquivo `start-all.bat` para iniciar automaticamente:
- **Backend API**: http://localhost:3000
- **Painel Admin**: http://localhost:8080
- **Página Pública**: http://localhost:8081

```bash
# Clique duas vezes em:
start-all.bat
```

### 2. Criar Sua Conta

1. Acesse: http://localhost:8080/admin/register.html
2. Preencha os dados:
   - Email
   - Senha
   - **Slug da loja** (ex: `minhaloja`) - Este será seu link único!
3. Clique em "Criar Conta"

### 3. Verificar Email

1. Verifique o console do backend para pegar o código de verificação
2. Acesse: http://localhost:8080/admin/verify.html
3. Cole o código e clique em "Verificar"

### 4. Fazer Login

1. Acesse: http://localhost:8080/admin/index.html
2. Entre com seu email e senha

## 🎨 Painel Administrativo

### Dashboard
- **URL**: http://localhost:8080/admin/pages/dashboard.html
- Visualize estatísticas da sua loja
- Veja total de produtos, visualizações
- Acesse rapidamente outras seções

### Produtos
- **URL**: http://localhost:8080/admin/pages/products.html
- Adicione novos produtos
- Faça upload de imagens
- Configure preços, cores e tamanhos
- Ative/desative produtos

### Configurações da Loja
- **URL**: http://localhost:8080/admin/pages/settings.html
- Configure nome e descrição da loja
- Adicione biografia
- Configure WhatsApp para contato

### Redes Sociais
- **URL**: http://localhost:8080/admin/pages/social.html (em breve)
- Adicione links do Instagram, Facebook, TikTok, etc
- Ative/desative redes sociais

### Analytics
- **URL**: http://localhost:8080/admin/pages/analytics.html
- Veja total de cliques no seu link
- Acompanhe visitantes únicos
- Visualize produtos mais vistos
- Analise fontes de tráfego (Instagram, WhatsApp, etc)

## 🌐 Página Pública (Link in Bio)

Sua página pública estará disponível em:
```
http://localhost:8081?slug=SEU_SLUG
```

**Exemplo**: Se seu slug é `minhaloja`:
```
http://localhost:8081?slug=minhaloja
```

### O que aparece na página pública:
- ✅ Avatar da loja
- ✅ Nome e descrição
- ✅ Botões de redes sociais
- ✅ Grid de produtos com fotos
- ✅ Botão "Comprar no WhatsApp" em cada produto
- ✅ Design moderno com gradiente roxo

## 🔄 Fluxo Completo

1. **Criar Conta** → Escolher slug único
2. **Verificar Email** → Confirmar conta
3. **Login** → Acessar painel admin
4. **Adicionar Produtos** → Upload de fotos, preços
5. **Configurar Loja** → Nome, bio, WhatsApp
6. **Adicionar Redes Sociais** → Instagram, TikTok, etc
7. **Compartilhar Link** → `http://stylelink.com/seu-slug`
8. **Acompanhar Analytics** → Ver cliques e visualizações

## 📱 Copiar Link da Loja

No Dashboard, você verá um banner com:
- **Seu link único**: `http://localhost:8081?slug=seu-slug`
- **Botão "Copiar Link"**: Copie e cole em suas redes sociais
- **Botão "Visitar"**: Abra sua página em uma nova aba

## 💡 Dicas

1. **Slug Único**: Escolha um slug fácil de lembrar e digitar
2. **Fotos de Produtos**: Use imagens de boa qualidade (recomendado: 1080x1080px)
3. **Descrições**: Seja claro e objetivo nas descrições dos produtos
4. **WhatsApp**: Configure seu número para receber pedidos
5. **Redes Sociais**: Adicione todos os seus perfis para facilitar o contato

## ❓ Problemas Comuns

### "Loja não encontrada"
- Verifique se o slug está correto
- Certifique-se de que criou a conta com sucesso

### "Erro ao carregar produtos"
- Verifique se o backend está rodando (porta 3000)
- Confira se adicionou produtos no painel admin

### "Imagem não aparece"
- Certifique-se de que fez upload da imagem corretamente
- Verifique a conexão com Cloudinary (se configurado)

## 📞 Suporte

Em caso de dúvidas ou problemas, consulte:
- README.md (documentação completa)
- ARQUITETURA.md (estrutura técnica)
- Logs do console (erros detalhados)

---

**Feito com ❤️ por StyleLink**
