// ===================================
// STYLELINK ADMIN - REGISTRO
// ===================================

// Verificar se já está logado
if (localStorage.getItem('token')) {
  window.location.href = 'pages/dashboard.html';
}

// Elementos do DOM
const registerForm = document.getElementById('registerForm');
const storeNameInput = document.getElementById('storeName');
const storeSlugInput = document.getElementById('storeSlug');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const slugFeedback = document.getElementById('slugFeedback');

// Gerar slug automaticamente do nome da loja
storeNameInput.addEventListener('input', (e) => {
  if (!storeSlugInput.value) {
    const slug = generateSlug(e.target.value);
    storeSlugInput.value = slug;
    if (slug.length >= 3) {
      checkSlugAvailability(slug);
    }
  }
});

// Verificar slug quando usuário digitar
let slugCheckTimeout;
storeSlugInput.addEventListener('input', (e) => {
  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
  e.target.value = slug;

  clearTimeout(slugCheckTimeout);

  if (slug.length < 3) {
    slugFeedback.textContent = 'Mínimo 3 caracteres';
    slugFeedback.className = 'field-feedback error';
    return;
  }

  slugFeedback.textContent = 'Verificando...';
  slugFeedback.className = 'field-feedback';

  slugCheckTimeout = setTimeout(() => {
    checkSlugAvailability(slug);
  }, 500);
});

// Gerar slug a partir do texto
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Verificar disponibilidade do slug
async function checkSlugAvailability(slug) {
  try {
    const response = await api.checkSlug(slug);

    if (response.available) {
      slugFeedback.textContent = '✓ Disponível!';
      slugFeedback.className = 'field-feedback success';
    } else {
      slugFeedback.textContent = '✗ Já está em uso';
      slugFeedback.className = 'field-feedback error';
    }
  } catch (error) {
    console.error('Erro ao verificar slug:', error);
    slugFeedback.textContent = '';
  }
}

// Registrar usuário
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const storeName = storeNameInput.value.trim();
  const storeSlug = storeSlugInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validações
  if (!storeName || !storeSlug || !email || !password) {
    showAlert('Por favor, preencha todos os campos', 'error');
    return;
  }

  if (storeSlug.length < 3) {
    showAlert('O link da loja deve ter pelo menos 3 caracteres', 'error');
    return;
  }

  if (password.length < 6) {
    showAlert('A senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }

  // Verificar se slug está disponível
  try {
    const slugCheck = await api.checkSlug(storeSlug);
    if (!slugCheck.available) {
      showAlert('Este link já está em uso. Escolha outro.', 'error');
      return;
    }
  } catch (error) {
    showAlert('Erro ao verificar disponibilidade do link', 'error');
    return;
  }

  // Desabilitar botão
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading"></span> Criando conta...';

  try {
    // Registrar
    const response = await api.register(email, password, storeName, storeSlug);

    if (response.success) {
      // Verificar se precisa de verificação de email
      if (response.data && response.data.needsVerification) {
        showAlert('Conta criada! Verifique seu email.', 'success');

        // Redirecionar para página de verificação após 1 segundo
        setTimeout(() => {
          window.location.href = `verify.html?email=${encodeURIComponent(email)}`;
        }, 1000);
      } else {
        // Fluxo antigo (caso não tenha verificação)
        showAlert('Conta criada com sucesso! Redirecionando...', 'success');

        setTimeout(() => {
          window.location.href = 'pages/dashboard.html';
        }, 1500);
      }
    }
  } catch (error) {
    console.error('Erro no registro:', error);
    showAlert(error.message || 'Erro ao criar conta. Tente novamente.', 'error');

    // Reabilitar botão
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Adicionar estilos específicos da página de registro
const style = document.createElement('style');
style.textContent = `
  .input-with-prefix {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.3s;
  }

  .input-with-prefix:focus-within {
    border-color: var(--primary);
  }

  .input-with-prefix .prefix {
    background: var(--light-gray);
    padding: 12px 12px;
    color: var(--gray);
    font-size: 14px;
    white-space: nowrap;
    border-right: 1px solid var(--border);
  }

  .input-with-prefix input {
    border: none !important;
    flex: 1;
    padding: 12px !important;
  }

  .input-with-prefix input:focus {
    outline: none;
  }

  .field-feedback {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    font-weight: 500;
  }

  .field-feedback.success {
    color: var(--success);
  }

  .field-feedback.error {
    color: var(--danger);
  }

  .trial-info {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .trial-info p {
    margin: 8px 0;
    color: var(--gray);
    font-size: 14px;
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

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  small {
    min-height: 18px;
    display: block;
  }
`;
document.head.appendChild(style);
