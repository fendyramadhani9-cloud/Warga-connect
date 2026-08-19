const { readDb } = require('../data/store');

function getAllPublicInfo(req, res) {
  try {
    const db = readDb();
    const { category, search } = req.query;
    let docs = [...(db.publicInfo || [])];

    if (category && category !== 'Semua') {
      docs = docs.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.description.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: docs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat dokumen informasi publik.' });
  }
}

module.exports = {
  getAllPublicInfo
};
