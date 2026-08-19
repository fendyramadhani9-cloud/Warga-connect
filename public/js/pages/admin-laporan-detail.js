/**
 * WargaKonek Desa Pajerukan - Admin Report Review & Action JS
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('admin-detail-wrapper');
  const breadcrumbId = document.getElementById('admin-breadcrumb-id');
  const modal = document.getElementById('status-action-modal');
  const modalTitle = document.getElementById('modal-action-title');
  const modalDesc = document.getElementById('modal-action-desc');
  const modalTargetStatus = document.getElementById('modal-target-status');
  const modalNote = document.getElementById('modal-status-note');
  const modalNoteRequired = document.getElementById('modal-note-required');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const btnConfirmStatus = document.getElementById('btn-confirm-status');

  // Extract ID from URL path or query params
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  let reportId = null;

  if (pathParts.length >= 3 && pathParts[0] === 'admin' && pathParts[1] === 'laporan') {
    reportId = pathParts[2];
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    reportId = urlParams.get('id');
  }

  if (!reportId) {
    reportId = 'LAP-2026-0801';
  }

  let currentReportData = null;

  async function loadReportDetail() {
    container.innerHTML = Utils.renderLoading('Memuat rincian laporan warga...');

    try {
      const res = await Api.get(`/reports/${reportId}`);
      currentReportData = res.data;

      breadcrumbId.textContent = currentReportData.id;
      document.title = `Kelola: ${currentReportData.id} — Admin WargaKonek`;

      renderDetailView(currentReportData);
    } catch (error) {
      container.innerHTML = Utils.renderError('Laporan tidak ditemukan atau gagal dimuat.');
    }
  }

  function renderDetailView(report) {
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

    // Determine workflow buttons
    let actionButtonsHtml = '';
    const st = report.status;

    if (st === 'Menunggu') {
      actionButtonsHtml = `
        <button class="btn btn-primary" onclick="openActionModal('Ditinjau')">
          <i data-lucide="eye" class="icon icon-sm"></i>
          Tandai Ditinjau (Verifikasi Masuk)
        </button>
      `;
    } else if (st === 'Ditinjau') {
      actionButtonsHtml = `
        <button class="btn btn-primary" onclick="openActionModal('Diproses')">
          <i data-lucide="loader" class="icon icon-sm"></i>
          Teruskan & Proses Tindak Lanjut
        </button>
        <button class="btn btn-danger" onclick="openActionModal('Ditolak')">
          <i data-lucide="x-circle" class="icon icon-sm"></i>
          Tolak Laporan
        </button>
      `;
    } else if (st === 'Diproses') {
      actionButtonsHtml = `
        <button class="btn btn-primary" style="background-color:#166534; border-color:#166534;" onclick="openActionModal('Selesai')">
          <i data-lucide="check-circle" class="icon icon-sm"></i>
          Tandai Penanganan Selesai
        </button>
      `;
    } else if (st === 'Selesai' || st === 'Ditolak') {
      actionButtonsHtml = `
        <div class="alert ${st === 'Selesai' ? 'alert-success' : 'alert-warning'}" style="margin:0; width:100%;">
          <i data-lucide="${st === 'Selesai' ? 'check-circle' : 'info'}" class="icon"></i>
          <span>Laporan ini telah berstatus final (<strong>${st}</strong>).</span>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="report-detail-layout">
        
        <!-- Left: Main Report Info -->
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
            <span><i data-lucide="calendar" class="icon icon-sm"></i> Masuk: ${Utils.formatDateTime(report.createdAt)}</span>
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
              <h4 style="font-size:1rem; color:var(--gov-primary); margin-bottom:0.5rem;">Dokumentasi Foto Bukti:</h4>
              <div style="max-width:500px; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-color);">
                <img src="${report.photoUrl}" alt="${report.title}" style="width:100%; height:auto;">
              </div>
            </div>
          ` : ''}

          <!-- Admin Action Control Bar -->
          <div class="card" style="margin-top:2rem; border:2px solid var(--gov-primary); background:#FCFDFD;">
            <div class="card-header" style="background:var(--gov-primary-soft);">
              <i data-lucide="check-square" class="icon icon-sm"></i>
              Tindakan Status Petugas Admin Desa
            </div>
            <div class="card-body" style="display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center;">
              ${actionButtonsHtml}
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem;">
            <a href="/admin/laporan" class="btn btn-sm btn-outline">
              <i data-lucide="arrow-left" class="icon icon-sm"></i>
              Kembali ke Daftar Semua Laporan
            </a>
          </div>

        </div>

        <!-- Right: Reporter Info & Timeline History -->
        <div class="report-detail-sidebar">
          
          <div class="card">
            <div class="card-header">
              <i data-lucide="user" class="icon icon-sm"></i>
              Informasi Pelapor
            </div>
            <div class="card-body">
              <table style="width:100%; font-size:0.875rem; border-collapse:collapse;">
                <tr style="border-bottom:1px solid var(--border-color);">
                  <td style="padding:0.4rem 0; color:var(--text-muted);">Nama Warga:</td>
                  <td style="padding:0.4rem 0; font-weight:600; text-align:right;">${report.reporterName || '-'}</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border-color);">
                  <td style="padding:0.4rem 0; color:var(--text-muted);">Kontak / HP:</td>
                  <td style="padding:0.4rem 0; font-weight:600; text-align:right;">${report.reporterContact || '-'}</td>
                </tr>
                <tr>
                  <td style="padding:0.4rem 0; color:var(--text-muted);">ID Pelapor:</td>
                  <td style="padding:0.4rem 0; font-weight:600; text-align:right;">${report.reporterId || '-'}</td>
                </tr>
              </table>
            </div>
          </div>

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

        </div>

      </div>
    `;

    window.refreshIcons();
  }

  // Modal Handlers
  window.openActionModal = function(targetStatus) {
    modalTargetStatus.value = targetStatus;
    modalNote.value = '';

    if (targetStatus === 'Ditinjau') {
      modalTitle.textContent = 'Verifikasi Laporan (Tandai Ditinjau)';
      modalDesc.textContent = 'Konfirmasi bahwa admin telah membaca dan memverifikasi kelengkapan informasi laporan ini.';
      modalNote.placeholder = 'Contoh: Laporan telah diverifikasi oleh staf pelayanan umum. Lokasi titik sarana telah dicatat.';
      modalNoteRequired.style.display = 'none';
    } else if (targetStatus === 'Diproses') {
      modalTitle.textContent = 'Proses Tindak Lanjut Laporan';
      modalDesc.textContent = 'Masukkan informasi bagian atau tim teknis yang ditugaskan menangani permasalahan ini.';
      modalNote.placeholder = 'Contoh: Laporan telah diteruskan ke Kaur Pembangunan untuk jadwal survei teknis dan estimasi perbaikan.';
      modalNoteRequired.style.display = 'none';
    } else if (targetStatus === 'Selesai') {
      modalTitle.textContent = 'Tandai Laporan Selesai';
      modalDesc.textContent = 'Berikan catatan hasil penanganan atau penyelesaian pekerjaan di lapangan.';
      modalNote.placeholder = 'Contoh: Penggantian bohlam penerangan jalan telah selesai dilakukan oleh tim pemeliharaan desa.';
      modalNoteRequired.style.display = 'none';
    } else if (targetStatus === 'Ditolak') {
      modalTitle.textContent = 'Tolak Laporan Pengaduan';
      modalDesc.textContent = 'Alasan penolakan WAJIB dicantumkan secara jelas agar warga memahami dasar keputusan desa.';
      modalNote.placeholder = 'Contoh: Lokasi jalan berada di lahan hak milik pribadi dan bukan termasuk aset fasilitas umum desa.';
      modalNoteRequired.style.display = 'inline';
    }

    modal.classList.add('is-active');
  };

  function closeModal() {
    modal.classList.remove('is-active');
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (btnConfirmStatus) {
    btnConfirmStatus.addEventListener('click', async () => {
      const targetStatus = modalTargetStatus.value;
      const note = modalNote.value.trim();

      if (targetStatus === 'Ditolak' && (!note || note.length < 5)) {
        Toast.show('Alasan penolakan laporan wajib dicantumkan minimal 5 karakter.', 'error');
        return;
      }

      btnConfirmStatus.disabled = true;
      btnConfirmStatus.innerHTML = `
        <div class="loading-spinner" style="width:14px; height:14px; margin:0; border-width:2px;"></div>
        <span>Menyimpan...</span>
      `;

      try {
        const res = await Api.patch(`/admin/reports/${reportId}/status`, {
          status: targetStatus,
          note: note
        });

        Toast.show(res.message || `Status berhasil diubah menjadi ${targetStatus}`, 'success');
        closeModal();
        await loadReportDetail();
      } catch (error) {
        Toast.show(error.message || 'Gagal memperbarui status laporan.', 'error');
      } finally {
        btnConfirmStatus.disabled = false;
        btnConfirmStatus.innerHTML = `
          <i data-lucide="check" class="icon icon-sm"></i>
          Konfirmasi Perubahan
        `;
        window.refreshIcons();
      }
    });
  }

  await loadReportDetail();
});
