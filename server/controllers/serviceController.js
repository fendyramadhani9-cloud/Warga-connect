const { readDb } = require('../data/store');

function getAllServices(req, res) {
  try {
    const db = readDb();
    const { category, search } = req.query;
    let services = [...db.services];

    if (category && category !== 'Semua') {
      services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      services = services.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar layanan masyarakat.' });
  }
}

function getServiceById(req, res) {
  try {
    const db = readDb();
    const { id } = req.params;
    const service = db.services.find(s => s.id === id || s.code.toLowerCase() === id.toLowerCase());

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Informasi layanan tidak ditemukan.'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat detail layanan.' });
  }
}

module.exports = {
  getAllServices,
  getServiceById
};
