/**
 * WargaKonek Desa Pajerukan - News Listing JS
 */

document.addEventListener('DOMContentLoaded', () => {
  const categoryFilter = document.getElementById('filter-category');
  const searchInput = document.getElementById('search-input');

  let debounceTimer = null;

  async function fetchAndRenderNews() {
    const container = document.getElementById('news-grid-container');
    container.innerHTML = Utils.renderLoading('Memuat warta berita desa...');

    const category = categoryFilter.value;
    const search = searchInput.value.trim();

    try {
      const res = await Api.get('/announcements', { category, search });
      const news = res.data || [];

      if (news.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1;">
            ${Utils.renderEmpty('Tidak ditemukan berita yang cocok dengan kriteria pencarian.', 'newspaper')}
          </div>
        `;
        return;
      }

      container.innerHTML = news.map(item => `
        <article class="news-grid-card">
          <div class="news-card-img">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>
          <div class="news-card-body">
            <div class="article-meta">
              <span class="category-pill">${item.category}</span>
              <span>${Utils.formatDate(item.date)}</span>
            </div>
            <h3 class="news-card-title">
              <a href="/berita/${item.id}">${item.title}</a>
            </h3>
            <p class="news-card-summary">${item.summary}</p>
            <div style="margin-top:auto; padding-top:0.75rem;">
              <a href="/berita/${item.id}" class="btn btn-sm btn-outline" style="width:100%;">
                Baca Selengkapnya
                <i data-lucide="arrow-right" class="icon icon-sm"></i>
              </a>
            </div>
          </div>
        </article>
      `).join('');

      window.refreshIcons();
    } catch (error) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1;">
          ${Utils.renderError('Gagal memuat daftar berita dari server.')}
        </div>
      `;
    }
  }

  categoryFilter.addEventListener('change', fetchAndRenderNews);
  
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchAndRenderNews, 350);
  });

  fetchAndRenderNews();
});
