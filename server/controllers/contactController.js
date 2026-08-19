const { readDb, writeDb } = require('../data/store');

function submitContact(req, res) {
  try {
    const db = readDb();
    const { name, contact, subject, message } = req.body;

    const newContact = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      contact: contact.trim(),
      subject: subject && subject.trim() ? subject.trim() : 'Pesan Aspirasi Warga',
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    if (!db.contacts) db.contacts = [];
    db.contacts.unshift(newContact);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Pesan / aspirasi Anda berhasil dikirim ke Pemerintah Desa Pajerukan.',
      data: newContact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengirimkan pesan aspirasi.' });
  }
}

module.exports = {
  submitContact
};
