/**
 * WargaKonek Desa Pajerukan - Services Page JS
 */

document.addEventListener('DOMContentLoaded', () => {
  const categoryFilter = document.getElementById('filter-service-cat');
  const searchInput = document.getElementById('search-service-input');
  const container = document.getElementById('services-grid-container');

  let debounceTimer = null;

  async function fetchServices() {
    container.innerHTML = Utils.renderLoading('Memuat informasi layanan...');

    const category = categoryFilter.value;
    const search = searchInput.value.trim();

    try {
      const res = await Api.get('/services', { category, search });
      const services = res.data || [];

      if (services.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1;">
            ${Utils.renderEmpty('Tidak ada jenis layanan yang sesuai pencarian.', 'file-text')}
          </div>
        `;
        return;
      }

      container.innerHTML = services.map(s => {
        const reqItems = (s.requirements || []).map(r => `<li>${r}</li>`).join('');

        return `
          <div class="service-item-card">
            <span class="service-code">${s.code}</span>
            <h3 class="service-name">${s.name}</h3>
            
            <div class="service-duration">
              <i data-lucide="clock" class="icon icon-sm"></i>
              <span>${s.duration}</span>
            </div>

            <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.45; margin-bottom:0.75rem;">
              ${s.description}
            </p>

            <div style="margin-top:auto; padding-top:0.75rem; border-top:1px solid var(--border-color);">
              <h5 style="font-size:0.825rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--gov-primary); margin-bottom:0.35rem;">
                Persyaratan Berkas:
              </h5>
              <ul class="service-req-list">
                ${reqItems}
              </ul>
            </div>
          </div>
        `;
      }).join('');

      window.refreshIcons();
    } catch (error) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1;">
          ${Utils.renderError('Gagal memuat daftar layanan desa.')}
        </div>
      `;
    }
  }

  categoryFilter.addEventListener('change', fetchServices);
  
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchServices, 300);
  });

  fetchServices();
});
