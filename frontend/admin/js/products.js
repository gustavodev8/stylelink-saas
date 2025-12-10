// ===================================
// STYLELINK PRO - PRODUCTS PAGE
// Enterprise SaaS Management
// ===================================

// Verificar autenticação
if (!localStorage.getItem('token')) {
  window.location.href = '../index.html';
}

// State Management
let allProducts = [];
let currentProductId = null;
let currentView = 'grid';
let currentFilters = {
  search: '',
  status: '',
  category: ''
};

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const emptyState = document.getElementById('emptyState');
const productModal = document.getElementById('productModal');
const deleteModal = document.getElementById('deleteModal');
const productForm = document.getElementById('productForm');
const searchInput = document.getElementById('searchInput');
const addProductBtn = document.getElementById('addProductBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupEventListeners();
  updateStats();
});

// =====================================================
// EVENT LISTENERS
// =====================================================
function setupEventListeners() {
  // Add product button
  addProductBtn.addEventListener('click', openAddProductModal);

  // Product form submit
  productForm.addEventListener('submit', handleSaveProduct);

  // Search input
  searchInput.addEventListener('input', debounce(handleSearch, 300));

  // Delete confirmation
  confirmDeleteBtn.addEventListener('click', handleDeleteProduct);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleKeyboardShortcuts(e) {
  // Cmd/Ctrl + K for search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
  }

  // Escape to close modals
  if (e.key === 'Escape') {
    closeProductModal();
    closeDeleteModal();
  }

  // Cmd/Ctrl + N for new product
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
    e.preventDefault();
    openAddProductModal();
  }
}

