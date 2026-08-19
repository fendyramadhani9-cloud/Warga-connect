function validateReport(req, res, next) {
  const { title, category, description, location, reporterName, reporterContact } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Judul laporan wajib diisi (minimal 5 karakter).'
    });
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Kategori laporan wajib dipilih.'
    });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Deskripsi laporan wajib diisi (minimal 10 karakter).'
    });
  }

  if (!location || typeof location !== 'string' || location.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Lokasi kejadian wajib diisi dengan jelas.'
    });
  }

  if (!reporterName || typeof reporterName !== 'string' || reporterName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Nama pelapor wajib diisi.'
    });
  }

  if (!reporterContact || typeof reporterContact !== 'string' || reporterContact.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Kontak pelapor (Nomor HP / WhatsApp) wajib diisi.'
    });
  }

  next();
}

function validateContact(req, res, next) {
  const { name, contact, message } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Nama pengirim wajib diisi.'
    });
  }

  if (!contact || contact.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Informasi kontak (email / nomor telepon) wajib diisi.'
    });
  }

  if (!message || message.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Isi pesan aspirasi wajib diisi.'
    });
  }

  next();
}

module.exports = {
  validateReport,
  validateContact
};
