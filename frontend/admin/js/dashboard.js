// ===================================
// STYLELINK ADMIN - DASHBOARD
// ===================================

// Verificar autenticação
requireAuth();

// Elementos do DOM
const totalProductsEl = document.getElementById('totalProducts');
const activeProductsEl = document.getElementById('activeProducts');
const socialLinksEl = document.getElementById('socialLinks');
const pageViewsEl = document.getElementById('pageViews');
const viewPublicPageBtn = document.getElementById('viewPublicPage');
const logoutBtn = document.getElementById('logoutBtn');
const storeLinkSlug = document.getElementById('storeLinkSlug');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const visitStoreBtn = document.getElementById('visitStoreBtn');
const productCountBadge = document.getElementById('productCount');

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

    // Configurar link da loja
    const storeSlug = userData.store_slug || userData.storeSlug;
    setupStoreLinkBanner(storeSlug);
    setupPublicPageLink(storeSlug);

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
  if (totalProductsEl) totalProductsEl.textContent = '-';
  if (activeProductsEl) activeProductsEl.textContent = '-';
  if (socialLinksEl) socialLinksEl.textContent = '-';
  if (pageViewsEl) pageViewsEl.textContent = '-';
}

// Atualizar estatísticas
function updateStats(products, socialLinks) {
  // Total de produtos
  const totalProducts = products.length;
  totalProductsEl.textContent = totalProducts;

  // Atualizar badge da sidebar
  if (productCountBadge) {
    productCountBadge.textContent = totalProducts;
  }

  // Produtos ativos
  const activeProducts = products.filter(p => p.is_active !== false && p.isActive !== false);
  activeProductsEl.textContent = activeProducts.length;

  // Redes sociais ativas
  const activeSocial = socialLinks.filter(s => s.is_active || s.isActive);
  socialLinksEl.textContent = activeSocial.length;

  // Visualizações totais
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
  if (pageViewsEl) {
    pageViewsEl.textContent = totalViews >= 1000
      ? `${(totalViews/1000).toFixed(1)}k`
      : totalViews;
  }
}



// Configurar banner do link da loja
function setupStoreLinkBanner(slug) {
  if (slug && storeLinkSlug) {
    storeLinkSlug.textContent = slug;

    const storeUrl = `http://localhost:8081?slug=${slug}`;

    // Copiar link
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(storeUrl);

          // Feedback visual
          const originalHTML = copyLinkBtn.innerHTML;
          copyLinkBtn.classList.add('copied');
          copyLinkBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copiado!
          `;

          setTimeout(() => {
            copyLinkBtn.classList.remove('copied');
            copyLinkBtn.innerHTML = originalHTML;
          }, 2000);
        } catch (error) {
          console.error('Erro ao copiar link:', error);
          alert('Não foi possível copiar o link. Por favor, copie manualmente: ' + storeUrl);
        }
      });
    }

    // Visitar loja
    if (visitStoreBtn) {
      visitStoreBtn.addEventListener('click', () => {
        window.open(storeUrl, '_blank');
      });
    }
  } else if (storeLinkSlug) {
    storeLinkSlug.textContent = 'configurando...';
  }
}

// Configurar link da página pública
function setupPublicPageLink(slug) {
  if (slug && viewPublicPageBtn) {
    const publicUrl = `http://localhost:8081?slug=${slug}`;
    viewPublicPageBtn.addEventListener('click', () => {
      window.open(publicUrl, '_blank');
    });
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
