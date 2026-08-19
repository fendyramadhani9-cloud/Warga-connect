const express = require('express');
const router = express.Router();

const newsController = require('../controllers/newsController');
const eventController = require('../controllers/eventController');
const serviceController = require('../controllers/serviceController');
const publicInfoController = require('../controllers/publicInfoController');
const reportController = require('../controllers/reportController');
const contactController = require('../controllers/contactController');
const statsController = require('../controllers/statsController');

const { validateReport, validateContact } = require('../middleware/validator');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'WargaKonek Desa Pajerukan API is healthy and operational.',
    timestamp: new Date().toISOString()
  });
});

// Statistics
router.get('/stats', statsController.getStats);

// Announcements & News
router.get('/announcements', newsController.getAllNews);
router.get('/announcements/:id', newsController.getNewsById);

// Events / Agenda
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);

// Services
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);

// Public Information & Documents
router.get('/public-info', publicInfoController.getAllPublicInfo);

// Contact / Feedback
router.post('/contact', validateContact, contactController.submitContact);

// Report Categories
router.get('/report-categories', reportController.getReportCategories);

// Reports (Citizen & Public)
router.get('/reports', reportController.getAllReports);
router.get('/reports/:id', reportController.getReportById);
router.get('/reports/:id/history', reportController.getReportHistory);
router.post('/reports', validateReport, reportController.createReport);
router.patch('/reports/:id/status', reportController.updateReportStatus);

// Admin Reports Endpoints
router.get('/admin/reports', reportController.getAdminReports);
router.patch('/admin/reports/:id/status', reportController.updateReportStatus);

module.exports = router;
