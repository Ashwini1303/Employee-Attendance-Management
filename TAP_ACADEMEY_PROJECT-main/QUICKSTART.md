# Quick Start Guide

## Employee Attendance System

### 🚀 Quick Setup (5 minutes)

#### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

#### 2. Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Frontend** - Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3. Start MongoDB
```bash
# Make sure MongoDB is running on your system
# Windows: MongoDB should be running as a service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### 4. Seed Database
```bash
cd backend
npm run seed
```

#### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### 6. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 🔑 Login Credentials

**Employee:**
- Email: john@example.com
- Password: password123

**Manager:**
- Email: manager@example.com
- Password: password123

### 📚 Key Features to Test

**As Employee:**
1. Dashboard → View today's status and monthly stats
2. Mark Attendance → Check In / Check Out
3. My History → View calendar and attendance records
4. Profile → View personal information

**As Manager:**
1. Dashboard → View team statistics and charts
2. All Attendance → Filter and search employee records
3. Team Calendar → Visual team attendance overview
4. Reports → Generate and export CSV reports

### ⚠️ Common Issues

**MongoDB not connecting:**
- Ensure MongoDB is installed and running
- Check connection string in `.env`

**Port already in use:**
- Change PORT in backend `.env`
- Or kill process on that port

**CORS errors:**
- Backend CORS is enabled for all origins in development
- Check API_URL in frontend `.env`

---

For detailed documentation, see [README.md](README.md)
