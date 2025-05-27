import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['Admin', 'Employee', 'HR'],
    default: 'Employee'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  employeeId: {
    type: String,
    unique: true
  },
  position: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  profilePicture: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { 
  timestamps: true 
});

// Encrypt password before save
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate employee ID before saving new employee
userSchema.pre('save', function(next) {
  if (this.isNew && this.role === 'Employee' && !this.employeeId) {
    // Generate employee ID: EMP-YYYY-XXXX
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    this.employeeId = `EMP-${year}-${randomDigits}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;