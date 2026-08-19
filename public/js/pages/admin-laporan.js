/**
 * WargaKonek Desa Pajerukan - Admin Reports Management JS
 */

document.addEventListener('DOMContentLoaded', async () => {
  const statusFilter = document.getElementById('admin-filter-status');
  const categoryFilter = document.getElementById('admin-filter-category');
  const searchInput = document.getElementById('admin-search-input');
  const tbody = document.getElementById('admin-reports-table-body');

  let debounceTimer = null;

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

  async function fetchAllAdminReports() {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:2rem;">
          <div class="loading-spinner" style="width:28px; height:28px; margin:0 auto 0.5rem;"></div>
          <span>Memuat seluruh laporan warga...</span>
        </td>
      </tr>
    `;

    const status = statusFilter.value;
    const category = categoryFilter.value;
    const search = searchInput.value.trim();

    try {
      const res = await Api.get('/admin/reports', { status, category, search });
      const reports = res.data || [];

      if (reports.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
              Tidak ada data laporan yang sesuai dengan kriteria filter saat ini.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = reports.map(r => `
        <tr>
          <td style="font-weight:700; color:var(--gov-accent); white-space:nowrap;">
            ${r.id}
          </td>
          <td>
            <a href="/admin/laporan/${r.id}" style="font-weight:600; color:var(--text-main); display:block; margin-bottom:0.2rem;">
              ${r.title}
            </a>
            <div style="font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:0.25rem;">
              <i data-lucide="map-pin" class="icon icon-sm"></i>
              ${r.location}
            </div>
          </td>
          <td><span class="category-pill">${r.category}</span></td>
          <td style="font-weight:600;">${r.reporterName || '-'}</td>
          <td style="font-size:0.8rem; color:var(--text-muted);">${r.reporterContact || '-'}</td>
          <td style="font-size:0.8rem; color:var(--text-muted); white-space:nowrap;">${Utils.formatDate(r.createdAt)}</td>
          <td>${Utils.renderStatusBadge(r.status)}</td>
          <td style="text-align:right; white-space:nowrap;">
            <a href="/admin/laporan/${r.id}" class="btn btn-sm btn-primary">
              <i data-lucide="edit-3" class="icon icon-sm"></i>
              Kelola
            </a>
          </td>
        </tr>
      `).join('');

      window.refreshIcons();
    } catch (error) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:2rem; color:#DC2626;">
            Gagal memuat data laporan admin.
          </td>
        </tr>
      `;
    }
  }

  await loadCategories();
  await fetchAllAdminReports();

  statusFilter.addEventListener('change', fetchAllAdminReports);
  categoryFilter.addEventListener('change', fetchAllAdminReports);

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchAllAdminReports, 300);
  });
});
