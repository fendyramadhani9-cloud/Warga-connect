/**
 * WargaKonek Desa Pajerukan - Homepage Interactive Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadHeroAndLatestNews(),
    loadUpcomingEvents()
  ]);
});

async function loadHeroAndLatestNews() {
  const heroContainer = document.getElementById('hero-news-container');
  const latestList = document.getElementById('latest-news-list');

  try {
    const res = await Api.get('/announcements');
    const news = res.data || [];

    if (news.length === 0) {
      heroContainer.innerHTML = Utils.renderEmpty('Belum ada berita yang dipublikasikan.');
      latestList.innerHTML = Utils.renderEmpty('Tidak ada berita terbaru.');
      return;
    }

    const featured = news[0];
    const sideNews = news.slice(1, 4);
    const bottomNews = news.slice(4, 8);

    // Render Editorial Hero Section
    let sideNewsHtml = sideNews.map(item => `
      <article class="side-news-card">
        <div class="side-news-thumb">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="side-news-info">
          <div class="article-meta" style="margin-bottom: 0.25rem;">
            <span class="category-pill">${item.category}</span>
            <span>${Utils.formatDate(item.date)}</span>
          </div>
          <h4 class="side-news-title">
            <a href="/berita/${item.id}">${item.title}</a>
          </h4>
        </div>
      </article>
    `).join('');

    heroContainer.innerHTML = `
      <div class="hero-editorial">
        <!-- Main Featured Article -->
        <article class="featured-article">
          <div class="featured-img-wrap">
            <img src="${featured.image}" alt="${featured.title}">
          </div>
          <div class="featured-content">
            <div class="article-meta">
              <span class="category-pill" style="background:var(--gov-accent); color:#FFF;">${featured.category}</span>
              <span><i data-lucide="calendar" class="icon icon-sm"></i> ${Utils.formatDate(featured.date)}</span>
              <span><i data-lucide="user" class="icon icon-sm"></i> ${featured.author}</span>
            </div>
            <h2 class="featured-title">
              <a href="/berita/${featured.id}">${featured.title}</a>
            </h2>
            <p class="featured-summary">${featured.summary}</p>
            <div>
              <a href="/berita/${featured.id}" class="btn btn-primary btn-sm">
                Baca Selengkapnya
                <i data-lucide="arrow-right" class="icon icon-sm"></i>
              </a>
            </div>
          </div>
        </article>

        <!-- Side Stack of Latest Headlines -->
        <div class="editorial-side-list">
          <div style="font-weight:700; color:var(--gov-primary-dark); font-size:1rem; border-left:3px solid var(--gov-accent); padding-left:0.5rem; margin-bottom:0.25rem;">
            Warta Pajerukan Terbaru
          </div>
          ${sideNewsHtml}
        </div>
      </div>
    `;

    // Render Bottom Grid News
    if (bottomNews.length > 0) {
      latestList.innerHTML = bottomNews.map(item => `
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
            <div style="margin-top:auto;">
              <a href="/berita/${item.id}" class="btn btn-sm btn-outline">
                Baca Artikel
                <i data-lucide="chevron-right" class="icon icon-sm"></i>
              </a>
            </div>
          </div>
        </article>
      `).join('');
    } else {
      latestList.innerHTML = sideNews.map(item => `
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
            <div style="margin-top:auto;">
              <a href="/berita/${item.id}" class="btn btn-sm btn-outline">
                Baca Artikel
                <i data-lucide="chevron-right" class="icon icon-sm"></i>
              </a>
            </div>
          </div>
        </article>
      `).join('');
    }

    window.refreshIcons();
  } catch (error) {
    heroContainer.innerHTML = Utils.renderError('Gagal memuat warta berita desa.');
  }
}

async function loadUpcomingEvents() {
  const eventsContainer = document.getElementById('upcoming-events-list');

  try {
    const res = await Api.get('/events', { limit: 3 });
    const events = res.data || [];

    if (events.length === 0) {
      eventsContainer.innerHTML = Utils.renderEmpty('Belum ada jadwal agenda terdekat.');
      return;
    }

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];

    eventsContainer.innerHTML = events.map(evt => {
      const d = new Date(evt.date);
      const day = isNaN(d.getDate()) ? '20' : d.getDate();
      const monthStr = isNaN(d.getMonth()) ? 'AGU' : months[d.getMonth()];

      return `
        <div class="agenda-card" style="padding:1rem;">
          <div class="agenda-date-box" style="min-width:65px; padding:0.5rem;">
            <div class="agenda-day" style="font-size:1.4rem;">${day}</div>
            <div class="agenda-month">${monthStr}</div>
          </div>
          <div class="agenda-details">
            <h4 class="agenda-title" style="font-size:1rem; margin-bottom:0.35rem;">
              <a href="/agenda" style="color:inherit;">${evt.title}</a>
            </h4>
            <div class="agenda-meta-row" style="font-size:0.775rem; margin-bottom:0.25rem;">
              <span class="agenda-meta-item">
                <i data-lucide="clock" class="icon icon-sm"></i>
                ${evt.time}
              </span>
            </div>
            <div class="agenda-meta-row" style="font-size:0.775rem;">
              <span class="agenda-meta-item">
                <i data-lucide="map-pin" class="icon icon-sm"></i>
                ${evt.location}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    window.refreshIcons();
  } catch (error) {
    eventsContainer.innerHTML = Utils.renderError('Gagal memuat agenda kegiatan.');
  }
}
