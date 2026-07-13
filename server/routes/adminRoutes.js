const express = require('express');
const { getDashboard, getAreaBreakdown } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboard);
router.get('/areas', protect, adminOnly, getAreaBreakdown);

module.exports = router;
