function notFoundHandler(req, res, next) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `Endpoint API '${req.method} ${req.originalUrl}' tidak ditemukan.`
    });
  }
  // For web routes, fall back or serve 404
  res.status(404).sendFile(require('path').join(__dirname, '../../public/index.html'));
}

function globalErrorHandler(err, req, res, next) {
  console.error('Server Error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
