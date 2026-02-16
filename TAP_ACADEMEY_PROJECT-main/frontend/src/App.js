import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MarkAttendance from './pages/MarkAttendance';
import MyHistory from './pages/MyHistory';
import Profile from './pages/Profile';
import ManagerDashboard from './pages/ManagerDashboard';
import AllAttendance from './pages/AllAttendance';
import TeamCalendar from './pages/TeamCalendar';
import Reports from './pages/Reports';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* Employee Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                {user?.role === 'employee' ? <EmployeeDashboard /> : <ManagerDashboard />}
              </PrivateRoute>
            }
          />
          <Route
            path="/mark-attendance"
            element={
              <PrivateRoute role="employee">
                <MarkAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-history"
            element={
              <PrivateRoute role="employee">
                <MyHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute role="employee">
                <Profile />
              </PrivateRoute>
            }
          />
          
          {/* Manager Routes */}
          <Route
            path="/all-attendance"
            element={
              <PrivateRoute role="manager">
                <AllAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/team-calendar"
            element={
              <PrivateRoute role="manager">
                <TeamCalendar />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute role="manager">
                <Reports />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
