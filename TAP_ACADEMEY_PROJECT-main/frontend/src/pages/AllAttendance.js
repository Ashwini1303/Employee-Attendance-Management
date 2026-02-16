import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllAttendance } from '../store/slices/attendanceSlice';
import './AllAttendance.css';

const AllAttendance = () => {
  const dispatch = useDispatch();
  const { allAttendance } = useSelector((state) => state.attendance);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: '',
    status: '',
    department: ''
  });

  useEffect(() => {
    dispatch(getAllAttendance(filters));
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    dispatch(getAllAttendance(filters));
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      employeeId: '',
      status: '',
      department: ''
    });
    dispatch(getAllAttendance({}));
  };

  return (
    <div className="all-attendance-container">
      <h1 className="page-title">All Employees Attendance</h1>

      {/* Filters */}
      <div className="filters-card">
        <h2>Filters</h2>
        <div className="filters-grid">
          <div className="filter-item">
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item">
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item">
            <label>Employee ID:</label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              placeholder="e.g., EMP001"
            />
          </div>

          <div className="filter-item">
            <label>Department:</label>
            <select name="department" value={filters.department} onChange={handleFilterChange}>
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Status:</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="btn btn-primary">
            Apply Filters
          </button>
          <button onClick={handleResetFilters} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="results-card">
        <h2>Attendance Records ({allAttendance?.length || 0})</h2>
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {allAttendance && allAttendance.length > 0 ? (
                allAttendance.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.userId?.name || 'N/A'}</td>
                    <td>{record.userId?.employeeId || 'N/A'}</td>
                    <td>{record.userId?.department || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      {record.checkInTime
                        ? new Date(record.checkInTime).toLocaleTimeString()
                        : '-'}
                    </td>
                    <td>
                      {record.checkOutTime
                        ? new Date(record.checkOutTime).toLocaleTimeString()
                        : '-'}
                    </td>
                    <td>{record.totalHours > 0 ? `${record.totalHours} hrs` : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllAttendance;
