/**
 * WargaKonek Desa Pajerukan - Create Report JS
 */

document.addEventListener('DOMContentLoaded', async () => {
  const categorySelect = document.getElementById('report-category');
  const form = document.getElementById('create-report-form');
  const btnSubmit = document.getElementById('btn-submit-report');

  // Pre-fill user info if logged in as warga
  const user = Auth.getCurrentUser();
  if (user && user.role === 'warga') {
    if (user.name) document.getElementById('reporter-name').value = user.name;
    if (user.contact) document.getElementById('reporter-contact').value = user.contact;
  }

  // Load Categories from API
  try {
    const res = await Api.get('/report-categories');
    const categories = res.data || [];
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load categories:', error);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('report-title').value.trim();
    const category = categorySelect.value;
    const location = document.getElementById('report-location').value.trim();
    const description = document.getElementById('report-description').value.trim();
    const photoUrl = document.getElementById('report-photo').value.trim();
    const reporterName = document.getElementById('reporter-name').value.trim();
    const reporterContact = document.getElementById('reporter-contact').value.trim();

    if (!title || !category || !location || !description || !reporterName || !reporterContact) {
      Toast.show('Mohon lengkapi seluruh kolom formulir yang wajib diisi (*).', 'error');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `
      <div class="loading-spinner" style="width:16px; height:16px; margin:0; border-width:2px;"></div>
      <span>Mengirim Laporan...</span>
    `;

    try {
      const res = await Api.post('/reports', {
        title,
        category,
        location,
        description,
        photoUrl,
        reporterName,
        reporterContact,
        reporterId: user.id || 'warga-01'
      });

      Toast.show('Laporan pengaduan berhasil diajukan!', 'success');
      
      const newReportId = res.data.id;
      setTimeout(() => {
        window.location.href = `/laporan/${newReportId}`;
      }, 800);
    } catch (error) {
      Toast.show(error.message || 'Gagal mengirim laporan. Silakan periksa kembali formulir Anda.', 'error');
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `
        <i data-lucide="send" class="icon icon-sm"></i>
        <span>Kirim Laporan Pengaduan</span>
      `;
      window.refreshIcons();
    }
  });
});
