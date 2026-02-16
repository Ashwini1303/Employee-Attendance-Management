import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyHistory, getMySummary } from '../store/slices/attendanceSlice';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MyHistory.css';

const MyHistory = () => {
  const dispatch = useDispatch();
  const { myHistory, mySummary } = useSelector((state) => state.attendance);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(getMyHistory({ month: selectedMonth, year: selectedYear }));
    dispatch(getMySummary({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const getTileClassName = ({ date }) => {
    const attendanceRecord = myHistory.find(
      (record) =>
        new Date(record.date).toDateString() === date.toDateString()
    );

    if (attendanceRecord) {
      return `tile-${attendanceRecord.status}`;
    }
    return null;
  };

  const onDateClick = (date) => {
    const attendanceRecord = myHistory.find(
      (record) =>
        new Date(record.date).toDateString() === date.toDateString()
    );
    setSelectedDate(attendanceRecord);
  };

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
    <div className="history-container">
      <h1 className="page-title">My Attendance History</h1>

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

      {/* Summary Cards */}
      <div className="summary-section">
        <div className="summary-card green">
          <h3>Present</h3>
          <p className="summary-value">{mySummary?.present || 0}</p>
        </div>
        <div className="summary-card yellow">
          <h3>Late</h3>
          <p className="summary-value">{mySummary?.late || 0}</p>
        </div>
        <div className="summary-card red">
          <h3>Absent</h3>
          <p className="summary-value">{mySummary?.absent || 0}</p>
        </div>
        <div className="summary-card orange">
          <h3>Half Day</h3>
          <p className="summary-value">{mySummary?.halfDay || 0}</p>
        </div>
        <div className="summary-card blue">
          <h3>Total Hours</h3>
          <p className="summary-value">{mySummary?.totalHours || 0}</p>
        </div>
      </div>

      {/* Calendar View */}
      <div className="calendar-section">
        <h2>Calendar View</h2>
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color green"></span>
            Present
          </div>
          <div className="legend-item">
            <span className="legend-color yellow"></span>
            Late
          </div>
          <div className="legend-item">
            <span className="legend-color red"></span>
            Absent
          </div>
          <div className="legend-item">
            <span className="legend-color orange"></span>
            Half Day
          </div>
        </div>
        <Calendar
          tileClassName={getTileClassName}
          onClickDay={onDateClick}
          value={new Date(selectedYear, selectedMonth - 1)}
        />
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="date-details">
          <h2>Details for {new Date(selectedDate.date).toLocaleDateString()}</h2>
          <div className="details-grid">
            <div className="detail-item">
              <strong>Status:</strong>
              <span className={`status-badge ${selectedDate.status}`}>
                {selectedDate.status.toUpperCase()}
              </span>
            </div>
            {selectedDate.checkInTime && (
              <div className="detail-item">
                <strong>Check In:</strong>
                <span>{new Date(selectedDate.checkInTime).toLocaleTimeString()}</span>
              </div>
            )}
            {selectedDate.checkOutTime && (
              <div className="detail-item">
                <strong>Check Out:</strong>
                <span>{new Date(selectedDate.checkOutTime).toLocaleTimeString()}</span>
              </div>
            )}
            {selectedDate.totalHours > 0 && (
              <div className="detail-item">
                <strong>Total Hours:</strong>
                <span>{selectedDate.totalHours} hours</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table View */}
      <div className="table-section">
        <h2>Attendance Records</h2>
        <div className="table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {myHistory && myHistory.length > 0 ? (
                myHistory.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
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
                  <td colSpan="5" style={{ textAlign: 'center' }}>
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

export default MyHistory;
