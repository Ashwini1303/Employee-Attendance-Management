import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getManagerDashboard } from '../store/slices/attendanceSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Spinner from '../components/Spinner';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, isLoading } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(getManagerDashboard());
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const weeklyData = dashboardData?.weeklyTrend?.map(item => ({
    date: item._id,
    present: item.present,
    late: item.late
  })) || [];

  const pieData = [
    { name: 'Present (On Time)', value: dashboardData?.todayStats?.onTime || 0 },
    { name: 'Late', value: dashboardData?.todayStats?.late || 0 },
    { name: 'Absent', value: dashboardData?.todayStats?.absent || 0 }
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Manager Dashboard</h1>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <h3>Total Employees</h3>
          <p className="stat-value">{dashboardData?.totalEmployees || 0}</p>
          <span className="stat-label">in your organization</span>
        </div>
        <div className="stat-card green">
          <h3>Present Today</h3>
          <p className="stat-value">{dashboardData?.todayStats?.present || 0}</p>
          <span className="stat-label">employees checked in</span>
        </div>
        <div className="stat-card yellow">
          <h3>Late Today</h3>
          <p className="stat-value">{dashboardData?.todayStats?.late || 0}</p>
          <span className="stat-label">arrived late</span>
        </div>
        <div className="stat-card red">
          <h3>Absent Today</h3>
          <p className="stat-value">{dashboardData?.todayStats?.absent || 0}</p>
          <span className="stat-label">not checked in</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Weekly Trend */}
        <div className="card chart-card">
          <h2>Weekly Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10b981" name="Present" />
              <Bar dataKey="late" fill="#f59e0b" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Distribution */}
        <div className="card chart-card">
          <h2>Today's Attendance Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Late Arrivals Today */}
      {dashboardData?.lateArrivals && dashboardData.lateArrivals.length > 0 && (
        <div className="card">
          <h2>Late Arrivals Today</h2>
          <div className="employees-list">
            {dashboardData.lateArrivals.map((record) => (
              <div key={record._id} className="employee-item late">
                <div className="employee-info">
                  <p className="employee-name">{record.userId.name}</p>
                  <p className="employee-id">{record.userId.employeeId}</p>
                  <p className="employee-dept">{record.userId.department}</p>
                </div>
                <div className="employee-time">
                  {new Date(record.checkInTime).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Absent Employees Today */}
      {dashboardData?.absentEmployees && dashboardData.absentEmployees.length > 0 && (
        <div className="card">
          <h2>Absent Employees Today</h2>
          <div className="employees-list">
            {dashboardData.absentEmployees.map((employee) => (
              <div key={employee._id} className="employee-item absent">
                <div className="employee-info">
                  <p className="employee-name">{employee.name}</p>
                  <p className="employee-id">{employee.employeeId}</p>
                  <p className="employee-dept">{employee.department}</p>
                </div>
                <div className="employee-status">
                  <span className="status-badge red">Not Checked In</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department-wise Stats */}
      {dashboardData?.departmentStats && dashboardData.departmentStats.length > 0 && (
        <div className="card">
          <h2>Department-wise Attendance (Today)</h2>
          <div className="department-grid">
            {dashboardData.departmentStats.map((dept, index) => (
              <div key={index} className="department-card">
                <h3>{dept._id}</h3>
                <p className="dept-value">{dept.present}</p>
                <span className="dept-label">employees present</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
