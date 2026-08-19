/**
 * WargaKonek Desa Pajerukan - Citizen Report Detail & Timeline JS
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('report-detail-wrapper');
  const breadcrumbId = document.getElementById('breadcrumb-report-id');

  // Extract ID from URL path or query params
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  let reportId = null;

  if (pathParts.length >= 2 && pathParts[0] === 'laporan') {
    reportId = pathParts[1];
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    reportId = urlParams.get('id');
  }

  if (!reportId) {
    reportId = 'LAP-2026-0801';
  }

  try {
    const res = await Api.get(`/reports/${reportId}`);
    const report = res.data;

    breadcrumbId.textContent = report.id;
    document.title = `${report.id} - ${report.title} — WargaKonek`;

    // Render Timeline Steps
    const history = report.history || [];
    const timelineHtml = history.map((item, index) => {
      const isLatest = index === history.length - 1;
      return `
        <div class="timeline-step ${isLatest ? 'completed' : ''}">
          <div class="timeline-node"></div>
          <div class="timeline-time">${Utils.formatDateTime(item.timestamp)}</div>
          <div class="timeline-title">${item.status}</div>
          <div class="timeline-note">
            ${item.note || '-'}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="report-detail-layout">
        
        <!-- Left: Main Report Content -->
        <div class="report-detail-main">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; margin-bottom:1rem;">
            <div>
              <span class="report-id" style="font-size:0.9rem;">${report.id}</span>
              <h1 style="font-size:1.6rem; color:var(--gov-primary-dark); margin:0.35rem 0;">${report.title}</h1>
            </div>
            <div>
              ${Utils.renderStatusBadge(report.status)}
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:1.25rem; font-size:0.85rem; color:var(--text-muted); padding:0.75rem 0; border-top:1px solid var(--border-color); border-bottom:1px solid var(--border-color); margin-bottom:1.5rem;">
            <span><i data-lucide="tag" class="icon icon-sm"></i> Kategori: <strong>${report.category}</strong></span>
            <span><i data-lucide="calendar" class="icon icon-sm"></i> Diajukan: ${Utils.formatDateTime(report.createdAt)}</span>
            <span><i data-lucide="map-pin" class="icon icon-sm"></i> Lokasi: ${report.location}</span>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size:1rem; color:var(--gov-primary); margin-bottom:0.5rem;">Deskripsi Kejadian / Keluhan:</h4>
            <p style="font-size:0.95rem; line-height:1.6; color:var(--text-main); background:var(--bg-subtle); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              ${report.description}
            </p>
          </div>

          ${report.photoUrl ? `
            <div style="margin-bottom: 1.75rem;">
              <h4 style="font-size:1rem; color:var(--gov-primary); margin-bottom:0.5rem;">Foto Dokumentasi Lapangan:</h4>
              <div style="max-width:500px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-color);">
                <img src="${report.photoUrl}" alt="${report.title}" style="width:100%; height:auto;">
              </div>
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2rem; padding-top:1.25rem; border-top:1px solid var(--border-color);">
            <a href="/laporan" class="btn btn-sm btn-outline">
              <i data-lucide="arrow-left" class="icon icon-sm"></i>
              Kembali ke Daftar Laporan
            </a>
            <span style="font-size:0.8rem; color:var(--text-muted);">
              Terakhir diperbarui: ${Utils.formatDateTime(report.updatedAt)}
            </span>
          </div>
        </div>

        <!-- Right: Status Timeline Tracker -->
        <div class="report-detail-sidebar">
          
          <div class="card">
            <div class="card-header">
              <i data-lucide="activity" class="icon icon-sm"></i>
              Riwayat Penanganan Laporan
            </div>
            <div class="card-body">
              <div class="timeline-container">
                ${timelineHtml}
              </div>
            </div>
          </div>

          <div class="card" style="background-color: var(--bg-subtle);">
            <div class="card-body">
              <h4 style="font-size:0.925rem; color:var(--gov-primary-dark); margin-bottom:0.4rem;">
                Informasi Pelapor
              </h4>
              <p style="font-size:0.85rem; margin-bottom:0.25rem;">
                Nama: <strong>${report.reporterName}</strong>
              </p>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0;">
                Kontak: ${report.reporterContact}
              </p>
            </div>
          </div>

        </div>

      </div>
    `;

    window.refreshIcons();
  } catch (error) {
    container.innerHTML = Utils.renderError('Laporan pengaduan tidak ditemukan atau gagal dimuat.');
  }
});
