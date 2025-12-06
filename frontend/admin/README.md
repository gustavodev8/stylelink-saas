# 🎨 StyleLink Admin Panel

Dashboard administrativo moderno e profissional para gerenciar sua loja StyleLink.

## ✨ Features

### Dashboard
- 📊 **Estatísticas em tempo real**
  - Total de produtos
  - Produtos ativos
  - Redes sociais conectadas
  - Status da assinatura

- ⚡ **Ações Rápidas**
  - Adicionar produto
  - Editar loja
  - Configurar redes sociais

- 💡 **Dicas e Orientações**
  - Cards informativos
  - Alertas de trial
  - Saudação personalizada

### Design Moderno
- 🎨 **Sidebar escura** com gradiente
- 📱 **Totalmente responsivo** (mobile-first)
- ✨ **Animações suaves** e transições
- 🎯 **Cards com hover effects** em 3D
- 🌈 **Gradientes coloridos** modernos

## 🚀 Como Usar

### 1. Iniciar servidor local

```bash
# Opção 1: Python
python -m http.server 8080

# Opção 2: Node.js
npx http-server -p 8080

# Opção 3: VS Code Live Server
# Clique com botão direito em index.html > Open with Live Server
```

### 2. Acessar

Abra no navegador: **http://localhost:8080**

### 3. Fazer Login

Use as credenciais cadastradas no sistema ou crie uma nova conta.

## 📁 Estrutura

```
admin/
├── css/
│   ├── style.css           # Estilos globais
│   └── dashboard.css       # Estilos do dashboard
├── js/
│   ├── api.js              # Cliente da API
│   ├── auth.js             # Sistema de login
│   └── dashboard.js        # Lógica do dashboard
├── pages/
│   └── dashboard.html      # Página do dashboard
└── index.html              # Página de login
```

## 🎨 Design System

### Cores

```css
--primary: #6366f1        /* Azul índigo */
--secondary: #8b5cf6      /* Roxo */
--success: #10b981        /* Verde */
--danger: #ef4444         /* Vermelho */
--warning: #f59e0b        /* Amarelo */
```

### Tipografia

- **Font Family:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700

### Componentes

#### Sidebar
- Largura: 260px
- Background: Gradiente escuro (#1f2937 → #111827)
- Menu sticky

#### Cards de Estatísticas
- Borda colorida lateral
- Ícones grandes
- Números com gradiente
- Hover effect com elevação

#### Action Cards
- Hover com elevação
- Gradiente no background (hover)
- Ícones centralizados
- Transições suaves

## 📱 Responsividade

### Desktop (>1024px)
- Sidebar fixa
- Grid de 4 colunas (stats)
- Grid de 3 colunas (actions)

### Tablet (768px - 1024px)
- Grid de 2 colunas (stats)
- Grid de 2 colunas (actions)

### Mobile (<768px)
- Sidebar colapsável (menu hamburger)
- Grid de 1 coluna
- Botão de menu mobile
- Tap outside para fechar

## 🔧 Funcionalidades JavaScript

### Dashboard.js

```javascript
// Carrega dados da API
initDashboard()

// Atualiza estatísticas
updateStats(products, socialLinks)

// Verifica trial
checkTrialExpiration()

// Saudação personalizada
addGreeting()

// Menu mobile
setupMobileMenu()
```

### API.js

```javascript
// Métodos disponíveis
api.login(email, password)
api.getProfile()
api.getStore()
api.getProducts()
api.getSocialLinks()
api.logout()
```

## 🎯 Próximas Páginas

- [ ] **Products** - Gerenciar produtos
- [ ] **Store** - Editar informações da loja
- [ ] **Social** - Configurar redes sociais
- [ ] **Settings** - Configurações da conta

## 💡 Tips

1. **Performance**: Os cards têm animação fade-in no carregamento
2. **UX**: Hover states em todos os elementos interativos
3. **Mobile**: Menu hamburger aparece automaticamente em telas pequenas
4. **Loading**: Estados de loading para melhor feedback ao usuário

## 🐛 Troubleshooting

### Dashboard não carrega dados
- Verifique se o backend está rodando (http://localhost:3000)
- Verifique se você está autenticado (localStorage deve ter token)

### Sidebar não abre no mobile
- Verifique o console do navegador
- Certifique-se que dashboard.js foi carregado

### Estilos quebrados
- Limpe o cache do navegador (Ctrl + Shift + R)
- Verifique se os arquivos CSS estão sendo carregados

---

**Feito com ❤️ usando HTML, CSS e JavaScript puro**
