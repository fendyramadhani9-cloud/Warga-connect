/**
 * WargaKonek Desa Pajerukan - Admin Dashboard JS
 */

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadAdminStats(),
    loadRecentReports()
  ]);
});

async function loadAdminStats() {
  const container = document.getElementById('admin-stats-container');

  try {
    const res = await Api.get('/stats');
    const stats = res.data.reports || {};

    container.innerHTML = `
      <div class="stat-box" style="border-left: 3px solid var(--gov-primary);">
        <div class="stat-num">${stats.total || 0}</div>
        <div class="stat-label">Total Laporan</div>
      </div>
      <div class="stat-box" style="border-left: 3px solid #F59E0B;">
        <div class="stat-num" style="color:#B45309;">${stats.menunggu || 0}</div>
        <div class="stat-label">Menunggu</div>
      </div>
      <div class="stat-box" style="border-left: 3px solid #0284C7;">
        <div class="stat-num" style="color:#0369A1;">${stats.ditinjau || 0}</div>
        <div class="stat-label">Ditinjau</div>
      </div>
      <div class="stat-box" style="border-left: 3px solid #7C3AED;">
        <div class="stat-num" style="color:#6D28D9;">${stats.diproses || 0}</div>
        <div class="stat-label">Diproses</div>
      </div>
      <div class="stat-box" style="border-left: 3px solid #10B981;">
        <div class="stat-num" style="color:#047857;">${stats.selesai || 0}</div>
        <div class="stat-label">Selesai</div>
      </div>
      <div class="stat-box" style="border-left: 3px solid #EF4444;">
        <div class="stat-num" style="color:#B91C1C;">${stats.ditolak || 0}</div>
        <div class="stat-label">Ditolak</div>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

async function loadRecentReports() {
  const tbody = document.getElementById('admin-recent-reports-body');

  try {
    const res = await Api.get('/admin/reports');
    const reports = (res.data || []).slice(0, 5);

    if (reports.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">
            Belum ada laporan pengaduan yang diajukan oleh warga.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = reports.map(r => `
      <tr>
        <td style="font-weight:700; color:var(--gov-accent);">${r.id}</td>
        <td>
          <a href="/admin/laporan/${r.id}" style="font-weight:600; color:var(--text-main);">${r.title}</a>
          <div style="font-size:0.75rem; color:var(--text-muted);">${r.location}</div>
        </td>
        <td><span class="category-pill">${r.category}</span></td>
        <td>${r.reporterName || '-'}</td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${Utils.formatDate(r.createdAt)}</td>
        <td>${Utils.renderStatusBadge(r.status)}</td>
        <td style="text-align:right;">
          <a href="/admin/laporan/${r.id}" class="btn btn-sm btn-outline">
            Tinjau & Tindak
            <i data-lucide="chevron-right" class="icon icon-sm"></i>
          </a>
        </td>
      </tr>
    `).join('');

    window.refreshIcons();
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:2rem; color:#DC2626;">
          Gagal memuat data laporan warga.
        </td>
      </tr>
    `;
  }
}
