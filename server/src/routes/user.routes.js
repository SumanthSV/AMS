import express from 'express';
import { Parser } from 'json2csv'; 
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import User from '../models/User.js';




const router = express.Router();

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('department', 'name');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Create new user (Admin/HR only)
router.post('/',
  protect,
  authorize('Admin', 'HR'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validateRequest
  ],
  async (req, res) => {
    try {
      const { name, email, password, role, department, position, status } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const newUser = new User({
        name,
        email,
        password, // make sure your User model hashes it with pre-save hook
        role,
        department,
        position,
        status
      });

      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all users (Admin/HR only)
router.get('/',
  protect,
  authorize('Admin', 'HR'),
  async (req, res) => {
    try {
      const { role } = req.query;
      const query = role ? { role: { $in: Array.isArray(role) ? role : [role] } } : {};
      
      const users = await User.find(query)
        .select('-password')
        .populate('department', 'name');
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Export users as CSV
router.get('/export', protect, authorize('Admin', 'HR'), async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role department position status') // select fields you want
      .populate('department', 'name');

    // Prepare data for CSV
    const usersData = users.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department ? user.department.name : '',
      position: user.position,
      status: user.status
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(usersData);

    res.header('Content-Type', 'text/csv');
    res.attachment('employees.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id',
  protect,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('department', 'name');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update user
router.put('/:id',
  protect,
  authorize('Admin', 'HR'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    validateRequest
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { name, email, role, department, position, status } = req.body;

      // Check if email already exists (excluding current user)
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      user.name = name;
      user.email = email;
      user.role = role;
      user.department = department;
      user.position = position;
      user.status = status;

      await user.save();
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete user
router.delete('/:id',
  protect,
  authorize('Admin'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.remove();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


export default router;