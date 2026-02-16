const express = require('express');
const router = express.Router();
const {
  getEmployeeDashboard,
  getManagerDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/employee', protect, authorize('employee'), getEmployeeDashboard);
router.get('/manager', protect, authorize('manager'), getManagerDashboard);

module.exports = router;