// =====================================================
// DATA LOADING
// =====================================================
async function loadProducts() {
  try {
    showLoading();

    const response = await fetch('http://localhost:3000/api/products', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (data.success) {
      allProducts = data.data || [];
      renderProducts(allProducts);
      updateStats();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    showEmptyState();
    showNotification('Erro ao carregar produtos', 'error');
  }
}

function showLoading() {
  productsGrid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px;">
      <div style="width: 48px; height: 48px; border: 4px solid #f1f3f5; border-top-color: #6366f1; border-radius: 50%; margin: 0 auto 20px; animation: spin 0.8s linear infinite;"></div>
      <p style="color: #6b7280; font-size: 15px;">Carregando produtos...</p>
    </div>
  `;
}

// =====================================================
// RENDERING
// =====================================================
function renderProducts(products) {
  if (!products || products.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();
  productsGrid.innerHTML = '';

  products.forEach((product, index) => {
    const card = createProductCard(product, index);
    productsGrid.appendChild(card);
  });
}

function createProductCard(product, index) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.style.animationDelay = `${index * 0.05}s`;

  // Process image
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : null;

  // Process variants
  const colors = product.colors || [];
  const colorDots = colors.slice(0, 3).map(color =>
    `<span class="variant-dot" style="background: ${getColorHex(color)}" title="${color}"></span>`
  ).join('');
  const moreColors = colors.length > 3 ? `<span class="variant-count">+${colors.length - 3}</span>` : '';

  // Stock status
  const stock = product.stock || 0;
  let stockClass = 'in-stock';
  let stockText = `${stock} em estoque`;
  if (stock === 0) {
    stockClass = 'out-stock';
    stockText = 'Sem estoque';
  } else if (stock < 10) {
    stockClass = 'low-stock';
  }

  // Status
  const status = product.is_active ? 'active' : 'inactive';
  const statusText = product.is_active ? 'Ativo' : 'Inativo';

  card.innerHTML = `
    <div class="product-image-wrapper">
      ${imageUrl
        ? `<img src="${imageUrl}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'; this.parentElement.innerHTML += '📦';">`
        : '<div style="font-size: 64px; color: #9ca3af;">📦</div>'
      }
      <div class="product-status ${status}">${statusText}</div>
      <div class="product-quick-actions">
        <button class="quick-action-btn" onclick="viewProduct('${product.id}')" title="Visualizar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <button class="quick-action-btn" onclick="openEditProductModal('${product.id}')" title="Editar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="quick-action-btn delete" onclick="openDeleteModal('${product.id}', '${product.name.replace(/'/g, "\\'")}')" title="Excluir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="product-body">
      <span class="product-category">${product.category || 'outros'}</span>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.description || 'Sem descrição'}</p>
      <div class="product-meta">
        ${colors.length > 0 ? `
          <div class="product-variants">
            ${colorDots}
            ${moreColors}
          </div>
        ` : '<div></div>'}
        <span class="product-stock ${stockClass}">
          <span class="stock-dot"></span>
          ${stockText}
        </span>
      </div>
      <div class="product-footer">
        <span class="product-price">R$ ${parseFloat(product.price).toFixed(2)}</span>
        <span class="product-views">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          ${product.views || 0}
        </span>
      </div>
    </div>
  `;

  return card;
}

function getColorHex(colorName) {
  const colors = {
    'preto': '#1a1a1a',
    'branco': '#ffffff',
    'azul': '#3b82f6',
    'vermelho': '#ef4444',
    'verde': '#10b981',
    'amarelo': '#fbbf24',
    'roxo': '#8b5cf6',
    'rosa': '#ec4899',
    'laranja': '#f97316',
    'cinza': '#6b7280',
    'marrom': '#78350f',
  };
  return colors[colorName.toLowerCase()] || '#9ca3af';
}

function showEmptyState() {
  productsGrid.style.display = 'none';
  emptyState.style.display = 'block';
}

function hideEmptyState() {
  productsGrid.style.display = 'grid';
  emptyState.style.display = 'none';
}

// =====================================================
// STATS UPDATE
// =====================================================
function updateStats() {
  const total = allProducts.length;
  const active = allProducts.filter(p => p.is_active).length;
  const lowStock = allProducts.filter(p => p.stock < 10 && p.stock > 0).length;
  const totalViews = allProducts.reduce((sum, p) => sum + (p.views || 0), 0);

  // Update stat values if elements exist
  const statElements = document.querySelectorAll('.stat-value');
  if (statElements[0]) statElements[0].textContent = total;
  if (statElements[1]) statElements[1].textContent = active;
  if (statElements[2]) statElements[2].textContent = lowStock;
  if (statElements[3]) statElements[3].textContent = totalViews >= 1000 ? `${(totalViews/1000).toFixed(1)}k` : totalViews;

  // Update sidebar badge (both by ID and by class)
  const sidebarBadge = document.getElementById('sidebarProductCount');
  if (sidebarBadge) sidebarBadge.textContent = total;

  const navBadge = document.querySelector('.nav-link.active .nav-badge');
  if (navBadge) navBadge.textContent = total;
}

// =====================================================
// MODAL OPERATIONS
// =====================================================
function openAddProductModal() {
  currentProductId = null;
  document.getElementById('modalTitle').textContent = 'Novo Produto';
  productForm.reset();
  document.getElementById('productActive').checked = true;
  productModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

async function openEditProductModal(productId) {
  currentProductId = productId;
  document.getElementById('modalTitle').textContent = 'Editar Produto';

  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (data.success) {
      const product = data.data;

      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productDescription').value = product.description || '';
      document.getElementById('productCategory').value = product.category || 'outros';
      document.getElementById('productStock').value = product.stock || 0;
      document.getElementById('productImages').value = product.images && product.images.length > 0 ? product.images[0] : '';
      document.getElementById('productSizes').value = product.sizes ? product.sizes.join(', ') : '';
      document.getElementById('productColors').value = product.colors ? product.colors.join(', ') : '';
      document.getElementById('productActive').checked = product.is_active;

      productModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  } catch (error) {
    console.error('Error loading product:', error);
    showNotification('Erro ao carregar produto', 'error');
  }
}

function closeProductModal() {
  productModal.classList.remove('active');
  document.body.style.overflow = '';
  productForm.reset();
  currentProductId = null;
}

function openDeleteModal(productId, productName) {
  currentProductId = productId;
  document.getElementById('deleteProductName').textContent = productName;
  deleteModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
  deleteModal.classList.remove('active');
  document.body.style.overflow = '';
  currentProductId = null;
}

function viewProduct(productId) {
  // TODO: Implement product view/preview
  showNotification('Preview em desenvolvimento', 'info');
}

// =====================================================
// CRUD OPERATIONS
// =====================================================
async function handleSaveProduct(e) {
  e.preventDefault();

  const submitBtn = productForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></div> Salvando...';

  try {
    const productData = {
      name: document.getElementById('productName').value.trim(),
      price: parseFloat(document.getElementById('productPrice').value),
      description: document.getElementById('productDescription').value.trim(),
      category: document.getElementById('productCategory').value,
      stock: parseInt(document.getElementById('productStock').value) || 0,
      is_active: document.getElementById('productActive').checked
    };

    const imageUrl = document.getElementById('productImages').value.trim();
    if (imageUrl) productData.images = [imageUrl];

    const sizesInput = document.getElementById('productSizes').value.trim();
    if (sizesInput) productData.sizes = sizesInput.split(',').map(s => s.trim()).filter(s => s);

    const colorsInput = document.getElementById('productColors').value.trim();
    if (colorsInput) productData.colors = colorsInput.split(',').map(c => c.trim()).filter(c => c);

    const url = currentProductId
      ? `http://localhost:3000/api/products/${currentProductId}`
      : 'http://localhost:3000/api/products';

    const response = await fetch(url, {
      method: currentProductId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (data.success) {
      showNotification(
        currentProductId ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!',
        'success'
      );
      closeProductModal();
      loadProducts();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error saving product:', error);
    showNotification(error.message || 'Erro ao salvar produto', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

async function handleDeleteProduct() {
  if (!currentProductId) return;

  const submitBtn = confirmDeleteBtn;
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></div> Excluindo...';

  try {
    const response = await fetch(`http://localhost:3000/api/products/${currentProductId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Produto excluído com sucesso!', 'success');
      closeDeleteModal();
      loadProducts();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    showNotification(error.message || 'Erro ao excluir produto', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// =====================================================
// SEARCH & FILTER
// =====================================================
function handleSearch(e) {
  currentFilters.search = e.target.value.toLowerCase();
  filterProducts();
}

function filterProducts() {
  const filtered = allProducts.filter(product => {
    const matchesSearch = !currentFilters.search ||
      product.name.toLowerCase().includes(currentFilters.search) ||
      (product.description && product.description.toLowerCase().includes(currentFilters.search));

    const matchesStatus = !currentFilters.status ||
      (currentFilters.status === 'active' && product.is_active) ||
      (currentFilters.status === 'inactive' && !product.is_active);

    const matchesCategory = !currentFilters.category ||
      product.category === currentFilters.category;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  renderProducts(filtered);
}

// =====================================================
// UTILITIES
// =====================================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideInRight 0.3s ease;
    font-weight: 500;
    font-size: 14px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
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

// =====================================================
// NEW MODAL FEATURES
// =====================================================

// Upload Area with Drag & Drop
const uploadArea = document.getElementById('uploadArea');
const imageFile = document.getElementById('imageFile');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');
const uploadContent = uploadArea?.querySelector('.upload-content');

if (uploadArea && imageFile) {
  // Click to upload
  uploadContent?.addEventListener('click', () => imageFile.click());

  // File input change
  imageFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  });

  // Drag & Drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  });

  // Remove image
  removeImageBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearImagePreview();
  });
}

function handleImageFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    showNotification('A imagem deve ter no máximo 5MB', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    uploadContent.style.display = 'none';
    imagePreview.style.display = 'block';

    // Store base64 in hidden input as fallback
    document.getElementById('productImages').value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearImagePreview() {
  previewImg.src = '';
  uploadContent.style.display = 'flex';
  imagePreview.style.display = 'none';
  imageFile.value = '';
  document.getElementById('productImages').value = '';
}

// Size Chips
const sizeChips = document.getElementById('sizeChips');
const productSizesInput = document.getElementById('productSizes');
let selectedSizes = [];

if (sizeChips) {
  sizeChips.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip-btn')) {
      e.preventDefault();
      const size = e.target.dataset.size;

      if (e.target.classList.contains('active')) {
        e.target.classList.remove('active');
        selectedSizes = selectedSizes.filter(s => s !== size);
      } else {
        e.target.classList.add('active');
        selectedSizes.push(size);
      }

      productSizesInput.value = JSON.stringify(selectedSizes);
    }
  });
}

// Color Palette
const colorPalette = document.getElementById('colorPalette');
const productColorsInput = document.getElementById('productColors');
let selectedColors = [];

if (colorPalette) {
  colorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-btn')) {
      e.preventDefault();
      const color = e.target.dataset.color;

      if (e.target.classList.contains('active')) {
        e.target.classList.remove('active');
        selectedColors = selectedColors.filter(c => c !== color);
      } else {
        e.target.classList.add('active');
        selectedColors.push(color);
      }

      productColorsInput.value = JSON.stringify(selectedColors);
    }
  });
}

// Stock Status Radio Buttons
const stockRadios = document.querySelectorAll('input[name="stockStatus"]');
const productStockInput = document.getElementById('productStock');

stockRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    const value = e.target.value;

    switch(value) {
      case 'available':
        productStockInput.value = 50; // Default available stock
        break;
      case 'low':
        productStockInput.value = 5; // Low stock (1-9)
        break;
      case 'out':
        productStockInput.value = 0; // Out of stock
        break;
    }
  });
});

// Collapsible Description
const descriptionToggle = document.getElementById('descriptionToggle');
const descriptionContent = document.getElementById('descriptionContent');

if (descriptionToggle && descriptionContent) {
  descriptionToggle.addEventListener('click', (e) => {
    e.preventDefault();
    descriptionToggle.classList.toggle('active');

    if (descriptionContent.style.display === 'none') {
      descriptionContent.style.display = 'block';
      setTimeout(() => descriptionContent.classList.add('expanded'), 10);
    } else {
      descriptionContent.classList.remove('expanded');
      setTimeout(() => descriptionContent.style.display = 'none', 300);
    }
  });
}

// Reset form on modal close
function closeProductModal() {
  productModal.classList.remove('active');
  document.body.style.overflow = '';

  // Reset all new features
  clearImagePreview();
  selectedSizes = [];
  selectedColors = [];

  document.querySelectorAll('.chip-btn.active').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.color-btn.active').forEach(btn => btn.classList.remove('active'));

  // Reset stock to available
  document.querySelector('input[name="stockStatus"][value="available"]').checked = true;
  productStockInput.value = 0;

  // Close description if open
  if (descriptionToggle.classList.contains('active')) {
    descriptionToggle.classList.remove('active');
    descriptionContent.style.display = 'none';
  }
}
