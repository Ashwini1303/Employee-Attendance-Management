const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Helper function to get date ranges
const getDateRange = (days) => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  return { startDate, endDate };
};

const getMonthRange = () => {
  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

// @desc    Get employee dashboard data
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's status
    const todayAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    // Monthly stats
    const { startDate: monthStart, endDate: monthEnd } = getMonthRange();
    const monthlyAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const monthlyStats = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      totalHours: 0
    };

    monthlyAttendance.forEach(record => {
      if (record.status === 'present') monthlyStats.present++;
      else if (record.status === 'absent') monthlyStats.absent++;
      else if (record.status === 'late') monthlyStats.late++;
      else if (record.status === 'half-day') monthlyStats.halfDay++;
      monthlyStats.totalHours += record.totalHours || 0;
    });

    monthlyStats.totalHours = parseFloat(monthlyStats.totalHours.toFixed(2));

    // Last 7 days attendance
    const { startDate: weekStart, endDate: weekEnd } = getDateRange(7);
    const last7Days = await Attendance.find({
      userId: req.user._id,
      date: { $gte: weekStart, $lte: weekEnd }
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        todayStatus: todayAttendance,
        monthlyStats,
        last7Days
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get manager dashboard data
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
exports.getManagerDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's attendance
    const todayAttendance = await Attendance.find({
      date: today
    }).populate('userId', 'name employeeId department');

    const todayStats = {
      present: 0,
      late: 0,
      absent: 0,
      onTime: 0
    };

    const lateArrivals = [];
    todayAttendance.forEach(record => {
      if (record.status === 'present') {
        todayStats.present++;
        todayStats.onTime++;
      } else if (record.status === 'late') {
        todayStats.present++;
        todayStats.late++;
        lateArrivals.push(record);
      }
    });

    todayStats.absent = totalEmployees - todayStats.present;

    // Get absent employees
    const checkedInUserIds = todayAttendance.map(a => a.userId._id.toString());
    const absentEmployees = await User.find({
      role: 'employee',
      _id: { $nin: checkedInUserIds }
    });

    // Weekly trend (last 7 days)
    const { startDate: weekStart, endDate: weekEnd } = getDateRange(7);
    const weeklyData = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: weekStart, $lte: weekEnd }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          present: {
            $sum: {
              $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0]
            }
          },
          late: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Department-wise attendance
    const departmentStats = await Attendance.aggregate([
      {
        $match: {
          date: today
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$user.department',
          present: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        todayStats,
        lateArrivals,
        absentEmployees,
        weeklyTrend: weeklyData,
        departmentStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
