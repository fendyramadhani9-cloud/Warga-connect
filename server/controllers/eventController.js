const { readDb } = require('../data/store');

function getAllEvents(req, res) {
  try {
    const db = readDb();
    let events = [...db.events];

    const { limit } = req.query;

    // Sort by date ascending
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (limit) {
      events = events.slice(0, parseInt(limit, 10));
    }

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat agenda desa.' });
  }
}

function getEventById(req, res) {
  try {
    const db = readDb();
    const { id } = req.params;

    const event = db.events.find(item => item.id === id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Agenda kegiatan tidak ditemukan.'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat detail agenda.' });
  }
}

module.exports = {
  getAllEvents,
  getEventById
};
