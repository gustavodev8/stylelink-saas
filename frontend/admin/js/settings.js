// ===================================
// STYLELINK PRO - SETTINGS PAGE
// ===================================

// Verificar autenticação
if (!localStorage.getItem('token')) {
  window.location.href = '../index.html';
}

// DOM Elements
const profileForm = document.getElementById('profileForm');
const passwordForm = document.getElementById('passwordForm');
const storeNameInput = document.getElementById('storeName');
const emailInput = document.getElementById('email');
const storeSlugInput = document.getElementById('storeSlug');
const logoutBtn = document.getElementById('logoutBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');

// Preference toggles
const emailNotifications = document.getElementById('emailNotifications');
const weeklyReports = document.getElementById('weeklyReports');
const stockAlerts = document.getElementById('stockAlerts');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  setupEventListeners();
});

// =====================================================
// EVENT LISTENERS
// =====================================================
function setupEventListeners() {
  // Profile form submit
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }

  // Password form submit
  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordUpdate);
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Delete account button
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', handleDeleteAccount);
  }

  // Preference toggles
  if (emailNotifications) {
    emailNotifications.addEventListener('change', () => savePreference('emailNotifications', emailNotifications.checked));
  }
  if (weeklyReports) {
    weeklyReports.addEventListener('change', () => savePreference('weeklyReports', weeklyReports.checked));
  }
  if (stockAlerts) {
    stockAlerts.addEventListener('change', () => savePreference('stockAlerts', stockAlerts.checked));
  }
}

// =====================================================
// DATA LOADING
// =====================================================
async function loadUserData() {
  try {
    const user = await api.get('/auth/profile');

    // Populate form fields
    if (storeNameInput) storeNameInput.value = user.store_name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (storeSlugInput) storeSlugInput.value = user.store_slug || '';

    // Update user card
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = user.store_name || 'Minha Loja';

    // Load preferences from localStorage
    loadPreferences();
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    showNotification('Erro ao carregar suas informações', 'error');
  }
}

function loadPreferences() {
  const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');

  if (emailNotifications) emailNotifications.checked = prefs.emailNotifications !== false;
  if (weeklyReports) weeklyReports.checked = prefs.weeklyReports !== false;
  if (stockAlerts) stockAlerts.checked = prefs.stockAlerts || false;
}

function savePreference(key, value) {
  const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');
  prefs[key] = value;
  localStorage.setItem('preferences', JSON.stringify(prefs));

  showNotification('Preferência atualizada', 'success');
}

// =====================================================
// FORM HANDLERS
// =====================================================
async function handleProfileUpdate(e) {
  e.preventDefault();

  const storeName = storeNameInput.value.trim();

  if (!storeName) {
    showNotification('Por favor, preencha o nome da loja', 'error');
    return;
  }

  try {
    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    await api.put('/auth/profile', {
      store_name: storeName
    });

    showNotification('Perfil atualizado com sucesso!', 'success');

    // Update user card
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = storeName;

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    showNotification(error.message || 'Erro ao atualizar perfil', 'error');
  } finally {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
}

async function handlePasswordUpdate(e) {
  e.preventDefault();

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validations
  if (!currentPassword || !newPassword || !confirmPassword) {
    showNotification('Por favor, preencha todos os campos', 'error');
    return;
  }

  if (newPassword.length < 6) {
    showNotification('A nova senha deve ter no mínimo 6 caracteres', 'error');
    return;
  }

  if (newPassword !== confirmPassword) {
    showNotification('As senhas não coincidem', 'error');
    return;
  }

  try {
    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });

    showNotification('Senha alterada com sucesso!', 'success');

    // Clear form
    e.target.reset();

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    showNotification(error.message || 'Erro ao alterar senha', 'error');
  } finally {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
}

// =====================================================
// ACTIONS
// =====================================================
function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
  }
}

function handleDeleteAccount() {
  const confirmation = prompt(
    'Esta ação é IRREVERSÍVEL e excluirá permanentemente sua conta e todos os dados.\n\n' +
    'Digite "EXCLUIR" para confirmar:'
  );

  if (confirmation === 'EXCLUIR') {
    deleteAccount();
  } else if (confirmation !== null) {
    showNotification('Confirmação incorreta. Conta não foi excluída.', 'error');
  }
}

async function deleteAccount() {
  try {
    await api.delete('/auth/account');

    showNotification('Conta excluída com sucesso', 'success');

    setTimeout(() => {
      localStorage.clear();
      window.location.href = '../index.html';
    }, 2000);

  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    showNotification(error.message || 'Erro ao excluir conta', 'error');
  }
}

// =====================================================
// NOTIFICATIONS
// =====================================================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    z-index: 10000;
    animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 400px;
  `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100px);
      }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
