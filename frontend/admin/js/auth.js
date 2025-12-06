// ===================================
// STYLELINK ADMIN - AUTENTICAÇÃO
// ===================================

// Verificar se estamos na página de login
const isLoginPage = window.location.pathname.includes('index.html') ||
                    window.location.pathname.endsWith('/') ||
                    window.location.pathname.endsWith('/admin');

// Se já estiver logado e estiver na página de login, redirecionar
if (isLoginPage && localStorage.getItem('token')) {
  window.location.href = 'pages/dashboard.html';
}

// Elementos do formulário de login
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validação básica
    if (!email || !password) {
      showAlert('Por favor, preencha todos os campos', 'error');
      return;
    }

    try {
      // Desabilitar botão
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Entrando...';

      // Fazer login
      const response = await api.login(email, password);

      if (response.success) {
        showAlert('Login realizado com sucesso!', 'success');

        // Redirecionar após 1 segundo
        setTimeout(() => {
          window.location.href = 'pages/dashboard.html';
        }, 1000);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      showAlert(error.message || 'Email ou senha incorretos', 'error');

      // Reabilitar botão
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Entrar';
    }
  });
}

// Adicionar estilos de loading
const style = document.createElement('style');
style.textContent = `
  .loading {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--white);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
document.head.appendChild(style);
