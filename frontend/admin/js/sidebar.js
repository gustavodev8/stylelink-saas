// ===================================
// STYLELINK ADMIN - SIDEBAR GLOBAL
// Sistema de toggle para sidebar responsiva
// ===================================

(function() {
  'use strict';

  // Verificar se já foi inicializado
  if (window.StyleLinkSidebar) {
    return;
  }

  // Criar namespace
  window.StyleLinkSidebar = {
    init: function() {
      this.createMobileElements();
      this.attachEventListeners();
      this.handleResize();
    },

    createMobileElements: function() {
      // Verificar se elementos já existem
      if (document.querySelector('.mobile-menu-toggle')) {
        return;
      }

      const body = document.body;

      // Criar botão hamburger
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'mobile-menu-toggle';
      toggleBtn.setAttribute('aria-label', 'Abrir menu');
      toggleBtn.innerHTML = `
        <div class="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

      // Criar overlay
      const overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';

      // Adicionar ao body
      body.appendChild(toggleBtn);
      body.appendChild(overlay);

      // Salvar referências
      this.toggleBtn = toggleBtn;
      this.overlay = overlay;
      this.sidebar = document.querySelector('.sidebar');
    },

    attachEventListeners: function() {
      const self = this;

      // Toggle ao clicar no botão
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', function() {
          self.toggle();
        });
      }

      // Fechar ao clicar no overlay
      if (this.overlay) {
        this.overlay.addEventListener('click', function() {
          self.close();
        });
      }

      // Fechar ao clicar em um link da sidebar (mobile)
      if (this.sidebar) {
        const navLinks = this.sidebar.querySelectorAll('.nav-item, .nav-link');
        navLinks.forEach(function(link) {
          link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
              setTimeout(function() {
                self.close();
              }, 200);
            }
          });
        });
      }

      // Fechar ao pressionar ESC
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && self.isOpen()) {
          self.close();
        }
      });

      // Ajustar ao redimensionar
      window.addEventListener('resize', function() {
        self.handleResize();
      });
    },

    toggle: function() {
      if (this.isOpen()) {
        this.close();
      } else {
        this.open();
      }
    },

    open: function() {
      if (!this.sidebar) return;

      this.sidebar.classList.add('open');
      if (this.overlay) {
        this.overlay.classList.add('active');
      }
      if (this.toggleBtn) {
        this.toggleBtn.classList.add('active');
        this.toggleBtn.setAttribute('aria-label', 'Fechar menu');
      }
      document.body.classList.add('sidebar-open');

      // Prevenir scroll
      if (window.innerWidth <= 1024) {
        document.body.style.overflow = 'hidden';
      }
    },

    close: function() {
      if (!this.sidebar) return;

      this.sidebar.classList.remove('open');
      if (this.overlay) {
        this.overlay.classList.remove('active');
      }
      if (this.toggleBtn) {
        this.toggleBtn.classList.remove('active');
        this.toggleBtn.setAttribute('aria-label', 'Abrir menu');
      }
      document.body.classList.remove('sidebar-open');

      // Permitir scroll
      document.body.style.overflow = '';
    },

    isOpen: function() {
      return this.sidebar && this.sidebar.classList.contains('open');
    },

    handleResize: function() {
      // Fechar sidebar se tela ficar maior que 1024px
      if (window.innerWidth > 1024 && this.isOpen()) {
        this.close();
      }
    }
  };

  // Auto-inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.StyleLinkSidebar.init();
    });
  } else {
    window.StyleLinkSidebar.init();
  }

})();
