const { readDb, writeDb } = require('../data/store');

function getReportCategories(req, res) {
  try {
    const db = readDb();
    res.json({
      success: true,
      data: db.categories || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat kategori laporan.' });
  }
}

function getAllReports(req, res) {
  try {
    const db = readDb();
    let reports = [...(db.reports || [])];

    const { status, category, search, reporterId } = req.query;

    if (reporterId) {
      reports = reports.filter(r => r.reporterId === reporterId);
    }

    if (status && status !== 'Semua') {
      reports = reports.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'Semua') {
      reports = reports.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      reports = reports.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.reporterName && r.reporterName.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar laporan.' });
  }
}

function getAdminReports(req, res) {
  // Same as getAllReports without reporterId constraint
  return getAllReports(req, res);
}

function getReportById(req, res) {
  try {
    const db = readDb();
    const { id } = req.params;

    const report = db.reports.find(r => r.id.toLowerCase() === id.toLowerCase());

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Laporan dengan ID '${id}' tidak ditemukan.`
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat detail laporan.' });
  }
}

function getReportHistory(req, res) {
  try {
    const db = readDb();
    const { id } = req.params;

    const report = db.reports.find(r => r.id.toLowerCase() === id.toLowerCase());

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan.'
      });
    }

    res.json({
      success: true,
      data: report.history || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat riwayat status laporan.' });
  }
}

function createReport(req, res) {
  try {
    const db = readDb();
    const {
      title,
      category,
      description,
      location,
      photoUrl,
      reporterName,
      reporterContact,
      reporterId
    } = req.body;

    const now = new Date().toISOString();
    const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `LAP-${yearMonth}-${randomSuffix}`;

    const newReport = {
      id: newId,
      title: title.trim(),
      category: category.trim(),
      reporterName: reporterName.trim(),
      reporterContact: reporterContact.trim(),
      reporterId: reporterId || 'warga-01',
      location: location.trim(),
      description: description.trim(),
      photoUrl: photoUrl && photoUrl.trim() ? photoUrl.trim() : 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      status: 'Menunggu',
      createdAt: now,
      updatedAt: now,
      history: [
        {
          timestamp: now,
          status: 'Menunggu',
          note: 'Laporan berhasil dibuat oleh warga dan masuk dalam antrean sistem pengaduan Desa Pajerukan.'
        }
      ]
    };

    db.reports.unshift(newReport);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Laporan berhasil diajukan dan sedang menunggu peninjauan.',
      data: newReport
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat laporan baru.' });
  }
}

function updateReportStatus(req, res) {
  try {
    const db = readDb();
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Menunggu', 'Ditinjau', 'Diproses', 'Selesai', 'Ditolak'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status tidak valid. Pilihan status: ${validStatuses.join(', ')}`
      });
    }

    const reportIndex = db.reports.findIndex(r => r.id.toLowerCase() === id.toLowerCase());

    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Laporan dengan ID '${id}' tidak ditemukan.`
      });
    }

    const report = db.reports[reportIndex];

    // Reason required when rejected
    if (status === 'Ditolak' && (!note || note.trim().length < 5)) {
      return res.status(400).json({
        success: false,
        message: 'Alasan penolakan laporan wajib dicantumkan secara jelas.'
      });
    }

    const now = new Date().toISOString();
    let defaultNote = '';
    if (status === 'Ditinjau') defaultNote = 'Laporan telah diperiksa oleh petugas admin desa.';
    else if (status === 'Diproses') defaultNote = 'Laporan telah diterima dan sedang ditindaklanjuti oleh unit/seksi terkait.';
    else if (status === 'Selesai') defaultNote = 'Permasalahan laporan telah berhasil ditangani dan diselesaikan.';
    else if (status === 'Ditolak') defaultNote = note;

    const finalNote = note && note.trim().length > 0 ? note.trim() : defaultNote;

    report.status = status;
    report.updatedAt = now;
    if (!report.history) report.history = [];
    report.history.push({
      timestamp: now,
      status: status,
      note: finalNote
    });

    db.reports[reportIndex] = report;
    writeDb(db);

    res.json({
      success: true,
      message: `Status laporan berhasil diperbarui menjadi '${status}'.`,
      data: report
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status laporan.' });
  }
}

module.exports = {
  getReportCategories,
  getAllReports,
  getAdminReports,
  getReportById,
  getReportHistory,
  createReport,
  updateReportStatus
};
