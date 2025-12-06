# Frontend - StyleLink

## Estrutura

```
frontend/
├── admin/              # Painel Administrativo
│   ├── css/           # Estilos do admin
│   ├── js/            # Scripts do admin
│   ├── pages/         # Páginas do admin
│   └── index.html     # Login
│
└── public/            # Página Pública
    ├── css/           # Estilos dos templates
    ├── js/            # Scripts da página pública
    └── index.html     # Template da loja
```

## Admin Panel

O painel administrativo permite que os lojistas:
- Gerenciem produtos (adicionar, editar, deletar)
- Personalizem informações da loja
- Adicionem links de redes sociais
- Visualizem estatísticas básicas
- Façam upload de imagens

### Páginas do Admin:
- `/` - Login
- `/pages/dashboard.html` - Dashboard
- `/pages/products.html` - Gerenciar produtos
- `/pages/store.html` - Editar loja
- `/pages/social.html` - Redes sociais

## Página Pública

A página pública (`/public/`) é onde os clientes visualizam os produtos.

Características:
- Responsiva (mobile-first)
- Templates personalizáveis
- Carrega dados via API
- Integração com WhatsApp

## Como Usar

### Desenvolvimento

1. Para o admin, sirva os arquivos com um servidor local:
```bash
# Usando Python
cd frontend/admin
python -m http.server 8080

# Ou usando Node.js
npx http-server -p 8080
```

2. Para a página pública:
```bash
cd frontend/public
python -m http.server 8081
```

3. Acesse:
- Admin: http://localhost:8080
- Public: http://localhost:8081

### Configuração

Edite o arquivo `admin/js/api.js` para configurar a URL da API:
```javascript
const API_URL = 'http://localhost:3000/api'; // Altere conforme necessário
```

## Próximos Passos

- [ ] Implementar todas as páginas do admin
- [ ] Criar sistema de upload de imagens
- [ ] Adicionar mais templates
- [ ] Implementar analytics
- [ ] Criar página de pagamento
