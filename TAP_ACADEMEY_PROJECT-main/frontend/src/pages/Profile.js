import { useSelector } from 'react-redux';
import './Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="profile-container">
      <h1 className="page-title">My Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h2>{user?.name}</h2>
            <p className="role-badge">{user?.role}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <div className="detail-label">Employee ID</div>
            <div className="detail-value">{user?.employeeId}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Email</div>
            <div className="detail-value">{user?.email}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Department</div>
            <div className="detail-value">{user?.department}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Role</div>
            <div className="detail-value" style={{ textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h3>About Attendance System</h3>
        <p>
          This is your personal attendance management system. You can check in and out daily,
          view your attendance history, and track your monthly statistics.
        </p>
        <h4>Features:</h4>
        <ul>
          <li>Daily check-in and check-out</li>
          <li>View attendance history with calendar view</li>
          <li>Monthly attendance summary</li>
          <li>Track total hours worked</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
