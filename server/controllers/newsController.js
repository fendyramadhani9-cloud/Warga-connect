const { readDb } = require('../data/store');

function getAllNews(req, res) {
  try {
    const db = readDb();
    let news = [...db.announcements];

    const { category, search, limit, page = 1 } = req.query;

    if (category && category !== 'Semua') {
      news = news.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      news = news.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.summary.toLowerCase().includes(q) || 
        item.content.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    news.sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = news.length;
    let paginated = news;

    if (limit) {
      const numLimit = parseInt(limit, 10);
      const numPage = parseInt(page, 10) || 1;
      const startIndex = (numPage - 1) * numLimit;
      paginated = news.slice(startIndex, startIndex + numLimit);
    }

    res.json({
      success: true,
      data: paginated,
      meta: {
        total,
        page: parseInt(page, 10) || 1,
        limit: limit ? parseInt(limit, 10) : total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar berita desa.' });
  }
}

function getNewsById(req, res) {
  try {
    const db = readDb();
    const { id } = req.params;

    const article = db.announcements.find(item => item.id === id || item.slug === id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel berita tidak ditemukan.'
      });
    }

    // Related news (other items in same category or latest)
    const related = db.announcements
      .filter(item => item.id !== article.id)
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        ...article,
        related
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat detail artikel.' });
  }
}

module.exports = {
  getAllNews,
  getNewsById
};
