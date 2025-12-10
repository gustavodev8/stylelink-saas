// ===================================
// STYLELINK ADMIN - ANALYTICS
// ===================================

// Verificar autenticação
requireAuth();

// Elementos do DOM
const totalClicksEl = document.getElementById('totalClicks');
const uniqueVisitorsEl = document.getElementById('uniqueVisitors');
const productViewsEl = document.getElementById('productViews');
const conversionRateEl = document.getElementById('conversionRate');

const clicksTrendEl = document.getElementById('clicksTrend');
const visitorsTrendEl = document.getElementById('visitorsTrend');
const viewsTrendEl = document.getElementById('viewsTrend');
const rateTrendEl = document.getElementById('rateTrend');

const topProductsEl = document.getElementById('topProducts');
const clicksChartEl = document.getElementById('clicksChart');

const instagramCountEl = document.getElementById('instagramCount');
const whatsappCountEl = document.getElementById('whatsappCount');
const directCountEl = document.getElementById('directCount');
const otherCountEl = document.getElementById('otherCount');

const instagramBarEl = document.getElementById('instagramBar');
const whatsappBarEl = document.getElementById('whatsappBar');
const directBarEl = document.getElementById('directBar');
const otherBarEl = document.getElementById('otherBar');

const periodBtns = document.querySelectorAll('.period-btn');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Estado
let currentPeriod = 7;
let analyticsData = null;

// Inicializar analytics
async function initAnalytics() {
  try {
    await loadAnalytics(currentPeriod);
  } catch (error) {
    console.error('Erro ao carregar analytics:', error);
    showNotification('Erro ao carregar dados de analytics', 'error');
  }
}

// Carregar dados de analytics
async function loadAnalytics(days) {
  try {
    // Buscar dados em paralelo
    const [products, profile] = await Promise.all([
      api.getProducts(),
      api.getProfile()
    ]);

    // Gerar dados simulados (em produção, viria do backend)
    analyticsData = generateAnalyticsData(products.data, days);

    // Atualizar UI
    updateMainStats(analyticsData);
    updateTopProducts(products.data);
    updateClicksChart(analyticsData);
    updateTrafficSources(analyticsData);

  } catch (error) {
    console.error('Erro ao carregar analytics:', error);
    throw error;
  }
}

// Gerar dados simulados de analytics
function generateAnalyticsData(products, days) {
  // Total de visualizações de produtos
  const totalProductViews = products.reduce((sum, p) => sum + (p.views || 0), 0);

  // Gerar cliques no link (baseado nas views de produtos)
  const totalClicks = Math.floor(totalProductViews * 1.5);
  const uniqueVisitors = Math.floor(totalClicks * 0.7);

  // Taxa de engajamento (views / clicks)
  const engagementRate = totalClicks > 0
    ? ((totalProductViews / totalClicks) * 100).toFixed(1)
    : '0.0';

  // Calcular tendências (simulado)
  const clicksTrend = Math.floor(Math.random() * 30) + 5;
  const visitorsTrend = Math.floor(Math.random() * 25) + 3;
  const viewsTrend = Math.floor(Math.random() * 35) + 10;
  const rateTrend = (Math.random() * 10 - 5).toFixed(1);

  // Gerar dados diários para o gráfico
  const dailyData = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Distribuir cliques ao longo dos dias com variação
    const baseClicks = totalClicks / days;
    const variation = (Math.random() - 0.5) * 0.4; // ±20%
    const dayClicks = Math.max(0, Math.floor(baseClicks * (1 + variation)));

    dailyData.push({
      date: date.toISOString().split('T')[0],
      clicks: dayClicks,
      visitors: Math.floor(dayClicks * 0.7)
    });
  }

  // Fontes de tráfego (distribuição percentual)
  const trafficSources = {
    instagram: Math.floor(totalClicks * 0.45),
    whatsapp: Math.floor(totalClicks * 0.30),
    direct: Math.floor(totalClicks * 0.15),
    other: Math.floor(totalClicks * 0.10)
  };

  return {
    totalClicks,
    uniqueVisitors,
    productViews: totalProductViews,
    engagementRate,
    trends: {
      clicks: clicksTrend,
      visitors: visitorsTrend,
      views: viewsTrend,
      rate: parseFloat(rateTrend)
    },
    dailyData,
    trafficSources
  };
}

// Atualizar estatísticas principais
function updateMainStats(data) {
  // Valores
  totalClicksEl.textContent = formatNumber(data.totalClicks);
  uniqueVisitorsEl.textContent = formatNumber(data.uniqueVisitors);
  productViewsEl.textContent = formatNumber(data.productViews);
  conversionRateEl.textContent = `${data.engagementRate}%`;

  // Tendências
  updateTrend(clicksTrendEl, data.trends.clicks);
  updateTrend(visitorsTrendEl, data.trends.visitors);
  updateTrend(viewsTrendEl, data.trends.views);
  updateTrend(rateTrendEl, data.trends.rate, true);
}

// Atualizar indicador de tendência
function updateTrend(element, value, allowNegative = false) {
  const parent = element.parentElement;
  const formattedValue = value > 0 ? `+${value}%` : `${value}%`;

  element.textContent = formattedValue;

  // Remover classes anteriores
  parent.classList.remove('positive', 'negative', 'neutral');

  if (value > 0) {
    parent.classList.add('positive');
  } else if (value < 0 && allowNegative) {
    parent.classList.add('negative');
  } else {
    parent.classList.add('neutral');
  }
}

