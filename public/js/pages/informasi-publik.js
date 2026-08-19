/**
 * WargaKonek Desa Pajerukan - Public Info & Documents Page JS
 */

document.addEventListener('DOMContentLoaded', () => {
  const categoryFilter = document.getElementById('filter-doc-cat');
  const searchInput = document.getElementById('search-doc-input');
  const container = document.getElementById('docs-list-container');

  let debounceTimer = null;

  async function fetchDocs() {
    container.innerHTML = Utils.renderLoading('Memuat arsip dokumen publik...');

    const category = categoryFilter.value;
    const search = searchInput.value.trim();

    try {
      const res = await Api.get('/public-info', { category, search });
      const docs = res.data || [];

      if (docs.length === 0) {
        container.innerHTML = Utils.renderEmpty('Tidak ada dokumen yang sesuai dengan pencarian Anda.', 'file-x');
        return;
      }

      container.innerHTML = docs.map(doc => `
        <div class="doc-download-row">
          <div class="doc-info" style="flex: 1 1 auto;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
              <span class="category-pill">${doc.category}</span>
              <span style="font-size:0.75rem; color:var(--text-muted);">${Utils.formatDate(doc.date)}</span>
            </div>
            <h4>${doc.title}</h4>
            <p>${doc.description}</p>
            <div class="doc-meta">
              <span><i data-lucide="file" class="icon icon-sm"></i> Format: <strong>${doc.fileType}</strong></span>
              <span><i data-lucide="hard-drive" class="icon icon-sm"></i> Ukuran: ${doc.fileSize}</span>
            </div>
          </div>
          <div style="flex-shrink: 0;">
            <button class="btn btn-sm btn-outline" onclick="Toast.show('Memulai unduh dokumen resmi: ${doc.title}', 'success')">
              <i data-lucide="download" class="icon icon-sm"></i>
              Unduh Dokumen
            </button>
          </div>
        </div>
      `).join('');

      window.refreshIcons();
    } catch (error) {
      container.innerHTML = Utils.renderError('Gagal memuat arsip dokumen publik.');
    }
  }

  categoryFilter.addEventListener('change', fetchDocs);
  
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchDocs, 300);
  });

  fetchDocs();
});
