// ===================================
// STYLELINK ADMIN - VERIFICAÇÃO EMAIL
// ===================================

// Verificar se tem email na URL
const urlParams = new URLSearchParams(window.location.search);
const userEmail = urlParams.get('email');

if (!userEmail) {
  window.location.href = 'register.html';
}

// Elementos do DOM
const emailDisplay = document.getElementById('emailDisplay');
const verifyForm = document.getElementById('verifyForm');
const codeInput = document.getElementById('code');
const resendBtn = document.getElementById('resendBtn');
const resendTimer = document.getElementById('resendTimer');

// Exibir email
emailDisplay.textContent = userEmail;

// Controle de reenvio (60 segundos)
let resendTimeout = 60;
let resendInterval;

function startResendTimer() {
  resendBtn.disabled = true;
  resendBtn.style.opacity = '0.5';
  resendBtn.style.cursor = 'not-allowed';

  resendInterval = setInterval(() => {
    resendTimeout--;
    resendTimer.textContent = `Aguarde ${resendTimeout}s para reenviar`;

    if (resendTimeout <= 0) {
      clearInterval(resendInterval);
      resendBtn.disabled = false;
      resendBtn.style.opacity = '1';
      resendBtn.style.cursor = 'pointer';
      resendTimer.textContent = '';
      resendTimeout = 60;
    }
  }, 1000);
}

// Iniciar timer ao carregar
startResendTimer();

// Permitir apenas números no input
codeInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Verificar código
verifyForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const code = codeInput.value.trim();

  if (code.length !== 6) {
    showAlert('O código deve ter 6 dígitos', 'error');
    return;
  }

  const submitBtn = verifyForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading"></span> Verificando...';

  try {
    const response = await fetch('http://localhost:3000/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, code })
    });

    const data = await response.json();

    if (data.success) {
      // Salvar token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      showAlert('Email verificado com sucesso! Redirecionando...', 'success');

      setTimeout(() => {
        window.location.href = 'pages/dashboard.html';
      }, 1500);
    } else {
      throw new Error(data.message || 'Código inválido ou expirado');
    }
  } catch (error) {
    console.error('Erro na verificação:', error);
    showAlert(error.message || 'Erro ao verificar código. Tente novamente.', 'error');

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Reenviar código
resendBtn.addEventListener('click', async () => {
  if (resendBtn.disabled) return;

  resendBtn.disabled = true;
  const originalText = resendBtn.textContent;
  resendBtn.innerHTML = '<span class="loading-small"></span> Reenviando...';

  try {
    const response = await fetch('http://localhost:3000/api/auth/resend-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail })
    });

    const data = await response.json();

    if (data.success) {
      showAlert('Código reenviado! Verifique seu email.', 'success');
      startResendTimer();
    } else {
      throw new Error(data.message || 'Erro ao reenviar código');
    }
  } catch (error) {
    console.error('Erro ao reenviar:', error);
    showAlert(error.message || 'Erro ao reenviar código.', 'error');
    resendBtn.disabled = false;
    resendBtn.textContent = originalText;
  }
});

// Estilos específicos da página
const style = document.createElement('style');
style.textContent = `
  .verification-info {
    text-align: center;
    margin-bottom: 25px;
    padding: 15px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
    border-radius: 8px;
  }

  .verification-info p {
    margin: 5px 0;
    color: var(--gray);
    font-size: 14px;
  }

  .email-display {
    color: var(--primary) !important;
    font-weight: 600 !important;
    font-size: 16px !important;
  }

  #code {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 8px;
    font-family: 'Courier New', monospace;
  }

  .code-hint {
    display: block;
    margin-top: 8px;
    color: var(--gray);
    font-size: 12px;
    text-align: center;
  }

  .resend-section {
    text-align: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .resend-section p {
    margin: 8px 0;
    color: var(--gray);
    font-size: 14px;
  }

  .btn-link {
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    padding: 8px;
    transition: all 0.3s;
  }

  .btn-link:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  .btn-link:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .timer-text {
    color: var(--warning) !important;
    font-size: 12px !important;
    margin-top: 5px !important;
  }

  .loading {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--white);
    animation: spin 0.8s linear infinite;
  }

  .loading-small {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(99, 102, 241, 0.3);
    border-radius: 50%;
    border-top-color: var(--primary);
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
