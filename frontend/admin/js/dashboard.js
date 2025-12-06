// ===================================
// STYLELINK ADMIN - DASHBOARD
// ===================================

// Verificar autenticação
requireAuth();

// Elementos do DOM
const totalProductsEl = document.getElementById('totalProducts');
const activeProductsEl = document.getElementById('activeProducts');
const socialLinksEl = document.getElementById('socialLinks');
const subscriptionStatusEl = document.getElementById('subscriptionStatus');
const viewPublicPageBtn = document.getElementById('viewPublicPage');
const logoutBtn = document.getElementById('logoutBtn');

// Estado
let userData = null;
let storeData = null;

// Inicializar dashboard
async function initDashboard() {
  try {
    showLoadingStats();

    // Carregar dados em paralelo
    const [profile, store, products, socialLinks] = await Promise.all([
      api.getProfile(),
      api.getStore(),
      api.getProducts(),
      api.getSocialLinks()
    ]);

    userData = profile.data;
    storeData = store.data;

    // Atualizar estatísticas
    updateStats(products.data, socialLinks.data);

    // Configurar botão de visualizar página
    setupPublicPageLink(userData.store_slug || userData.storeSlug);

    // Adicionar animação de fade-in
    setTimeout(() => {
      document.querySelectorAll('.stat-card, .action-card').forEach(card => {
        card.classList.add('fade-in');
      });
    }, 100);

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    showError('Erro ao carregar dados do dashboard');
  }
}

// Mostrar loading nas estatísticas
function showLoadingStats() {
  totalProductsEl.innerHTML = '<div class="loading"></div>';
  activeProductsEl.innerHTML = '<div class="loading"></div>';
  socialLinksEl.innerHTML = '<div class="loading"></div>';
  subscriptionStatusEl.innerHTML = '<div class="loading"></div>';
}

// Atualizar estatísticas
function updateStats(products, socialLinks) {
  // Total de produtos
  totalProductsEl.textContent = products.length;

  // Produtos ativos
  const activeProducts = products.filter(p => p.is_available || p.isAvailable);
  activeProductsEl.textContent = activeProducts.length;

  // Redes sociais ativas
  const activeSocial = socialLinks.filter(s => s.is_active || s.isActive);
  socialLinksEl.textContent = activeSocial.length;

  // Status da assinatura
  const status = userData.subscription_status || userData.subscriptionStatus;
  updateSubscriptionStatus(status);
}

// Atualizar status da assinatura
function updateSubscriptionStatus(status) {
  const statusMap = {
    'trial': { text: '📅 Trial', color: '#f59e0b' },
    'active': { text: '✅ Ativo', color: '#10b981' },
    'inactive': { text: '⏸️ Inativo', color: '#6b7280' },
    'cancelled': { text: '❌ Cancelado', color: '#ef4444' }
  };

  const statusInfo = statusMap[status] || statusMap['inactive'];
  subscriptionStatusEl.textContent = statusInfo.text;
  subscriptionStatusEl.style.color = statusInfo.color;

  // Verificar se está em trial e quanto tempo resta
  if (status === 'trial') {
    checkTrialExpiration();
  }
}

// Verificar expiração do trial
function checkTrialExpiration() {
  const trialEndDate = new Date(userData.trial_end_date || userData.trialEndDate);
  const now = new Date();
  const daysLeft = Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 3 && daysLeft > 0) {
    showTrialWarning(daysLeft);
  } else if (daysLeft <= 0) {
    showTrialExpired();
  }
}

// Mostrar aviso de trial
function showTrialWarning(daysLeft) {
  const warning = document.createElement('div');
  warning.className = 'alert alert-warning';
  warning.innerHTML = `
    <strong>⚠️ Atenção!</strong> Seu período de teste termina em ${daysLeft} dia(s).
    <a href="settings.html">Assine agora</a> para continuar usando o StyleLink.
  `;

  const contentHeader = document.querySelector('.content-header');
  contentHeader.insertAdjacentElement('afterend', warning);
}

// Mostrar trial expirado
function showTrialExpired() {
  const warning = document.createElement('div');
  warning.className = 'alert alert-danger';
  warning.innerHTML = `
    <strong>❌ Trial Expirado!</strong> Seu período de teste terminou.
    <a href="settings.html">Assine agora</a> para reativar sua loja.
  `;

  const contentHeader = document.querySelector('.content-header');
  contentHeader.insertAdjacentElement('afterend', warning);
}

// Configurar link da página pública
function setupPublicPageLink(slug) {
  if (slug) {
    const publicUrl = `http://localhost:8081?slug=${slug}`;
    viewPublicPageBtn.href = publicUrl;
    viewPublicPageBtn.style.display = 'inline-flex';
  } else {
    viewPublicPageBtn.style.display = 'none';
  }
}

// Mostrar erro
function showError(message) {
  const error = document.createElement('div');
  error.className = 'alert alert-error';
  error.textContent = message;

  const mainContent = document.querySelector('.main-content');
  mainContent.insertBefore(error, mainContent.firstChild);

  setTimeout(() => error.remove(), 5000);
}

// Logout
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (confirm('Tem certeza que deseja sair?')) {
    api.logout();
  }
});

// Adicionar saudação personalizada
function addGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Olá';

  if (hour < 12) greeting = 'Bom dia';
  else if (hour < 18) greeting = 'Boa tarde';
  else greeting = 'Boa noite';

  const contentHeader = document.querySelector('.content-header h1');
  if (storeData && storeData.store_name) {
    contentHeader.textContent = `${greeting}, ${storeData.store_name}!`;
  } else {
    contentHeader.textContent = `${greeting}!`;
  }
}

// Menu mobile (toggle sidebar)
function setupMobileMenu() {
  const menuBtn = document.createElement('button');
  menuBtn.className = 'mobile-menu-btn';
  menuBtn.innerHTML = '☰';
  menuBtn.style.cssText = `
    display: none;
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1001;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  `;

  document.body.appendChild(menuBtn);

  menuBtn.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
  });

  // Mostrar botão em mobile
  if (window.innerWidth <= 768) {
    menuBtn.style.display = 'block';
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      menuBtn.style.display = 'block';
    } else {
      menuBtn.style.display = 'none';
      document.querySelector('.sidebar').classList.remove('active');
    }
  });

  // Fechar sidebar ao clicar fora
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768 &&
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        e.target !== menuBtn) {
      sidebar.classList.remove('active');
    }
  });
}

// Adicionar estilos do alert
function addAlertStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .alert {
      padding: 16px 20px;
      border-radius: 8px;
      margin: 20px 30px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideDown 0.3s ease;
    }

    .alert-warning {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }

    .alert-danger {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }

    .alert-error {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }

    .alert a {
      color: inherit;
      font-weight: 600;
      text-decoration: underline;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .mobile-menu-btn {
      transition: all 0.3s ease;
    }

    .mobile-menu-btn:hover {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  addAlertStyles();
  setupMobileMenu();
  initDashboard().then(() => {
    addGreeting();
  });
});
