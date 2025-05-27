import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent', 'Half-Day'],
    default: 'Present'
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift'
  },
  workHours: {
    type: Number,
    default: 0
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number,
      accuracy: Number
    }
  },
  source: {
    type: String,
    enum: ['Biometric', 'QR', 'Manual', 'Mobile'],
    default: 'Manual'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true 
});

// Index for efficient querying by date and employee
attendanceSchema.index({ date: 1, employeeId: 1 }, { unique: true });

// Calculate work hours when check-out is recorded
attendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    // Calculate work hours
    const checkInTime = new Date(this.checkIn).getTime();
    const checkOutTime = new Date(this.checkOut).getTime();
    const diffMs = checkOutTime - checkInTime;
    const diffHrs = diffMs / (1000 * 60 * 60);
    this.workHours = parseFloat(diffHrs.toFixed(2));
  }
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;