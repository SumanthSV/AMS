import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import LeaveRequest from '../models/LeaveRequest.js';

const router = express.Router();

// Get all leave requests (Admin/HR only)
router.get('/',
  protect,
  authorize('Admin', 'HR'),
  async (req, res) => {
    try {
      const requests = await LeaveRequest.find()
        .populate('employeeId', 'name employeeId')
        .populate('approvedBy', 'name')
        .sort('-createdAt');
      res.json(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user's leave requests
router.get('/me',
  protect,
  async (req, res) => {
    try {
      const requests = await LeaveRequest.find({ employeeId: req.user._id })
        .populate('approvedBy', 'name')
        .sort('-createdAt');
      res.json(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Create leave request
router.post('/',
  protect,
  [
    body('type')
      .isIn(['Sick', 'Vacation', 'WFH', 'CompOff'])
      .withMessage('Invalid leave type'),
    body('reason')
      .trim()
      .notEmpty()
      .withMessage('Reason is required'),
    body('dates')
      .isArray()
      .withMessage('Dates must be an array'),
    validateRequest
  ],
  async (req, res) => {
    try {
      const { type, reason, dates } = req.body;

      const request = new LeaveRequest({
        employeeId: req.user._id,
        type,
        reason,
        dates,
        numberOfDays: dates.length
      });

      await request.save();
      res.status(201).json(request);
    } catch (error) {
      console.error('Error creating leave request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Approve leave request
router.put('/:id/approved',
  protect,
  authorize('Admin', 'HR'),
  async (req, res) => {
    try {
      const request = await LeaveRequest.findById(req.params.id);
      if (!request) {
        return res.status(404).json({ message: 'Leave request not found' });
      }

      if (request.status !== 'Pending') {
        return res.status(400).json({ message: 'Leave request already processed' });
      }

      request.status = 'Approved';
      request.approvedBy = req.user._id;
      request.approvedAt = new Date();

      await request.save();
      res.json(request);
    } catch (error) {
      console.error('Error approving leave request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Reject leave request
router.put('/:id/rejected',
  protect,
  authorize('Admin', 'HR'),
  // [
  //   body('rejectionReason')
  //     .trim()
  //     .notEmpty()
  //     .withMessage('Rejection reason is required'),
  //   validateRequest
  // ],
  async (req, res) => {
    try {
      const request = await LeaveRequest.findById(req.params.id);
      if (!request) {
        return res.status(404).json({ message: 'Leave request not found' });
      }

      if (request.status !== 'Pending') {
        return res.status(400).json({ message: 'Leave request already processed' });
      }

      request.status = 'Rejected';
      // request.rejectionReason = req.body.rejectionReason;
      request.approvedBy = req.user._id;
      request.approvedAt = new Date();

      await request.save();
      res.json(request);
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;