const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaint,
  trackComplaint,
  updateStatus,
  assignWorker,
  getStats,
  getAnalytics,
  getMapComplaints
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/track/:complaintId', trackComplaint);
router.get('/map', getMapComplaints);
router.get('/stats', getStats);

// Protected routes
router.post('/', protect, upload.single('photo'), createComplaint);
router.get('/', protect, getComplaints);
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/:id', protect, getComplaint);

// Admin routes
router.put('/:id/status', protect, adminOnly, updateStatus);
router.put('/:id/assign', protect, adminOnly, assignWorker);

module.exports = router;
