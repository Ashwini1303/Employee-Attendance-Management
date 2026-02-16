import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Attendance System
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Dashboard</Link>
          
          {user.role === 'employee' && (
            <>
              <Link to="/mark-attendance" className="navbar-link">Mark Attendance</Link>
              <Link to="/my-history" className="navbar-link">My History</Link>
              <Link to="/profile" className="navbar-link">Profile</Link>
            </>
          )}
          
          {user.role === 'manager' && (
            <>
              <Link to="/all-attendance" className="navbar-link">All Attendance</Link>
              <Link to="/team-calendar" className="navbar-link">Team Calendar</Link>
              <Link to="/reports" className="navbar-link">Reports</Link>
            </>
          )}
          
          <div className="navbar-user">
            <span className="user-name">{user.name}</span>
            <span className="user-role">({user.role})</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
