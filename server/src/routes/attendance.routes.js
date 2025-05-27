import express from 'express';
import { Parser } from 'json2csv';
import { protect, authorize } from '../middleware/auth.js';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Get all attendance records (Admin/HR only)
router.get('/',
  protect,
  authorize('Admin', 'HR'),
  async (req, res) => {
    try {
      const { startDate, endDate, status } = req.query;
      const query={};

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      const attendance = await Attendance.find(query)
        .populate('employeeId', 'name email role department position status')
        .sort('-date');
      res.json(attendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user's attendance
router.get('/me',
  protect,
  async (req, res) => {
    try {
      const attendance = await Attendance.find({ employeeId: req.user._id })
        .sort('-date')
        .populate('employeeId', 'name employeeId');
      res.json(attendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get today's attendance
router.get('/today',
  protect,
  async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendance = await Attendance.findOne({
        employeeId: req.user._id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      res.json(attendance);
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Check in
router.post('/check-in',
  protect,
  async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if already checked in today
      const existingAttendance = await Attendance.findOne({
        employeeId: req.user._id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (existingAttendance?.checkIn) {
        return res.status(400).json({ message: 'Already checked in today' });
      }

      const attendance = existingAttendance || new Attendance({
        employeeId: req.user._id,
        date: new Date(),
        checkIn: new Date()
      });

      if (!existingAttendance) {
        attendance.checkIn = new Date();
      }

      await attendance.save();
      res.json(attendance);
    } catch (error) {
      console.error('Error checking in:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Check out
router.post('/check-out',
  protect,
  async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendance = await Attendance.findOne({
        employeeId: req.user._id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (!attendance) {
        return res.status(400).json({ message: 'No check-in record found for today' });
      }

      if (attendance.checkOut) {
        return res.status(400).json({ message: 'Already checked out today' });
      }

      attendance.checkOut = new Date();
      await attendance.save();
      res.json(attendance);
    } catch (error) {
      console.error('Error checking out:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Export attendance data as CSV
router.get('/export', protect, authorize('Admin', 'HR'), async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate('employeeId', 'name email department position')
      .populate('shift', 'name');

    const attendanceData = attendanceRecords.map(record => ({
      name: record.employeeId?.name || '',
      email: record.employeeId?.email || '',
      department: record.employeeId?.department || '',
      position: record.employeeId?.position || '',
      shift: record.shift?.name || '',
      date: record.date?.toISOString().split('T')[0] || '',
      status: record.status || '',
      checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '',
      checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '',
      workHours: record.workHours || 0,
      overtimeHours: record.overtimeHours || 0,
      remarks: record.remarks || '',
      source: record.source || ''
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(attendanceData);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;