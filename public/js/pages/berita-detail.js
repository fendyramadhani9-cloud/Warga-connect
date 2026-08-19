/**
 * WargaKonek Desa Pajerukan - News Detail JS
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('article-detail-wrap');
  const breadcrumbTitle = document.getElementById('breadcrumb-title');

  // Extract ID or slug from URL path or query string
  // Examples: /berita/news-001 or /berita-detail.html?id=news-001
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  let articleId = null;

  if (pathParts.length >= 2 && pathParts[0] === 'berita') {
    articleId = pathParts[1];
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    articleId = urlParams.get('id');
  }

  if (!articleId) {
    articleId = 'news-001'; // Default fallback demo
  }

  try {
    const res = await Api.get(`/announcements/${articleId}`);
    const article = res.data;

    breadcrumbTitle.textContent = article.title;
    document.title = `${article.title} — WargaKonek Desa Pajerukan`;

    const relatedHtml = (article.related || []).map(item => `
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.85rem; margin-bottom: 0.85rem;">
        <span class="category-pill" style="font-size:0.7rem; margin-bottom:0.25rem;">${item.category}</span>
        <h4 style="font-size:0.925rem; line-height:1.35; margin-top:0.25rem;">
          <a href="/berita/${item.id}" style="color:var(--text-main);">${item.title}</a>
        </h4>
        <span style="font-size:0.75rem; color:var(--text-muted);">${Utils.formatDate(item.date)}</span>
      </div>
    `).join('');

    const formattedParagraphs = article.content
      .split('\n\n')
      .map(p => {
        if (p.trim().startsWith('1.') || p.trim().startsWith('-')) {
          const items = p.split('\n').map(li => `<li>${li.replace(/^[0-9]+\.\s*|-\s*/, '')}</li>`).join('');
          return `<ul>${items}</ul>`;
        }
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
      })
      .join('');

    container.innerHTML = `
      <div class="article-container">
        <!-- Main Article -->
        <article class="article-main">
          <div style="margin-bottom: 0.75rem;">
            <span class="category-pill" style="background:var(--gov-primary); color:#FFF;">${article.category}</span>
          </div>
          <h1 class="article-headline">${article.title}</h1>
          
          <div class="article-info-bar">
            <span><i data-lucide="calendar" class="icon icon-sm"></i> ${Utils.formatDate(article.date)}</span>
            <span><i data-lucide="user" class="icon icon-sm"></i> ${article.author}</span>
            <span><i data-lucide="map-pin" class="icon icon-sm"></i> Balai Desa Pajerukan</span>
          </div>

          <div class="article-featured-image">
            <img src="${article.image}" alt="${article.title}">
          </div>

          <div class="article-body">
            ${formattedParagraphs}
          </div>

          <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <a href="/berita" class="btn btn-sm btn-outline">
              <i data-lucide="arrow-left" class="icon icon-sm"></i>
              Kembali ke Daftar Berita
            </a>
            <button class="btn btn-sm btn-secondary" onclick="window.print()">
              <i data-lucide="printer" class="icon icon-sm"></i>
              Cetak Berita
            </button>
          </div>
        </article>

        <!-- Sidebar -->
        <aside>
          <div class="card" style="margin-bottom: 2rem;">
            <div class="card-header">
              <i data-lucide="newspaper" class="icon icon-sm"></i>
              Berita Terkait Lainnya
            </div>
            <div class="card-body">
              ${relatedHtml || '<p style="color:var(--text-muted); font-size:0.85rem;">Tidak ada berita terkait lainnya.</p>'}
            </div>
          </div>

          <div class="card" style="background-color: var(--gov-primary-soft); border-color: var(--gov-primary-light);">
            <div class="card-body">
              <h4 style="color: var(--gov-primary-dark); font-size: 1rem; margin-bottom: 0.5rem;">
                Punya Informasi atau Laporan?
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 1rem;">
                Sampaikan aspirasi atau laporkan permasalahan sarana desa melalui kanal pengaduan resmi WargaKonek.
              </p>
              <a href="/laporan/buat" class="btn btn-sm btn-primary" style="width:100%;">
                <i data-lucide="plus-circle" class="icon icon-sm"></i>
                Buat Laporan Baru
              </a>
            </div>
          </div>
        </aside>
      </div>
    `;

    window.refreshIcons();
  } catch (error) {
    container.innerHTML = Utils.renderError('Artikel berita tidak dapat ditemukan atau gagal dimuat.');
  }
});
