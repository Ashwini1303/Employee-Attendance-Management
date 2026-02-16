import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTodayStatus, checkIn, checkOut } from '../store/slices/attendanceSlice';
import { toast } from 'react-toastify';
import './MarkAttendance.css';

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { todayStatus } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTodayStatus());
  }, [dispatch]);

  const handleCheckIn = async () => {
    try {
      await dispatch(checkIn()).unwrap();
      toast.success('Checked in successfully!');
      dispatch(getTodayStatus());
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await dispatch(checkOut()).unwrap();
      toast.success('Checked out successfully!');
      dispatch(getTodayStatus());
    } catch (error) {
      toast.error(error);
    }
  };

  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mark-attendance-container">
      <div className="attendance-card">
        <div className="time-display">
          <div className="current-time">{currentTime}</div>
          <div className="current-date">{currentDate}</div>
        </div>

        <div className="user-info">
          <h2>Welcome, {user?.name}</h2>
          <p>Employee ID: {user?.employeeId}</p>
          <p>Department: {user?.department}</p>
        </div>

        <div className="attendance-actions">
          {!todayStatus?.checkInTime && (
            <div className="action-section">
              <h3>Ready to start your day?</h3>
              <button onClick={handleCheckIn} className="btn btn-check-in">
                <span className="btn-icon">→</span>
                Check In
              </button>
            </div>
          )}

          {todayStatus?.checkInTime && !todayStatus?.checkOutTime && (
            <div className="action-section">
              <div className="checked-in-info">
                <div className="info-badge success">
                  ✓ Checked In
                </div>
                <p>
                  <strong>Check In Time:</strong>{' '}
                  {new Date(todayStatus.checkInTime).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-${todayStatus.status}`}>
                    {todayStatus.status.toUpperCase()}
                  </span>
                </p>
              </div>
              <h3>Ready to end your day?</h3>
              <button onClick={handleCheckOut} className="btn btn-check-out">
                <span className="btn-icon">←</span>
                Check Out
              </button>
            </div>
          )}

          {todayStatus?.checkOutTime && (
            <div className="action-section">
              <div className="checked-in-info">
                <div className="info-badge success">
                  ✓ Attendance Completed
                </div>
                <p>
                  <strong>Check In:</strong>{' '}
                  {new Date(todayStatus.checkInTime).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Check Out:</strong>{' '}
                  {new Date(todayStatus.checkOutTime).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Total Hours:</strong> {todayStatus.totalHours} hours
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-${todayStatus.status}`}>
                    {todayStatus.status.toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="completion-message">
                <h3>Great job today! 🎉</h3>
                <p>Your attendance has been recorded successfully.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
