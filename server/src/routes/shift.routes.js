import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import Shift from '../models/Shift.js';

const router = express.Router();

// Get all shifts
router.get('/', protect, async (req, res) => {
  try {
    const shifts = await Shift.find()
      .populate('department', 'name')
      .populate('assignedTo', 'name email');
    res.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create shift
router.post('/',
  protect,
  authorize('Admin', 'HR'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Shift name is required'),
    body('startTime')
      .notEmpty()
      .withMessage('Start time is required'),
    body('endTime')
      .notEmpty()
      .withMessage('End time is required'),
    validateRequest
  ],
  async (req, res) => {
    try {
      const {
        name,
        type,
        startTime,
        endTime,
        gracePeriodMinutes,
        workingDays,
        department,
        assignedTo
      } = req.body;

      const shift = new Shift({
        name,
        type,
        startTime,
        endTime,
        gracePeriodMinutes,
        workingDays,
        department,
        assignedTo
      });

      await shift.save();
      res.status(201).json(shift);
    } catch (error) {
      console.error('Error creating shift:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update shift
router.put('/:id',
  protect,
  authorize('Admin', 'HR'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Shift name is required'),
    validateRequest
  ],
  async (req, res) => {
    try {
      const shift = await Shift.findById(req.params.id);
      if (!shift) {
        return res.status(404).json({ message: 'Shift not found' });
      }

      const {
        name,
        type,
        startTime,
        endTime,
        gracePeriodMinutes,
        workingDays,
        department,
        assignedTo,
        isActive
      } = req.body;

      shift.name = name;
      shift.type = type;
      shift.startTime = startTime;
      shift.endTime = endTime;
      shift.gracePeriodMinutes = gracePeriodMinutes;
      shift.workingDays = workingDays;
      shift.department = department;
      shift.assignedTo = assignedTo;
      shift.isActive = isActive;

      await shift.save();
      res.json(shift);
    } catch (error) {
      console.error('Error updating shift:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete shift
router.delete('/:id',
  protect,
  authorize('Admin'),
  async (req, res) => {
    try {
      const shift = await Shift.findById(req.params.id);
      if (!shift) {
        return res.status(404).json({ message: 'Shift not found' });
      }

      await shift.remove();
      res.json({ message: 'Shift deleted successfully' });
    } catch (error) {
      console.error('Error deleting shift:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;