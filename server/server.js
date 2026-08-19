const express = require('express');
const cors = require('cors');
const path = require('path');

const requestLogger = require('./middleware/logger');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

const publicDir = path.join(__dirname, '../public');

// Mount REST API
app.use('/api', apiRoutes);

// Clean URL Route handlers for Frontend Pages (serve before static directory index redirect)
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/profil', (req, res) => {
  res.sendFile(path.join(publicDir, 'profil.html'));
});

app.get('/berita', (req, res) => {
  res.sendFile(path.join(publicDir, 'berita.html'));
});

app.get('/berita/:id', (req, res) => {
  res.sendFile(path.join(publicDir, 'berita-detail.html'));
});

app.get('/agenda', (req, res) => {
  res.sendFile(path.join(publicDir, 'agenda.html'));
});

app.get('/layanan', (req, res) => {
  res.sendFile(path.join(publicDir, 'layanan.html'));
});

app.get('/informasi-publik', (req, res) => {
  res.sendFile(path.join(publicDir, 'informasi-publik.html'));
});

app.get('/kontak', (req, res) => {
  res.sendFile(path.join(publicDir, 'kontak.html'));
});

app.get('/laporan', (req, res) => {
  res.sendFile(path.join(publicDir, 'laporan.html'));
});

app.get('/laporan/buat', (req, res) => {
  res.sendFile(path.join(publicDir, 'laporan-buat.html'));
});

app.get('/laporan/:id', (req, res) => {
  res.sendFile(path.join(publicDir, 'laporan-detail.html'));
});

// Admin Routes
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(publicDir, 'admin/index.html'));
});

app.get('/admin/laporan', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin/laporan.html'));
});

app.get('/admin/laporan/:id', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin/laporan-detail.html'));
});

// Static assets (CSS, JS, images)
app.use(express.static(publicDir));


// Catch-all 404 & Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  WARGAKONEK DESA PAJERUKAN - SERVER AKTIF`);
  console.log(`  Kec. Kalibagor, Kab. Banyumas, Jawa Tengah`);
  console.log(`  URL Portal: http://localhost:${PORT}`);
  console.log(`  URL Admin : http://localhost:${PORT}/admin`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

module.exports = app;