// Atualizar top produtos
function updateTopProducts(products) {
  // Ordenar por views
  const sortedProducts = products
    .filter(p => (p.views || 0) > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  if (sortedProducts.length === 0) {
    topProductsEl.innerHTML = `
      <div class="empty-chart">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
        <p>Nenhum produto com visualizações ainda</p>
      </div>
    `;
    return;
  }

  topProductsEl.innerHTML = sortedProducts.map((product, index) => {
    const imageUrl = product.images?.[0] || product.image_url || 'https://via.placeholder.com/48';
    const price = formatCurrency(product.price);
    const views = product.views || 0;

    return `
      <div class="product-rank-item">
        <div class="rank-number">${index + 1}</div>
        <img src="${imageUrl}" alt="${product.name}" class="rank-image">
        <div class="rank-info">
          <div class="rank-name">${product.name}</div>
          <div class="rank-price">${price}</div>
        </div>
        <div class="rank-views">${formatNumber(views)} ${views === 1 ? 'view' : 'views'}</div>
      </div>
    `;
  }).join('');
}

// Atualizar gráfico de cliques
function updateClicksChart(data) {
  const svg = clicksChartEl.querySelector('svg');
  if (!svg) return;

  const width = 380;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 20, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Encontrar valores máximo e mínimo
  const maxClicks = Math.max(...data.dailyData.map(d => d.clicks), 10);
  const minClicks = 0;

  // Criar pontos do gráfico
  const points = data.dailyData.map((d, i) => {
    const x = padding.left + (i / (data.dailyData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.clicks - minClicks) / (maxClicks - minClicks)) * chartHeight;
    return { x, y, clicks: d.clicks };
  });

  // Criar path da linha
  const linePath = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  // Criar path da área (com preenchimento)
  const areaPath = `
    M ${padding.left} ${padding.top + chartHeight}
    L ${points[0].x} ${points[0].y}
    ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}
    L ${points[points.length - 1].x} ${padding.top + chartHeight}
    Z
  `;

  // Atualizar paths no SVG
  const dataPathEl = svg.querySelector('#dataPath');
  const dataLineEl = svg.querySelector('#dataLine');

  if (dataPathEl) dataPathEl.setAttribute('d', areaPath);
  if (dataLineEl) dataLineEl.setAttribute('d', linePath);
}

// Atualizar fontes de tráfego
function updateTrafficSources(data) {
  const total = data.totalClicks || 1;
  const sources = data.trafficSources;

  // Instagram
  instagramCountEl.textContent = `${formatNumber(sources.instagram)} cliques`;
  instagramBarEl.style.width = `${(sources.instagram / total) * 100}%`;

  // WhatsApp
  whatsappCountEl.textContent = `${formatNumber(sources.whatsapp)} cliques`;
  whatsappBarEl.style.width = `${(sources.whatsapp / total) * 100}%`;

  // Direto
  directCountEl.textContent = `${formatNumber(sources.direct)} cliques`;
  directBarEl.style.width = `${(sources.direct / total) * 100}%`;

  // Outros
  otherCountEl.textContent = `${formatNumber(sources.other)} cliques`;
  otherBarEl.style.width = `${(sources.other / total) * 100}%`;
}

// Formatar número
function formatNumber(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

// Formatar moeda
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'error' ? '#ef4444' : '#10b981'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Event Listeners

// Seletor de período
periodBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    // Atualizar botão ativo
    periodBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Carregar novos dados
    currentPeriod = parseInt(btn.dataset.period);
    await loadAnalytics(currentPeriod);
  });
});

// Botão de atualizar
refreshBtn.addEventListener('click', async () => {
  refreshBtn.style.transform = 'rotate(360deg)';
  refreshBtn.style.transition = 'transform 0.5s ease';

  await loadAnalytics(currentPeriod);

  setTimeout(() => {
    refreshBtn.style.transform = 'rotate(0deg)';
  }, 500);

  showNotification('Dados atualizados!', 'success');
});

// Botão de exportar
exportBtn.addEventListener('click', () => {
  if (!analyticsData) {
    showNotification('Nenhum dado para exportar', 'error');
    return;
  }

  // Criar CSV
  const csv = generateCSV(analyticsData);

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics-${currentPeriod}dias-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  showNotification('Dados exportados com sucesso!', 'success');
});

// Gerar CSV
function generateCSV(data) {
  let csv = 'Data,Cliques,Visitantes\n';

  data.dailyData.forEach(day => {
    csv += `${day.date},${day.clicks},${day.visitors}\n`;
  });

  csv += '\n\nResumo\n';
  csv += `Total de Cliques,${data.totalClicks}\n`;
  csv += `Visitantes Únicos,${data.uniqueVisitors}\n`;
  csv += `Visualizações de Produtos,${data.productViews}\n`;
  csv += `Taxa de Engajamento,${data.engagementRate}%\n`;

  csv += '\n\nFontes de Tráfego\n';
  csv += `Instagram,${data.trafficSources.instagram}\n`;
  csv += `WhatsApp,${data.trafficSources.whatsapp}\n`;
  csv += `Acesso Direto,${data.trafficSources.direct}\n`;
  csv += `Outros,${data.trafficSources.other}\n`;

  return csv;
}

// Logout
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Tem certeza que deseja sair?')) {
    api.logout();
  }
});

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
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
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initAnalytics);
