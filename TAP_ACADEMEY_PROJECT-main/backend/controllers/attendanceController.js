const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { Parser } = require('json2csv');

// Helper function to get start and end of day
const getStartOfDay = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfDay = (date) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

// Helper function to determine status based on check-in time
const determineStatus = (checkInTime) => {
  const hour = checkInTime.getHours();
  const minutes = checkInTime.getMinutes();
  
  // Late if after 9:30 AM
  if (hour > 9 || (hour === 9 && minutes > 30)) {
    return 'late';
  }
  return 'present';
};

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
exports.checkIn = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());
    
    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already checked in today' 
      });
    }

    const checkInTime = new Date();
    const status = determineStatus(checkInTime);

    let attendance;
    if (existingAttendance) {
      existingAttendance.checkInTime = checkInTime;
      existingAttendance.status = status;
      attendance = await existingAttendance.save();
    } else {
      attendance = await Attendance.create({
        userId: req.user._id,
        date: today,
        checkInTime,
        status
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
exports.checkOut = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());
    
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ 
        success: false, 
        message: 'No check-in record found for today' 
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already checked out today' 
      });
    }

    const checkOutTime = new Date();
    attendance.checkOutTime = checkOutTime;

    // Calculate total hours
    const diffMs = checkOutTime - attendance.checkInTime;
    const totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    attendance.totalHours = totalHours;

    // Update status to half-day if less than 4 hours
    if (totalHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private (Employee)
exports.getMyHistory = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let query = { userId: req.user._id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('userId', 'name employeeId department');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my monthly summary
// @route   GET /api/attendance/my-summary
// @access  Private (Employee)
exports.getMySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0
    };

    attendance.forEach(record => {
      if (record.status === 'present') summary.present++;
      else if (record.status === 'absent') summary.absent++;
      else if (record.status === 'late') summary.late++;
      else if (record.status === 'half-day') summary.halfDay++;
      
      summary.totalHours += record.totalHours || 0;
    });

    summary.totalHours = parseFloat(summary.totalHours.toFixed(2));

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private (Employee)
exports.getTodayStatus = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());
    
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all employees attendance
// @route   GET /api/attendance/all
// @access  Private (Manager)
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, employeeId, status, department } = req.query;
    
    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name employeeId department email')
      .sort({ date: -1 });

    // Filter by employeeId or department if provided
    let filteredAttendance = attendance;
    if (employeeId) {
      filteredAttendance = attendance.filter(a => a.userId.employeeId === employeeId);
    }
    if (department) {
      filteredAttendance = attendance.filter(a => a.userId.department === department);
    }

    res.status(200).json({
      success: true,
      count: filteredAttendance.length,
      data: filteredAttendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific employee attendance
// @route   GET /api/attendance/employee/:id
// @access  Private (Manager)
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let query = { userId: req.params.id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('userId', 'name employeeId department email');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance summary for all employees
// @route   GET /api/attendance/summary
// @access  Private (Manager)
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('userId', 'name employeeId department');

    const summary = {
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalHalfDay: 0,
      byDepartment: {}
    };

    attendance.forEach(record => {
      if (record.status === 'present') summary.totalPresent++;
      else if (record.status === 'absent') summary.totalAbsent++;
      else if (record.status === 'late') summary.totalLate++;
      else if (record.status === 'half-day') summary.totalHalfDay++;

      // Department-wise summary
      const dept = record.userId.department;
      if (!summary.byDepartment[dept]) {
        summary.byDepartment[dept] = {
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0
        };
      }

      if (record.status === 'present') summary.byDepartment[dept].present++;
      else if (record.status === 'absent') summary.byDepartment[dept].absent++;
      else if (record.status === 'late') summary.byDepartment[dept].late++;
      else if (record.status === 'half-day') summary.byDepartment[dept].halfDay++;
    });

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export attendance to CSV
// @route   GET /api/attendance/export
// @access  Private (Manager)
exports.exportAttendance = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) {
        query.userId = user._id;
      }
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name employeeId department email')
      .sort({ date: -1 });

    const data = attendance.map(record => ({
      EmployeeID: record.userId.employeeId,
      Name: record.userId.name,
      Department: record.userId.department,
      Date: record.date.toISOString().split('T')[0],
      CheckIn: record.checkInTime ? record.checkInTime.toLocaleTimeString() : 'N/A',
      CheckOut: record.checkOutTime ? record.checkOutTime.toLocaleTimeString() : 'N/A',
      Status: record.status,
      TotalHours: record.totalHours || 0
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's status for all employees
// @route   GET /api/attendance/today-status
// @access  Private (Manager)
exports.getTodayStatusAll = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());
    
    const attendance = await Attendance.find({
      date: today
    }).populate('userId', 'name employeeId department email');

    const allEmployees = await User.find({ role: 'employee' });
    
    const checkedInIds = attendance.map(a => a.userId._id.toString());
    const absentEmployees = allEmployees.filter(
      emp => !checkedInIds.includes(emp._id.toString())
    );

    res.status(200).json({
      success: true,
      data: {
        present: attendance,
        absent: absentEmployees,
        totalEmployees: allEmployees.length,
        checkedIn: attendance.length,
        notCheckedIn: absentEmployees.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
