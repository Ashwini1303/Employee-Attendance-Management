const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getEmployeeAttendance,
  getAttendanceSummary,
  exportAttendance,
  getTodayStatusAll
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Employee routes
router.post('/checkin', protect, authorize('employee'), checkIn);
router.post('/checkout', protect, authorize('employee'), checkOut);
router.get('/my-history', protect, authorize('employee'), getMyHistory);
router.get('/my-summary', protect, authorize('employee'), getMySummary);
router.get('/today', protect, authorize('employee'), getTodayStatus);

// Manager routes
router.get('/all', protect, authorize('manager'), getAllAttendance);
router.get('/employee/:id', protect, authorize('manager'), getEmployeeAttendance);
router.get('/summary', protect, authorize('manager'), getAttendanceSummary);
router.get('/export', protect, authorize('manager'), exportAttendance);
router.get('/today-status', protect, authorize('manager'), getTodayStatusAll);

module.exports = router;
