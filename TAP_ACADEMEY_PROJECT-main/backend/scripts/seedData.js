require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Data cleared');

    // Create users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP002',
        department: 'Engineering'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP003',
        department: 'Marketing'
      },
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: 'password123',
        role: 'employee',
        employeeId: 'EMP004',
        department: 'Sales'
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'manager',
        employeeId: 'MGR001',
        department: 'Management'
      }
    ];

    const createdUsers = await User.create(users);
    console.log('Users created');

    // Create attendance records for the past 30 days
    const attendanceRecords = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }

      for (const user of createdUsers) {
        if (user.role === 'employee') {
          // Randomly determine if employee was present (90% chance)
          const isPresent = Math.random() > 0.1;

          if (isPresent) {
            // Random check-in time between 8:30 AM and 10:00 AM
            const checkInHour = 8 + Math.floor(Math.random() * 2);
            const checkInMinute = Math.floor(Math.random() * 60);
            const checkInTime = new Date(date);
            checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

            // Random check-out time between 5:00 PM and 7:00 PM
            const checkOutHour = 17 + Math.floor(Math.random() * 2);
            const checkOutMinute = Math.floor(Math.random() * 60);
            const checkOutTime = new Date(date);
            checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);

            // Determine status
            let status = 'present';
            if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
              status = 'late';
            }

            // Calculate total hours
            const diffMs = checkOutTime - checkInTime;
            const totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

            // Update status to half-day if less than 4 hours
            if (totalHours < 4) {
              status = 'half-day';
            }

            attendanceRecords.push({
              userId: user._id,
              date,
              checkInTime,
              checkOutTime,
              status,
              totalHours
            });
          } else {
            attendanceRecords.push({
              userId: user._id,
              date,
              status: 'absent',
              totalHours: 0
            });
          }
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log('Attendance records created');

    console.log('\n=== Seed Data Summary ===');
    console.log('Users created:');
    console.log('- Employees: 4');
    console.log('- Managers: 1');
    console.log('- Default password for all users: password123');
    console.log('\nEmployee accounts:');
    console.log('1. john@example.com (EMP001 - Engineering)');
    console.log('2. jane@example.com (EMP002 - Engineering)');
    console.log('3. bob@example.com (EMP003 - Marketing)');
    console.log('4. alice@example.com (EMP004 - Sales)');
    console.log('\nManager account:');
    console.log('1. manager@example.com (MGR001 - Management)');
    console.log(`\nAttendance records: ${attendanceRecords.length}`);
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
