import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllAttendance } from '../store/slices/attendanceSlice';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './TeamCalendar.css';

const TeamCalendar = () => {
  const dispatch = useDispatch();
  const { allAttendance } = useSelector((state) => state.attendance);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);
    
    dispatch(getAllAttendance({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  }, [dispatch, selectedMonth, selectedYear]);

  const getTileClassName = ({ date }) => {
    const dateString = date.toDateString();
    const dayRecords = allAttendance.filter(
      (record) => new Date(record.date).toDateString() === dateString
    );

    if (dayRecords.length === 0) return 'tile-no-data';

    const presentCount = dayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const totalCount = dayRecords.length;
    const percentage = (presentCount / totalCount) * 100;

    if (percentage >= 90) return 'tile-excellent';
    if (percentage >= 70) return 'tile-good';
    if (percentage >= 50) return 'tile-average';
    return 'tile-poor';
  };

  const onDateClick = (date) => {
    setSelectedDate(date);
  };

  const selectedDateRecords = allAttendance.filter(
    (record) => new Date(record.date).toDateString() === selectedDate.toDateString()
  );

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const years = [];
  for (let i = 2020; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }

  return (
    <div className="team-calendar-container">
      <h1 className="page-title">Team Calendar View</h1>

      {/* Month/Year Filter */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Month:</label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Year:</label>
          <select value={selectedYear} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="calendar-card">
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color excellent"></span>
            90%+ Present (Excellent)
          </div>
          <div className="legend-item">
            <span className="legend-color good"></span>
            70-89% Present (Good)
          </div>
          <div className="legend-item">
            <span className="legend-color average"></span>
            50-69% Present (Average)
          </div>
          <div className="legend-item">
            <span className="legend-color poor"></span>
            Below 50% (Poor)
          </div>
          <div className="legend-item">
            <span className="legend-color no-data"></span>
            No Data
          </div>
        </div>

        <Calendar
          tileClassName={getTileClassName}
          onClickDay={onDateClick}
          value={new Date(selectedYear, selectedMonth - 1)}
        />
      </div>

      {/* Selected Date Details */}
      <div className="date-details-card">
        <h2>
          Attendance for {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h2>

        {selectedDateRecords.length > 0 ? (
          <>
            <div className="summary-stats">
              <div className="summary-item">
                <span className="summary-label">Total Employees:</span>
                <span className="summary-value">{selectedDateRecords.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Present:</span>
                <span className="summary-value green">
                  {selectedDateRecords.filter(r => r.status === 'present').length}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Late:</span>
                <span className="summary-value yellow">
                  {selectedDateRecords.filter(r => r.status === 'late').length}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Absent:</span>
                <span className="summary-value red">
                  {selectedDateRecords.filter(r => r.status === 'absent').length}
                </span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
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
                  {selectedDateRecords.map((record) => (
                    <tr key={record._id}>
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="no-data">No attendance records for this date</p>
        )}
      </div>
    </div>
  );
};

export default TeamCalendar;
