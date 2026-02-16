# Employee Attendance System

A full-stack Employee Attendance Management System with role-based access control for Employees and Managers.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Seeding Database](#seeding-database)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Demo Credentials](#demo-credentials)

## ✨ Features

### Employee Features
- ✅ Register and Login with JWT authentication
- ✅ Daily Check In / Check Out functionality
- ✅ View personal attendance history with calendar view
- ✅ Monthly attendance summary (Present, Absent, Late, Half-day)
- ✅ Interactive dashboard with statistics
- ✅ Color-coded calendar (Green: Present, Yellow: Late, Red: Absent, Orange: Half-day)
- ✅ Track total hours worked

### Manager Features
- ✅ Login and access control
- ✅ View all employees' attendance records
- ✅ Filter by employee, date range, status, and department
- ✅ Team calendar view with attendance percentage
- ✅ Export attendance reports to CSV
- ✅ Today's attendance dashboard
- ✅ Weekly trend charts
- ✅ Department-wise attendance statistics
- ✅ Late arrivals and absent employees tracking

## 🛠 Tech Stack

### Frontend
- **React** 18.2.0
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **React Calendar** for calendar views
- **Recharts** for data visualization
- **React Toastify** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **json2csv** for CSV export
- **CORS** enabled

## 📁 Project Structure

```
Tap_Academy_Project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── dashboardRoutes.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   ├── PrivateRoute.js
│   │   │   ├── Spinner.js
│   │   │   └── Spinner.css
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Auth.css
│   │   │   ├── EmployeeDashboard.js
│   │   │   ├── EmployeeDashboard.css
│   │   │   ├── MarkAttendance.js
│   │   │   ├── MarkAttendance.css
│   │   │   ├── MyHistory.js
│   │   │   ├── MyHistory.css
│   │   │   ├── Profile.js
│   │   │   ├── Profile.css
│   │   │   ├── ManagerDashboard.js
│   │   │   ├── ManagerDashboard.css
│   │   │   ├── AllAttendance.js
│   │   │   ├── AllAttendance.css
│   │   │   ├── TeamCalendar.js
│   │   │   ├── TeamCalendar.css
│   │   │   ├── Reports.js
│   │   │   └── Reports.css
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── attendanceSlice.js
│   │   │   └── store.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Tap_Academy_Project
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 🔑 Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## ▶️ Running the Application

### Method 1: Run Backend and Frontend Separately

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

#### Start Frontend
Open a new terminal:
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Method 2: Production Build

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Serve with Backend
Update backend `server.js` to serve static files and run:
```bash
cd backend
npm start
```

## 🌱 Seeding Database

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- **4 Employee accounts**
- **1 Manager account**
- **30 days of attendance records** for each employee

**Default password for all users:** `password123`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "employeeId": "EMP001",
  "department": "Engineering",
  "role": "employee"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Employee Attendance Endpoints

#### Check In
```http
POST /api/attendance/checkin
Authorization: Bearer {token}
```

#### Check Out
```http
POST /api/attendance/checkout
Authorization: Bearer {token}
```

#### Get Today's Status
```http
GET /api/attendance/today
Authorization: Bearer {token}
```

#### Get My Attendance History
```http
GET /api/attendance/my-history?month=1&year=2024
Authorization: Bearer {token}
```

#### Get My Summary
```http
GET /api/attendance/my-summary?month=1&year=2024
Authorization: Bearer {token}
```

### Manager Attendance Endpoints

#### Get All Attendance
```http
GET /api/attendance/all?startDate=2024-01-01&endDate=2024-01-31&status=present
Authorization: Bearer {token}
```

#### Get Employee Attendance
```http
GET /api/attendance/employee/:userId?month=1&year=2024
Authorization: Bearer {token}
```

#### Get Attendance Summary
```http
GET /api/attendance/summary?month=1&year=2024
Authorization: Bearer {token}
```

#### Export to CSV
```http
GET /api/attendance/export?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

#### Get Today's Status (All Employees)
```http
GET /api/attendance/today-status
Authorization: Bearer {token}
```

### Dashboard Endpoints

#### Employee Dashboard
```http
GET /api/dashboard/employee
Authorization: Bearer {token}
```

#### Manager Dashboard
```http
GET /api/dashboard/manager
Authorization: Bearer {token}
```

## 📸 Screenshots

### Employee Dashboard
The employee dashboard shows:
- Today's check-in/check-out status
- Monthly statistics (Present, Late, Absent, Total Hours)
- Last 7 days attendance overview
- Quick check-in/check-out buttons

### Manager Dashboard
The manager dashboard displays:
- Total employees count
- Today's attendance summary
- Weekly attendance trend chart
- Department-wise statistics
- Late arrivals and absent employees list

### Attendance Calendar
Interactive calendar with color-coded attendance:
- 🟢 Green: Present
- 🟡 Yellow: Late
- 🔴 Red: Absent
- 🟠 Orange: Half-day

### Reports & Export
- Generate custom reports with date range filters
- Export to CSV for external analysis
- Summary statistics for selected period

## 🔐 Demo Credentials

### Employee Accounts
1. **John Doe**
   - Email: `john@example.com`
   - Password: `password123`
   - ID: EMP001
   - Department: Engineering

2. **Jane Smith**
   - Email: `jane@example.com`
   - Password: `password123`
   - ID: EMP002
   - Department: Engineering

3. **Bob Johnson**
   - Email: `bob@example.com`
   - Password: `password123`
   - ID: EMP003
   - Department: Marketing

4. **Alice Williams**
   - Email: `alice@example.com`
   - Password: `password123`
   - ID: EMP004
   - Department: Sales

### Manager Account
- **Manager User**
  - Email: `manager@example.com`
  - Password: `password123`
  - ID: MGR001
  - Department: Management

## 🎨 Features Breakdown

### Dashboard (Employee)
- Today's attendance status
- Monthly stats with visual indicators
- Present/Absent/Late/Half-day count
- Total hours worked this month
- Last 7 days attendance with status badges
- Quick check-in/check-out actions

### Dashboard (Manager)
- Total employees overview
- Today's attendance summary
- Late arrivals today
- Absent employees list
- Weekly attendance trend (Bar chart)
- Today's distribution (Pie chart)
- Department-wise attendance

### Attendance History
- Calendar view with color coding
- Filter by month and year
- Click on date to view details
- Table view with all records
- Monthly summary cards

### Reports
- Custom date range selection
- Filter by specific employee
- Generate detailed reports
- Export to CSV
- Summary statistics
- Attendance breakdown

## 🔄 Attendance Status Logic

- **Present**: Checked in on time (before 9:30 AM)
- **Late**: Checked in after 9:30 AM
- **Half-day**: Total hours worked < 4 hours
- **Absent**: No check-in record for the day

## ⚙️ Configuration

### Customize Attendance Rules
Edit `backend/controllers/attendanceController.js`:

```javascript
// Change late arrival time (default: 9:30 AM)
const determineStatus = (checkInTime) => {
  const hour = checkInTime.getHours();
  const minutes = checkInTime.getMinutes();
  
  if (hour > 9 || (hour === 9 && minutes > 30)) {
    return 'late';
  }
  return 'present';
};

// Change half-day threshold (default: 4 hours)
if (totalHours < 4) {
  attendance.status = 'half-day';
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# macOS/Linux
sudo systemctl status mongod
```

### Port Already in Use
```bash
# Change port in .env file
PORT=5001
```

### CORS Issues
Backend CORS is enabled for all origins in development. For production, update:
```javascript
// backend/server.js
app.use(cors({
  origin: 'https://your-production-domain.com'
}));
```

