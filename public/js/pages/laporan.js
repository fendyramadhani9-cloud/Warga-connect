/**
 * WargaKonek Desa Pajerukan - Citizen Reports List JS
 */

document.addEventListener('DOMContentLoaded', async () => {
  const statusFilter = document.getElementById('filter-status');
  const categoryFilter = document.getElementById('filter-category');
  const searchInput = document.getElementById('search-report');
  const container = document.getElementById('reports-list-container');

  let debounceTimer = null;

  // Load report categories from API
  async function loadCategories() {
    try {
      const res = await Api.get('/report-categories');
      const cats = res.data || [];
      cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        categoryFilter.appendChild(opt);
      });
    } catch (e) {
      console.warn('Gagal memuat kategori:', e);
    }
  }

  async function fetchReports() {
    container.innerHTML = Utils.renderLoading('Memuat daftar laporan...');

    const user = Auth.getCurrentUser();
    const status = statusFilter.value;
    const category = categoryFilter.value;
    const search = searchInput.value.trim();

    // Warga views their own reports
    const reporterId = user.role === 'warga' ? user.id : undefined;

    try {
      const res = await Api.get('/reports', { status, category, search, reporterId });
      const reports = res.data || [];

      if (reports.length === 0) {
        container.innerHTML = Utils.renderEmpty(
          'Belum ada laporan yang cocok. Klik "Buat Laporan Baru" untuk menyampaikan keluhan sarana desa.',
          'file-plus'
        );
        return;
      }

      container.innerHTML = reports.map(r => `
        <div class="report-card-item">
          <div class="report-card-header">
            <div>
              <span class="report-id">${r.id}</span>
              <h3 style="font-size: 1.15rem; margin: 0.25rem 0;">
                <a href="/laporan/${r.id}" class="report-title-link">${r.title}</a>
              </h3>
              <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
                <span class="category-pill">${r.category}</span>
                <span class="report-location-info">
                  <i data-lucide="map-pin" class="icon icon-sm"></i>
                  ${r.location}
                </span>
                <span style="font-size:0.8rem; color:var(--text-muted);">
                  <i data-lucide="calendar" class="icon icon-sm"></i>
                  ${Utils.formatDateTime(r.createdAt)}
                </span>
              </div>
            </div>
            <div>
              ${Utils.renderStatusBadge(r.status)}
            </div>
          </div>

          <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5; margin: 0;">
            ${r.description.length > 180 ? r.description.slice(0, 180) + '...' : r.description}
          </p>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-size: 0.85rem;">
            <span style="color: var(--text-muted);">
              Pelapor: <strong>${r.reporterName}</strong>
            </span>
            <a href="/laporan/${r.id}" class="btn btn-sm btn-outline">
              Pantau Detail & Riwayat
              <i data-lucide="arrow-right" class="icon icon-sm"></i>
            </a>
          </div>
        </div>
      `).join('');

      window.refreshIcons();
    } catch (error) {
      container.innerHTML = Utils.renderError('Gagal memuat laporan pengaduan.');
    }
  }

  await loadCategories();
  await fetchReports();

  statusFilter.addEventListener('change', fetchReports);
  categoryFilter.addEventListener('change', fetchReports);
  
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchReports, 300);
  });
});
