const { readDb } = require('../data/store');

function getStats(req, res) {
  try {
    const db = readDb();
    const reports = db.reports || [];

    const stats = {
      reports: {
        total: reports.length,
        menunggu: reports.filter(r => r.status === 'Menunggu').length,
        ditinjau: reports.filter(r => r.status === 'Ditinjau').length,
        diproses: reports.filter(r => r.status === 'Diproses').length,
        selesai: reports.filter(r => r.status === 'Selesai').length,
        ditolak: reports.filter(r => r.status === 'Ditolak').length
      },
      announcements: (db.announcements || []).length,
      events: (db.events || []).length,
      services: (db.services || []).length,
      publicInfo: (db.publicInfo || []).length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat data statistik.' });
  }
}

module.exports = {
  getStats
};
