// ===================================
// STYLELINK ADMIN - PERSONALIZAÇÃO
// ===================================

// Verificar autenticação
if (!localStorage.getItem('token')) {
  window.location.href = '../index.html';
}

// Alpine.js Component
function customizeApp() {
  return {
    saving: false,
    previewDevice: 'mobile',

    settings: {
      storeName: 'Minha Loja',
      bio: 'Bem-vindo à minha loja!',
      whatsapp: '',
      logoUrl: '',
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#ffffff',
      templateId: 1
    },

    products: [],
    socialLinks: [],

    async init() {
      await this.loadSettings();
      await this.loadProducts();
      await this.loadSocialLinks();
    },

    async loadSettings() {
      try {
        const response = await api.getStore();
        if (response.success && response.data) {
          const store = response.data;
          this.settings = {
            storeName: store.store_name || store.storeName || 'Minha Loja',
            bio: store.bio || '',
            whatsapp: store.whatsapp || '',
            logoUrl: store.logo_url || store.logoUrl || '',
            primaryColor: store.primary_color || store.primaryColor || '#6366f1',
            secondaryColor: store.secondary_color || store.secondaryColor || '#8b5cf6',
            backgroundColor: store.background_color || store.backgroundColor || '#ffffff',
            templateId: store.template_id || store.templateId || 1
          };
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    },

    async loadProducts() {
      try {
        const response = await api.getProducts();
        if (response.success) {
          this.products = response.data.slice(0, 6); // Apenas 6 para preview
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        this.products = [];
      }
    },

    async loadSocialLinks() {
      try {
        const response = await api.getSocialLinks();
        if (response.success) {
          this.socialLinks = response.data.filter(link => link.is_active || link.isActive);
        }
      } catch (error) {
        console.error('Erro ao carregar redes sociais:', error);
        this.socialLinks = [];
      }
    },

    applyPreset(preset) {
      const presets = {
        purple: {
          primaryColor: '#6366f1',
          secondaryColor: '#8b5cf6',
          backgroundColor: '#ffffff'
        },
        blue: {
          primaryColor: '#3b82f6',
          secondaryColor: '#1d4ed8',
          backgroundColor: '#eff6ff'
        },
        pink: {
          primaryColor: '#ec4899',
          secondaryColor: '#be185d',
          backgroundColor: '#fdf2f8'
        },
        green: {
          primaryColor: '#10b981',
          secondaryColor: '#059669',
          backgroundColor: '#f0fdf4'
        },
        orange: {
          primaryColor: '#f59e0b',
          secondaryColor: '#d97706',
          backgroundColor: '#fffbeb'
        },
        dark: {
          primaryColor: '#1f2937',
          secondaryColor: '#111827',
          backgroundColor: '#f9fafb'
        }
      };

      if (presets[preset]) {
        this.settings = { ...this.settings, ...presets[preset] };
        showAlert(`Paleta "${preset}" aplicada!`, 'success');
      }
    },

    getPreviewHTML() {
      // Usar backgroundColor se definido, caso contrário usar gradiente
      const background = this.settings.backgroundColor
        ? this.settings.backgroundColor
        : `linear-gradient(135deg, ${this.settings.primaryColor}, ${this.settings.secondaryColor})`;
      const logoUrl = this.settings.logoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.settings.storeName)}`;

      return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.settings.storeName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: ${background};
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
    }

    .profile-section {
      text-align: center;
      padding: 30px 20px;
      margin-bottom: 30px;
    }

    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin: 0 auto 20px;
      object-fit: cover;
    }

    .store-name {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin-bottom: 10px;
    }

    .store-bio {
      font-size: 14px;
      color: rgba(255,255,255,0.9);
      line-height: 1.5;
    }

    .social-links {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 20px;
    }

    .social-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${this.settings.primaryColor};
      text-decoration: none;
      transition: transform 0.2s;
    }

    .social-btn:hover {
      transform: scale(1.1);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }

    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .product-image {
      width: 100%;
      height: 160px;
      object-fit: cover;
      background: #f3f4f6;
    }

    .product-info {
      padding: 12px;
    }

    .product-name {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .product-price {
      font-size: 18px;
      font-weight: 700;
      color: ${this.settings.primaryColor};
      margin-bottom: 10px;
    }

    .btn-whatsapp {
      display: block;
      width: 100%;
      padding: 8px;
      background: #25d366;
      color: white;
      text-align: center;
      border-radius: 6px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      background: white;
      border-radius: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="profile-section">
      <img src="${logoUrl}" alt="${this.settings.storeName}" class="avatar">
      <h1 class="store-name">${this.settings.storeName}</h1>
      <p class="store-bio">${this.settings.bio || 'Bem-vindo à minha loja!'}</p>

      ${this.socialLinks.length > 0 ? `
        <div class="social-links">
          ${this.socialLinks.map(link => `
            <a href="${link.url}" class="social-btn" target="_blank">
              ${this.getSocialIcon(link.platform)}
            </a>
          `).join('')}
        </div>
      ` : ''}
    </div>

    ${this.products.length > 0 ? `
      <div class="products-grid">
        ${this.products.map(product => {
          const imageUrl = Array.isArray(product.images) && product.images[0]
            ? product.images[0]
            : product.image_url || 'https://via.placeholder.com/300';
          const price = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(product.price);

          return `
            <div class="product-card">
              <img src="${imageUrl}" alt="${product.name}" class="product-image">
              <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${price}</div>
                <a href="https://wa.me/${this.settings.whatsapp || '5511999999999'}" class="btn-whatsapp">
                  💬 Comprar
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <p>📦 Nenhum produto adicionado ainda</p>
      </div>
    `}
  </div>
</body>
</html>
      `;
    },

    getSocialIcon(platform) {
      const icons = {
        instagram: '📷',
        facebook: '👥',
        tiktok: '🎵',
        youtube: '▶️',
        twitter: '🐦',
        pinterest: '📌',
        whatsapp: '💬'
      };
      return icons[platform] || '🔗';
    },

    async saveCustomization() {
      this.saving = true;

      try {
        const response = await api.updateStore({
          storeName: this.settings.storeName,
          bio: this.settings.bio,
          whatsapp: this.settings.whatsapp,
          logoUrl: this.settings.logoUrl,
          primaryColor: this.settings.primaryColor,
          secondaryColor: this.settings.secondaryColor,
          backgroundColor: this.settings.backgroundColor,
          templateId: this.settings.templateId
        });

        if (response.success) {
          showAlert('✅ Personalização salva com sucesso!', 'success');
        } else {
          showAlert('❌ ' + (response.message || 'Erro ao salvar'), 'error');
        }
      } catch (error) {
        console.error('Erro ao salvar:', error);
        showAlert('❌ Erro ao salvar personalização', 'error');
      } finally {
        this.saving = false;
      }
    },

    async handleLogoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        showAlert('❌ Imagem muito grande. Máximo 2MB', 'error');
        return;
      }

      try {
        showAlert('📤 Fazendo upload...', 'info');

        const formData = new FormData();
        formData.append('file', file);

        const response = await api.uploadImage(formData);

        if (response.success && response.data.url) {
          this.settings.logoUrl = response.data.url;
          showAlert('✅ Logo atualizado!', 'success');
        } else {
          showAlert('❌ Erro ao fazer upload', 'error');
        }
      } catch (error) {
        console.error('Erro no upload:', error);
        showAlert('❌ Erro ao fazer upload da imagem', 'error');
      }
    },

    previewPage() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const slug = user.storeSlug || 'preview';
      window.open(`/public?slug=${slug}`, '_blank');
    }
  };
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  if (confirm('Deseja realmente sair?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
  }
});

// Alert helper
function showAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
