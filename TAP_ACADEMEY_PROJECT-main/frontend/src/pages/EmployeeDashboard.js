import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployeeDashboard } from '../store/slices/attendanceSlice';
import { checkIn, checkOut } from '../store/slices/attendanceSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, isLoading } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getEmployeeDashboard());
  }, [dispatch]);

  const handleCheckIn = async () => {
    try {
      await dispatch(checkIn()).unwrap();
      toast.success('Checked in successfully!');
      dispatch(getEmployeeDashboard());
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await dispatch(checkOut()).unwrap();
      toast.success('Checked out successfully!');
      dispatch(getEmployeeDashboard());
    } catch (error) {
      toast.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#10b981';
      case 'late':
        return '#f59e0b';
      case 'absent':
        return '#ef4444';
      case 'half-day':
        return '#f97316';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Employee Dashboard</h1>

      {/* Today's Status Card */}
      <div className="card today-status-card">
        <h2>Today's Status</h2>
        {dashboardData?.todayStatus ? (
          <div className="status-content">
            <div className="status-badge" style={{ backgroundColor: getStatusColor(dashboardData.todayStatus.status) }}>
              {dashboardData.todayStatus.status.toUpperCase()}
            </div>
            <div className="status-details">
              {dashboardData.todayStatus.checkInTime && (
                <p>
                  <strong>Check In:</strong> {new Date(dashboardData.todayStatus.checkInTime).toLocaleTimeString()}
                </p>
              )}
              {dashboardData.todayStatus.checkOutTime && (
                <p>
                  <strong>Check Out:</strong> {new Date(dashboardData.todayStatus.checkOutTime).toLocaleTimeString()}
                </p>
              )}
              {dashboardData.todayStatus.totalHours > 0 && (
                <p>
                  <strong>Total Hours:</strong> {dashboardData.todayStatus.totalHours} hrs
                </p>
              )}
            </div>
            <div className="action-buttons">
              {!dashboardData.todayStatus.checkInTime && (
                <button onClick={handleCheckIn} className="btn btn-success">
                  Check In
                </button>
              )}
              {dashboardData.todayStatus.checkInTime && !dashboardData.todayStatus.checkOutTime && (
                <button onClick={handleCheckOut} className="btn btn-danger">
                  Check Out
                </button>
              )}
              {dashboardData.todayStatus.checkOutTime && (
                <p className="completed-text">✓ Completed for today</p>
              )}
            </div>
          </div>
        ) : (
          <div className="no-status">
            <p>You haven't checked in today</p>
            <button onClick={handleCheckIn} className="btn btn-success">
              Check In Now
            </button>
          </div>
        )}
      </div>

      {/* Monthly Stats */}
      <div className="stats-grid">
        <div className="stat-card green">
          <h3>Present</h3>
          <p className="stat-value">{dashboardData?.monthlyStats?.present || 0}</p>
          <span className="stat-label">days this month</span>
        </div>
        <div className="stat-card yellow">
          <h3>Late</h3>
          <p className="stat-value">{dashboardData?.monthlyStats?.late || 0}</p>
          <span className="stat-label">days this month</span>
        </div>
        <div className="stat-card red">
          <h3>Absent</h3>
          <p className="stat-value">{dashboardData?.monthlyStats?.absent || 0}</p>
          <span className="stat-label">days this month</span>
        </div>
        <div className="stat-card blue">
          <h3>Total Hours</h3>
          <p className="stat-value">{dashboardData?.monthlyStats?.totalHours || 0}</p>
          <span className="stat-label">hours this month</span>
        </div>
      </div>

      {/* Last 7 Days Attendance */}
      <div className="card">
        <h2>Last 7 Days Attendance</h2>
        <div className="attendance-list">
          {dashboardData?.last7Days && dashboardData.last7Days.length > 0 ? (
            dashboardData.last7Days.map((record) => (
              <div key={record._id} className="attendance-item">
                <div className="attendance-date">
                  {new Date(record.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div
                  className="attendance-status-badge"
                  style={{ backgroundColor: getStatusColor(record.status) }}
                >
                  {record.status}
                </div>
                <div className="attendance-hours">
                  {record.totalHours > 0 ? `${record.totalHours} hrs` : '-'}
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No attendance records for the last 7 days</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
